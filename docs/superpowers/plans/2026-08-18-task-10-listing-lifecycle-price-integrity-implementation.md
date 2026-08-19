# Task 10 Listing Lifecycle and Price Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement pharmacy-owned listing creation, refresh, ambiguity review submission and withdrawal with canonical medicine identity, exact-pack FJD pricing, freshness, optimistic concurrency, safe audit evidence and deterministic public projection eligibility.

**Architecture:** The authenticated Worker is the only listing mutation boundary. An inventory manager acts only within a verified branch granted by Task 9; the browser cannot choose a pharmacy, branch owner, canonical identity, prescription classification or public state. D1 source listing records remain authoritative. A deterministic server-side projection produces the existing read-only search/detail contract; the browser never writes or rebuilds the projection.

**Tech Stack:** TypeScript React/Vite web app, Cloudflare Worker/D1 through approved server-only bindings, provider-neutral Task 8 actor context, Task 9 branch/role authorization, explicit JSON commands, Vitest, synthetic fixtures and accessible Testing Library states. No new catalog provider, search index, route, binding or mutation is inferred.

**Spec:** `docs/claude-tasks/future/task-10-listing-lifecycle-price-integrity.md`, `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`, `docs/price-integrity-policy.md`, `docs/pharmacy-verification-policy.md`, `docs/dynamic-pharmacy-content-policy.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/api-error-contract.md`, `docs/data-dictionary-and-ownership.md`, `docs/audit-log-policy.md`, `docs/security-privacy-compliance.md` and the accepted Task 7–9 evidence/decisions.

## Global Constraints

- Do not dispatch until Task 7 gate IDs `G-03`, `G-05`, `G-06`, `G-07` and `G-09` are `PASS`, Task 8 identity/session evidence is accepted, Task 9 branch/role authorization is accepted and the additive listing/price schema is approved.
- Keep this task synthetic-only in local tests and fixtures. Never use real medicine, pharmacy, inventory, contact, buyer, reservation or prescription data.
- Do not add a generic `PATCH`, arbitrary state patch, browser-selected branch/pharmacy authority, direct D1 access, unapproved catalog provider or production binding.
- Canonical medicine identity, aliases, pack/form/strength/route/release attributes and prescription-required classification remain MediFind-owned. Pharmacy staff may submit a candidate/ambiguous identity but cannot redefine the catalog.
- Store and transmit price only as a non-negative integer FJD minor-unit value for the exact purchasable identity/form/strength/route/release/pack. Reject ranges, estimates, contact-for-price, derived unit prices and mismatched packs.
- Every repeatable command requires the approved opaque idempotency key, safe request fingerprint, server-derived state, current version where applicable, persistent rate limit and redacted audit event.
- Preserve anonymous public search/detail behavior and response redaction. Public projection exclusion must fail closed; a listing is never public merely because its source row exists.
- Do not implement reservations, payment, prescription upload, scanning, notifications or a new catalog workflow in this task. Add only the schema/read contract needed for Task 11 to preserve a confirmed reservation price.

## Task 1: Recheck dependencies and freeze the listing field matrix

**Files:**

- Read: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Read: accepted Task 8 identity/session/recovery evidence and Task 9 verification/staff-access evidence
- Read: exact approved listing, price, audit, projection and reservation-compatibility field matrix
- Modify only if a gate record or task brief needs a documentation correction before implementation

**Interfaces:**

- Input: verified branch, authorized inventory-manager actor, approved canonical identity reference, exact pack attributes, availability, price, version and command contracts.
- Output: an implementation matrix for create, refresh, ambiguous-identity submission and withdrawal, including actor scope, state transitions, projection behavior, audit event and rollback.

- [ ] **Step 1: Confirm branch and role authority**

Record the Task 9 evidence version and verify that an actor's inventory role is active, scoped to the target branch and not suspended by verification expiry or reviewer-continuity safety. The browser-supplied branch/pharmacy ID is only an input to resolve against server-side authorization, never authority.

- [ ] **Step 2: Freeze exact listing fields**

Require approved fields for canonical identity/candidate reference, pharmacy-authored display values, exact strength/form/route/release/pack attributes, OTC/prescription classification reference, availability, FJD minor price, freshness timestamps, state, identity-match state, version and audit references. Unknown or future fields must be rejected.

- [ ] **Step 3: Freeze freshness and projection behavior**

Record the approved stale-after rule and the five-minute projection propagation target from the price policy separately. Do not silently replace the existing synthetic `DEFAULT_STALE_AFTER_MS` behavior; protected runtime values must come from the accepted policy/configuration and source `lastUpdatedAt` must remain visible in the approved read model.

- [ ] **Step 4: Freeze reservation-price compatibility**

