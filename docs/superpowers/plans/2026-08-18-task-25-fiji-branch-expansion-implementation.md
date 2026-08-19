# Task 25 Gated Synthetic Fiji Branch Activation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare a controlled, server-owned path to activate verified pharmacy branches outside the initial Suva pilot without weakening address, hours, freshness, support, privacy, accessibility or protected-workflow rules.

**Architecture:** The branch schema supports Fiji addresses, provinces/localities, verified coordinates, `Pacific/Fiji` hours and exceptional closures independent of activation scope. A founder-owned, server-side locality scope controls whether a verified branch may become public; it has an owner, expiry, audit, rollback and review date. Public projection exposes only approved display fields. Buyer location is never collected or sent to pharmacies; directions use verified branch data and a user-chosen external maps handler.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, shared branch/verification/activation contracts, synthetic Fiji locality fixtures, server-owned feature-scope configuration, D1-authoritative records only after the approved environment gate, time/freshness/reservation utilities, scoped audit events, accessible multilingual UI and low-connectivity browser tests. No automatic geocoding, embedded map, location tracker, delivery, public review, support vendor, new provider or real locality activation is authorized by this plan alone.

**Spec:** `docs/claude-tasks/post-pilot/task-25-fiji-branch-expansion.md`, `docs/branch-location-and-hours-policy.md`, `docs/pharmacy-verification-policy.md`, `docs/pilot-operations.md`, `docs/performance-and-reliability-targets.md`, `docs/experience-and-content.md`, accepted Tasks 16, 17, 21 and 22 evidence and current legal/privacy review.

## Global Constraints

- Do not implement or enable an expanded locality until Task 22 release evidence, pilot onboarding/training/reconciliation evidence, named support owner, founder-approved target locality and current legal/privacy review for the expanded scope are accepted.
- No locality is activated by code alone. A missing owner, expiry, rollback path, support capacity, verification evidence, legal review or post-activation review date is `NOT APPROVED`.
- Use synthetic branches, addresses, coordinates, hours, listings, reservations and support events only. No real pharmacy, buyer, contact, health, prescription, licensing or geolocation data may enter fixtures, logs or screenshots.
- Preserve all Fiji address structure and future locality support in the model, but keep public activation scoped to an explicit founder-approved locality flag. Do not hard-code a national rollout.
- A branch remains private until current verification, owner/staff/MFA, training, hours, freshness, capability and locality-scope gates pass. Pausing or rolling back a locality removes public eligibility without deleting authoritative records or falsely rerouting pending requests.
- Do not collect buyer coordinates, request location permission for ordinary search, infer branch-open status from coordinates, use automatic geocoding or expose private verification/evidence/staff data.
- Maintain exact FJD price, actual freshness, branch hours, reservation expiry and no-guarantee behavior. Preserve safe search and generic errors when an expanded locality is unavailable or paused.

## Task 1: Establish the locality expansion gate

**Files:**

- Create: task-specific synthetic locality gate/release packet
- Modify: `docs/claude-tasks/post-pilot/task-25-fiji-branch-expansion.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md` to link this plan
- Read: Task 22 release packet, pilot operations evidence, support owner/capacity, legal/privacy review and founder locality decision

**Interfaces:**

- Input: target locality/province, approved rollout scope, branch verification policy, support hours/capacity, training/reconciliation evidence, risk/rollback plan and review date.
- Output: versioned locality activation matrix, synthetic branch set, fail-closed scope flag and post-activation review record.

- [ ] **Step 1: Record target locality facts**

Record approved locality/province, supported language/content requirements, expected branch count, support coverage, address/directions assumptions, hours/holiday process, network/accessibility risks, owner, expiry and review date. Do not infer facts from a generic Fiji schema.

- [ ] **Step 2: Define activation prerequisites**

Require current verification/re-verification, authorized owner and staff roles/MFA, training, branch hours, daily listing refresh, reservation pickup compatibility, stale-data reconciliation, support/security escalation and capability/incident/cost state. An expanded locality cannot bypass Task 16 readiness.

- [ ] **Step 3: Define stop and rollback criteria**

Specify triggers such as verification discrepancy, stale listing failure, support overload, unresolved high-severity incident, legal/privacy change, inaccessible critical journey, cost breaker or unsafe address/directions result. Pause public eligibility and protect pending workflows without forwarding requests to another branch.

## Task 2: Implement server-owned locality scope and branch projection

**Files:**

- Modify: approved Worker branch/activation contracts and scope evaluator
- Modify: D1 schema/repository only after exact schema/binding approval
- Create: locality flag, concurrency, expiry and authorization tests

- [ ] **Step 1: Model explicit scope state**

