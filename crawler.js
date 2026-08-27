import Crawler from 'crawler';
import { createClient } from 'redis';

import { config } from './lib/config.js';
import { extractAbsoluteLinks } from './lib/links.js';

const client = createClient({ url: config.redisUrl });
client.on('error', (err) => console.error('Redis Client Error', err));

let crawledPageCount = 0;

function exitWhenDone() {
    if (crawledPageCount >= config.pagesPerRun) {
        client.quit().finally(() => process.exit(0));
    }
}

const crawlerInstance = new Crawler({
    maxConnections: config.maxConnections,
    // Called for each crawled page.
    callback(error, res, done) {
        if (error) {
            console.error(error);
            done();
            return;
        }

        const $ = res.$;
        crawledPageCount++;
        console.log(`page count:${crawledPageCount}`);

        // $ is only Cheerio-wrapped for HTML responses, not raw resources (images, etc).
        if (typeof $ === 'function') {
            const absoluteLinks = extractAbsoluteLinks($);
            if (absoluteLinks.length) {
                client
                    .sAdd(config.seedsKey, absoluteLinks)
                    .then((added) => console.log(`seeds added:${added}`))
                    .catch((err) => console.error('Failed to store discovered seeds:', err));
            }
        }

        done();
        exitWhenDone();
    },
});

async function main() {
    await client.connect();
    const seeds = await client.sRandMemberCount(config.seedsKey, config.pagesPerRun);
    if (!seeds.length) {
        console.log('No seed URLs available in redis; exiting.');
        await client.quit();
        return;
    }
    crawlerInstance.add(seeds);
}

main().catch((err) => {
    console.error('Failed to start crawl run:', err);
    process.exit(1);
});
