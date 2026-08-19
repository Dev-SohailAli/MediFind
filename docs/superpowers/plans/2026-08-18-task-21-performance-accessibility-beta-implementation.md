# Task 21 Performance, Accessibility, Language and Beta Acceptance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove that the invite-only Suva pilot's stable web flows are usable, safe and measurable on representative Fiji browser, device and network conditions, with evidence for performance, accessibility, language, privacy and release decisions.

**Architecture:** Measurement runs against local or isolated synthetic Worker/web environments and representative synthetic load. The browser remains a responsive web/PWA client; sensitive actions never degrade to stale/offline mutations. Performance events are aggregate and privacy-minimized. Manual device/accessibility evidence records method and outcomes without collecting personal data or claiming formal certification. A target miss blocks expansion until a documented workaround, remediation or founder-approved exception exists.

**Tech Stack:** Existing `apps/web` and `apps/worker`, deterministic synthetic fixtures, approved load/browser harness, physical browser/device/network test matrix, aggregate server/client timing, accessibility tooling plus manual keyboard/screen-reader review, translated fixture content and repository quality/security checks. No session replay, advertising tracker, raw query telemetry, health data, direct identifier, new provider or paid testing service is added without a written decision.

**Spec:** `docs/claude-tasks/operations/task-21-performance-accessibility-beta.md`, `docs/performance-and-reliability-targets.md`, `docs/accessibility-policy.md`, `docs/test-and-acceptance-strategy.md`, `docs/design-review-acceptance-checklist.md`, `docs/pilot-operations.md`, `docs/security-privacy-compliance.md`, accepted Tasks 8-20 evidence/decisions and the approved beta cohort gate.

## Global Constraints

- Do not begin beta acceptance until protected flows are stable, representative synthetic load is defined, physical devices/networks and reviewers are available, translations are professionally reviewed and the founder-approved cohort remains invite-only.
- Use only invented branch, listing, account, reservation, prescription-state and support fixtures. No real buyer, pharmacy, medicine, health, prescription, contact, query or production data may enter load, browser, telemetry or screenshots.
- Record device/browser/network, build commit, fixture set, measurement method, percentile/sample, defects, workaround, owner and release decision. A local test is not hosted/production evidence.
- Targets are engineering acceptance targets, not carrier or availability guarantees. A sustained miss or regression requires investigation and documented safe degradation before expansion.
- Do not add analytics/session replay, raw query tracking, persistent personal profiling, external test provider, paid service, browser permission or new route to make measurement easier.
- Preserve search's safe loading/offline/cache behavior while sensitive reservation, prescription, staff/admin and account mutations fail closed offline and require fresh server state.
- Accessibility target is WCAG 2.2 AA product quality, not a claim of formal certification. No exception may weaken privacy, authorization, safety language or an essential journey.

## Task 1: Establish the beta acceptance matrix

**Files:**

- Create: task-specific synthetic beta acceptance evidence record
- Modify: `docs/claude-tasks/operations/task-21-performance-accessibility-beta.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md` to link this plan
- Read: founder-approved beta cohort, stable-flow inventory, translations, accessibility reviewers and operations owners

**Interfaces:**

- Input: accepted journey list, performance targets, device/browser/network matrix, language/content approvals, load model, defect severity policy and release authority.
- Output: versioned acceptance matrix with PASS/FAIL/WAIVED rows, evidence owner, remediation due date and cohort decision.

- [ ] **Step 1: List critical journeys and states**

Cover buyer search/detail/zero-result, freshness/hours, OTC reservation/status, account/recovery, pharmacy onboarding/listing/refresh, protected request/review when separately enabled, admin/support/audit, outage/maintenance, kill-switch, offline, denied and safe-error states. Mark disabled capabilities explicitly instead of testing a fake enabled path.

- [ ] **Step 2: Pin measurable targets**

Use the accepted targets: search API p95 within 2 seconds under representative pilot load; first visible results within 3 seconds on a normal Fiji mobile network; 20 results per page and 100-result query maximum; listing update propagation within 5 minutes or visibly stale with alert; reconciliation every 15 minutes with a 30-minute alert; scanner definitions only when Task 13 is approved.

- [ ] **Step 3: Define evidence and release rules**

Every row names method, environment, commit, fixtures, reviewer, result and limitation. An essential accessibility/privacy/security/authorization failure or unresolved Critical incident exercise blocks beta. Non-blocking defects require owner, workaround, due date and founder acceptance before cohort expansion.

## Task 2: Define representative synthetic load and measurement

**Files:**

- Create: synthetic load profile and deterministic fixture generator/harness
- Create: aggregate measurement schema and forbidden-field assertions
- Modify: Worker/web measurement hooks only where the approved task requires them

- [ ] **Step 1: Model pilot-shaped traffic**

Use documented synthetic proportions for search, zero results, detail, listing refresh, branch hours, reservation status and approved operational reads. Bound concurrency, page size, query result maximum and request duration. Do not model real people or copy real search terms.

- [ ] **Step 2: Measure privacy-minimised signals**

Record endpoint/operation class, environment, build, coarse device/network class, start/end or duration bucket, status category, page size, timeout/error category and correlation reference. Do not record raw query, medicine text, health/prescription content, contact, direct identifier or session replay.

- [ ] **Step 3: Define percentile and baseline method**

Pin warm/cold behavior, sample size, p50/p95/p99 where useful, client first-visible definition, cache state, network shaping, CPU/device conditions and repeated-run variance. Compare with accepted baseline and distinguish Worker/API latency from browser rendering/network delay.

