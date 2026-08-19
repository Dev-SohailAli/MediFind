# Task 12 Status Refresh and Generic Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make authenticated request/reservation status reliable through Worker-authoritative reads and mutation-completion refresh, with an optional generic browser signal that never carries sensitive details or becomes the source of truth.

**Architecture:** D1/Worker status reads are authoritative. The web client refreshes on screen open, app resume, pull-to-refresh, reconnect and successful mutation. If the approved notification option is enabled, a Worker-owned provider adapter emits only a generic refresh signal with an opaque safe destination; opening it performs a fresh authenticated read. Provider failure, permission denial, quota pause and offline conditions retain an in-app fallback and never block safe public search.

**Tech Stack:** TypeScript React/Vite web app, Cloudflare Worker/D1 through approved server-only bindings, Task 8 actor/session context, Task 11 reservation state machine, provider-neutral notification adapter or explicit in-app-only path, Vitest, Testing Library and manual browser evidence. No native push SDK, realtime database, WebSocket or message-content provider.

**Spec:** `docs/claude-tasks/future/task-12-status-refresh-notifications.md`, `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`, `docs/notification-and-status-synchronisation.md`, `docs/api-and-data-contracts.md`, `docs/api-error-contract.md`, `docs/account-recovery-runbook.md`, `docs/audit-log-policy.md`, `docs/cost-circuit-breaker-policy.md`, `docs/accessibility-policy.md`, `docs/design-system-and-screens.md` and accepted Task 8–11 evidence/decisions.

## Global Constraints

- Do not dispatch until Task 7 provider/region/privacy/cost gates pass, Task 8 identity/session/recovery is accepted, Task 11 state transitions are reviewed, the notification provider or explicit in-app-only decision is accepted, the notification privacy contract is recorded and breaker behavior is tested.
- Keep this task synthetic-only in local tests and fixtures. Never use real buyer, pharmacy, reservation, medicine, price, patient, health, prescription, contact, subscription or device-token data.
- No native push SDK, realtime database, WebSocket, long-polling loop, message-content provider, analytics SDK or third-party notification service may be added without an explicit approved task and decision. No WebSocket is part of this task.
- The browser never receives Worker secrets, provider credentials, D1/R2/KV bindings, raw provider errors, subscription tokens or authorization decisions.
- Notifications contain only a generic refresh signal and approved opaque safe destination. Never put medicine query, price, prescription, health, reservation, patient, contact, account, token or provider detail in payloads, URLs, logs, analytics or user-visible error text.
- Worker status reads enforce actor, role, branch, record relationship, session/recovery state and current authorization on every request. A cached/old notification or UI response never grants access.
- Permission denied, provider unavailable, quota-paused, revoked subscription and offline paths retain an accessible in-app status fallback and safe search; they do not silently claim that status is current.
- Preserve explicit idempotency/version behavior for Task 11 mutations, redacted audit events, rate limits, anti-enumeration, direct-binding denial and offline safety.

## Task 1: Recheck gates and freeze the status/notification contract

**Files:**

- Read: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Read: accepted Task 8 identity/session/recovery and Task 11 reservation evidence
- Read: exact approved notification provider or in-app-only decision, cost breaker, permission/consent, retention/deletion, route and privacy contract
- Modify only if a gate record or task brief needs a documentation correction before implementation

**Interfaces:**

- Input: authenticated actor/session, Task 11 request/reservation records and approved notification option.
- Output: a status-read matrix, refresh-event contract, adapter contract, client refresh triggers and safe fallback/error behavior.

- [ ] **Step 1: Confirm dependency and cost status**

Record the Task 7 packet version, Task 8/11 evidence, provider or in-app-only decision, permission/consent rule, 50/80/100% alert/breaker behavior and re-enable owner. If any is missing, stop before adding a subscription or notification field.

- [ ] **Step 2: Freeze authoritative read routes**

Record the exact approved route/method for buyer and branch-scoped request/reservation status reads, refresh-after-mutation response, subscription registration/revocation if applicable and safe notification-open destination. Do not invent routes or expose a generic record lookup.

- [ ] **Step 3: Freeze the generic signal shape**

