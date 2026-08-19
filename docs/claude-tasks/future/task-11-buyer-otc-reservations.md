# Task 11: Implement the buyer over-the-counter reservation lifecycle

## Gate

Requires Task 8 authenticated buyer context, Task 9 verified branch ownership,
Task 10 eligible listings, approved notification fallback, and the exact
reservation data-retention decision. Prescription-required reservation remains
out of scope.

See the [Task 11 implementation plan](../../superpowers/plans/2026-08-18-task-11-buyer-otc-reservations-implementation.md) for the state/command matrix, Fiji-time deadline rules, immutable price snapshot, no-show controls and offline/accessibility boundary.

## Goal

Implement the smallest protected buyer flow for an eligible OTC listing:
request collection, pharmacy approve/decline, buyer cancel, pharmacy cancel
with an operational reason, buyer confirm collected/no longer needed, and
automatic expiry at the confirmed collection deadline.

## State and command rules

Use explicit server transitions: `request`, `approve`, `decline`, `cancel`,
`expire`, `mark_collected`, and `confirm_no_longer_needed`. The server derives
legal next state, branch business hours, expiry, confirmed exact-pack FJD
price, audit event and safe notification. Every mutation requires an opaque
24-hour idempotency key and current version.

Enforce one active reservation for the same medicine and identified person.
Support `self`, `child` and `dependent` relationship values without creating a
reusable dependent profile. Pharmacy scope is branch-specific.

## Acceptance

No payment, delivery, stock guarantee, dispensing decision, chat or free-text
buyer/pharmacy messaging is added. Offline mode never queues a reservation.
Test concurrent requests, duplicate retries, stale versions, invalid state
transitions, price change before approval, expiry, cancellation, no-show
policy counting, cross-branch access and generic error mapping.

The web UI must expose loading, pending, approved, declined, cancelled,
expired, collected and unavailable states with accessible status text.

Commit: `feat: add protected otc reservation lifecycle`
