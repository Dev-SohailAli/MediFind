# Task 11 Buyer OTC Reservation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the smallest protected buyer OTC reservation lifecycle: request collection, pharmacy approve/decline, buyer cancel, pharmacy cancel with an operational reason, pharmacy collection confirmation, buyer feedback and server-derived expiry at a valid collection deadline.

**Architecture:** The authenticated Worker owns eligibility, actor/branch authorization, reservation state, exact-pack confirmed price, Fiji-time deadline calculation, concurrency, idempotency, audit events and safe status signals. D1 reservation records are server-authoritative. The browser renders authorized state and submits explicit commands; it never reserves stock, chooses a branch authority, sets a future state/price/deadline or queues a sensitive mutation offline. Prescription-required reservations, payment, delivery, chat and dispensing decisions remain out of scope.

**Tech Stack:** TypeScript React/Vite web app, Cloudflare Worker/D1 through approved server-only bindings, Task 8 actor/session context, Task 9 branch/role authorization, Task 10 eligible listing/price projection, provider-neutral notification adapter or approved in-app fallback, Vitest, synthetic D1 fixtures and accessible Testing Library states.

**Spec:** `docs/claude-tasks/future/task-11-buyer-otc-reservations.md`, `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`, `docs/account-recovery-runbook.md`, `docs/branch-location-and-hours-policy.md`, `docs/price-integrity-policy.md`, `docs/notification-and-status-synchronisation.md`, `docs/api-and-data-contracts.md`, `docs/api-error-contract.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/audit-log-policy.md`, `docs/data-dictionary-and-ownership.md`, relevant reservation decisions in `docs/decisions.md` and accepted Task 8–10 evidence.

## Global Constraints

- Do not dispatch until Task 7 data/retention, recovery, security and cost gates are accepted; Task 8 buyer identity/recovery is accepted; Task 9 branch/role authorization is accepted; Task 10 eligible listings and immutable price snapshots are accepted; and the notification fallback and exact reservation retention decision are recorded.
- Keep this task synthetic-only in local tests and fixtures. Never use real buyer, patient, pharmacy, contact, reservation, health, prescription or payment data.
- Prescription-required reservation remains disabled and out of scope. Do not add prescription upload, scanning, reviewer approval, file access, payment, delivery, stock guarantee, chat, arbitrary buyer/pharmacy messaging or a reusable dependent profile. No payment and no WebSockets are part of this task.
- Use only the approved exact route and notification contracts. Do not select a notification vendor, add native push, add WebSockets/realtime listeners or put reservation details in a notification.
- Every mutation is an explicit command with minimum input, authenticated role/branch/record authorization, opaque 24-hour idempotency key, current version, transaction/concurrency enforcement, rate limit, safe error and redacted audit event.
- The server derives legal next state, current exact-pack FJD price, branch hours/deadline, audit event and generic status signal. The browser cannot supply a future state, price, expiry, role, branch authority or dispensing decision.
- Offline mode never queues or replays reservation commands. Cached/provisional UI is never current authority; reconnect/resume requires a fresh authorized Worker read.
- Preserve anonymous public search/detail behavior and safe generic errors; reservation records and patient/request details never appear in public projections, URLs, logs, analytics, notifications or unauthorized views.

## Task 1: Recheck gates and freeze reservation contracts

**Files:**

- Read: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Read: accepted Task 8, Task 9 and Task 10 evidence/decisions
- Read: exact approved reservation field, retention/deletion, notification fallback, role and route matrices
- Modify only if the gate record or task brief needs a documentation correction before implementation

**Interfaces:**

- Input: authenticated buyer actor, verified/visible eligible OTC listing, branch business hours/exceptions, exact current listing price and approved status/notification contracts.
- Output: a state/command matrix mapping actor, branch, listing, person relationship, deadline, price snapshot, audit event, notification signal and rollback for each transition.

- [ ] **Step 1: Confirm protected prerequisites**

Record the gate-record version and prove Task 8 buyer recovery hold behavior, Task 9 branch ownership/role state, Task 10 listing eligibility/price snapshot and the approved notification fallback. During `recovery_hold`, buyers cannot create or manage reservations; after reconnect the Worker remains authoritative.

- [ ] **Step 2: Freeze the minimum reservation data matrix**

Require the approved buyer/account reference, listing/branch reference, self/child/dependent relationship, minimum identified-person fields, state, exact confirmed FJD minor price, pickup/deadline values, version, no-show/operational reason references and audit/correlation references. Do not create a reusable dependent profile or accept unapproved free text.

- [ ] **Step 3: Freeze state and command transitions**

Use the approved names for `request`, `approve`, `decline`, `cancel`, `expire`, `mark_collected` and `confirm_no_longer_needed`. Document legal source/target states, actor/role, branch scope, current-version requirement, reason requirement and safe user outcome. No generic state patch or client-chosen transition is allowed.

