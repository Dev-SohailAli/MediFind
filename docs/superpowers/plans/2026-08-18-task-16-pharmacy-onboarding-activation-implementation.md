# Task 16 Pharmacy Onboarding and Activation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a server-validated, branch-scoped pharmacy onboarding and activation workflow for the founder-approved, invite-only Suva pilot. A branch may become public or receive protected requests only after its owner acceptance, verification, role setup, MFA, training, hours, listing-refresh and escalation readiness are all current.

**Architecture:** The Cloudflare Worker is the only authority for onboarding, readiness, capability state and transition authorization. D1-backed records are private and append-only where policy requires; the browser receives only the minimum role-scoped checklist/status projection. Public search remains safe and available when a branch is unready, suspended or revoked. Activation is capability-specific: prescription/reservation access and public listing visibility are disabled independently when their prerequisites fail. Synthetic exercises use fake data only; this task does not authorize production activation or prescription files.

**Tech Stack:** Existing `apps/web` PWA, existing optional `apps/worker` and contract packages, server-owned D1 schemas/routes only after the approved protected-pilot gates, typed command/result contracts, idempotency and optimistic concurrency, append-only audit events, accessible React UI and deterministic synthetic tests. Do not add an identity vendor, notification provider, binding, upload path, quiz system, health field, analytics SDK or new route without an approved decision.

**Spec:** `docs/claude-tasks/operations/task-16-pharmacy-onboarding-activation.md`, `docs/pharmacy-onboarding-and-training.md`, `docs/pilot-pharmacy-agreement.md`, `docs/pilot-operations.md`, `docs/data-dictionary-and-ownership.md`, `docs/audit-log-policy.md`, `docs/staff-access-lifecycle-policy.md`, `docs/pharmacy-verification-policy.md`, `docs/public-notice-and-legal-identity.md`, `docs/security-privacy-compliance.md`, `docs/accessibility-policy.md`, and accepted Tasks 8-15 evidence/decisions.

## Global Constraints

- Do not implement or enable this workflow until Tasks 8-12 have accepted evidence, Task 15 has approved pilot agreement/legal notices and verified support ownership, and the founder has approved the invite-only Suva cohort controls.
- Do not infer legal, pharmacy, privacy, security, cost, identity, notification, retention, translation or training approval from a draft document. A missing owner, version, reviewer, expiry, cohort rule or support contact is `FAIL - UNVERIFIED`.
- Keep all development fixtures, exercises, notifications and approval records synthetic. Never enter real buyer, pharmacy, medicine, health, prescription, contact, licensing or signed-agreement data.
- Suva is an activation audience constraint, not a replacement for the future Fiji branch/location schema. Preserve a structured `Pacific/Fiji` branch model and enforce the current cohort through server-side configuration.
- The browser cannot assign roles, approve activation, choose a cohort, extend expiry, bypass MFA, decide verification or access D1/R2/KV. Every mutation is authorized server-side by actor, role, branch, current state, version and capability.
- No free-text quiz answers, health data, prescription content, uploaded evidence or raw support correspondence is stored by this task. Training stores only module/version, learner, branch, completion/attestation time, bounded follow-up state and retraining due date.
- Do not make the branch public or eligible for protected requests while any mandatory prerequisite is missing, expired, revoked, stale or awaiting an authorized reviewer. Preserve safe search and generic UI errors.
- Do not claim hosted Cloudflare, browser-device, real notification, real-data or production results unless they are actually run and recorded.

## Task 1: Establish the activation gate and preflight evidence

**Files:**

