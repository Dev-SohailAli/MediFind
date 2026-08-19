# Task 34 Bounded Government Information Decision Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Decide whether MediFind should publish carefully bounded, non-clinical government-program information while never making eligibility, entitlement, dispensing, treatment or benefits decisions.

**Architecture:** This is a documentation-first decision packet. If approved, the lower-risk default is a static public-support content boundary with reviewed source metadata, expiry and correction controls, not an authenticated eligibility workflow. No user health, identity, financial, location or eligibility data is collected. MediFind links to the official authority and states that the authority—not MediFind—controls current rules and decisions.

**Tech Stack:** Existing static public-support content model, approved locale keys, content/version manifest, synthetic stale-source fixtures, accessible HTML/text checks and link validation. No government API, account integration, scraped content, eligibility engine, personalized recommendation, analytics, new provider or application route is added.

**Spec:** `docs/claude-tasks/scale-options/task-34-government-information-decision.md`, `docs/product-brief.md`, `docs/requirements.md`, `docs/experience-and-content.md`, `docs/public-support-presence.md`, `docs/data-and-search.md`, accepted Tasks 24 and 26 evidence, named Fiji legal/content reviewers and founder-approved public-information purpose.

## Global Constraints

- Do not add program information until Tasks 24 and 26, named Fiji legal/content reviewers, accountable source owner/update process, accessibility/language review and founder purpose approval are accepted.
- No eligibility screening, entitlement claim, benefit calculation, application submission, government account access, medical advice, treatment/medicine substitution, personalized recommendation or government integration.
- Use synthetic source records and fictional program labels only. No real government correspondence, user identity, health, financial, eligibility or contact data may enter the repository.
- Every statement requires accountable source, verified official link/contact route, source date, review/expiry date, language/accessibility owner, correction path and safe withdrawal behavior.
- Stale, withdrawn, unverifiable or conflicting information is clearly marked or removed. Never hide the official-source boundary or imply current coverage from an old page.
- Do not use scraped content, unverified links, public search ranking, buyer profiling or analytics to determine visibility or recommendations.

## Task 1: Establish information-purpose and source gate

**Files:**

- Create: synthetic government-information decision packet and source matrix
- Modify: `docs/claude-tasks/scale-options/task-34-government-information-decision.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md` to link this plan
- Read: accepted Tasks 24/26, public-support boundary, legal/content review and founder purpose decision

- [ ] **Step 1: Define permissible categories**

Limit candidates to official program name, plain non-clinical description, published contact route, source date, official link and safe disclaimer. Exclude eligibility rules, benefit amounts/calculations, application guidance requiring personal facts and treatment claims unless separately approved.

- [ ] **Step 2: Record source ownership**

For each synthetic entry record official source owner, verified URL/contact, retrieval/review date, expiry, reviewer, language/accessibility owner, correction/withdrawal process and next review. Do not invent authority names or links for a public release.

- [ ] **Step 3: Define stop criteria**

Unclear authority, broken/unverified link, missing legal/content review, stale source, translation gap, accessibility issue, conflicting official sources or pressure to collect user facts blocks publication.

## Task 2: Choose the lowest-risk content boundary

**Files:**

- Create: static-vs-authenticated boundary comparison
- Review: public support presence, web/PWA, content and privacy policies
- Create: no application/API implementation

- [ ] **Step 1: Compare static public content**

Assess a static page/card with source date, official link, scope disclaimer, reviewed translations and correction contact. Keep it separate from medicine search and protected workflows unless a separate decision approves linking.

- [ ] **Step 2: Reject higher-risk workflows by default**

Document why authenticated screening, forms, government account access, personalized eligibility, benefit calculation and application submission are out of scope without a new legal/product/data decision.

- [ ] **Step 3: Define user boundary copy**

State plainly that MediFind provides general non-clinical information only, cannot confirm eligibility or entitlement, does not decide treatment/dispensing and users must contact the official authority for current rules and applications.

## Task 3: Implement source, freshness, translation and withdrawal controls in the packet

**Files:**

- Create: synthetic content/version manifest and stale-source fixtures
- Modify: approved static content model only if the decision authorizes a bounded preparation
- Create: completeness/link/accessibility tests

- [ ] **Step 1: Version reviewed content**

Record content key/version, source reference, effective/review/expiry times, owner, locale review and correction reference. Do not place private reviewer correspondence in source.

- [ ] **Step 2: Handle stale/withdrawn information**

At expiry or source withdrawal, mark content unavailable or remove it while preserving a safe message and official contact route where verified. Never silently renew or show a stale program as current.

- [ ] **Step 3: Keep language and accessibility complete**

Review English, iTaukei and Fiji Hindi system wording; test 200% scaling, keyboard/focus, screen-reader labels, contrast, link purpose and narrow layout. Do not machine-translate safety/legal content.

- [ ] **Step 4: Avoid data collection**

Verify the static boundary has no account, form, cookie, storage, location, health, identity, financial, eligibility or analytics collection. No government API call or external content fetch is required at runtime.

## Task 4: Rehearse safety and provenance scenarios

**Files:**

- Create: synthetic source-change/withdrawal/conflict scenarios
- Create: link, stale-content, locale and redaction tests
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Test source lifecycle**

Cover verified source, approaching review, expired, broken, withdrawn, conflicting and corrected entries. Verify safe display/removal, source date and no false current claim.

- [ ] **Step 2: Test boundary language**

Attempt eligibility, entitlement, treatment, dispensing, benefits calculation and personalized questions. Verify no decision is produced, no user facts are requested and official-authority routing remains clear.

- [ ] **Step 3: Test public separation**

Verify content cannot alter medicine search ranking, pharmacy availability, price, prescription routing, reservation, support case or account state. No user query/health/location data enters the content system.

## Task 5: Produce the decision and handoff

**Files:**

- Review: decision packet, source matrix, content manifest and synthetic evidence
- Modify: task brief/roadmap with exact recommendation and unresolved risks

- [ ] **Step 1: State recommendation**

Choose static public information, authenticated content, or no proceeding. The recommendation must identify source owner, review cadence, legal/content/accessibility owners, correction path, withdrawal behavior and explicit non-goals.

- [ ] **Step 2: Define future implementation boundary**

If approved, create a separate bounded content task with exact approved statements, sources, locales, static package, indexing, review, rollback and no-data-collection checks. Do not add program information or API routes in Task 34 unless separately authorized.

- [ ] **Step 3: Run checks and commit packet**

Run document/link checks, content-key completeness, stale-source and synthetic boundary tests. Commit `docs: evaluate bounded government information support`; do not stage real government content, unverified links, credentials or unrelated changes.