- [ ] **Step 4: Freeze Fiji-time expiry and notification behavior**

Use `Pacific/Fiji`, regular/exceptional hours and the approved default/pharmacy-selected expiry rule. The server must choose a deadline compatible with an open collection interval and explain the actual window. Notifications are generic refresh signals or approved in-app status only; opening/reconnecting always re-fetches authorized state.

## Task 2: Add contract-first reservation types and validation

**Files:**

- Modify: `packages/contracts/src/index.ts`
- Create: focused reservation contract tests under `packages/contracts/src/__tests__/`
- Review: existing safe error/public search contracts and boundary tests

- [ ] **Step 1: Write failing command/state tests**

Test minimum request/approve/decline/cancel/expire/mark-collected/confirm-no-longer-needed inputs and safe outputs. Assert that clients cannot submit price, branch authority, pharmacy decision, deadline, future state, stock quantity, prescription status, payment, delivery or arbitrary notes.

- [ ] **Step 2: Define discriminated state and relationship contracts**

Represent the approved pending/approved/declined/cancelled/expired/collected/no-longer-needed states, `self`/`child`/`dependent` relationship values and exact safe status fields. Keep person information request-scoped and avoid a durable dependent profile or public reservation identifier that exposes another actor.

- [ ] **Step 3: Pin price and notification safety**

Use integer FJD minor units and an immutable confirmed-price field. Define only generic notification/refresh event fields and safe message keys; prohibit medicine, price, reservation, patient, prescription, health, contact and access-token content from notification or error contracts.

## Task 3: Add the approved additive D1 schema and reservation repository

**Files:**

- Create: the exact approved additive reservation/state-event/no-show schema migration
- Create or modify: reservation repository/transition modules under `apps/worker/src/data/`
- Modify: `apps/worker/src/types/env.ts` only for approved server-only bindings
- Test: migration/repository/time/concurrency tests under `apps/worker/src/data/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Validate schema and retention before SQL**

Require approved privacy classification, owner, retention/deletion, export/restore, indexes, foreign keys, state/version constraints and no-show policy. If reservation retention is still unset, stop before creating the protected migration; do not guess a period.

- [ ] **Step 2: Enforce one active reservation per medicine/person**

Use a server-safe uniqueness/transaction rule for one active reservation for the same buyer/account and identified person/medicine until it completes, expires, declines or cancels. Include branch/listing context without exposing it to an unauthorized caller. Concurrent requests must produce one accepted result and one safe conflict/outcome.

- [ ] **Step 3: Store confirmed price immutably**

On pharmacy approval, copy the current eligible listing's exact-pack FJD minor price into the reservation under transaction/version control. Later listing refreshes cannot mutate it. A pharmacy unable to honour it must use the approved operational cancellation path with reason and notice; the buyer must not discover a silent change at collection.

- [ ] **Step 4: Implement time and no-show data safely**

Store server UTC timestamps plus approved pickup window/deadline and timezone interpretation. Derive deadlines against `Pacific/Fiji` hours and exceptions; never trust client local time. Record only the minimum structured no-show/policy outcome needed to enforce the approved three-confirmed-no-shows-in-30-days rule, with privacy-approved retention.

- [ ] **Step 5: Add deterministic synthetic export/restore evidence**

Extend local synthetic export/restore checks for reservation and state-event records only after the retention/schema gate passes. Verify no raw contact, free text, prescription content, token, payment value or reusable dependent profile enters exports or logs.

## Task 4: Implement the Worker reservation state machine

**Files:**

- Create/modify: approved reservation route handlers under `apps/worker/src/routes/`
- Modify: `apps/worker/src/routes/definitions.ts`, `apps/worker/src/http/router.ts`, `apps/worker/src/security/authorize.ts`, idempotency/version/rate-limit/audit seams and approved notification adapter/fallback
- Test: focused route/integration tests under `apps/worker/src/routes/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Implement buyer request**

Require authenticated buyer context, eligible OTC listing, current public/source version, allowed relationship and approved minimum person fields. Re-check branch/listing eligibility and recovery hold in the transaction; derive the pending state and safe deadline. Do not promise stock, approval, dispensing or price until the pharmacy approves.

- [ ] **Step 2: Implement pharmacy approve/decline**

Require an active authorized role for the listing's branch, current reservation version and eligible current listing. On approve, confirm and snapshot the exact current FJD price, validate pickup hours/deadline and emit a safe status signal. On decline, require only an approved reason category and never reveal private operational detail to an unauthorized actor.

- [ ] **Step 3: Implement cancellation paths**

