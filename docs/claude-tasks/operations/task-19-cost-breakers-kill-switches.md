# Task 19: Implement cost breakers and independent feature kill switches

## Gate

Requires founder-approved monthly ceiling, service-level usage measures,
warning/ceiling thresholds, audited re-enable authority and safe-search
degraded behavior.

## Goal

Pause costly or sensitive features at the approved ceiling without shutting
down safe search, deleting records, weakening authorization or hiding status.

## Scope

- Measure Worker requests/CPU, D1, R2, notification and identity units
  separately without raw query, prescription or identifier telemetry.
- Exercise 50/80/100% warning/ceiling states.
- Independently pause OTP sends, uploads/scans and reservations as applicable;
  retain safe discovery and existing-record integrity.
- Require fresh founder authentication and audit evidence to change a ceiling
  or re-enable a paused capability.

## Acceptance

Synthetic tests cover warning delay, pause, restore, provider/quota failure,
duplicate breaker events, safe UI maintenance copy and unauthorized re-enable.
The breaker cannot be disabled by a browser flag or cache value.

Commit: `feat: add cost breakers and protected feature switches`

Implementation plan: [Task 19 cost breakers and protected feature switches implementation plan](../../superpowers/plans/2026-08-18-task-19-cost-breakers-kill-switches-implementation.md)
