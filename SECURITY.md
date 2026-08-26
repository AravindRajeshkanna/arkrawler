# Security Policy

## Supported Versions

This project is a small, actively maintained utility. Only the latest
version on the `main` branch receives security fixes.

| Version             | Supported |
| ------------------- | --------- |
| latest (`main`)     | ✅        |
| older tags/releases | ❌        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, report it privately using
[GitHub Security Advisories](https://github.com/AravindRajeshkanna/arkrawler/security/advisories/new)
for this repository. This creates a private discussion with the maintainer
and, where applicable, lets us coordinate a fix and disclosure timeline
before details become public.

Please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof of concept
- Any relevant logs, configuration, or environment details

## What to expect

- We will acknowledge new reports as soon as reasonably possible.
- We will investigate and, if confirmed, work on a fix and coordinate a
  disclosure timeline with you.
- Once a fix is released, we will credit reporters who wish to be credited.

## Scope notes

`arkrawler` fetches arbitrary third-party URLs by design (it's a web
crawler) and stores discovered URLs in Redis. Reports about the crawler
following malicious or unexpected URLs are welcome if they demonstrate a
concrete vulnerability in this codebase (for example, command/argument
injection, path traversal via `SEED_FILE`, or a Redis injection issue) —
general "the internet contains bad URLs" reports are expected behavior for
a crawler, not a vulnerability in this project. If you deploy this crawler,
run it with least-privilege network/file-system access and treat crawled
content as untrusted input.
