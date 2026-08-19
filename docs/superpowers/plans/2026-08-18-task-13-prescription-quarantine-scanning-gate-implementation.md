# Task 13 Prescription Quarantine and Scanning Gate Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare the evidence packet and synthetic rehearsal needed to decide whether MediFind may implement a private prescription quarantine/scanning workflow. This plan is a high-risk gate and conditional design only; it does not authorize upload, R2, scanner, real prescription data or production activation.

**Architecture:** Until every required gate passes, the browser has no upload control/route, the Worker has no upload command, R2 has no binding, and no scanner or object URL exists. After a separately accepted gate, the conditional boundary is browser → authenticated Worker → private quarantine object → isolated least-privilege asynchronous scanner → generic status; only the selected pharmacy reviewer may receive an authorized short-lived review path. The scanner reports technical safety state and never decides clinical validity or dispensing.

**Tech Stack:** Documentation and evidence matrix first; synthetic document fixtures, local Worker test harness and approved provider-neutral interfaces only after approval. Any exact R2 product/region, object lifecycle, scanner engine/source, job platform, binding, route, cost or credential remains undecided until recorded by the founder/legal/privacy/security/cost gate.

**Spec:** `docs/claude-tasks/future/task-13-prescription-quarantine-scanning.md`, `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`, `docs/worker-and-upload-pipeline.md`, `docs/prescription-scanning-workflow-policy.md`, `docs/security-privacy-compliance.md`, `docs/security-architecture-threat-model.md`, `docs/public-notice-and-legal-identity.md`, `docs/incident-response-runbook.md`, `docs/cost-circuit-breaker-policy.md`, `docs/cost-and-environment-plan.md`, `docs/account-recovery-runbook.md`, `docs/audit-log-policy.md` and accepted Task 7–12 evidence/decisions.

## Global Constraints

- The current status is `NOT EXECUTABLE`. Do not write application code, add a route, create an R2 binding/bucket, upload a file, provision a scanner, run a remote command or enable a feature while any gate is missing.
- Keep this track synthetic-only. Use harmless generated documents/metadata and synthetic identities; never use real prescriptions, patient names, pharmacy contacts, health data, credentials, object URLs or production exports.
- Do not select a provider, region, processor, scanner engine, signature source, job platform, retention period, legal identity or cost ceiling by default. An absent or conflicting fact is `FAIL — UNVERIFIED`.
- No public bucket/object URL, browser-direct object write, third-party/public malware scanner, client database, sensitive offline queue, routine admin file access or scanner clinical decision is allowed.
- Preserve the web-only Cloudflare architecture and current ADR-272 authority. Do not revive Firebase, Google Cloud, Cloud Run, API Gateway, Firestore, native apps or native push; any historical decision that names them is superseded unless explicitly re-decided under the active architecture.
- Prescription upload remains independently disabled even if search, OTC reservations, status reads or other protected workflows are approved.
- Never place prescription content, file bytes/URLs, raw contacts, tokens, scanner diagnostics or health data in logs, notifications, analytics, public URLs, support free text or generic errors.

## Task 1: Establish the fail-closed high-risk gate record

**Files:**

- Create: `docs/evidence/2026-08-18-task-13-prescription-quarantine-gate.md`
- Modify: `docs/claude-tasks/future/task-13-prescription-quarantine-scanning.md` only to link the gate record/plan
- Modify: `docs/README.md` and the protected-pilot roadmap to link this plan
- Read: the Task 7 approval packet and exact founder/legal/privacy/security/cost evidence

**Interfaces:**

- Input: Task 7 `G-10` high-risk gate, exact product/region/processor terms, legal/privacy review, independent security assessment, cost/recovery evidence and synthetic rehearsal results.
- Output: a versioned `PASS`/`FAIL — UNVERIFIED`/`FAIL — CONFLICTING` record with named owner/reviewers, source citations, expiry/review date, blockers, rollback and explicit upload-disabled status.

- [ ] **Step 1: Define stable prescription gate IDs**

Use stable IDs for the following independent rows:

| ID | Required evidence |
| --- | --- |
| `P-01` | Exact R2 product, region, processor/subprocessor and Fiji transfer/legal position |
| `P-02` | Private object key scheme, bucket/access configuration, content types and public-URL denial |
| `P-03` | 10 MB/10-page limits, accepted file types, parser behavior and request/body limits |
| `P-04` | Retention/deletion schedule before and after selected-pharmacy opening, buyer cancellation boundary and backup/derivative deletion |
| `P-05` | Worker authentication, selected-pharmacy/branch authorization, fresh reviewer MFA, download grants and direct-binding denial |
| `P-06` | Isolated least-privilege scanner identity/job boundary and no clinical/dispensing decision authority |
| `P-07` | Malware engine/source, signature/update provenance, freshness threshold and stale-definition fail-closed behavior |
| `P-08` | Timeout/unknown/provider-failure handling, retry cap, backlog/replay/idempotency and generic status states |
| `P-09` | Access logging, audit redaction, support/break-glass limits, notification/privacy contract and anti-enumeration |
| `P-10` | R2/D1 export, backup/restore, deletion verification, incident containment and recovery owner |
| `P-11` | Cost forecast, 50/80/100% alerts, upload/scan breaker, quota behavior, pause/re-enable authority and rollback |
| `P-12` | Fiji legal/privacy/pharmacy/translation approval, independent security assessment and release owner/date |

