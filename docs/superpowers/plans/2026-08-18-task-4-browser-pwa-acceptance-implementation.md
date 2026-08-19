# Task 4 Browser and PWA Acceptance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify and minimally harden the synthetic buyer search/PWA flow across keyboard, screen-reader, responsive, offline, install and reduced-capability conditions without adding product capability.

**Architecture:** The default `apps/web` build remains a static fixture-backed PWA. Browser acceptance covers the existing `App`, navigation, search, result cards, detail sheet, safe states, install guidance and offline banner. Any defect fix stays in the named component/style/test scope; the service worker may precache only the static shell and never runtime-cache Worker responses.

**Tech Stack:** React 19, TypeScript 6, Vite 8, `vite-plugin-pwa`, Vitest 4, Testing Library, in-app browser/manual device checks.

**Spec:** `docs/claude-tasks/task-4-browser-pwa-acceptance.md`, `docs/accessibility-policy.md`, `docs/design-system-and-screens.md`, `docs/design-proposals/2026-08-17-organic-visual-system.md`, `docs/web-platform-capabilities-policy.md`, `docs/test-and-acceptance-strategy.md`.

## Global Constraints

- Keep the default build fixture-backed, offline-safe and free of runtime API calls.
- Do not add routes, browser storage, cookies, analytics, maps, contacts, permissions, auth, uploads, reservations, prescriptions or protected workflows.
- Use the existing organic tokens, Lucide icons, reviewed strings and semantic HTML; do not invent colors, fonts, copy or actions.
- Target WCAG 2.2 AA for the changed flow without claiming formal certification.
- Preserve 48px minimum interactive targets, visible `:focus-visible`, logical focus order, non-color status meaning and reduced-motion behavior.
- Test both the current static preview and the explicit `VITE_MEDIFIND_SEARCH_MODE=worker` boundary only when a relevant synthetic check needs it; never enable Worker mode for the default artifact.
- Record only observed browser/device results; do not claim hosted or device evidence that was not actually run.
- Work in an isolated task branch/worktree and preserve the current user-owned dirty worktree.

---

### Task 1: Establish the automated acceptance matrix before changing UI code

**Files:**
- Modify: `apps/web/src/components/__tests__/SearchScreen.test.tsx`
- Modify: `apps/web/src/components/__tests__/InstallBanner.test.tsx`
- Modify: `apps/web/src/components/__tests__/OfflineBanner.test.tsx`
- Modify: `apps/web/src/components/__tests__/SafeStates.test.tsx`
- Create: `apps/web/src/components/__tests__/NavBar.test.tsx`
- Create: `apps/web/src/App.test.tsx`
- Read: `apps/web/src/App.tsx`, `apps/web/src/components/ResultDetailSheet.tsx`, `apps/web/src/styles/global.css`

**Interfaces:**
- Consumes: existing rendered components and reviewed `strings`.
- Produces: focused automated checks for semantic roles, keyboard/focus, safe states, capability denial and no-fetch default behavior.

- [ ] **Step 1: Add navigation and skip-link assertions**

Render the app, assert one `main#main-content` landmark, the skip-link label, three ordinary navigation buttons, and `aria-current="page"` on Search. Activate the skip link with a user event and assert `main#main-content` receives focus. Switch to Requests/Account and assert the same skip target remains available and no protected workflow appears.

- [ ] **Step 2: Add keyboard/detail-sheet assertions**

Extend the existing SearchScreen interaction coverage to assert visible focus on the result trigger, dialog focus on open, Tab wrapping from close to the first focusable element and Shift+Tab wrapping back, Escape/backdrop/close-button dismissal, and focus restoration to the triggering result.

- [ ] **Step 3: Add safe-state announcement assertions**

Assert exactly one meaningful live/alert region for loading, zero, offline and error states. Verify loading is polite, errors are alerts, safe text contains no stack/provider details, and state changes do not create duplicate announcements. Keep `BrowseEmptyState` non-diagnostic and do not make a no-result state imply unavailable everywhere.

- [ ] **Step 4: Add capability and default-network assertions**

Spy on `globalThis.fetch`, render and exercise the default SearchScreen, and assert the fixture search/detail flow makes no request. Assert InstallBanner mount does not invoke notification/location/file/storage APIs, and OfflineBanner reacts only to `online`/`offline` events. Do not set `VITE_MEDIFIND_SEARCH_MODE=worker` in default-mode tests.

