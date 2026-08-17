# First synthetic web foundation test specification

## Required checks

The first foundation PR must run format, lint, typecheck, unit tests, web build,
secret scanning, dependency audit and filesystem/security checks. It must use
the frozen lockfile and must not require a Cloudflare account or external
service.

## Boundary checks

Tests must verify the active workspace contains only `apps/web`, `apps/worker`,
`packages/contracts` and `packages/config`; the archived prototype is outside
the workspace; no route/binding/provider is active; and no real or realistic
domain fixture exists.

## Failure policy

Malformed tool output, unexpected dependency findings, secret-like content,
network capability, direct browser storage access or a native/superseded
platform dependency fails the task. No hosted or production result may be
claimed from this local foundation task.
