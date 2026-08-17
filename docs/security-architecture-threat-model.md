# Web security architecture and threat model

## Active boundary

The browser is untrusted. Static assets come from Cloudflare Pages and future
business operations pass through a Cloudflare Worker. D1, R2 and KV bindings
are server-only. The current public preview has no protected route or data
binding.

## Primary threats and controls

| Threat | Control |
| --- | --- |
| Browser or client tampering | Validate every request in the Worker; never trust roles, prices, state or binding identifiers from the browser |
| Record enumeration | Opaque IDs, scoped authorization and generic not-found/denied responses |
| Credential/session abuse | Provider-neutral auth adapter, MFA/recovery before protected pilot, revocation and rate limits |
| Abuse/cost exhaustion | Per-actor/action limits, request/body caps, Turnstile where approved, usage alerts and circuit breakers |
| Direct data access | No D1/R2/KV credentials in the browser; bindings are server-only; test direct-binding denial |
| Data leakage | Redacted logs/analytics/notifications; no health or prescription content in telemetry |
| Malicious files | Private quarantine, bounded asynchronous scanning and fail-closed unknown/error state before prescription activation |
| Supply-chain compromise | Frozen lockfile, pinned CI actions, dependency audit and secret scanning |
| Deployment compromise | PR-only main, founder-approved environments, short-lived deployment access and no committed tokens |

## Data and provider gates

Cloudflare's global delivery and data products do not automatically satisfy
Fiji privacy, transfer, retention or health-data requirements. Real identity,
pharmacy, reservation and prescription data stays disabled until region,
processor, access, backup, deletion, recovery and independent security review
are documented for the exact products selected.

## Verification

Each protected Worker task must include positive and negative authorization,
rate-limit, idempotency, redaction, quota-failure, migration/export and direct
binding-access tests. Security evidence is tied to the exact commit and no
hosted result is claimed unless it ran.
