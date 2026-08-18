# Task 2 Public Contract Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the web Worker adapter's unchecked response cast with a dependency-free, sanitizing runtime parser for the approved synthetic public search envelope and result item.

**Architecture:** `packages/contracts` owns pure runtime parsing of the allow-listed public response shape. `apps/web` calls the parser after decoding JSON and maps every parser/network/provider failure to the existing generic `Worker search unavailable` error. Fixture-backed mode remains the default and never calls `fetch`.

**Tech Stack:** TypeScript 6, Vitest 4, React/Vite web workspace, pnpm workspaces.

**Spec:** `docs/claude-tasks/task-2-public-contract-validation.md`, `docs/task-4-synthetic-d1-data-contract-proposal.md`, `docs/api-error-contract.md`, `docs/web-app-and-pwa-direction.md`.

## Global Constraints

- Keep the parser dependency-free; do not add Zod or another runtime package.
- Parse only the approved `PublicSearchResultItem` and `PublicSearchResponse` fields.
- Return newly constructed sanitized objects so unknown/internal payload fields cannot enter the UI.
- Use generic parser and adapter errors; never include raw payloads, query text, D1 errors, provider details or response bodies.
- Keep `apps/web` fixture-backed by default, offline-safe and network-free.
- Do not add endpoints, response fields, persistence, authentication, mutations, providers, analytics or protected workflows.
- Preserve the existing `PACKAGE_BOUNDARY` export and the contracts package's no-dependency boundary.
- Work in an isolated task branch/worktree and preserve the current user-owned dirty worktree.

---

### Task 1: Specify parser behaviour with focused contract tests

**Files:**
- Create: `packages/contracts/src/__tests__/publicSearchParser.test.ts`
- Modify: `packages/contracts/src/__tests__/boundary.test.ts`
- Read: `packages/contracts/src/index.ts`

**Interfaces:**
- Consumes: the existing `PublicSearchResultItem` and `PublicSearchResponse` interfaces.
- Produces: executable expectations for `parsePublicSearchResultItem(value: unknown)` and `parsePublicSearchResponse(value: unknown)`.

- [ ] **Step 1: Add a valid synthetic response fixture inside the test file**

Use only the existing fictional values already present in `apps/web/src/search/__tests__/searchClient.test.ts`. Include one valid result, `page: 1`, `pageSize: 20`, `total: 1`, and `hasMore: false`. Add an unknown `internalState` property to the input result so the test can prove sanitization.

- [ ] **Step 2: Write the failing valid/sanitization assertions**

Assert that both parsers accept the valid envelope and that the returned result contains exactly the allow-listed public fields. Assert that `internalState`, source IDs, moderation fields and any other unknown input property are absent from the returned object.

- [ ] **Step 3: Write the failing invalid-field table tests**

Cover these cases with `expect(() => parser(input)).toThrow('Invalid public search response')` or the exact generic parser message chosen in the implementation:

```ts
[
  ['null envelope', null],
  ['missing results', { page: 1, pageSize: 20, total: 0, hasMore: false }],
  ['results is not an array', { results: {}, page: 1, pageSize: 20, total: 0, hasMore: false }],
  ['missing result field', { results: [{}], page: 1, pageSize: 20, total: 1, hasMore: false }],
  ['invalid area', validItem({ syntheticArea: 'space-station' })],
  ['invalid availability', validItem({ availabilityState: 'maybe' })],
  ['negative price', validItem({ priceFjdMinor: -1 })],
  ['fractional distance rank', validItem({ syntheticDistanceRank: 1.5 })],
  ['invalid timestamp', validItem({ lastRefreshedAt: 'not-a-date' })],
  ['negative page', validResponse({ page: 0 })],
  ['fractional page size', validResponse({ pageSize: 1.5 })],
  ['negative total', validResponse({ total: -1 })],
  ['non-boolean hasMore', validResponse({ hasMore: 'false' })],
]
```

Keep `validItem` and `validResponse` test helpers local to this test file; do not add fixture data to the contracts package source.

- [ ] **Step 4: Add boundary assertions for the allowed runtime exports**

Update the existing boundary test so it allows only `PACKAGE_BOUNDARY` and the two named parser functions as runtime exports. Keep the assertions that the package has no runtime dependencies, no network/storage/provider logic, no forbidden domain content and no fixture values.

- [ ] **Step 5: Run the focused contract test and observe failure**

Run: `pnpm --filter @medifind/contracts exec vitest run src/__tests__/publicSearchParser.test.ts src/__tests__/boundary.test.ts`

Expected: FAIL because the parser functions do not yet exist, confirming the tests drive the implementation.

### Task 2: Implement pure allow-listing parsers in the contracts package

**Files:**
- Modify: `packages/contracts/src/index.ts`
- Test: `packages/contracts/src/__tests__/publicSearchParser.test.ts`
- Test: `packages/contracts/src/__tests__/boundary.test.ts`

**Interfaces:**
- Consumes: `unknown` JSON values from the web adapter.
- Produces: sanitized `PublicSearchResultItem` and `PublicSearchResponse` values or one generic parser error.

- [ ] **Step 1: Add private parser helpers**

Implement small local helpers for record checks, non-empty strings, nullable brand names, allow-listed `SyntheticArea`/availability values, non-negative safe integers, booleans and timestamps. The timestamp helper must reject `NaN`/invalid dates and accept the existing UTC ISO fixture timestamp shape. Do not use a network, clock, storage, logger or provider import.

