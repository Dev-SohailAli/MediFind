# Task 9 Pharmacy Verification and Staff Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the smallest server-owned pharmacy verification and branch-scoped staff lifecycle after Task 7 approval and Task 8 identity/MFA evidence. The Worker must preserve verification evidence privacy, role continuity, seven-day invitation expiry, reviewer safety and explicit command/idempotency/concurrency rules.

**Architecture:** The browser submits only approved metadata and explicit commands to the Worker. The Worker owns verification state, branch scope, role grants, invitation lifecycle, continuity transitions, audit events and public projection eligibility. Verification files/details are never public and are outside this task unless a separate approved upload/quarantine gate exists. D1 receives only the exact additive schema approved by the Task 7 field matrix; public search consumes a safe projection and never becomes the authorization source.

**Tech Stack:** TypeScript React/Vite web app, Cloudflare Worker/D1 through approved server-only bindings, provider-neutral identity context from Task 8, explicit JSON commands, Vitest, synthetic D1 fixtures and Testing Library. No new identity provider, file provider, notification provider, route or binding may be inferred.

**Spec:** `docs/claude-tasks/future/task-9-pharmacy-verification-staff-access.md`, `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`, `docs/pharmacy-verification-policy.md`, `docs/staff-access-lifecycle-policy.md`, `docs/data-dictionary-and-ownership.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/api-error-contract.md`, `docs/audit-log-policy.md`, `docs/security-privacy-compliance.md`, `docs/security-architecture-threat-model.md` and the accepted Task 7/8 evidence and decisions.

## Global Constraints

- Do not dispatch until Task 7 gate IDs `G-01`, `G-02`, `G-03`, `G-04`, `G-05`, `G-06` and `G-09` are `PASS`, Task 8 is accepted, and the verification field matrix, role matrix, exact routes and MFA/fresh-auth rules are recorded.
- If verification evidence fields, role names, retention, region, processor, support access or approved bindings are missing or conflicting, stop before creating a migration. Do not invent a field or use a loose future column.
- Keep this task synthetic-only: use invented identities and synthetic metadata only. Never store or test real pharmacy licences, personal contacts, phone/email values, invitation tokens, prescription content or production data.
- Evidence files/details never enter public projections, ordinary API responses, browser storage, logs, notifications or URLs. This task does not activate prescription upload, scanning or prescription content access.
- Keep the web-only Cloudflare architecture. Do not add Firebase, Google Cloud, Cloud Run, API Gateway, Firestore, native apps, store packages or native push.
- Every mutation is an explicit named command with minimum input, server-derived state, authenticated branch/role authorization, opaque idempotency key, current-version enforcement where applicable, safe errors and a redacted audit event.
- Preserve anonymous public search behavior, direct-binding denial, anti-enumeration, rate limits, offline safety and accessible loading/error/maintenance states.

## Task 1: Recheck Task 7/8 gates and freeze approved schemas

**Files:**

- Read: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Read: the accepted Task 7 ADR and Task 8 implementation/evidence report, if present
- Read: exact approved verification field, role, route, binding and retention decisions
- Modify only if a gate record or task brief needs a documentation correction before implementation

**Interfaces:**

- Input: verified identity/MFA actor context, approved pharmacy verification metadata, staff roles, branch scope and exact route/transport contracts.
- Output: an implementation matrix mapping each command, record, actor requirement, state transition, audit event, idempotency key and rollback action.

- [ ] **Step 1: Confirm dependency status**

Record the Task 7 packet version and Task 8 commit/evidence. Confirm owner/admin support access, fresh-MFA requirements, legal/privacy retention, backup/restore, cost breakers and release rollback are current. A green local test suite cannot replace these gates.

- [ ] **Step 2: Freeze verification metadata**

Require the approved categories/references, review date, expiry date, decision/state, reviewer and audit reference. Apply the policy rule that verification is valid for 12 months from approval or until the earliest relied-on evidence expiry, whichever comes first. Do not accept document bytes, public URLs or unapproved evidence types.

- [ ] **Step 3: Freeze role and branch scope**

Record the approved role set and scope for pharmacy owner, inventory manager, prescription reviewer and MediFind admin. Owner status must not imply prescription-review access. Every staff assignment must have a branch scope; the browser cannot select or widen that scope.

- [ ] **Step 4: Freeze exact command/route contracts**

