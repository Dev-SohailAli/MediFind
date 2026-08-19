# Task 18 Protected Backup, Restore, Export and Deletion Rehearsal Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove, using synthetic data in an isolated environment, that approved structured records and private-file metadata can be exported, backed up, restored, deleted or de-identified, and verified without bypassing authorization, retention, projection or audit boundaries.

**Architecture:** The Worker is the only export/restore/deletion authority. D1 is the authoritative structured store and R2 is only a future private-object store when the separate prescription/scanning gate passes. Public projections, protected records, restricted metadata, audit records, backups and derivatives are separate classes with explicit manifests. Restore occurs only into an isolated synthetic environment; it never writes production or a shared preview. Browser caches and public URLs are treated as separate verification surfaces, not trusted deletion mechanisms.

**Tech Stack:** Existing `apps/worker`, approved D1/R2 adapters only after provider/region/retention/recovery approval, versioned logical export manifests, encrypted backup artifacts with founder-controlled key custody, migration/checksum/foreign-key verification, server-only deletion/de-identification jobs, append-only audit events, synthetic fixtures and deterministic recovery tests. No new backup vendor, storage binding, export endpoint, key-management provider, production credential or real-data path is authorized by this plan alone.

**Spec:** `docs/claude-tasks/operations/task-18-backup-restore-deletion.md`, `docs/infrastructure-and-release-blueprint.md`, `docs/architecture.md`, `docs/cloudflare-web-architecture.md`, `docs/data-dictionary-and-ownership.md`, `docs/audit-log-policy.md`, `docs/security-privacy-compliance.md`, `docs/cost-and-environment-plan.md`, `docs/cost-circuit-breaker-policy.md`, `docs/incident-response-runbook.md`, accepted Task 7 gate, Task 8 recovery, Task 13 quarantine and Task 16-17 operations evidence.

## Global Constraints

- Do not implement or enable protected backup, export, restore or deletion until data classifications, Fiji-approved retention/deletion schedule, provider backup terms, recovery owner/contact and synthetic environment separation are approved.
- No real data, production backup, signed agreement, live prescription, buyer contact, health information, pharmacy record or production credential may be used for rehearsal.
- A free tier, existing local file, Cloudflare dashboard state or provider default does not prove backup safety, region/transfer compliance, encryption, recoverability, retention or deletion. Record evidence explicitly.
- Restore always targets an isolated synthetic environment with separate bindings and credentials. Preview cannot read protected data; production cannot be used as a test destination; no browser/API route can invoke restore directly.
- Export is a logical, versioned, least-privilege operation. It does not return raw database dumps, private object URLs, encryption keys, passwords, OTPs, tokens, prescription bytes or unredacted contacts.
- Deletion never weakens authorization, audit integrity, legal hold, incident evidence or approved opened-request/reservation retention. Do not delete records merely to reduce storage cost.
- Sessions and notification references are revoked before eligible account deletion/de-identification. Browser caches, service-worker caches, downloaded files, public projections, object derivatives and backup copies must each be addressed by the approved schedule.
- Do not claim RTO/RPO, hosted backup, encrypted key custody, restore success or production deletion unless the exact exercise was run and recorded.

## Task 1: Establish data, provider and recovery gates

**Files:**

- Create: task-specific synthetic recovery gate/evidence record only if the evidence convention approves one
- Modify: `docs/claude-tasks/operations/task-18-backup-restore-deletion.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md` to link this plan
- Read: approved data classification, retention/deletion/export/user-rights, provider/region, recovery owner/contact and cost decisions

**Interfaces:**

- Input: approved record/object classes, schedule, provider terms, environment map, recovery owner, RTO/RPO targets and rollback authority.
- Output: a versioned recovery matrix, manifest format, fail-closed state and evidence checklist.

- [ ] **Step 1: Record classification rows**

List public projection, branch/listing, identity/contact, reservation, prescription request, prescription file/metadata, audit, support/incident, rate-limit, operational metric, maintenance and backup/derivative classes. For each, record purpose, owner, access scope, region/processor, retention, deletion/de-identification, backup treatment, export eligibility and legal-hold behavior.

- [ ] **Step 2: Record environment separation**