Before Task 11, record how an approved reservation snapshots the exact confirmed FJD minor price and why later listing refreshes cannot mutate that snapshot. Do not implement reservation state here, but fail the gate if the approved schema cannot preserve price immutability.

## Task 2: Add contract-first command and listing types

**Files:**

- Modify: `packages/contracts/src/index.ts`
- Create: focused contract tests under `packages/contracts/src/__tests__/`
- Review: existing public search/listing contract tests and boundary tests

- [ ] **Step 1: Write failing command tests**

Test minimum inputs and safe outputs for create listing, refresh availability/price, submit ambiguous identity for review and withdraw listing. Assert that arbitrary state, branch ownership, canonical classification, prescription status, raw contact, prescription content and public projection fields cannot be client-authored.

- [ ] **Step 2: Define discriminated command/state contracts**

Represent exact approved listing states and identity-match states, availability values, FJD minor price, pack identity, opaque version and safe audit/correlation references. Separate source listing command responses from the public projection contract so internal identity/verification fields never leak.

- [ ] **Step 3: Pin price and pack validation**

Add contract-level validation for integer non-negative minor units, explicit `FJD`, exact pack identity and required attributes. Reject decimal/float ambiguity, negative/overflow values, missing pack, per-unit price, range/estimate/contact-for-price text and a price attached to a different identity/form/strength/pack.

## Task 3: Add the approved additive D1 schema and repository seams

**Files:**

- Create: the exact approved additive listing/price/history/schema migration
- Create or modify: listing repository/projection modules under `apps/worker/src/data/`
- Modify: `apps/worker/src/types/env.ts` only for approved server-only bindings
- Test: migration/repository/projection tests under `apps/worker/src/data/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Validate every column against the approved matrix**

Do not write SQL until each column has a privacy classification, owner, state rule, version behavior, retention/deletion, export/restore and audit decision. Preserve the existing synthetic six-table search fixture and add only approved protected/listing fields.

- [ ] **Step 2: Enforce exact identity and price constraints**

Use foreign keys or server-side validation for canonical concept/branch references, explicit identity-match state, pack attributes, non-negative FJD minor price, listing state, availability, freshness and version. Separate candidate/ambiguous identity from public eligibility; do not make an unreviewed candidate searchable.

- [ ] **Step 3: Preserve safe price history/reservation snapshot support**

Store immutable safe previous/new minor values and reviewed reason/category in audit or the exact approved history record. Provide a server-only snapshot seam for a future approved reservation price without exposing public price history or adding reservation behavior now.

- [ ] **Step 4: Make projection rebuild deterministic**

Rebuild only from authoritative source rows and approved catalog/branch/verification state, with fixed reference time/configuration. Exclude missing, withdrawn, stale, ambiguous, unapproved, unverified, hidden or invalid-price rows. A failed rebuild or partial source state must not publish an unsafe projection.

## Task 4: Implement explicit Worker listing commands

**Files:**

- Create/modify: approved listing route handlers under `apps/worker/src/routes/`
- Modify: `apps/worker/src/routes/definitions.ts`, `apps/worker/src/http/router.ts`, `apps/worker/src/security/authorize.ts`, audit/idempotency/version seams and projection orchestration as needed
- Test: focused route/integration tests under `apps/worker/src/routes/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Implement create listing**

Allow only an active authorized inventory manager to create a listing for an authorized verified branch. Resolve canonical identity and required pack attributes server-side; reject duplicate exact branch/identity/pack records; create a non-public candidate or review-required state when identity is ambiguous. Do not let the client set visibility, verification, prescription classification, owner, version or public projection.

- [ ] **Step 2: Implement refresh availability/price**

Require the current opaque version, exact current listing identity/pack context, valid availability and non-negative FJD minor price. Validate branch role and current state, atomically write the new values, increment version, set server time, emit a redacted audit event and rebuild/update the approved projection. A stale version returns safe `CONFLICT` and never overwrites newer data.

- [ ] **Step 3: Implement ambiguous identity submission**

Accept only the approved minimum candidate metadata, mark the listing non-public and create the reviewed internal state/audit reference. Do not allow pharmacy staff to approve catalog identity, aliases, pack equivalence or prescription-required classification. Generic responses must not disclose reviewer queues or other pharmacy records.

- [ ] **Step 4: Implement withdrawal**

Require current version and branch authorization, transition the listing to the approved terminal/withdrawn state, remove it from public projection deterministically and emit an audit event. Repeated idempotent withdrawal returns the original safe result; stale or cross-branch attempts fail without mutation.

- [ ] **Step 5: Apply failure and quota behavior**

Map D1/provider/quota failures to safe unavailable or reviewed errors, preserve existing public search where safe, and never publish a partially updated listing. Rate-limit create/refresh/identity/withdraw commands by the approved actor/action/window without storing raw contact/search values.

