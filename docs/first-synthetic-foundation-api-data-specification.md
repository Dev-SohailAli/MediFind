# First synthetic web foundation API/data specification

## Boundary

The first foundation task establishes a web-only TypeScript workspace and
Cloudflare-ready package boundaries. It creates no external account, Worker
route, D1/R2/KV binding, authentication, secret or domain data.

## Approved packages

```text
apps/web       responsive web/PWA shell
apps/worker    server-only Cloudflare Worker boundary, no active route yet
packages/contracts
packages/config
```

The archived native prototype is outside the workspace and is not a build or
dependency target.

## Data boundary

There is zero domain data, zero persistence schema, zero network call and zero
provider SDK in this task. Fixtures, if needed, are invented and local-only.
No auth/session/role/prescription/reservation implementation is allowed.

## Acceptance

The repository quality suite passes, package boundaries are tested, the web
build is reproducible and source scans show no native platform, superseded
cloud provider, credential, secret, direct storage access or real data.
