# Task 3 Worker Listing Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the explicit synthetic Worker mode fetch the selected listing detail before displaying it, while preserving fixture-mode detail, safe errors, stale-response protection and accessible modal behaviour.

**Architecture:** `apps/web/src/search/searchClient.ts` owns the bounded `GET /v1/listings/{encoded-id}` request, parses the response through Task 2's shared public-item parser and maps it to the existing `SyntheticSearchListing`. `useWorkerListingExecution` owns cancellation-safe async state. `SearchScreen` selects the Worker detail path only when the explicit Worker mode is enabled; the existing local fixture path remains synchronous and network-free.

**Tech Stack:** TypeScript 6, React 19, Vitest 4, Testing Library, Vite web workspace.

**Spec:** `docs/claude-tasks/task-3-worker-listing-detail.md`, `docs/claude-tasks/task-2-public-contract-validation.md`, `docs/superpowers/plans/2026-08-18-task-2-public-contract-validation-implementation.md`, `docs/api-error-contract.md`, `docs/web-app-and-pwa-direction.md`.

## Global Constraints

- Task 2's `parsePublicSearchResultItem` must be reviewed and accepted before this plan is implemented.
- The browser never receives D1 credentials/bindings and calls only the approved Worker listing route in Worker mode.
- Encode the listing ID as one URL path segment; never concatenate arbitrary path/query fragments.
- Map network, non-success, malformed JSON, malformed public item and ID-mismatch failures to the existing generic `Worker search unavailable` boundary.
- Ignore stale responses after selected ID changes, query/result changes, unmount or sheet close; never display a result for a different selection.
- Preserve the default fixture mode, offline safety, current safety copy, existing match labels and detail-sheet focus/Escape/backdrop/close behaviour.
- Enable the Worker path only through the existing explicit `VITE_MEDIFIND_SEARCH_MODE=worker` development setting; never make it the default build path.
- Do not add routes, response fields, storage, retries, caching, mutations, auth, provider SDKs, analytics or protected workflows.
- Use only existing reviewed strings (`loadingLabel`, `errorTitle`, `errorBody`, `detailSheetTitle`, `detailSheetCloseLabel`); do not invent product copy in this task.

---

### Task 1: Specify the Worker listing client contract with failing tests

**Files:**
- Modify: `apps/web/src/search/__tests__/searchClient.test.ts`
- Read: `apps/web/src/search/searchClient.ts`
- Read: `packages/contracts/src/index.ts` after Task 2 review

**Interfaces:**
- Consumes: `FetchLike`, `PublicSearchResultItem`, `parsePublicSearchResultItem` and an opaque `listingId` string.
- Produces: expectations for `fetchWorkerListing(listingId: string, fetchImpl?: FetchLike): Promise<SyntheticSearchListing>`.

- [ ] **Step 1: Add a valid single-item response fixture**

Reuse the fictional public item already used by the search-client test. Keep the fixture response shape exactly equal to one `PublicSearchResultItem`, with no database/source fields.

- [ ] **Step 2: Write the failing request and mapping test**

Call `fetchWorkerListing('listing/nivaprin')` with a mocked successful `Response`. Assert the request is exactly:

```ts
['/v1/listings/listing%2Fnivaprin', { headers: { accept: 'application/json' } }]
```

Assert the returned `SyntheticSearchListing` maps ID, medicine identity, brand, pharmacy, area, availability, price, distance and timestamp, uses an empty alias list, marks the item `searchEligible: true`, and does not include response-internal fields.

- [ ] **Step 3: Write failure and anti-enumeration tests**

Cover network rejection, non-success response with a provider/D1 body, invalid JSON, malformed public item, and a valid item whose returned `id` differs from the requested ID. Assert each rejects with exactly `Worker search unavailable` and never includes the body, ID details, provider path or parser message.

- [ ] **Step 4: Write the path-boundary test**

Use an ID containing `/`, `?`, `#` and whitespace and assert the fetch call has only one encoded path segment, no query string and no second route segment. The test must not use a real identifier or hosted endpoint.

- [ ] **Step 5: Run the focused test and observe failure**

Run: `pnpm --filter @medifind/web exec vitest run src/search/__tests__/searchClient.test.ts`

