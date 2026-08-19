# Task 37 Continuity, Ownership and Service-Exit Controls Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make MediFind recoverable and responsibly pausable if the founder is unavailable, a provider fails, the budget is exceeded, or the service must be transferred or retired, without sharing secrets or treating continuity planning as transfer approval.

**Architecture:** Continuity is documented through founder-controlled ownership/access matrices, environment/backup/export records, explicit pause/disaster/transfer/exit states and synthetic rehearsals. Privileged access remains least-privilege and time-limited; no single undocumented credential or person is the only recovery path where approved backup operators are permitted. Safe search/status may remain available only when its authorization/data path is verified; sensitive mutations pause and access is revoked as required. Audit evidence survives pause/exit under the approved retention schedule.

**Tech Stack:** Existing repository/CI, optional Cloudflare Pages/Worker/D1/R2/KV environments, Task 18 export/restore/deletion controls, Task 19 breakers, Task 20 incident controls, synthetic owner/access/export/deletion fixtures and documentation evidence. No account transfer, password/token sharing, new support tool, provider migration, real-data export, liquidation or unapproved deletion is performed.

**Spec:** `docs/claude-tasks/scale-options/task-37-continuity-ownership-service-exit.md`, `docs/pilot-operations.md`, `docs/infrastructure-and-release-blueprint.md`, `docs/claude-tasks/operations/task-18-backup-restore-deletion.md`, `docs/cost-circuit-breaker-policy.md`, `docs/incident-response-runbook.md`, `docs/repository-security-and-delivery.md`, accepted Tasks 27-29 evidence, founder/legal ownership review and approved recovery/deletion boundaries.

## Global Constraints

- Do not begin until Tasks 27-29, founder/legal ownership and obligation review, current vendor/account register, permitted backup-operator decision and recovery/deletion boundaries are accepted.
- Never record or share passwords, API tokens, OTPs, authenticator secrets, private keys, recovery codes, real data, production exports or private support/legal correspondence.
- This task does not transfer accounts, create access, rotate credentials, migrate providers, announce shutdown or delete data. Those require separate founder/legal approval and exact execution plans.
- Use synthetic identities, environments, incidents, exports and deletion results only. No real buyer, pharmacy, health, prescription, contact or production backup enters evidence.
- Pause/exit must preserve safe public/status messaging, block sensitive mutations, revoke access where required, preserve legally required/audited records and never delete data as a cost shortcut.
- Continuity readiness is distinct from transfer, succession, public release or shutdown approval. Missing owner, backup, recovery, retention, support or rollback evidence remains a blocker.

## Task 1: Establish ownership and access matrix

**Files:**

- Create: owner/access/continuity evidence packet
- Modify: `docs/claude-tasks/scale-options/task-37-continuity-ownership-service-exit.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md` to link this plan
- Read: Tasks 27-29 evidence, service-account register, legal ownership/obligation review and founder recovery decision

- [ ] **Step 1: Inventory critical services**

List repository/domain/DNS/Pages/Worker/D1/R2/KV, monitoring, support/status, identity/notification and backup/export functions with purpose, environment, owner, billing/renewal contact, MFA/recovery method reference, authorized role, dependency, pause path and review date. Store references, not secrets.

- [ ] **Step 2: Define least-privilege backup operators**

Record whether backup operators are permitted, their bounded scope, founder approval, MFA/recovery, start/end/review and audit requirements. If not permitted, record the single-founder risk and mitigation without inventing access.

- [ ] **Step 3: Define access lifecycle**

Require joiner/mover/leaver review; revoke contributor access at departure; document emergency-access controls; perform quarterly/monthly ownership review as applicable; keep credentials outside Git; prohibit shared credentials.

## Task 2: Define continuity, pause and exit states

**Files:**

- Create: continuity state/decision matrix and safe status templates
- Review: Task 19 breakers, Task 20 incident response, Task 22 rollback and public support/status policies
- No account or environment mutation

- [ ] **Step 1: Model explicit states**

Define normal, degraded, paused-sensitive, disaster-recovery, provider-exit-review, transfer-review and retired/closed as documentation states with owner, reason, effective time, affected capabilities, notice, recovery/retention and approval.

- [ ] **Step 2: Define safe behavior**

During pause/disaster/provider outage, preserve safe search/status only when verified, disable costly/sensitive mutations, revoke affected sessions/grants, show generic maintenance copy and never silently reroute pending prescriptions/reservations.

- [ ] **Step 3: Define communication boundaries**

Name internal founder/security/support escalation, verified buyer/pharmacy notice path, public status owner, next-update process and legal review. Do not draft an unapproved shutdown, transfer or public announcement.

- [ ] **Step 4: Define re-enable criteria**

Require data integrity, authorization, audit, backup/recovery, cost, support, notification/status and incident checks plus explicit founder approval. No browser flag/cache or stale session can resume sensitive functions.

## Task 3: Rehearse synthetic recovery, export and exit

**Files:**

- Create: synthetic continuity/recovery/export/deletion scenarios
- Review: Task 18 manifests, restore/deletion checks, Task 27 migration and Task 29 repository rollback
- Create: elapsed-time/failure/corrective-action evidence

- [ ] **Step 1: Exercise founder unavailability**

Use synthetic ownership and permitted backup-operator roles to rehearse escalation, status, read-only safe operation and time-limited recovery authority. Verify no password/token sharing and normal access is restored/reviewed afterward.

- [ ] **Step 2: Exercise provider/budget outage**

Trigger synthetic provider failure/cost ceiling, pause affected capabilities, preserve safe search where safe, record owner/notice/rollback and verify no data deletion or weakening of security/backups.

- [ ] **Step 3: Exercise export/restore**

Export synthetic approved classes, verify manifest/checksums/redaction, restore to isolated environment, rebuild projections, test authorization/audit/retention and record RTO/RPO/owner. Never use a production destination.

- [ ] **Step 4: Exercise orderly exit**

Use synthetic branch/account/service records to revoke sessions/roles, remove public eligibility, preserve required audit/opened-request/reservation records, delete/de-identify only approved classes, invalidate caches/derivatives and verify no public URL/object reference bypass.

- [ ] **Step 5: Exercise corrective action**

Record elapsed time, failure/missed control, owner, due date, retest and residual risk. A failed critical recovery/deletion/containment exercise blocks sensitive activation or expansion until corrected.

## Task 4: Define future transfer and shutdown decision boundaries

**Files:**

- Create: transfer/retirement question list and approval checklist
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Record legal/contract questions**

List operator ownership, pharmacy/buyer notice, contracts, privacy rights, processor obligations, retention/legal hold, export format, support, domain/brand, tax and regulatory questions. Do not answer with assumptions.

- [ ] **Step 2: Separate transfer from continuity**

Require a new founder/legal decision for any account/domain/data/contract transfer, successor access, provider migration or public announcement. Continuity packet cannot authorize those actions.

- [ ] **Step 3: Define evidence survival**

Specify how audit, incident, security, support, retention and deletion evidence remains protected and accessible to the approved owner after pause/exit without exposing raw sensitive content.

- [ ] **Step 4: Run checks and commit packet**

Run repository quality, documentation/link and synthetic recovery/export/deletion checks. Commit `docs: define MediFind continuity and service-exit controls`; do not stage credentials, real exports, account changes or public announcements.
