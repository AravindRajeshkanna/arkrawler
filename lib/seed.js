import { readFile } from 'node:fs/promises';

/**
 * Reads and parses the seed URL JSON file. Kept separate from the Redis
 * write so the parsing logic can be unit tested with a small fixture
 * instead of the full multi-megabyte seed.json.
 */
export async function loadSeedUrls(seedFilePath) {
    const data = await readFile(seedFilePath, 'utf8');
    return JSON.parse(data);
}
