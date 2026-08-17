# Architecture decision: web-only Cloudflare pilot

## Decision

MediFind is one responsive TypeScript web application/PWA. It is hosted as a
static application on Cloudflare Pages and will use a Cloudflare Worker for
server-side business operations when protected workflows are authorised.
Cloudflare D1 is the first database candidate for ordinary pilot records, R2
is the deferred private-object candidate, and KV is limited to non-authoritative
cache/configuration. The current preview remains local synthetic data only.

The active boundary is:

```text
browser/PWA -> Cloudflare Pages -> Cloudflare Worker -> D1/R2/KV
```

There is no native application, mobile workspace, Firebase project, Google
Cloud project, Cloud Run service, API Gateway, Firestore database or native
push SDK in the active product plan. Earlier decisions that selected those
platforms are superseded by ADR-272; they remain in the decision log only for
historical traceability.

## Product and security boundaries

- The browser is untrusted and never receives database, object-storage,
  service, or secret credentials.
- The synthetic preview has no account, protected API, persistence, real
  pharmacy data, prescription data, analytics, cookies, or production secret.
- A future Worker owns validation, authorization, rate limits, idempotency,
  concurrency, audit events and safe error mapping.
- D1 is authoritative for approved structured records. KV cannot decide
  authorization, record state, or mutation outcomes.
- R2 objects are private by default. Real prescription uploads are disabled
  until region, privacy, retention, scanning, access-control, recovery and
  independent security gates pass.
- The static web app must retain safe loading, empty, offline and unavailable
  states. Offline mode must never queue sensitive mutations.
- Browser notifications, if later enabled, are generic refresh signals. The
  authenticated Worker response remains authoritative.

## Environments

Use separate Cloudflare accounts/projects or clearly isolated environments for
local development, synthetic preview and any future protected pilot. No real
data may enter local development or the public synthetic preview. Secrets are
stored in Cloudflare's approved secret mechanism or the founder-controlled
deployment environment, never in Git or build output.

Cloudflare data location, transfer, subprocessors, backup/restore and deletion
behaviour must be reviewed for Fiji before real buyer, pharmacy, reservation or
prescription data is enabled. Free service availability is not a legal or
privacy approval.

## Provider selection rules

Cloudflare is preferred because it can host the web client and early Worker/data
path in one low-operations platform. D1, R2, KV, Durable Objects, Queues and
Turnstile are not automatically approved for every feature: each binding needs
an exact task contract, least-privilege design, cost limit, failure behaviour,
export path and applicable privacy review.

If evidence requires another provider, preserve the Worker/domain contract and
record the region, processor, backup, cost, migration and operational decision
before adding it. Do not reintroduce the superseded Firebase/GCP architecture
as a compatibility layer.

See [Cloudflare web architecture](cloudflare-web-architecture.md) for the
service map and current provider references.
