# arkrawler

A small Node.js web crawler that starts from a list of ~1,000,000 seed URLs
([seed.json](seed.json)), stores the frontier in Redis, and keeps crawling by
respawning a worker process that pulls a random batch of URLs, fetches them,
extracts outbound links, and feeds them back into the seed set.

## How it works

- [index.js](index.js) loads `seed.json` into a Redis set (`seeds`), then
  spawns [crawler.js](crawler.js) as a child process and respawns it every
  time it exits, so the crawl continues indefinitely.
- [crawler.js](crawler.js) pulls a random batch of URLs out of the `seeds`
  set, crawls them with [`crawler`](https://www.npmjs.com/package/crawler),
  parses each page with Cheerio, and adds every absolute `http(s)` link it
  finds back into `seeds`. Once it has crawled `PAGES_PER_RUN` pages it exits
  cleanly, which triggers the next respawn from `index.js`.
- [lib/config.js](lib/config.js) and [lib/links.js](lib/links.js) hold the
  small, dependency-light pieces of logic that are covered by unit tests in
  [test/](test/).

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later (see [.nvmrc](.nvmrc) /
  [package.json](package.json) `engines`)
- A running [Redis](https://redis.io/) server (v5+ recommended)

## Setup

```sh
npm install
```

Configuration is read from environment variables (see
[.env.example](.env.example) for the full list and defaults):

```sh
cp .env.example .env
# edit .env if you need to point at a non-default Redis instance, etc.
```

## Usage

```sh
npm start
# or, to load .env automatically:
node --env-file=.env index.js
```

This seeds Redis from `seed.json` and starts the crawl loop. Stop it with
`Ctrl+C`.

| Variable          | Default                  | Description                                    |
| ----------------- | ------------------------ | ---------------------------------------------- |
| `REDIS_URL`       | `redis://127.0.0.1:6379` | Redis connection string                        |
| `SEED_FILE`       | `./seed.json`            | Path to the seed URL JSON file                 |
| `PAGES_PER_RUN`   | `1000`                   | Pages crawled per `crawler.js` run before exit |
| `MAX_CONNECTIONS` | `100`                    | Max concurrent HTTP connections while crawling |

## Development

```sh
npm test          # run the unit test suite (node:test)
npm run lint       # lint with ESLint
npm run format      # format with Prettier
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution workflow.

## Project docs

- [CONTRIBUTING.md](CONTRIBUTING.md) — how to propose changes
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) — community standards
- [SECURITY.md](SECURITY.md) — how to report a vulnerability
- [AI_USAGE.md](AI_USAGE.md) — how AI assistance is used and disclosed in this project
- [NOTICE](NOTICE) — third-party attributions
- [CITATION.cff](CITATION.cff) — how to cite this software
- [LICENSE](LICENSE) — ISC license
