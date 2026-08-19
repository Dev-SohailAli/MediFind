# Task 49 Child, Dependent and Vulnerable-User Safeguards Review Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the approved adult-account-for-child/dependent boundary with explicit data minimization, authority, safety and handoff evidence without creating minor accounts, identity verification or unsupported consent behavior.

**Architecture:** A dependent-scenario matrix maps actor, relationship, field, recipient, purpose, access, retention, deletion/correction state, language, safety message and stop condition. The selected verified pharmacy receives only the approved minimum; uncertain authority or unsafe state fails closed and escalates.

**Tech Stack:** Existing `apps/web`, Worker authorization and data contracts, privacy/data dictionaries, translation keys, accessibility checks, synthetic identities and redacted audit evidence. No new identity provider, age/consent service, data field, analytics, real dependent record or protected external service is added.

**Spec:** `docs/claude-tasks/stewardship/task-49-dependent-user-safeguards-review.md`, `docs/requirements.md`, `docs/security-privacy-compliance.md`, `docs/data-dictionary-and-ownership.md`, `docs/experience-and-content.md`, accepted Tasks 39, 45, 47 and 48 evidence.

## Global Constraints

- Treat the current v1 boundary as a decision to review, not permission to expand it: no minor accounts, reusable dependent profiles, DOB/government-ID/medical-history collection or consent provider.
- Use synthetic adult, child/dependent, pharmacy, staff and support identities only. Do not record real patient names, health details, prescriptions, contact values or private legal advice.
- Preserve least privilege, selected-pharmacy-only routing, branch isolation, anti-enumeration, audit redaction, retention/deletion rules, accessibility and multilingual safety copy.
- Do not infer legal authority, age-of-consent requirements or clinical responsibility. Escalate uncertainty to the named Fiji legal/privacy/pharmacy reviewers.
- A data-minimization, authorization, safety or privacy failure blocks the affected dependent/prescription workflow until corrected and reviewed.

## Task 1: Map dependent data and authority

**Files:**

- Create: dependent-field/recipient/retention/access matrix
- Read: requirements, data dictionary, privacy/security, content and professional-boundary policies
- Modify: task brief, stewardship README and roadmap links

- [ ] **Step 1: Enumerate current states**

Map self, child, dependent, correction, deletion, pending prescription, opened prescription, reservation, pharmacy suspension and support/escalation states.

- [ ] **Step 2: Record minimum data flow**

For each field record purpose, actor entry, recipient, branch scope, display, audit representation, retention/deletion behavior and prohibited copies. Confirm the selected pharmacy does not receive unrelated buyer profile data.

- [ ] **Step 3: Identify authority uncertainty**

Define neutral clarification/error, escalation owner and stop state for unclear relationship or authority. Do not add a new verification method or expose whether an inaccessible record exists.

## Task 2: Review content and interaction safeguards

**Files:**

- Create: synthetic multilingual/content/accessibility checklist
- Modify: content and privacy decision record only after reviewer acceptance

- [ ] **Step 1: Check explanations**

Review self-attestation, relationship choice, patient-name entry, selected-pharmacy disclosure, retention/deletion, non-clinical boundary and pharmacy responsibility in English, iTaukei and Fiji Hindi.

- [ ] **Step 2: Check accessible safe states**

Verify labels, focus, errors, 200% scaling, screen-reader output, contrast, keyboard flow, reduced motion and offline/retry behavior without exposing dependent data in notifications or cached browser state.

- [ ] **Step 3: Check harmful inference**

Confirm copy does not imply MediFind verified age, authority, diagnosis, treatment, prescription validity, dispensing approval or legal compliance.

## Task 3: Rehearse privacy and pharmacy handoff scenarios

**Files:**

- Create: synthetic scenario results and redacted finding register
- Modify: authorization, retention/deletion and incident evidence with exact outcome

- [ ] **Step 1: Exercise routing and isolation**

Verify only the selected verified pharmacy receives approved dependent data and prescription content; other pharmacies, branches, support and generic notifications receive no unauthorized detail.

- [ ] **Step 2: Exercise correction/deletion conflict**

Rehearse buyer correction, pre-open deletion, opened-record retention, pharmacy suspension and unresolved legal hold using safe states and approved retention policy. Do not invent deletion outcomes.

- [ ] **Step 3: Exercise support and incident response**

Test unclear authority, suspected disclosure, account compromise and unsafe upload. Confirm anti-enumeration, redacted audit, least privilege, escalation and no clinical/legal decision by support or admin.

## Task 4: Decide, verify and hand off

**Files:**

- Create: redacted safeguards matrix, scenario results and decision-options register
- Modify: task brief, roadmap and decision log with exact outcome

- [ ] **Step 1: Classify the outcome**

Recommend continue current boundary, restrict/cap the affected workflow, pause it, or prepare a separate legal/product decision. Do not activate a new consent or minor-account capability.

- [ ] **Step 2: Run checks**

Run formatting, link/structure, data/privacy matrix, locale/accessibility and approved synthetic scenario checks. Do not claim legal compliance, hosted validation or real-user evidence.

- [ ] **Step 3: Commit the review**

Commit `chore: review dependent user safeguards`; schedule re-review after legal advice, data-field, workflow, pharmacy, retention or language changes.