- [ ] **Step 2: Record status without inventing approval**

Mark every row unresolved until authoritative evidence is attached or safely referenced. The current record must state `Prescription upload/scanning: DISABLED` and identify the exact evidence owner for each failed row.

- [ ] **Step 3: Define acceptance and expiry**

Require founder acceptance plus Fiji legal/privacy/pharmacy review, independent security review and cost/recovery owner sign-off. Record evidence version, scope, decision date, expiry/review date and the event that immediately revokes approval.

## Task 2: Complete legal, privacy, data and public-notice evidence

**Files:**

- Modify: `docs/evidence/2026-08-18-task-13-prescription-quarantine-gate.md`
- Read: `docs/public-notice-and-legal-identity.md`, `docs/security-privacy-compliance.md`, `docs/data-dictionary-and-ownership.md`, applicable Fiji legal/pharmacy review and the approved Task 7 packet

- [ ] **Step 1: Approve the data and purpose matrix**

List minimum buyer/account-holder, request-scoped patient/relationship, selected branch, file technical metadata, scan result and reviewer decision categories with purpose, access role, legal/consent basis as advised, export, retention, deletion and backup treatment. Do not use diagnosis, clinical interpretation or unnecessary identity fields.

- [ ] **Step 2: Approve lifecycle and cancellation boundaries**

Document deletion before selected-pharmacy opening, what changes after opening, expiry, buyer cancellation, pharmacy decision, quarantine/unknown retention and account deletion. No real upload is permitted while the schedule is unset; the packet must not turn an old provisional ADR into a retention approval.

- [ ] **Step 3: Approve public disclosures and translations**

Require the approved MediFind operator identity, selected-pharmacy-only disclosure, technical quarantine/scanning explanation, pharmacy decision authority, non-clinical boundary, support/safety notice and complete English/iTaukei/Fiji Hindi review. Do not invent legal copy or publish placeholder identity/contact details.

## Task 3: Approve private storage, access and recovery design

**Files:**

- Modify: the gate record only; no `apps/`/`packages/` implementation files
- Read: `docs/worker-and-upload-pipeline.md`, `docs/security-architecture-threat-model.md`, `docs/account-recovery-runbook.md`, `docs/incident-response-runbook.md` and exact provider terms

- [ ] **Step 1: Approve R2 and object lifecycle facts**

Record exact region/processor terms, private bucket/project separation, opaque non-guessable object-key construction, allowed content types, size/page limits, lifecycle/deletion rules, versioning/backup behavior, access logs and public URL/direct write denial. Free allowance is not a privacy or safety approval.

- [ ] **Step 2: Approve Worker grant and reviewer access**

Define authenticated upload command, opaque request/scan reference, selected branch binding, reviewer role, fresh MFA, short-lived one-use access grant, download/preview restrictions, revocation and break-glass rules. Ordinary clients, non-reviewer staff and routine admins must have no file read path.

- [ ] **Step 3: Approve backup/restore and incident actions**

Rehearse export, restore into an isolated synthetic environment, deletion verification, compromised-key/session revocation, quarantine isolation, feature kill switch, safe search preservation and founder alert. A critical exercise failure blocks all real activation.

## Task 4: Approve scanner isolation and fail-closed behavior

**Files:**

- Modify: the gate record and conditional architecture diagram only
- Read: exact engine/source terms, update provenance and independent security assessment

- [ ] **Step 1: Define the scanner boundary**

Require a non-public asynchronous scanner with a dedicated least-privilege identity that can read only the target quarantine object and write only the opaque scan result. It cannot access broad R2/D1 data, ordinary routes, buyer data or clinical decision fields.

- [ ] **Step 2: Define technical result states**

Use generic states for accepted technical processing, malware/suspicious flag, unsupported/illegible, timeout, provider failure, unknown and stale definitions. Unknown, timeout, stale or provider failure remains quarantined and unavailable for review until the approved controlled recovery/reprocess path succeeds.

The scanner must fail closed: no uncertain or unavailable result may authorize reviewer access or downstream workflow.

- [ ] **Step 3: Define update, retry and backlog controls**

