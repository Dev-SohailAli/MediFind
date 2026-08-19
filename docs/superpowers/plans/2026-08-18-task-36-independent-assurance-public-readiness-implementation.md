# Task 36 Independent Assurance and Public Readiness Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an evidence packet for an independent review of security, privacy, accessibility, language, safety, cost, recovery and release controls before a larger public cohort is considered.

**Architecture:** This is an assurance-readiness packet, not certification, penetration testing, deployment or public-release approval. Each control maps to direct evidence, missing evidence or an explicit limitation tied to an exact commit/environment. Critical gaps block the proposed cohort. Evidence is redacted, role-scoped and synthetic unless a separate approved protected review allows otherwise.

**Tech Stack:** Existing repository/CI checks, `apps/web`, optional `apps/worker`, synthetic browser/Worker/load/recovery evidence, audit/redaction/security reports, accessibility/language evidence, cost-breaker and rollback records, and a structured assurance matrix. No bug bounty, new assurance vendor, production penetration test, public vulnerability detail, deployment, visibility change or cohort expansion is added.

**Spec:** `docs/claude-tasks/scale-options/task-36-independent-assurance-public-readiness.md`, `docs/security-privacy-compliance.md`, `docs/security-architecture-threat-model.md`, `docs/accessibility-policy.md`, `docs/incident-response-runbook.md`, `docs/test-and-acceptance-strategy.md`, `docs/repository-security-and-delivery.md`, accepted Tasks 23-29 evidence and the founder cohort decision.

## Global Constraints

- Do not start until Tasks 23-29 are accepted or explicitly closed, an independent reviewer/review scope is named, current legal/privacy position is recorded, evidence environment is approved and the founder has decided the proposed cohort.
- This task does not declare public readiness, formal certification, production deployment, public-source visibility or cohort expansion.
- Use synthetic/redacted evidence only unless a separate written protected-review approval specifies data, region, processor, access, retention and deletion. No real prescription, health, contact, credential or private correspondence in repository/PR/public artifacts.
- Every critical control needs direct evidence or an explicit `MISSING/NOT RUN/NOT APPLICABLE` reason. Absence of a finding is not proof of safety.
- Critical privacy, authorization, safety, recovery, accessibility, cost, incident or rollback gaps block the proposed cohort until remediation and retest.
- Do not publish exploitable vulnerability details, credentials, raw logs, private reports or unsupported hosted/production claims.

## Task 1: Establish reviewer scope and evidence inventory

**Files:**

- Create: assurance scope, evidence inventory and decision packet
- Modify: `docs/claude-tasks/scale-options/task-36-independent-assurance-public-readiness.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md` to link this plan
- Read: Tasks 23-29 evidence, legal/privacy, threat model, accessibility, incident and release records

- [ ] **Step 1: Record reviewer independence and scope**

Name reviewer/organization or approved review scope, independence/conflict check, methods, environments, commit range, exclusions, evidence access, review date and report owner. Do not invent an external review result.

- [ ] **Step 2: Build control matrix**

Include identity/session/recovery, authorization/anti-enumeration, rate limits/idempotency, redaction/audit, pharmacy verification/activation, listing/price/freshness, reservation/status, prescription/quarantine status where applicable, backup/restore/deletion, cost breakers, incident response, accessibility/language, dependencies/secrets, environment separation and rollback.

- [ ] **Step 3: Classify evidence strength**

Mark direct hosted evidence, local synthetic evidence, manual browser evidence, document-only assertion, missing/not-run and limitation. Tie every row to commit/artifact/environment/fixture/reviewer and never use a narrow test to prove a broader claim.

## Task 2: Reconcile technical, operational and privacy evidence

**Files:**

- Modify: assurance matrix and residual-risk register
- Review: exact reports from Tasks 23-29 and current repository state
- Create: redacted evidence index/checksum where approved

- [ ] **Step 1: Verify security/privacy controls**

Check server-owned authorization, branch scope, anti-enumeration, safe errors, idempotency/version conflicts, session/MFA/recovery, audit redaction, direct-binding denial, retention/deletion, export/restore and no raw sensitive data in logs/metrics/notifications.

- [ ] **Step 2: Verify safety/operations**

Check verification/activation, owner/reviewer continuity, listing price/freshness, hours/expiry, reservation/status, kill switches, cost breakers, incident exercises, support escalation, recovery/re-enable and no clinical/dispensing decision by MediFind.

- [ ] **Step 3: Verify browser/language/accessibility**

Reconcile keyboard, screen reader, narrow/wide, 200% scaling, contrast, reduced motion, offline/stale/denied/security states and English/iTaukei/Fiji Hindi evidence. Record blockers and actual device/browser, not generic claims.

- [ ] **Step 4: Verify supply chain/release**

Reconcile format/lint/typecheck/test/build, secret/dependency/filesystem scans, pinned Actions/dependencies, PR/review protections, artifact hashes, environment/binding separation and rollback. Mark hosted settings not inspected when not run.

## Task 3: Define severity, remediation and retest

**Files:**

- Create: finding/remediation/retest register and release-block matrix
- Modify: decision packet with unresolved blockers

- [ ] **Step 1: Classify findings**

Use critical/high/normal with impact, evidence, affected capability/cohort, containment, owner, due date, workaround, release effect and retest method. Critical privacy/authorization/safety/recovery/rollback findings block.

- [ ] **Step 2: Require corrective closure**

Do not close a finding because a document changed. Require implementation/evidence or an explicit accepted limitation with founder/legal/security approval; update affected ADR/policy when behavior changes.

- [ ] **Step 3: Retest exact scope**

Repeat the failed control in the same or explicitly comparable environment/commit, verify no regression in safe search/offline/accessibility and record reviewer result. Do not extrapolate synthetic proof to hosted production.

- [ ] **Step 4: Protect evidence**

Store only minimal redacted references/checksums. Keep credentials, raw prescriptions, health/contact data, exploit payloads and private correspondence outside source, PRs and public artifacts.

## Task 4: Produce the public-readiness decision record

**Files:**

- Create: final assurance/public-readiness decision record
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Choose outcome**

Use `continue restricted`, `remediate and retest`, `pause/rollback` or `not ready`. Do not use `public ready` unless the founder/legal/reviewer decision explicitly defines that meaning and scope.

- [ ] **Step 2: Name boundaries**

Record approver, cohort/localities, enabled/disabled capabilities, commit, environment, reviewer scope, residual risks, support owner, rollback path and next review date. Confirm no claim exceeds tested evidence.

- [ ] **Step 3: Define follow-up**

For each gap name owner/due date/retest, and identify whether a new task/ADR/provider/legal review is required. Keep prescription/public expansion blocked where applicable.

- [ ] **Step 4: Run checks and commit packet**

Run repository quality suite and evidence-integrity/redaction/link checks; perform only approved local/browser/synthetic review. Commit `docs: prepare independent public-readiness assurance packet`; do not claim independent certification, hosted review or public readiness.
