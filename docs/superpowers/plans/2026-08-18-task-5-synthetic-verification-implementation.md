# Task 5 Synthetic Verification Tooling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one repeatable local-only command that verifies the reviewed synthetic D1 migration, exact six-table counts, foreign-key/projection exclusion, export checksums and safe machine-readable evidence without Cloudflare authentication.

**Architecture:** `apps/worker/scripts/verify-synthetic-local.mjs` is a fixed-command executable that invokes Wrangler only with `wrangler.local.toml` and `--local`. Pure helpers validate parsed Wrangler rows and the committed logical export; the command applies the migration only when all expected tables are absent, verifies an already-initialized local database idempotently, and prints one redacted JSON summary. No remote or hosted path is reachable.

**Tech Stack:** Node.js 24, Wrangler 4, local D1/SQLite, Web Crypto/Node `crypto`, Vitest 4, pnpm workspace scripts.

**Spec:** `docs/claude-tasks/task-5-synthetic-verification-tooling.md`, `docs/local-synthetic-development.md`, `docs/task-4-synthetic-d1-data-contract-proposal.md`, `docs/test-and-acceptance-strategy.md`, `docs/infrastructure-and-release-blueprint.md`.

## Global Constraints

- The only supported environment is `environment: "local-synthetic"`; output must contain `remote: false`.
- Every Wrangler invocation must use `wrangler.local.toml`, `--local`, the fixed local database name and no `--remote`.
- Reject all user-supplied arguments for this no-argument command, especially `--remote`, `--config`, account IDs, database IDs and arbitrary SQL.
- Never read credentials, contact an external provider, print raw Wrangler output/SQL/paths, or write evidence files into Git.
- Verify exactly six tables with counts 7, 4, 4, 8, 7 and 31; no unapproved table/column/fixture may be accepted silently.
- Check foreign-key integrity and ensure `excludex-solandra-ineligible` remains in `medicine_listings` but has zero projection and search-term rows.
- Preserve the committed export manifest, JSONL ordering, row counts and SHA-256 checksums; fail closed on drift.
- Keep the verifier operationally local; do not add Worker routes, browser code, runtime bindings, mutations, auth or production capability.
- Work in an isolated task branch/worktree and preserve the current user-owned dirty worktree.

---

### Task 1: Define pure verification contracts and fail-closed command tests

**Files:**
- Create: `apps/worker/scripts/verify-synthetic-local.mjs`
- Create: `apps/worker/scripts/verify-synthetic-local.test.mjs`
- Modify: `apps/worker/vitest.config.mts` to include `**/*.test.{ts,mjs}` if the script test is otherwise excluded
- Read: `apps/worker/wrangler.local.toml`, `apps/worker/migrations/0001_task4_synthetic_search.sql`, `apps/worker/exports/task-4-synthetic-d1-export-v1/manifest.json`

**Interfaces:**
- Consumes: parsed fixed-shape Wrangler JSON and repository-local export files.
- Produces: pure helpers with stable shapes:

```js
export function parseResultRows(value, stage);
export function verifyExportDirectory(exportDirectory, expectedTables);
export function buildEvidenceSummary(input);
```

- [ ] **Step 1: Add pure valid/invalid parser fixtures**

Create local test values representing Wrangler JSON with a `results` array, count rows, empty foreign-key rows and a single excluded-listing/projection query result. Keep all values synthetic and do not embed real names, contacts or credentials.

- [ ] **Step 2: Write failing export-manifest tests**

Assert `verifyExportDirectory` accepts the committed export only when `synthetic_only === true`, `contains_real_data === false`, the six table names and expected row counts match, every manifest checksum matches the corresponding UTF-8 JSONL file, and no expected file is missing. Test failures for a changed count, changed checksum, missing file, unexpected table, `synthetic_only: false` and `contains_real_data: true`.

- [ ] **Step 3: Write failing command-guard tests**

Spawn the executable with `--remote`, `--config wrangler.toml`, an arbitrary SQL-like argument and an unknown argument. Assert each exits nonzero, does not invoke Wrangler, writes only a short actionable stderr message and does not print credentials, raw SQL, provider output or file contents.

- [ ] **Step 4: Write failing summary-shape tests**

