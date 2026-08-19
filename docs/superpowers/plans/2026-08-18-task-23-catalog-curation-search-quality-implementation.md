# Task 23 Catalog Curation and Search Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve canonical medicine identity matching from a bounded, reviewed synthetic feedback sample while preserving exact-product safety, explainable results and the ban on clinical substitution, external catalogues, public ratings and ranking manipulation.

**Architecture:** The Worker owns canonical medicine concepts, reviewed aliases, candidate/rejection decisions, public search projection and curator authorization. D1 is authoritative only under the approved task/environment gate; the browser receives a minimum search projection and safe result explanation. Curation changes are versioned, idempotent, append-only audited and deterministically exportable. Search never lets a buyer or pharmacy create a public identity directly.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, shared contracts, synthetic catalog fixtures, server-side canonicalization and projection builders, bounded quality-report categories, curator/admin commands, deterministic baseline/export checks and accessible search states. No external medicine catalogue, clinical recommendation engine, fuzzy matching provider, analytics/session replay, public review system, payment/ranking service or new provider is authorized by this plan alone.

**Spec:** `docs/claude-tasks/post-pilot/task-23-catalog-curation-search-quality.md`, `docs/data-and-search.md`, `docs/data-dictionary-and-ownership.md`, `docs/audit-log-policy.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/pilot-operations.md`, accepted Task 22 release evidence and the approved feedback/privacy decision.

## Global Constraints

- Do not implement until Task 22 is accepted, the pilot feedback sample is bounded and redacted, a named curator/reviewer is assigned and stored feedback categories are approved.
- If feedback contains real prescription, health, buyer, pharmacy, contact or clinical information, stop and request a redacted synthetic reproduction. Do not copy it into fixtures, tickets, logs, metrics or prompts.
- Do not import, scrape, license or call an external medicine catalogue. Do not add clinical substitution, therapeutic recommendation, treatment advice, unreviewed fuzzy matching, saved searches, favourites, public reviews or paid/sponsored ranking.
- Preserve identity distinctions for strength, form, route, release, pack, brand and other approved attributes. Never silently merge incompatible products.
- Public search exposes only approved concept/alias results joined to eligible pharmacy/listing projections. It never exposes internal evidence, buyer identity/location, raw query history, prescription content, exact stock or report text.
- Every curation/report mutation requires server authorization, role/scope, expected version, idempotency, bounded input and redacted audit. The browser cannot self-assign curator authority or write the public projection.
- Use invented fixtures only. No real data, production catalogue, public launch, provider, paid usage, new region or cohort expansion is authorized by this plan.

## Task 1: Establish the feedback and curation gate

**Files:**

- Create: task-specific synthetic catalog gate/evidence record only if the evidence convention approves one
- Modify: `docs/claude-tasks/post-pilot/task-23-catalog-curation-search-quality.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md` to link this plan
- Read: accepted Task 22 evidence, bounded feedback/privacy decision, curator/reviewer ownership and stored-category approval

**Interfaces:**

- Input: redacted synthetic feedback sample, approved categories, curator/reviewer roles, baseline fixture/export and search-safety rules.
- Output: versioned curation decision matrix, baseline quality report, fail-closed data boundary and rollback path.

- [ ] **Step 1: Validate feedback eligibility**

Record sample source/category/count and synthetic status without raw query, health, prescription, contact or direct identifier. If the sample cannot be safely minimized, mark Task 23 blocked for implementation and create only synthetic reproduction fixtures.

- [ ] **Step 2: Define review ownership**

Name the curator, independent reviewer where required, branch of authority, approval/rejection responsibilities, review date and escalation path. Pharmacy staff and buyers may report bounded quality categories but cannot approve public canonical identities.

- [ ] **Step 3: Freeze baseline and rollback**

Record baseline fixture/export hash, deterministic query cases, expected exact/alias/no-result outcomes, projection version, current ranking inputs and rollback/forward-fix owner. Do not compare against real user history.

## Task 2: Define canonical identity and curation contracts

**Files:**

- Modify: existing shared medicine/search contracts only in the approved scope
- Create: concept, alias, candidate-match, rejection and bounded report validators
- Create: synthetic fixture/export schemas and forbidden-field tests

- [ ] **Step 1: Model explicit states**

Use approved explicit states for proposed, under-review, approved, rejected, ambiguous, stale/superseded and retired where needed. Include immutable ID, canonical/alias kind, normalized safe token, structured identity attributes, source category, reviewer decision, version, timestamps and audit reference. Do not add an unbounded free-text evidence field.

- [ ] **Step 2: Preserve exact-product attributes**

Keep generic/brand identity, active ingredient, strength, dosage form, route, release, pack and prescription/OTC status distinct. An alias may help discover an approved concept but cannot erase an incompatible product attribute or make an approximate match appear exact.

