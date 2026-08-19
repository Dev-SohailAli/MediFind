# Task 19 Cost Breakers and Protected Feature Switches Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pause costly or sensitive capabilities at approved usage thresholds without shutting down safe search, corrupting existing records, weakening authorization, hiding status or allowing a browser flag/cache value to re-enable a paused feature.

**Architecture:** The Worker owns server-side usage aggregation, breaker state, feature capability evaluation and re-enable authorization. Usage is measured by approved service class and bounded time bucket; it never contains raw search text, prescription content or direct identifiers. Breakers are independent for OTP/identity sends, uploads/scans, reservations and any later approved costly capability. Safe discovery and read-only existing-record integrity remain available where safe. The browser receives a generic capability status and cannot supply or override breaker authority.

**Tech Stack:** Existing `apps/worker`, shared contracts, server-only operational metrics, D1 authoritative configuration/transition records only after the approved binding gate, KV/cache only for non-authoritative propagation if explicitly approved, typed feature-capability responses, fresh-authentication checks, append-only audit events and synthetic provider/quota harnesses. No billing provider, analytics SDK, notification vendor, queue, binding, secret or recurring cost is added without an approved decision.

**Spec:** `docs/claude-tasks/operations/task-19-cost-breakers-kill-switches.md`, `docs/cost-circuit-breaker-policy.md`, `docs/cost-and-environment-plan.md`, `docs/infrastructure-and-release-blueprint.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/audit-log-policy.md`, `docs/data-dictionary-and-ownership.md`, `docs/pilot-operations.md`, accepted Task 7 cost gate and Tasks 8-18 evidence/decisions.

## Global Constraints

- Do not implement or enable protected breakers until the founder-approved monthly ceiling, service-level usage measures, warning/ceiling thresholds, safe degraded behavior and audited re-enable authority are documented.
- Keep local/provider/quota fixtures synthetic. No real buyer, pharmacy, medicine, contact, health, prescription, reservation, OTP, notification, billing or production usage data may enter metrics or tests.
- No provider free allowance is a spend cap. Record the approved service, region, processor, unit measure, monthly ceiling, alert destinations, cost forecast, breaker behavior, rollback and migration/export path.
- Breaker state is server-owned and fail-closed for the affected costly/sensitive mutation. The browser cannot disable a breaker, create a flag, set a cache value, replay a stale enabled response or call a direct binding.
- Preserve safe search, safe public projections and integrity of existing records whenever possible. Never delete records, disable authorization, remove backups/audit logs or weaken security controls to reduce spend.
- Every breaker transition, threshold change, provider/quota failure and re-enable attempt is audited with redacted structured data. Do not log raw query text, prescription content, full contacts, tokens, OTPs or unnecessary device identifiers.
- Keep status generic and truthful. Do not expose account/project IDs, provider secrets, internal limits, attack signals or sensitive operational topology to buyers/pharmacies.
- Do not claim real billing, hosted alerts, quota behavior, deployment state or production pause/re-enable evidence unless actually run and recorded.

## Task 1: Establish the cost and capability gate

**Files:**

- Create: task-specific synthetic cost/breaker gate record only if the evidence convention approves one
- Modify: `docs/claude-tasks/operations/task-19-cost-breakers-kill-switches.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md` to link this plan
- Read: founder-approved ceiling, current provider/region decisions, protected capability inventory and recovery/incident ownership

**Interfaces:**

- Input: approved monthly ceiling, service unit definitions, warning thresholds, ceiling policy, capability list, propagation target, owner, alert path and re-enable authority.
- Output: versioned breaker matrix, fail-closed defaults, safe UI states and evidence owner.

- [ ] **Step 1: Record threshold rows**

For each service class, record 50%, 80% and 100% behavior, aggregation window, source, expected delay, alert owner, ceiling action, safe remaining functionality, recovery check and review date. If a threshold or service measure is not approved, leave the capability disabled in the protected environment.

- [ ] **Step 2: Record independent switches**

Define separate keys/capabilities for OTP sends, uploads, scanning, reservations and any later approved provider-backed operation. Do not create one global flag that unnecessarily disables safe search or unrelated existing-record reads.

- [ ] **Step 3: Define breaker precedence**