Expected: FAIL because `fetchWorkerListing` does not yet exist.

### Task 2: Implement the bounded Worker listing client

**Files:**
- Modify: `apps/web/src/search/searchClient.ts`
- Test: `apps/web/src/search/__tests__/searchClient.test.ts`

**Interfaces:**
- Consumes: `parsePublicSearchResultItem` from `@medifind/contracts`, `FetchLike` and the existing private public-item-to-listing mapper.
- Produces: `fetchWorkerListing(listingId, fetchImpl)` with the exact return/error contract from Task 1.

- [ ] **Step 1: Reuse the public-item mapping without widening the response**

Keep the mapper allow-listed and private to the Worker client module unless a focused test requires a named export. It must map `lastRefreshedAt` to the existing `lastUpdatedDisplay`, set `freshness: 'current'`, `aliases: []`, and `searchEligible: true`, matching the existing search mapping.

- [ ] **Step 2: Build the encoded listing URL**

Construct the request as `` `/v1/listings/${encodeURIComponent(listingId)}` `` and pass only `{ headers: { accept: 'application/json' } }` to `fetchImpl`. Do not add a body, credentials option, query persistence or retry loop.

- [ ] **Step 3: Parse and verify the response**

Handle non-OK status and JSON decoding inside the generic error boundary. Pass the decoded value to `parsePublicSearchResultItem`, reject if its sanitized `id` does not equal the requested `listingId`, then map the sanitized item. Do not expose parser/provider errors to callers.

- [ ] **Step 4: Run the focused client tests**

Run: `pnpm --filter @medifind/web exec vitest run src/search/__tests__/searchClient.test.ts`

Expected: PASS for valid mapping, path encoding, malformed response, non-success, invalid JSON, network rejection and ID mismatch.

### Task 3: Specify and test cancellation-safe listing-detail state

**Files:**
- Create: `apps/web/src/search/useWorkerListingExecution.ts`
- Create: `apps/web/src/search/__tests__/useWorkerListingExecution.test.ts`
- Read: `apps/web/src/search/useWorkerSearchExecution.ts`

**Interfaces:**
- Consumes: `enabled: boolean`, `listingId: string | null`, and injectable `runListing: (listingId: string) => Promise<SyntheticSearchListing>`.
- Produces: `useWorkerListingExecution` state union:

```ts
type WorkerListingExecutionState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; listing: SyntheticSearchListing }
  | { status: 'error' };
```

- [ ] **Step 1: Add hook state tests**

Cover disabled mode/null ID -> `idle`, enabled ID -> synchronous `loading` then `ready`, rejected request -> `error`, changed ID ignoring an older resolution, and null ID/unmount ignoring a late resolution. Use deferred promises controlled by the test; do not use timers or real network calls.

- [ ] **Step 2: Implement the initial state and effect guard**

If `enabled` is false or `listingId` is null, return `idle` and do not call `runListing`. Otherwise set `loading`, call exactly once for the current ID, and keep a `cancelled` flag in the effect cleanup.

- [ ] **Step 3: Ignore stale success and failure**

Only commit `ready` or `error` when the effect has not been cancelled. The cleanup must run when `enabled`, `listingId` or the injected runner changes. Do not cache a failed or stale response and do not retry.

- [ ] **Step 4: Run the focused hook tests**

Run: `pnpm --filter @medifind/web exec vitest run src/search/__tests__/useWorkerListingExecution.test.ts`

Expected: PASS for idle, loading, ready, error and stale-resolution cases.

### Task 4: Integrate Worker detail loading without changing fixture mode

**Files:**
- Modify: `apps/web/src/components/SearchScreen.tsx`
- Modify: `apps/web/src/components/ResultDetailSheet.tsx`
- Modify: `apps/web/src/components/__tests__/SearchScreen.test.tsx`
- Create: `apps/web/src/components/__tests__/ResultDetailSheet.test.tsx`
- Test: `apps/web/src/search/__tests__/useWorkerListingExecution.test.ts`

