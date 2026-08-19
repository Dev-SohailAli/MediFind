# Task 20 Incident Exercises and Operational Privacy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans (recommended) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make critical containment, notification decisions, audit preservation and post-incident correction executable with synthetic data, while keeping sensitive evidence out of tickets, logs, analytics, support views and public status pages.

**Architecture:** The Worker owns incident/severity state, role/session/feature containment, scoped support/security records and safe operational status. Incident evidence is a restricted, append-only structured record with minimal references; raw prescription/document content, credentials and free-text evidence remain outside ordinary support/analytics paths. The browser shows only generic status and the authenticated, role-scoped next action. A failed critical containment exercise blocks prescription activation until corrected and retested.

**Tech Stack:** Existing `apps/web` PWA and optional `apps/worker`, typed incident/support/kill-switch contracts, server-only scoped records, synthetic incident harness, session/role revocation from Task 8, activation/capability controls from Task 16, backup/restore from Task 18, independent switches from Task 19, append-only redacted audit events and accessible safe status states. No incident SaaS, external case system, public chat, analytics/session-replay SDK, new provider or notification route is added without an approved decision.

**Spec:** `docs/claude-tasks/operations/task-20-incident-exercises-operations.md`, `docs/incident-response-runbook.md`, `docs/pilot-operations.md`, `docs/audit-log-policy.md`, `docs/security-privacy-compliance.md`, `docs/data-dictionary-and-ownership.md`, `docs/cost-circuit-breaker-policy.md`, `docs/public-support-presence.md`, accepted Tasks 8, 13, 14, 16, 18 and 19 evidence/decisions.

## Global Constraints

- Do not enable real incident handling or prescription workflows until named founder/security/compliance owners, support escalation contacts, approved retention/evidence rules and synthetic exercise scenarios are accepted.
- Use invented people, branches, records, filenames and events only. No real buyer, pharmacy, medicine, health, prescription, contact, account, OTP, password, token, incident, support conversation or production evidence may enter fixtures or logs.
- Contain first, preserve necessary evidence, then assess and communicate through approved paths. Never delete or rewrite forensic/audit evidence to make a status look healthy.
- Keep evidence minimal, structured and redacted. Prohibit raw prescription/document content, file bytes/URLs, OTPs, passwords, access/refresh tokens, authenticator secrets, full phone/email values, raw search text, unnecessary device IDs and sensitive support free text.
- Critical containment may suspend roles/branches, revoke sessions, quarantine technical file state or disable upload/reservation functions independently while preserving safe search where safe. It must not weaken authorization, backups, audit integrity or retention.
- Public status is generic and operationally useful only: affected function, start time, current state and next update. Never expose customer data, attacker content, security topology, provider secrets, internal IDs or forensic detail.
- Do not claim real alerting, support contact, legal notification, hosted status, production containment or external communication unless actually performed and recorded under approved authority.

## Task 1: Establish owners, severity and exercise gates

**Files:**

- Create: task-specific synthetic exercise gate/evidence record only if the evidence convention approves one
- Modify: `docs/claude-tasks/operations/task-20-incident-exercises-operations.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md` to link this plan
- Read: named founder/security/compliance/support owners, legal/pharmacy escalation, retention, notification, status and recovery decisions

**Interfaces:**

- Input: approved owner/contact matrix, severity rules, feature containment map, evidence/retention schedule, notification decision path and synthetic scenario cards.
- Output: versioned exercise matrix, fail-closed prescription gate, safe communication templates and corrective-action register.

- [ ] **Step 1: Record role ownership**

Name the founder incident owner, security/compliance lead, pharmacy escalation owner, support owner, recovery owner, public-status publisher and legal/pharmacy notification reviewer. Record responsibilities, separation of duties, support hours and emergency alert authority without placing private contact values in application data.

- [ ] **Step 2: Pin severity and containment rules**

Use the accepted Critical/High/Normal categories and examples. Map each class to immediate containment, owner alert, support/status behavior, evidence access, notification decision, recovery validation and post-incident review due date. A suspected prescription exposure, privileged compromise, cross-branch access, unsafe upload bypass or backup failure is Critical.

- [ ] **Step 3: Define the prescription activation block**

Set a server-owned gate that prevents real prescription activation when any Critical exercise fails, has unresolved corrective action, lacks evidence or has not been retested. Do not let a browser flag, branch owner, support user or stale cache clear the block.

## Task 2: Define restricted incident and support records

**Files:**

- Modify: approved Worker support/security record contracts from Task 14
- Create: incident exercise fixtures, redaction validators and access-scope tests
- Modify: audit record helpers only within the approved incident scope

- [ ] **Step 1: Define minimum incident fields**

Use opaque incident ID, severity, state, source/category, server timestamps, affected safe system/function/data category, containment actions, assigned owner, notification decision, recovery reference and corrective-action references. Avoid raw reporter values, content, attacker payloads and broad affected-user lists in ordinary records.

- [ ] **Step 2: Define corrective actions**

Each missed control has bounded category, owner, due date, remediation state, retest reference and approval outcome. A completed exercise is not a pass if a Critical corrective action remains open.

- [ ] **Step 3: Define scoped visibility**

Routine support sees only the minimum safe category/status needed to assist. Pharmacy owners see branch-scoped operational notices, not incident forensics or another branch's records. Admin/security roles receive least-privilege views, and every privileged lookup/export/configuration/containment action is audited.

- [ ] **Step 4: Prevent unsafe evidence paths**

Reject or redact prohibited fields at the server boundary. There is no prescription attachment route, general chat, WhatsApp intake, raw log paste, browser analytics or public status field for incident evidence.

## Task 3: Implement synthetic critical containment exercises

