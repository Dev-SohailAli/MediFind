# Task 39 Privacy Rights, Retention and Data Governance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the logical data dictionary and deletion principles into an approved, repeatable governance model for rights requests, retention, export, deletion, backups, audit records and processor changes.

**Architecture:** The Worker remains the only authority for authenticated rights requests, data maps, retention/deletion state, export and audit. Every record, derivative, backup, export, metric, support case and scanner artifact has an explicit owner/classification/access/retention rule or a recorded block. Rights responses are scoped and anti-enumeration-safe; prescription content is never exposed outside the approved relationship. Until legal/pharmacy retention approval exists, real prescription handling stays disabled.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, shared rights/request contracts, server-side data-map and retention evaluators, Task 18 export/restore/deletion harness, synthetic fixtures, redacted audit, idempotency/version checks and accessible safe states. No real-data migration, unapproved retention period, broad admin access, data broker, analytics expansion or cost-driven deletion is added.

**Spec:** `docs/claude-tasks/stewardship/task-39-privacy-rights-retention-governance.md`, `docs/security-privacy-compliance.md`, `docs/data-dictionary-and-ownership.md`, `docs/requirements.md`, `docs/audit-log-policy.md`, `docs/claude-tasks/operations/task-18-backup-restore-deletion.md`, accepted Tasks 27, 36 and 37 evidence, named privacy/data owner and Fiji legal/pharmacy review.

## Global Constraints

- Do not implement protected rights/retention behavior until Task 27/36/37 evidence, named privacy/data owner, Fiji legal/pharmacy review and approved classification/retention schedule exist.
- Never invent legal bases, retention periods, rights deadlines, legal holds, processor terms or deletion exceptions. Missing schedule means the affected workflow is blocked.
- Use synthetic accounts, requests, records, backups and exports only. No real buyer/pharmacy/health/prescription/contact data or production backup enters fixtures, logs or evidence.
- Rights handling must be authenticated, scoped, anti-enumeration-safe, idempotent, versioned, auditable and accessible. It must not expose another person's records or prescription content outside approved relationship.
- Deletion/de-identification never weakens audit integrity, legal hold, incident evidence, opened-request/reservation retention or backup controls. Never delete to reduce cost.
- Browser storage/cache is not the authority; server deletion must address projections, derivatives, exports, backups and scanner artifacts under the approved schedule.

## Task 1: Establish data map and approval matrix

**Files:**

- Create: classification/retention/rights approval matrix
- Modify: `docs/claude-tasks/stewardship/task-39-privacy-rights-retention-governance.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md` to link this plan
- Read: accepted Task 18/27/36/37 evidence, data dictionary, legal/pharmacy schedule and processor review

- [ ] **Step 1: Map every record and derivative**

Cover user/contact/session/consent/recovery, pharmacy/verification/staff/agreement/training, catalog/listing/projection/report, reservation/request/prescription metadata/file/access grant, audit/security/support, feature flag/metric/rate-limit/maintenance, exports/backups/derivatives/cache/scanner artifact.

- [ ] **Step 2: Record governance fields**

For each class record purpose, owner, classification, access path, processor/region, retention trigger/period, legal hold, correction, export, deletion/de-identification, backup treatment, evidence source and review date. Mark unresolved rows blocked.

- [ ] **Step 3: Define policy/version changes**

Record how a changed privacy notice, processor, region, purpose or retention rule triggers review, consent/notice update, migration, deletion/backfill, staff training and release/rollback decisions.

## Task 2: Define scoped rights request lifecycle

**Files:**

- Create: rights request/state contracts and safe response templates
- Modify: approved Worker/account/deletion service only after gate
- Create: authorization, anti-enumeration, idempotency and audit tests

- [ ] **Step 1: Model explicit states**

Use approved states such as submitted, identity-check, scoped, in-review, fulfilled, partially-restricted, refused-with-reason, withdrawn and closed, with requester scope, purpose, version, owner, timestamps, hold/reference and audit IDs. Do not expose internal evidence.

- [ ] **Step 2: Define access/correction/export behavior**

Return only the requester's permitted profile/status/data categories, explain unavailable/restricted records safely and route corrections through authorized record owners. Export logical/redacted data with manifest/version/checksum, never raw database dumps, tokens, private object URLs or prescription content outside selected branch scope.

- [ ] **Step 3: Define deletion/de-identification behavior**

Revoke sessions/notifications/roles where required, remove eligible profile/contact/projection data, preserve approved opened-request/reservation/audit/incident records and follow legal holds. Verify completion across derivatives, caches, exports and backups according to the approved schedule.

- [ ] **Step 4: Protect anti-enumeration**

Unknown account/request, cross-user, cross-branch and unauthorized admin requests return generic safe results. Every accepted/rejected/conflicted request is audited without raw evidence, contacts, OTPs or prescription content.

## Task 3: Integrate backup, processor and audit governance

**Files:**

- Modify: Task 18 export/restore/deletion manifests and retention evaluator only within approved scope
- Create: processor-change and backup/derivative verification tests
- Review: audit log, recovery, incident and cost controls

- [ ] **Step 1: Propagate rules to backups/exports**

Ensure class-level retention/deletion/legal-hold rules apply to primary records, projections, exports, backups, object metadata, scanner artifacts and browser/service-worker caches. Do not delete an entire backup to satisfy one request when the approved schedule forbids it.

- [ ] **Step 2: Handle processor changes**

Require privacy/legal/region/security/cost review, data map update, notice/contract update, export/migration rehearsal, access revocation and rollback before a provider/processor change. No provider is selected by this task.

- [ ] **Step 3: Preserve audit evidence**

Rights, retention, export, deletion, legal-hold, processor-change and exceptional access actions emit redacted append-only events. Audit events themselves follow the approved schedule and cannot be edited by routine users/admins.

## Task 4: Rehearse synthetic failures and hand off

**Files:**

- Create: synthetic rights/retention/export/restore/deletion fixtures and report
- Modify: task brief/roadmap/decision log with exact outcomes

- [ ] **Step 1: Test lifecycle failures**

Cover duplicate/replayed request, partial fulfillment, identity failure, cross-scope request, provider unavailable, export checksum failure, restore mismatch, deletion retry, legal hold and audit append failure. Verify safe state and no premature deletion.

- [ ] **Step 2: Test privacy/accessibility**

Verify no raw prescription/health/contact/evidence leakage in response, logs, exports, notifications or browser cache. Test keyboard, focus, screen-reader, language, offline and safe-error states.

- [ ] **Step 3: Record unresolved legal items**

Attach only redacted matrix/evidence references, owner, reviewer, cadence, blocked rows and next action. Do not claim rights/retention readiness before approval.

- [ ] **Step 4: Run checks and commit**

Run format, lint, typecheck, tests, build, synthetic rights/deletion/export/redaction/retention-map checks and relevant local Wrangler validation only without deployment/credentials. Commit `docs: define privacy rights and retention governance`.
