# Task 30 National Fiji Cohort Governance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Define evidence-based controls for expanding from selected localities to a larger Fiji cohort while keeping pharmacy verification, freshness, support, accessibility, language, cost, privacy and rollback manageable.

**Architecture:** This is a decision/readiness packet, not a nationwide activation implementation. The existing server-owned branch schema supports Fiji localities; a future cohort scope would be an explicit founder-owned, expiring, auditable capability evaluated by the Worker. Public projections include only currently verified, active, fresh branch/listing data. Pausing a locality removes eligibility without deleting records or silently rerouting pending protected requests.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, shared locality/cohort/branch contracts, synthetic multi-locality fixtures, `Pacific/Fiji` time utilities, activation/verification/freshness/reconciliation/cost/incident controls, browser/accessibility evidence and decision-packet documentation. No nationwide flag, buyer-location tracking, embedded map, delivery, public reviews, live inventory integration, new provider or real cohort is enabled.

**Spec:** `docs/claude-tasks/scale-options/task-30-national-fiji-cohort-governance.md`, `docs/branch-location-and-hours-policy.md`, `docs/pharmacy-verification-policy.md`, `docs/pilot-operations.md`, `docs/performance-and-reliability-targets.md`, `docs/product-brief.md`, accepted Tasks 23-29 evidence, current Fiji legal/privacy review and founder target-cohort decision.

## Global Constraints

- Do not start until Tasks 23-29 are accepted or explicitly closed, with founder decisions on value, support capacity, cost, legal/privacy status, accessibility, incidents, retention/deletion, rollback and whether a larger cohort is wanted.
- This task defines evidence and a recommendation only. It does not activate a locality, create a public cohort, change a feature flag, expand support promises or authorize national coverage.
- Use synthetic branches, addresses, coordinates, hours, listings, requests and incidents only. No real buyer, pharmacy, contact, health, prescription, location or production data may enter the packet.
- Never imply coverage where no verified fresh listing exists. Unverified, expired, stale, paused or out-of-scope branches cannot appear active.
- Do not collect buyer coordinates, embed maps, infer open/stock state, add delivery, public ratings or live inventory integration.
- Preserve safe search, generic unavailable states, neutral pending-workflow handling and rollback without deleting authoritative records or rerouting buyer requests.

## Task 1: Establish cohort gate and decision matrix

**Files:**

- Create: national/cohort synthetic decision packet
- Modify: `docs/claude-tasks/scale-options/task-30-national-fiji-cohort-governance.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md` to link this plan
- Read: accepted Tasks 23-29 evidence, legal/privacy, support/cost/recovery decisions and founder locality/cohort intent

- [ ] **Step 1: Record locality rows**

For every proposed locality record owner, branch cap, start/end/review, verification/training requirement, support coverage, languages/accessibility, freshness baseline, cost ceiling, incident readiness, rollback/pause trigger and public projection rule.

- [ ] **Step 2: Define entry/stop criteria**

Require verified branches, current hours, daily refresh, reconciliation, support capacity, accessibility/language evidence, cost alerts, recovery/incident readiness and legal/privacy approval. Define stop triggers for stale data, support overload, cost, safety/privacy/security issue, failed accessibility or legal change.

- [ ] **Step 3: Define decision outcomes**

Use `not ready`, `synthetic rehearsal`, `limited locality recommendation`, `pause/rollback` or `decision required`. A recommendation never activates code or a cohort.

## Task 2: Rehearse multi-locality operations synthetically

**Files:**

- Create: synthetic branches/localities, device/network and incident fixtures
- Create: contract/Worker/browser evidence
- Review: Tasks 16, 17, 19, 20 and 21 controls

- [ ] **Step 1: Exercise onboarding and verification**

Cover private-before-approval branch, verification renewal/expiry, material address/contact/licence change, owner/staff continuity, MFA, training, support escalation and safe public projection.

- [ ] **Step 2: Exercise time/freshness/reservation behavior**

Cover split/exception hours, `Pacific/Fiji` boundaries, 24-hour stale labels, seven-day removal, delayed reconciliation, reservation pickup expiry and locality isolation.

- [ ] **Step 3: Exercise pause/incident/cost behavior**

Pause one locality for verification, stale data, support overload, cost breaker or incident. Verify other localities are unaffected, protected workflows are neutral/generic, safe search remains available where safe and no pending request is silently rerouted.

- [ ] **Step 4: Exercise accessibility/language/connectivity**

Test representative browsers/networks and English/iTaukei/Fiji Hindi states with 200% scaling, screen readers, keyboard, offline, stale and denied states. No buyer location is collected.

## Task 3: Verify data quality, support and cost evidence

**Files:**

- Create: locality quality/support/cost report
- Review: aggregate Task 26 evidence, Task 27 triggers, Task 29 governance and support-owner capacity

- [ ] **Step 1: Check coverage claims**

Reconcile only approved aggregate counts and freshness/verification states. Show uncertainty and gaps; never turn missing data into zero coverage or a positive cohort signal.

- [ ] **Step 2: Check operational capacity**

Record named verification/support/incident owners, published Fiji support hours, queue capacity, language/accessibility review, maintenance windows and escalation readiness.

- [ ] **Step 3: Check cost and rollback**

Compare measured usage/cost to the approved ceiling and breakers. Record exact rollback owner/path, data integrity checks, review date and residual risks.

## Task 4: Produce the founder decision packet

**Files:**

- Create: final evidence packet and residual-risk register
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Attach synthetic evidence**

Record fixture IDs/counts, scenarios, browser/network matrix, results, privacy review, support/cost/legal gaps, rollback rehearsal and unresolved risks. Do not attach private correspondence or real locality records.

- [ ] **Step 2: Name approver and boundaries**

State founder approver, accepted locality/cohort scope if any, enabled/disabled capabilities, start/end/review, support owner and explicit non-goals. Confirm no code-only activation.

- [ ] **Step 3: Run checks and commit packet**

Run document/link checks plus repository quality/contract/Worker/browser checks for any guardrail code. Commit only approved documentation with `docs: define gated Fiji cohort expansion evidence`; do not deploy or change flags.
