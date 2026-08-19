# Task 1: Complete the isolated synthetic Cloudflare environment

## Goal

Apply the reviewed Task 4 migration to the already-created synthetic D1
database, deploy the read-only Worker, verify its public routes, and record
reproducible evidence. This is the only task in the queue that mutates an
external Cloudflare environment.

## Authority and exact scope

Read `docs/task-4-synthetic-cloudflare-environment-brief.md`,
`docs/infrastructure-and-release-blueprint.md`,
`docs/cost-and-environment-plan.md`, and `docs/security-architecture-threat-model.md`.

Allowed changes:

- `apps/worker/wrangler.toml`: bind only the approved synthetic D1.
- `docs/infrastructure-and-release-blueprint.md`: record successful evidence.
- No credentials, tokens, `.env` files, remote data exports, Pages settings,
  secrets, authentication, R2, KV, queues or production configuration.

Known resource: D1 `medifind-synthetic-search`, database ID
`cb372f8c-ce1d-4443-bc72-dec144bf4dfa`. Worker name:
`medifind-synthetic-worker`.

## Required execution

1. Stop if the Cloudflare session is not freshly authenticated. Reauthenticate
   first, then run `wrangler whoami` and confirm the founder-owned account.
2. Add only the `DB` D1 binding to the synthetic Worker config. Keep the local
   binding in `wrangler.local.toml` unchanged.
3. Run the Worker dry-run and inspect the binding list before any deploy.
4. Apply `migrations/0001_task4_synthetic_search.sql` remotely with Wrangler.
5. Query the remote database for the six expected row counts, foreign-key
   violations, and zero projection rows for the excluded stale listing.
6. Deploy the Worker only after the dry-run and cost boundary pass.
7. Verify `GET /v1/health`, a known synthetic search, a known listing detail,
   invalid query input, missing listing anti-enumeration, and unavailable/error
   mapping where it can be safely simulated.
8. Record the exact Worker URL, D1 ID/name, migration revision, commit,
   timestamp, row counts, route responses, rollback command and residual risk.

## Acceptance

- Remote D1 contains only the reviewed synthetic export: 7 concepts, 4
  organisations, 4 branches, 8 listings, 7 projections and 31 search terms.
- `PRAGMA foreign_key_check` returns no rows and the excluded stale listing has
  no public projection.
- Worker responses contain only the approved public fields and safe errors.
- No route accepts a body, caller role, arbitrary SQL, arbitrary table, or
  direct D1 access.
- The blueprint does not claim any result that was not actually observed.

## Evidence and delivery

Run the repository quality suite plus the relevant Wrangler commands. Do not
run `--remote` before reauthentication. If auth, cost, region, binding, or
response evidence is missing, stop and report the blocker without changing
the Worker or D1.

Commit: `ops: verify synthetic cloudflare environment`

Rollback is export verification followed by Worker deletion and then D1
deletion only if the founder explicitly requests teardown; never delete data
as a normal rollback.
