import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';

import { extractAbsoluteLinks } from '../lib/links.js';

test('extractAbsoluteLinks returns only absolute http(s) links, deduplicated', () => {
    const $ = cheerio.load(`
        <a href="http://example.com">a</a>
        <a href="https://example.com/page">b</a>
        <a href="http://example.com">duplicate</a>
        <a href="/relative">relative</a>
        <a href="mailto:test@example.com">mail</a>
    `);

    const links = extractAbsoluteLinks($);

    assert.deepEqual(links, ['http://example.com', 'https://example.com/page']);
});

test('extractAbsoluteLinks returns an empty array when there are no links', () => {
    const $ = cheerio.load('<p>no links here</p>');
    assert.deepEqual(extractAbsoluteLinks($), []);
});
