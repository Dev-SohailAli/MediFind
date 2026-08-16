# Claude task brief: Task 2 synthetic buyer-search prototype

## Task

- **Title:** Task 2: synthetic buyer search and navigation prototype
- **Goal:** Replace the empty Task 1 mobile shell with a locally runnable, accessible buyer-search prototype that demonstrates approved search presentation and safe matching behaviour using fictional in-memory fixtures only.
- **User-facing outcome:** A developer can open the Expo app and explore Search, synthetic results/detail, sorting, safe visual states, and clearly non-functional Requests/Account placeholders. The prototype never connects to a service or represents a real buyer/pharmacy/medicine.
- **Owner/approver:** MediFind founder
- **Tracking issue:** [#5](https://github.com/Dev-SohailAli/MediFind/issues/5)

## Sources of authority

Read before changing code:

- [Task 2 synthetic buyer-search specification](task-2-synthetic-buyer-search-specification.md)
- [Implementation sequencing](implementation-sequencing.md)
- [Design system and screen specification](design-system-and-screens.md)
- [Data and search policy](data-and-search.md)
- [Experience and content guidance](experience-and-content.md)
- [Accessibility policy](accessibility-policy.md)
- [Mobile permissions policy](mobile-permissions-policy.md)
- [Claude Code handoff protocol](claude-code-handoff.md)
- [Repository security and delivery controls](repository-security-and-delivery.md)
- [Decisions](decisions.md), including ADR-225, ADR-259 through ADR-264

If this brief conflicts with any accepted document, stop and submit a decision-change request. Do not implement the broader interpretation.

## Scope

### In scope

1. Build the Task 2 buyer UI in `apps/mobile` with semantic tokens/styles, system React Native components and no custom paid/design assets.
2. Add minimal exported fixture/result/search types to `packages/contracts`; keep all implementation and fixtures local to `apps/mobile`.
3. Implement a pure local query/normalization/ranking module and fixture adapter matching the Task 2 specification exactly.
4. Implement Search (default), explicit local sort, manual synthetic-area selector, list-first result cards, explicit load-more, a local detail sheet, and safe loading/empty/zero/offline/error/stale states.
5. Implement visual Requests and Account tabs that say only that the feature is not part of this synthetic prototype. Do not add account or request content.
6. Add/replace tests for pure behaviour and rendered accessibility/interaction behaviour. A React-compatible test renderer is permitted only if needed; pin it exactly to the workspace React version and keep it test-only.
7. Retain the visible local synthetic-development build marker.

### Out of scope

Do not add or configure:

- API endpoints, API client imports, HTTP, WebSocket, Firebase/GCP, database, storage, cloud resource, auth, session, role or secret;
- real/reasonably real domain records, exact stock quantity, real coordinate/address/contact, prescription, reservation, price guarantee, clinical/recommendation/substitution logic;
- device permission, map/call/link handoff, sign-in/onboarding, account/request data, persistence/cache/search history, analytics/telemetry, notification, upload, deployment or release configuration;
- iTaukei/Fiji Hindi translation values or a language-setting UI. Keep English development copy behind translation keys/constants, with no claim of launch readiness;
- change to accepted product/security/architecture policy, unrelated formatting rewrite, or any unapproved dependency beyond a test-only React-compatible renderer.

### Relevant roles

The UI is an anonymous synthetic buyer **presentation mode**, not a signed-in buyer account. No pharmacy/admin/staff role, role switcher, authorization or protected data exists in this task.

## Behaviour contract

### Inputs and local validation

- The search input accepts local text only. Normalize trim/case/whitespace/harmless punctuation; never transmit or persist it.
- Empty query: show safe initial browse/empty-search state.
- No match: show `No matching medicine listed in this prototype.` plus non-clinical spelling/approved-alias guidance and `MediFind does not recommend substitutes.`
- Use only exact-token/prefix and approved alias matching against synthetic fixture fields. No fuzzy, semantic, therapeutic or cross-product equivalence.
- Manual synthetic area adjusts only pre-authored fixture distance labels/ranks. It must not access device location or prompt for permission.

### Results and ranking

- Exclude `searchEligible: false` fixtures.
- Label display-name/brand matches `Exact product match`; label active-ingredient/alias-only matches `Active-ingredient match`. Keep identity, strength, form and pack visible; never call results equivalent or interchangeable.
- Default order: match kind, freshness, synthetic distance only when manual area is selected, price minor units, stable ID. Implement `relevance`, `price_low_to_high` and `distance` as deterministic explicit sorts; visibly state active sort.
- Return max 20 rows/page and 100/query; use explicit `Load more`, not infinite scroll.
- Every row/detail has fictional medicine identity, fictional pharmacy attribution, availability label/icon with no quantity, FJD price, freshness/last-updated context, match label and synthetic distance context where applicable.

### Visual states and navigation

- Search is list-first and default. Result-detail sheet is local/read-only: no Call, Directions, Reservation, prescription or account action.
- `Requests`/`Account` placeholders have only a clear non-functional prototype notice; no profile, authentication or historical request simulation.
- Provide local loading, empty, zero-result, offline, stale and generic safe-error render states for test/demo. Offline is a visual public-search state only; it does not create a cache or network retry.
- Show required safe copy from the specification. Availability/price language must never guarantee supply, price or dispensing.

### Accessibility and language

- Use meaningful accessible labels, roles, selected/disabled states and screen-reader announcements for controls/state changes.
- Minimum 48 dp/pt targets; visual/focus order align; no colour-only status; no fixed-height clipping of result/safety content at 200% text scaling; device light/dark themes supported.
- Use stable local translation keys/constants. Only approved English development values appear. Medicine identity stays fictional and un-translated.

### Security/privacy and cost

- All data is static code fixture data. The app makes no network request and holds no real or sensitive data.
- No new processor, vendor, cloud service, credential, budget, permission, store disclosure or paid service is authorized.
- Preserve the existing dependency-audit exception guard exactly; do not expand its allowance.

## Interfaces and data

- **API/interface changes:** None. Do not change `apps/api`; do not add a route, mock endpoint, URL or request schema.
- **Shared data types:** Add only the specified synthetic search fixture/result types to `packages/contracts` when genuinely reused by mobile/test code. Do not turn them into future production schemas.
- **Fixture location:** Local to `apps/mobile`, marked synthetic-only. Use fictional `Nivara`/`Solandra`-style invented identifiers only; do not use real pharmacies, people, medicine brands, product names, contact details or addresses.
- **Migration/backward compatibility:** None. Task 1 shell may be replaced; no persisted state exists.
- **Telemetry/audit events:** None.

## Acceptance and validation

### Functional cases

- Case/whitespace/punctuation variants produce the expected exact result.
- Approved alias/active ingredient produces the labelled active-ingredient result without substitute/equivalence language.
- Result rows/detail preserve pharmacy attribution, strength/form/pack, FJD price, availability and freshness; never show quantity.
- Default and explicit sort orders are deterministic; manual synthetic area changes only fixture distance context.
- 20-result pagination, `Load more` and 100-result cap work locally.
- Search/zero/loading/offline/error/stale and placeholder states render safe copy.

### Negative/security cases

- Ineligible fixture cannot appear.
- Unsupported fuzzy/semantic query does not invent a match.
- Source/tests prove no API import/network primitive/Firebase/permission/persistence/telemetry/URL/real-data fixture.
- No account, role, reservation, prescription or pharmacy operation is created.

### Test requirements

- Unit: normalization, matching/classification, exclusion, ranking, pagination/cap and FJD formatting.
- Component/accessibility: accessible control names/state, match/freshness/status rendering, local states, selected Search tab and inert placeholders, scalable-content style/structure.
- Boundary: no forbidden client/API/network/provider/permission dependency; `apps/api` unchanged.
- Do not claim end-to-end/device/cloud testing: none is in Task 2.

### Required commands

Run and report raw result for each:

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

The draft PR must pass hosted Quality CI. If a test dependency/configuration change is needed, explain why and pin it; do not add unrelated tooling.

## Delivery rules

- Start from current `main` in a new task-specific branch, e.g. `agent/task-2-synthetic-buyer-search`.
- Do not merge, deploy, create cloud resources or modify repository settings.
- Keep this task and any documentation decision request separate from unrelated work.
- Open a draft PR that links issue #5 and this brief. Include changed files/interfaces, fixture statement, test commands/results, CI result, security/privacy impact, dependency changes, residual risks and every requested documentation change.
- Stop and request direction if a requirement needs a real domain value, network/API/auth/provider, permission, translated content, new vendor/cost, broader design surface or product/security-policy change.