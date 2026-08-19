# Task 8 Identity, Session and Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the smallest provider-neutral, server-owned identity/session/recovery boundary for the protected web pilot while preserving anonymous public search, safe errors, anti-enumeration, revocation, MFA assurance and the documented 24-hour buyer recovery hold.

**Architecture:** The browser remains an untrusted PWA. A future approved Worker adapter validates the selected provider's server-side credential and produces an opaque `ActorContext`; the browser never selects an actor, role, branch, MFA state or authorization decision. Session, device, recovery and revocation records remain server-only. D1 is used only for the exact approved records after Task 7; no provider SDK, binding or route is invented before the gate passes.

**Tech Stack:** TypeScript Worker, React/Vite web app, provider-neutral interfaces, D1-like test seams, Vitest, Testing Library and synthetic fixtures. Any concrete identity SDK, cookie/token transport, SMS/email provider or binding must come from the accepted Task 7 evidence record.

**Spec:** `docs/claude-tasks/future/task-8-identity-session-recovery.md`, `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`, `docs/phone-verification-policy.md`, `docs/staff-access-lifecycle-policy.md`, `docs/api-error-contract.md`, `docs/security-privacy-compliance.md`, `docs/security-architecture-threat-model.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md` and the accepted Task 7 ADR, if one exists.

## Global Constraints

- Do not start implementation unless Task 7 gate IDs `G-02`, `G-03`, `G-04`, `G-06`, `G-07` and `G-09` are `PASS` with current evidence. A missing or expired row is a stop report, not a default choice.
- Do not select or name an identity, MFA, SMS, email, notification, region or session provider. Do not add SDK code, secrets, credentials, real bindings or hosted configuration until the exact provider and transport are approved.
- Keep the active web-only Cloudflare direction. Do not add Firebase, Google Cloud, Cloud Run, API Gateway, Firestore, native apps, native push or store configuration.
- Keep local tests, fixtures, browser screenshots and CI artifacts synthetic-only. Never use real phone numbers, emails, OTPs, reset links, tokens, prescription content or production records.
- Do not place raw phone/email values, OTPs, reset links, provider tokens, session secrets, prescription data or authentication diagnostics in logs, URLs, notifications, analytics, browser storage or error text.
- The browser never receives D1/R2/KV credentials or direct binding access. Server-side authorization derives scope from the validated actor and stored records, not request headers or browser-selected IDs.
- Preserve generic anti-enumeration behavior, safe API error shape, persistent limits, audit redaction, direct-binding denial, offline safety and accessible auth states.
- Anonymous `GET /v1/search` and `GET /v1/listings/{id}` remain available and unchanged; introducing identity must not make the synthetic public read path require authentication.

## Task 1: Recheck the approval gate and freeze the provider-neutral interface

**Files:**

- Read: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Read: the accepted Task 7 ADR and exact provider/transport evidence, if present
- Modify only if the approved gate requires a documentation correction: the Task 8 brief and Task 7 evidence record

**Interfaces:**

- Input: accepted provider/product/region/processor, token/session transport, MFA assurance, recovery owner, cost breaker, approved bindings, exact route list and retention/deletion rules.
- Output: a provider-neutral adapter contract and an implementation matrix that names no unapproved vendor or credential.

- [ ] **Step 1: Verify every prerequisite row**

Record the gate-record version and confirm `G-02`, `G-03`, `G-04`, `G-06`, `G-07` and `G-09` are `PASS`, not merely present. Confirm the 24-hour recovery hold, privileged fresh-auth window, support/recovery owner, provider breaker and approved server bindings are explicit. If not, stop before editing application code.

- [ ] **Step 2: Freeze the approved route and transport matrix**

Copy the exact approved auth/session/recovery route names, methods, request/response contracts, browser transport, cookie policy if applicable, expiry/revocation behavior, rate limits and provider-unavailable mapping into the task evidence. Do not invent generic `/login`, `/verify` or `/reset` routes to fill a missing decision.

- [ ] **Step 3: Define the provider-neutral seams**

Specify interfaces for credential validation, actor projection, session issuance/revocation, MFA assurance, recovery challenge/hold and provider-breaker status. Every adapter method returns typed safe outcomes and opaque IDs only; provider exceptions are converted at the Worker boundary. The fake adapter used by tests must be explicitly synthetic and must not resemble a live credential flow.

## Task 2: Add contract-first identity and session types

**Files:**

- Modify: `packages/contracts/src/index.ts`
- Test: `packages/contracts/src/__tests__/identity.test.ts`
- Review: `packages/contracts/src/__tests__/boundary.test.ts`

**Interfaces:**

- Produces opaque actor, session, device, MFA-assurance, recovery and safe-auth-error types.
- Consumes only approved wire fields; raw provider claims, contacts, tokens and secrets remain outside the public contract package.

- [ ] **Step 1: Write failing contract tests**