Allow the buyer to cancel pending/approved before collection within the approved states. Allow the pharmacy to cancel an approved reservation only with an operational reason/category and immediate generic buyer status signal, including the price-change/cannot-honour path. Reject cancellation after terminal collection/expiry or return the approved idempotent result for a safe retry.

- [ ] **Step 4: Implement expiry and collection transitions**

Expire automatically or on an approved maintenance/read-time reconciliation once the server deadline passes, unless already collected/cancelled/declined. Only authorized pharmacy staff mark collected; buyer `confirm_no_longer_needed` is feedback and never the pharmacy source of truth. Enforce current state/version and audit every transition.

- [ ] **Step 5: Enforce no-show policy without clinical inference**

Record the approved collection/no-show outcome only when the source-of-truth pharmacy action and approved buyer feedback support it. After three confirmed no-shows in 30 days, pause new reservations for the account through the approved server flag/review path while preserving public search; do not infer a clinical or dispensing status.

- [ ] **Step 6: Emit safe status signals**

Create one generic in-app/approved adapter event per successful state change, deduplicated by idempotency and safe for delayed/revoked delivery. The signal contains no medicine, price, branch, person, reservation, prescription or health details; every consumer re-fetches and re-authorizes current state.

## Task 5: Add buyer/pharmacy reservation UI states

**Files:**

- Create/modify: approved `apps/web/src/` reservation screens, hooks and status components
- Modify: approved strings/styles/navigation for buyer Requests and branch-scoped pharmacy Requests
- Test: focused web component/hook tests and relevant `apps/web/__tests__` files

- [ ] **Step 1: Implement buyer request and status states**

Render selected OTC listing/person confirmation, pharmacy-managed/no-guarantee language, pending, approved with confirmed FJD price and pickup deadline, declined, cancelled, expired, collected, no-longer-needed and unavailable states. Do not show prescription actions or promise availability.

- [ ] **Step 2: Implement pharmacy operational states**

Render only branch-scoped pending/approved queues and allowed commands for the authorized role. Show exact confirmed price, pickup window and structured reason categories as approved; never expose another branch, buyer contact beyond approved minimum or prescription content.

- [ ] **Step 3: Preserve offline/accessibility behavior**

Offline mode disables request/approve/decline/cancel/collect/feedback controls or makes the unavailable state explicit; it never queues them. On resume/app open, fetch authoritative state. Test focus, labels, live status announcements, non-colour state, keyboard, 200% zoom and narrow layouts with synthetic content.

## Task 6: Verify lifecycle, privacy and delivery boundaries

**Files:**

- Review: contracts, migration, repository, state machine, time calculation, notification adapter/fallback and web states
- Evidence: a synthetic Task 11 report linked from the brief, containing no protected data or credentials

- [ ] **Step 1: Run required state/concurrency tests**

Cover concurrent requests, one-active-person/medicine rule, duplicate retries, changed idempotency payload, stale versions, invalid transitions, price change before approval, immutable approved price, branch hours/exception deadlines, automatic expiry, cancellation reasons, collection source of truth, no-show counting/pause, cross-branch access and recovery hold.

- [ ] **Step 2: Run notification/error redaction tests**

Assert generic anti-enumeration responses and absence of medicine, price, reservation, patient, prescription, health, contact, token or provider details in API errors, audit events, notification payloads, URLs, logs, exports and browser storage.

- [ ] **Step 3: Prove no out-of-scope capability**

Search changed files and routes for payment, delivery, chat, free-text messaging, prescription upload/review, stock guarantees, native push, WebSockets, realtime listeners, direct bindings and generic PATCH/state updates. Confirm public search remains available and reservation kill-switch behavior can pause reservations independently.

- [ ] **Step 4: Run repository quality/security checks**

Run focused contract/Worker/web tests, `pnpm run format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and repository security/secret/dependency checks. Use only the approved local synthetic verification path; report hosted/Wrangler evidence only if it actually ran.

- [ ] **Step 5: Review rollback and handoff**

Verify export before migration reversal, safe reservation kill-switch/feature disablement, no orphaned state, price snapshot preservation and a clear owner for recovery/support. Report exact gate versions, commit, evidence, synthetic/protected status, privacy/security/cost impact, rollback and residual risks.

- [ ] **Step 6: Commit only approved Task 11 scope**

```bash
git add packages/contracts/src/index.ts packages/contracts/src/__tests__ apps/worker/migrations apps/worker/src/data apps/worker/src/routes apps/worker/src/security apps/worker/src/http apps/worker/src/types apps/worker/src/__tests__ apps/web/src apps/web/__tests__
git commit -m "feat: add protected otc reservation lifecycle"
```

Adjust the staged paths to the exact approved files. Do not include credentials, `.env` files, real buyer/reservation data, production exports or unrelated user changes.
