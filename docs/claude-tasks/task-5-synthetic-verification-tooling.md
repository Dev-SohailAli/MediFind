# Task 5: Add repeatable synthetic verification and evidence tooling

## Goal

Give coding agents one safe local command that applies the reviewed synthetic
migration, verifies row counts/foreign keys/projection exclusion, and prints a
machine-readable evidence summary without requiring Cloudflare authentication.

## Authority and exact scope

Read `docs/local-synthetic-development.md`,
`docs/task-4-synthetic-d1-data-contract-proposal.md`,
`docs/test-and-acceptance-strategy.md`, and
`docs/infrastructure-and-release-blueprint.md`.

Allowed files:

- Add `apps/worker/scripts/verify-synthetic-local.mjs`.
- Modify `apps/worker/package.json` to add `verify:local`.
- Add focused tests for the verifier or its pure output/command guards.
- Update `docs/local-synthetic-development.md` with the exact command and
  output fields.

## Command contract

`pnpm --filter @medifind/worker verify:local` must:

1. Use `wrangler.local.toml` and `--local` only.
2. Apply the reviewed migration idempotently or report the existing local
   migration state safely.
3. Query the six expected tables and check the exact counts 7, 4, 4, 8, 7,
   and 31.
4. Check `PRAGMA foreign_key_check` and the excluded stale listing.
5. Validate the export manifest/checksums against repository files.
6. Print JSON with `environment: "local-synthetic"`, migration name,
   rowCounts, foreignKeyViolations, excludedProjectionCount,
   exportChecksumsValid and `remote: false`.

The script must fail closed if its argument list includes `--remote`, if the
config path is not the local config, or if a required count/checksum differs.
It must not read credentials, contact an external provider, or write evidence
files into Git.

## Acceptance

- A fresh machine with installed dependencies can run the command after the
  documented local setup.
- The output is stable enough for CI logs and contains no raw query text,
  secret, provider token or real data.
- A deliberately altered count, checksum, migration path or remote flag fails
  with a safe actionable error.
- Local Worker integration tests and all repository checks pass.

Commit: `test: add synthetic environment verification command`

For exact command, helper, negative-case and local-D1 verification steps, use
the [Task 5 implementation plan](../superpowers/plans/2026-08-18-task-5-synthetic-verification-implementation.md).
