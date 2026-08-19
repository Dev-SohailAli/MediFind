# Task 24 Multilingual System Content and Pharmacy-Note Governance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make system-controlled safety, status, consent, support and error content reviewable in English, iTaukei and Fiji Hindi, while keeping pharmacy-authored operational notes plain, attributed, language-labelled and untranslated.

**Architecture:** System copy is keyed, versioned, professionally reviewed and rendered from locale resources. Missing/failed translations fall back to safe reviewed content and are observable without exposing user text. Pharmacy notes are separate structured plain-text fields with entered-language metadata, purpose-specific limits, escaping and moderation state; they never enter ranking, generic notifications, analytics or error detail. The Worker enforces note validation and scope; the web app renders safe accessible labels.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, shared error/content contracts, locale dictionaries, completeness/lint checks, versioned review manifest, server-side plain-text validation/sanitization, bounded note fields, moderation/audit records, accessible language picker and synthetic fixtures. No machine translation, external translation SaaS, arbitrary HTML/Markdown, rich text, dynamic links, chat, marketing system, new notification provider or real correspondence is added by this plan.

**Spec:** `docs/claude-tasks/post-pilot/task-24-multilingual-system-content.md`, `docs/dynamic-pharmacy-content-policy.md`, `docs/experience-and-content.md`, `docs/accessibility-policy.md`, `docs/api-error-contract.md`, `docs/design-system-and-screens.md`, accepted Task 22 browser/accessibility evidence, Task 14 support/report evidence and the professional-review decision.

## Global Constraints

- Do not ship changed safety/legal-critical wording until the content categories, named professional reviewers or approved workflow and review evidence are accepted.
- Never machine-translate safety, legal, consent, prescription, emergency/non-clinical, privacy, price, freshness or security wording. Missing review is a release-blocking gap, not permission to guess.
- Medicine identity, brand, strength, dosage form, price and pharmacy legal name remain official/pharmacy-authored. Translate only surrounding labels and reviewed explanations.
- Pharmacy-authored notes are not system copy. They remain plain text, attributed to the pharmacy, labelled with entered language, un-translated and excluded from ranking. They cannot provide medical advice, diagnosis, treatment, urgency assessment, discriminatory content, promotion, credential/OTP/prescription requests or payment instructions.
- No real buyer, pharmacy, medicine, health, prescription, contact, support correspondence or reviewer private data may enter source, fixtures, logs, analytics, notifications, screenshots or reports.
- Locale fallback must be safe and visible to operations without revealing missing strings, private text or internal identifiers to users. Generic errors and notifications never include pharmacy note text or medicine/prescription details.
- Do not add dynamic HTML/Markdown, embedded media, scripts, tracking, shortened URLs, automatic linkification, external translation provider or new recurring cost.

## Task 1: Inventory and classify user-facing content

**Files:**

- Create: locale/content inventory and review matrix
- Modify: `docs/claude-tasks/post-pilot/task-24-multilingual-system-content.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md` to link this plan
- Read: accepted Task 22 evidence, content/design/accessibility policies and reviewer decision

**Interfaces:**

- Input: current UI/API error/notification/status/consent/support strings and pharmacy-note fields.
- Output: key inventory with owner, content class, locale status, review status, version, affected journey and release-blocking classification.

- [ ] **Step 1: Enumerate changed states**

Inventory buyer, pharmacy and admin loading/empty/success/error/denied/offline/stale/maintenance/security-hold, price/freshness/reservation/prescription boundaries, support/legal/privacy/consent, accessibility labels and generic notification templates. Include Worker `messageKey` and field-error keys.

- [ ] **Step 2: Separate system and pharmacy content**

Mark each string as MediFind-controlled, pharmacy-authored, medicine/official identity or legal/professional content. Only system-controlled keys can have reviewed locale variants; pharmacy notes carry entered-language metadata and are never silently translated.

- [ ] **Step 3: Record review ownership**

Assign professional/legal/safety/accessibility reviewer evidence per critical category, content version, review date, approved locales, unresolved gap and next review. Do not put private correspondence or reviewer contact values in source or logs.

## Task 2: Implement versioned translation keys and safe fallback

**Files:**

- Create/modify: approved locale dictionaries and content manifest
- Modify: API error/content contracts and web language selection only within scope
- Create: key completeness, placeholder, forbidden-copy and fallback tests

- [ ] **Step 1: Define stable keys and parameters**

Use typed keys with allow-listed parameters for state, price, time, branch/hours and safe categories. Reject missing/extra parameters and never interpolate raw query, note, prescription, contact or sensitive identifiers into user-facing copy.

- [ ] **Step 2: Complete all three locales**

