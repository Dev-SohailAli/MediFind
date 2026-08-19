# Task 15 Static Public Support Presence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare a separately hosted static public home, privacy/terms, support, status and security-reporting presence for MediFind after operator, domain, contact, legal, translation and publisher approvals. The site must inform people without becoming an account, API, form, cookie, analytics, storage or application-proxy surface.

**Architecture:** The public support/legal site is a separate static Pages asset set from the synthetic buyer PWA and any future authenticated app. It contains pre-reviewed static HTML/CSS/assets, a static `security.txt`, secure headers and versioned content metadata. It has no Pages Functions, Worker proxy, server-side form, client storage, cookies, analytics, identity, database, upload or protected workflow. The current synthetic preview remains noindex and is not converted into the public legal site without a separate approved publishing decision.

**Tech Stack:** Approved static Pages package/project, pinned build tooling, accessible HTML/CSS, static route/assets, `_headers`, `robots.txt`/page indexing policy and deterministic artifact verification. No external content system, support SaaS, form processor, analytics, cookie banner, runtime font request or provider is added without a written decision.

**Spec:** `docs/claude-tasks/future/task-15-public-support-presence.md`, `docs/public-support-presence.md`, `docs/public-notice-and-legal-identity.md`, `docs/repository-security-and-delivery.md`, `docs/infrastructure-and-release-blueprint.md`, `docs/security-privacy-compliance.md`, `docs/accessibility-policy.md`, `docs/design-system-and-screens.md`, `docs/claude-tasks/future/task-13-prescription-quarantine-scanning.md`, `docs/claude-tasks/future/task-14-support-reports-admin-audit.md` and accepted Task 7–14 evidence/decisions.

## Global Constraints

- Do not implement or publish until the Task 15 gate records approved operator/legal identity, domain/DNS ownership, HTTPS, official support contact, support hours, legal notices, security-reporting contact, translations and restricted publisher ownership.
- Do not invent legal copy, operator identity, address, email, support hours, emergency wording, security contact, translation or placeholder values. A missing or conflicting fact is `FAIL — UNVERIFIED`.
- Keep this static-only and synthetic-safe. Never include real buyer, pharmacy, health, prescription, reservation, account, support-case or incident data.
- The public site has no account, authentication, API route, Worker proxy, Pages Function, form, cookie, analytics, client storage, upload, database, notification subscription or application workflow. It makes no application/API calls.
- Do not revive Firebase/GCP/native/store direction or add a support provider, email sender, DNS service, analytics system, cost or credential outside the approved task.
- Public pages must not expose stack versions, build internals, account/project IDs, routes/bindings, incident forensics, customer data, staff identities, prescription detail or security-sensitive operational clues.
- Support guidance must state that MediFind is not emergency or clinical support, never requests passwords/OTPs/authenticator codes/prescription files through unsolicited channels, offers no official WhatsApp MVP channel, and directs medicine/dispensing/reservation questions to the selected pharmacy’s verified contact path. No WhatsApp support is part of this task.
- No real buyer, pharmacy, health, prescription, reservation, account, support-case or incident data may enter the site or its artifacts.
- Preserve accessible keyboard, screen-reader, responsive/narrow viewport, 200% scaling, contrast, focus, language and non-colour status behavior.

## Task 1: Establish the static publishing gate and content ownership

**Files:**

- Create: `docs/evidence/2026-08-18-task-15-public-presence-gate.md`
- Modify: `docs/claude-tasks/future/task-15-public-support-presence.md` only to link the gate record/plan
- Modify: `docs/README.md` and the protected-pilot roadmap to link this plan
- Read: exact founder/legal/pharmacy/translation/domain/DNS/publisher evidence

**Interfaces:**

- Input: approved identity/contact/legal/translation/domain/publisher evidence and static package/project decision.
- Output: a versioned content/publishing matrix, per-page approval status, indexing policy, owner/review dates, release evidence and rollback path.

- [ ] **Step 1: Record stable gate rows**