Record signature/update source, authenticity, freshness threshold, stale-definition behavior, maximum attempts, idempotent job identity, queue/backlog bounds, duplicate delivery and manual reprocess owner. The scanner never labels a prescription clinically valid or tells a pharmacy to dispense.

## Task 5: Run the synthetic rehearsal before any implementation approval

**Files:**

- Create: synthetic rehearsal procedure/evidence under `docs/evidence/2026-08-18-task-13-synthetic-rehearsal.md`
- Modify: the gate record with exact results and failures
- Review only: existing local Worker/PWA test harness; do not add upload capability to the current preview

- [ ] **Step 1: Prepare harmless synthetic fixtures**

Use generated files/metadata covering supported type, unsupported type, over-10-MB, over-10-page, malformed, duplicate, synthetic suspicious/malware marker, illegible/flagged, empty, timeout and stale-definition cases. Prove fixtures contain no real or realistic prescription content.

- [ ] **Step 2: Exercise authorization and privacy**

Test anonymous upload denial, missing/expired/revoked session, wrong branch, non-reviewer staff, routine admin, reviewer without fresh MFA, selected-pharmacy-only access, unauthorized download, token/URL leakage, log/audit redaction, cross-actor enumeration and direct-binding denial.

- [ ] **Step 3: Exercise state, retry, deletion and recovery**

Test idempotent upload/job reference, duplicate delivery, timeout, unknown, stale scanner definitions, provider failure, retry cap, backlog, controlled reprocess, buyer cancellation before opening, post-opening retention, expiry, deletion, backup restore and kill-switch behavior. Every unknown result remains quarantined and generic.

- [ ] **Step 4: Exercise cost and incident controls**

Rehearse 50/80/100% warning/pause/restore, quota exceeded, provider unavailable, malicious-file alert, suspected exposure, privileged compromise, cross-branch attempt and backup failure. Record elapsed containment, safe remaining functions, founder alert, rollback and corrective actions.

## Task 6: Independent review and conditional implementation handoff

**Files:**

- Modify: gate record and rehearsal evidence
- Create only after every `P-01`–`P-12` pass: a separate approved Task 13 coding brief/implementation record
- Do not modify: application, Worker, contract, migration, Wrangler or PWA files during this gate plan

- [ ] **Step 1: Obtain independent security assessment**

Require an independent OWASP-informed review of upload validation, object access, scanner isolation, result handling, authorization, redaction, retention/deletion, recovery, cost breakers and supply chain. High/critical unresolved findings block the gate.

- [ ] **Step 2: Record conditional implementation scope**

Only after acceptance may a separate coding task implement the approved Worker upload command, private quarantine object, opaque status, isolated scanner adapter, reviewer-only fresh-MFA access and deletion/recovery paths. That task must use exact approved fields/routes/bindings and maintain the synthetic test matrix before any real activation.

- [ ] **Step 3: Preserve the clinical boundary**

The conditional implementation must expose technical safety/quarantine state only. Pharmacy-authorized reviewers decide prescription validity and dispensing; the scanner and MediFind platform do not diagnose, prescribe or approve medicine supply.

- [ ] **Step 4: Define release evidence and rollback**

Require exact commit, migration/export, synthetic results, independent review, legal/privacy/pharmacy/translation approval, browser accessibility/offline evidence, backup/restore, cost-breaker rehearsal, incident exercise, release owner and rollback/disable procedure. Approval expires when provider terms, engine source, retention or architecture changes.

## Task 7: Validate and hand off the documentation-only gate

**Files:**

- Review: gate record, rehearsal procedure/evidence, Task 13 brief, Task 7 packet, roadmap and linked policies

- [ ] **Step 1: Run documentation checks**

Run `pnpm exec prettier --check` on every modified Markdown file and a relative-Markdown-link audit. No application test/build or remote Cloudflare command is evidence for this gate.

- [ ] **Step 2: Run gate completeness checks**

Confirm every `P-01`–`P-12` row has status, evidence citation, owner, reviewer, decision date, review/expiry date, blocker and dependent release condition. Confirm the record explicitly says upload/scanning disabled while any row fails.

- [ ] **Step 3: Run prohibited-content review**

Search new evidence and plans for credentials, object URLs, real names/contacts, prescription content, health data, provider secrets, unsupported region/retention claims, public bucket language, direct browser bindings and revived native/Firebase/GCP direction.

- [ ] **Step 4: Commit documentation only**

```bash
git add docs/evidence/2026-08-18-task-13-prescription-quarantine-gate.md docs/evidence/2026-08-18-task-13-synthetic-rehearsal.md docs/claude-tasks/future/task-13-prescription-quarantine-scanning.md docs/README.md docs/superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md
git commit -m "docs: prepare prescription quarantine approval gate"
```

Do not commit external legal/security documents, credentials, real files or an approval claim that the founder/reviewers have not made.
