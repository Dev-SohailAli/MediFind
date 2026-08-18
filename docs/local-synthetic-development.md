# Local synthetic development

This repository now includes a local-only Worker and D1 path for development.
It contains only the reviewed invented Task 4 search records. It is not a
Cloudflare account, hosted database, protected environment, or production
deployment.

## Start the local Worker

From the repository root:

```powershell
$env:XDG_CONFIG_HOME = "$PWD/.wrangler-config"
pnpm --filter @medifind/worker d1:apply
pnpm --filter @medifind/worker dev
```

The Worker listens on `http://127.0.0.1:8787` and exposes only the approved
read routes:

- `GET /v1/health`
- `GET /v1/search`
- `GET /v1/listings/{id}`

Wrangler stores the local D1 state below `.wrangler/`, which is ignored by
Git. Re-run `d1:apply` after clearing local state or changing the migration.

## Run the web app against the local Worker

Keep the Worker running in one terminal, then use a second terminal:

```powershell
$env:VITE_MEDIFIND_SEARCH_MODE = 'worker'
pnpm --filter @medifind/web dev
```

The default web build does not set this variable and remains fixture-backed,
offline-safe, and free of runtime API calls. The opt-in mode uses the Vite
development proxy and never gives the browser direct D1 access.

## Safety boundary

Do not add real buyer, pharmacy, medicine, contact, health, prescription or
production data to the local database. Do not use `--remote` with these local
commands. A hosted synthetic database requires a separate Cloudflare account,
binding, cost and release record.
