# Task 17 Fiji Hours, Freshness and Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep branch hours, listing freshness and reservation pickup expiry truthful using server time, `Pacific/Fiji` business rules, exceptional closures and bounded idempotent reconciliation. Delayed maintenance must not make an old listing appear current.

**Architecture:** The Worker owns business-time calculations, branch/hour authorization, freshness eligibility, public projection filtering and reconciliation cursors. D1 is authoritative only after the approved schema/binding gate; reads enforce freshness independently of the maintenance job. The browser receives safe hours/freshness labels and degraded search results, never buyer location, exact stock, raw query history or maintenance internals.

**Tech Stack:** Existing `apps/web` PWA, existing optional `apps/worker`, shared contracts, IANA timezone support for `Pacific/Fiji`, approved D1 repository/migrations, server-only bounded maintenance harness or reviewed Worker maintenance binding, deterministic clock injection for tests, optimistic concurrency, idempotent cursor checkpoints and append-only audit events. No new provider, binding, scheduler, analytics system or recurring cost is authorized by this plan alone.

**Spec:** `docs/claude-tasks/operations/task-17-hours-freshness-reconciliation.md`, `docs/branch-location-and-hours-policy.md`, `docs/pilot-operations.md`, `docs/data-dictionary-and-ownership.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/audit-log-policy.md`, `docs/price-integrity-policy.md`, `docs/claude-tasks/future/task-10-listing-lifecycle-price-integrity.md`, accepted Task 11 reservation and Task 16 activation evidence, and the approved cost/infrastructure decisions.

## Global Constraints

- Do not implement or enable the workflow until the address/hours schema, listing lifecycle, reservation expiry rules, retention boundary and Worker maintenance binding or local-only harness are approved.
- Keep all local fixtures and reconciliation data synthetic. No real buyer, pharmacy, medicine, contact, health, prescription, reservation or production data may be used.
- Use server UTC timestamps for storage and comparison, and `Pacific/Fiji` only for user-facing hours, business-day calculations, reminders, reservation pickup and closure precedence. Never trust the browser clock for eligibility.
- Preserve all Fiji addresses in the schema. Suva-only pilot activation remains a separate cohort/activation control; do not hard-code Suva into address validation or discard future Fiji branches.
- A stale listing must not remain eligible because maintenance is delayed. Reads and public projection builders independently evaluate freshness at request/rebuild time.
- Do not store exact stock quantity, buyer location/coordinates, raw search text, raw search history or unbounded pharmacy-authored status notes as part of this task.
- Every repeatable mutation or maintenance checkpoint uses the approved idempotency, optimistic-concurrency and bounded retry rules. No unbounded scan, global hot cursor, duplicate audit side effect or silent overwrite.
- Do not claim scheduled/hosted maintenance, Cloudflare binding behavior or real-time browser evidence unless actually run and recorded.

## Task 1: Establish the time and schema gate

**Files:**

- Create: task-specific synthetic gate/evidence record only if the repository evidence convention approves one
- Modify: `docs/claude-tasks/operations/task-17-hours-freshness-reconciliation.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md` to link this plan
- Read: approved branch/address schema, listing lifecycle, reservation expiry, cost and infrastructure decisions

**Interfaces:**

- Input: approved structured Fiji branch/address/hours contract, listing fields and lifecycle, reservation pickup rules, freshness thresholds and maintenance execution choice.
- Output: versioned time/freshness/reconciliation matrix, fail-closed behavior and evidence owner.

- [ ] **Step 1: Record stable rule rows**

Record the authoritative timezone, weekly interval shape, split/closed-day behavior, exceptional closure/replacement precedence, server freshness clock, 24-hour warning threshold, seven-day removal threshold, 15-minute reconciliation cadence, 30-minute maintenance alert, reservation pickup validation, cursor owner, retry budget and rollback/recovery owner.

- [ ] **Step 2: Fail closed on unresolved policy**

If any threshold, retention behavior, maintenance binding, cost ceiling or public label is unapproved, keep the feature in local synthetic harness mode. Do not invent a scheduler, binding, alert destination, provider or production table.

- [ ] **Step 3: Define degraded behavior**

