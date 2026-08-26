import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

import { loadSeedUrls } from '../lib/seed.js';

const fixture = fileURLToPath(new URL('./fixtures/seed-sample.json', import.meta.url));

test('loadSeedUrls parses a JSON array of URLs', async () => {
    const urls = await loadSeedUrls(fixture);
    assert.deepEqual(urls, ['http://example.com', 'http://example.org', 'http://example.net']);
});

test('loadSeedUrls rejects when the file does not exist', async () => {
    await assert.rejects(() => loadSeedUrls('/nonexistent/seed.json'));
});
