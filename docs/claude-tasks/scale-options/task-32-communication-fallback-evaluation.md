# Task 32: Communication fallback evaluation

## Goal

Evaluate whether authenticated in-app status and generic web notifications are
enough, or whether a future email/SMS fallback is justified by measured pilot
failure and support evidence.

## Gate

Requires Tasks 24, 26 and 27, notification delivery evidence, a named support
owner, and privacy/security/cost review of any candidate channel. No provider
is selected by this brief.

## Read first

- [Notification and status synchronisation](../../notification-and-status-synchronisation.md)
- [Requirements](../../requirements.md)
- [API error contract](../../api-error-contract.md)
- [Experience and content](../../experience-and-content.md)
- [Web platform capabilities policy](../../web-platform-capabilities-policy.md)

## Scope

- Measure delayed, duplicate, revoked and undelivered generic signals against
  the authoritative authenticated in-app status path.
- Define channel-specific content rules, consent, language, rate limits,
  suppression, unsubscribe/revocation, retry, support and incident handling.
- Compare status-only, web push, email and other approved candidate channels
  at the level of data categories, processor/region, cost and operational
  burden, without selecting a vendor.
- Specify a Worker adapter and re-fetch-on-open/resume rule for any later
  implementation.

## Out of scope

Prescription content, medicine/search text, reservation details, OTPs or
access tokens in notifications; native push SDKs; unsolicited marketing;
email/SMS account creation; and live provider configuration.

## Acceptance

- In-app authenticated state remains authoritative for every candidate.
- The decision packet names the observed failure threshold that would justify a
  new channel and the threshold that would stop it.
- Synthetic tests cover duplicate/stale/revoked subscriptions, generic copy,
  language keys, anti-enumeration and absence of protected content.
- Any provider implementation is deferred to a new task with processor,
  region, sender identity, cost, recovery and rollback approval.

## Verification and handoff

Run quality checks, notification-contract tests, redaction tests and synthetic
delivery-failure scenarios. Attach the channel decision matrix. Commit:
`docs: evaluate resilient status communication options`

Implementation plan: [Task 32 resilient status communication evaluation plan](../../superpowers/plans/2026-08-18-task-32-communication-fallback-evaluation-implementation.md)
