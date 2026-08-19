# Task 3: Connect the opt-in Worker listing-detail route

## Goal

When the explicit Worker search mode is enabled, fetch the selected listing
from `GET /v1/listings/{id}` before showing detail. Keep the default fixture
mode synchronous, offline-safe and network-free.

## Authority and exact scope

Read `docs/task-4-synthetic-cloudflare-environment-brief.md`,
`docs/api-error-contract.md`, `docs/web-app-and-pwa-direction.md`, and Task 2's
contract brief. The Worker already returns one `PublicSearchResultItem` for an
eligible opaque ID and generic `NOT_FOUND`/`UNAVAILABLE` errors.

Allowed files:

- Modify `apps/web/src/search/searchClient.ts`.
- Add `apps/web/src/search/useWorkerListingExecution.ts`.
- Modify `apps/web/src/components/SearchScreen.tsx` and only the narrowest
  detail-state component needed for loading/error presentation.
- Add focused tests under `apps/web/src/search/__tests__/` and
  `apps/web/src/components/__tests__/`.

## Interface to produce

Add a typed client operation:

```ts
export async function fetchWorkerListing(
  listingId: string,
  fetchImpl?: FetchLike,
): Promise<SyntheticSearchListing>;
```

The ID must be encoded as one path segment. The response must pass the Task 2
public-item parser before mapping to `SyntheticSearchListing`.

Add an async state hook with `idle`, `loading`, `ready`, and `error` states.
It must ignore stale responses after the selected ID changes or the sheet
closes, and it must not retry indefinitely or cache a failed response.

## Behaviour

- Fixture mode continues to open the existing local detail sheet without a
  fetch.
- Worker mode shows an accessible loading state while detail loads.
- A successful detail response renders the existing safety, freshness, price,
  pharmacy and medicine content.
- A missing or unavailable detail shows the existing generic error state and
  lets the buyer close the sheet; it never exposes the response body.
- Escape, close button, backdrop close and focus restoration remain intact.

## Acceptance

- The browser never receives a D1 binding or credential.
- Worker mode calls only `/v1/listings/{encoded-id}` for detail.
- Rapid selection changes cannot display the wrong listing.
- Offline/default fixture tests remain green and no sensitive mutation is
  queued or stored.
- Focus and screen-reader tests cover loading, ready, error and close paths.

Commit: `feat: use worker listing detail in opt-in mode`

For exact dependent TDD steps and current component/state mapping, use the
[Task 3 implementation plan](../superpowers/plans/2026-08-18-task-3-worker-listing-detail-implementation.md).
