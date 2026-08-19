# Task 17: Implement Fiji hours, freshness and bounded reconciliation

## Gate

Requires approved branch address/hours schema, listing lifecycle, reservation
expiry rules and a reviewed Worker maintenance binding or local-only harness.

## Goal

Keep public availability truthful through server-time freshness, Pacific/Fiji
business hours, exceptional closures and bounded idempotent reconciliation.

## Scope

- Validate structured Fiji address/display rules and private-before-approval
  material address changes.
- Store split weekly intervals and exceptional closures in `Pacific/Fiji`.
- Mark listings may-be-outdated at 24 hours and remove them at seven days,
  while preserving the actual last-updated time.
- Reconcile bounded cursors every 15 minutes, alert after 30 minutes, and make
  reads enforce staleness even when maintenance is delayed.
- Validate reservation pickup expiry against open branch intervals.

## Acceptance

Tests cover split/closed hours, holiday precedence, time-zone boundaries,
stale projection exclusion, cursor retry/idempotency, delayed maintenance and
safe degraded search. No buyer location, exact stock or raw search history is
stored.

Commit: `feat: add branch hours freshness and reconciliation`

Implementation plan: [Task 17 Fiji hours, freshness and reconciliation implementation plan](../../superpowers/plans/2026-08-18-task-17-hours-freshness-reconciliation-implementation.md)
