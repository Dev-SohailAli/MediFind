# Task 38 Operator, Legal Identity and Obligations Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep MediFind's operator identity, public notices, pharmacy agreements, commercial posture, liability, insurance and tax/registration assumptions current before any material external operation.

**Architecture:** This is a legal-readiness decision packet, not legal advice, incorporation, contract signing or publication. It maps the current service state to required operator/notice/agreement dependencies and records an explicit approved identity or a fail-closed block. No founder identity is guessed or disclosed; no legal wording is invented.

**Tech Stack:** Versioned Markdown decision matrix, redacted evidence references, notice/agreement dependency manifest, review/expiry schedule and document/link checks. No account, provider, payment, insurance, registration, contract-signing, public publishing or runtime code change is authorized.

**Spec:** `docs/claude-tasks/stewardship/task-38-operator-legal-identity.md`, `docs/public-notice-and-legal-identity.md`, `docs/business-and-commercial.md`, `docs/pilot-pharmacy-agreement.md`, `docs/public-support-presence.md`, `docs/product-brief.md`, Tasks 30-37 evidence and current Fiji legal review.

## Global Constraints

- Do not start until Tasks 30-37 are accepted or explicitly closed, a named Fiji legal reviewer exists, the founder has decided the operating structure and current registration/tax/contract/liability/insurance/privacy-controller advice is available.
- Never guess or publish the operator identity, address, contact, governing law, dispute process, registration, tax, insurance or liability wording. Missing evidence blocks external activation.
- This task does not incorporate, sign contracts, purchase insurance, collect payment, disclose the founder publicly, publish notices or change the service boundary.
- Use redacted references only. No confidential legal correspondence, personal data, signed agreements, credentials, real buyer/pharmacy data or prescription content enters the repository.
- Preserve current synthetic-only status and the rule that real prescriptions remain disabled until the approved legal/privacy/retention gates pass.

## Task 1: Establish the operator and legal-readiness gate

**Files:**

- Create: operator/legal identity decision matrix and evidence record
- Modify: `docs/claude-tasks/stewardship/task-38-operator-legal-identity.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md` to link this plan
- Read: Tasks 30-37 decisions, legal identity, business, agreement, support and public-presence records

- [ ] **Step 1: Record operating-structure decision**

Capture approved structure/status, operator/controller/contracting-party identity, legal review reference, effective date, review/expiry date and owner. If not approved, mark external activation `BLOCKED - OPERATOR UNVERIFIED`.

- [ ] **Step 2: Define required identity facts**

List approved contact method, business address where required, governing law/dispute information, registration/tax disclosures, insurance/liability position and privacy-controller responsibilities. Do not populate placeholders in public copy.

- [ ] **Step 3: Define paid-operation triggers**

Record when subscriptions, payment data, employees, investors, material contracts, broader pharmacy commitments, insurance or a different data/controller role would require renewed legal/business/tax review.

## Task 2: Map notice, agreement and domain dependencies

**Files:**

- Create: versioned notice/agreement/domain/email dependency manifest
- Review: public notice, privacy/terms/support/status, pharmacy agreement and public-support package
- Modify: no public copy unless exact approved facts exist

- [ ] **Step 1: Inventory dependent documents**

Map operator identity/contact, privacy notice, terms, prescription notice, pharmacy agreement, support/safety content, security reporting, status page, domain/DNS/sender metadata and in-app acceptance records. Record content version, approver, effective/review date and affected capability.

- [ ] **Step 2: Define change propagation**

For an operating-structure change, identify which notices, agreements, acceptance records, domain/email records, translations, support material and release gates must be reviewed or re-accepted. Never silently carry old identity or terms forward.

- [ ] **Step 3: Keep public identity safe**

Verify no draft/placeholder/founder-personal identity appears in public-ready copy. Synthetic documentation may use `MediFind` only where policy permits and must not be mistaken for external legal notice.

## Task 3: Define obligations, expiry and stop path

**Files:**

- Create: obligations/review calendar and stop-report template
- Review: cost/commercial, privacy, support, insurance/liability and release evidence
- Modify: roadmap/decision log only with actual legal outcome

- [ ] **Step 1: Record obligation rows**

Track registration, tax, contracts, liability, insurance, privacy-controller, pharmacy/legal, support, domain/sender and commercial obligations with reviewer, evidence, effective/expiry date, next action and release impact.

- [ ] **Step 2: Define pending-advice behavior**

While advice is pending, keep affected external operation/public/prescription/paid capability disabled, retain safe synthetic preview and show no misleading legal promise. Do not solve uncertainty with guessed copy.

- [ ] **Step 3: Define escalation and renewal**

Set review reminders, owner escalation, material-change triggers and a safe stop/rollback path. A missed expiry blocks the affected release until current advice is recorded.

## Task 4: Verify and hand off

**Files:**

- Review: redacted matrix, dependency manifest, calendar and stop report
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Run document checks**

Run Markdown/link and copy-completeness checks. Confirm no private correspondence, placeholder identity, personal contact, signed contract or credential is present.

- [ ] **Step 2: Record decision**

State approved operator or exact blocker, affected capabilities, owner, legal reviewer, review/expiry dates, next action and explicit non-goals. Do not call the result legal advice or public activation approval.

- [ ] **Step 3: Commit only the packet**

Commit approved documentation with `docs: record operator identity and legal readiness gates`; do not publish, sign, provision, collect money or modify runtime code.
