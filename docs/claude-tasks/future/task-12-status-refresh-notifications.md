# Task 12: Add authoritative status refresh and generic notifications

## Gate

Requires Task 11's stable state machine, an approved notification provider or
an explicit in-app-only decision, cost breaker evidence, and the notification
privacy contract. No native push SDK, realtime database, WebSocket or message
content provider is allowed.

See the [Task 12 implementation plan](../../superpowers/plans/2026-08-18-task-12-status-refresh-notifications-implementation.md) for the authoritative read contract, generic signal adapter, refresh-race handling, breaker behavior and browser fallback evidence.

## Goal

Make protected request/reservation status reliable through authenticated
Worker reads and mutation-completion refresh, with optional generic browser
signals that never carry sensitive details.

## Required behavior

- Re-fetch authoritative state on screen open, app resume, pull-to-refresh and
  after a successful mutation.
- Treat duplicate, delayed, stale and revoked subscriptions safely.
- A notification contains only a generic refresh signal and an opaque safe
  destination; opening it performs a fresh authorized read.
- Provider unavailable, quota-paused or permission-denied paths retain the
  in-app status fallback and never block safe search.
- No medicine query, price, prescription, health, reservation detail, token or
  raw provider error appears in notifications, URLs or logs.

## Acceptance

Test refresh races, stale responses, revoked subscription, duplicate delivery,
permission denial, provider failure, cost pause, logout, offline resume and
cross-actor authorization. Manual browser evidence must cover notification
denial and the in-app fallback.

Commit: `feat: add authoritative status refresh adapter`
