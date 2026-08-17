# Web-Only Source-of-Truth Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the MediFind repository and its GitHub work with the approved web-only Cloudflare architecture and free-first synthetic-data boundary.

**Architecture:** `apps/web` is the only active client. `apps/worker` is the only optional server boundary; browser code never receives D1/R2/KV access or secrets. Cloudflare Pages/Workers are preferred, while D1/R2/KV remain task-gated candidates.

**Tech Stack:** pnpm workspace, TypeScript, React/Vite PWA, Cloudflare Worker/Wrangler, Vitest, ESLint, Prettier, GitHub Actions and GitHub connector metadata APIs.

**Spec:** `docs/superpowers/specs/2026-08-17-web-only-source-of-truth-design.md`

## Global Constraints

- The only active client is the responsive web/PWA in `apps/web`.
- The only active server boundary is the optional Cloudflare Worker package in `apps/worker`.
- `archive/legacy-mobile-prototype` is historical and outside the workspace.
- The public preview and all local fixtures are synthetic-only.
- The browser never receives Worker secrets or direct D1/R2/KV access.
- Do not add native apps, Expo, React Native, EAS, App Store, Google Play, Firebase, Google Cloud, Cloud Run, API Gateway, Firestore, native push SDKs or mobile platform configuration.

### Task 1: Establish the consistency inventory and design record

**Files:**
- Create: `docs/superpowers/specs/2026-08-17-web-only-source-of-truth-design.md`
- Create: `docs/superpowers/plans/2026-08-17-web-only-source-of-truth-cleanup.md`

- [x] **Step 1: Record the approved architecture and verification contract**

The design record states the browser/Pages/Worker/data boundary, synthetic-only
preview, historical archive rule, forbidden platforms, and required evidence.

- [x] **Step 2: Record file groups and exact verification commands**

The implementation plan identifies workspace/configuration, active documentation,
repository guards, and GitHub metadata as separate reviewable work areas.

### Task 2: Reconcile repository structure and automated boundaries

**Files:**
- Modify: `pnpm-workspace.yaml`, root `package.json`, `tsconfig.json`, `vitest.config.mts`, `tests/workspace-boundary.test.ts`, `.github/workflows/quality.yml`, `.github/ISSUE_TEMPLATE/implementation-task.md`, `.github/pull_request_template.md`, `wrangler.toml`, and any active package manifests/configuration containing retired platform assumptions.
- Delete only active retired workspace files already identified in the current task branch: `apps/mobile/**`, `apps/api/**`, and their active-only configuration.
- Preserve: `archive/**` and unrelated user changes.

- [ ] **Step 1: Add the failing boundary assertions**

Add tests that inspect the active workspace/configuration and assert that the
root has no `apps/mobile`, `apps/api`, Firebase/GCP/native project files, or
mobile package names, while allowing the explicit historical archive.

- [ ] **Step 2: Run the focused boundary test and verify the expected failure**

Run: `pnpm exec vitest run tests/workspace-boundary.test.ts`

Expected: FAIL until the active workspace/configuration matches the assertions.

- [ ] **Step 3: Make the minimal structure/configuration changes**

Keep only `apps/web`, `apps/worker`, and approved packages in workspace globs;
make CI install/test/build the web and Worker packages; keep Wrangler free of
committed account IDs, tokens, secrets and unapproved bindings.

- [ ] **Step 4: Run the focused boundary test and verify it passes**

Run: `pnpm exec vitest run tests/workspace-boundary.test.ts`

Expected: PASS with no active native, Firebase/GCP or retired API workspace
artifact detected.

### Task 3: Normalize active documentation and agent instructions

**Files:**
- Modify: `README.md`, `AGENTS.md`, `CLAUDE.md`, `CLAUDE-DESIGN.md`, `docs/README.md`, `docs/architecture.md`, `docs/cloudflare-web-architecture.md`, `docs/web-app-and-pwa-direction.md`, `docs/web-free-first-options.md`, `docs/free-first-production-architecture.md`, `docs/cost-and-environment-plan.md`, `docs/cost-circuit-breaker-policy.md`, `docs/monorepo-and-toolchain-policy.md`, `docs/infrastructure-and-release-blueprint.md`, `docs/engineering-delivery.md`, `docs/repository-security-and-delivery.md`, `docs/public-source-visibility-review.md`, `docs/documentation-roadmap.md`, `docs/implementation-sequencing.md`, relevant task briefs/specifications, and `docs/decisions.md`.

- [ ] **Step 1: Replace stale active wording with the single web/Cloudflare contract**

Use `apps/web`, optional `apps/worker`, Cloudflare Pages/Workers, synthetic
preview, and server-only candidate data stores consistently. Keep platform
names only where they are explicitly marked as prohibited, superseded, or
historical guardrails.

- [ ] **Step 2: Update the documentation index and decision record**

Make the Cloudflare architecture, web/PWA direction, free-first data options,
cost circuit breaker and Worker boundary discoverable from `docs/README.md` and
record the superseding decision in `docs/decisions.md`.

- [ ] **Step 3: Scan active docs for contradictions**

Run a targeted search over tracked active files, excluding `archive/**`, build
output and dependencies, and manually classify each remaining platform term as
an allowed prohibition/historical reference or a contradiction to fix.

### Task 4: Verify the complete local repository state

**Files:**
- Test/inspect: all active source, docs, manifests, workflows and generated-output ignore rules.

- [ ] **Step 1: Run formatting, lint, typecheck, tests and builds**

Run:

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

- [ ] **Step 2: Run Worker and Wrangler checks**

Run the Worker package tests and the repository’s Wrangler configuration check
using the exact scripts present in `package.json`; report missing local tools
instead of fabricating hosted results.

- [ ] **Step 3: Run security and dependency checks**

Run the configured secret scan, dependency audit and repository audit scripts;
confirm no credentials, production artifacts or unapproved provider packages
were introduced.

- [ ] **Step 4: Re-run the active-reference audit after all edits**

Confirm no contradictory active client/server/provider/workspace references
remain and that the historical archive is still excluded from build/workspace
inputs.

### Task 5: Align GitHub pull requests with verified repository state

**Files/remote state:**
- Update: PR #22 in `Dev-SohailAli/MediFind` with the final web-only summary, verification evidence, and residual-risk notes.
- Close: PR #21 in `Dev-SohailAli/MediFind` as superseded by the web-only source-of-truth cleanup, with a comment explaining that its mobile-era branch/description is no longer mergeable.

- [ ] **Step 1: Read back both PRs and confirm their current state**

Use the GitHub connector for PR metadata and comments; do not rely on cached
local descriptions.

- [ ] **Step 2: Update PR #22 after local verification**

Describe only files and checks actually present on the pushed head; remove the
claim that the web-only documentation migration is out of scope.

- [ ] **Step 3: Close PR #21 with an explanatory comment**

Do not merge its branch. State that the old mobile workspace and platform
assumptions are retired, and that future work must target `apps/web` plus the
approved Cloudflare Worker boundary.

- [ ] **Step 4: Read back GitHub state**

Confirm PR #22 has the updated description and PR #21 is closed with the
supersession comment; report any permission or connector limitation explicitly.

### Task 6: Final completion audit

- [ ] **Step 1: Compare every requirement in the design and global constraints against current files and command output**
- [ ] **Step 2: Confirm no hosted Cloudflare, production-data or production-deployment claim was made without evidence**
- [ ] **Step 3: Mark the goal complete only after local and GitHub evidence satisfies every requirement**
