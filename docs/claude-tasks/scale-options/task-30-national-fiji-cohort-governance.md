# Task 30: National Fiji cohort governance

## Goal

Define evidence-based controls for expanding from selected localities to a
larger Fiji cohort while keeping pharmacy verification, freshness, support,
accessibility, language and rollback manageable.

## Gate

Requires Tasks 23-29 accepted, a founder-approved target cohort/localities,
current Fiji legal/privacy review, named support and verification owners,
reconciled cost forecast and a rollback rehearsal. This brief does not activate
any locality.

## Read first

- [Branch location and hours policy](../../branch-location-and-hours-policy.md)
- [Pharmacy verification policy](../../pharmacy-verification-policy.md)
- [Pilot operations](../../pilot-operations.md)
- [Performance and reliability targets](../../performance-and-reliability-targets.md)
- [Product brief](../../product-brief.md)

## Scope

- Define locality/cohort states, entry criteria, owner, review date, support
  coverage, cost ceiling, freshness baseline and pause/rollback action.
- Rehearse synthetic branch onboarding, verification renewal, hours/freshness
  reconciliation, language/accessibility checks and incident escalation across
  multiple localities.
- Specify how a locality can be paused without deleting records or silently
  rerouting buyer requests and how public projections respond.
- Document representative device/network conditions and data-quality checks
  before each cohort decision.

## Out of scope

Automatic nationwide enablement, buyer location tracking, embedded maps,
delivery, public ratings, live inventory integrations and any promise of
coverage where no verified listing exists.

## Acceptance

- Every cohort has an explicit owner, start/stop criteria, support hours,
  rollback and post-release review date.
- Unverified, expired, stale or paused branches cannot appear as active public
  inventory, and pending protected workflows are handled neutrally.
- Synthetic rehearsal proves locality isolation, time-zone correctness,
  accessibility/language coverage, cost breakers and incident escalation.
- The output is a founder decision packet; implementation of activation flags
  requires a separate approved task.

## Verification and handoff

Run document/link checks, repository quality checks for any guardrail code and
synthetic multi-locality tests. Record unresolved support, coverage, legal and
cost risks. Commit:
`docs: define gated Fiji cohort expansion evidence`

Implementation plan: [Task 30 national Fiji cohort governance plan](../../superpowers/plans/2026-08-18-task-30-national-fiji-cohort-governance-implementation.md)
