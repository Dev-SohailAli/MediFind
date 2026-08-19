# Task 16: Implement pharmacy onboarding, training and activation readiness

## Gate

Requires Tasks 8–12, approved pilot agreement/legal notices, verified support
ownership and founder-approved Suva invite-only cohort controls.

## Goal

Make a pharmacy branch activation a deliberate server-validated readiness
transition, including owner acceptance, evidence status, role setup, training
completion and synthetic workflow exercises.

## Scope

- Add the minimum server-owned activation checklist and state transitions.
- Record agreement version/hash, training module/version, branch, learner,
  completion time and retraining due date without quiz health/free-text data.
- Require verified owner, current branch hours, required staff roles, daily
  listing-refresh acknowledgement, synthetic listing exercises and support /
  security escalation acknowledgement.
- Keep activation Suva-only and invite-only while allowing the schema to
  represent future Fiji branches.

## Acceptance

An unready branch cannot become public or receive protected requests. Revoke,
expiry, missing reviewer or failed training disables only the affected
capability with safe search preserved. Tests cover reactivation, retraining,
owner continuity, reviewer continuity, audit and generic UI states.

Commit: `feat: add pharmacy activation readiness workflow`

Implementation plan: [Task 16 pharmacy onboarding and activation implementation plan](../../superpowers/plans/2026-08-18-task-16-pharmacy-onboarding-activation-implementation.md)
