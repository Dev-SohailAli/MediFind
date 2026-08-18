# Task 6 Pages Preview Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a repeatable local guard that accepts only the default synthetic static Pages artifact and fails when shell assets, no-index policy, capability boundaries or build-mode safety are missing.

**Architecture:** The normal `apps/web` build remains the only artifact under test. `verify-preview-build.mjs` inspects the generated `dist` tree, source-policy files copied into it and the default build mode; it does not deploy, contact Cloudflare or reject unused Worker adapter code merely because that code is bundled. This is a no Cloudflare, local-only guard. Existing source-level Pages/PWA tests remain the contract for static configuration, while Task 4 browser evidence proves runtime no-fetch behavior.

**Tech Stack:** Node.js 24, Vite 8, `vite-plugin-pwa`, React PWA shell, Vitest 4, pnpm workspace scripts.

**Spec:** `docs/claude-tasks/task-6-pages-preview-release-guards.md`, `docs/cloudflare-web-architecture.md`, `docs/web-app-and-pwa-direction.md`, `docs/infrastructure-and-release-blueprint.md`, `docs/repository-security-and-delivery.md`.

## Global Constraints

- The accepted default is a build with `VITE_MEDIFIND_SEARCH_MODE` unset; it remains fixture-backed and no-indexed.
- Do not deploy Pages, invoke Wrangler, contact Cloudflare, read credentials or add a build-time secret.
- Do not fail merely because the unused Worker adapter or `/v1` strings are present in the bundle; prove default execution/configuration separately.
- Require `dist/index.html`, manifest, service-worker output, referenced icons, copied `_headers` and `robots.txt`.
- Reject emitted `.env`/credential-looking files, D1 IDs/bindings, direct D1/R2/KV references as runtime configuration, Pages Functions, API proxy, analytics, cookies and client persistence.
- Preserve `X-Robots-Tag: noindex, nofollow`, `robots.txt` disallow policy, HTML noindex metadata and synthetic-local manifest identity.
- Use exact named failure reasons and no raw bundle/secret content in errors.
- Work in an isolated task branch/worktree and preserve the current user-owned dirty worktree.

---

### Task 1: Define source and artifact guard tests first

**Files:**
- Modify: `apps/web/__tests__/pages-preview.test.ts`
- Modify: `apps/web/src/__tests__/pwa-manifest.test.ts` only for a missing source assertion
- Create: `apps/web/scripts/verify-preview-build.test.mjs`
- Read: `apps/web/index.html`, `apps/web/vite.config.ts`, `apps/web/src/main.tsx`, `apps/web/public/_headers`, `apps/web/public/robots.txt`, `wrangler.toml`

**Interfaces:**
- Consumes: source policy files, manifest metadata and synthetic build fixture paths.
- Produces: failing expectations for `verify-preview-build.mjs` and existing static-policy tests.

- [ ] **Step 1: Add source-policy assertions**

Extend `pages-preview.test.ts` to assert the root Pages Wrangler config has no account/binding/vars/functions/secret authority, `index.html` has the noindex meta tag and `public/_headers`/`robots.txt` retain their exact static no-index rules. Keep the test source-only and synthetic.

- [ ] **Step 2: Add manifest/shell contract assertions**

Assert the manifest name/description remains explicitly synthetic/local, `start_url`/`scope` remain `/`, all referenced icon files exist, theme/background colors remain the approved tokens and no production brand/domain/credential field is introduced.

- [ ] **Step 3: Write failing guard helper fixtures**

In `verify-preview-build.test.mjs`, create temporary directories representing a valid default `dist`, missing manifest, missing service worker, missing icon, changed noindex header/robots file, emitted `.env`, direct D1 binding text, API proxy marker, analytics/cookie/storage marker and Worker-mode build marker. Assert the guard returns named failures for each invalid fixture and accepts a valid fixture containing an unused `/v1` string in a non-executed bundle.

- [ ] **Step 4: Write the default-mode test**

Assert the guard accepts only an explicit `buildMode: 'fixture-default'` marker derived from `VITE_MEDIFIND_SEARCH_MODE` being unset/empty. A fixture representing `VITE_MEDIFIND_SEARCH_MODE=worker` must be rejected as `explicit-worker-mode-not-pages-preview` rather than silently accepted.

- [ ] **Step 5: Run focused tests and observe failure**

Run: `pnpm --filter @medifind/web exec vitest run __tests__/pages-preview.test.ts src/__tests__/pwa-manifest.test.ts scripts/verify-preview-build.test.mjs`

Expected: FAIL because the new guard/helpers do not yet exist, while existing source policy tests identify any baseline mismatch.

### Task 2: Implement the artifact inspection guard

**Files:**
- Create: `apps/web/scripts/verify-preview-build.mjs`
- Test: `apps/web/scripts/verify-preview-build.test.mjs`

**Interfaces:**
- Consumes: `dist` path and an environment snapshot with `VITE_MEDIFIND_SEARCH_MODE`.
- Produces: pure helpers and executable result:

```js
export function inspectPreviewBuild({ distDirectory, sourceDirectory, searchMode });
// returns { ok: true, buildMode: 'fixture-default', checks: [...] }
// or { ok: false, failures: [{ code, message }] }
```

- [ ] **Step 1: Resolve the web root/dist path safely**

Resolve paths from `import.meta.url` so the command works from repository root or `apps/web`. Do not accept an arbitrary output directory or command-line shell fragment; use the fixed `dist` directory unless a pure test passes a temporary directory to the helper.

- [ ] **Step 2: Validate default build mode**

Accept `undefined` or an empty `VITE_MEDIFIND_SEARCH_MODE` as `fixture-default`. Reject exactly `worker` and any other non-empty value with a named failure. Do not inspect or reject the mere presence of Worker adapter source/bundle text.

