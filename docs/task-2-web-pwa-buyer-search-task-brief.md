# Claude task brief: Task 2 web/PWA buyer search

## Task

- **Title:** Task 2 web/PWA buyer-search implementation
- **Goal:** Reimplement the approved synthetic buyer-search/navigation experience as the current responsive web application/PWA, using the completed Expo prototype only as historical behaviour reference.
- **User-facing outcome:** A developer can open the local web app in a desktop browser, iPhone-sized viewport or Android-sized viewport and explore synthetic Search, results/detail, sorting, safe states and clearly non-functional Requests/Account placeholders. The app is installable as a PWA and never represents a real buyer, pharmacy or medicine.
- **Owner/approver:** MediFind founder

## Scope

### In scope

- Add `apps/web` as the current primary client boundary in the pnpm workspace.
- Implement the buyer Search, results, detail and safe placeholder flows described by the historical [Task 2 specification](task-2-synthetic-buyer-search-specification.md), adapted to responsive web/PWA semantics.
- Use `packages/contracts` for the approved synthetic result types and preserve the existing fixture/search behaviour: exact and approved alias matching, safe availability/freshness states, area selection, distance display only when an area is selected, sorting and 20-result pages within a 100-result query maximum.
- Add valid PWA manifest metadata, synthetic/local-development labelling, icons or documented placeholder-safe icon handling, installability guidance and an offline shell. Offline mode may show only approved public synthetic results and must not queue actions.
- Provide responsive narrow/mobile and desktop layouts, keyboard/focus support, accessible names/state announcements, dark-mode preference handling, 200% text scaling and English-development copy that can expand into translation keys later.
- Add deterministic web tests for rendering, search, navigation, responsive-critical states, accessibility-critical controls, manifest/service-worker behaviour and prohibited fixture/cache/network behaviour.

### Out of scope

- Firebase Authentication, phone/email verification, App Check, API calls, network requests, Firebase/GCP projects, Cloud Run, API Gateway, storage, OpenTofu, secrets, hosting deployment or production configuration.
- Real or realistic buyer, pharmacy, medicine, contact, coordinate, prescription or reservation data.
- Prescription upload, reservation mutation, account activation, pharmacy operations, admin operations, notifications requiring a provider, analytics, telemetry, cookies or persistent sensitive storage.
- Expo/EAS, native signing, App Store, TestFlight, Google Play, Capacitor/TWA packaging or any native wrapper.
- New business routes, endpoint schemas, domain records or changes to accepted product/security policy.

### Relevant roles

The implemented interactive experience is buyer-facing only. Requests and Account are clearly labelled non-functional placeholders; pharmacy/admin workspaces are not implemented by this task.

### Documentation/ADR links

- [Web application and PWA direction](web-app-and-pwa-direction.md)
- [Architecture](architecture.md)
- [Design system and screens](design-system-and-screens.md)
- [Claude Design agent brief](claude-design-agent-brief.md)
- [Accessibility policy](accessibility-policy.md)
- [Web platform capabilities policy](mobile-permissions-policy.md)
- [Experience and content](experience-and-content.md)
- [Data and search](data-and-search.md)
- [Historical Task 2 specification](task-2-synthetic-buyer-search-specification.md)
- [ADR-266 and ADR-267](decisions.md)

## Behaviour contract

- **Inputs and validation:** Search accepts a bounded text query; area is optional and uses only the approved synthetic areas; unsupported/empty input produces safe empty guidance. No location API, browser permission or free-text domain input is required.
- **Authorization rules:** No authenticated actor exists in this task. All fixtures are public synthetic development data and the UI must visibly identify that fact.
- **State transitions:** No business mutation exists. Search/detail navigation is local UI state only.
- **Success, empty, loading and error behaviour:** Preserve the approved current, may-be-outdated, in-stock, low-stock and unavailable labels; show loading, no-query browse, zero-result, stale, offline and safe error states; do not imply stock certainty or clinical substitution.
- **Accessibility and language requirements:** Use semantic HTML, keyboard navigation, visible focus, screen-reader names/announcements, 48 CSS-pixel minimum targets, non-colour-only states, responsive layout and 200% text scaling. Keep user-facing strings in a translation-key-friendly structure.
- **Security/privacy constraints:** No external network request from the app, no tokens, no real data, no browser storage for protected data, no analytics, no service worker caching outside the approved synthetic public shell/results and no unsafe HTML injection.
- **Cost/vendor/infrastructure impact:** No cloud, hosting, provider, domain, paid service, account, runtime network or infrastructure impact. Local package dependencies must be justified and locked.

## Interfaces and data

- **API/interface changes:** None. The web app is local-fixture-only and must not call `apps/api`.
- **Data model changes:** No persistent/domain data model. Use existing synthetic contracts or add only the minimum type-level change explicitly required by this brief.
- **Migration/backward-compatibility plan:** None. Do not alter the API, mobile prototype or production data model.
- **Telemetry/audit events:** None. Development labels and tests must not emit telemetry.

## Acceptance and validation

### Functional acceptance cases

- Search renders with a clear synthetic-development label.
- Exact, approved alias and no-result searches behave deterministically.
- Results show match kind, pharmacy attribution, availability, exact-pack FJD price, freshness and safe area/distance treatment without exact stock quantity.
- Detail navigation opens and closes correctly on narrow and wide viewports.
- Sorting and bounded pagination match the historical Task 2 behaviour.
- Requests and Account remain visibly non-functional placeholders.
- Manifest is valid, app name/scope/display metadata are correct and the offline shell does not expose protected data.

### Negative/security/privacy cases

- No application fetch/XHR/WebSocket or provider SDK is invoked.
- No fixture contains real-looking contact, coordinate, prescription, account or exact-stock data.
- No browser storage/cache entry contains a token, account, prescription, reservation or staff/admin value.
- No unsupported query, stale item or unavailable item is presented as a guaranteed medicine result.
- No keyboard, focus, responsive or capability-denial path creates an unsafe dead end.

### Required commands/checks

```text
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm security:secrets
pnpm security:trivy
pnpm run audit
```

The PR must include the web package's focused test results, the existing workspace results, a browser/manual verification note for at least an iPhone-sized viewport and desktop viewport, and a statement that no cloud, store or production capability was activated.

## Delivery rules

- Work from current `main` on a task-specific branch and open a PR; do not merge, deploy or publish.
- Use synthetic fixtures only.
- Stop and raise a decision-change request if a required web framework, provider, route, data field, permission, account, cost or hosting choice is missing.
- Do not silently rewrite the historical mobile Task 2 record or accepted ADRs.
- PR must include implementation summary, tests/results, security/privacy impact and residual risk.