Pin local, synthetic preview, isolated restore rehearsal, protected pilot and production status. Record separate bindings, secret ownership, account/project identity, access roles and safe teardown path. Current preview remains synthetic-only and no production environment is authorized by this task.

- [ ] **Step 3: Record recovery authority and targets**

Name the founder-controlled recovery owner/contact, reviewer/separation-of-duties requirements, approved RTO/RPO targets, backup frequency/retention, integrity evidence, rollback/forward-fix path and explicit re-enable authority. Missing evidence leaves protected restore/deletion `NOT APPROVED`.

## Task 2: Define versioned logical export and backup manifests

**Files:**

- Create: approved export/backup manifest schemas and validators
- Modify: server-only repository/adapter interfaces without exposing them to the browser
- Create: synthetic fixtures and forbidden-field tests

- [ ] **Step 1: Define safe logical export**

Use an opaque export ID, schema/version, source environment, record-class allowlist, created time, actor/approval reference, counts, per-class checksums, redaction policy and expiry. Export only the minimum records authorized for the purpose. Do not include raw query text, full contacts, secrets, prescription content or reusable object URLs.

- [ ] **Step 2: Separate public projection from protected/restricted data**

Export authoritative structured records and public projections as distinct classes with explicit relationships. A projection is not an authority for restore, authorization or deletion. Rebuild projections deterministically from eligible authoritative data after restore; never restore stale public visibility blindly.

- [ ] **Step 3: Model private-file metadata without file exposure**

For future approved R2 data, export only approved safe metadata such as object class, request reference, technical state, retention/deletion reference and integrity reference. Do not enable prescription upload, return bytes, include object URLs or create a scanner bypass. If Task 13 is not approved, keep the file class disabled in code and fixtures.

- [ ] **Step 4: Define encrypted backup evidence**

Record backup artifact class, version, environment, encrypted size/count/checksum, creation/expiry, key-reference identifier, access owner and verification result without committing keys or raw artifacts. The approved key custody/rotation/recovery procedure must be documented before any protected backup is enabled.

## Task 3: Implement export authorization and backup creation

**Files:**

- Modify: approved Worker server-only export/backup service
- Create: authorization, redaction, manifest and audit tests
- Modify: operations evidence only with actual results

- [ ] **Step 1: Enforce least-privilege export commands**

Require a freshly authenticated, founder-approved operational role, purpose/category, scope, approval/reference, current configuration and rate limit. No browser route, pharmacy owner route or routine support lookup can request a global export. Unknown users/records return generic safe errors.

- [ ] **Step 2: Apply redaction before serialization**

Prohibit passwords, OTPs, authenticator secrets, access/refresh tokens, full phone/email values, raw search text/history, prescription/document content, file bytes/URLs, unnecessary device IDs and free-text support content. Use protected references/pseudonymous IDs where investigation correlation is required.

- [ ] **Step 3: Make backup creation bounded and auditable**

Use an approved server-side bounded job with progress/checkpoint state, deterministic class ordering, retry/idempotency and safe failure handling. Emit one audit event for request, approval, completion/failure and access. Do not log manifest contents or keys.

- [ ] **Step 4: Enforce cost and provider breakers**

Before large export/backup operations, evaluate approved size/rate/cost limits. On provider failure or ceiling, pause the sensitive operation while preserving existing records, authorization, audit and recovery controls. Re-enable only through the freshly authenticated founder-controlled audited path.

## Task 4: Restore into an isolated synthetic environment

**Files:**

- Modify: approved recovery harness/adapter and migration runner
- Create: synthetic restore fixtures, checksums and verification reports
- Read: exact Wrangler/environment configuration only when no deployment or credential action is required

- [ ] **Step 1: Validate destination isolation**

Before restore, verify destination environment identity, separate D1/R2 bindings, no production/preview routes, no public domain, no live notifications, no external support destination and no real secret references. Abort on any mismatch.

- [ ] **Step 2: Verify manifest, migration and integrity**

Check schema version compatibility, artifact signature/integrity reference, class allowlist, per-class checksums, counts and foreign-key expectations before writing. Reject partial, stale, unapproved or tampered manifests without mutating the destination.

