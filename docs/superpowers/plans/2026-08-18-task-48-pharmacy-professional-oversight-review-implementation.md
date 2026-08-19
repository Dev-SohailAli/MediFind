# Task 48 Pharmacy-Professional Oversight Review Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maintain explicit pharmacy/professional ownership and safe stop behavior around verification, staff roles, training, prescription review and sensitive-medicine boundaries without making clinical or licensing decisions in code or documentation.

**Architecture:** A protected-workflow matrix maps capability to pharmacy owner/reviewer, evidence type and expiry, role/branch scope, training version, escalation, allowed/blocked state, buyer message and retest. The platform may technically gate access and preserve safe search; pharmacy professionals and regulators retain professional decisions.

**Tech Stack:** Existing `apps/web`, optional Worker authorization/state contracts, pharmacy verification and staff-access policies, training records, synthetic identities/documents and redacted audit evidence. No real onboarding, prescription, provider, registry, clinical classifier or external credential is added.

**Spec:** `docs/claude-tasks/stewardship/task-48-pharmacy-professional-oversight-review.md`, `docs/pharmacy-verification-policy.md`, `docs/pharmacy-onboarding-and-training.md`, `docs/requirements.md`, `docs/pilot-pharmacy-agreement.md`, `docs/incident-response-runbook.md`, `docs/staff-access-lifecycle-policy.md`, accepted Tasks 16, 30, 36, 38, 42, 45 and 47 evidence.

## Global Constraints

- Use synthetic pharmacies, staff, branches and documents only. Do not record real licence numbers, contact details, prescriptions, patient information or private agreement text.
- MediFind does not prescribe, dispense, validate a prescription clinically or decide professional licensing status. Do not invent Fiji legal/pharmacy requirements.
- Preserve individual accounts, MFA, least privilege, branch isolation, anti-enumeration, audit redaction, expiry/suspension, neutral messaging and safe search fallback.
- A pharmacy owner's ownership alone does not grant prescription access; explicit active reviewer scope and current verification are required.
- Missing, expired, disputed or unsafe evidence blocks the affected protected capability and requires named review/retest; it never triggers rerouting or a guessed approval.

## Task 1: Map protected workflows and professional ownership

**Files:**

- Create: protected-workflow ownership/evidence/training matrix
- Read: verification, onboarding, requirements, agreement, staff-access and incident policies
- Modify: task brief, stewardship README and roadmap links

- [ ] **Step 1: Enumerate capabilities**

Map verified public visibility, OTC listings/reservations, prescription upload/routing, reviewer inbox, approval/decline/expiry, break-glass support and suspension/renewal behavior.

- [ ] **Step 2: Define role boundaries**

Record pharmacy owner, responsible professional, inventory manager, prescription reviewer, verifier/admin and support scope, prohibited actions, branch context, escalation and audit requirements. Keep clinical/dispensing judgment with the pharmacy.

- [ ] **Step 3: Define evidence freshness and stop states**

Record evidence source/type, expiry or review date, material-change triggers, pending/expired/suspended/verified states, affected capabilities, neutral buyer notice and reactivation approval.

## Task 2: Review training and protected-access controls

**Files:**

- Create: training-version and attestation matrix using synthetic learners
- Create: reviewer-loss and access-revocation test cases
- Modify: staff-access/training evidence only after named reviewer acceptance

- [ ] **Step 1: Check training coverage**

Verify current modules cover pharmacy/professional boundaries, privacy/redaction, MFA/recovery, listing freshness and price, prescription workflow, reservation expiry, accessibility/language, phishing and incident escalation.

- [ ] **Step 2: Check retraining triggers**

Require a new version or review after material workflow, agreement, security, role or policy change and at the approved annual cadence. Record version, learner/branch scope, completion/attestation and bounded follow-up only.

- [ ] **Step 3: Rehearse access lifecycle**

Exercise invitation, explicit branch assignment, reviewer downgrade/removal, final-reviewer loss, MFA recovery, departure revocation and stale-session rejection. Confirm existing records remain intact and protected requests are not silently forwarded.

## Task 3: Rehearse protected-workflow safety states

**Files:**

- Create: synthetic verification-expiry, reviewer-loss, unsafe-request and break-glass results
- Modify: release/incident decision register with exact outcome

- [ ] **Step 1: Exercise verification and expiry**

Use synthetic evidence expiry, ownership/contact change and disputed document scenarios. Confirm public visibility, prescription handling and reservation behavior follow the approved state without exposing raw reasons or rerouting requests.

- [ ] **Step 2: Exercise reviewer and branch isolation**

Verify a reviewer sees only assigned-branch requests, an owner without reviewer scope cannot open prescription content, support/admin cannot make dispensing decisions and cross-branch enumeration fails safely.

- [ ] **Step 3: Exercise escalation**

Rehearse suspected unsafe upload, forged/ambiguous prescription signal, professional complaint, break-glass request and critical incident. Confirm immediate safe containment, qualified-pharmacy escalation, redacted audit and neutral buyer communication.

## Task 4: Decide, verify and hand off

**Files:**

- Create: redacted oversight matrix, training/access evidence and unresolved-risk register
- Modify: task brief, roadmap and decision log with exact outcome

- [ ] **Step 1: Apply capability stops**

Classify continue, cap, pause, prepare or seek professional/legal decision. A failed critical professional-boundary, authorization, verification or revocation test blocks the affected protected workflow until retested.

- [ ] **Step 2: Run checks**

Run formatting, link/structure, role/training matrix and approved synthetic workflow checks. Do not claim a real pharmacy, licence, professional or hosted review occurred without evidence.

- [ ] **Step 3: Commit the review**

Commit `chore: review pharmacy professional oversight boundaries`; preserve sensitive-medicine exclusions and schedule the next review after material policy, role, evidence or cohort changes.