Test that an actor projection can represent anonymous, buyer, pharmacy-scoped and admin-scoped contexts with opaque IDs, role set, branch scope, assurance level, authentication time, session/device references and recovery restrictions. Test that raw phone/email, OTP, token, provider claim, prescription and secret fields are rejected or absent from serialized public types.

- [ ] **Step 2: Define stable discriminated unions**

Add types only for the accepted contract: anonymous versus authenticated actor context; approved role/branch scope; MFA assurance and fresh-auth metadata; session/device state; recovery state including the 24-hour hold; safe auth errors using the existing `SafeErrorCode`/message-key model. Do not expose provider-specific JWT claims or a browser token type.

- [ ] **Step 3: Pin redaction and serialization behavior**

Add a test-safe projection/redaction helper or contract assertion that serializes only allow-listed fields. Ensure error responses can carry a correlation ID and safe retryability without revealing whether an account, phone, email, invitation or recovery record exists.

## Task 3: Implement the Worker identity adapter and actor derivation

**Files:**

- Modify: `apps/worker/src/security/actor.ts`
- Create or modify: the provider-neutral adapter file beside `apps/worker/src/security/actor.ts`, only within the approved scope
- Modify: `apps/worker/src/types/env.ts`
- Test: `apps/worker/src/__tests__/actor.test.ts`
- Test: a new adapter-focused test under `apps/worker/src/__tests__/`

**Interfaces:**

- `deriveActor` may become asynchronous only if the approved credential validation requires it; update all call sites and tests together.
- The adapter receives trusted server configuration and the request transport selected by Task 7, never a browser-supplied role/branch/MFA assertion.

- [ ] **Step 1: Preserve anonymous and spoofed-header tests**

Keep tests proving that absent credentials produce anonymous context, client-supplied actor/role/branch/MFA headers are ignored, malformed credentials fail closed and public search/listing access remains unchanged. Add a regression test that a request cannot elevate from anonymous by changing URL, query, body or header values.

- [ ] **Step 2: Validate only the approved server-side credential**

Use the accepted adapter to validate issuer/audience/expiry/signature or equivalent provider proof, session revocation and assurance. Reject missing, expired, malformed, revoked, wrong-tenant, wrong-provider and provider-unavailable outcomes with safe internal decisions. Never log the credential or return its raw failure.

- [ ] **Step 3: Project minimum actor context**

Return only the opaque actor ID, approved role/branch scope, session/device references, MFA assurance, authentication timestamp and recovery restrictions needed for authorization. Do not trust role, branch, verification or recovery claims unless the approved server-side source validates them.

- [ ] **Step 4: Map provider failure safely**

Map unavailable/timeout/breaker outcomes to the approved generic `UNAVAILABLE` or reviewed auth error. Preserve safe public reads where the route is explicitly public, while protected actions fail closed. No provider identifier, issuer detail, stack trace, OTP or contact value may reach the response or logs.

## Task 4: Extend authorization and route integration without changing public search

**Files:**

- Modify: `apps/worker/src/security/authorize.ts`
- Modify: `apps/worker/src/http/router.ts` and `apps/worker/src/index.ts` only as required by the approved route/adapter contract
- Modify: `apps/worker/src/routes/definitions.ts`
- Test: `apps/worker/src/__tests__/authorize.test.ts`, `router.test.ts` and `worker.integration.test.ts`

- [ ] **Step 1: Write the authorization matrix tests first**

Cover anonymous public health/search/listing reads; authenticated buyer actions; pharmacy owner/staff branch scope; admin/support scope; required MFA assurance; fresh-auth window; revoked session; recovery hold; wrong branch; disabled/suspended actor; and unknown action. Every protected default is deny.

- [ ] **Step 2: Enforce server-derived scope**

Authorize against the actor context and server-loaded resource ownership/branch relationship. Ignore browser-selected branch, role, actor, verification and listing-owner fields. Preserve generic `UNAUTHENTICATED`/`FORBIDDEN` distinctions only where the approved contract allows them without enumeration.

- [ ] **Step 3: Integrate only the approved auth routes**

Add exact route definitions from the Task 7 matrix and no others. Route matching must preserve method/path anti-enumeration behavior, body-size checks, safe error envelopes, per-action limits and idempotency/replay rules where a route mutates session or recovery state.

- [ ] **Step 4: Prove public compatibility**

Run integration tests showing anonymous synthetic `/v1/search` and `/v1/listings/{id}` response shape and behavior are unchanged, while a protected route cannot be accessed with a fabricated header, URL parameter or fixture role.

## Task 5: Add approved session, device and recovery persistence

**Files:**

- Create: the exact additive D1 migration named in the approved Task 7 schema decision
- Create or modify: Worker session/recovery repository files beside `apps/worker/src/security/`
- Test: synthetic D1 repository and migration tests under `apps/worker/src/__tests__/`

