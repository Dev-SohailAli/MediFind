# Task 26 Privacy-Minimised Product Evidence and Metrics Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn pilot learning into repeatable product decisions using small, aggregate, privacy-minimized evidence rather than raw analytics, surveillance or metrics-driven clinical/ranking decisions.

**Architecture:** The Worker emits bounded operational metrics from approved server-side events and operational records. Metrics are time-bucketed, privacy-classified, role-scoped and retention-aware; they are never authoritative for authorization, listing state, reservation state, prescription decisions or cost breaker transitions. The browser receives only approved aggregate views and safe operational status. Synthetic exports reproduce baselines without raw queries or protected content.

**Tech Stack:** Existing `apps/worker`, `apps/web` operational views, shared metric contracts, server-side aggregate counters, D1 metric records only after the approved gate, deterministic synthetic fixtures, redaction/schema tests, uncertainty/sample-limit rendering and JSONL/CSV-like synthetic export where approved. No analytics SDK, session replay, advertising, cross-site tracking, data broker, location trail, profiling, raw query history or new metrics provider is added.

**Spec:** `docs/claude-tasks/post-pilot/task-26-product-evidence-metrics.md`, `docs/data-dictionary-and-ownership.md`, `docs/performance-and-reliability-targets.md`, `docs/audit-log-policy.md`, `docs/pilot-operations.md`, `docs/business-and-commercial.md`, `docs/free-first-production-architecture.md`, accepted Task 22 release evidence, Task 19 cost-breaker decisions and approved data-owner/retention review.

## Global Constraints

- Do not implement until Task 22 is accepted, the founder approves the metric list and a data owner records purpose, aggregation, retention, access and deletion for every metric.
- Use only synthetic fixtures for development and load. No real buyer, pharmacy, medicine, health, prescription, contact, query, location, device-token, support or production data may enter metrics, logs, exports or dashboards.
- Metrics are evidence, not authority. They cannot automatically approve pharmacies, rank medicines, change prices, infer health, enable prescription workflows, expand a cohort or override a server state.
- Store only bounded aggregate/time-bucket values. Do not record raw query/medicine text, prescription content, health inference, full contacts, direct identifiers, location trails, device tokens, unnecessary device details or session replay.
- Every metric has an owner, purpose, source event, aggregation, uncertainty/sample rule, retention, access class, deletion behavior, export rule and review date. Missing metadata blocks emission.
- Do not represent missing/unknown/low-sample data as zero. Show sample limits, confidence/uncertainty or `insufficient data` where appropriate.
- Preserve safe user behavior when metrics are delayed/unavailable; do not expose internal telemetry/provider errors to users or use a browser-written metric as truth.

## Task 1: Establish the metric and data-owner gate

**Files:**

- Create: task-specific metric approval/dictionary/evidence record
- Modify: `docs/claude-tasks/post-pilot/task-26-product-evidence-metrics.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md` to link this plan
- Read: Task 22 release evidence, data dictionary, retention/deletion, cost, performance and privacy decisions

**Interfaces:**

- Input: founder-approved metric list, event sources, data owner, operational audience, retention/access/deletion rules and baseline cohort definitions.
- Output: versioned metric dictionary, safe event schema, decision templates and export/rollback path.

- [ ] **Step 1: Approve bounded metric categories**

Use only categories such as search/zero-result rate, detail conversion, listing freshness, verification duration, reservation/request response/outcome, notification delivery category, support category, accessibility/language findings, latency/error aggregates and cost-breaker state. Do not add a metric because it is easy to collect.

- [ ] **Step 2: Record ownership and lifecycle**

For each metric record owner, purpose, source, aggregation/window, minimum sample, access role, retention/deletion, export format, review date and safe interpretation. Keep operational metrics separate from append-only security/audit evidence while preserving required audit references.

- [ ] **Step 3: Define decision templates**

Create explicit founder-review templates for expand, remediate, pause, rollback and keep-unchanged decisions. A metric cannot make these decisions automatically or substitute for legal, security, accessibility, pharmacy or user feedback review.

## Task 2: Define privacy-minimized event and aggregate contracts

**Files:**

- Create: typed metric event/bucket contracts and validators
- Modify: approved Worker aggregate event adapter
- Create: forbidden-field, cardinality and sample-limit tests

- [ ] **Step 1: Use safe event fields**

Allow only operation/category, environment/cohort scope, time bucket, bounded status/reason, coarse device/network class where approved, count/duration/size bucket and safe correlation reference. Do not accept raw user-supplied text or direct identifiers.

- [ ] **Step 2: Bound cardinality and windows**

