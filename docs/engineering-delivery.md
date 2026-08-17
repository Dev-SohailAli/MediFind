# Web engineering delivery

## Stack direction

Build one TypeScript React/Vite web application/PWA in `apps/web`. Host the
static build on Cloudflare Pages. Future server logic belongs in the
server-only Cloudflare Worker package and accesses D1/R2/KV only through
approved bindings. Keep contracts in `packages/contracts`.

No native client, Firebase/GCP service, store packaging, analytics SDK,
direct-browser database access or production capability is part of the active
stack.

## Delivery controls

Use task branches and PRs. The quality workflow runs format, lint, typecheck,
tests, build, secret/dependency scans and relevant browser/Worker checks.
Cloudflare deployments are founder-approved, environment-specific and never
driven by committed secrets.

## Quality expectations

Keep accessibility, safe states, error redaction, quota failure, authorization,
rate limits, idempotency, audit boundaries and offline safety in scope as each
feature is added. Synthetic fixtures remain the only data until the documented
legal/privacy/security/operational gates are complete.
