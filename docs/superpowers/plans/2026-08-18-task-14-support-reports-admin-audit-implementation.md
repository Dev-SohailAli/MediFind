# Task 14 Support Reports and Admin Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide safe buyer listing-quality reports, pharmacy operational support cases and least-privilege MediFind moderation/audit views with generic confirmations, redacted audit evidence and tightly controlled break-glass access.

**Architecture:** The authenticated Worker owns report/case validation, role and branch scope, moderation commands, audit visibility, break-glass authorization, retention/deletion and safe error mapping. D1 records are server-only and structured; the browser receives only the minimum authorized view. Buyer reports are private and never public accusations. Routine support/admin paths contain no prescription attachments or prescription content; any future prescription break-glass remains separately gated and restricted.

**Tech Stack:** TypeScript React/Vite web app, Cloudflare Worker/D1 through approved server-only bindings, Task 8 actor/MFA/recovery context, Task 9 branch roles, Task 10 listing projection, Task 11/12 status surfaces, Vitest, synthetic fixtures and accessible Testing Library states. No chat provider, analytics system, public ratings, support SaaS or arbitrary free-text inbox.

**Spec:** `docs/claude-tasks/future/task-14-support-reports-admin-audit.md`, `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`, `docs/audit-log-policy.md`, `docs/account-recovery-runbook.md`, `docs/incident-response-runbook.md`, `docs/api-error-contract.md`, `docs/api-and-data-contracts.md`, `docs/data-dictionary-and-ownership.md`, `docs/public-support-presence.md`, `docs/accessibility-policy.md`, `docs/cost-circuit-breaker-policy.md` and accepted Task 7–12 evidence/decisions.

## Global Constraints

- Do not dispatch until Task 7 support/retention/access gates pass, Task 8 identity/session/recovery and break-glass rules are accepted, and the audit visibility matrix, exact structured fields, routes, owners and deletion schedule are approved.
- Keep this task synthetic-only in local tests and fixtures. Never use real buyer, pharmacy, contact, health, prescription, support or incident data.
- Do not create general chat, arbitrary free-text support inboxes, public accusations/ratings, prescription attachments, routine prescription-content access, analytics/session replay, third-party support SaaS or an unbounded audit export.
- The browser never receives D1/R2/KV credentials or direct bindings. All scope comes from the authenticated actor, branch assignment, target relationship and server-side authorization.
- Keep the active web-only Cloudflare architecture; do not revive Firebase/GCP/native direction or add a provider/cost/route/field not explicitly approved.
- Every report/case/moderation/break-glass command uses minimum structured inputs, safe generic errors, rate limits, idempotency/current-version rules where repeatable, redacted audit events and approved retention/deletion behavior.
- Offline mode never queues or submits a report, support case, moderation action, audit request or break-glass action. Public search may remain safe; protected views require a fresh authorized read after reconnect.
- Prohibited values—raw free text, names, phone/email, health/prescription content, tokens, internal IDs and provider errors—stay out of logs, notifications, URLs, analytics, audit fields and user-visible generic errors.

## Task 1: Recheck gates and freeze the visibility/field matrix

**Files:**

- Read: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Read: accepted Task 8 identity/recovery evidence and exact Task 9 role assignments
- Read: approved audit visibility, support ownership, retention/deletion, break-glass notice and exact route/field matrix
- Modify only if the gate record or task brief needs a documentation correction before implementation

**Interfaces:**

- Input: authenticated buyer, scoped pharmacy actor or MediFind admin; listing/reservation/audit references; approved categories and safe templates.
- Output: a command/read matrix naming actor scope, minimum fields, state transition, target visibility, retention, audit event, notification and rollback for each operation.

- [ ] **Step 1: Confirm dependency status**

Record the Task 7 packet version, Task 8 commit/evidence, role/MFA/fresh-auth rules and approved audit matrix. If support owner, retention, legal notice, break-glass expiry or deletion behavior is missing, stop before schema work.

- [ ] **Step 2: Freeze report categories**

Use only approved structured buyer report categories such as inaccurate, expired, misleading or unavailable listing. Do not accept an accusation, diagnosis, medical advice, raw message, contact value or arbitrary free-text narrative. Define whether any bounded safe evidence field is allowed and its exact limit.

- [ ] **Step 3: Freeze support-case categories**

Define the minimum pharmacy operational/support categories, status, assignment, escalation and closure fields. Support cases must not invite prescription attachments, credential/OTP requests or a general conversation channel.

- [ ] **Step 4: Freeze audit and break-glass scope**

