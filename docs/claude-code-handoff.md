# Claude Code handoff

## Authority

Claude implements only a founder-approved written task. The active product is
the web/PWA in `apps/web` with an optional Cloudflare Worker in `apps/worker`.
Read the active architecture, cost/security policies and task brief before
editing. Archived native experiments are not task authority.

## Required handoff

Every task names exact files, interfaces, synthetic-data boundary, Cloudflare
resource/binding authority, acceptance tests, security/privacy/cost impact,
rollback path and stop conditions. A missing provider, data field, route,
credential, cost, region, auth method or release permission stops the task.

## Evidence

The PR reports exact format, lint, typecheck, test, build, secret/dependency
scan, browser and Wrangler results. It never claims hosted or production
evidence that was not run. Documentation and ADRs are updated in the same
change when a web/platform decision changes.
