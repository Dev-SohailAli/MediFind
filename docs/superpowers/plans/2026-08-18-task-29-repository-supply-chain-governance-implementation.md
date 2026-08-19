# Task 29 Repository and Supply-Chain Governance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the web-only MediFind product reviewable, reproducible and recoverable as collaborators, dependencies, environments and release risk grow, without adding deployment authority or exposing credentials/private data.

**Architecture:** Source control, CI and release evidence remain PR-only and founder-governed. Fresh-clone checks reproduce quality/security verification with synthetic data and no local credentials. Environment/deployment roles are documented separately from source; emergency access is narrow, time-limited, MFA-protected, audited and never a normal merge/deploy path. Pinned dependencies/actions and provenance checks reduce supply-chain drift without introducing a new vendor.

**Tech Stack:** Existing GitHub repository/workflows, pnpm lockfile, Node/TypeScript toolchain, pinned Actions/dependencies, existing format/lint/typecheck/test/build/secret/dependency/filesystem/security checks, CODEOWNERS or equivalent review ownership, synthetic fixtures and fresh-clone documentation. No Cloudflare account change, secret rotation, public visibility change, new CI vendor, automated merge/deploy authority, real data or credentials in fixtures is authorized by this plan.

**Spec:** `docs/claude-tasks/post-pilot/task-29-repository-supply-chain-governance.md`, `docs/repository-security-and-delivery.md`, `docs/public-source-visibility-review.md`, `docs/monorepo-and-toolchain-policy.md`, `docs/engineering-delivery.md`, `docs/claude-code-setup.md`, `docs/github-work-management.md`, accepted Task 22 release-owner review and current founder repository decision.

## Global Constraints

- Do not begin until Task 22 release-owner review confirms repository visibility, default branch, required checks, environment owners and release/rollback authority.
- Preserve the current web-only Cloudflare direction. Do not restore native/mobile, Firebase/GCP, Cloud Run, API Gateway, Firestore, native push, store distribution or retired work queues.
- No real buyer, pharmacy, medicine, health, prescription, contact, support, incident, deployment secret or production artifact may enter source, issues, PRs, logs, CI artifacts, fixtures or examples.
- Do not add deployment authority, cloud account access, secret rotation, provider, CI vendor, public visibility, automated merge/deploy or bypass rule for convenience.
- Keep `main` PR-only with required quality/security checks, no ordinary force/delete path and review ownership appropriate to changed security/data/release scope.
- Preserve unrelated user worktree changes; audit and edit only approved repository governance paths. Do not reset, clean, overwrite or stage unrelated modifications.
- Do not claim hosted configuration, branch protection, secret scanning, deployment, environment or production evidence unless actually inspected under a reauthenticated founder-approved workflow.

## Task 1: Establish repository governance baseline

**Files:**

- Create: task-specific repository/supply-chain evidence record
- Modify: `docs/claude-tasks/post-pilot/task-29-repository-supply-chain-governance.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md` to link this plan
- Read: Task 22 release-owner decision, current repository visibility, default branch, protections, owners and CI status

**Interfaces:**

- Input: repository settings/evidence, workflow inventory, dependency/action inventory, environment owner register and fresh-clone requirements.
- Output: versioned governance matrix, gap/remediation list, owner, due date and release impact.

- [ ] **Step 1: Record source controls**

Capture repository visibility decision, default branch, PR requirement, linear-history/review/status checks, force/delete restrictions, tag/release policy and emergency exception owner. Do not change settings as an implicit implementation step.

- [ ] **Step 2: Record review ownership**

Define CODEOWNERS or equivalent ownership for web, Worker, contracts, security/privacy, migrations, infrastructure, workflows and release evidence. Require appropriate review for sensitive changes without giving contributors broad account permissions.

- [ ] **Step 3: Record environment ownership**

Document local/synthetic/isolated/protected ownership, deployment/release/rollback/recovery roles, secret custody, MFA/recovery, approval points and no-production-data status. Keep environment credentials outside source and CI logs.

## Task 2: Audit CI, actions and dependency governance

**Files:**

- Review/modify: existing workflow files only within approved governance scope
- Create: workflow/action/dependency inventory and provenance checks
- Review: `package.json`, lockfile, build scripts and generated artifacts

- [ ] **Step 1: Pin CI execution**

Pin third-party Actions to reviewed immutable commits or approved version policy, use frozen pnpm installs and deterministic Node/tool versions, minimize permissions and prevent workflows from accessing production data by default. Do not add a deployment workflow.

