# Task 27 Scale, Provider Adapter and Migration Readiness Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove when the current Cloudflare-first implementation needs capacity, regional, backup, search or file-processing changes, and make any future provider or architecture change reversible before it is needed.

**Architecture:** The browser depends on stable versioned Worker contracts, never on D1/R2/KV or provider-specific types. Worker repositories and capability adapters isolate Cloudflare implementations from domain contracts. Scale decisions use measured aggregate usage/latency/cost, restore/export evidence and safe failure behavior. A provider change is an ADR and migration decision, not an automatic implementation; safe search may remain while costly/sensitive mutations pause.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, `packages/contracts`, provider-neutral repository interfaces, current Cloudflare adapters, synthetic export/import/checksum harness, load/failure injection, cost/breaker evidence and versioned migrations. No Durable Objects, Queues/Workflows, new provider, paid service, private prescription file, billing path or direct browser storage is added by this plan alone.

**Spec:** `docs/claude-tasks/post-pilot/task-27-scale-migration-readiness.md`, `docs/cloudflare-web-architecture.md`, `docs/free-first-production-architecture.md`, `docs/web-free-first-options.md`, `docs/infrastructure-and-release-blueprint.md`, `docs/cost-and-environment-plan.md`, accepted Tasks 18, 19, 21, 22 and 26 evidence, and any required provider/region/privacy ADR.

## Global Constraints

- Do not start until Task 22 release evidence, measured Task 26 usage/latency/cost data, Task 18 restore/export evidence and a founder-approved trigger to study are accepted.
- This plan does not approve a paid service, another provider, protected binding, region, data migration, file workflow, billing or production capability. If the evidence does not show a trigger, record `no change`.
- Use synthetic fixtures and isolated harnesses only. No real buyer, pharmacy, medicine, health, prescription, contact, production secret or production backup may enter load, export/import or failure injection.
- Keep domain contracts, browser behavior, authorization, audit, idempotency, retention, safe errors and capability states provider-neutral. Provider-specific credentials/types/configuration stop at the Worker adapter boundary.
- Every trigger has a measured baseline, threshold, owner, action, cost/privacy/security impact, rollback/export path, review date and safe degraded behavior. A metric never changes state automatically.
- Preserve safe search/read-only integrity while costly or sensitive mutations fail closed during capacity/provider/quota failures. Do not accept stale protected mutations.
- Do not claim current provider limits, pricing, region, hosted migration or recovery results unless officially verified and actually run under the approved workflow.

## Task 1: Establish measured trigger and decision gates

**Files:**

- Create: task-specific synthetic scale/migration decision packet
- Modify: `docs/claude-tasks/post-pilot/task-27-scale-migration-readiness.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md` to link this plan
- Read: Task 18 export/restore, Task 19 cost breakers, Task 21 performance and Task 26 metric evidence

**Interfaces:**

- Input: accepted measured baseline, pilot target, current limits/failure modes, cost ceiling, provider/region review and founder trigger.
- Output: trigger matrix, options comparison, no-change/change recommendation, ADR request if warranted and synthetic migration evidence.

- [ ] **Step 1: Define measurable triggers**

Cover sustained API p95/timeout, Worker CPU, D1 read/write/storage, projection/propagation lag, reconciliation backlog, export/restore RTO/RPO, cost threshold, quota/provider failure, search quality and approved file-processing need. Use aggregate values and sample/uncertainty from Task 26.

- [ ] **Step 2: Set safe thresholds and warning action**

For each trigger define baseline, warning, ceiling/block, observation period, owner, investigation action, cost impact, capability pause and rollback. Do not use a one-off spike or a vendor sales claim as a migration decision.

- [ ] **Step 3: Record decision outcomes**

Choose `no change`, `capacity/index/query fix`, `adapter preparation`, `provider study` or `ADR required`. A provider study does not authorize provisioning or data transfer; an ADR must record region, processor, privacy, security, cost, backup, export, migration and owner decisions.

## Task 2: Isolate provider-neutral domain contracts and adapters

**Files:**

- Modify: approved Worker repositories/adapters and shared contracts only where leakage exists
- Create: adapter conformance tests and forbidden-provider-type checks
- Review: web client API and generated/build artifacts

- [ ] **Step 1: Pin the stable boundary**

Keep browser contracts limited to approved domain inputs/results, safe error keys, capability state, version and correlation ID. Never expose D1/R2/KV types, binding names, provider IDs, SQL, object URLs or credentials in `packages/contracts` or web output.