When maintenance is late or unavailable, request-time reads exclude listings that are older than seven days, label 24-hour stale candidates as potentially outdated, expose truthful last-updated time and retain only safe eligible search results. Do not silently mark a listing fresh because a job ran.

## Task 2: Implement structured Fiji address and hours contracts

**Files:**

- Modify: approved shared contracts and Worker validation/repository layer
- Create: address/hours schemas, business-time utilities and deterministic fixtures
- Modify: branch owner UI only for the approved hours/address scope

- [ ] **Step 1: Validate structured Fiji addresses**

Require address line 1, optional line 2, locality/city/town, applicable province, fixed country code `FJ`, validated coordinate values and validation/source state. Keep owner-submitted material changes private until re-verification; never expose evidence or exact validation detail publicly.

- [ ] **Step 2: Model weekly and exceptional intervals**

Store one or more non-overlapping open intervals per weekday, including closed days and split hours. Store dated exceptional closures or replacement intervals separately. An exception takes precedence over the weekly schedule, and invalid overlaps, reversed intervals and impossible dates return stable safe field errors.

- [ ] **Step 3: Make business-time utilities authoritative**

Implement pure functions for open-at, next-open interval, business-day advancement, reservation expiry and freshness display using an injected instant and IANA timezone. Cover Fiji timezone boundaries, midnight/date transitions, split intervals, closed days, holiday/exception precedence and no-expiry-inside-closed-time cases.

- [ ] **Step 4: Protect owner updates**

Require branch-scoped owner/authorized operational role, current version, approved idempotency key and safe audit reason for routine hours changes. Address or material identity changes create a private pending verification state rather than changing public projection directly.

## Task 3: Enforce listing freshness at writes, reads and projection

**Files:**

- Modify: approved listing lifecycle/repository/projection services
- Modify: Worker search/detail response mapping and existing listing-refresh command
- Create: freshness threshold and projection eligibility tests

- [ ] **Step 1: Preserve actual refresh time**

On an authorized listing create/update/refresh, write the server `lastRefreshedAt` and listing version atomically with the accepted change. Do not accept a client timestamp as freshness evidence. Preserve exact-pack FJD price and listing identity rules from Task 10.

- [ ] **Step 2: Define deterministic freshness states**

Compute current, may-be-outdated at 24 hours without refresh and removed-from-search at seven days without refresh from server time. Preserve the actual last-updated timestamp for display and audit; never use a generic maintenance timestamp.

- [ ] **Step 3: Make all public eligibility checks fail closed**

The public projection includes only verified/active branch and eligible listing identity, price, capability state and freshness. Search/detail reads re-evaluate the threshold so delayed reconciliation cannot leak a seven-day-old listing. Search must remain safe and useful when stale items are excluded, with no implication that excluded results are unavailable everywhere.

- [ ] **Step 4: Prevent unsafe freshness transitions**

Reject stale-version updates, replayed refreshes and cross-branch writes. A refresh does not alter exact stock, buyer history, prescription data or price without its own approved command and audit event. No bulk refresh or client-side loop is introduced.

## Task 4: Build bounded idempotent reconciliation

**Files:**

- Modify: approved Worker maintenance/repository abstraction
- Create: bounded cursor migration/configuration only if the maintenance binding/local harness is approved
- Create: reconciliation metrics/audit tests without raw identifiers

- [ ] **Step 1: Use a bounded cursor and lease**

Process a fixed maximum number of eligible records per run using an opaque ordered cursor, lease/ownership and checkpoint version. The cursor must advance after successful or safely classified work, expire/retry after failure and avoid one global hot record.

- [ ] **Step 2: Make each operation idempotent**

Re-running a batch must not duplicate visibility transitions, notifications, audit events or metric counts. Use deterministic state/version guards and safe maintenance-run references. A partial failure resumes from the last verified checkpoint without skipping records.

- [ ] **Step 3: Detect delayed maintenance**

Run the approved 15-minute cadence, record start/end/state/processed/error counts and emit a safe operational alert after 30 minutes without a successful checkpoint. Alert payloads contain no prescription content, contact values, raw queries, exact buyer identifiers or reusable object URLs.

- [ ] **Step 4: Keep reads independent of the job**

