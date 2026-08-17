# Repository security and web delivery

## Source controls

Use task branches and reviewable pull requests. Keep `main` protected and
require the quality workflow before merge. Do not use GitHub issues, PR bodies,
logs or comments for credentials, private support correspondence or real data.

## CI controls

CI installs the frozen pnpm lockfile and runs format, lint, typecheck, tests,
build, secret scanning, dependency audit and filesystem/security checks. It
does not deploy Cloudflare or access production data by default.

If a future Worker deployment is automated, use a founder-approved short-lived
Cloudflare deployment credential stored in the environment, restricted to the
intended project and branch. Never commit an API token or account secret.

## Delivery evidence

Every PR records changed interfaces, synthetic-data status, browser/Worker
verification, security/privacy/cost impact, rollback path and residual risks.
The static Pages preview is not production and must not be described as a
protected pilot.
