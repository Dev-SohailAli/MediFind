# Task 41 Accessibility and Localization Maintenance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make accessibility and English/iTaukei/Fiji Hindi review a recurring release discipline rather than a one-time pilot checklist, without claiming WCAG certification or unreviewed translation quality.

**Architecture:** Each release candidate produces a matrix covering changed buyer, pharmacy, admin and public-support journeys across representative devices, browsers, languages and states. Automated checks complement manual VoiceOver/TalkBack/keyboard-screen-reader review. System copy is keyed/versioned/reviewed; pharmacy-authored notes remain attributed, language-labelled, plain-text and untranslated. Essential-journey blockers stop release.

**Tech Stack:** Existing `apps/web`, static public-support package, locale dictionaries, accessibility/test tooling, synthetic fixtures, browser/device matrix, redacted screenshots/logs and review evidence. No certification service, machine translation, automatic dark-mode redesign, custom accessibility claim, profiling, new design-system rule, external provider or real data is added.

**Spec:** `docs/claude-tasks/stewardship/task-41-accessibility-localization-maintenance.md`, `docs/accessibility-policy.md`, `docs/experience-and-content.md`, `docs/dynamic-pharmacy-content-policy.md`, `docs/design-review-acceptance-checklist.md`, `docs/performance-and-reliability-targets.md`, accepted Tasks 24, 30 and 36 evidence and the supported release-surface decision.

## Global Constraints

- Do not start until named language/accessibility reviewers, representative devices/networks, supported release surface and Tasks 24/30/36 evidence are accepted.
- Use synthetic fixtures and redacted evidence only. No real buyer, pharmacy, medicine, health, prescription, contact, support or device-personal data enters screenshots, logs, reports or telemetry.
- WCAG 2.2 AA is a product target, not formal certification. Do not claim compliance from automated checks alone.
- Missing reviewed safety/legal translation, essential-journey accessibility blocker, unsafe focus/state behavior or a privacy/authorization regression blocks release; exceptions require impact, workaround, approver and remediation date.
- Never machine-translate safety/legal/clinical boundary content. Medicine identity remains official/pharmacy-authored; pharmacy notes remain entered-language, attributed and untranslated.
- Do not add a new permission, telemetry, library, processor, cost, content provider or design-system rule without a separate decision.

## Task 1: Establish the recurring review matrix

**Files:**

- Create: per-release accessibility/localization matrix and defect register
- Modify: `docs/claude-tasks/stewardship/task-41-accessibility-localization-maintenance.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md` to link this plan
- Read: Tasks 24/30/36 evidence, supported surfaces and reviewer availability

- [ ] **Step 1: Define matrix fields**

Record commit/artifact, environment, device/OS/browser, assistive technology, language, journey/state, test method, result, issue/severity, owner, reviewer, evidence reference and next review.

- [ ] **Step 2: Define recurring cadence and triggers**

Run before each release and after changes to routes, content, design tokens, locale keys, browser support, permissions, authentication, protected states or public-support pages. Define periodic trend review and owner escalation.

- [ ] **Step 3: Define severity and exceptions**

Classify essential-journey blockers, high-impact defects and normal defects. Require impact/workaround/approver/remediation/retest for any exception; no exception may weaken privacy, authorization, safety or critical action access.

## Task 2: Maintain locale and content evidence

**Files:**

- Create: locale key/version/reviewer manifest and completeness checks
- Review: Task 24 system content and dynamic-note boundary
- Modify: no copy unless exact approved review exists

- [ ] **Step 1: Check key completeness and fallback**

Verify changed system keys exist and are reviewed in English, iTaukei and Fiji Hindi, parameters match, safe fallback works and missing strings are observable without exposing raw keys or user text.

- [ ] **Step 2: Check semantic safety**

Review freshness, price, no-guarantee, prescription-required/final pharmacy decision, emergency/non-clinical, security, privacy, maintenance and consent meaning. Do not translate medicine identity or pharmacy legal name.

- [ ] **Step 3: Check pharmacy notes**

Verify entered-language label, pharmacy attribution, plain-text escaping, length/link/contact/prohibited-content moderation and screen-reader announcement. Notes are never silently translated or promoted in ranking.

- [ ] **Step 4: Record content review**

Capture content version, reviewer/approval reference, date, affected routes and unresolved gaps. Missing professional review blocks affected release surface.

## Task 3: Run manual and automated accessibility review

**Files:**

- Create: synthetic browser/device/accessibility evidence
- Modify: bounded UI defects only if separately approved within the release scope
- Review: public-support and changed application journeys

- [ ] **Step 1: Test representative platforms**

Run iPhone Safari VoiceOver, Android browser TalkBack and desktop keyboard/screen-reader combinations plus narrow/wide viewports. Record exact device/browser and synthetic fixture state.

- [ ] **Step 2: Test interaction and visual requirements**

Verify semantic names/roles, focus/navigation/modal/error/status announcements, keyboard/touch targets, contrast, non-colour states, 200% scaling, reduced motion, no gesture-only actions and no clipped/overlapping critical content.

- [ ] **Step 3: Test state coverage**

Include loading, empty, zero-result, stale, error, unauthorized, offline, permission-denied, security-alert, confirmation, maintenance and success states for each changed journey.

- [ ] **Step 4: Test safe fallback**

Verify denied permissions have manual alternatives, sensitive mutations never queue offline, stale/private state is not exposed and screen-reader users receive the same safety/status meaning.

## Task 4: Rehearse release decision and remediation

**Files:**

- Create: synthetic defect/retest scenarios and trend report
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Exercise blockers**

Introduce synthetic missing key, clipped critical action, contrast/focus failure, screen-reader omission, unsafe fallback and pharmacy-note disclosure. Verify release block, owner assignment, remediation and retest.

- [ ] **Step 2: Exercise exception path**

Use a non-essential synthetic defect to verify documented impact/workaround/approver/date and ensure the exception cannot be applied to privacy, authorization, safety or essential journeys.

- [ ] **Step 3: Track trends**

Compare aggregate defect categories and translation/accessibility regressions across releases without profiling users or storing device identifiers beyond approved evidence.

- [ ] **Step 4: Run checks and commit**

Run repository quality, locale completeness, sanitization, accessibility/browser checks and relevant local validation. Commit `chore: establish recurring accessibility and localization review`; do not claim certification or stage protected screenshots.