- [ ] **Step 4: Guard cost and sensitive paths**

Run load only in local/synthetic environments within approved limits. Do not trigger real OTP, notification, upload, scan, reservation, billing or protected data operations. Cost breakers and rate limits must remain testable without creating real usage.

## Task 3: Run performance and reliability acceptance

**Files:**

- Create: performance result reports and synthetic regression fixtures
- Modify: relevant query/pagination/loading/error behavior only when a target miss requires an approved bounded fix
- Review: Task 17 freshness/reconciliation and Task 19 breaker behavior

- [ ] **Step 1: Verify search and result limits**

Measure p95 API latency and first visible results under the agreed load/network profile. Verify 20-result pages, explicit load-more and 100-result maximum; no unbounded catalogue fetch/cache or query history storage.

- [ ] **Step 2: Verify listing propagation and freshness**

Measure update-to-public-projection lag against the five-minute target, preserve actual pharmacy refresh time and exercise delayed propagation. A miss must show stale/alert behavior and remain excluded at the seven-day threshold rather than appear falsely current.

- [ ] **Step 3: Verify degraded connectivity**

Exercise slow/intermittent/offline network, Worker timeout, D1/provider failure and stale public cache. Search may show timestamped safe public cached data; protected and sensitive mutations cannot queue or succeed from stale/offline state.

- [ ] **Step 4: Verify operational limits**

Check request/body/concurrency limits, safe errors, rate limits, cost breaker warning/pause states and bounded reconciliation under representative synthetic load. Confirm no privacy-sensitive telemetry or user-facing internal detail is emitted.

## Task 4: Run manual browser, responsive and accessibility acceptance

**Files:**

- Create: browser/device/accessibility evidence record
- Modify: approved web components only for bounded defects found by the matrix
- Review: `docs/accessibility-policy.md` and changed journey screens

- [ ] **Step 1: Test physical device and browser matrix**

Record at least iPhone Safari with VoiceOver, Android browser with TalkBack and a desktop keyboard/screen-reader combination, plus representative narrow mobile and wide desktop viewports. Record browser/version/device/OS, network condition, language, journey and result; use synthetic fixtures only.

- [ ] **Step 2: Test keyboard and assistive technology**

Verify semantic names/roles, predictable focus, modal/navigation focus, labels, validation and status announcements, reading order, skip/navigation structure, touch/pointer targets and no gesture-only action. Include loading, empty, zero-result, stale, denied, maintenance, security-hold and success states.

- [ ] **Step 3: Test visual and text behavior**

Verify contrast in light/dark themes, non-colour status, 200% scaling without clipping/overlap, narrow layouts, reduced motion, safe time-limit/expiry explanations and clear exact-pack FJD/freshness/no-guarantee language. Do not translate official/medicine identity.

- [ ] **Step 4: Test permission denial and offline boundaries**

Verify manual fallback when location/notification/browser capabilities are denied, no permission is required for manual area search, no sensitive mutation queues offline and no cached private content appears in an unauthorized context.

## Task 5: Verify language and content safety

**Files:**

- Create: language expansion/content acceptance evidence
- Review: approved English, iTaukei and Fiji Hindi content and professional legal/safety review records
- Modify: translated UI only for accepted corrections

- [ ] **Step 1: Exercise all supported languages**

Run changed buyer, pharmacy and admin journeys in English, iTaukei and Fiji Hindi. Check expansion, wrapping, labels, error/status announcements, date/time/price formatting and navigation without truncation or hidden actions.

- [ ] **Step 2: Verify semantic alignment**

Confirm freshness, price, no-guarantee, prescription-required, pharmacy-decision, emergency/non-clinical support, outage, security and privacy wording retain the approved meaning. Medicine identity and pharmacy-authored content stay appropriately attributed/language-tagged.

- [ ] **Step 3: Confirm review evidence**

Record content version, reviewer/approval reference, date, affected routes and unresolved gaps. Missing professional legal/safety translation evidence blocks external beta use of the affected content.

## Task 6: Make the beta decision and hand off evidence

**Files:**

- Create: synthetic beta acceptance report with PASS/FAIL/WAIVED rows
- Modify: task brief/roadmap with exact validation outcomes and residual risks
- Review: Task 22 release/rollback gate inputs

- [ ] **Step 1: Triage failures**

Classify defects as release-blocking, workaround-required or backlog. Security/privacy/authorization, essential accessibility, unsafe stale/price/status behavior, unbounded results, sensitive offline mutation or unresolved Critical exercise failure is blocking.

- [ ] **Step 2: Record cohort and scope decision**

Document whether the founder approves no beta, synthetic-only beta, or the next invite-only Suva cohort. This evidence does not authorize public acquisition, production data, broad Fiji rollout, prescription activation or a hosted deployment.

- [ ] **Step 3: Verify rollback and repeatability**

Record prior build/artifact, rollback owner/path, test rerun method, device/network limitations and next review date. A performance or accessibility workaround must be repeatable and not weaken privacy or safety controls.

- [ ] **Step 4: Run repository checks**

Run format/lint/typecheck/test/build/security checks, relevant Worker/web/browser tests and local Wrangler validation only when no deployment or credential action is required. Do not claim physical/hosted evidence unless it was actually run.

- [ ] **Step 5: Commit only approved verification scope**

After review, stage only the Task 21 test/harness changes, evidence, approved documentation links and bounded fixes. Use commit message `test: verify pilot performance accessibility and beta readiness`. Do not stage real user/device data, raw query logs, credentials, `.env` files, production artifacts or unrelated changes.
