import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { createClient } from 'redis';

import { config } from './lib/config.js';
import { loadSeedUrls } from './lib/seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Loads the seed URL list and stores it in the shared `seeds` Redis set so
 * crawler.js has somewhere to start from.
 */
async function seedRedis(client) {
    const urls = await loadSeedUrls(config.seedFile);
    const added = await client.sAdd(config.seedsKey, urls);
    console.log(`redis init: added ${added} new seed URL(s)`);
}

/**
 * Runs crawler.js as a child process and respawns it whenever it exits, so a
 * single crawl batch (see PAGES_PER_RUN) keeps the whole crawl going.
 */
function spawnCrawler() {
    const child = spawn(process.execPath, ['crawler.js'], {
        cwd: __dirname,
        stdio: 'inherit',
    });
    child.on('exit', (code, signal) => {
        console.log(`crawler.js exited (code=${code}, signal=${signal}), respawning...`);
        spawnCrawler();
    });
    return child;
}

async function main() {
    const client = createClient({ url: config.redisUrl });
    client.on('error', (err) => console.error('Redis Client Error', err));

    await client.connect();
    await seedRedis(client);
    await client.quit();

    spawnCrawler();
}

main().catch((err) => {
    console.error('Failed to start crawler:', err);
    process.exit(1);
});