Provide reviewed English, iTaukei and Fiji Hindi entries for every changed buyer/staff/admin state and notification/error/consent/support message. Record translation version and review evidence; incomplete safety/legal coverage blocks release.

- [ ] **Step 3: Implement safe fallback**

When a locale key is unavailable or fails validation, use the approved reviewed fallback according to the content class, record an aggregate missing-translation signal and preserve the safe meaning. Do not show a raw key, English placeholder, stack trace or pharmacy note.

- [ ] **Step 4: Preserve language selection**

Offer a visible language picker at onboarding/settings, respect supported device language where approved and keep selected language state non-sensitive. Do not require location permission or external translation network calls.

## Task 3: Govern pharmacy-authored notes

**Files:**

- Modify: approved Worker note schemas/commands and web note fields
- Create: sanitization/moderation/branch-scope tests
- Modify: listing/reservation/status rendering only for safe attribution/labels

- [ ] **Step 1: Bound note purposes and limits**

Support only approved purposes such as branch note, pickup-instruction supplement and non-clinical listing clarification. Use conservative purpose-specific character limits and server-side rejection; show remaining-character feedback without relying on client validation.

- [ ] **Step 2: Store entered language and attribution**

Require a supported entered-language tag, branch-scoped author role, purpose, version/state, timestamps and audit reference. Render pharmacy attribution and language label beside the note; screen readers announce both.

- [ ] **Step 3: Sanitize and reject unsafe content**

Accept plain text only, escape rendering and reject HTML/Markdown, scripts, media, links, shortened URLs, contact/payment instructions and credential/OTP/prescription requests. Do not automatically linkify or translate.

- [ ] **Step 4: Add moderation state**

Allow scoped staff/admin moderation to hide/remove unsafe notes with a bounded reason and audit event. Moderation does not rewrite a note to change meaning; the pharmacy submits a corrected note. Do not show hidden content in generic errors, notifications, analytics or ranking.

## Task 4: Integrate safe system content across contracts and UI

**Files:**

- Modify: approved `apps/web` system content components, error handling, status/notification rendering and language picker
- Modify: Worker error/notification contracts to return keys/categories only
- Create: content-redaction and notification tests

- [ ] **Step 1: Keep API errors safe**

Return stable allow-listed code/messageKey/requestId/retryability/category. The API never returns unreviewed exception text, raw note text, medicine/prescription detail, provider IDs or contact values.

- [ ] **Step 2: Keep notifications generic**

Notification previews and email/in-app templates contain only approved generic status and next-action wording. They never include pharmacy note text, medicine names, price, patient/prescription or reservation detail outside the authorized in-app view.

- [ ] **Step 3: Preserve safety meaning**

Verify reviewed wording for pharmacy-managed availability/price, no guarantee, prescription-required/final pharmacy decision, no medical advice/emergency support, stale status, security/maintenance and privacy boundaries. Do not soften or expand meaning during translation.

- [ ] **Step 4: Test content version behavior**

Record content version/effective date and ensure a changed safety/legal version requires the approved review/acceptance path. Do not silently replace accepted copy in a deployment.

## Task 5: Verify accessibility, expansion and privacy

**Files:**

- Create: locale/accessibility acceptance evidence
- Modify: approved UI only for bounded defects
- Modify: task brief/roadmap with exact validation outcomes

- [ ] **Step 1: Test expansion and responsive layouts**

Run changed journeys in all three locales at narrow mobile, desktop and 200% scaling. Verify wrapping, labels, buttons, error fields, status content, dates/times, FJD amounts and focus actions do not clip, overlap or hide the safe next step.

- [ ] **Step 2: Test assistive technology**

Verify keyboard order/focus, semantic labels, screen-reader announcement of locale, note attribution/language, errors, loading, stale, status and safety boundaries. Never use color alone for language, state or risk.

- [ ] **Step 3: Test redaction and fallback**

Attempt missing keys, malformed parameters, unsafe note content, long note, link/contact, cross-branch note access and notification/error rendering. Verify no raw note, query, health/prescription data, contact or internal key enters logs, metrics, generic errors or notifications.

- [ ] **Step 4: Run quality checks**

Run format, lint, typecheck, tests, build, locale/sanitization/accessibility/notification-redaction checks and relevant local Wrangler validation only without deployment or credentials. Record unresolved translation gaps as blockers.

- [ ] **Step 5: Commit only approved scope**

Record the translation review matrix, locale completeness, sanitizer/moderation results, accessibility evidence, fallback behavior, privacy review and rollback path. Commit only approved Task 24 scope with `feat: govern reviewed multilingual system content`; do not stage real correspondence, machine-translated safety copy, credentials or unrelated changes.