**Interfaces:**
- Consumes: selected result row's `matchKind`/distance metadata, `useWorkerListingExecution`, existing `ResultDetailSheet` close contract and reviewed `strings`.
- Produces: fixture mode's current synchronous detail rendering and Worker mode's loading/ready/error detail states with one close path.

- [ ] **Step 1: Write the failing Worker-mode integration tests**

Mock the Worker search/detail runners at the hook boundary or use the existing injectable seam. Cover:

1. fixture mode opens the current detail sheet without calling `fetch`;
2. Worker mode opens a dialog with `strings.loadingLabel` and an accessible close button while detail is pending;
3. Worker success renders the fetched listing's identity, price, pharmacy and existing safety copy while retaining the selected row's match label/distance;
4. Worker failure renders `strings.errorTitle`/`strings.errorBody`, exposes no response body and remains closable;
5. close button, Escape, backdrop and focus return still work in loading, ready and error states;
6. changing query/results or selection cannot display the previous listing after a late response.

- [ ] **Step 2: Extend `ResultDetailSheet` with a discriminated detail state**

Use a prop union that keeps the current ready props intact and adds `status: 'loading' | 'error'` variants with only `onClose`. Keep the same dialog title, `aria-modal`, close button, overlay click, Escape handler, focus trap and focus restoration. In loading/error variants render only the existing safe reviewed strings; never render a partial listing or stale previous listing.

- [ ] **Step 3: Wire the hook and preserve the selected-row metadata**

In `SearchScreen`, derive the selected row from the current execution result. Pass Worker mode and the selected row ID (or `null`) to `useWorkerListingExecution`. Render the detail sheet when a selected row exists: fixture mode uses the row listing directly; Worker mode maps hook status to loading/error/ready and uses the fetched listing only in `ready`. Keep `matchKind`, display-distance and `showDistance` from the selected search row.

- [ ] **Step 4: Close/clear selection when the selected row disappears**

If a query change, sort/area update or search error removes the selected row, clear the selected ID so the sheet closes and the detail hook returns to `idle`. Do not keep a detail request alive for an item no longer present in the active search result set.

- [ ] **Step 5: Run focused integration tests**

Run: `pnpm --filter @medifind/web exec vitest run src/search/__tests__/searchClient.test.ts src/search/__tests__/useWorkerListingExecution.test.ts src/components/__tests__/SearchScreen.test.tsx src/components/__tests__/ResultDetailSheet.test.tsx`

Expected: PASS for fixture mode, Worker loading/success/error, stale-response protection, safety copy and modal accessibility.

### Task 5: Run full verification and hand off for review

**Files:**
- Review only: files listed in Tasks 1-4

- [ ] **Step 1: Run repository quality checks**

Run: `pnpm run format:check`

Run: `pnpm lint`

Run: `pnpm typecheck`

Run: `pnpm test`

Run: `pnpm build`

Run: `pnpm run security:secrets`

Run: `pnpm run audit`

Run: `pnpm run security:trivy`

Report an exact Trivy database failure if it cannot complete; do not claim a clean scan without output.

- [ ] **Step 2: Review the boundary and diff**

Confirm default mode has no fetch, Worker mode calls only `/v1/listings/{encoded-id}` for detail, no response body/provider error is rendered, no stale result can appear, no browser storage/cache/retry/mutation was added, and no route/provider/auth/data field changed.

- [ ] **Step 3: Commit only the Task 3 scope**

```bash
git add apps/web/src/search/searchClient.ts apps/web/src/search/__tests__/searchClient.test.ts apps/web/src/search/useWorkerListingExecution.ts apps/web/src/search/__tests__/useWorkerListingExecution.test.ts apps/web/src/components/SearchScreen.tsx apps/web/src/components/ResultDetailSheet.tsx apps/web/src/components/__tests__/SearchScreen.test.tsx apps/web/src/components/__tests__/ResultDetailSheet.test.tsx
git commit -m "feat: use worker listing detail in opt-in mode"
```

- [ ] **Step 4: Return the PR handoff report**

Report the Task 2 reviewed commit, Task 3 commit, exact focused/full commands and results, changed interfaces, synthetic-only status, security/privacy/cost impact, rollback, browser/modal evidence and residual risks. Do not merge, deploy or run remote Wrangler commands from this task.
