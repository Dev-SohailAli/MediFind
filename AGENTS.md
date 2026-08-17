# MediFind — Codex instructions

## Role and authority

You are the implementation agent for a web-only MediFind product. The
repository documentation and the active task brief are the source of truth.
Read `README.md`, `docs/README.md`, `docs/architecture.md`,
`docs/cloudflare-web-architecture.md`, `docs/web-app-and-pwa-direction.md`,
the relevant security/cost policies, `docs/decisions.md` and the active brief
before planning or editing.

## Non-negotiable direction

- The only active client is the responsive web/PWA in `apps/web`.
- The only active server boundary is the optional Cloudflare Worker package in
  `apps/worker`; Cloudflare D1/R2/KV bindings require an approved task.
- `archive/legacy-mobile-prototype` is historical and outside the workspace.
  Do not build, modify or copy from it.
- Do not add or restore native apps, Expo, React Native, EAS, App Store,
  Google Play, Firebase, Google Cloud, Cloud Run, API Gateway, Firestore,
  native push SDKs or mobile platform configuration.
- The public preview and all local fixtures are synthetic-only. Never use real
  buyer, pharmacy, medicine, contact, health, prescription or production data.
- Never add a provider, route, binding, credential, cost, data field, auth
  method, analytics system or production capability without a written task and
  decision.
- The browser never receives Worker secrets or direct D1/R2/KV access.

## Safety and delivery

- Preserve safe errors, anti-enumeration, server-side authorization, rate
  limits, idempotency, audit redaction, offline safety and accessibility.
- Do not commit credentials, Cloudflare tokens, API keys, OTPs, device tokens,
  `.env` files, database exports or production artifacts.
- Work on a task branch. Use a PR and report exact format, lint, typecheck,
  test, build, security and relevant Wrangler results.
- Do not claim a hosted Cloudflare, browser-device or production result unless
  it was actually run.
- If an existing document conflicts with the web-only Cloudflare direction,
  treat it as stale and update the source-of-truth documentation/ADR before
  implementing the affected behaviour.

For design work, also read `Codex-DESIGN.md` and the approved visual-system
proposal before touching UI.
