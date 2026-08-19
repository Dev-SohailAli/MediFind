# Synthetic Development Environment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move MediFind from a locally implemented but unverified synthetic Worker/D1 slice to a clean, locally runnable, isolated synthetic development environment without enabling protected or production capability.

**Architecture:** The browser remains a synthetic-safe React/PWA client by default. A server-only Cloudflare Worker owns the read-only `/v1/search` and `/v1/listings/{id}` routes and reads only the six-table synthetic D1 projection. Local tests use an in-memory SQLite D1 double; Wrangler local development uses a local-only D1 binding; any hosted resource is a separate synthetic environment.

**Tech Stack:** Node.js 24.19.0, pnpm 11.22.0, TypeScript 6, React 19, Vite 8, Cloudflare Workers/Wrangler, D1/SQLite, Vitest, ESLint, Prettier.

**Spec:** `docs/cloudflare-web-architecture.md`, `docs/task-4-synthetic-d1-data-contract-proposal.md`, `docs/task-3-protected-platform-foundation-specification.md`, `docs/web-app-and-pwa-direction.md`, and ADR-275 in `docs/decisions.md`.

## Global Constraints

- The only active client is `apps/web`; the former native prototype remains historical and is not modified.
- The only active server boundary is `apps/worker`; the browser never receives D1/R2/KV credentials or secrets.
- All local and hosted preview records are invented synthetic data; no buyer, pharmacy, medicine, contact, health, prescription, or production data is allowed.
- Task 4 remains read-only: no accounts, authentication provider, mutations, reservations, prescriptions, uploads, analytics, R2, KV, queues, or external search provider.
- D1 failures, missing bindings, quota failures, invalid rows, and provider errors fail closed with safe generic responses.
- No Cloudflare deploy or resource creation is claimed unless the exact command succeeds.

---

### Task 1: Make repository quality checks reflect the active workspace

**Files:**
- Modify: `.prettierignore`
- Modify: `eslint.config.js`
- Modify: committed synthetic JSONL export files only where required for LF stability

**Interfaces:**
- Produces deterministic repository-wide format/lint scope that excludes `archive/legacy-mobile-prototype`, `.claude`, and the unrelated `MediVault` workspace.
- Keeps generated/export evidence content stable without broadening active runtime scope.

- [x] **Step 1: Add a failing export-evidence regression test if the current failure is not already captured.** Keep the existing exact-content assertion as the behavior contract.
- [x] **Step 2:** Run the focused Worker export test and record the current CRLF/LF failure.
- [x] **Step 3:** Add only non-active directories to formatter/linter ignores.
- [x] **Step 4:** Normalize the committed export evidence without changing JSON content or row ordering.
- [x] **Step 5:** Run the focused export test, then format and lint checks.
- [ ] **Step 6:** Commit with `chore: restore reproducible repository quality gates` (branch/PR integration remains a handoff step).

### Task 2: Add an explicit local Worker/D1 development path

**Files:**
- Modify: `apps/worker/package.json`
- Modify: `apps/worker/wrangler.toml` or add an equivalent environment-specific Wrangler config
- Modify: `apps/worker/src/types/env.ts` only if generated/bound types require it
- Create: local migration/bootstrap documentation under `docs/`
- Test: Worker configuration/boundary tests

**Interfaces:**
- `pnpm --filter @medifind/worker dev` starts Wrangler local development.
- The local `DB` binding uses the existing migration and synthetic export only.
- The default web build remains fixture-backed unless an explicit local API mode is selected.

- [x] **Step 1:** Add a configuration test that requires the local Worker command, dry-run deployment validation, and synthetic-only D1 binding shape.
- [x] **Step 2:** Run the test to verify it fails because the command/configuration is absent.
- [x] **Step 3:** Add the minimal Worker `dev`, dry-run deployment validation, and migration/bootstrap scripts and local binding configuration.
- [x] **Step 4:** Run Wrangler dry-run validation and local migration commands.
- [x] **Step 5:** Run the Worker integration tests against the local binding path.
- [ ] **Step 6:** Commit with `feat: add local synthetic worker development path` (branch/PR integration remains a handoff step).

### Task 3: Add safe web-to-Worker local integration

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/src/search/searchClient.ts`
- Modify: `apps/web/src/search/useSearchExecution.ts` or the narrowest existing integration seam
- Test: web search client and boundary tests
- Modify: `vite.config.ts` only for a local development proxy if required

**Interfaces:**
- Fixture-backed search remains the default and works offline.
- An explicit development-only API mode requests only `/v1/search` and `/v1/listings/{id}`.
- The client maps Worker safe errors to the existing safe UI states and never stores raw query text or provider errors.

- [x] **Step 1:** Write tests for successful API search, unavailable Worker fallback/error state, and default fixture mode.
- [x] **Step 2:** Run the focused web tests and confirm the new API-mode tests fail.
- [x] **Step 3:** Implement the minimal typed client and mode selection without changing the production preview default.
- [x] **Step 4:** Run focused tests, then browser-facing web tests and build.
- [ ] **Step 5:** Commit with `feat: add opt-in local worker search integration` (branch/PR integration remains a handoff step).

### Task 4: Prepare and provision the isolated synthetic Cloudflare environment

**Files:**
- Modify: Worker Wrangler configuration only with synthetic environment identifiers supplied by the founder/Cloudflare account
- Create or update: `docs/infrastructure-and-release-blueprint.md` with the exact synthetic environment evidence
- Create: no credentials, tokens, or production artifacts in Git

**Interfaces:**
- A separate synthetic Worker and D1 database contain only the reviewed export.
- The browser accesses the Worker over the configured environment URL; it never accesses D1 directly.
- The migration and logical export remain the recovery/evidence path.

- [x] **Step 1:** Run `wrangler whoami` and `wrangler deploy --dry-run` before any resource mutation; dry-run passed and `whoami` confirmed no authentication.
- [x] **Step 2: Create the synthetic D1 database only if the authenticated Cloudflare account and approved database name are available.** Database `medifind-synthetic-search` was created with UUID `cb372f8c-ce1d-4443-bc72-dec144bf4dfa`.
- [ ] **Step 3: Apply the reviewed migration and verify row counts, foreign keys, projection exclusion, and checksums remotely.** Pending visible Cloudflare device approval.
- [ ] **Step 4: Configure the synthetic Worker binding without committing account credentials or secrets.
- [ ] **Step 5: Run a dry deployment, then deploy only after the configuration and cost boundary are verified.
- [ ] **Step 6: Record exact resource names, URLs, migration revision, and command evidence in the release blueprint.

### Task 5: Full verification and handoff

**Files:**
- No product files unless a verification failure requires a focused fix.

- [x] **Step 1: Run format check, lint, typecheck, all tests, build, Wrangler validation, secret scan, dependency audit, and Trivy scan.
- [x] **Step 2: Run local Worker smoke tests for health, search, listing detail, unavailable D1, invalid input, anti-enumeration, and safe provider errors.
- [x] **Step 3: Inspect `git diff`, `git status`, and committed file scope for credentials, real data, unintended native changes, or unrelated edits.
- [x] **Step 4: Report exact pass/fail evidence and any external Cloudflare result that was not runnable.
