# Task 25: Fiji branch expansion

## Goal

Prepare a controlled path to activate verified pharmacy branches outside the
initial Suva pilot without weakening address, hours, freshness, support or
privacy rules.

## Gate

Requires Task 22 release evidence, successful onboarding/training and
reconciliation for the pilot, a named support owner, a founder-approved target
locality and a current legal/privacy review for the expanded operating scope.
No locality is activated by code alone.

## Read first

- [Branch location and hours policy](../../branch-location-and-hours-policy.md)
- [Pharmacy verification policy](../../pharmacy-verification-policy.md)
- [Pilot operations roadmap](../../superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md)
- [Performance and reliability targets](../../performance-and-reliability-targets.md)
- [Experience and content](../../experience-and-content.md)

## Scope

- Validate synthetic address, locality, province, coordinates, directions and
  Pacific/Fiji hours for the proposed expansion shape.
- Add an explicit activation scope/feature flag with server-side owner,
  expiry, audit and rollback controls.
- Prove branch verification, staff assignment, training, listing freshness,
  reservation hours and support escalation across more than one locality.
- Add low-connectivity and language/accessibility scenarios representative of
  the approved rollout, without collecting buyer coordinates.
- Document manual verification and incident handling for address/coordinate
  changes before public projection.

## Out of scope

Nationwide activation, automatic geocoding, embedded maps, location tracking,
delivery, public reviews, new support vendors and any inference that a branch
is open or has stock beyond its verified data.

## Acceptance

- A branch remains private until verification and activation gates pass.
- Public detail exposes only approved address, directions, contact, hours and
  freshness fields; evidence and staff data remain restricted.
- Activation can be paused or rolled back without deleting records or falsely
  re-routing pending requests.
- Tests cover split hours, exceptions, timezone boundaries, stale data,
  cross-branch authorization and no-location-disclosure behaviour.
- The release packet names locality, owner, support hours, rollback and
  post-activation review date.

## Verification and handoff

Run quality checks, contract/Worker tests and browser checks on approved
synthetic locality fixtures. Record operational staffing and unresolved
geocoding/address risks. Commit:
`feat: add gated synthetic Fiji branch activation controls`

Implementation plan: [Task 25 gated synthetic Fiji branch activation plan](../../superpowers/plans/2026-08-18-task-25-fiji-branch-expansion-implementation.md)
