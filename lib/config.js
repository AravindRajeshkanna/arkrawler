import { fileURLToPath } from 'node:url';

const DEFAULT_SEED_FILE = fileURLToPath(new URL('../seed.json', import.meta.url));

/**
 * Builds runtime configuration from environment variables, falling back to
 * sane defaults for local development. Accepts an explicit env object so it
 * stays easy to unit test.
 */
export function getConfig(env = process.env) {
    return {
        redisUrl: env.REDIS_URL || 'redis://127.0.0.1:6379',
        seedFile: env.SEED_FILE || DEFAULT_SEED_FILE,
        pagesPerRun: Number(env.PAGES_PER_RUN) || 1000,
        maxConnections: Number(env.MAX_CONNECTIONS) || 100,
    };
}

export const config = getConfig();