Allow only a versioned signal type such as refresh, an opaque signal/event ID, a safe route/destination enum and expiry/schema metadata approved by the privacy review. The signal must be useless without a fresh authenticated Worker read.

- [ ] **Step 4: Freeze the in-app fallback**

Define visible status freshness, retry, unavailable, permission-denied, breaker-paused, revoked-session and offline states. The fallback must work with no notification provider and must not require safe search to be disabled.

## Task 2: Add contract-first status and signal types

**Files:**

- Modify: `packages/contracts/src/index.ts`
- Create: focused status/notification contract tests under `packages/contracts/src/__tests__/`
- Review: existing safe error/public projection/boundary tests

- [ ] **Step 1: Write failing contract tests**

Test actor-scoped status responses for buyer and branch-authorized pharmacy views, generic freshness/availability metadata, safe retry state and allowed terminal states. Test generic signal serialization and assert prohibited content never appears.

- [ ] **Step 2: Define status read models without private overexposure**

Expose only the minimum Task 11 status, safe timestamps/deadlines, confirmed price where the authorized caller may see it, approved operational reason/category and current version. Do not return audit internals, another actor/branch, prescription content, raw contacts or provider fields.

- [ ] **Step 3: Define signal and subscription outcomes**

Model approved registration/revocation/permission-denied/provider-unavailable/quota-paused/revoked/duplicate/delayed outcomes without exposing a provider name or token. If the approved decision is in-app-only, make subscription capability structurally unavailable rather than creating a fake provider seam.

- [ ] **Step 4: Pin safe errors and redaction**

Use the existing allow-listed error envelope and safe message keys. Schema tests must reject raw notification payloads, access tokens, provider errors, medicine/price/reservation details and unsafe query/path parameters.

## Task 3: Implement Worker-authoritative status reads

**Files:**

