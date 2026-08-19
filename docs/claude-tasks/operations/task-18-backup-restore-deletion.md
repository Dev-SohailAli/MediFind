# Task 18: Implement backup, export, restore and deletion rehearsal

## Gate

Requires approved data classifications, retention/deletion schedule, provider
backup terms, recovery owner, recovery contact and synthetic environment
separation.

## Goal

Prove that protected structured data and private-file metadata can be exported,
restored, deleted and verified without exposing sensitive content or using an
unreviewed provider path.

## Scope

- Define versioned logical export and encrypted backup evidence for approved
  D1/R2 records; separate public projection from protected/restricted data.
- Exercise restore into an isolated synthetic environment with migration and
  checksum verification.
- Revoke sessions/notifications and delete or de-identify eligible buyer data
  while preserving only legally approved opened-request/reservation/audit
  records.
- Record restore RTO/RPO results, owner, integrity checks and rollback.

## Acceptance

Restore tests prove row counts, foreign keys, authorization scope, projection
eligibility and audit integrity. Deletion tests prove no public URL, object
reference, backup derivative or browser cache bypasses the approved schedule.
No real data or production backup is used for rehearsal.

Commit: `test: rehearse protected backup restore and deletion`

Implementation plan: [Task 18 protected backup, restore and deletion rehearsal plan](../../superpowers/plans/2026-08-18-task-18-backup-restore-deletion-implementation.md)