- [ ] **Step 2: Inventory dependencies**

Record direct/transitive package owner, purpose, license/security review, update path, expected runtime/build scope and removal/rollback plan. Separate build-only risks from runtime risks; do not silently accept a new dependency for convenience.

- [ ] **Step 3: Define update policy**

Use bounded dependency update cadence, lockfile review, security advisory triage, test/build evidence and rollback. Critical/high findings follow the repository policy and block release when their risk is unresolved; do not paste private advisory data into public artifacts.

- [ ] **Step 4: Verify generated/provenance artifacts**

Check build output and reports for secrets, real data, source-map/internal identifiers, credentials, private paths, unapproved routes and provider bindings. Record commit/toolchain/dependency hashes without embedding sensitive logs.

## Task 3: Make fresh-clone verification reproducible

**Files:**

- Create: fresh-clone verification instructions/checklist/script only if it uses existing tools
- Modify: repository docs/CI checks within approved scope
- Create: synthetic fixture and clean-environment evidence

- [ ] **Step 1: Define clean prerequisites**

Document supported OS/shell, Node/pnpm versions, frozen install, required environment variables (synthetic-safe only), no-secret defaults, test/build/security commands and expected outputs. Do not require a personal token, Cloudflare login or production access.

- [ ] **Step 2: Run from an isolated clone/workspace**

Use a clean synthetic workspace and verify format, lint, typecheck, tests, build, secret scan, dependency audit and filesystem/security checks. Record command, commit, tool versions, duration, result and limitations without claiming hosted checks.

- [ ] **Step 3: Verify no network/data leakage**

Where the existing checks permit, confirm local tests/builds use invented fixtures, do not contact unapproved services, do not read outside the workspace and do not emit real data/credentials into logs/artifacts.

- [ ] **Step 4: Verify task evidence format**

Require each PR/task to record changed interfaces, synthetic/protected status, browser/Worker verification, security/privacy/cost impact, rollback path and residual risks. Issues/PRs must not contain credentials, private correspondence or real data.

## Task 4: Govern emergency access and release recovery

**Files:**

- Create: emergency-access/release-review evidence template
- Review: repository/release/environment owner records and Task 22 rollback plan
- Modify: governance docs only; no account permissions or secret rotation

- [ ] **Step 1: Define emergency access**

Require a named founder-approved owner, fresh authentication/MFA, minimum scope, reason, start/end time, approval, audit reference and post-access review. Emergency access cannot bypass normal authorization or expose production data.

- [ ] **Step 2: Define rollback evidence**

Record immutable artifact, migration/export compatibility, rollback/forward-fix owner, synthetic rehearsal, data-integrity/authorization/audit checks and re-enable approval. Never roll back by deleting records or weakening controls.

- [ ] **Step 3: Define vulnerability response**

Map dependency/action/repository findings to severity owner, containment, patch/mitigation target, disclosure handling, retest and release block. Keep attack payloads, secrets and private reports out of ordinary issues/PRs.

- [ ] **Step 4: Keep deployment separate**

Document that CI verification does not deploy Cloudflare or access production by default. Any future deployment needs its own founder-approved reauthenticated workflow, restricted short-lived credential, environment scope, inspection and rollback evidence.

## Task 5: Verify governance and hand off

**Files:**

- Create: final governance evidence and remediation register
- Modify: task brief/roadmap/decision log with exact outcomes
- Review: current worktree changes before staging

- [ ] **Step 1: Test ordinary contributor boundaries**

Verify a contributor cannot force/delete the default branch, bypass required checks, merge without review, access secrets, run deployment authority, alter protected environment records or introduce an unreviewed dependency through normal paths.

- [ ] **Step 2: Test emergency and rollback paths synthetically**

Exercise time-limited approval/audit/review and synthetic artifact rollback without using production credentials/data. Verify normal protections are restored after the exercise.

- [ ] **Step 3: Run repository checks**

Run format, lint, typecheck, tests, build, secret scan, dependency/security/filesystem checks and fresh-clone instructions where available. Record tools that cannot run and why; do not substitute local evidence for hosted settings.

- [ ] **Step 4: Check privacy and scope**

Confirm no private data, real credentials, `.env`, deployment log, new provider/vendor, visibility change, account mutation or automated merge/deploy authority was added.

- [ ] **Step 5: Commit only approved governance scope**

After review, stage only Task 29 documentation/checks/evidence and approved governance changes. Use commit message `chore: strengthen repository and supply-chain governance`. Do not stage unrelated user changes, secrets, real reports or generated private artifacts.
