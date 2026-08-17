# Claude task brief: Cloudflare Worker foundation

## Task

Implement the smallest synthetic-only Cloudflare Worker foundation for the
web/PWA product. Read the [Cloudflare web architecture](cloudflare-web-architecture.md),
[architecture decision](architecture.md), [monorepo policy](monorepo-and-toolchain-policy.md),
the [Worker foundation specification](task-3-protected-platform-foundation-specification.md),
and all linked security/cost policies before editing.

## Authority and release boundary

This brief authorises a reviewable PR only. It permits no native app work, no
Firebase/GCP resource, no real account, no production data, no prescription
file, no paid service commitment, no committed secret and no production deploy.

## In scope

- Rename/maintain the server-only package as `apps/worker`.
- Add only the exact synthetic Worker route/configuration approved in the
  linked specification.
- Keep browser code independent from Worker implementation and bindings.
- Add synthetic D1 access only if the task's exact schema and migration are
  included; otherwise keep the binding disabled.
- Implement safe error, validation, authorization, quota and redaction seams.
- Add Cloudflare configuration/CI validation without account tokens or
  founder-owned identifiers.

## Explicitly out of scope

- Native apps, Expo, React Native, EAS, App Store or Google Play.
- Firebase, Google Cloud, Cloud Run, API Gateway, Firestore or their SDKs.
- Real authentication provider activation, SMS/email, pharmacy operations,
  reservations, prescriptions, uploads, payments, delivery or analytics.
- Direct browser D1/R2/KV access, broad CORS, client-supplied roles or secrets.

## Required verification

Run and report the exact results of format, lint, typecheck, unit tests, web
build, Worker tests, Wrangler configuration validation and secret/dependency
scans. Do not claim a hosted Cloudflare or production result unless it ran.

## Stop conditions

Stop and request a decision if the task needs a new provider, account, data
region, binding, cost, credential, route, personal data field, authentication
method or production permission not named in the linked specification.