Use fixed allow-lists, bounded time buckets, maximum event dimensions and aggregation before persistence/export. Avoid per-user, per-query, per-medicine, per-device or one-global-hot-counter records unless separately approved and privacy-reviewed.

- [ ] **Step 3: Define missing and low-sample behavior**

Represent unavailable, delayed, suppressed and insufficient-sample states distinctly from zero. Document minimum sample/suppression rules so a small cohort cannot be re-identified through a dashboard or comparison.

- [ ] **Step 4: Define safe metric responses**

Return approved aggregate values, bucket/window, sample status, uncertainty and report version only. Do not return raw events, source record IDs, contacts, queries, prescription details or internal provider/tenant information.

## Task 3: Implement server-side emission, reconciliation and access

**Files:**

- Modify: approved Worker metric aggregation/reconciliation service
- Create: D1 migration only after exact binding/retention approval
- Create: role-scoped operational views/export and audit tests

- [ ] **Step 1: Emit from authoritative events**

Produce counters from approved operational/audit events after the relevant state transition, with idempotent event references and bounded retries. Do not let the browser create, edit or replay metric events as authoritative input.

- [ ] **Step 2: Reconcile without changing state**

Compare aggregates to approved listing/reservation/support/maintenance records using a bounded server job. Record discrepancy category and repair reference, but never silently alter source state or let a metric decide authorization, price, availability, prescription validity or cohort scope.

- [ ] **Step 3: Enforce access and exports**

Allow only approved operations/owner roles to view or export aggregate data, with cohort/branch scope and safe filters. Audit view/export/configuration actions. Synthetic exports include schema/version, safe buckets, counts, suppression/uncertainty and checksum, never raw source rows.

- [ ] **Step 4: Apply retention and deletion**

Run only the approved server-side retention/deletion path. Remove eligible metric buckets and exports without deleting audit/security evidence required by the approved schedule. Backups and derivatives follow the same classification and retention rule.

## Task 4: Build decision views without surveillance or automatic action

**Files:**

- Modify: approved `apps/web` admin/operations evidence views
- Create: uncertainty/sample/empty/error fixtures and accessibility tests
- Modify: status/cost/support views only within approved metric scope

- [ ] **Step 1: Show context and uncertainty**

Display period, cohort/branch scope, sample status, missing data, threshold/baseline comparison and uncertainty. Do not imply causation, clinical meaning or universal availability from a small pilot aggregate.

- [ ] **Step 2: Keep views role-scoped**

Buyers and pharmacy staff do not receive internal metrics. Founders/admins see only the minimum required operational scope; no drill-down reveals a buyer, query, medicine, prescription, contact or device.

- [ ] **Step 3: Connect to explicit decisions**

Provide a safe evidence link to expand/remediate/pause/rollback/unchanged decision records, but require human review and current gate checks. Metrics cannot turn on a locality, provider, billing, prescription or ranking rule.

- [ ] **Step 4: Handle metric outage safely**

Show stale/unavailable evidence status to operations, retain safe application behavior and block expansion decisions when required evidence is missing. Do not display zero or claim healthy operation because collection failed.

## Task 5: Verify privacy, load and reproducibility

**Files:**

- Create: synthetic metric fixtures/export and baseline report
- Create: redaction, schema, role-scope, cardinality and representative-load tests
- Modify: task brief/roadmap with exact validation outcomes

- [ ] **Step 1: Test prohibited values**

Attempt raw query/medicine text, prescription/health content, contacts, location, device token, direct ID, support free text, ranking/pricing input and user-written event fields. Verify rejection/redaction from events, logs, exports, dashboards, errors and notifications.

- [ ] **Step 2: Test accuracy and idempotency**

Cover duplicate event, retry, delayed event, out-of-order event, missing source, small sample, bucket boundary, reconciliation discrepancy and deletion. Verify one safe count, truthful unknown status and no source-state mutation.

- [ ] **Step 3: Reproduce the synthetic baseline**

Export the approved synthetic dictionary/buckets with version/checksum, rerun in an isolated environment and compare results. Record changed definitions, uncertainty, limitations, rollback and owner review.

- [ ] **Step 4: Run quality checks**

Run format, lint, typecheck, tests, build, metric-schema/redaction/accessibility/load checks and relevant local Wrangler validation only without deployment or credentials. Do not claim production or real-cohort measurement.

- [ ] **Step 5: Commit only approved scope**

Commit only approved Task 26 changes with `feat: add privacy-minimised pilot evidence metrics`. Do not stage raw exports, real data, identifiers, analytics credentials, session replay or unrelated changes.