Specify which buyer, pharmacy owner/staff, verifier/admin and support actors may read which structured audit events. Define fresh MFA, reason category, target scope, approval/separation of duties, maximum access window, automatic expiry, notification rule and evidence retention for any exceptional access. Routine admin access to prescription content remains prohibited.

## Task 2: Add contract-first reports, cases and audit view types

**Files:**

- Modify: `packages/contracts/src/index.ts`
- Create: focused report/support/audit contract tests under `packages/contracts/src/__tests__/`
- Review: existing boundary/error/audit contracts

- [ ] **Step 1: Write failing contract tests**

Test minimum buyer report, pharmacy case, admin moderation, scoped audit read and break-glass request/approval/read shapes. Assert that raw free text, attachments, prescription content, contact fields, tokens, provider details, broad query filters and arbitrary state patches are rejected or absent.

- [ ] **Step 2: Define structured states and commands**

Use approved discriminated states for report/case open, triaged, actioned, closed, duplicate, unavailable or safely rejected, plus moderation eligibility/suspension states and break-glass requested/approved/expired/revoked/closed states. Exact names must come from the approved matrix, not an invented workflow.

- [ ] **Step 3: Define safe read projections**

Buyer reads only their own report acknowledgement/status; pharmacy reads only branch-relevant operational cases/listing actions; admin reads only approved moderation/audit fields. Never return another reporter's identity, public accusation, prescription bytes/content, unrestricted actor history or raw audit payload.

- [ ] **Step 4: Pin translated safe templates**

Use reviewed English/iTaukei/Fiji Hindi message keys for confirmation, unavailable, rate-limited, forbidden, duplicate, conflict and escalation states. Contract tests reject unreviewed human exception text and internal identifiers.

## Task 3: Add the approved additive D1 records and repositories

**Files:**

- Create: the exact approved additive schema for structured listing reports, pharmacy support cases, moderation outcomes, scoped audit views and break-glass evidence if authorized
- Create/modify: repository/read-model modules under `apps/worker/src/data/`
- Modify: `apps/worker/src/types/env.ts` only for approved server-only bindings
- Test: migration/repository/retention/scope tests under `apps/worker/src/data/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Validate privacy/retention before SQL**

Classify every field, owner, purpose, access role, retention/deletion, export/restore and audit reference. Store opaque IDs and bounded categories, not raw names, phone/email, free text, prescription content, file URLs or unnecessary reporter identity. If the retention schedule remains unset, stop.

- [ ] **Step 2: Enforce scope and uniqueness**

Require opaque immutable IDs, branch/pharmacy relationship, target listing reference, actor scope, state/version/timestamps, duplicate-report fingerprint and approved support assignment. A pharmacy branch cannot read another branch's case/report/audit data; an admin query cannot become a global dump by changing a filter.

- [ ] **Step 3: Preserve append-only audit integrity**

Use the server-only redacted audit sink for report/case creation, denial, duplicate, moderation, support action, audit access, break-glass request/approval/expiry/revocation and deletion outcomes. Store only safe before/after state references, reason/category and opaque target/correlation IDs.

- [ ] **Step 4: Test deletion/export/restore**

Use synthetic records to prove approved retention/deletion, deterministic export/restore, no prohibited fields in logs/audit/export and no routine prescription content access. Break-glass records remain separately protected and auditable.

## Task 4: Implement buyer reports and pharmacy support cases

**Files:**

- Create/modify: approved route handlers under `apps/worker/src/routes/`
- Modify: route definitions, validation, authorization, idempotency/rate-limit/audit/error seams as required
- Test: focused route/integration tests under `apps/worker/src/routes/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Implement private buyer listing report**

Accept only a structured category and approved listing/report reference from an authenticated buyer. Confirm generically, deduplicate safely, rate-limit, prevent cross-actor/branch disclosure and keep the report private. Do not expose whether another report exists or show a public accusation.

- [ ] **Step 2: Implement pharmacy operational case**

Accept only approved structured category/target/status inputs from an authorized branch actor. Do not accept prescription attachments, credentials, OTPs, arbitrary free text or requests to alter clinical decisions. Route escalation to the approved support owner using safe status, not a chat channel.

- [ ] **Step 3: Implement safe status and closure**

Allow only approved role-scoped transitions, current version/idempotency and structured reason categories. Return generic confirmation/case reference; never expose internal queue, reporter or admin information. Audit success, denial, conflict, duplicate and closure.

## Task 5: Implement admin moderation and scoped audit/break-glass views

**Files:**

- Create/modify: approved moderation/audit route handlers under `apps/worker/src/routes/`
- Modify: `apps/worker/src/security/authorize.ts`, audit/read-model seams and approved route definitions
- Test: authorization, scope, break-glass and redaction tests under `apps/worker/src/__tests__/` and route tests