Use explicit rows for operator/legal identity, domain/DNS/HTTPS, official support contact and sender authentication, support hours/escalation, privacy/terms, prescription notice if published, security contact/`security.txt`, English/iTaukei/Fiji Hindi review, accessibility review, restricted publisher access, static-capability verification, status owner/update process and rollback.

- [ ] **Step 2: Record current fail-closed state**

Until the evidence exists, mark external publication `NOT APPROVED`, keep current synthetic preview noindex, and list the exact owner/input needed for each failed row. Do not use the repository’s synthetic/local labels as public legal copy.

- [ ] **Step 3: Freeze package/project ownership**

Record whether the approved static package is a separate Pages project or an approved public-site directory, its build output, domain, environment separation, publisher roles, PR/review path, secret-free build and rollback owner. Do not silently place public legal pages in `apps/web` if that would couple them to the synthetic app or protected proxy.

## Task 2: Prepare approved multilingual content and metadata

**Files:**

- Create: static content under the approved public-site package only after gate approval
- Create: versioned content manifest/approval metadata without private reviewer documents
- Review: `docs/public-notice-and-legal-identity.md`, `docs/public-support-presence.md` and approved legal/pharmacy/translation content

- [ ] **Step 1: Build the required page map**

Define static Home/what MediFind is, Privacy, Terms, Support, Status, Accessibility/language navigation and `/.well-known/security.txt` paths. Use canonical links/language alternates only after domain and indexing policy are approved.

- [ ] **Step 2: Insert only approved content**

Publish the approved MediFind operator/contact, service boundary, privacy purposes/recipients/transfers/retention/user rights, terms, support hours, non-emergency guidance, anti-phishing guidance, security-reporting process and status process. Do not invent liability, legal basis, retention, clinical, pharmacy or emergency wording.

- [ ] **Step 3: Keep prescription content conditional**

Do not publish a prescription-upload notice that implies the feature is active while Task 13 is unapproved. If legal review requires a future notice, version it as an explicit disabled/conditional statement and ensure it contains no retention promise beyond the accepted evidence.

- [ ] **Step 4: Add professionally reviewed language variants**

Keep English, iTaukei and Fiji Hindi content complete and semantically aligned, with professional review evidence/version/date for each page. Do not use machine translation for safety/legal content or hide a missing translation behind a guessed fallback.

- [ ] **Step 5: Add versioned content metadata**

Record content version, approval/review date, owner, effective date and next review date in a static-safe manifest. Do not include private reviewer names/contact details, internal ticket IDs or incident/security evidence.

## Task 3: Build the static artifact and capability guard

**Files:**

- Create/modify: approved public-site package build/config and static assets
- Create: static verification script/tests under the approved package
- Create/modify: `_headers`, `robots.txt` and `/.well-known/security.txt` only according to the approved indexing/security policy
- Review: Task 6 Pages-preview guard without merging public-site behavior into the synthetic preview unintentionally

- [ ] **Step 1: Build deterministic static routes**

Generate only approved files and assets. Every required route must resolve to static output; unknown/function/API paths must not proxy to the Worker or authenticated app. `security.txt` must be static at the approved well-known path with approved contact, expiry and policy fields.

- [ ] **Step 2: Apply secure headers and indexing policy**

Use HTTPS/security headers, content type, frame/referrer/permissions policy and cache directives approved for public legal/status content. Apply `noindex` only where the gate requires it; keep synthetic preview `noindex` separate from any approved public-site indexing choice. Do not expose deployment identifiers in headers.

- [ ] **Step 3: Prove forbidden capabilities are absent**

Guard the output and source against Pages Functions, Worker/API proxy, forms/post endpoints, cookies, analytics/session replay, local/session/IndexedDB storage, service-worker protected data, account/auth routes, upload, R2/D1/KV references, notification permissions and external unapproved processors. A static `mailto`/telephone link is allowed only when its contact value is approved.

- [ ] **Step 4: Prove safe status content**

