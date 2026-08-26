# AI Usage

This document discloses how AI tools are used in this project and sets
expectations for AI-assisted contributions.

## Disclosure

Parts of this project have been developed with the assistance of an AI
coding agent (Anthropic's Claude Code). Specifically, an AI agent was used
to help with:

- Modernizing `index.js` and `crawler.js` (ESM conversion, current
  `redis`/`crawler` package APIs, error handling, environment-based
  configuration)
- Adding a unit test suite, ESLint/Prettier tooling, and related config
- Drafting this project's community/governance documents (this file,
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `NOTICE`,
  `CITATION.cff`, `LICENSE`, and `README.md` updates)
- Upgrading dependencies (`crawler`, `redis`) and verifying the result with
  linting, the test suite, and a live end-to-end run against a local Redis
  instance

All AI-assisted changes were reviewed by a human maintainer before being
committed, including running the linter, the test suite, and a manual
smoke test of the crawl loop against a real Redis instance and live URLs.

## Expectations for contributors

- You may use AI tools to help write code, tests, or documentation for this
  project.
- You are fully responsible for any contribution you submit, AI-assisted or
  not: review the generated diff, understand what it does, and verify it
  (tests, linting, manual testing where relevant) before opening a pull
  request.
- Do not submit AI-generated content you have not reviewed. Do not paste
  secrets, credentials, or other sensitive data into third-party AI tools.
- Clearly written, correct, well-tested code is what matters here,
  regardless of how it was drafted.

## Scope

This disclosure covers the use of AI tools in writing and maintaining the
_code and documentation_ in this repository. It does not describe or
endorse any particular AI provider, and using AI tools is not a requirement
to contribute.