Record the approved method/path and request/response shape for submit metadata, approve/suspend, invite/reissue/revoke, accept invitation and assign/remove roles. If the exact route is not approved, do not invent one. Keep invitation tokens out of durable URLs and logs.

## Task 2: Add contract-first verification and staff types

**Files:**

- Modify: `packages/contracts/src/index.ts`
- Create: focused contract tests under `packages/contracts/src/__tests__/`
- Review: `packages/contracts/src/__tests__/boundary.test.ts`

- [ ] **Step 1: Write failing contract tests**

Test approved verification states, safe verification summaries, staff assignment scope, invitation state and command input/output types. Assert that evidence files/details, raw contacts, invitation tokens, provider claims, prescription fields and arbitrary state patches cannot appear in public contracts.

- [ ] **Step 2: Define discriminated state and command unions**

Represent only the accepted lifecycle states, such as pending/reviewed/verified/suspended/reverification-required/expired and invitation issued/replaced/revoked/accepted/expired, using the exact approved names. Commands must be explicit and minimum-field: submit metadata, approve, suspend, invite, reissue, revoke, accept and assign/remove roles.

- [ ] **Step 3: Pin safe response/error shapes**

Use the existing API error contract and reviewed message keys. An invitation or verification response must not reveal whether another phone, email, account, branch or pharmacy exists. Safe conflict, stale-version, forbidden, rate-limit and unavailable outcomes must be distinguishable only as approved.

## Task 3: Create the approved additive D1 records and repositories

**Files:**

- Create: the exact approved additive migration for verification metadata, staff assignments and opaque invitations
- Create: repository/transaction modules under `apps/worker/src/data/` or the approved data boundary
- Modify: `apps/worker/src/types/env.ts` only for approved server-only bindings
- Test: migration/repository tests under `apps/worker/src/__tests__/`

- [ ] **Step 1: Validate the field matrix before writing SQL**

Check every column against the approved privacy classification, owner, retention/deletion, export/restore, index, uniqueness and audit requirements. Store metadata/reference only; never create a file column, public evidence URL, raw token, raw phone/email or prescription field.

- [ ] **Step 2: Enforce relational invariants**

Require immutable opaque IDs, UTC timestamps, schema/version values, branch and organisation relationships, one active invitation per invited person/phone/role context, seven-day invitation expiry, assignment uniqueness and state constraints. Use foreign keys/transactions where approved and preserve the existing synthetic migration boundary.

- [ ] **Step 3: Implement repository methods as command primitives**

Provide transaction-safe operations for submit, approve, suspend, invite, reissue, revoke, accept and role assignment/removal. Repositories must receive an already-authorized actor and command context; they must not accept browser role/branch authority or perform generic arbitrary updates.

- [ ] **Step 4: Prove export, restore and deletion behavior synthetically**

Extend the local synthetic export/restore checks only for approved records. Verify deterministic schema/export evidence, deletion/retention handling, no raw contacts/tokens in output and rollback of the additive migration. Do not run a hosted migration unless explicitly authorized by the accepted task gate.

## Task 4: Implement Worker commands and lifecycle invariants

**Files:**

- Create/modify: approved route handlers under `apps/worker/src/routes/`
- Modify: `apps/worker/src/routes/definitions.ts`, `apps/worker/src/http/router.ts`, `apps/worker/src/security/authorize.ts` and audit/idempotency/version seams as needed
- Test: focused route/integration tests under `apps/worker/src/routes/__tests__/` and `apps/worker/src/__tests__/`

- [ ] **Step 1: Implement verification submission and review**

Allow an in-scope owner to submit approved metadata privately. Allow only a separate authorized MediFind verifier/admin to approve or suspend; prevent self-approval. On material ownership, address, legal/display-name, licence/responsible-reviewer or official-contact change, enter `reverification_required` and require review before public/operational restoration.

- [ ] **Step 2: Implement verification expiry and suspension**

Calculate effective validity from approval and earliest evidence expiry. On expiry or suspension, remove affected public discovery, prescription receipt/review and reservation handling according to policy, pause/revoke affected staff access as approved, and preserve eligible OTC behavior. Never forward pending prescription records or reveal their content in notifications.

- [ ] **Step 3: Implement invitation lifecycle**

