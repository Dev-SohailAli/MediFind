# Task 39: Privacy rights, retention and data governance

## Goal

Turn the logical data dictionary and deletion principles into an approved,
repeatable data-governance model for rights requests, retention, export,
deletion, backups, audit records and processor changes.

## Gate

Requires Tasks 27, 36 and 37, a named privacy/data owner, Fiji legal/pharmacy
review and an approved classification/retention schedule. Until the schedule
is approved, real prescription handling remains disabled.

## Read first

- [Security/privacy/compliance](../../security-privacy-compliance.md)
- [Data dictionary and ownership](../../data-dictionary-and-ownership.md)
- [Requirements](../../requirements.md)
- [Audit-log policy](../../audit-log-policy.md)
- [Backup, restore and deletion](../operations/task-18-backup-restore-deletion.md)

## Scope

- Map each record, derivative, backup, export, audit event, support case and
  metric to purpose, classification, owner, access, retention, deletion or
  de-identification action.
- Define authenticated request handling for access/correction/deletion,
  account closure, opened-prescription exceptions and response evidence
  without exposing another person's records.
- Specify backup/export propagation, legal holds, terminal states, processor
  changes and verification of deletion without retaining unnecessary content.
- Define periodic data-map review, policy versioning, staff training and
  incident escalation when a request cannot be safely fulfilled.

## Out of scope

Inventing legal bases or retention periods, real-data migration, broad admin
access, data brokerage, analytics expansion, automated legal decisions and
deleting records to reduce cost.

## Acceptance

- Every in-scope record has an owner, classification, retention/deletion rule,
  access path and evidence source, or is explicitly blocked.
- Rights requests are anti-enumeration-safe, scoped, auditable and do not
  expose prescription content outside the approved relationship.
- Backups, exports, derivatives and scanner artifacts follow the approved rule.
- Synthetic request/restore/deletion tests prove idempotency, partial failure,
  audit redaction and no premature deletion of protected evidence.

## Verification and handoff

Run quality checks, synthetic rights/deletion/export tests and retention-map
consistency checks. Attach the approval matrix and unresolved legal items.
Commit:
`docs: define privacy rights and retention governance`

Implementation plan: [Task 39 privacy rights, retention and data governance plan](../../superpowers/plans/2026-08-18-task-39-privacy-rights-retention-governance-implementation.md)
