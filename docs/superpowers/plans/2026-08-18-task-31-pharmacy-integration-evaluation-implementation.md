# Task 31 Bounded Pharmacy Integration Evaluation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Decide whether manual listing updates justify evaluating a pharmacy POS, inventory or directory integration without allowing an external system to become an unreviewed source of truth.

**Architecture:** This is an evaluation and synthetic adapter-contract packet, not a live integration. The Worker/domain contract remains provider-neutral; any future adapter accepts external data into a quarantined/review state, validates identity/price/availability/freshness, resolves conflicts under pharmacy ownership and requires explicit review before public projection. The browser never connects to an external pharmacy system or receives credentials.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, `packages/contracts`, synthetic adapter fixtures, schema/contract validators, export/redaction tests, provider-neutral repository boundary and bounded failure harness. No live POS/API, scraping, vendor SDK, exact stock, automatic price publication, credentials, clinical substitution, new provider or production data is added.

**Spec:** `docs/claude-tasks/scale-options/task-31-pharmacy-integration-evaluation.md`, `docs/product-brief.md`, `docs/data-and-search.md`, `docs/data-dictionary-and-ownership.md`, `docs/cloudflare-web-architecture.md`, `docs/api-mutation-and-concurrency-policy.md`, accepted Tasks 23, 26, 27 and the current legal/privacy/security evaluation boundary.

## Global Constraints

- Do not evaluate beyond synthetic interface examples until Task 23 catalog, Task 26 metrics, Task 27 scale/export, named synthetic pharmacy participant and legal/privacy/security boundary are accepted.
- The measurable problem must be stated first: manual burden, freshness lag, error rate or other approved aggregate. If the burden is not sustained or evidence is insufficient, recommend no integration.
- Never use live credentials, pharmacy exports, real buyer/medicine/contact/health/prescription data or an external system connection.
- Pharmacy remains the authority for identity, price, availability, eligibility and public projection approval. External data cannot silently publish, mutate protected records, alter exact-pack price, create exact stock or make a dispensing decision.
- Provider-specific types, credentials, routes and errors stop at a Worker adapter. The browser receives only existing domain contracts and generic safe errors.
- Future integration requires a separate provider/region/processor, data minimization, authentication, authorization, retention/deletion, cost, support, outage, audit, export, rollback and implementation approval.

## Task 1: Establish evaluation gate and baseline

**Files:**

- Create: synthetic pharmacy-integration decision packet
- Modify: `docs/claude-tasks/scale-options/task-31-pharmacy-integration-evaluation.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md` to link this plan
- Read: accepted Tasks 23, 26, 27, integration boundary and pharmacy/legal/security decisions

- [ ] **Step 1: Define the manual baseline**

Record synthetic/aggregate listing count, refresh effort, stale rate, correction/error rate, response burden, supported branch/locality scope and sample/uncertainty. Do not use raw pharmacy correspondence or exact stock.

- [ ] **Step 2: Define proceed/stop thresholds**

Set measured burden/quality threshold, owner, cost ceiling, security/privacy review, acceptable freshness, support capacity and rollback trigger. A demand statement alone does not justify integration.

- [ ] **Step 3: Define synthetic interface examples**

Use fake records for medicine identity/attributes, pharmacy branch, price, availability category, last-updated time, source version, error and revocation. Exclude exact stock, private contacts and external secrets.

## Task 2: Define provider-neutral adapter and ownership contract

**Files:**

- Create: synthetic adapter interface/fixtures and conformance tests
- Modify: Worker/domain contract only if an approved bounded interface is missing
- Review: listing lifecycle, price integrity, freshness, activation and audit policies

- [ ] **Step 1: Define inbound staging states**

Model received, validated, conflict, stale, rejected, revoked and approved-for-review states. External input remains private/staged until pharmacy-authorized review and server eligibility checks.

- [ ] **Step 2: Preserve pharmacy ownership**

Require branch authorization, source/version/precondition, identity/attribute validation, exact FJD price rules and explicit review before public projection. No external source becomes authoritative by default.

- [ ] **Step 3: Define authentication and revocation boundary**

Document only options/requirements for signed callbacks or scoped credentials, rotation/revocation, replay/idempotency, rate limits, region/processor, support owner, quota/cost and failure handling. Do not select a vendor or store credentials.

- [ ] **Step 4: Define export/audit boundary**

Use opaque synthetic source references, version/checksum, safe status/reason and audit reference. Never export provider secrets, raw payloads, direct identifiers, private object URLs or prescription content.

## Task 3: Rehearse conflicts, staleness and safe degradation

**Files:**

- Create: synthetic failure-injection scenarios and result report
- Create: adapter authorization/redaction/export tests
- Review: Task 17 freshness, Task 19 breakers, Task 20 incidents and Task 27 migration evidence

- [ ] **Step 1: Test data-quality failures**

Cover stale, conflicting, duplicate, malformed, incompatible identity/pack/strength/form, wrong branch, missing price, invalid availability and revoked source. Verify no unsafe public projection or exact-stock leak.

- [ ] **Step 2: Test delivery and provider failures**

Cover delayed, duplicated, out-of-order, rate-limited, unavailable and partially accepted external data. Verify bounded retry/idempotency, no duplicate audit/side effect and safe manual fallback.

- [ ] **Step 3: Test revocation and rollback**

Revoke synthetic source access or integration scope and roll back staged data. Verify current pharmacy listings remain safe, external data is no longer accepted, existing public data follows freshness rules and no records are deleted or silently rerouted.

- [ ] **Step 4: Test privacy and authorization**

Attempt browser/direct adapter access, cross-branch source use, credential exposure, raw payload logging and external data as a trusted role. Verify generic denial, redaction and server-owned authorization.

## Task 4: Produce decision and future-task outline

**Files:**

- Create: decision matrix, synthetic adapter report and future implementation-task outline only if justified
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Compare options**

Compare manual continuation, bounded future adapter study and no-integration outcome across measured burden, data ownership, freshness, conflict handling, region/privacy, security, support, cost, migration/export and rollback.

- [ ] **Step 2: Name unresolved provider facts**

List provider/region/processor, API/auth, contract, quota, cost, backup/retention, support and security facts still requiring approval. Do not fill them with assumptions.

- [ ] **Step 3: Keep future implementation separate**

If evidence supports proceeding, produce a new task outline with exact provider-neutral contract, approved provider decision, migration/rollback, audit, cost breaker, support and release gates. Do not implement live integration in Task 31.

- [ ] **Step 4: Run checks and commit packet**

Run format, lint, typecheck, tests, build, synthetic adapter-contract/export/redaction checks and relevant local Wrangler validation only without deployment/credentials. Commit `docs: evaluate bounded pharmacy integration options` with no live data or provider code.
