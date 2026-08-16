# First synthetic-foundation API and data specification

## Purpose and approval boundary

This is the implementation-grade API/data specification for **task 1: Foundation only** in the [implementation sequence](implementation-sequencing.md). It deliberately defines a zero-business-data foundation so Claude can create the approved monorepo/toolchain, mobile shell and API package skeleton without creating a disguised backend, account system or production-ready service.

It applies the founder-approved [initial MVP design proposal](design-proposals/initial-mvp-design-proposal.md), but does not implement a user journey or screen from that proposal. Task 2 is the first approved non-sensitive buyer-search/design task and needs its own API/data specification and task brief.

This document authorises no cloud account, Firebase project, Firebase SDK integration, authentication provider, database, object storage, queue, secret, analytics, notification, map, payment, upload or deployment. It uses no real or realistic buyer, pharmacy, medicine, inventory, prescription, reservation or staff data.

## Exact task-1 scope

### In scope

- One TypeScript pnpm workspace matching the [monorepo and toolchain policy](monorepo-and-toolchain-policy.md): `apps/mobile`, `apps/api`, `packages/contracts` and `packages/config`.
- A buildable mobile application shell that identifies itself only as a local synthetic-development build and contains no buyer/pharmacy/admin workflow, sign-in surface, medicine listing, interactive search, role selector or fake dashboard.
- A buildable API package skeleton with no business route, no external listener requirement and no connection to any provider, database or storage system.
- An empty-but-versioned shared-contract package that establishes only its package boundary. It contains no prematurely invented endpoint, domain model, role, storage schema or future-field placeholder.
- Non-secret shared lint/type/test/build configuration and documentation for the exact reproducible local commands selected in the later task brief.
- CI scaffolding and quality checks only after the separate [test foundation specification](test-and-acceptance-strategy.md) and repository-readiness requirements are converted into the task brief. A workflow must not be added merely because a skeleton exists.

### Explicitly out of scope

- Any `/v1` HTTP business endpoint, health endpoint exposed outside a local test process, OpenAPI document or mock server.
- Firebase Authentication, phone OTP, email recovery, App Check, MFA, session/device state, roles, workspaces or any imitation of them.
- Firestore, Cloud Storage, Cloud Run, API Gateway, Cloud Scheduler, Cloud Tasks, ClamAV, OpenTofu, cloud credentials, `.env` files, remote state or deployment configuration.
- Search, listing/detail UI, maps/directions, navigation tabs, reservation, pharmacy verification, staff, admin, audit, support, prescription, upload, notification or analytics behaviour.
- Synthetic business fixtures. The task may use only anonymous, non-domain build/test constants such as package names or a static build label; the task-2 fixture catalogue must be separately approved.
- Any production, closed-beta or public application build/release.

## Repository/package boundary contract

| Location | Task-1 permitted responsibility | Task-1 prohibited content |
| --- | --- | --- |
| `apps/mobile` | Native mobile shell and non-secret build configuration. | Firebase client SDK, direct API/database/storage code, account/session/role state, medicine/pharmacy fixtures, network calls and protected-data cache. |
| `apps/api` | Independently type-checkable/buildable TypeScript package boundary. | Public listener, `/v1` route, Fastify business plugin, cloud SDK, provider credential, database/storage client, authorization or domain workflow. |
| `packages/contracts` | Versioned package boundary and safe package export surface only. | Request/response/domain schemas, roles, state enums, credentials, server-only models, data-access code or speculative fields. |
| `packages/config` | Non-secret shared tool configuration. | Runtime secrets, provider identifiers, environment URLs, production project/resource names or deployment configuration. |

The mobile package must not import from `apps/api`. The API package must not be included in a mobile build. A shared dependency must be added only when the task brief names its purpose and verifies the package boundary.

## API contract

### Approved route inventory for task 1

There are **no API routes** in task 1.

| API concern | Task-1 contract |
| --- | --- |
| Public route prefix | No route is implemented. `/v1` remains the future business-API namespace defined by [API and data contracts](api-and-data-contracts.md). |
| Health/readiness route | No externally reachable route is created. A later local test harness may create an in-process assertion only if its task brief names it; it must not imply deployment readiness. |
| Request/response schemas | None. The common future error shape in [API error contract](api-error-contract.md) remains documentation, not a task-1 wire contract. |
| Authentication/App Check | None. No token, header, mock identity or bypass is accepted/stored. |
| Rate limits/idempotency/version headers | None. No mutation or route exists. |
| External network access | Prohibited. The mobile and API skeleton must pass without a network request. |

