# Task 32 Resilient Status Communication Evaluation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evaluate whether authenticated in-app status and generic web notifications are sufficient, or whether a future email/SMS/push fallback is justified by measured delivery failure and support evidence, without selecting or configuring a provider.

**Architecture:** The authenticated Worker response and in-app status remain authoritative. Any future channel carries only a generic refresh signal and opens a freshly fetched web state; it never carries medicine, prescription, reservation, patient, price or raw query detail. A provider-neutral Worker adapter would own consent, subscription/revocation, rate limits, retries, suppression, language keys, incident handling and safe failure. The browser never receives provider credentials or treats a notification as current state.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, notification/status contracts, synthetic delivery/subscription fixtures, generic locale keys, redaction/anti-enumeration tests and channel decision documentation. No email/SMS/push provider, native SDK, unsolicited marketing, OTP/account-creation channel, live callback or recurring cost is added.

**Spec:** `docs/claude-tasks/scale-options/task-32-communication-fallback-evaluation.md`, `docs/notification-and-status-synchronisation.md`, `docs/requirements.md`, `docs/api-error-contract.md`, `docs/experience-and-content.md`, `docs/web-platform-capabilities-policy.md`, accepted Tasks 24, 26 and 27 evidence, current delivery/support owner and privacy/security/cost review.

## Global Constraints

- Do not evaluate protected channels beyond synthetic scenarios until Tasks 24, 26 and 27, delivery evidence, support ownership and candidate-channel privacy/security/cost review are accepted.
- No provider is selected or configured. Any future implementation needs processor/region, sender identity, data categories, consent, retention/deletion, security, cost, support, recovery and rollback approval.
- Use synthetic subscriptions, statuses and failure results only. No real buyer, pharmacy, contact, medicine, health, prescription, reservation, OTP, token or production message may enter fixtures, logs, exports or screenshots.
- In-app authenticated state is authoritative for every candidate channel. Notifications are generic refresh signals only and require re-fetch on open/resume.
- Do not send medicine/search text, prescription content, reservation/pickup details, patient data, price, OTPs, access tokens or raw contacts in notifications.
- Preserve safe search and existing-record integrity when delivery is unavailable; do not claim delivery, retry forever or use stale notification content as truth.

## Task 1: Establish channel evaluation gate and failure baseline

**Files:**

- Create: synthetic communication decision packet
- Modify: `docs/claude-tasks/scale-options/task-32-communication-fallback-evaluation.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md` to link this plan
- Read: accepted Tasks 24, 26, 27, status contract, support owner and candidate-channel review

- [ ] **Step 1: Measure current status failure**

Define aggregate delayed/duplicate/revoked/undelivered generic signal rates, in-app re-fetch success, support impact, sample/uncertainty and observation period. Do not use raw message content or addresses.

- [ ] **Step 2: Define proceed/stop thresholds**

Record failure threshold that could justify research, stop threshold, owner, cost ceiling, safety/privacy impact, support capacity, language/accessibility requirements and rollback. Missing evidence means status-only continuation.

- [ ] **Step 3: Define candidate comparison**

Compare status-only, browser Web Push if separately approved, email and other approved candidate classes by data categories, consent/revocation, processor/region, sender identity, cost, delivery/retry, support, incident, recovery and rollback. Do not name a vendor.

## Task 2: Define provider-neutral generic notification contract

**Files:**

- Create: typed signal/subscription/status decision contracts and synthetic validators
- Modify: Worker/web status refresh behavior only within approved scope
- Create: redaction, locale and anti-enumeration tests

- [ ] **Step 1: Define generic signal payload**

Allow only safe event category, generic message key, app route/state reference that is not an identifier, expiry/retryability and correlation reference. Never include protected details or a reusable access token.

- [ ] **Step 2: Define re-fetch-on-open/resume**

Opening a signal fetches current authenticated Worker state, verifies session/role/current capability and renders server truth. A stale, revoked, duplicated or unknown signal becomes a safe no-op/status refresh.

- [ ] **Step 3: Define consent and revocation**

Model purpose, locale, channel state, subscription reference, consent/version/time, unsubscribe/revocation and retention without storing raw provider tokens in the browser or logs. Marketing/non-essential messages remain out of scope.

- [ ] **Step 4: Define adapter failure behavior**

Bound retries/backoff, rate limits, duplicate suppression, provider callback validation/replay protection where relevant, safe outage state, support escalation and no mutation dependency on notification delivery.

## Task 3: Rehearse synthetic delivery and privacy failures

**Files:**

- Create: synthetic channel/subscription/delivery harness
- Create: failure/redaction/audit evidence
- Review: Tasks 19, 20 and 26 breaker/incident/metric boundaries

- [ ] **Step 1: Exercise delivery states**

Cover delayed, duplicate, undelivered, revoked, expired, malformed, rate-limited, provider-unavailable and out-of-order signals. Verify one bounded side effect, current in-app re-fetch and safe fallback.

- [ ] **Step 2: Exercise anti-enumeration**

Attempt unknown subscription/status, cross-account/branch signal, stale route reference and client-supplied protected payload. Verify generic results, no record clues and no authorization bypass.

- [ ] **Step 3: Exercise content redaction**

Attempt medicine/search text, prescription/reservation/patient details, price, contact, OTP, token and pharmacy note in a signal. Verify rejection/redaction from notifications, logs, metrics, errors and exports.

- [ ] **Step 4: Exercise accessibility and language**

Verify generic keys in English/iTaukei/Fiji Hindi, notification permission denial/manual fallback, screen-reader status, focus, offline, stale and re-fetch behavior. No channel is required for safe operation.

## Task 4: Produce the decision packet and future-task boundary

**Files:**

- Create: channel decision matrix and synthetic delivery report
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Decide status-only or research**

Name observed failure, threshold, chosen status-only/future-research outcome, owner, support impact, cost/privacy/security risks, rollback and review date.

- [ ] **Step 2: Define future implementation requirements**

If a channel is justified, create a separate task for provider/processor/region/sender identity, consent, retention, adapter, callbacks, cost breaker, incident/recovery, export and rollback. Do not configure or send live messages here.

- [ ] **Step 3: Run checks and commit packet**

Run format, lint, typecheck, tests, build, notification-contract/redaction/accessibility/synthetic delivery checks and relevant local Wrangler validation only without deployment or credentials. Commit `docs: evaluate resilient status communication options` with no provider or real data.
