# Cloudflare web architecture

## Current decision

MediFind is a web-only product. The supported client is one responsive React
web application/PWA delivered over HTTPS. It must work in desktop and mobile
browsers and may be installed from the browser, but there is no native iOS or
Android application, store package, Expo project, or device build.

Cloudflare is the current platform direction for the synthetic preview and the
lowest-cost path to a pilot. The application boundary is:

```text
browser/PWA -> Cloudflare Pages -> Cloudflare Worker -> D1/R2/KV (server only)
```

The static preview currently uses Pages only and local synthetic fixtures. The
Worker and data bindings are future implementation stages; no protected or
health data is authorised by this document.

## Service map

| Need | Current choice | Boundary |
| --- | --- | --- |
| Web/PWA hosting | Cloudflare Pages Free | Static assets and synthetic previews only |
| Dynamic application/API | Cloudflare Workers | Server-side validation, authorization and business actions; no direct browser database access |
| Relational records | Cloudflare D1 | Candidate primary store for early non-sensitive pilot records; schema and backups require a separate task |
| Files | Cloudflare R2 | Candidate private object store for later uploads; prescription files remain disabled until legal, privacy, region, retention and scanning gates pass |
| Ephemeral/cache data | Workers KV | Non-authoritative configuration/cache only; never the source of truth for mutations or authorization |
| Per-entity coordination | Durable Objects | Deferred until a measured consistency/concurrency need exists |
| Abuse protection | Turnstile and Worker-side limits where approved | Defense in depth, never a replacement for authorization or server validation |
| Async work | Workers Queues/Workflows | Deferred until a bounded workflow needs retries or durable execution |
| Browser notifications | Web Push, if approved later | Generic refresh signal only; the authenticated web state is authoritative |

No Firebase, Google Cloud, Cloud Run, API Gateway, Firestore, App Check,
Expo, React Native, EAS, FCM, APNs, native store, or mobile SDK is part of the
current architecture.

## Free-first rules

- Keep the static preview on Pages Free while it is synthetic-only.
- Keep Worker requests and D1 reads/writes within the documented free limits
  during development; add application-level quotas and an explicit pause path
  before enabling any paid usage.
- Use R2 only when a file workflow is approved. Its free allowance does not
  make sensitive-file handling automatically safe or cost-free.
- Treat provider limits as failure modes: safe search can remain available,
  while costly or sensitive mutations fail closed with a clear status.
- Do not select a service only because it is free. Region, privacy, retention,
  backup, export, recovery, authorization and processor terms must pass the
  applicable review.
- Keep an adapter around every provider-backed capability so a later move to a
  paid or regional service does not rewrite the web client or domain contracts.

Cloudflare's current limits and prices change. Recheck the official [Pages
overview](https://developers.cloudflare.com/pages/), [Workers
limits](https://developers.cloudflare.com/workers/platform/limits/), [Workers
pricing](https://developers.cloudflare.com/workers/platform/pricing/), [D1
FAQ](https://developers.cloudflare.com/d1/reference/faq/) and [R2
pricing](https://developers.cloudflare.com/r2/pricing/) before enabling a
billable environment.

## Data and release boundary

The local and public preview remains synthetic-only. It must not collect
accounts, pharmacy operations, prescriptions, contact details, health data or
production secrets. A future protected web pilot needs a separate decision for
authentication, MFA/recovery, data region, D1/R2 backup and deletion, audit
events, rate limits, file scanning, support access and incident response.

Cloudflare's global platform does not by itself prove that a location,
processor or data-transfer arrangement satisfies Fiji requirements. Real
buyer, pharmacy, reservation or prescription data stays disabled until the
founder and Fiji legal/privacy reviewers approve those facts for the selected
Cloudflare products.

## Exit and scale path

The stable product boundary is the web client plus versioned Worker contracts,
not a specific database. D1 is the first candidate because it keeps the early
record model close to the Worker and avoids an additional database vendor. A
measured need for stronger regional controls, backups, throughput, search or
file processing may justify a paid Cloudflare capability or another provider;
that change requires an ADR and migration/export plan before implementation.