The effective capability is the intersection of authorization, branch/account readiness, feature approval, incident/kill-switch state, cost breaker state, provider availability and current record state. A stale cache or lower-priority enabled flag never overrides a server-side pause.

## Task 2: Define privacy-minimised usage measures and contracts

**Files:**

- Create: typed usage bucket and capability-status contracts
- Modify: approved Worker metric/feature configuration abstractions
- Create: schema/contract and forbidden-field tests

- [ ] **Step 1: Measure approved units separately**

Track Worker requests/CPU, D1 rows/storage, R2 operations/storage, queue/workflow units and separately approved identity/notification cost. Use bounded time buckets, aggregate counts/quantities and safe service labels. Never put search text, medicine terms, prescription data, direct identifiers or support free text in telemetry.

- [ ] **Step 2: Bound and protect metric records**

Use server-generated bucket IDs, service class, unit count, time window, aggregation version, source and safe correlation reference. Prevent client-written metrics, unbounded cardinality, raw IP/phone/email, per-buyer history and a single global hot row. Restrict metric views to the operations role.

- [ ] **Step 3: Define stable status results**

Return only an allow-listed capability state such as available, warning, paused, provider-unavailable or maintenance, a safe message key, retryability and request ID. Do not return internal quota, spend, provider response, billing account or breaker rule details.

- [ ] **Step 4: Define propagation and stale-status behavior**

Document the maximum acceptable delay between measured threshold and enforced pause. If authoritative breaker state cannot be read, fail closed for the affected sensitive mutation and keep safe search only when its own authorization/data path is healthy. Never treat an old client-enabled status as proof of availability.

## Task 3: Implement server-owned breaker transitions

**Files:**

- Modify: approved Worker configuration/capability service
- Modify: approved D1 authoritative transition store only after the binding gate
- Create: transition, concurrency, idempotency and audit tests

- [ ] **Step 1: Make thresholds and states authoritative**

Store approved configuration version, service/capability, environment, threshold state, effective time, owner, expiry/review, safe reason category and audit reference. KV/cache may accelerate reads only if it cannot decide authorization or mutation outcome and has an explicit stale/failure policy.

- [ ] **Step 2: Enforce 50/80/100 behavior**

At 50% and 80%, emit the approved warning/alert without changing user safety behavior unless the gate says otherwise. At 100% or an equivalent provider ceiling, pause new costly/sensitive mutations for the affected capability, preserve safe search and existing-record integrity, and expose a generic maintenance state.

- [ ] **Step 3: Handle provider and quota failures**

Treat provider refusal, quota exhaustion, metric outage or ambiguous state as a bounded safe failure. Do not retry unboundedly or create duplicate charges/events. Preserve existing state, allow safe read-only behavior where verified, and record a redacted reason category for operations.

- [ ] **Step 4: Protect every mutation path**

Evaluate the effective capability in the Worker immediately before OTP send, upload/scan, reservation create/approve or any other protected operation. Re-check inside the transaction where possible. A browser request that starts before a pause must not commit a newly disabled sensitive mutation without the server's current check.

- [ ] **Step 5: Audit all material changes**

Record threshold configuration, warning, pause, provider/quota failure, duplicate event suppression, manual kill switch, restore, re-enable attempt and final re-enable. Include opaque actor/target, capability/environment, safe before/after state, reason/category, approval/reference, correlation ID and integrity metadata; never include secret values or raw usage payloads.

## Task 4: Implement audited pause and re-enable authority

**Files:**

- Modify: approved founder/admin operations command path
- Modify: fresh-authentication/recovery checks from Task 8
- Create: authorization and unauthorized-re-enable tests

- [ ] **Step 1: Require fresh founder authentication**

Changing a monthly ceiling or re-enabling a paused capability requires the founder-controlled, freshly authenticated and permitted role, fresh MFA/step-up where required, current configuration version, bounded reason and approval reference. No pharmacy owner, routine support role or client-supplied role can do this.

- [ ] **Step 2: Separate manual kill switch from cost state**

Keep safety/incident pause distinguishable from budget pause, with independent reason, actor, start/end and recovery checks. A manual resume cannot override an unresolved cost ceiling, provider failure, incident hold, invalid activation or authorization defect.