- Create/modify: approved status route handlers under `apps/worker/src/routes/`
- Modify: `apps/worker/src/routes/definitions.ts`, router, authorization, D1/repository and error seams as needed
- Test: route/integration tests under `apps/worker/src/routes/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Enforce actor and scope on every read**

Authorize buyer-owned status against the authenticated actor and reservation relationship; authorize pharmacy status against active branch role and assignment. Recheck session revocation, recovery hold, branch verification/suspension and reservation state on every read. Cross-actor/branch access returns the approved generic outcome.

- [ ] **Step 2: Reconcile effective state before responding**

Apply Task 11 server-time expiry/no-show/kill-switch rules at read time or through the approved maintenance seam before returning status. Never let a delayed notification or stale cached response show an expired, revoked or unauthorized state as current.

- [ ] **Step 3: Return safe freshness and retry metadata**

Include only approved `lastCheckedAt`/version/freshness and retryability information. Do not include internal provider/DB identifiers, raw exception text, private audit fields or an existence clue for an inaccessible record.

- [ ] **Step 4: Preserve safe search**

Provider unavailable, quota-paused or status-read failure must not disable anonymous public search or expose a new direct data path. Protected status shows an unavailable/retry state with support guidance.

## Task 4: Implement the provider-neutral signal adapter or in-app-only path

**Files:**

- Create/modify: approved Worker notification adapter/status-signal files
- Modify: `apps/worker/src/types/env.ts` only for approved server-only binding/configuration
- Modify: approved subscription/status routes and audit/kill-switch/cost seams
- Test: adapter/subscription tests under `apps/worker/src/__tests__/`

- [ ] **Step 1: Implement only the approved option**

If the gate selected a provider, validate its server-side response behind a narrow adapter and keep all provider credentials server-only. If the gate selected in-app-only, omit provider calls and expose only refresh-after-mutation/open/resume behavior. Do not implement both as an unapproved fallback system.

- [ ] **Step 2: Make delivery duplicate/stale/revoked-safe**

Use an opaque signal ID/version/expiry and approved deduplication/replay rules. Ignore duplicate, delayed, malformed, expired, revoked or wrong-actor signals without granting access. Revoking a session/subscription prevents future protected delivery and is audited.

- [ ] **Step 3: Enforce permission and breaker behavior**

Ask for browser permission only after the user enables the approved workflow. Permission denial leaves the in-app fallback. At quota pause/provider failure, stop new costly signals, preserve status reads and safe search, emit redacted operational evidence and require the approved owner/fresh-auth path to re-enable.

- [ ] **Step 4: Emit generic signals after state changes**

Connect successful Task 11 mutation outcomes to one deduplicated refresh signal or in-app invalidation. Never send a signal for an unauthorized/failed mutation, and never include status content in the signal. Audit the safe outcome, not the payload secret.

## Task 5: Implement the web refresh coordinator and fallback UI

**Files:**

- Create: approved `apps/web/src/status/` refresh coordinator, client and state components
- Modify: `apps/web/src/App.tsx`, Requests/status surfaces, strings and styles only for approved states
- Test: focused web coordinator/components plus relevant `apps/web/__tests__` files

- [ ] **Step 1: Refresh on every required trigger**

Re-fetch authoritative status on screen open, app resume/visibility return, pull-to-refresh, successful mutation, reconnect and notification open. Use the approved credentials transport and never read a token or provider subscription value into application state.

- [ ] **Step 2: Prevent refresh races and stale overwrites**

Use request sequence/abort/actor-session guards so an older response cannot overwrite a newer response, a signed-out session cannot update a later actor, and a revoked subscription cannot reopen protected data. Handle duplicate triggers without redundant unsafe mutations.

- [ ] **Step 3: Render safe in-app states**

Cover loading, current, stale/retry, provider unavailable, quota-paused, permission denied, revoked session, signed-out, offline, empty and safe error states. Show only authorized Task 11 status and generic support guidance; never render notification payload content as status.

- [ ] **Step 4: Preserve offline/accessibility behavior**

Offline mode may explain that protected status requires reconnection; it must not make stale protected data look current or queue a refresh mutation. Test keyboard/focus return, live-region announcements, labels, non-colour status, 200% zoom, narrow layouts and screen-reader order.

## Task 6: Verify races, privacy and browser fallback evidence

**Files:**

- Review: contracts, Worker reads/adapter, cost/kill-switch seams, web coordinator and fallback UI
- Evidence: a synthetic Task 12 report and manual browser evidence linked from the brief, containing no protected data or credentials

- [ ] **Step 1: Run focused race/subscription tests**

Cover refresh races, stale response suppression, duplicate delivery, delayed/expired signal, revoked subscription/session, logout, cross-actor/branch access, provider failure, quota pause, permission denial, offline resume, recovery hold and mutation-completion refresh.

- [ ] **Step 2: Run notification/error redaction tests**

Assert no medicine query, price, prescription, health, reservation, patient, contact, token, raw provider error or internal ID appears in signal payloads, URLs, logs, audit events, browser storage, service-worker cache or user-visible errors.

- [ ] **Step 3: Collect manual browser evidence**

Run the approved browser matrix for permission denied, in-app fallback, open/resume refresh, pull-to-refresh, logout/revocation, offline/reconnect, keyboard/focus and screen-reader status announcements. Record only actual browser/device results; do not claim provider delivery if it was not run.

- [ ] **Step 4: Run repository quality/security checks**

Run focused contracts/Worker/web tests, `pnpm run format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and repository security/secret/dependency checks. Use only the approved local synthetic verification path; record hosted/provider evidence only if it actually ran.

- [ ] **Step 5: Review rollback and residual risk**

Verify the notification feature can be disabled independently while authoritative in-app reads and safe search remain available, subscriptions can be revoked, no protected data is orphaned and no client cache becomes authority. Report gate versions, commit, exact evidence, synthetic/protected status, privacy/security/cost impact, rollback and residual risks.

- [ ] **Step 6: Commit only approved Task 12 scope**

```bash
git add packages/contracts/src/index.ts packages/contracts/src/__tests__ apps/worker/src/routes apps/worker/src/security apps/worker/src/http apps/worker/src/types apps/worker/src/__tests__ apps/web/src apps/web/__tests__ docs/evidence
git commit -m "feat: add authoritative status refresh adapter"
```

Adjust the staged paths to the exact approved files. Do not include credentials, `.env` files, real notifications/subscriptions, production data or unrelated user changes.