Assert `buildEvidenceSummary` emits only the approved safe fields:

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

Do not include SQL, database IDs, config paths, timestamps, query text, raw CLI output or row values in the summary.

- [ ] **Step 5: Run the focused script tests and observe failure**

Run: `pnpm --filter @medifind/worker exec vitest run scripts/verify-synthetic-local.test.mjs`

Expected: FAIL because the verifier helpers do not yet exist.

### Task 2: Implement safe local command and fixed Wrangler invocation

**Files:**
- Modify: `apps/worker/scripts/verify-synthetic-local.mjs`
- Test: `apps/worker/scripts/verify-synthetic-local.test.mjs`

**Interfaces:**
- Consumes: zero command-line arguments and the repository's fixed Worker paths.
- Produces: a process that exits `0` with one JSON summary on success or exits nonzero with a generic actionable stderr message on failure.

- [ ] **Step 1: Resolve fixed paths from the script location**

Resolve the Worker root, `wrangler.local.toml`, migration file, export directory and expected migration name from `import.meta.url`; do not depend on the caller's current directory. Use the fixed local database name `medifind-synthetic-search-local` from `wrangler.local.toml`.

- [ ] **Step 2: Reject all arguments before any subprocess**

Require `process.argv.slice(2).length === 0`. If any argument exists, fail with `verify:local accepts no arguments; local config and SQL are fixed` and do not spawn Wrangler. This rejects `--remote`, alternate config, arbitrary SQL and future unreviewed flags together.

- [ ] **Step 3: Implement a non-shell Wrangler runner**

Use `execFile`/`execFileSync` with `wrangler.cmd` on Windows and `wrangler` elsewhere; never invoke a shell or interpolate command text. Every call must use a fixed argument array containing `--local` and `--config wrangler.local.toml`. Capture stdout only for parsing; discard raw stdout/stderr from user-visible errors and map process failures to `local Wrangler verification failed at <stage>`.

- [ ] **Step 4: Implement fixed query helpers**

Use only constant SQL strings for table existence, row counts, foreign-key checks and excluded-listing/projection/term checks. Run them through the local D1 command with `--json`; never accept a query, table, column, sort expression or database name from `process.argv`.

- [ ] **Step 5: Run command-guard tests**

Run: `pnpm --filter @medifind/worker exec vitest run scripts/verify-synthetic-local.test.mjs -t "argument|summary|export"`

Expected: PASS for all no-subprocess/shape/export guard tests.

### Task 3: Implement idempotent migration and database invariant verification

**Files:**
- Modify: `apps/worker/scripts/verify-synthetic-local.mjs`
- Test: `apps/worker/scripts/verify-synthetic-local.test.mjs`
- Read: `apps/worker/src/__tests__/migration.test.ts`, `apps/worker/src/__tests__/export.task4.test.ts`

**Interfaces:**
- Consumes: fixed local Wrangler runner and parsed local D1 rows.
- Produces: verified `rowCounts`, `foreignKeyViolations`, `excludedProjectionCount` and a safe migration state.

- [ ] **Step 1: Inspect local table state before applying SQL**

Run one fixed `sqlite_master` query for the six expected table names. If zero expected tables exist, apply `migrations/0001_task4_synthetic_search.sql` with the fixed local database/config/`--local` arguments. If all six exist, skip application and verify the existing state. If the state is partial or includes a conflicting migration shape, fail closed with `local synthetic database has an incomplete or unexpected schema`; never drop, reset or alter local data automatically.

- [ ] **Step 2: Verify exact row counts**

Run one fixed count query for the six tables and normalize the CLI JSON into `Record<string, number>`. Require exactly:

```text
medicine_concepts=7
pharmacy_organisations=4
pharmacy_branches=4
medicine_listings=8
public_search_projection=7
public_search_terms=31
```

Any missing, extra or mismatched table/count fails with a safe named reason and does not print row data.

- [ ] **Step 3: Verify foreign-key and stale-projection invariants**

Require `PRAGMA foreign_key_check` to return zero rows. Require exactly one excluded `excludex-solandra-ineligible` listing with `listing_state = 'excluded'`, zero matching `public_search_projection` rows and zero matching `public_search_terms` rows. Set `excludedProjectionCount` to the projection count and fail unless it is `0`.

