# Task 22: Execute staged invite-only release and rollback rehearsal

## Gate

Requires Tasks 16–21 evidence, approved public support/legal presence, exact
Cloudflare environment separation, named release owner, rollback owner,
recovery contact, cost alerts and founder release approval.

## Goal

Release the reviewed web/PWA and Worker to a tiny invite-only Suva cohort with
an immutable rollback path and no accidental public or production activation.

## Scope

- Review exact commit, migrations, bindings, flags, routes and environment.
- Deploy Pages/Worker only through founder-approved authenticated workflow.
- Verify health, search, account, pharmacy, reservation and any approved
  upload status routes with synthetic preflight and safe error checks.
- Run rollback to previous immutable versions in a synthetic environment;
  verify data integrity, authorization, audit and notification behavior before
  any re-enable.
- Record cohort, support hours, status-page process, cost forecast and residual
  risks.

## Acceptance

No unapproved route, domain, binding, secret, real data or public acquisition
path is reachable. Rollback never deletes data. A missing release artifact,
failed recovery, unresolved high-severity issue, failed accessibility gate or
missing owner blocks the cohort.

Commit: `docs: record staged pilot release evidence`

Implementation plan: [Task 22 staged invite-only release and rollback implementation plan](../../superpowers/plans/2026-08-18-task-22-staged-release-rollback-implementation.md)
