# Web application and PWA direction

## Decision

MediFind is a web-only product. The active client is the responsive React
application in `apps/web`, delivered through Cloudflare Pages and optionally
installable from a browser as a PWA. Desktop and mobile browsers are supported
as browser targets; there is no native app, Expo project, store package,
device-build workflow or native-shell roadmap.

The former mobile prototype is archived under `archive/legacy-mobile-prototype`
for traceability only. It is outside the pnpm workspace and must not be used as
a source for new tasks.

## Active platform boundary

```text
browser/PWA -> Cloudflare Pages -> Cloudflare Worker -> D1/R2/KV
```

The current public preview stops at Pages and uses local synthetic fixtures. A
Worker, database binding, account system, file upload, browser notification
provider or analytics system requires its own approved task.

## Web capabilities

- Use semantic HTML, keyboard/focus support, screen-reader announcements,
  responsive layout, 200% text scaling and non-colour-only state signals.
- Use a valid manifest, HTTPS-compatible service worker and install guidance.
- Treat browser caches/storage as temporary and untrusted. The synthetic
  preview writes no browser storage. A future protected client may cache only
  approved public search data and must never queue sensitive mutations offline.
- Request browser capabilities only when a future approved workflow needs them:
  notifications, camera or file selection. Every capability has a denial and
  manual fallback state.
- Use verified external links for phone/directions where approved; do not
  require device location or an embedded map to search.
- Web Push, if selected later, is only a generic refresh signal. Worker state
  remains authoritative.

## Distribution and hosting

Cloudflare Pages is the current low-cost deployment path. Synthetic preview
URLs may be public and therefore contain only invented fixtures. No account,
cookie, secret, protected data, API proxy or production workflow belongs in the
static preview.

The app is not submitted to an app store. Any future distribution change would
need a new product, cost, privacy and release decision; it must not reintroduce
native dependencies into this repository.

## Acceptance boundary

The current web prototype is complete when local and Pages checks pass, the
search/result/detail flow works at responsive browser sizes, loading/offline/
empty/error states are safe, the manifest is valid, and no runtime network,
provider SDK, account, storage, analytics or real-data capability is present.
