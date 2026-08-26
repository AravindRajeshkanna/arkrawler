import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getConfig } from '../lib/config.js';

test('getConfig falls back to defaults when env vars are unset', () => {
    const result = getConfig({});
    assert.equal(result.redisUrl, 'redis://127.0.0.1:6379');
    assert.equal(result.pagesPerRun, 1000);
    assert.equal(result.maxConnections, 100);
    assert.ok(result.seedFile.endsWith('seed.json'));
});

test('getConfig honours environment overrides', () => {
    const result = getConfig({
        REDIS_URL: 'redis://example.com:6380',
        SEED_FILE: '/tmp/custom-seed.json',
        PAGES_PER_RUN: '50',
        MAX_CONNECTIONS: '5',
    });
    assert.equal(result.redisUrl, 'redis://example.com:6380');
    assert.equal(result.seedFile, '/tmp/custom-seed.json');
    assert.equal(result.pagesPerRun, 50);
    assert.equal(result.maxConnections, 5);
});
