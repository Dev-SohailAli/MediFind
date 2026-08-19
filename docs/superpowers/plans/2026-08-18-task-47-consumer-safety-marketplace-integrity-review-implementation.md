# Task 47 Consumer Safety and Marketplace-Integrity Review Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a recurring review of buyer-facing claims, pharmacy-authored content and search/transaction states without adding clinical advice, ranking manipulation, data collection or a moderation provider.

**Architecture:** A versioned review matrix covers search, detail, reservation, prescription, support and public-status surfaces in three languages and relevant stale/error/offline/security states. Findings are classified, redacted, assigned and retested; critical safety, authorization, privacy or misleading-content defects block the affected surface.

**Tech Stack:** Existing `apps/web`, Worker contracts, translation keys, dynamic-note validation, synthetic fixtures, redacted feedback categories and local accessibility/content checks. No external catalog, machine translation, analytics/session replay, public review system, provider or real health/prescription data is added.

**Spec:** `docs/claude-tasks/stewardship/task-47-consumer-safety-marketplace-integrity-review.md`, `docs/requirements.md`, `docs/experience-and-content.md`, `docs/dynamic-pharmacy-content-policy.md`, `docs/data-and-search.md`, `docs/incident-response-runbook.md`, accepted Tasks 23, 24, 30, 36, 39, 41 and 45 evidence.

## Global Constraints

- Use only synthetic or redacted feedback and fixtures. Do not place raw prescriptions, health details, reporter identity, contact values or sensitive support text in findings, analytics or public content.
- MediFind does not provide medical advice, diagnose, recommend treatment or silently substitute a medicine. Pharmacy professionals retain dispensing decisions.
- Preserve exact identity distinctions, verified-pharmacy and branch boundaries, freshness labels, exact-pack pricing, prescription routing, anti-enumeration, accessibility and language review.
- Do not machine-translate safety/legal/clinical boundary copy, rewrite pharmacy notes to change meaning, or infer a legal/pharmacy conclusion from a content review.
- A critical unsafe, misleading, privacy-disclosing, unauthorized or missing safety translation blocks the affected surface and requires owner, correction and retest.

## Task 1: Build the content and claim review matrix

**Files:**

- Create: surface/claim/version/language/reviewer matrix
- Read: current requirements, content policies, translation evidence, task 23 curation evidence and task 45 readiness packet
- Modify: task brief, stewardship README and roadmap links

- [ ] **Step 1: Enumerate reviewed surfaces**

List search/no-result, listing detail, freshness/price, pharmacy verification, reservation, prescription upload/review/status, support/status/disclosure and error/offline/security states.

- [ ] **Step 2: Record claim controls**

For each surface record exact source key/version, language, reviewer, safety/legal boundary, data source, fallback, accessibility evidence, change date and release status. Check claims about availability, price, freshness, guarantees, dispensing, substitutes and urgency.

- [ ] **Step 3: Define severity and stops**

Block critical clinical/legal implication, false availability/price, unsafe routing, unauthorized disclosure, inaccessible essential state or missing safety/legal translation. Route non-critical clarity issues to an owner and retest date.

## Task 2: Review pharmacy-authored and catalog content

**Files:**

- Create: synthetic note/content fixture set and moderation findings register
- Modify: curation/content evidence only after named reviewer acceptance

- [ ] **Step 1: Exercise dynamic-note controls**

Test attribution, entered-language label, plain-text sanitization, length, links/contact rejection, prohibited medical/credential/prescription content, branch scope and generic-notification/log exclusion.

- [ ] **Step 2: Exercise identity and ranking boundaries**

Test exact product versus approved active-ingredient labeling, incompatible strength/form/pack, stale/unavailable listing, ambiguous identity, price change and no-result language. Confirm no clinical substitute, paid placement or pharmacy-authored ranking manipulation appears.

- [ ] **Step 3: Test moderation behavior**

Verify unsafe notes can be hidden with a reason and redacted audit event, while moderation does not silently rewrite pharmacy meaning or publish a private report as an accusation.

## Task 3: Review language, accessibility and operational states

**Files:**

- Create: multilingual state checklist and synthetic review results
- Modify: release/content decision record with exact outcome

- [ ] **Step 1: Check all supported languages**

Verify key completeness, reviewed English/iTaukei/Fiji Hindi safety/status/error copy, safe fallback and unchanged medicine/pharmacy identity fields. Missing reviewed safety/legal copy blocks release.

- [ ] **Step 2: Check interaction and disclosure**

Verify keyboard/screen-reader labels, focus/order, 200% text scaling, contrast, reduced motion, stale/offline/error states, authorization boundaries and no sensitive content in generic notifications or analytics.

- [ ] **Step 3: Rehearse buyer interpretation**

Use synthetic journeys to confirm a buyer cannot reasonably infer a stock guarantee, dispensing approval, clinical recommendation, pharmacy endorsement beyond verification or public accusation from the presented content.

## Task 4: Remediate, retest and hand off

**Files:**

- Create: redacted findings, remediation and retest register
- Modify: task brief, roadmap and decision log with exact outcome

- [ ] **Step 1: Assign and resolve findings**

Record surface, severity, owner, source/version, impact, workaround, correction, reviewer, retest evidence and release decision. Preserve unresolved critical findings as hard stops.

- [ ] **Step 2: Run checks**

Run formatting, link/structure, locale/content-key, sanitization and accessibility checks plus approved synthetic journeys. Do not claim professional, legal, hosted or production validation unless independently evidenced.

- [ ] **Step 3: Commit the review**

Commit `chore: review consumer safety and marketplace integrity`; schedule the next review after material content, catalog, workflow, provider or legal change.