- [ ] **Step 3: Restore in dependency order**

Restore approved authoritative records first, then derived projections/reconciliation state. Preserve explicit lifecycle states, versions, audit references and safe timestamps. Do not restore active sessions, notification tokens, privileged grants, kill-switch bypasses or public visibility without a fresh authorization/rebuild check.

- [ ] **Step 4: Verify after restore**

Prove row/class counts, checksums, foreign-key integrity, state/version consistency, branch/role authorization, projection eligibility, audit append-only integrity, redaction and absence of public/private leakage. Record failures without exposing sensitive content.

- [ ] **Step 5: Exercise rollback and re-enable gates**

If restore validation fails, isolate/retire the rehearsal destination using its approved recoverable path. Never roll back by deleting production data. Sensitive features remain disabled until integrity, authorization, audit, notification and cost checks pass and the recovery owner approves re-enable.

## Task 5: Implement deletion and de-identification rehearsal

**Files:**

- Modify: approved server-side deletion/de-identification job and repository boundaries
- Create: retention schedule evaluator, purge-verification and browser/public-surface tests
- Create: synthetic deletion evidence report

- [ ] **Step 1: Separate eligible and retained records**

Evaluate account/profile/contact, sessions/notifications, listing/branch, reservation, opened request, prescription metadata/file, audit, support/incident, projection, derivative and backup classes against the approved schedule and legal holds. Do not guess a retention period.

- [ ] **Step 2: Revoke access before deletion**

Immediately revoke sessions, notification references, role grants and access grants where required. Ensure a deleted/de-identified account cannot authenticate, access old protected projections or invoke a stale cached mutation.

- [ ] **Step 3: Delete or de-identify server-side**

Use an idempotent bounded job with dry-run summary, approval, version checks, safe categories, result counts and audit reference. Preserve only legally approved opened-request/reservation/audit evidence with minimal references; remove eligible public projections and private object references without exposing object URLs.

- [ ] **Step 4: Address derivative surfaces**

Verify deletion/de-identification across primary records, public projection/index, caches, object metadata/derivatives, export artifacts, backup eligibility and browser/service-worker caches. The server remains authoritative; the browser must clear/invalidate its own permitted cache and never claim deletion based only on local clearing.

- [ ] **Step 5: Prove no hidden bypass**

Test old public URLs, stale API responses, replayed mutation keys, old sessions, branch-scoped views, audit exports and restore manifests. Confirm safe not-found/unauthorized behavior and no recovery of eligible data from a later synthetic restore.

## Task 6: Verify recovery, privacy, accessibility and handoff

**Files:**

- Create: synthetic recovery acceptance evidence
- Modify: task brief/roadmap with exact validation results
- Review: contracts, migrations, adapters, tests, manifests and operational runbook references

- [ ] **Step 1: Exercise representative synthetic scenarios**

Cover backup creation failure, checksum mismatch, schema mismatch, foreign-key failure, partial restore, wrong destination, provider unavailable, cost breaker, unauthorized export, deletion with legal hold, session revocation, projection rebuild and retry/idempotency. Include disabled prescription-file class when Task 13 is not approved.

- [ ] **Step 2: Measure and record RTO/RPO**

Record start/end times, data point, batch sizes, verified restore point, elapsed recovery, data-loss window, owner, environment and residual risks. Do not substitute a local filesystem copy for hosted/provider evidence.

- [ ] **Step 3: Run repository verification**

Run contract, Worker, repository, web and security tests plus format/lint/typecheck/test/build checks required by the baseline. Run relevant local Wrangler validation only without deployment or credential actions. Verify no secrets or private artifacts enter logs/build output.

- [ ] **Step 4: Confirm UI and support states**

Check accessible maintenance/recovery/deletion status, safe errors, offline behavior and translated messages. The browser must not show internal backup IDs, provider errors, private record details, incident forensics or a false completion state.

- [ ] **Step 5: Commit only approved rehearsal scope**

After review, stage only the Task 18 implementation, synthetic tests, approved documentation links and evidence. Use commit message `test: rehearse protected backup restore and deletion`. Do not stage keys, `.env` files, database dumps, real data, production artifacts or unrelated user changes.
