# Task 2: Harden the shared public Worker response contract

## Goal

Replace the web adapter's unchecked response cast with a small dependency-free
runtime validator shared by the Worker-facing web code and contract tests.
Malformed, partial, or provider-shaped JSON must become the existing generic
unavailable/error state and must never enter the UI.

## Authority and exact scope

Read `docs/task-4-synthetic-d1-data-contract-proposal.md`,
`docs/api-error-contract.md`, and `docs/web-app-and-pwa-direction.md`.

Allowed files:

- Modify `packages/contracts/src/index.ts`.
- Modify `packages/contracts/src/__tests__/boundary.test.ts` or add a focused
  contract test beside it.
- Modify `apps/web/src/search/searchClient.ts` and its focused tests.
- Modify Worker mapping tests only if the shared validator exposes a real
  contract regression.

Do not add Zod, another runtime dependency, a new endpoint, response field,
provider, logging field, query persistence, or production auth.

## Interface to produce

Define and export a dependency-free function with this contract:

```ts
export function parsePublicSearchResponse(value: unknown): PublicSearchResponse;
```

It must validate `results`, every public result item, `page`, `pageSize`,
`total`, and `hasMore`, including enum, integer, non-negative and timestamp
rules already represented by `PublicSearchResultItem` and
`PublicSearchResponse`. It may throw a generic `Error`; it must not include
raw payloads, query text, D1 errors or provider details in the message.

Also provide the corresponding single-item parser used by listing detail:

```ts
export function parsePublicSearchResultItem(value: unknown): PublicSearchResultItem;
```

## Test-first steps

- [ ] Add passing expectations for valid search envelopes and valid single
  items.
- [ ] Add failures for missing fields, extra wrong types, invalid area or
  availability, negative prices/ranks, invalid dates, malformed pagination and
  a result containing internal fields instead of the public shape.
- [ ] Update `fetchWorkerSearch` to call the parser and preserve its generic
  `Worker search unavailable` error boundary.
- [ ] Prove the default fixture mode never calls `fetch`.

## Acceptance

- No unchecked `as PublicSearchResponse` or unchecked public-item cast remains
  on the web Worker adapter path.
- The parser has no network, storage, logging, provider or browser dependency.
- Valid synthetic responses render exactly as before.
- Every malformed response becomes the safe existing error state.
- Contract, web, Worker and full repository checks pass.

Commit: `fix: validate public worker response contracts`

For exact TDD steps and current source-file mapping, use the [Task 2
implementation plan](../superpowers/plans/2026-08-18-task-2-public-contract-validation-implementation.md).
