# Task 40 Public Support, Status and Disclosure Operations Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maintain a safe, accessible, multilingual public support/legal/status presence and responsible-disclosure process as MediFind's operator, domain or cohort changes.

**Architecture:** The public presence remains a separate static asset set from authenticated `apps/web` and Worker workflows. Versioned pages have an owner, reviewed locales, source/effective/review dates, immutable artifact and rollback path. Status/disclosure content is generic and operationally useful without exposing forensic detail. The site has no forms, cookies, analytics, identity, application proxy, prescription access or sensitive operational data.

**Tech Stack:** Approved static Pages package, accessible HTML/CSS, versioned content manifest, static `security.txt`, secure headers, robots/indexing policy, deterministic artifact/request inspection and synthetic outage/disclosure/impersonation rehearsal. No public chat, WhatsApp, medical advice, support SaaS, form, advertising, new provider or public activation is added.

**Spec:** `docs/claude-tasks/stewardship/task-40-public-support-status-disclosure.md`, `docs/public-support-presence.md`, `docs/public-notice-and-legal-identity.md`, `docs/accessibility-policy.md`, `docs/incident-response-runbook.md`, `docs/repository-security-and-delivery.md`, accepted Tasks 30, 36 and 37 evidence, approved operator identity/contact and external-publishing decision.

## Global Constraints

- Do not publish or activate the public site until operator identity/contact, support/security owners, reviewed translations, domain/DNS/HTTPS/publisher evidence and explicit release decision are approved.
- Use synthetic content only until exact legal/operator facts are approved. No real buyer/pharmacy/support/incident/prescription data, credentials, private correspondence or forensic detail enters assets/logs.
- Public content must never request passwords, OTPs, authenticator codes or prescription files through unsolicited channels; it must state non-emergency/non-clinical boundaries and official channels.
- Static site remains separate: no forms, cookies, analytics, client storage, identity, API/application proxy, Pages Functions, uploads, notifications or direct D1/R2/KV access.
- Status shows only affected function, start time, current state and next update; disclosure triage remains confidential and does not publish attacker content or unfixed exploit detail.
- No external publication, deployment, domain mutation, sender setup or security-reporting contact is performed by this plan.

## Task 1: Establish page ownership and publishing gate

**Files:**

- Create: public-support/disclosure operations matrix and versioned page inventory
- Modify: `docs/claude-tasks/stewardship/task-40-public-support-status-disclosure.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md` to link this plan
- Read: Tasks 30/36/37 evidence, operator/legal identity, support/security owners and static-site approval

- [ ] **Step 1: Inventory required pages**

Map Home/what MediFind is, privacy, terms, support, status, accessibility/language, security reporting and `security.txt` with owner, content version, source date, effective/review/expiry, locales, accessibility evidence, artifact hash and rollback.

- [ ] **Step 2: Record publishing controls**

Record approved package/project, domain/DNS/HTTPS, indexing/noindex, restricted publisher, MFA/recovery, PR review, environment separation and rollback owner. Missing facts block activation.

- [ ] **Step 3: Define cadence and change triggers**

Set recurring review and immediate review for operator/domain/contact/support-hour/legal/incident/security/translation/cohort changes. Never silently leave stale contact or legal content live.

## Task 2: Maintain safe support and status content

**Files:**

- Modify: approved static content manifest/templates only with exact approved copy
- Create: synthetic outage/status/disclosure fixtures
- Review: public notices, support policy, incident runbook and accessibility/language evidence

- [ ] **Step 1: Verify support boundaries**

Publish approved support hours, official contact, account/security/technical route, pharmacy direct-contact boundary, no-WhatsApp statement, anti-phishing guidance and urgent-health/non-clinical disclaimer. Do not invent contacts or promise 24/7/emergency support.

- [ ] **Step 2: Define safe outage status**

Use structured affected-function, start-time, current-state and next-update fields. Exclude internal IDs, stack/provider details, customer data, incident forensics and attacker methods.

- [ ] **Step 3: Define disclosure intake**

Document published security contact/process, one-business-day acknowledgement target, confidential triage, severity/escalation, founder/security owner, remediation/retest, reporter communication and decision not to publish sensitive details. No paid bounty is implied.

- [ ] **Step 4: Keep channel rules clear**

Static site is informational, not a support inbox. Authenticated in-app support remains authoritative for account/technical cases; pharmacy handles medicine/prescription/reservation questions through verified contact. No prescription attachment/form route.

## Task 3: Verify static restrictions and accessibility

**Files:**

- Create: artifact/request/capability inspection checks
- Create: keyboard/screen-reader/language acceptance evidence
- Modify: no app/API capability

- [ ] **Step 1: Inspect generated artifact and requests**

Prove required routes are static, unknown/function/API paths do not proxy to Worker/app, and output contains no cookies, forms, storage, analytics, identity, uploads, secrets, bindings, private data or unapproved external requests.

- [ ] **Step 2: Verify security and indexing**

Check HTTPS/security headers, content type, frame/referrer/permissions policy, cache/indexing/robots and static `security.txt` fields against approved evidence. Do not claim hosted inspection if not run.

- [ ] **Step 3: Test accessibility and language**

Verify keyboard/focus, semantic headings/links, screen-reader labels, contrast, 200% scaling, narrow layout, reduced motion, non-colour status and English/iTaukei/Fiji Hindi reviewed content.

## Task 4: Rehearse outage, disclosure and impersonation scenarios

**Files:**

- Create: synthetic operations scenarios and redaction assertions
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Exercise outage update**

Use a fake affected function and verify generic status, next-update cadence, safe search/support guidance and no sensitive topology or customer detail.

- [ ] **Step 2: Exercise vulnerability disclosure**

Use a synthetic report to verify acknowledgement, confidential triage, severity/escalation, containment/retest, owner/due date, reporter communication and safe publication decision.

- [ ] **Step 3: Exercise impersonation/phishing**

Verify guidance never repeats attacker content unnecessarily, requests no secrets/files, routes users to verified channels and creates a structured internal case without raw message/contact data.

- [ ] **Step 4: Record rollback**

Restore a prior synthetic static artifact, verify content/version/headers/indexing and record owner, artifact hashes and no data deletion.

## Task 5: Run checks and hand off

**Files:**

- Review: content matrix, static artifact, checks, evidence and rollback
- Modify: task brief/roadmap with actual result

- [ ] **Step 1: Run quality and link checks**

Run format/lint/typecheck/test/build/security checks for the package, static request/capability inspection, document/link checks and accessibility checks. Do not deploy.

- [ ] **Step 2: Record exact hosted status**

If an approved hosted inspection occurs, record URL, commit/artifact hash, date, browser/viewport and response evidence. Otherwise mark hosted/publication evidence not run.

- [ ] **Step 3: Commit only approved governance scope**

Commit `docs: govern public support and disclosure operations`; do not stage real incidents, private reports, credentials, contact placeholders or unrelated changes.
