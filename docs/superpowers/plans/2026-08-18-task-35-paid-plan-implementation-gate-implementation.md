# Task 35 Gated Paid-Plan Implementation Requirements Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate a positive commercial-readiness decision into a precise pre-build packet for a possible pharmacy SaaS/listing-fee plan without writing billing code, selecting a provider or accepting money.

**Architecture:** This is a decision and synthetic state-machine packet. Commercial status, entitlements and administration are isolated from medicine search, pharmacy-owned availability/price, safety wording, prescription/dispensing decisions and ordinary access control. A future billing adapter would be Worker-owned and provider-neutral, with manual support/reconciliation, founder-only enable/pause/rollback and no-charge staging. No payment data or financial records exist in this task.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, shared domain contracts, synthetic account/plan/entitlement fixtures, explicit state/command validators, idempotency/audit tests and documentation-only approval matrix. No payment provider, checkout, stored payment method, invoice, subscription, charge, advertising, commission, paid placement or new recurring service is added.

**Spec:** `docs/claude-tasks/scale-options/task-35-paid-plan-implementation-gate.md`, `docs/business-and-commercial.md`, `docs/cost-and-environment-plan.md`, `docs/free-first-production-architecture.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/audit-log-policy.md`, accepted Tasks 28, 30 and 36 evidence, current Fiji registration/tax/contract/liability/privacy advice and founder pricing/finance/support decision.

## Global Constraints

- Do not begin unless Task 28 records an explicit continue/prepare decision, Task 30 cohort evidence and Task 36 assurance evidence are accepted, with current Fiji registration/tax/contract/liability/privacy advice, founder-approved pricing and named finance/support owner.
- If any legal, tax, finance, security, privacy, recovery, cost, provider, region, retention, support or release item is unresolved, produce a stop report. Do not infer approval.
- Use synthetic accounts, plans, entitlements, invoices/refunds/disputes as placeholders and state outcomes only; no money, payment instrument, financial identifier, real customer or provider data.
- Commercial status cannot affect search ranking, public prominence, medicine identity, availability, exact price, freshness, safety wording, verification, prescription routing, dispensing decisions or ordinary user authorization.
- No provider, processor, sender, region, contract, fee, tax treatment, retention period, billing authority or charge path is selected by this plan.

## Task 1: Establish the paid-plan gate and ownership matrix

**Files:**

- Create: synthetic paid-plan approval matrix and stop report
- Modify: `docs/claude-tasks/scale-options/task-35-paid-plan-implementation-gate.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md` to link this plan
- Read: accepted Task 28 decision, Task 30 cohort evidence, Task 36 assurance, legal/tax/finance/support and cost decisions

- [ ] **Step 1: Record named owners**

Name legal, tax, finance, support, security/privacy, release, recovery and founder approvers. Record scope, evidence, review date and stop condition for each; do not place private contact values in source.

- [ ] **Step 2: Define intended payer and scope**

Document whether the payer would be pharmacy organization/branch and whether buyers are always free, without implementing account conversion or charge collection. Define trial/withdrawal/closure assumptions only as decisions to review.

- [ ] **Step 3: Define approval rows**

Require pricing, contract, tax, invoice/refund/dispute, data/processor/region, retention/deletion, authorization, reconciliation, cost/breaker, recovery, support and rollback decisions. Missing rows block any future implementation brief.

## Task 2: Model commercial state and entitlements synthetically

**Files:**

- Create: synthetic plan/status/entitlement state contracts and validators
- Create: state-machine/idempotency/concurrency/audit tests
- No payment/billing implementation files

- [ ] **Step 1: Define explicit states**

Use approved decision names for proposed, trial/research, active, paused, past-due/unknown, withdrawn, closed and rollback as placeholders only. Each state has owner, effective/expiry, reason, version, approval and audit reference.

- [ ] **Step 2: Keep entitlements narrow**

Model only approved non-clinical commercial administration such as plan visibility/support scope. Never grant search prominence, availability, medicine catalog authority, prescription access or dispensing power from a paid state.

- [ ] **Step 3: Define manual responsibility**

Document who handles invoice/refund/dispute/support/closure decisions manually in a future design, with no provider callback or payment webhook implementation here.

- [ ] **Step 4: Enforce idempotency and audit**

Require actor/role/scope, current version, bounded reason and idempotency key for synthetic enable/pause/withdraw/rollback. Verify duplicate/replayed/stale/cross-branch commands create no unsafe or duplicate side effect.

## Task 3: Prove commercial isolation invariants

**Files:**

- Create: synthetic invariant tests and search/projection comparison report
- Review: Task 10 listing/search, Task 19 breakers, Task 26 metrics and Task 31 adapter boundaries

- [ ] **Step 1: Compare paid/free fixture results**

Use identical synthetic medicine/listing/request inputs and prove paid status cannot alter exact/alias relevance, freshness, price, availability, public prominence, no-guarantee wording or safe result order.

- [ ] **Step 2: Test authorization separation**

Verify commercial administration cannot grant pharmacy staff, reviewer, admin, break-glass, prescription or branch access. Existing role/verification/activation gates remain authoritative.

- [ ] **Step 3: Test pause/closure/rollback**

Pause/withdraw/close a synthetic plan and verify only approved commercial administration changes, free search and existing safe records remain intact, and rollback never deletes data or reroutes protected requests.

- [ ] **Step 4: Test privacy/cost boundaries**

Verify no payment data, financial identifier, raw contract, personal contact, health/prescription content, credential, provider error or unapproved metric enters logs, exports, browser storage or notifications.

## Task 4: Define future implementation packet and no-charge rehearsal

**Files:**

- Create: future billing-task checklist and synthetic rehearsal report
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Define provider/data requirements**

List exact provider/processor/region, payer/payment categories, authentication/webhook verification, retention/deletion/export, access/reconciliation, cost breaker, recovery, support, contract/tax/refund and rollback requirements without choosing values.

- [ ] **Step 2: Define founder-only authority**

Require fresh founder authentication/MFA, plan/version checks, audited enable/pause/rollback, separate review and no browser/cache authority. Re-enable after failure requires financial/reconciliation/security/support validation.

- [ ] **Step 3: Run no-charge synthetic state rehearsal**

Exercise activation, pause, failed reconciliation, placeholder refund/dispute, account closure, provider-unavailable, cost breaker and rollback using fake states. Confirm no money, payment instrument or live callback exists.

- [ ] **Step 4: Run checks and commit packet**

Run format, lint, typecheck, tests, build, synthetic entitlement/idempotency/audit/invariant checks and documentation review. Commit `docs: define gated paid-plan implementation requirements`; do not claim payment readiness or production billing.