**Files:**

- Create: synthetic scenario harness and deterministic time/actor fixtures
- Modify: approved Worker containment commands and capability checks only where necessary
- Create: exercise result and audit assertions

- [ ] **Step 1: Rehearse suspected prescription exposure**

Using fake request/file references, revoke affected sessions/grants, suspend affected branch/roles, pause upload/review/reservation as required, preserve safe search, open a restricted incident, alert the founder path and verify no content is copied into evidence, logs, notifications or status. Do not run a real upload or scanner.

- [ ] **Step 2: Rehearse privileged MFA compromise**

Revoke sessions/factors and privileged assignments, suspend sensitive actions, open a case, preserve safe audit evidence, require approved recovery and verify least-privilege re-grant. Do not permit self-service MFA bypass or support disclosure of secrets.

- [ ] **Step 3: Rehearse malicious or unsafe file**

Use a synthetic file classification/reference only. Verify technical block/quarantine state, isolated access, no public URL/object bytes, no automatic pharmacy validity decision and independent upload/reservation switch behavior. Task 13 remains disabled unless its separate gate passes.

- [ ] **Step 4: Rehearse cross-branch authorization failure**

Attempt fake staff/admin access across branches and confirm generic denial, no record enumeration, no leaked identifiers, one safe audit/security signal and no cross-branch public/private projection change.

- [ ] **Step 5: Rehearse kill-switch activation**

Pause upload and reservation independently with a reason, actor, start/end and affected-function record. Verify safe search and permitted existing-record reads remain available, user status is generic, and re-enable requires the Task 19 fresh-authenticated recovery checks.

- [ ] **Step 6: Rehearse backup/restore failure**

Use a synthetic checksum/schema/destination failure. Keep sensitive features disabled, preserve audit evidence, route to the recovery owner, verify no production/preview write, and require integrity/authorization/audit validation before any re-enable.

## Task 4: Implement notification and public-status rehearsal

**Files:**

- Modify: approved generic in-app/status contract only
- Create: synthetic communication decision fixtures and redacted template tests
- Read: approved public support/legal/status content and notification fallback decisions

- [ ] **Step 1: Separate internal alerting from public support**

Immediate founder alerting for Critical incidents is an internal control, not a 24/7 public support promise. Pharmacy/buyer notice uses verified approved channels and only after facts/legal/pharmacy review permit it. Never send prescription, medicine, contact, token or incident detail in a notification preview.

- [ ] **Step 2: Rehearse safe public outage status**

Render affected function, start time, current state and next update time. Use generic wording for security incidents and preserve non-sensitive search availability where confirmed. Exclude root cause, attacker method, customer list, provider internals and security evidence.

- [ ] **Step 3: Rehearse communication failure**

When notification/status delivery is unavailable, record a bounded retry/fallback state and keep the authenticated in-app state authoritative. Do not retry indefinitely, duplicate notices or claim delivery without provider confirmation.

## Task 5: Run post-incident review and privacy verification

**Files:**

- Create: synthetic post-incident review and corrective-action fixtures
- Modify: incident runbook/evidence references only with accepted outcomes
- Create: privacy/redaction and audit-integrity tests

- [ ] **Step 1: Record elapsed containment and missed controls**

For every scenario, capture synthetic start/end, elapsed containment, controls exercised/missed, affected safe categories, communications rehearsal, owner, due date and retest reference. Do not record raw scenario payloads or pretend a rehearsal is a production incident.

- [ ] **Step 2: Verify audit integrity**

Assert complete events for containment, session/role revocation, feature switch, support/security case, recovery, notification decision and re-enable. Test append-only behavior, branch/role visibility, redaction, export restrictions and anomaly handling.

- [ ] **Step 3: Verify evidence retention/deletion**

Apply the approved schedule and legal holds to exercise records, audit references, backups and derivatives. Do not invent retention for opened prescription/review/reservation evidence. Any deletion/de-identification remains server-side and audited.

- [ ] **Step 4: Require retest before release**

Keep the Critical/prescription gate blocked until corrective actions are closed, the failed scenario is rerun, containment timing and missed controls are reviewed, and the founder/security/compliance owner accepts the evidence.

## Task 6: Verify UI, accessibility and operational handoff

**Files:**

- Modify: approved `apps/web` safe status/maintenance/error states only
- Create: synthetic browser/accessibility acceptance evidence
- Modify: task brief/roadmap with exact validation outcomes

- [ ] **Step 1: Test generic user states**

Cover maintenance, unavailable capability, stale status, offline, recovery hold, unauthorized, safe not-found and restored states. No state may reveal internal incident IDs, affected people's identities, prescription detail or provider errors.

- [ ] **Step 2: Test accessibility and language**

Verify keyboard/focus order, semantic status announcements, non-colour meaning, contrast, narrow layouts, 200% scaling, reduced motion and English/iTaukei/Fiji Hindi reviewed safety/incident wording.

- [ ] **Step 3: Run repository checks**

Run contract, Worker, web, security, authorization, audit, kill-switch and recovery tests plus format/lint/typecheck/test/build checks required by the baseline. Run local Wrangler validation only without deployment or credential actions.

- [ ] **Step 4: Record actual scope and limitations**

Record commit, scenario IDs, evidence hashes/references, containment times, corrective actions, owner, retest results and known gaps. Mark real incidents, production alerts, external notification and hosted status evidence as not run unless actually performed.

- [ ] **Step 5: Commit only approved exercise scope**

After review, stage only the Task 20 implementation, synthetic tests, approved documentation links and evidence. Use commit message `test: exercise synthetic incident response controls`. Do not stage real correspondence, credentials, `.env` files, prescription data, attacker content or unrelated user changes.