- [ ] **Step 3: Define safe result semantics**

Return exact match, approved alias match, candidate/ambiguous, stale/unavailable and no-result states with translated safe explanations. Never disclose internal candidate evidence, reviewer names, report text or a therapeutic substitute.

- [ ] **Step 4: Define bounded quality reports**

Use an allow-list such as incorrect identity, missing alias, incompatible attribute, stale result, duplicate candidate, unsafe wording or no-result issue. Store minimal category, target opaque ID, state/outcome and safe evidence reference; do not accept clinical free text or attachments.

## Task 3: Implement server-owned curation and projection workflow

**Files:**

- Modify: approved Worker/D1 repository, commands and projection builder
- Create: migrations only after the exact schema/binding gate is accepted
- Create: authorization, conflict, idempotency and audit tests

- [ ] **Step 1: Add explicit curator commands**

Implement only approved commands to submit bounded report, propose candidate, approve alias/concept, reject/mark ambiguous, supersede/retire and rebuild projection. Require authorized curator/reviewer role, current version, scope, safe category, idempotency key and server-generated decision timestamp.

- [ ] **Step 2: Keep public projection fail closed**

Only approved canonical/alias data enters the projection. Rejected, ambiguous, stale, retired or incompatible identities are excluded or shown with a safe non-exact state according to the contract. A projection rebuild is deterministic and does not make pharmacy-owned listing data public by itself.

- [ ] **Step 3: Enforce concurrency and audit**

Reject stale versions and changed idempotency replays without overwriting a newer decision. Audit every accepted/rejected/conflicted curation action with opaque actor/target, role/scope, safe state transition, category, correlation ID and integrity metadata. Exclude raw reports, query text, prescription content, contacts and internal evidence.

- [ ] **Step 4: Protect existing listing and privacy boundaries**

Do not rewrite pharmacy-authored identity, price, availability, pack or prescription status through a catalog decision. Do not expose buyer location, search history, report identity or curator evidence to public/pharmacy result consumers.

## Task 4: Build deterministic search-quality regression coverage

**Files:**

- Create: exact/alias/incompatible/ambiguous/stale/duplicate/no-result fixtures
- Modify: Worker search tests and public projection contract tests
- Create: synthetic JSONL/export/checksum and baseline comparison report

- [ ] **Step 1: Test exact and approved alias cases**

Verify exact tokens take precedence, approved aliases resolve only to the intended concept and prefixes remain bounded and deterministic. Do not use probabilistic or unreviewed fuzzy matching.

- [ ] **Step 2: Test incompatible attributes**

Verify strength, form, route, release, pack and brand mismatches do not silently merge, rank as exact or create a therapeutic substitute. Use explicit safe mismatch/no-result language.

- [ ] **Step 3: Test rejected/ambiguous/stale decisions**

Verify rejected, ambiguous, superseded and stale concepts do not enter eligible public projection; current safe listings remain available when their own branch/listing/freshness state is valid.

- [ ] **Step 4: Test reports and privacy**

Verify bounded report categories, cross-branch access denial, no raw report text/identity/health/prescription leakage into projection/logs/metrics/generic errors and one audit record per accepted mutation.

- [ ] **Step 5: Reproduce the baseline**

Export only the approved synthetic decision set with version/checksum and rerun it in an isolated environment. Confirm the same result states/ranking inputs and document intentional changes, rollback and residual ambiguity.

## Task 5: Verify accessible search explanations and handoff

**Files:**

- Modify: approved `apps/web` search/result/zero-state/explanation components only as needed
- Create: accessibility and language fixtures/tests
- Modify: task brief/roadmap with exact validation outcomes

- [ ] **Step 1: Show safe match meaning**

Clearly distinguish exact and approved-alias matches from ambiguous/no-result/stale states. Never imply that no result means unavailable everywhere or that an alias is a clinical equivalent.

- [ ] **Step 2: Test accessibility and language**

Verify keyboard/focus, screen-reader status announcements, non-colour match meaning, contrast, narrow/200% layouts, reduced motion and reviewed English/iTaukei/Fiji Hindi labels. Medicine identity remains unchanged where policy requires.

- [ ] **Step 3: Run repository checks**

Run format, lint, typecheck, tests, build, catalog-specific contracts/Worker tests, security/redaction checks and relevant local Wrangler validation only without deployment or credentials.

- [ ] **Step 4: Record scope and commit**

Record synthetic fixture count, baseline cases, decision/export hashes, changed ranking inputs, privacy review, rollback path, unresolved ambiguity and known limitations. Commit only approved Task 23 scope with `feat: add reviewed synthetic catalog curation workflow`. Do not stage real feedback, raw queries, provider credentials, external catalogue data or unrelated changes.
