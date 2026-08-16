# Web application and PWA direction

## Decision

MediFind's current product surface is a responsive, mobile-first web application delivered as an installable Progressive Web App (PWA). It must work in desktop browsers, Android browsers and iPhone Safari, and may be added to a device Home Screen without an app-store account.

The existing Expo/React Native package is retained as an experimental future native shell and as historical Task 2 evidence. It is not the current release or distribution path. Native App Store/Google Play packaging is deferred because official distribution requires paid platform accounts and a thin web wrapper may fail store review.

## Product goal

The web app is the primary buyer, pharmacy-staff, pharmacy-owner and MediFind-admin experience. It uses the same versioned API, server-side authorization, safe error contract, synthetic-data rules and privacy boundaries as every future client. A browser or installed PWA is an untrusted client; it never receives database, storage, provider or service credentials.

The first web implementation is a synthetic, mobile-first buyer-search experience. It must prove useful responsive layout, accessible navigation, search/result/detail states, low-connectivity handling and installable web-app behaviour without real accounts, cloud resources, pharmacy records, prescriptions or reservations.

## Platform capabilities

- Use a valid web manifest, HTTPS-compatible service-worker strategy, icons, standalone display metadata and an explicit iPhone/Android installation guide.
- Treat browser storage and caches as untrusted and temporary. Cache only approved public search data with its source freshness; never cache prescriptions, private requests, staff/admin data, tokens or sensitive form submissions.
- Request browser capabilities just in time: notifications, approximate foreground location, camera capture and selected-file access. Every capability has a manual fallback and a safe denial state.
- Use accessible HTML semantics, keyboard/focus support, screen-reader announcements, responsive layouts, 200% text scaling and non-colour-only states.
- Use verified external map/phone links where needed; do not require an embedded map or native permission merely to search.
- Web Push is a generic refresh signal only. Authenticated API state remains authoritative.

## Distribution boundary

The PWA is the zero-paid-account pilot path. Users install it from the browser, and the founder can test it on an iPhone through Safari's Add to Home Screen flow. No App Store, TestFlight, Google Play, EAS signing or native distribution is required for this phase.

If store distribution is reconsidered, it is a separate decision. The Apple Developer Program and Google Play Console accounts, store review, native value, privacy declarations, signing credentials and release testing must be approved before any packaging work. A web wrapper must not be presented as a way around store membership or review.

## Architecture

The intended client boundary is:

`browser/PWA -> API Gateway -> IAM-private API -> private data/services`

The web client uses the approved `/v1` API and shared contract package. It never talks directly to Firestore, Cloud Storage, Secret Manager or internal jobs. API Gateway, App Check where supported, server-derived roles/branches, authorization, rate limits, idempotency, audit and safe errors remain unchanged.

## Acceptance boundary

The web/PWA task is complete only when local and hosted checks pass, the responsive buyer journey is usable on an iPhone-sized viewport and a desktop viewport, browser capability denial/fallback paths are tested, the install manifest is valid, prohibited data is absent from fixtures/cache/logs, and the PR states that no native store or production capability was activated.
