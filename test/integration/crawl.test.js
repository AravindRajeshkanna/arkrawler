import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createClient } from 'redis';
import { randomUUID } from 'node:crypto';

import { config } from '../../lib/config.js';

// End-to-end check of crawler.js: crawl a known local page and confirm the
// links it contains land in Redis. Runs against a real Redis instance (see
// REDIS_URL) but never touches the network — the crawl target is a
// throwaway local HTTP server. Uses a randomly-named Redis set (SEEDS_KEY)
// so it's safe to run against a Redis instance also used for development,
// and cleans that key up afterwards.

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const seedsKey = `arkrawler:test:${randomUUID()}`;

const DISCOVERED_LINKS = [
    'http://discovered-one.arkrawler.test',
    'http://discovered-two.arkrawler.test',
];

const PAGE_HTML = `<html><body>
  <a href="${DISCOVERED_LINKS[0]}">one</a>
  <a href="${DISCOVERED_LINKS[1]}">two</a>
  <a href="/relative-link-should-be-ignored">relative</a>
</body></html>`;

let server;
let seedUrl;
let client;
let redisAvailable = false;

before(async () => {
    server = createServer((_req, res) => {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(PAGE_HTML);
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    seedUrl = `http://127.0.0.1:${server.address().port}/`;

    client = createClient({
        url: config.redisUrl,
        // Fail fast instead of retrying forever if Redis isn't reachable,
        // so this test can skip cleanly rather than hang.
        socket: { connectTimeout: 1000, reconnectStrategy: false },
    });
    client.on('error', () => {});
    try {
        await client.connect();
        redisAvailable = true;
    } catch {
        redisAvailable = false;
    }
});

after(async () => {
    await new Promise((resolve) => server.close(resolve));
    if (redisAvailable) {
        await client.del(seedsKey);
        await client.quit();
    }
});

test('crawler.js crawls a seeded URL and stores discovered links in redis', async (t) => {
    if (!redisAvailable) {
        t.skip(`Redis is not reachable at ${config.redisUrl}; skipping integration test`);
        return;
    }

    await client.sAdd(seedsKey, seedUrl);

    const child = spawn(process.execPath, ['crawler.js'], {
        cwd: projectRoot,
        env: {
            ...process.env,
            REDIS_URL: config.redisUrl,
            SEEDS_KEY: seedsKey,
            PAGES_PER_RUN: '1',
            MAX_CONNECTIONS: '1',
        },
        stdio: 'pipe',
    });

    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));

    const [exitCode] = await new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('exit', (code) => resolve([code]));
    });

    assert.equal(exitCode, 0, `crawler.js exited with ${exitCode}, output:\n${output}`);

    const members = await client.sMembers(seedsKey);
    for (const link of DISCOVERED_LINKS) {
        assert.ok(members.includes(link), `expected ${link} to be discovered, got: ${members}`);
    }
    assert.ok(
        !members.some((m) => m.includes('relative-link-should-be-ignored')),
        'relative links should not be stored',
    );
});