Add tests proving search/detail freshness remains correct when the maintenance cursor is paused, delayed, duplicated, partially failed or replayed. Recovery of the cursor must not make an already-excluded listing visible without a fresh server-authorized refresh.

## Task 5: Validate reservation pickup expiry against branch hours

**Files:**

- Modify: approved reservation command/service and shared result contracts
- Modify: branch hours utility and reservation UI only where required for truthful expiry
- Create: expiry boundary and conflict tests

- [ ] **Step 1: Calculate expiry in `Pacific/Fiji`**

Given the pharmacy-confirmed price, pickup window and approved reservation expiry, calculate the actual deadline with server time and branch hours. Do not present an expiry that ends while the branch is closed when a compatible open interval is required by policy.

- [ ] **Step 2: Handle exceptions and hour changes safely**

Holiday/exception closures take precedence. A later hours change must not silently rewrite a buyer-confirmed reservation; return a safe operational conflict/cancellation path with actual buyer notice when the pharmacy cannot honor the confirmed pickup.

- [ ] **Step 3: Preserve reservation invariants**

Keep the pharmacy-confirmed FJD price immutable after approval. Expiry, cancellation, collection and buyer no-longer-needed transitions remain branch-scoped, idempotent and audited; no payment, delivery or medical decision is introduced.

## Task 6: Build truthful web states

**Files:**

- Modify: approved `apps/web` listing cards/details, branch-hours display and reservation confirmation/status states
- Modify: shared query invalidation/refresh handling only as needed for server-authoritative freshness
- Create: component and accessibility tests

- [ ] **Step 1: Show actual freshness context**

Use translated labels for current, may-be-outdated and unavailable-from-search states with last-updated time and pharmacy attribution. Do not show exact stock or suggest that a stale/missing result means medicine is unavailable everywhere.

- [ ] **Step 2: Show hours and expiry plainly**

Render regular/exception hours, pickup window, actual reservation expiry and safe no-guarantee language. Mark closure/holiday precedence clearly without exposing internal maintenance state.

- [ ] **Step 3: Handle degraded/offline behavior**

Offline screens must not create or queue freshness, hours or reservation mutations. Show last-known data with a stale/offline label and require server confirmation before protected action. Maintenance delay must render a safe degraded search state rather than a false success.

- [ ] **Step 4: Verify accessibility and language expansion**

Test keyboard navigation, focus, semantic time/status labels, non-colour meaning, contrast, narrow viewports, 200% zoom, reduced motion and English/iTaukei/Fiji Hindi text expansion. Time displays must include an understandable local date/time and not rely on color alone.

## Task 7: Rehearse boundaries and hand off evidence

**Files:**

- Create: synthetic time/freshness/reconciliation/expiry fixtures and tests
- Create: task-specific evidence record if approved by the repository evidence convention
- Modify: task brief/roadmap with actual validation outcomes

- [ ] **Step 1: Exercise hours and timezone cases**

Cover split hours, closed days, overlapping/reversed intervals, exception closure/replacement precedence, Fiji date boundaries, reservation expiry near closing and holiday transitions, and an address change that remains private pending verification.

- [ ] **Step 2: Exercise freshness cases**

Cover just-before/at/after 24 hours, just-before/at/after seven days, delayed maintenance, paused cursor, duplicate run, partial batch, retry and safe search with all candidate listings stale. Verify last-updated time never changes unless an authorized refresh occurs.

- [ ] **Step 3: Exercise privacy and authorization cases**

Attempt cross-branch hours/listing/maintenance access, browser clock manipulation, client timestamp spoofing, stale-version overwrite, raw query/location leakage, exact-stock leakage and unauthorized reservation-expiry changes. Verify stable safe errors and redacted audit records.

- [ ] **Step 4: Run checks and record limitations**

Run focused contracts/Worker/web/repository tests, format/lint/typecheck/test/build/security checks required by the baseline and relevant local Wrangler validation only when no deployment or credential action is involved. Mark hosted maintenance, real provider, real notification, real data and production evidence as not run unless actually performed.

- [ ] **Step 5: Commit only approved scope**

After review, stage only the Task 17 implementation, tests, approved documentation links and evidence. Use commit message `feat: add branch hours freshness and reconciliation`. Do not stage credentials, `.env` files, production exports, real operational records or unrelated user changes.