Use approved states such as proposed, review, enabled, paused, expired and revoked with locality, environment, owner, effective/expiry/review time, safe reason category, config version and audit reference. Do not encode scope in client code or cache.

- [ ] **Step 2: Authorize changes narrowly**

Require freshly authenticated founder/release authority, current version, bounded reason, idempotency key and audit for enable/pause/revoke/renew. Branch owners cannot activate a locality or approve their own expanded scope.

- [ ] **Step 3: Keep public projection minimal**

Expose only approved branch display address, directions data, verified public contact, regular/exception hours, safe verification status, listing price/freshness and capability status. Exclude evidence, exact coordinate validation, staff/owner, support and internal scope metadata.

- [ ] **Step 4: Preserve private-before-approval changes**

Route address/coordinate/legal-name/ownership/licence/responsible-person/contact changes into private re-verification. A material change never silently inherits prior public approval.

## Task 3: Validate hours, directions and operational readiness

**Files:**

- Modify: approved branch detail/hours/directions and activation checks
- Create: synthetic locality/hour/coordinate fixtures and business-time tests
- Review: Task 17 reconciliation/freshness and Task 16 onboarding evidence

- [ ] **Step 1: Test Fiji address and directions contract**

Validate structured address, fixed `FJ`, locality/province, coordinate range/source state and public-display derivation with synthetic values. Generate only a verified external directions link from public branch data; never send buyer location to the pharmacy.

- [ ] **Step 2: Test `Pacific/Fiji` hours**

Cover split weekly intervals, closed days, exceptional replacement/closure precedence, Fiji date/time boundaries, reservation pickup expiry near closing/holiday and stale refresh behavior. Do not infer that a branch is open or has stock from location alone.

- [ ] **Step 3: Verify support and language readiness**

Check founder/support ownership, published hours/non-emergency scope, escalation contacts, language-reviewed system content, note labels, accessibility and low-connectivity behavior for the target locality. No new support vendor or public WhatsApp channel is added.

- [ ] **Step 4: Verify freshness and capability gates**

Require branch/listing refresh and reconciliation evidence, exact price/freshness, active reviewer rules, reservation compatibility, cost/incident switch health and safe search fallback before public eligibility.

## Task 4: Run synthetic cross-locality acceptance

**Files:**

- Create: synthetic branches in the existing Suva locality and proposed target locality
- Create: contract/Worker/browser acceptance evidence
- Modify: task brief/roadmap with exact validation results

- [ ] **Step 1: Exercise private and approved paths**

Verify a synthetic target branch stays private before verification/activation, becomes public only after all gates, and shows only approved detail fields after activation. Verify a Suva branch remains unaffected by a target-locality pause.

- [ ] **Step 2: Exercise pause, expiry and rollback**

Pause/expire/revoke locality scope, verification or branch readiness. Verify public projections/listings are removed or marked safely, staff/capability access changes are scoped, pending requests are not rerouted, authoritative records remain intact and reactivation needs current review.

- [ ] **Step 3: Exercise authorization and privacy**

Attempt cross-branch/cross-locality reads and mutations, client flag override, stale cache, browser coordinate injection, location permission misuse, direct evidence access and staff enumeration. Verify generic safe errors, no buyer coordinate storage/disclosure and redacted audits.

- [ ] **Step 4: Exercise low connectivity and language**

Run search/detail/hours/directions/status and approved operational flows on representative constrained networks and browsers in English, iTaukei and Fiji Hindi. Sensitive mutations cannot queue offline; stale data remains visibly stale.

## Task 5: Record release packet and hand off

**Files:**

- Create: synthetic locality release/rollback packet
- Review: support, legal/privacy, verification, training, freshness, accessibility, performance, cost and incident evidence
- Modify: post-pilot roadmap/decision log only with actual approval outcome

- [ ] **Step 1: Record locality, owner and support scope**

Document target locality, enabled branch count, founder/release owner, support hours/capacity, cohort/invite rule, enabled capabilities, disabled capabilities, public domain/route scope, rollback owner and post-activation review date.

- [ ] **Step 2: Record residual address/geocoding risks**

List manual verification gaps, coordinate/directions limitations, exceptional-hours risks, language/accessibility defects and fallback guidance. Do not add automatic geocoding to hide uncertainty.

- [ ] **Step 3: Run repository checks**

Run format, lint, typecheck, tests, build, contract/Worker/browser/security/accessibility checks and relevant local Wrangler validation only without deployment or credentials. Record synthetic fixture counts and exact outcomes.

- [ ] **Step 4: Commit only approved scope**

Commit only approved Task 25 changes with `feat: add gated synthetic Fiji branch activation controls`. Do not stage real locality data, location traces, provider credentials, production flags or unrelated changes. No external activation occurs from this task alone.
