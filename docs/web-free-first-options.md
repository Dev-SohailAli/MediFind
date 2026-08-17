# Web/PWA free-first options

## Current choice

Use Cloudflare as the default web platform. The static synthetic preview is
already bounded to Cloudflare Pages. The next protected-platform design should
evaluate Cloudflare Workers with D1, R2 and KV before adding another vendor.

This is a cost and platform decision, not permission to collect real health or
identity data. The public preview remains synthetic-only.

## Service options

| Capability | Preferred early option | Boundary and migration rule |
| --- | --- | --- |
| Static web/PWA | Cloudflare Pages | Free synthetic preview; no application secrets or protected data in static assets |
| Dynamic API | Cloudflare Worker | Server-only boundary; keep routes and domain contracts provider-neutral |
| Structured data | Cloudflare D1 | First candidate for non-sensitive pilot records; test limits, backup/export and region before protected use |
| Private files | Cloudflare R2 | Deferred; no prescription files until legal/privacy/retention/scanning/recovery approval |
| Cache/config | Workers KV | Non-authoritative only; never use for authorization or state transitions |
| Strong per-entity coordination | Durable Objects | Defer until measured concurrency requires it |
| Async retries | Queues or Workflows | Defer until a workflow needs durable retry/backlog handling |
| Browser abuse control | Worker limits plus Turnstile where approved | Defense in depth; never replaces authorization |
| Authentication | Provider-neutral Worker adapter | No provider is selected for protected accounts yet; synthetic preview has no auth |
| Email/SMS | Deferred | No notification or OTP provider is required for the current web preview |

## Cost controls

- Keep static assets on Pages Free while possible.
- Set explicit Worker/D1/R2 usage budgets and fail safely when a limit is
  reached. Search may remain available while costly mutations pause.
- Do not rely on a free tier as a spend cap. Confirm account billing settings,
  provider limit behaviour and alerting before enabling paid usage.
- Prefer a single Cloudflare account owned by the founder, with separate
  projects/environments and least-privilege deployment tokens.
- Export synthetic data and schema regularly so a provider change is possible.

Cloudflare's limits and pricing are time-sensitive. Recheck [Pages
limits](https://developers.cloudflare.com/pages/platform/limits/), [Workers
limits](https://developers.cloudflare.com/workers/platform/limits/), [D1
FAQ](https://developers.cloudflare.com/d1/reference/faq/) and [R2
pricing](https://developers.cloudflare.com/r2/pricing/) before a deployment or
cost commitment.

## Alternatives

Supabase, Neon, Turso and other free database/auth providers may be evaluated
only when Cloudflare fails a documented requirement. An alternative must pass
data region, privacy/processor, backup/recovery, availability, export,
authorization, cost and migration review. It must not be added merely to avoid
writing the Worker boundary.

## Explicitly rejected for this direction

Firebase, Google Cloud, native mobile build services, store accounts, a
self-hosted database, public object storage, direct browser database access,
analytics/advertising providers and a second backend platform are not part of
the current plan.