The [v1 API endpoint inventory](v1-api-endpoint-inventory.md) remains the authoritative future route map. Task 1 neither implements nor changes it.

## Data contract

### Domain records and fixtures

Task 1 creates **no domain record**, domain fixture, database collection, object path, event, cache record or telemetry event.

| Data concern | Task-1 contract |
| --- | --- |
| Buyer, contact, session/device, role or consent | Not represented or simulated. |
| Pharmacy, branch, verification, staff or agreement | Not represented or simulated. |
| Medicine concept, listing, public-search projection or location | Not represented or simulated. |
| Prescription, file, reservation, request-state event or audit event | Not represented or simulated. |
| Firestore collections/security rules/indexes | None. No Firebase/Firestore configuration exists in this task. |
| Object storage/files/uploads | None. |
| Client persistence/offline cache | None beyond platform/runtime defaults outside MediFind control; task code must not create a persistence layer. |
| Analytics/crash/support telemetry | None. Do not add an SDK, event name, synthetic identifier or tracking configuration. |

The logical records in [data dictionary and ownership model](data-dictionary-and-ownership.md) are intentionally not materialised. Their fields, classifications and ownership rules will be selected only by a later scoped task contract.

### Schema/version/migration rules

- No Firestore, storage or provider schema exists; therefore there is no migration, backfill, index, security-rule or retention job in task 1.
- No domain schema version is created. The `packages/contracts` package version is a package-management concern only; it must not be presented as an API/data-schema version.
- A future task that adds the first data contract must declare every field, field classification, nullable/optional rule, enum, validation bound, authorization relationship, compatibility rule and migration/rollback plan before implementation.
- No placeholder `any`, loose JSON bag, generic `metadata`, future flag, mock role or arbitrary state field may be introduced to anticipate later work.

## Authority and state-machine contract

There is no authenticated actor, role, branch, request, listing or state transition in task 1. Consequently:

- no client or server authorization decision may be implemented;
- no state enum or generic state-update mechanism may be implemented;
- no task-1 UI may claim a user is signed in, verified, a pharmacy staff member or an admin; and
- no simulated success/error result may be labelled as a medicine, reservation, prescription or pharmacy workflow outcome.

Future role, state and authorization requirements remain governed by [requirements](requirements.md), [API mutation and concurrency policy](api-mutation-and-concurrency-policy.md), [security architecture and threat model](security-architecture-threat-model.md) and their task-specific schemas.

## Design boundary

The founder-approved visual design is a source of truth for later UI work, not an instruction to implement its screens in task 1. The only task-1 mobile presentation may be a minimal non-interactive local-development shell that:

- uses no account, pharmacy, medicine, medical, price or reservation content;
- does not request platform permissions;
- does not use a custom logo/asset or imply public release readiness;
- does not make a health, availability, security or medical claim; and
- is removed or replaced deliberately by the first approved screen task rather than becoming an undocumented product screen.

## Security, privacy and cost guardrails

- Use no secrets, environment files, API keys, cloud project identifiers, test phone numbers, external endpoint URLs or third-party service configuration.
- Do not add a dependency that sends telemetry, contacts a provider at runtime, bundles a credential, or is unnecessary for the approved foundation boundary.
- All build/test values are anonymous and non-domain. Do not create a fixture that resembles a Fiji pharmacy, medicine, buyer or prescription merely to make the shell look finished.
- A failed local build/type/test check must fail locally/CI without a cloud fallback.
- The task has zero intended vendor usage and zero intended usage charge. Any dependency/license, build service or external request that changes this requires a decision-change request.

## Required evidence before the task brief can be approved

The later foundation task brief must pin the then-current Node.js Active LTS release, pnpm version, mobile/Expo approach, test/lint/format tools and exact commands in accordance with [monorepo and toolchain policy](monorepo-and-toolchain-policy.md). It must also reference:

1. the completed test foundation specification;
2. the completed repository-readiness checklist for synthetic code;
3. the relevant portions of the founder-approved design proposal; and
4. this document's zero-route/zero-data boundary.

Until those items are approved, this specification authorises no code.

## Acceptance checklist for this specification

- [x] First task is restricted to the approved foundation-only sequence.
- [x] Endpoint list, schemas, enums, authorization matrix, state transitions, collections, indexes and migrations are explicitly empty rather than implicit.
- [x] The mobile/API/package boundaries prevent a fake or direct-client backend from entering the foundation task.
- [x] Synthetic-only, no-network, no-provider, no-data and no-telemetry constraints are explicit.
- [x] Later search and protected workflows require their own contract/task approval.