- [ ] **Step 1: Freeze the field matrix before migration**

Require an approved field-level privacy classification, owner, retention/deletion behavior, indexes, uniqueness/idempotency constraints and export/restore behavior for session, device, revocation and recovery records. If the gate does not specify the schema, do not create a migration.

- [ ] **Step 2: Store minimum server-only records**

Persist only opaque actor/session/device references, provider subject digest or approved pseudonymous reference, issued/expiry/revoked timestamps, assurance/recovery state, version and redacted audit linkage. Store no raw OTP, reset link, bearer token, phone/email, prescription content or provider secret. Use approved hashing/digest behavior for any replay-sensitive material.

- [ ] **Step 3: Enforce revocation and replay rules atomically**

Test session/device revocation, all-session revocation after recovery, one-time recovery completion, duplicate/replayed requests, stale versions, expired holds and provider-breaker behavior. Recovery must revoke affected sessions/tokens and enforce the 24-hour hold before any prescription action; it must not expose account existence.

- [ ] **Step 4: Add synthetic export/restore and deletion evidence**

Extend the local synthetic verification path only if Task 7 approved these records. Verify deterministic export/checksums, restore into a clean synthetic database, deletion propagation and absence of secrets/contacts in export or logs. Do not run a remote migration or hosted command as part of this task.

## Task 6: Add safe web session and recovery states

**Files:**

- Create: `apps/web/src/auth/` provider-neutral context, client and state components as approved
- Modify: `apps/web/src/App.tsx`, Account/prototype surface, strings and styles only for the approved auth states
- Test: `apps/web/__tests__/App.test.tsx` and focused auth component/hook tests

- [ ] **Step 1: Define the browser transport boundary**

Use only the Task 7-approved transport. Never place bearer tokens, OTPs, reset links, raw contacts or protected records in localStorage, sessionStorage, IndexedDB, URLs, service-worker caches or analytics. If the approved transport is an HttpOnly session, the web client must use only safe authenticated requests and never read the cookie value.

- [ ] **Step 2: Implement explicit safe states**

Cover signed-out, signing-in/requesting-code, generic verification failure, rate-limited, provider unavailable, signed-in buyer, MFA-required privileged action, recovery pending/24-hour hold, revoked session, offline and signed-out-after-revocation. Render only reviewed message keys and generic support guidance.

- [ ] **Step 3: Preserve offline safety**

Offline mode may keep public synthetic search behavior but must not queue sign-in, verification, recovery, session mutation, reservation or prescription actions. On resume, revalidate session state through the Worker; stale UI must not imply authorization.

- [ ] **Step 4: Verify accessibility and focus behavior**

Add keyboard, focus-return, labels, live-region, error-association, reduced-motion and screen-reader assertions for changed states. Test zoom/200% and narrow responsive layouts using synthetic content. Do not claim device/browser acceptance without running it.

## Task 7: Run security, quality and handoff verification

**Files:**

- Review: all changed contracts, Worker security/routes/migrations and web auth files
- Evidence: a synthetic Task 8 report linked from the task brief, without provider secrets or protected data

- [ ] **Step 1: Run focused tests**

Run the contracts identity tests, Worker actor/authorization/router/error/integration/repository tests and web auth/App/accessibility tests using only fake provider outcomes and synthetic records.

- [ ] **Step 2: Run required repository checks**

Run `pnpm run format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and the repository security/secret/dependency checks. Run only approved local Wrangler dry-run/verification commands if Task 7 explicitly authorizes them; otherwise record them as not run.

- [ ] **Step 3: Perform a leakage and boundary review**

Search changed files and test artifacts for OTPs, token-like values, raw contacts, provider errors, credentials, D1/R2/KV browser access, localStorage/sessionStorage auth writes, prescription fields, analytics/cookies and old Firebase/GCP/native direction. Confirm anonymous public search remains unchanged and protected routes fail closed.

- [ ] **Step 4: Report exact evidence and residual risks**

Report the Task 7 gate-record version, commit, exact test/check output, route/contract changes, synthetic-only status, security/privacy/cost impact, rollback/migration reversal, provider/hosted evidence actually run and unresolved risks. Do not claim a selected provider or protected/production readiness beyond the accepted gate.

- [ ] **Step 5: Commit only the approved Task 8 scope**

```bash
git add packages/contracts/src/index.ts packages/contracts/src/__tests__/identity.test.ts apps/worker/src/security apps/worker/src/routes apps/worker/src/http apps/worker/src/types apps/worker/src/__tests__ apps/web/src/auth apps/web/src/App.tsx apps/web/src/content apps/web/src/styles apps/web/__tests__ apps/worker/migrations
git commit -m "feat: add approved worker identity boundary"
```

Adjust the staged path list to the exact approved files and do not include credentials, local `.env` files, production exports or unrelated user changes.
