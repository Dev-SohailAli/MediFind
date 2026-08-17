# Free-first web production architecture

## Decision

MediFind will reduce platform cost by staying web-only and using Cloudflare as
the default hosting/runtime/data platform. The same Worker and contract
boundaries should survive the move from synthetic preview to a small pilot,
but no free-tier service is approved for real health data until its privacy,
region, backup, recovery, access and cost controls are verified.

The target shape is:

```text
Cloudflare Pages -> Cloudflare Worker -> D1 (records)
                                      -> R2 (private files, deferred)
                                      -> KV (cache/config only)
```

## Service map

| Capability | Cloudflare-first choice | Cost/safety boundary |
| --- | --- | --- |
| Web/PWA | Pages Free | Static synthetic preview; no secrets in assets |
| Business API | Workers Free initially | 100,000 requests/day and 10ms CPU limits must be monitored; protect costly actions with application breakers |
| Structured records | D1 Free initially | Daily read/write/storage limits can reject queries; implement safe degradation and export/migration checks |
| File storage | R2 Standard | Use only after a private-file task and retention/scanning approval; free allowance is not a privacy approval |
| Cache/config | KV | Non-authoritative only, with bounded TTLs and no sensitive records |
| Coordination | Durable Objects | Deferred; add only with a measured consistency need and cost review |
| Scheduled/async work | Cron, Queues or Workflows | Deferred until exact failure/retry contracts are approved |
| Abuse controls | Worker-side rate limits and Turnstile where appropriate | Never substitute for authorization, audit or input validation |
| Observability | Cloudflare logs/metrics with redaction | No query text, tokens, health data or prescription content in telemetry |
| Source/CI | GitHub Actions with pinned actions | Public repository is synthetic/documentation-only; no secrets or deployment authority by default |

Current Cloudflare references: [Workers limits](https://developers.cloudflare.com/workers/platform/limits/),
[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/),
[D1 FAQ](https://developers.cloudflare.com/d1/reference/faq/), [R2
pricing](https://developers.cloudflare.com/r2/pricing/) and [Pages
overview](https://developers.cloudflare.com/pages/). Recheck these before
provisioning because limits and pricing change.

## Budget and circuit breakers

- Forecast usage from the free limits, but treat provider limits and billing
  alerts as separate controls.
- Set a founder-owned monthly ceiling before enabling a protected environment.
- At a warning threshold, stop new non-essential experiments and inspect usage.
- At the ceiling, pause new costly or sensitive mutations while preserving
  safe read-only discovery and existing-record integrity.
- Never delete data, disable backups, or weaken authentication/security merely
  to reduce cost.
- Re-enable a paused feature only through a fresh founder-authorised action
  recorded in the audit trail.

## Production gates

Real accounts, pharmacy records, reservations and prescriptions require all of
the following before activation:

1. Fiji legal/privacy review of Cloudflare products, region and subprocessors.
2. Exact D1/R2 schemas, authorization tests, retention/deletion and export plan.
3. Authentication, MFA/recovery, rate-limit and audit design for the web app.
4. Private upload, malware scanning and fail-closed recovery design before any
   prescription file is accepted.
5. Backup/restore evidence and an operational owner with recovery access.
6. Cost alerts, usage dashboards and tested breakers.
7. Pilot pharmacy agreement, support path and accessibility/browser validation.

Until then, the only deployable product is the public synthetic PWA preview.