- [ ] **Step 2: Define adapter capabilities**

Specify provider-neutral operations for authoritative records, projections, aggregate metrics, export/import, backup/restore and optional private files. Each adapter declares supported limits, failure classes, idempotency, transaction/concurrency behavior and migration/export path without promising unsupported behavior.

- [ ] **Step 3: Preserve authorization ownership**

The Worker validates actor/role/branch/current state/feature/cost/incident before invoking an adapter. A provider response never decides authorization, public visibility, prescription validity, price, reservation state or cohort scope.

- [ ] **Step 4: Test absence of leakage**

Scan shared contracts, browser bundles, logs and error payloads for provider-specific types, binding names, credentials, internal IDs, raw queries, prescription content and private object URLs.

## Task 3: Rehearse synthetic export/import and migration

**Files:**

- Modify: approved synthetic export/import harness and migration runner
- Create: versioned schema/export manifest, checksum fixtures and failure reports
- Review: Task 18 restore/deletion and Task 22 rollback evidence

- [ ] **Step 1: Define migration manifest**

Record source/destination adapter/version, schema version, record classes, field classification, identifier/version/terminal-state rules, checksums, counts, dependencies, rollback/forward-fix path and owner. Do not export real data or private file bytes.

- [ ] **Step 2: Preserve identity and privacy classifications**

Synthetic import must preserve opaque identifiers, versions, terminal states, branch/role scope, audit references, projection eligibility and field classification. It must not broaden visibility, restore sessions/tokens or drop retention/deletion semantics.

- [ ] **Step 3: Test failure and resume**

Exercise schema mismatch, checksum failure, foreign-key failure, partial batch, duplicate import, provider outage, quota/cost breaker, authorization error and rollback/forward fix. Resume idempotently from a verified checkpoint without skipping or duplicating state.

- [ ] **Step 4: Rebuild and verify derived state**

Rebuild public projections and aggregate metrics from authoritative synthetic records. Verify safe search, freshness, activation/capability state, audit integrity, role scope and no public/private leakage.

## Task 4: Test safe degradation and capacity options

**Files:**

- Create: synthetic load/failure-injection scenarios and options report
- Modify: capability/breaker tests only for approved safe behavior
- Review: Task 17, 19, 20 and 21 evidence

- [ ] **Step 1: Exercise current platform limits**

Use representative synthetic load to test Worker CPU/request, D1 read/write/storage, propagation/reconciliation, export/restore and approved cache behavior. Record saturation, latency, errors, cost estimate, retry behavior and safe remaining functions.

- [ ] **Step 2: Exercise provider/quota failure**

Verify safe search/read-only behavior where authorized, generic maintenance status for affected operations, paused OTP/upload/scan/reservation capabilities as applicable, no stale protected mutation and no unbounded retry or duplicate side effect.

- [ ] **Step 3: Compare bounded options**

Compare query/index/schema optimization, capacity change, caching, approved paid Cloudflare path and other provider study against measured trigger, region/privacy, security, backup/restore, export/migration, cost, support and rollback. Do not implement an option from the comparison without a new approved task/ADR.

- [ ] **Step 4: Record no-change outcome when appropriate**

If targets remain within approved limits, record the current Cloudflare-first path, monitoring/review cadence, next trigger and why no new provider or binding is warranted.

## Task 5: Complete evidence, ADR request and handoff

**Files:**

- Create: trigger matrix, synthetic migration/recovery report and options decision
- Modify: task brief/roadmap/decision log only with actual outcome
- Review: cost, privacy, security, support, accessibility and release owners

- [ ] **Step 1: Record every trigger outcome**

Include measured baseline, threshold, sample/uncertainty, owner, action, cost impact, privacy/security review, safe degraded behavior, rollback/export, residual risk and review date.

- [ ] **Step 2: Create ADR only if warranted**

If evidence shows a provider/architecture change is needed, draft an ADR request describing exact requirement, chosen option, region/processor, data classes, contract/adapter impact, backup/restore, export/migration, cost ceiling, security/access, rollback and separate implementation task. Do not mark it accepted automatically.

- [ ] **Step 3: Run quality checks**

Run format, lint, typecheck, tests, build, adapter/conformance/security/redaction/load/export/import checks and relevant local Wrangler validation only without deployment, credentials or provider provisioning.

- [ ] **Step 4: Commit only approved evidence**

Commit only approved Task 27 changes with `docs: record measured scale and migration readiness`. Do not stage real data, production backups, credentials, speculative provider code or unrelated changes.