- [ ] **Step 1: Implement listing moderation boundaries**

Allow only the approved MediFind verifier/admin role to suspend or correct public listing eligibility. Moderation cannot change pharmacy-owned price, availability, exact identity content or clinical decisions; source ownership and Task 10 version rules remain intact.

- [ ] **Step 2: Implement scoped audit reads**

Require explicit server-side scope and minimum filters for buyer, branch owner/staff, support and admin views. Return only safe event metadata and approved reason/category; never expose raw audit payload, another actor's history, prescription content or an unrestricted export endpoint.

- [ ] **Step 3: Implement break-glass request and access**

Require a structured reason, target/scope, fresh MFA, approval/separation of duties, maximum time window and automatic expiry. Every request, approval, denial, access, extension and revocation is audited. Notify the approved buyer/pharmacy audience where the gate requires it. Break-glass does not grant routine role access or bypass branch/selected-pharmacy rules.

- [ ] **Step 4: Keep prescription content out of routine paths**

Do not create a prescription download, preview, attachment, search or content field. If a future Task 13 gate permits exceptional content access, it must arrive as a separate approved task with its own R2, reviewer-MFA, retention and security evidence.

- [ ] **Step 5: Apply rate limits and safe failure**

Rate-limit reports, support cases, moderation, audit queries and break-glass attempts by approved actor/action/window. Provider/database/quota failures map to generic unavailable states, preserve safe search and never reveal queue or record existence.

## Task 6: Add accessible protected web states

**Files:**

- Create/modify: approved `apps/web/src/` report/support/audit components and hooks
- Modify: approved Requests/Reports/Account navigation, strings and styles only for scoped flows
- Test: focused web component/hook tests and relevant `apps/web/__tests__` files

- [ ] **Step 1: Implement buyer report states**

Provide structured category selection, review-before-submit, generic confirmation, duplicate, rate-limited, unavailable, signed-out and offline states. Do not expose public accusations, another reporter or free-text content.

- [ ] **Step 2: Implement pharmacy/admin states**

Show only branch-scoped support cases, moderation targets and permitted audit fields. Render break-glass status/expiry/revocation without displaying protected content or internal investigation detail.

- [ ] **Step 3: Preserve offline and accessibility safety**

Offline mode disables report/case/moderation/audit/break-glass mutations and does not queue them. Test labels, error association, focus return, live announcements, non-colour status, keyboard, 200% zoom and narrow layouts using synthetic content.

## Task 7: Verify scope, redaction and operational safety

**Files:**

- Review: contracts, migration, repositories, routes, authorization, audit/read models, UI and synthetic fixtures
- Evidence: a synthetic Task 14 report linked from the brief, containing no protected data or credentials

- [ ] **Step 1: Run required authorization/retention tests**

Cover duplicate reports, rate limits, buyer/report privacy, cross-pharmacy access, branch role isolation, admin role limits, moderation ownership boundaries, break-glass expiry/revocation/notice, retention/deletion, safe confirmation and offline behavior.

- [ ] **Step 2: Run redaction tests**

Assert no raw free text, health/prescription data, contact values, tokens, provider errors, internal IDs, public accusation, attachment or unauthorized audit field appears in response, URL, notification, log, audit, export, browser storage or screenshot artifact.

- [ ] **Step 3: Run accessibility/browser checks**

Verify form labels, validation focus, live error/status announcements, keyboard operation, 200% scaling, narrow responsive layout and screen-reader semantics for buyer report, pharmacy case, admin audit and break-glass states. Record only actual browser evidence.

- [ ] **Step 4: Run repository quality/security checks**

Run focused contract/Worker/web tests, `pnpm run format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and repository security/secret/dependency checks. Use only the approved local synthetic verification path; report hosted evidence only if it actually ran.

- [ ] **Step 5: Review rollback and handoff**

Verify export before migration reversal, safe feature disablement, audit integrity, no orphaned cases, break-glass revocation and preservation of safe search. Report gate versions, commit, exact evidence, synthetic/protected status, privacy/security/cost impact, rollback and residual risks.

- [ ] **Step 6: Commit only approved Task 14 scope**

```bash
git add packages/contracts/src/index.ts packages/contracts/src/__tests__ apps/worker/migrations apps/worker/src/data apps/worker/src/routes apps/worker/src/security apps/worker/src/http apps/worker/src/types apps/worker/src/__tests__ apps/web/src apps/web/__tests__
git commit -m "feat: add scoped support reports and admin audit views"
```

Adjust the staged paths to the exact approved files. Do not include credentials, `.env` files, real support/report/audit data, prescription content or unrelated user changes.
