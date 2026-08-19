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

## Verify the local synthetic environment

From the repository root:

```powershell
pnpm --filter @medifind/worker verify:local
```

This command is local-only and requires no Cloudflare account, login, token
or `--remote` flag of any kind. It uses only `wrangler.local.toml` and
`--local`. It takes no arguments — passing any argument (including
`--remote`) is rejected before anything runs.

It applies the reviewed Task 4 migration idempotently (only if the six
expected tables are entirely absent from the local database; otherwise it
verifies the existing local state without applying, dropping or resetting
anything), then checks:

- The exact six expected table row counts.
- `PRAGMA foreign_key_check` reports no violations.
- The deliberately stale/excluded `excludex-solandra-ineligible` listing
  stays out of `public_search_projection` and `public_search_terms`.
- The committed export manifest and per-file SHA-256 checksums under
  `apps/worker/exports/task-4-synthetic-d1-export-v1/` match the repository
  exactly.

On success it prints one JSON summary and exits `0`, with no other output.
Only these fields are ever printed — never raw SQL, CLI output, database
IDs, config paths, timestamps or row values:

```json
{
  "environment": "local-synthetic",
  "migrationName": "0001_task4_synthetic_search.sql",
  "rowCounts": {
    "medicine_concepts": 7,
    "pharmacy_organisations": 4,
    "pharmacy_branches": 4,
    "medicine_listings": 8,
    "public_search_projection": 7,
    "public_search_terms": 31
  },
  "foreignKeyViolations": [],
  "excludedProjectionCount": 0,
  "exportChecksumsValid": true,
  "remote": false
}
```

A deliberately altered row count, checksum, or an incomplete/unexpected
local schema fails closed: the command exits nonzero and prints only a
short, safe, actionable message to stderr — never the underlying SQL,
Wrangler output or file contents. It never writes an evidence file into the
repository.

## Safety boundary

Do not add real buyer, pharmacy, medicine, contact, health, prescription or
production data to the local database. Do not use `--remote` with these local
commands. A hosted synthetic database requires a separate Cloudflare account,
binding, cost and release record.