- [ ] **Step 3: Make commands idempotent and concurrent-safe**

Require opaque idempotency keys and expected configuration version. Duplicate same commands return one safe result and one transition; changed replay, stale version, cross-environment or cross-capability requests fail safely and are audited.

- [ ] **Step 4: Require re-enable validation**

Before resume, verify current usage/ceiling state, provider health, data integrity, authorization, rate limits, audit visibility, notification fallback where applicable, rollback path and feature-specific prerequisites. Resume only the approved capability, then record observed propagation and post-resume validation.

## Task 5: Integrate safe web and workflow states

**Files:**

- Modify: approved `apps/web` operation/error/status components and affected mutation screens
- Modify: Worker contract client/query invalidation only for capability status
- Create: UI/accessibility tests

- [ ] **Step 1: Show generic capability status**

Render translated, non-sensitive copy such as temporarily unavailable or maintenance for paused OTP/upload/reservation actions. Preserve search and existing-record status where safe. Do not show budget percentages, provider names, account IDs or security details to ordinary users.

- [ ] **Step 2: Prevent client bypass**

Do not store breaker authority in local/session storage, IndexedDB, service-worker cache or a feature flag controlled by the browser. Invalidate cached capability status on mutation response, app resume and safe refresh; the server remains authoritative.

- [ ] **Step 3: Preserve offline safety**

Offline mode must not queue OTP, upload, scan, reservation or re-enable mutations. Show the last state as stale/offline and require fresh server confirmation before a sensitive action.

- [ ] **Step 4: Verify accessibility and language behavior**

Test status announcement, focus/error association, keyboard navigation, non-colour state, contrast, 200% scaling, narrow layouts, reduced motion and English/iTaukei/Fiji Hindi wording. Maintenance copy must not imply emergency, clinical or 24/7 support.

## Task 6: Rehearse thresholds, failures and recovery

**Files:**

- Create: synthetic usage/provider/quota harness and breaker fixtures
- Create: task-specific acceptance evidence if approved by the repository evidence convention
- Modify: task brief/roadmap with actual outcomes

- [ ] **Step 1: Exercise warning and ceiling states**

Cover below 50%, 50%, delayed warning, 80%, 100%, threshold crossing, reset/new period and duplicate measurement/event. Verify independent capabilities and safe search behavior at every state.

- [ ] **Step 2: Exercise failure and pause behavior**

Cover provider unavailable, quota exceeded, metric unavailable, stale cache, concurrent mutation during pause, repeated retry, partial state write and ambiguous response. Verify no unsafe commit, duplicate charge/event or authorization bypass.

- [ ] **Step 3: Exercise unauthorized and authorized re-enable**

Attempt browser flag/cache override, buyer/pharmacy/support re-enable, stale admin session, missing MFA, wrong environment, stale version and reused idempotency key. Then run the approved fresh founder-authenticated re-enable with recovery validation and confirm only the intended capability resumes.

- [ ] **Step 4: Record safe degraded evidence**

Capture commit, fixture IDs, threshold/state transitions, propagation delay, safe UI screenshots/outputs, audit assertions, remaining functionality, rollback path and known limitations. Mark real billing, hosted alerting, provider and production evidence as not run unless actually performed.

## Task 7: Verify and hand off

**Files:**

- Review: contracts, service/configuration, route guards, UI states, tests and evidence
- Modify: task brief/roadmap with exact validation outcomes

- [ ] **Step 1: Run repository checks**

Run contracts, Worker, web, authorization, mutation, audit, accessibility and security tests plus the repository format/lint/typecheck/test/build checks required by the baseline. Run relevant local Wrangler validation only without deployment or credential actions.

- [ ] **Step 2: Review privacy, security and cost scope**

Confirm telemetry contains only approved aggregates, every breaker is server-owned, safe search remains available where safe, backups/audit/authorization remain intact and no provider/binding/cost/credential/real data was added without approval.

- [ ] **Step 3: Commit only approved task scope**

After review, stage only the Task 19 implementation, synthetic tests, approved documentation links and evidence. Use commit message `feat: add cost breakers and protected feature switches`. Do not stage billing exports, credentials, `.env` files, real usage records or unrelated user changes.
