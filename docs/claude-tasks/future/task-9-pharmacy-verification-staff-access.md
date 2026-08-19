# Task 9: Implement pharmacy verification and staff access lifecycle

## Gate

Requires accepted Task 7 provider/data gate and Task 8 authenticated actor,
MFA and audit context. Verification evidence metadata and staff roles must be
approved before migration names or fields are finalized.

See the [Task 9 implementation plan](../../superpowers/plans/2026-08-18-task-9-pharmacy-verification-staff-access-implementation.md) for the field-matrix stop gate, explicit command lifecycle, continuity invariants and synthetic verification matrix.

## Goal

Enable a verified pharmacy owner to submit/maintain branch verification state,
invite named staff to one branch and role set, and preserve owner/reviewer
continuity with server-side authorization.

## Required slices

- Add additive D1 records for verification metadata, scoped staff assignments
  and opaque invitations only after the approved field matrix is recorded.
- Add explicit commands for submit evidence metadata, approve/suspend branch,
  invite/reissue/revoke staff, accept invitation, and assign/remove roles.
- Enforce seven-day invitation expiry, one active invitation per context, final
  owner protection, explicit reviewer assignment, branch isolation and fresh
  MFA for high-risk actions.
- Emit redacted audit events for every acceptance, denial, conflict and
  continuity protection.

## Safety boundary

Evidence files/details are never public. Invitation tokens never appear in
logs or durable URLs. Owner status never grants prescription access. Loss of
the final reviewer must atomically disable new prescription requests and hide
prescription-required listings while eligible OTC listings remain available.

## Acceptance

Cover seven-day expiry, replacement invalidation, missing phone/MFA proof,
final-owner protection, transfer/re-verification, last-reviewer disablement,
restoration, cross-branch role isolation, idempotent retries, stale versions,
rate limits and safe generic errors. Use invented identities only.

Commit: `feat: add pharmacy verification and staff access lifecycle`