- [ ] **Step 5: Add reduced-motion and target-test hooks where deterministic**

Prefer CSS/source assertions or stable class/attribute checks for `prefers-reduced-motion`, focus-visible styling, `min-height`/`min-width` token use and status icon/text pairing. Do not build a fragile pixel test in jsdom; reserve visual measurements for the manual browser matrix.

- [ ] **Step 6: Run focused tests and record initial failures**

Run: `pnpm --filter @medifind/web exec vitest run src/components/__tests__ src/App.test.tsx`

Expected: the existing suite passes or the new assertions identify specific defects to fix in the next task. Do not modify code before the failing behavior is named.

### Task 2: Fix only verified semantic, focus and safe-state defects

**Files:**
- Modify: existing components under `apps/web/src/components/` named by a failing test
- Modify: `apps/web/src/App.tsx` only if skip/navigation integration is the failing surface
- Modify: `apps/web/src/styles/global.css` only for a tested visual/accessibility defect
- Modify: focused tests from Task 1

**Interfaces:**
- Consumes: failing automated acceptance cases and current design/accessibility policies.
- Produces: minimal fixes with no new route, capability, data, storage or copy boundary.

- [ ] **Step 1: Fix the first failing essential-flow defect**

Work in this order: skip target/landmark, navigation semantics, search input/clear control, result-card keyboard access, detail dialog focus/close, loading/zero/error/offline announcement, then install/offline banner behavior. Change only the smallest named component/style rule.

- [ ] **Step 2: Preserve non-color status semantics**

For each availability, freshness, warning or error state, keep the visible plain-language label and icon/shape. Do not solve contrast by introducing a new hue or by removing the text label.

- [ ] **Step 3: Preserve capability fallbacks**

Install guidance must remain dismissible and optional; denial/absence of `beforeinstallprompt` must not block browsing. Offline mode must show the safe banner without pretending the static fixture app needs a connection. No permission prompt may be added.

- [ ] **Step 4: Re-run focused tests after each fix**

Run: `pnpm --filter @medifind/web exec vitest run src/components/__tests__ src/App.test.tsx`

Expected: PASS, with each regression tied to a named defect and no unrelated snapshot churn.

### Task 3: Verify responsive, scaling, reduced-motion and language expansion manually

**Files:**
- Create: `docs/evidence/2026-08-18-task-4-browser-pwa-acceptance.md`
- Modify: `apps/web/src/styles/global.css` only if a manual defect is reproduced
- Modify: focused component tests for every manual defect fixed

**Interfaces:**
- Consumes: production-style local build and the browser/device matrix.
- Produces: observed acceptance evidence with browser/version, viewport, OS assistive technology, language/copy condition, result and issue severity.

- [ ] **Step 1: Start the local static preview**

Build the default artifact with `VITE_MEDIFIND_SEARCH_MODE` unset, serve `apps/web/dist` through the documented local static-preview command, and record the exact commit/build command. Do not use a Worker proxy for default acceptance.

- [ ] **Step 2: Exercise the narrow mobile matrix**

Use an iPhone-width viewport and an Android-width viewport. Verify search input, selectors, cards, result count, load-more, banners, nav, detail sheet and close controls fit without horizontal scrolling or clipped text. Check portrait/landscape where available.

- [ ] **Step 3: Exercise the desktop matrix**

Use a desktop viewport at and above the 768px breakpoint. Verify two-column result layout, navigation order, dialog sizing/scrolling, visible focus, keyboard-only completion of search and detail journeys, and no DOM/focus order mismatch caused by CSS reflow.

- [ ] **Step 4: Exercise 200% scaling and text expansion**

Set browser text zoom to 200% and use long synthetic UI strings/translation-length stand-ins without changing the product copy. Verify controls remain reachable, banners wrap, dialog content scrolls, status labels remain adjacent to their meaning and no essential action is clipped.

- [ ] **Step 5: Exercise assistive technology and reduced motion**

Record actual results for desktop keyboard/screen reader, iPhone Safari VoiceOver and Android browser TalkBack where available. Verify landmarks, labels, dialog title, focus movement, live status changes, status icon/text pairing and no hidden duplicate announcements. Enable reduced-motion and verify no essential information depends on animation.

- [ ] **Step 6: Exercise offline and install capability paths**

