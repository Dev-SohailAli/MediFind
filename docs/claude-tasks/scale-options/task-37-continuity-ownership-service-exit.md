# Task 37: Continuity, ownership and service exit

## Goal

Make MediFind recoverable and responsibly pausable if the founder is
unavailable, a provider fails, the budget is exceeded, or the service must be
transferred or retired.

## Gate

Requires Tasks 27-29, founder/legal review of ownership and obligations, a
current vendor/account register, named backup operators where permitted, and
approved recovery/deletion boundaries. This task does not transfer accounts or
create new access.

## Read first

- [Pilot operations](../../pilot-operations.md)
- [Infrastructure and release blueprint](../../infrastructure-and-release-blueprint.md)
- [Backup, restore and deletion task queue](../operations/task-18-backup-restore-deletion.md)
- [Cost circuit breaker](../../cost-circuit-breaker-policy.md)
- [Incident response runbook](../../incident-response-runbook.md)
- [Repository security and delivery](../../repository-security-and-delivery.md)

## Scope

- Document founder-controlled ownership, MFA/recovery, least-privilege access,
  renewal/billing contacts, backups/exports, support contacts and succession
  review without recording secrets.
- Define pause, disaster recovery, provider outage, transfer and orderly
  shutdown states; preserve safe public notices and protected-data handling.
- Specify what can be exported, restored, deleted or de-identified, who may
  approve each action, and how audit evidence survives the action.
- Rehearse synthetic service pause, restore, credential-loss response,
  provider-exit export and final deletion verification.
- Define customer/pharmacy communication and legal-record retention questions
  for a future approved transfer or retirement.

## Out of scope

Sharing passwords/tokens, automatic account transfer, real-data export,
provider migration, liquidation, public announcement, new support tooling and
deletion outside approved retention rules.

## Acceptance

- No single undocumented credential or person is the only recovery path for a
  critical service, while privileged access remains least-privilege and
  founder-approved.
- Pause and exit preserve safe search/status messaging, prevent sensitive
  mutations, revoke access where required and never delete data as a cost
  shortcut.
- Synthetic rehearsal records elapsed time, owner, evidence, failure and
  corrective action for each scenario.
- The output distinguishes continuity readiness from any future transfer or
  shutdown approval.

## Verification and handoff

Run repository quality checks, documentation/link checks and synthetic
recovery/export/deletion rehearsal. Attach the owner/access matrix without
credentials. Commit:
`docs: define MediFind continuity and service-exit controls`

Implementation plan: [Task 37 continuity, ownership and service-exit controls plan](../../superpowers/plans/2026-08-18-task-37-continuity-ownership-service-exit-implementation.md)