## Task 5: Preserve the public search/detail projection

**Files:**

- Modify: `apps/worker/src/data/projection.ts`, `apps/worker/src/data/search.ts` or the approved projection owner
- Test: projection and public route tests under `apps/worker/src/data/__tests__/`, `apps/worker/src/routes/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Assert all eligibility gates**

Require canonical identity approval, valid exact-pack price, active listing, verified/visible branch and organisation, approved branch state, current freshness and any Task 9 reviewer-continuity requirement. Prescription-required eligibility remains disabled when the branch has no active reviewer; eligible OTC listings remain independent.

- [ ] **Step 2: Preserve response redaction**

Verify anonymous search/detail responses contain only the existing public contract: safe medicine/listing display fields, availability, exact FJD price, distance/freshness labels and approved direction text. Do not expose internal IDs beyond the approved opaque public ID, source version, verification state, candidate state, audit data, staff identity or private notes.

- [ ] **Step 3: Verify deterministic propagation**

Test a refresh at a fixed clock, projection rebuild, public read and stale/failed rebuild. Record evidence for the approved five-minute propagation target without claiming hosted timing unless it actually ran. Preserve the current local fixture response and no-network/default web mode.

- [ ] **Step 4: Prove price snapshot compatibility**

Use a synthetic future-reservation contract fixture to show that an approved exact-pack confirmed price is copied immutably and is not read live from the mutable listing. Do not add buyer reservation commands or real reservation data in Task 10.

## Task 6: Add scoped inventory UI states

**Files:**

- Create/modify: approved `apps/web/src/` inventory/listing components and hooks
- Modify: approved strings/styles/navigation only for the protected inventory flow
- Test: focused web component/hook tests and relevant `apps/web/__tests__` files

- [ ] **Step 1: Render server-authorized listing fields**

Show only branch-scoped inventory data returned by the Worker. Use explicit forms for create, refresh, ambiguity submission and withdrawal. Display FJD at the UI boundary from integer minor units; never let display formatting become the stored value.

- [ ] **Step 2: Render safe lifecycle states**

Cover draft/candidate, review required, active/public, stale, withdrawn, suspended/unavailable, conflict, rate-limited, provider unavailable, unauthorized and revoked-session states. Do not optimistically claim a public update before the authoritative response.

- [ ] **Step 3: Preserve offline and accessibility safety**

Offline mode must not queue listing mutations or imply that a price/availability refresh succeeded. Test keyboard/focus return, field labels, numeric validation errors, live status, screen-reader association, 200% zoom and narrow layouts using synthetic content.

## Task 7: Verify price integrity, lifecycle and delivery boundaries

**Files:**

- Review: contracts, migration, repository, command routes, projection, audit/idempotency/version seams and web states
- Evidence: a synthetic Task 10 report linked from the brief, containing no protected data or credentials

- [ ] **Step 1: Run required negative/concurrency tests**

Cover role/branch isolation, unknown fields, invalid/negative/decimal/overflow price, missing/mismatched pack, duplicate exact identity, ambiguous identity, unauthorized classification, stale version, duplicate idempotency, changed-request key conflict, rate limit, quota/provider failure, withdrawal replay, last-reviewer behavior, projection exclusion, public response redaction and exact-pack reservation-price immutability.

- [ ] **Step 2: Prove no anonymous mutation path**

Test anonymous, spoofed-role, spoofed-branch, cross-pharmacy and cross-branch requests for every command. Confirm no browser-supplied owner, identity, visibility, verification or prescription flag can authorize or publish a listing.

- [ ] **Step 3: Run repository quality/security checks**

Run focused contract/Worker/web tests, `pnpm run format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and repository security/secret/dependency checks. Use only the approved local synthetic verification path; record hosted/Wrangler evidence only if it actually ran.

- [ ] **Step 4: Review rollback and residual risk**

Verify export before migration reversal, safe withdrawal/feature disablement, projection regeneration and reservation-price compatibility. Search changed files/artifacts for real data, raw contacts, credentials, direct browser bindings, generic PATCH/state patches, unreviewed catalog behavior, payment/reservation/prescription features and old Firebase/GCP/native direction.

- [ ] **Step 5: Commit only approved Task 10 scope**

```bash
git add packages/contracts/src/index.ts packages/contracts/src/__tests__ apps/worker/migrations apps/worker/src/data apps/worker/src/routes apps/worker/src/security apps/worker/src/http apps/worker/src/types apps/worker/src/__tests__ apps/web/src apps/web/__tests__
git commit -m "feat: add pharmacy listing lifecycle and price integrity"
```

Adjust the staged paths to the exact approved files. Do not include credentials, `.env` files, real inventory, production exports or unrelated user changes.