- [ ] **Step 2: Implement `parsePublicSearchResultItem` as a sanitizer**

Read only the exact public fields, validate each field, and return a newly constructed object in the declared interface order. Require non-empty strings for IDs, medicine/pharmacy identity, strength, dosage form, pack, direction, distance label and timestamp; allow `brandName` to be a string or `null`; require a non-negative safe integer for price and distance rank.

- [ ] **Step 3: Implement `parsePublicSearchResponse` as a sanitizer**

Require an object with an array `results`, parse each item through `parsePublicSearchResultItem`, require a positive safe-integer `page`, a safe-integer `pageSize` from 1 through 20, a non-negative safe-integer `total`, and a boolean `hasMore`. Return a newly constructed envelope with no unknown properties.

- [ ] **Step 4: Use one generic parser error path**

Every malformed value must throw the same safe message, such as `Invalid public search response`. Never interpolate the field name, value, JSON, query, provider error or D1 path into the thrown message. Internal helpers may use a private sentinel/error function, but the exported parser boundary must remain generic.

- [ ] **Step 5: Run the focused contract tests**

Run: `pnpm --filter @medifind/contracts exec vitest run src/__tests__/publicSearchParser.test.ts src/__tests__/boundary.test.ts`

Expected: PASS with all valid, invalid, sanitization and package-boundary assertions.

### Task 3: Replace the web adapter cast and preserve the generic error boundary

**Files:**
- Modify: `apps/web/src/search/searchClient.ts`
- Modify: `apps/web/src/search/__tests__/searchClient.test.ts`
- Test: `apps/web/src/components/__tests__/SearchScreen.test.tsx`

**Interfaces:**
- Consumes: `parsePublicSearchResponse` from `@medifind/contracts` and the existing `FetchLike`/`fetchWorkerSearch` interface.
- Produces: the unchanged `SearchOutcome` mapping and generic `Worker search unavailable` failure state.

- [ ] **Step 1: Add malformed-response adapter tests**

Add cases for a valid response with an internal field, missing envelope pagination, invalid item enum/price/timestamp, invalid JSON and a non-success response body containing a provider path. Assert every malformed case rejects with exactly `Worker search unavailable`; assert the rejection text contains none of the raw body, field value, D1/provider path or JSON.

- [ ] **Step 2: Add the default fixture-mode no-fetch regression test**

In `SearchScreen.test.tsx`, spy on `globalThis.fetch`, render the default `SearchScreen`, type an existing synthetic query, await the local results, and assert `fetch` was not called. Restore the spy in the test cleanup. Do not set `VITE_MEDIFIND_SEARCH_MODE=worker` in this test.

- [ ] **Step 3: Replace `parseWorkerResponse` with the shared parser**

Import `parsePublicSearchResponse`, remove the unchecked local cast helper, and call the shared parser after `response.json()`. Keep network, non-success, JSON-decoding and parser failures inside the same `try/catch` boundary that throws `new Error('Worker search unavailable')`.

- [ ] **Step 4: Preserve the existing valid mapping assertions**

Keep the current request URL, query parameters, headers, synthetic result mapping, exact-product match kind and empty-query no-fetch assertions unchanged except where the shared parser import requires an import update.

- [ ] **Step 5: Run focused web tests**

Run: `pnpm --filter @medifind/web exec vitest run src/search/__tests__/searchClient.test.ts src/components/__tests__/SearchScreen.test.tsx`

Expected: PASS with valid Worker mapping, malformed-response safety, non-success safety, empty-query no-fetch and default fixture-mode no-fetch coverage.

### Task 4: Run the complete verification and review the boundary

**Files:**
- Review only: `packages/contracts/src/index.ts`
- Review only: `apps/web/src/search/searchClient.ts`
- Review only: focused tests from Tasks 1 and 3

- [ ] **Step 1: Run repository quality checks**

Run: `pnpm run format:check`

Run: `pnpm lint`

Run: `pnpm typecheck`

Run: `pnpm test`

Run: `pnpm build`

Run: `pnpm run security:secrets`

Run: `pnpm run audit`

Run: `pnpm run security:trivy`

If Trivy cannot download its vulnerability database, report the exact timeout/failure and do not replace it with an unsupported claim.

- [ ] **Step 2: Review the diff for prohibited scope**

Confirm the diff adds no dependency, endpoint, response field, fixture, storage, browser persistence, raw logging, provider, auth, mutation, credential or protected-data capability. Confirm the default web path still does not call `fetch`.

- [ ] **Step 3: Commit only the Task 2 scope**

```bash
git add packages/contracts/src/index.ts packages/contracts/src/__tests__/boundary.test.ts packages/contracts/src/__tests__/publicSearchParser.test.ts apps/web/src/search/searchClient.ts apps/web/src/search/__tests__/searchClient.test.ts apps/web/src/components/__tests__/SearchScreen.test.tsx
git commit -m "fix: validate public worker response contracts"
```

- [ ] **Step 4: Return the PR handoff report**

Report the commit, exact focused/full commands and results, changed exports, synthetic-only status, security/privacy/cost impact, rollback (revert the commit), unresolved risks and the explicit statement that Task 3 must wait for contract review.