- [ ] **Step 3: Validate shell and PWA assets**

Require `dist/index.html`, `dist/manifest.webmanifest`, at least one generated `sw.js`, `workbox-*.js` output, the three manifest-referenced icons, `dist/_headers` and `dist/robots.txt`. Require `index.html` to contain the built shell reference, `/manifest.webmanifest`, `noindex, nofollow`, and no direct `/v1/` request or inline API/proxy script.

- [ ] **Step 4: Validate static policy and synthetic identity**

Require `_headers` to contain `X-Robots-Tag: noindex, nofollow`, `robots.txt` to contain `User-agent: *` and `Disallow: /`, and the manifest/HTML description to retain the synthetic-local/no-real-data wording. Use named failure codes such as `missing-shell`, `missing-manifest`, `missing-service-worker`, `missing-icon`, `missing-noindex-policy` and `missing-synthetic-identity`.

- [ ] **Step 5: Validate emitted capability boundary**

Recursively inspect only filenames and bounded text from generated assets. Reject `.env`/credential-looking files and clear markers for `account_id`, D1/R2/KV binding configuration, Pages Functions, analytics SDKs, cookie writes, `localStorage`/`sessionStorage`/IndexedDB writes and API proxy setup. Do not reject generic `fetch`/`/v1` strings solely because the unused Worker adapter is bundled; source/runtime tests own that distinction.

- [ ] **Step 6: Return safe deterministic result or fail**

On success print one compact JSON object with `buildMode`, `distDirectory` omitted or normalized to a non-sensitive label, and named check codes. On failure print only the first/complete list of named codes and safe messages; never print matching bundle text, paths containing secrets, source maps or credentials.

- [ ] **Step 7: Run pure guard tests**

Run: `pnpm --filter @medifind/web exec vitest run scripts/verify-preview-build.test.mjs`

Expected: PASS for valid/invalid temporary fixture trees, default/worker mode and unused Worker-code tolerance.

### Task 3: Connect the guard to the web package build workflow

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/__tests__/pages-preview.test.ts` if generated-artifact coverage belongs there
- Modify: `apps/web/src/__tests__/pwa-manifest.test.ts` only for source-level regression
- Modify: `.github/workflows/quality.yml` only to run the guard after the normal build, if the root workflow is the approved owner
- Test: `apps/web/scripts/verify-preview-build.test.mjs`

**Interfaces:**
- Consumes: normal `pnpm --filter @medifind/web build` output with no Worker-mode environment.
- Produces: a local/CI command that runs only after a successful default web build.

- [ ] **Step 1: Add the package command**

Add exactly:

```json
"verify:preview": "node ./scripts/verify-preview-build.mjs"
```

Do not add a deploy command, Cloudflare credential, Pages project flag or remote option.

- [ ] **Step 2: Run build then guard locally**

Run: `pnpm --filter @medifind/web build`

Run: `pnpm --filter @medifind/web verify:preview`

Expected: default build passes and the guard reports `fixture-default` with all named checks.

- [ ] **Step 3: Prove explicit Worker mode is not a Pages artifact**

Run a synthetic development build with `VITE_MEDIFIND_SEARCH_MODE=worker` only in a temporary output/test context, then run the guard and assert the named Worker-mode rejection. Do not overwrite the accepted default `dist` without rebuilding the default artifact afterward, and do not start a Worker or contact Cloudflare.

- [ ] **Step 4: Add the guard after build in CI only if required**

If CI owns the root build and a package script cannot be invoked by existing checks, add one step after `pnpm build` that runs `pnpm --filter @medifind/web verify:preview`. Preserve read-only permissions, pinned actions and no deployment authority. Do not add a Pages deploy step.

### Task 4: Run full verification and hand off

**Files:**
- Review only: `apps/web/scripts/verify-preview-build.mjs`, its test, `apps/web/package.json`, source/page tests, optional workflow line

- [ ] **Step 1: Run focused and repository checks**

Run: `pnpm --filter @medifind/web build`

Run: `pnpm --filter @medifind/web verify:preview`

Run: `pnpm --filter @medifind/web exec vitest run __tests__/pages-preview.test.ts src/__tests__/pwa-manifest.test.ts scripts/verify-preview-build.test.mjs`

Run: `pnpm run format:check`

Run: `pnpm lint`

Run: `pnpm typecheck`

Run: `pnpm test`

Run: `pnpm build`

Run: `pnpm run security:secrets`

Run: `pnpm run audit`

Run: `pnpm run security:trivy`

Report an exact Trivy database failure if it cannot complete; do not claim a clean scan without output.

- [ ] **Step 2: Review the generated artifact and scope**

Confirm the guard never invokes Wrangler/Cloudflare, no sensitive value was emitted, unused Worker code is tolerated, default mode is fixture-only, static no-index policy remains intact, no runtime cache/API proxy/cookie/storage capability was added, and Task 4 browser evidence remains the source for runtime no-fetch claims.

- [ ] **Step 3: Commit only Task 6 scope**

```bash
git add apps/web/scripts/verify-preview-build.mjs apps/web/scripts/verify-preview-build.test.mjs apps/web/package.json apps/web/__tests__/pages-preview.test.ts apps/web/src/__tests__/pwa-manifest.test.ts .github/workflows/quality.yml
git commit -m "test: guard synthetic pages preview artifacts"
```

- [ ] **Step 4: Return the PR handoff report**

Report the commit, exact build/guard/test/full-check results, default and explicit Worker-mode outcomes, synthetic-only status, security/privacy/cost impact, rollback and residual risks. Do not claim Pages deployment, hosted browser evidence or production readiness.