Status pages show current state, last review/update and next update time from approved static content. They must not reveal stack versions, internal IDs, provider incident forensics, customer/support records, security investigation detail or sensitive outage topology.

- [ ] **Step 5: Verify build/package separation**

Confirm the public artifact cannot reach `apps/web` authenticated routes or synthetic Worker APIs, and the synthetic preview cannot accidentally publish legal placeholders. Record exact artifact path and hash for release review.

## Task 4: Verify domain, sender and restricted publisher controls

**Files:**

- Evidence only: `docs/evidence/2026-08-18-task-15-public-presence-gate.md`
- Review: approved DNS/HTTPS/sender/publisher records and repository/Pages project settings

- [ ] **Step 1: Verify domain/DNS/HTTPS ownership**

Record founder-controlled domain/DNS ownership, certificate/HTTPS behavior, redirect/canonical host policy and separation from synthetic preview/protected app. Do not claim hosted evidence until the domain was actually inspected.

- [ ] **Step 2: Verify official support sender**

Record the approved sender domain/authentication evidence and ensure the public site does not send mail or collect support form data. Email is an approved contact link only and never an OTP/password/prescription channel.

- [ ] **Step 3: Verify publisher access**

Confirm restricted founder-controlled publisher roles, MFA/recovery, PR review, least privilege, no committed deploy tokens and auditable rollback. Contributors must not gain broad Cloudflare account access.

## Task 5: Run browser/accessibility and content acceptance

**Files:**

- Evidence: `docs/evidence/2026-08-18-task-15-public-presence-acceptance.md`
- Review: generated static artifact and approved domain, if actually hosted

- [ ] **Step 1: Run static response checks**

Verify each route returns static content, approved status/content type/headers, no function/API/network dependency and no sensitive detail. Check `security.txt`, language routes, 404 behavior, redirects and indexing policy.

- [ ] **Step 2: Run accessibility checks**

Test keyboard-only navigation, focus order/visible focus, semantic headings/landmarks, labels/links, screen-reader announcements, contrast, reduced motion, narrow/mobile layouts and 200% scaling in each required language where text expansion matters.

- [ ] **Step 3: Run support/status safety checks**

Confirm hours, official contact, emergency/non-clinical boundary, anti-phishing guidance, no-WhatsApp statement, status next-update behavior and security-reporting path are accurate and contain no placeholders or internal details.

- [ ] **Step 4: Record actual hosted evidence**

If a founder-authorized hosted inspection occurs, record URL, commit/artifact hash, date, browser/viewport, response evidence and reviewer. Otherwise mark hosted/domain evidence not run; local static checks cannot prove a hosted result.

## Task 6: Release, rollback and handoff

**Files:**

- Review: static package, content manifest, verification script/tests, headers, robots/security file and evidence records
- Modify: public-presence gate/roadmap only with actual outcomes

- [ ] **Step 1: Run repository checks**

Run the public package’s format/type/test/build/security checks plus the relevant root checks. Run the static capability guard and compare the artifact to the approved file/route manifest. Do not run deployment commands without the separate approved publishing action.

- [ ] **Step 2: Review privacy/security/cost scope**

Confirm no account, API, cookie, storage, analytics, form, upload, notification, processor, secret or recurring cost was added beyond approval. Preserve safe synthetic preview and public-site separation.

- [ ] **Step 3: Verify rollback**

Record the previous immutable static artifact, rollback owner/procedure, content-version reversal and DNS/HTTPS rollback considerations. Never roll back by deleting data or changing legal history.

- [ ] **Step 4: Commit only approved static scope**

After the package/project gate records the exact static paths, stage only those approved paths plus `docs/evidence/2026-08-18-task-15-public-presence-gate.md` and `docs/evidence/2026-08-18-task-15-public-presence-acceptance.md`, then commit `feat: add static public support presence`. Do not stage credentials, `.env` files, real support correspondence, private legal documents or unrelated user changes.