- [ ] **Step 4: Add local command integration tests**

Run the no-argument command against local D1 and parse stdout as JSON. Assert the exact summary shape/values, `remote: false`, no raw JSONL/SQL/provider text, and a zero exit code. Run it a second time to prove the existing local state path is idempotent and does not reapply a non-idempotent migration.

- [ ] **Step 5: Run the verifier locally**

Run: `pnpm --filter @medifind/worker verify:local`

Expected: one stable JSON summary with the six exact counts, no foreign-key violations, zero excluded projection rows, valid export checksums and `remote: false`.

### Task 4: Verify export/checksum drift and document the command

**Files:**
- Modify: `apps/worker/scripts/verify-synthetic-local.mjs`
- Modify: `apps/worker/package.json`
- Modify: `docs/local-synthetic-development.md`
- Test: `apps/worker/scripts/verify-synthetic-local.test.mjs`

**Interfaces:**
- Consumes: committed `manifest.json`, six JSONL files and `schema.sql` under `apps/worker/exports/task-4-synthetic-d1-export-v1`.
- Produces: `pnpm --filter @medifind/worker verify:local` script and exact operator documentation.

- [ ] **Step 1: Add the package script**

Add exactly:

```json
"verify:local": "node ./scripts/verify-synthetic-local.mjs"
```

Do not add a remote variant, environment override, credential loader or output-file option.

- [ ] **Step 2: Verify manifest/checksums before the database summary**

Read UTF-8 files from the fixed export directory, calculate SHA-256 using Node's standard crypto API, compare every manifest checksum and row-count/table declaration, and return only `exportChecksumsValid: true` when all checks pass. Fail closed on altered/missing/extra files or manifest flags.

- [ ] **Step 3: Document exact local setup and output**

Add the command to `docs/local-synthetic-development.md`, state that it uses `wrangler.local.toml`/`--local` only, show the safe JSON field names above without real/hosted values, and state that it requires no Cloudflare authentication and writes no evidence file.

- [ ] **Step 4: Run the documented command from repository root**

Run: `pnpm --filter @medifind/worker verify:local`

Run it again after the local D1 is already initialized.

Expected: both runs pass with equivalent summary values; no remote command, credential prompt or hosted URL occurs.

### Task 5: Run full verification and hand off

**Files:**
- Review only: `apps/worker/scripts/verify-synthetic-local.mjs`, its test, `apps/worker/package.json`, `apps/worker/vitest.config.mts`, `docs/local-synthetic-development.md`

- [ ] **Step 1: Run focused and repository checks**

Run: `pnpm --filter @medifind/worker exec vitest run scripts/verify-synthetic-local.test.mjs src/__tests__/migration.test.ts src/__tests__/export.task4.test.ts`

Run: `pnpm run format:check`

Run: `pnpm lint`

Run: `pnpm typecheck`

Run: `pnpm test`

Run: `pnpm build`

Run: `pnpm run security:secrets`

Run: `pnpm run audit`

Run: `pnpm run security:trivy`

Report an exact Trivy database failure if it cannot complete; do not claim a clean scan without output.

- [ ] **Step 2: Test negative cases without damaging the repository**

Use temporary copies or pure helper inputs to prove altered count, checksum, migration path, partial schema, remote flag and malformed CLI JSON fail safely. Restore/delete only temporary test data; never mutate or delete the committed export/migration.

- [ ] **Step 3: Review the security boundary**

Confirm the script uses no shell interpolation, accepts no arbitrary arguments, contains no credentials/provider calls, prints no raw query/row/CLI output, never uses `--remote`, never writes evidence files and cannot alter a hosted database.

- [ ] **Step 4: Commit only Task 5 scope**

```bash
git add apps/worker/scripts/verify-synthetic-local.mjs apps/worker/scripts/verify-synthetic-local.test.mjs apps/worker/vitest.config.mts apps/worker/package.json docs/local-synthetic-development.md
git commit -m "test: add synthetic environment verification command"
```

- [ ] **Step 5: Return the PR handoff report**

Report the commit, exact local command output shape and focused/full results, synthetic-only status, no-reauth/no-remote evidence, security/privacy/cost impact, rollback (revert the commit and remove only local state if needed) and residual risks.
