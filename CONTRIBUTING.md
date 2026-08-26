# Contributing to arkrawler

Thanks for taking the time to contribute! This document covers how to get a
working dev setup and the expectations for pull requests.

## Code of Conduct

By participating in this project you agree to abide by the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Getting started

1. Fork the repository and clone your fork.
2. Install [Node.js](https://nodejs.org/) 22+ (see [.nvmrc](.nvmrc)) and a
   local [Redis](https://redis.io/) server.
3. Install dependencies:
    ```sh
    npm install
    ```
4. Copy `.env.example` to `.env` and adjust if needed.

See [README.md](README.md) for how to run the crawler.

## Making changes

- Create a branch off `main` for your change:
  `git checkout -b feature/short-description`.
- Keep changes focused; unrelated fixes should be a separate pull request.
- Add or update tests in [test/](test/) for any behavior change: unit tests
  for pure logic in [lib/](lib/), or the integration test in
  [test/integration/](test/integration/) for changes to the crawl flow
  itself.
- Run the checks below before opening a pull request:
    ```sh
    npm run lint
    npm run format:check
    npm test               # unit tests, no external deps
    npm run test:integration  # requires a local Redis; see README
    ```
- Use clear, descriptive commit messages that explain _why_ a change was
  made, not just what changed.

## Pull requests

- Target the `main` branch.
- Describe what changed and why, and call out any manual testing you did
  (for example, running the crawler end-to-end against a local Redis).
- Link any related issues.
- CI (see [.github/workflows/ci.yml](.github/workflows/ci.yml)) runs lint,
  formatting, unit tests, and the integration test automatically on every
  pull request — make sure it's green before requesting review.
- Be responsive to review feedback; a maintainer will merge once the change
  is approved and checks pass.

## Reporting bugs and requesting features

Please open a [GitHub issue](https://github.com/AravindRajeshkanna/arkrawler/issues)
with as much detail as possible (steps to reproduce, expected vs. actual
behavior, environment). For security vulnerabilities, see
[SECURITY.md](SECURITY.md) instead of opening a public issue.

## AI-assisted contributions

AI coding tools are welcome for drafting changes, but you are responsible
for reviewing, testing, and understanding everything you submit. See
[AI_USAGE.md](AI_USAGE.md) for this project's disclosure and expectations
around AI-assisted contributions.