- Create: task-specific synthetic gate/evidence record only if the brief's evidence convention approves one
- Modify: `docs/claude-tasks/operations/task-16-pharmacy-onboarding-activation.md` to link this plan and record implementation outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md` to link this plan
- Read: accepted Tasks 8-15 evidence, final agreement/legal notice versions, support owner and founder cohort decision

**Interfaces:**

- Input: accepted protected identity/session/recovery, pharmacy verification, listing, reservation/status/notification and public-support decisions; approved agreement/training content versions; founder-owned Suva invite configuration.
- Output: a fail-closed branch activation checklist, explicit prerequisite/capability matrix, transition owner and evidence references.

- [ ] **Step 1: Record gate rows before implementation**

Use explicit PASS/FAIL rows for: protected-task evidence, operator/legal approval, support owner/hours/escalation, agreement/privacy/safety versions, founder-approved Suva invite cohort, verified branch and expiry, authorized owner continuity, required role matrix, privileged MFA, current branch hours, daily listing-refresh acknowledgment, training module versions/retraining dates, synthetic exercise results, support/security escalation acknowledgment, audit/retention decision, rollback owner and review date.

- [ ] **Step 2: Fail closed on incomplete evidence**

Keep activation unavailable when any row is missing or expired. Do not create a production collection or route merely to reserve future fields. Use synthetic fixtures and a visible internal `NOT READY` status until the gate is approved.

- [ ] **Step 3: Define capability mapping**

Document which prerequisite controls `publicListing`, `otcReservation`, `prescriptionRequest`, `prescriptionReview` and branch operational access. An expired verification, revoked owner, lost reviewer continuity or kill switch must disable only the affected capability where policy permits; it must never make an unsafe public projection appear current.

## Task 2: Define typed readiness contracts and safe projections

**Files:**

- Modify: existing shared contracts/types and Worker route contracts only in the approved task scope
- Create: focused activation/readiness schemas, command/result validators and fixture factories
- Read: `docs/data-dictionary-and-ownership.md`, `docs/audit-log-policy.md`, staff/verification policies and the accepted session contract

- [ ] **Step 1: Model explicit lifecycle and checklist states**

Use approved names for setup, pending review, ready, active, suspended, expired and revoked (or document the exact alternative before coding). Model each checklist item with bounded state, evidence reference, effective/expiry time where applicable and safe reason category. Do not use a single boolean that conflates readiness, activation and capability suspension.

- [ ] **Step 2: Model minimum records**

Cover branch and organisation references, agreement/notice version and hash, accepting owner, training module/version/learner/completion/retraining, owner/reviewer/inventory assignments, MFA readiness, hours version, listing-refresh acknowledgment, exercise outcomes, support/security acknowledgment, cohort scope, reviewer/activation actor and optimistic-concurrency version. Use opaque IDs and UTC server timestamps; display times in `Pacific/Fiji`.

- [ ] **Step 3: Define public and protected projections**

The owner/staff checklist exposes only the actor's branch-scoped readiness and safe next action. Buyer/public projections expose only approved branch/listing fields and never checklist reasons, staff names, agreement hashes, verification evidence, support cases, audit metadata or prescription state. Failed authorization and unknown branch cases remain generic.

## Task 3: Add server-owned persistence and transition invariants

**Files:**

- Modify: approved Worker/D1 schema and repository layer only after the gate passes
- Modify: existing server-only audit/retention abstractions
- Create: migration and repository tests for activation/readiness records
- Read: data dictionary, audit-log policy, verification policy, staff-access lifecycle and retention/deletion decisions

- [ ] **Step 1: Add the narrowest approved schema**

Create only the records needed for activation checklist state, agreement acceptance reference, training completion, readiness review and capability state. Include immutable IDs, schema/version, created/updated timestamps, branch scope, state/version and safe audit references. Do not add evidence blobs, prescription objects, health fields, unbounded notes or speculative provider columns.

- [ ] **Step 2: Enforce transition invariants in the repository/service**

Require current state, expected version and authorized actor for every transition. A branch can enter `active` only when verification is current, owner continuity and required roles/MFA are valid, agreement acceptance is current, training is current, hours and refresh acknowledgment are current, required exercises pass and support/security escalation is acknowledged. Revoke/expiry/suspension must immediately remove affected capabilities and public eligibility.

- [ ] **Step 3: Emit complete safe audit events**

Audit acceptance, training completion/follow-up, role assignment/revocation, readiness review, activation, suspension, expiry, revocation, reactivation and capability changes. Include opaque actor/target, branch/role context, action, correlation ID, safe before/after state, bounded reason/approval reference and integrity metadata. Never record agreement text, raw hashes beyond the approved reference, contact values, quiz text, prescription content, tokens or OTPs.

- [ ] **Step 4: Preserve retention and deletion boundaries**

Apply only the approved retention/deletion schedule. Make terminal transitions immutable, keep audit append-only and ensure account/branch removal or staff revocation cannot leave active sessions, invitations or capability grants. Do not implement an unapproved purge job as part of this task.

## Task 4: Implement explicit onboarding and readiness commands

**Files:**

- Modify: approved Worker command routes/services and shared command contracts
- Modify: existing staff/session/listing/reservation/status authorization helpers where a readiness check is required
- Create: command authorization, idempotency, concurrency and transition tests

- [ ] **Step 1: Record owner acceptance safely**

Accept only the approved agreement/privacy/safety versions and record version, approved hash/reference, owner account, branch, server time and privacy-approved session/device evidence. Changed terms invalidate the affected readiness capability until the authorized owner accepts the new version. Do not store signed documents or invented legal copy.

- [ ] **Step 2: Record role and MFA readiness**

Use the existing invitation, verification and MFA lifecycle. Require a verified authorized owner, named branch-scoped staff, current inventory responsibility and at least one active authorized prescription reviewer before prescription-required listing/review capability. Preserve owner and reviewer continuity rules; revoking the last reviewer disables prescription capability while safe OTC/search behavior remains available.

- [ ] **Step 3: Record training and synthetic exercise completion**

Provide role-relevant modules for boundary/support, account safety/MFA, listings/freshness, prescription review, reservations/collection and privacy/incidents/escalation. Store module/version, learner/branch, completion or attestation time, bounded follow-up and retraining due date. Record only pass/fail or follow-up categories for the required fake exercises; never record quiz answers, health data or clinical conclusions. Material workflow/agreement/security/role changes and annual active-staff refresh create a new required training version.

- [ ] **Step 4: Record operational acknowledgments**

Require current structured branch hours, daily listing-refresh acknowledgment, price/availability responsibility, pickup process and verified support/security escalation path. Validate timestamps and business-time rules server-side; a client-supplied “current” flag is not sufficient.

- [ ] **Step 5: Submit, review and activate with separate authority**

Implement only the approved commands for readiness submission, authorized review, activation, suspension, expiry, revocation, reactivation and retraining follow-up. Do not allow an owner to self-approve an activation if the final authority matrix requires an independent founder/admin reviewer. Require idempotency keys, bounded rate limits, expected version, safe errors and one audit event per accepted transition. There is no anonymous activation route.

- [ ] **Step 6: Enforce Suva invite-only scope**

Require server-side branch verification plus the founder-owned cohort flag and invite relationship. A future Fiji branch may exist in the schema but cannot activate in this pilot without the approved cohort decision. Do not reveal whether an uninvited branch or person exists.

- [ ] **Step 7: Wire capability checks into protected workflows**

Before public listing projection, OTC reservation, prescription-required listing, prescription submission or reviewer access, evaluate current branch verification, activation/capability state, role, MFA, freshness and kill-switch state. Preserve generic safe search and safe unavailable states when a capability is disabled.

## Task 5: Build the accessible web onboarding experience

**Files:**

- Modify: approved `apps/web` owner/staff onboarding and branch-operation screens
- Modify: shared API client/query invalidation only for the approved readiness contracts
- Create: component/route tests and accessible state fixtures

- [ ] **Step 1: Show a branch-scoped checklist**

Render current status, affected capability, bounded reason category, owner/action required, due/retraining date and safe support path. Separate `not ready`, `pending review`, `active`, `suspended`, `expired` and `revoked`; do not expose internal evidence or reviewer details.

- [ ] **Step 2: Support safe completion flows**

Provide explicit acceptance, staff invitation/role status, MFA readiness, training module completion/attestation, synthetic exercise confirmation, hours and daily-refresh acknowledgment, escalation acknowledgment and readiness submission. Do not add file upload, free-text clinical/quiz input, browser-stored sensitive state or client-side activation authority.

- [ ] **Step 3: Handle offline, expiry and revocation states safely**

Offline mode must not queue acceptance, role, training, readiness or activation mutations. Show last-known status with a clear stale/offline label and require server confirmation before a protected action. After expiry/revocation/suspension, invalidate relevant cached queries and show a generic capability-disabled message without disclosing sensitive reasons.

- [ ] **Step 4: Verify accessibility and language behavior**

Test keyboard flow, visible focus, semantic headings/landmarks, labels, error association, non-colour status, contrast, narrow viewports, 200% zoom, reduced motion and approved language variants. Training copy must preserve the boundary that MediFind does not provide medical advice or emergency support.

## Task 6: Rehearse the full synthetic activation lifecycle

**Files:**

- Create: synthetic acceptance and transition tests/fixtures
- Create: task-specific evidence record if approved by the repository evidence convention
- Modify: operations brief/roadmap only with actual outcomes

- [ ] **Step 1: Exercise happy-path activation**

Use a fake Suva branch, fake owner, fake reviewer/inventory staff and approved synthetic agreement/training versions. Complete all required modules and listing/reservation/prescription/quarantine/incident exercises with fake records, then verify authorized review, activation, public projection and protected capability checks.

- [ ] **Step 2: Exercise every fail-closed prerequisite**

Cover missing/expired verification, changed agreement, unverified owner, missing MFA, missing reviewer, revoked last reviewer, missing hours, stale refresh acknowledgment, incomplete/retraining-due training, failed exercise follow-up, missing escalation acknowledgment, uninvited non-Suva branch and stale cohort configuration. Verify only affected capabilities are disabled and safe search remains safe.

- [ ] **Step 3: Exercise revocation, suspension and recovery**

Revoke staff, change owner continuity, expire verification, suspend the branch, re-approve/retrain and reactivate. Verify sessions/invitations/capability grants, cached UI, public projection, protected requests, audit visibility and generic errors all converge to the server state. Do not run real notifications or real prescription flows.

- [ ] **Step 4: Record evidence without production claims**

Record commit, fixture IDs, command/result cases, audit-event checks, authorization results, accessibility/browser evidence and known limitations. Mark hosted, real-device, real-provider, real-data and production evidence as not run unless actually performed under a separate approval.

## Task 7: Verify, review and hand off

**Files:**

- Review: contracts, migration, Worker service/routes, web screens, tests and evidence
- Modify: task brief/roadmap with exact validation outcomes

- [ ] **Step 1: Run focused checks**

Run contract validation, Worker unit/integration tests, web tests, authorization/idempotency/audit tests, capability projection tests and accessibility checks. Include negative cases for cross-branch access, client role escalation, replay, stale version, missing cohort, expired training and unsafe public visibility.

- [ ] **Step 2: Run repository checks proportionally**

Run the repository's format, lint, typecheck, test, build and security checks required by the current baseline. Run relevant Wrangler validation only if it is local and no deployment/credential action is required. Do not claim hosted Cloudflare results.

- [ ] **Step 3: Review scope and cost**

Confirm no unapproved provider, binding, route, field, notification, upload, analytics, recurring cost, credential, real data or production activation was added. Confirm synthetic fixtures contain no realistic personal/health data and all privileged operations are audited.

- [ ] **Step 4: Commit only the approved task scope**

After review, stage only the Task 16 implementation, tests, approved documentation links and evidence. Use commit message `feat: add pharmacy activation readiness workflow`. Do not stage `.env` files, credentials, real agreement/support artifacts, generated production data or unrelated user changes.