Test initial load/refresh offline after the static shell is available, offline banner dismissal/reappearance, default fixture search without a network and install guidance with/without `beforeinstallprompt`. Verify no Worker response is cached by the service worker and install denial leaves the app usable.

- [ ] **Step 7: Record evidence without overstating it**

Write `docs/evidence/2026-08-18-task-4-browser-pwa-acceptance.md` with:

```text
commit/build:
browser/version:
OS/device or viewport:
assistive technology/language condition:
journey/state:
observed result:
severity/workaround/remediation:
evidence limitations:
```

Use `not run` or `not available` for any device/tool that was not actually tested. An essential-flow blocker prevents task acceptance.

### Task 4: Verify the PWA/static capability boundary

**Files:**
- Modify: `apps/web/__tests__/pages-preview.test.ts`
- Modify: `apps/web/src/__tests__/pwa-manifest.test.ts` only for a proven regression
- Modify: `apps/web/vite.config.ts` only for a proven service-worker precache/runtime-cache defect
- Modify: `apps/web/src/main.tsx` only for a proven registration defect
- Create: `apps/web/scripts/verify-preview-build.mjs` only if the existing tests cannot inspect the generated artifact
- Modify: `apps/web/package.json` only to expose the focused guard command

**Interfaces:**
- Consumes: default production-style build output, `public/_headers`, `public/robots.txt`, manifest, service worker and static asset list.
- Produces: repeatable local assertions that the Pages preview is synthetic/static and no Worker response is runtime-cached.

- [ ] **Step 1: Add generated-artifact assertions first**

Build with `VITE_MEDIFIND_SEARCH_MODE` unset and assert `dist/index.html`, `manifest.webmanifest`, service-worker output, icons, `_headers`/equivalent policy and `robots.txt` exist. Assert no `.env`, credential-looking artifact, account/binding ID, direct D1/R2/KV reference, Pages Function, API proxy, analytics, cookie or client persistence capability is emitted.

- [ ] **Step 2: Inspect service-worker routes/caches**

Assert the generated worker precaches only static shell assets and has no runtime route/cache for `/v1/` or Worker responses. Do not reject bundled but unused Worker adapter code; distinguish code presence from default execution.

- [ ] **Step 3: Add the explicit-worker negative build check**

Build with `VITE_MEDIFIND_SEARCH_MODE=worker` only as a synthetic development check. The guard must identify this as non-default and refuse to classify it as the Pages preview artifact. It must not contact Cloudflare.

- [ ] **Step 4: Run the focused preview/PWA guard**

Run: `pnpm --filter @medifind/web build`

Run the new guard/test command exactly as documented.

Expected: default artifact passes; explicit Worker-mode artifact is clearly rejected as the default preview; missing shell/policy/capability checks fail with a named reason.

### Task 5: Run full verification and hand off browser evidence

**Files:**
- Review only: changed files from Tasks 1-4
- Evidence: `docs/evidence/2026-08-18-task-4-browser-pwa-acceptance.md`

- [ ] **Step 1: Run repository checks**

Run: `pnpm run format:check`

Run: `pnpm lint`

Run: `pnpm typecheck`

Run: `pnpm test`

Run: `pnpm build`

Run: `pnpm run security:secrets`

Run: `pnpm run audit`

Run: `pnpm run security:trivy`

Report an exact Trivy database failure if it cannot complete; do not claim a clean scan without output.

- [ ] **Step 2: Review scope and capability boundaries**

Confirm the diff contains no new service, route, permission, storage, analytics, cookie, map/contact action, protected workflow or product copy beyond existing reviewed strings. Confirm default fixture mode remains network-free and no Worker response is cached.

- [ ] **Step 3: Commit only Task 4 scope**

```bash
git add apps/web/src apps/web/__tests__ apps/web/public apps/web/vite.config.ts apps/web/package.json docs/evidence/2026-08-18-task-4-browser-pwa-acceptance.md
git commit -m "fix: harden synthetic search browser acceptance"
```

- [ ] **Step 4: Return the acceptance report**

Report the commit, exact focused/full commands and results, browser/device/viewport/assistive-technology matrix, observed limitations, unresolved issue severity/workaround/release gate, synthetic-only status, security/privacy/cost impact and rollback path. Do not claim formal WCAG certification, hosted Pages evidence or device coverage that was not run.