Create a branch-scoped invitation with seven-day expiry and minimum approved identity context; reissue invalidates the previous invitation immediately; revoke and expiry are terminal/audited; acceptance requires approved phone proof, verified personal email, required MFA and owner-granted roles. Use generic responses and no raw token in logs or URLs. An invitation alone never grants active access.

- [ ] **Step 4: Implement role assignment and continuity**

Require fresh MFA for ownership transfer, role/owner changes and other approved high-risk actions. Prevent removal, revocation or downgrade of the final active pharmacy owner. Require explicit reviewer assignment; owner access never implies reviewer access.

- [ ] **Step 5: Implement last-reviewer safety atomically**

When the last active `prescription_reviewer` is revoked, suspended, expired or otherwise inactive, atomically disable new prescription requests, remove prescription-required listings from the public projection and emit redacted owner/admin alerts/audit events while eligible OTC listings remain available. Restoration requires a current verified branch, active reviewer and safe projection reevaluation; an old session cannot restore it.

- [ ] **Step 6: Apply command safety uniformly**

Require the approved idempotency key and canonical safe request fingerprint for each repeatable command, current version for conflict-prone records, persistent action limits, transaction/concurrency checks, safe generic errors and one redacted audit event for acceptance, denial, conflict and continuity protection.

## Task 5: Add protected web surfaces with safe states

**Files:**

- Create/modify: approved `apps/web/src/` pharmacy verification/staff components and session context
- Modify: approved strings/styles/navigation only for the scoped protected flow
- Test: focused web component/hook tests and `apps/web/__tests__/App.test.tsx`

- [ ] **Step 1: Render only authorized scopes**

Show a verified owner only their approved branches and safe verification status/metadata. Show staff only their own assignment and permitted branch operations. Never render evidence details, invitation tokens, another branch's roles or prescription content to an unauthorized actor.

- [ ] **Step 2: Implement safe command states**

Cover loading, submitted/pending review, approved, suspended, expired/reverification-required, invitation pending/replaced/revoked/expired, stale conflict, rate-limited, unavailable, revoked session and generic forbidden/error states. Do not infer success from an optimistic client state.

- [ ] **Step 3: Preserve offline and accessibility safety**

Offline mode must not queue verification, invitation, role, owner or suspension mutations. On resume, reload authoritative state. Test keyboard/focus return, labels, live-region updates, error association, 200% zoom and narrow layouts with synthetic content.

## Task 6: Verify the full lifecycle and boundaries

**Files:**

- Review: all changed contracts, migration, repositories, routes, authorization, audit, web states and synthetic fixtures
- Evidence: a Task 9 synthetic verification report linked from the brief, containing no protected data or credentials

- [ ] **Step 1: Run required negative and concurrency tests**

Cover seven-day expiry, replacement invalidation, missing phone/MFA proof, anti-enumeration, final-owner protection, ownership transfer/reverification, verification expiry/suspension, last-reviewer disablement/restoration, OTC continuity, cross-branch isolation, wrong role, stale version, duplicate idempotency, rate limit, provider unavailable and safe generic errors.

- [ ] **Step 2: Prove public projection safety**

Verify evidence metadata/details, staff assignments, invitations and private state never appear in anonymous search/listing responses. Verify a last-reviewer transition hides prescription-required projections without hiding eligible OTC listings and cannot be bypassed by a stale browser response.

- [ ] **Step 3: Run repository quality/security checks**

Run focused contract/Worker/web tests, `pnpm run format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and the repository security/secret/dependency checks. Use only the approved local synthetic verification path; record any Wrangler/hosted evidence only if it actually ran.

- [ ] **Step 4: Review leakage and scope**

Search changed files, logs and artifacts for real contacts, licence data, invitation tokens, raw provider values, prescription fields, direct browser bindings, arbitrary PATCH/state updates, analytics/cookies and old Firebase/GCP/native direction. Confirm rollback is an additive migration reversal plus safe feature disablement, with export verified first.

- [ ] **Step 5: Commit only approved Task 9 scope**

```bash
git add packages/contracts/src/index.ts packages/contracts/src/__tests__ apps/worker/migrations apps/worker/src/data apps/worker/src/routes apps/worker/src/security apps/worker/src/http apps/worker/src/types apps/worker/src/__tests__ apps/web/src apps/web/__tests__
git commit -m "feat: add pharmacy verification and staff access lifecycle"
```

Adjust the staged paths to the exact approved files. Do not include credentials, `.env` files, real evidence, production exports or unrelated user changes.
