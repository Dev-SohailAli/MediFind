# Monorepo and toolchain policy

## Repository shape

MediFind is a web-only TypeScript monorepo:

```text
apps/
  web/          # Responsive React web application/PWA
  worker/       # Server-only Cloudflare Worker boundary
packages/
  contracts/    # Versioned safe contracts shared by web and Worker
  config/       # Non-secret shared lint/type/build configuration
archive/
  legacy-mobile-prototype/  # Historical, outside the workspace; do not extend
```

Additional applications, providers or packages require an approved task and an
ADR explaining the ownership, data and deployment boundary.

## Boundary rules

- `apps/web` contains the browser experience and synthetic fixtures. It must
  not import Worker code, server credentials, database clients or secrets.
- `apps/worker` owns future server validation, authorization, rate limits,
  mutations, D1/R2/KV access, audit events and safe error mapping. It is not a
  client package and must not expose provider credentials.
- `packages/contracts` contains safe versioned types/schemas only. It contains
  no direct database access, secret, fixture data or client-trusted role.
- `archive/` is not included in the pnpm workspace and is not a build target.
- There is no mobile/native package and no Firebase/GCP compatibility package.

## Reproducible toolchain

- Use pnpm workspaces with a committed lockfile and frozen installs in CI.
- Pin the Node.js and pnpm versions in repository configuration.
- Keep Cloudflare CLI/configuration changes in the task that owns the relevant
  Pages, Worker or binding. Never commit account tokens or environment secrets.
- A fresh clone must reproduce format, lint, typecheck, test and build checks
  without copying developer-local files.

## Delivery rules

The web static build and future Worker deployment remain independently
reviewable. Contract changes require web and Worker checks. A provider change
must include its cost, data, export, rollback and failure-mode evidence.
