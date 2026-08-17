# Claude task brief: web/PWA buyer search

This is the active implementation brief for the synthetic buyer-search web
surface. It supersedes the historical mobile wording in earlier task records.

## In scope

- `apps/web` React/Vite/PWA interface;
- local invented fixtures and deterministic search;
- responsive browser layout, safe states, accessible navigation and detail UI;
- manifest, service-worker shell and install guidance; and
- tests proving no runtime network, account, storage, analytics, provider SDK,
  real data or protected workflow.

## Out of scope

No native app, Expo/React Native, EAS, store packaging, Firebase, Google Cloud,
Cloudflare Worker binding, D1/R2/KV binding, authentication, reservation,
prescription, payment, delivery or production deployment is authorised by this
brief.

## Delivery

Use a task branch and PR. Read the current web-only architecture and visual
system first. Run format, lint, typecheck, tests, build, secret/dependency
checks and the web boundary suite. The public Pages preview, if used, must
contain synthetic fixtures only.
