# Task 2: synthetic buyer-search specification

## Purpose and approval boundary

This specification authorises the second implementation task in the [implementation sequence](implementation-sequencing.md): a **local, synthetic buyer-search and navigation prototype**. It gives Claude an exact bounded contract for the first non-sensitive mobile experience after Task 1.

Task 2 is not a product beta, public release, account flow, inventory system or backend. It creates no cloud resource, network interface, user identity, real pharmacy/medicine record, prescription, reservation, notification, analytics event, device permission request or persistent client data.

The task implements only the buyer-facing visual/search slice named here and in [issue #5](https://github.com/Dev-SohailAli/MediFind/issues/5). It must follow the [design system and screen specification](design-system-and-screens.md), [data and search policy](data-and-search.md), [experience and content guidance](experience-and-content.md), [accessibility policy](accessibility-policy.md), [mobile permissions policy](mobile-permissions-policy.md), [repository security and delivery controls](repository-security-and-delivery.md), and accepted ADRs.

## Exact scope

### In scope

- Replace the Task 1 mobile-shell label with a local synthetic buyer prototype.
- A buyer-oriented bottom navigation visual with `Search` active by default and `Requests`/`Account` as clearly labelled non-functional prototype placeholders. Neither placeholder may display a profile, history, request, sign-in prompt, account field or protected data.
- Search input, clear action, deterministic local search, manual synthetic-area selector, supported sort selector, list-first results, explicit `Load more`, result-detail sheet, and local loading/empty/zero-result/offline/safe-error/stale visual states.
- Static, clearly fictional fixtures stored locally in the mobile app; a narrow shared type export in `packages/contracts` only for the selected synthetic search/result shapes.
- Exact-product versus active-ingredient match labelling, pharmacy attribution, availability status without quantity, FJD listed price, freshness, synthetic distance and safety wording.
- Local English development copy through named translation keys/constants. iTaukei and Fiji Hindi values, language selection and any claim of translated launch-ready UI remain out of scope until professional review is approved.
- Unit tests for the search behaviour and component/accessibility tests appropriate to the existing Vitest toolchain. A React-compatible test renderer may be added only when required for those tests, must match the pinned React version, and must have no runtime/network role.

### Out of scope

- Every API route, API import, fetch/XMLHttpRequest/WebSocket call, backend listener, Firebase/GCP/client SDK, database, storage, auth/session/role logic, credential, secret, environment configuration, deployment or external service.
- Real or realistic buyer, staff, pharmacy, branch, medicine, stock, price, address, phone, coordinate, prescription, reservation, map or health data.
- OS permission declaration or request, including location, camera, notification and media permissions; live near-me search; map/call/deep-link handoff; contact flow.
- Sign-in/onboarding, account data, request timelines, reservation creation, pharmacy/medicine detail actions, prescription language, upload, call, directions, shopping/payment/delivery, search history/favourites, analytics/telemetry, cache/persistence or background work.
- Clinical advice, therapeutic substitution, recommendation, sponsored ranking, exact inventory quantity, stock/price/dispensing guarantee, medical urgency decision or real availability claim.

## Package and interface boundary

| Location | Task 2 responsibility | Prohibited content |
| --- | --- | --- |
| `apps/mobile` | Local buyer-search presentation, fixture adapter, pure query state and safe visual states. | API client, provider SDK, real data, permission request, storage/cache, telemetry and protected workflow. |
| `packages/contracts` | Minimal exported TypeScript types for the synthetic search fixture/result boundary. | HTTP schemas, endpoint names, persistence schema, roles, credentials or future placeholders. |
| `apps/api` | Unchanged Task 1 package boundary. | Any Task 2 route, mock server or search implementation. |
| `packages/config` | Unchanged except a test-only renderer configuration explicitly required by this task. | Runtime/provider/environment configuration. |

The mobile package must not import `@medifind/api`. No Task 2 code may use a URL, network primitive, Firebase identifier, permission API or persistence API.

## Synthetic fixture contract

All fixture values are fictional demonstrators, marked in source as `SYNTHETIC_ONLY`, and cannot be replaced by a real name/value without a separate approved task.

```ts
type SyntheticAvailability = 'in_stock' | 'low_stock' | 'unavailable';
type SyntheticFreshness = 'current' | 'may_be_outdated';
type SyntheticMatchKind = 'exact_product' | 'active_ingredient';
type SyntheticSort = 'relevance' | 'price_low_to_high' | 'distance';

interface SyntheticSearchListing {
  id: string;
  medicineDisplayName: string;
  brandName?: string;
  activeIngredientDisplayName: string;
  strength: string;
  dosageForm: string;
  packDescription: string;
  aliases: readonly string[];
  pharmacyDisplayName: string;
  syntheticArea: 'harbour' | 'garden' | 'market';
  syntheticDistanceLabel: string;
  syntheticDistanceRank: number;
  availability: SyntheticAvailability;
  priceFjdMinor: number;
  freshness: SyntheticFreshness;
  lastUpdatedDisplay: string;
  searchEligible: boolean;
}
```

Required fixture cases:

- an exact product query whose case, repeated whitespace and harmless punctuation variants normalize to the same result;
- an approved alias query returning an explicitly labelled active-ingredient match, never a claim that products are interchangeable;
- at least one `in_stock`, `low_stock`, `unavailable` and `may_be_outdated` display state;
- at least one `searchEligible: false` listing proving ineligible/too-stale records are never returned;
- a zero-result query and a safe generic-error state;
- a synthetic collection or generated test data proving the 20-result page and 100-result query cap.

Fixture names must be invented words, not real pharmacy/business/person/address/medicine names. `priceFjdMinor` is an integer, formatted as FJD only at the display boundary. No fixture has stock quantity, real coordinate, contact field, medical instruction, health data or private identifier.

## Local search and ranking contract

The local search module is a pure function. It does not mutate a fixture, persist a query, call a network service, collect telemetry or infer clinical equivalence.

1. Normalize a query by trimming, lowercasing, collapsing whitespace and removing harmless punctuation only.
2. Match against normalized display name, brand name where present, active ingredient and approved aliases using deterministic exact-token/prefix rules. Do not add fuzzy/semantic matching.
3. Classify a display-name/brand hit as `exact_product`; classify active-ingredient/alias-only hits as `active_ingredient` and show that label directly beside the result identity.
4. Exclude `searchEligible: false` records before ranking. Never merge or deduplicate a fixture across pharmacies.
5. Default relevance order: match kind, current before `may_be_outdated`, synthetic distance rank when a manual synthetic area is selected, then listed FJD minor-unit price and stable fixture ID. `price_low_to_high` and `distance` are explicit user-selected sorts and remain deterministic.
6. Return at most 20 records per page and 100 per query. `Load more` is explicit and local; no infinite scroll.
7. An empty query renders the safe browse/empty-search state; a non-empty no-match query renders: `No matching medicine listed in this prototype.` It may suggest checking spelling or an approved alias and must state that MediFind does not recommend substitutes.

The manual area selector only changes which synthetic distance labels/ranks are shown. It does not request, read, save or approximate device location. No map is rendered.

## Presentation and content contract

- Search is list-first. Every result visibly presents medicine identity, pharmacy, availability label/icon, FJD price, freshness/last-updated context, match kind and synthetic distance context where selected.
- A `may_be_outdated` indicator sits beside the price/availability context and is never conveyed by colour alone.
- Show the active sort and make only one primary action visually prominent at a time.
- The local result-detail sheet repeats exact identity, pack, pharmacy attribution, price/freshness and safe wording. It has no call, map, reservation, upload or request action.
- Required development safety strings use translation keys/constants: `Availability and price are provided by the pharmacy and may change.`, `A reservation is not a guarantee of supply or dispensing.`, `A valid prescription may be required. The pharmacy makes the final dispensing decision.`, and `MediFind does not provide medical advice.` The urgent-help line remains documentation-only until professionally reviewed translated content is available.
- `Requests` and `Account` placeholders must state that the feature is not part of the synthetic prototype. They must not simulate account state or imply that a buyer is signed in.
- The prototype label remains visible as a local synthetic-development build indicator.

## Accessibility, language and visual constraints

Use semantic design tokens and system fonts; no hard-coded brand asset, custom font, gradient, neon/sale treatment or colour-only status. Support light/dark device themes and 200% text scaling without clipped critical text or controls. Every interactive control has a meaningful accessibility label, role and state; focus order follows visual order; touch targets are at least 48 dp/pt; loading/zero/error/state changes are announced accessibly.

Store visible strings behind stable local keys/constants even though only reviewed English development values are supplied in Task 2. Do not machine-translate medicine identity, safety content or user-facing clinical copy. iTaukei/Fiji Hindi content, language settings and translation review are deferred, not silently approximated.

## Test and acceptance contract

At minimum, automated tests prove:

- case/whitespace/punctuation normalization; exact versus active-ingredient labelling; no fuzzy/clinical substitution; deterministic ranking/sort; ineligible exclusion; page limit/query cap; FJD minor-unit formatting; no quantities;
- local fixture/result types and search code contain no network, Firebase, permission, persistence, analytics, URL or API dependency;
- result rows expose match kind, availability, FJD price, freshness and pharmacy attribution; stale/zero/loading/offline/error and placeholder states use safe copy;
- controls have accessible names/states, do not rely only on colour, and the source/layout supports scalable text without fixed-height clipping of safety/result content;
- mobile does not import `@medifind/api` and API package remains unchanged.

Required commands: `pnpm install --frozen-lockfile`, `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm run audit`, `pnpm security:secrets`, and `pnpm security:trivy`. The PR must also pass the identical hosted Quality workflow. No command result may be claimed unless run.

## Completion boundary

Task 2 is complete only when its approved task brief is implemented in a task branch/PR with synthetic-only evidence and green required checks. Completion does not authorize a backend, real search, authentication, device permissions, protected buyer feature, pharmacy operation, cloud project or release.