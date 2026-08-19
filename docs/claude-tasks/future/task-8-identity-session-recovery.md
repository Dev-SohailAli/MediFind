# Task 8: Implement the approved identity, session and recovery boundary

## Gate

Do not dispatch until Task 7 records the selected identity provider,
provider-region/processor review, token/session contract, MFA requirement,
recovery owner, SMS/email cost breaker and approved bindings. Provider SDK code
must not be invented inside this task.

See the [Task 8 implementation plan](../../superpowers/plans/2026-08-18-task-8-identity-session-recovery-implementation.md) for the provider-neutral contracts, fail-closed authorization matrix, synthetic persistence tests and web accessibility boundary.

## Goal

Add a server-owned identity context that supports anonymous public search,
authenticated buyer sessions, privileged pharmacy/admin sessions, MFA
assurance, revocation, anti-enumeration and the documented buyer 24-hour
recovery hold.

## Allowed scope

- Extend `packages/contracts` with the approved opaque actor/session claims;
  never add prescription content, raw phone/email, provider tokens or secrets.
- Add Worker identity/session adapter files beside
  `apps/worker/src/security/actor.ts` and `authorize.ts`.
- Add the minimal approved auth/recovery route handlers under
  `apps/worker/src/routes/`.
- Add web session context and safe sign-in/recovery states in `apps/web`.
- Add D1 migrations only for the exact approved session/recovery records.

## Required behavior

- Generic responses prevent account, phone, email and invitation enumeration.
- Session, device and recovery records are server-only and revocable.
- Privileged actions require the approved MFA assurance and fresh-auth window.
- Buyer recovery revokes affected sessions/tokens and enforces the 24-hour
  security hold before prescription actions.
- Provider errors, OTPs, reset links and raw identifiers never reach logs,
  URLs, notifications or browser error text.
- Anonymous `/v1/search` remains available and unchanged.

## Acceptance

Test invalid/expired/revoked sessions, wrong assurance, replayed recovery,
anti-enumeration, rate limits, provider-unavailable behavior, redaction,
cross-actor access and safe offline behavior. Run the full quality suite and
manual keyboard/screen-reader checks for changed auth states. Do not claim
provider or hosted evidence until it was actually run.

Commit: `feat: add approved worker identity boundary`
