# Task 4 browser/PWA acceptance evidence

Format per the implementation plan (`docs/superpowers/plans/2026-08-18-task-4-browser-pwa-acceptance-implementation.md`, Task 3 Step 7):

```
commit/build:
browser/version:
OS/device or viewport:
assistive technology/language condition:
journey/state:
observed result:
severity/workaround/remediation:
evidence limitations:
```

## Tooling reality check (read first)

This task was executed by an autonomous coding agent with **no installed
browser-automation tool** (no Playwright/Puppeteer/Cypress in this repo) and
**no real browser, mobile device, screen reader or OS zoom setting available**
to the agent. Per the task instructions, every row below that could not
actually be exercised is marked `not run` / `not available` with the reason,
rather than fabricated. Rows marked "REAL" were genuinely executed by this
agent (a local static build + local HTTP server + curl + jsdom/Testing
Library automated assertions); rows marked `not run` were not executed by
anyone in this session and carry no claim of pass/fail.

The strongest real evidence for keyboard, focus, ARIA/live-region, and
capability-denial behaviour is the automated Testing Library suite added in
Task 1 of this plan (`apps/web/src/App.test.tsx`,
`apps/web/src/components/__tests__/NavBar.test.tsx`,
`apps/web/src/components/__tests__/SearchScreen.test.tsx`,
`apps/web/src/components/__tests__/SafeStates.test.tsx`,
`apps/web/src/components/__tests__/InstallBanner.test.tsx`,
`apps/web/src/components/__tests__/OfflineBanner.test.tsx`), which exercises
real DOM roles, ARIA attributes, `document.activeElement` focus assignment,
and real keyboard event dispatch (Tab/Shift+Tab/Escape) through jsdom — not a
visual rendering engine, but not a mock either. Those results are cited below
instead of claiming manual coverage that was not run.

---

### Entry 1 — build and local static serve (REAL)

```
commit/build: 93b5b96 ("fix: validate public worker response contracts"), built via
  `pnpm exec vite build --outDir dist` in apps/web with VITE_MEDIFIND_SEARCH_MODE unset
browser/version: n/a (HTTP client only — curl, no browser engine)
OS/device or viewport: n/a — server-side artifact check only
assistive technology/language condition: n/a
journey/state: local static preview boot — `pnpm exec vite preview --port 4173` serving apps/web/dist
observed result: `GET /` returns HTTP 200 with the built index.html (noindex meta tag present,
  correct title/description, references /assets/index-*.js and /assets/index-*.css).
  `GET /manifest.webmanifest`, `/sw.js`, `/icons/icon-192.png`, `/icons/icon-maskable-512.png`
  each return HTTP 200. This confirms the built static shell is servable and self-contained.
severity/workaround/remediation: none — passed
evidence limitations: `vite preview` is a plain static file server; it does not apply the
  Cloudflare Pages `_headers` response header (that file's content is verified separately by
  apps/web/__tests__/pages-preview.test.ts as a source/build artifact, not via a live header
  check, since there is no Pages environment available to this agent).
```

### Entry 2 — narrow mobile viewport matrix (NOT RUN)

```
commit/build: 93b5b96
browser/version: not available — no real browser instance accessible to this agent
OS/device or viewport: iPhone-width and Android-width viewports — not available
assistive technology/language condition: n/a
journey/state: search input/selectors/cards/result count/load-more/banners/nav/detail sheet/close
  controls fitting without horizontal scroll or clipped text, portrait/landscape
observed result: not run — no browser or device emulator was available to this agent to resize
  a viewport and visually inspect layout/reflow
severity/workaround/remediation: not applicable — not run
evidence limitations: the responsive CSS itself was inspected at the source level (see
  apps/web/src/styles/global.css breakpoints at 768px, and
  apps/web/src/theme/__tests__/tokens.test.ts asserting the 48px min-target token and spacing
  scale are wired into the stylesheet); this is a structural check, not a rendered-layout
  observation, and cannot substitute for an actual narrow-viewport visual pass
```

### Entry 3 — desktop viewport matrix (NOT RUN, partially superseded by automated tests)

```
commit/build: 93b5b96
browser/version: not available
OS/device or viewport: desktop viewport at/above 768px — not available (no real browser)
assistive technology/language condition: n/a
journey/state: two-column result layout, navigation order, dialog sizing/scrolling, visible
  focus, keyboard-only completion of search and detail journeys, no DOM/focus-order mismatch
  from CSS reflow
observed result: visual two-column layout and CSS reflow — not run (no rendering engine).
  Keyboard-only completion of the search and detail journeys IS covered by real jsdom/Testing
  Library keyboard-event assertions (Tab, Shift+Tab, Escape, click-to-open, focus-return) in
  apps/web/src/components/__tests__/SearchScreen.test.tsx — see the "moves focus into the
  dialog on open and traps Tab/Shift+Tab within it" and "closing the detail dialog removes it
  and returns focus to the trigger" tests, both passing. DOM/focus order (source order matching
  visual order) is a static property of the single unconditional DOM tree App.tsx renders (no
  CSS `order` is used to reposition focusable content ahead of its DOM predecessor at desktop
  width — see the code comment in apps/web/src/styles/global.css above `.nav__tab` at the
  768px breakpoint explaining the nav intentionally does NOT reorder via CSS at desktop width
  for exactly this WCAG 1.3.2 reason), so no live reflow check was necessary to establish it,
  but no agent visually confirmed the rendered two-column grid or dialog scroll behaviour.
severity/workaround/remediation: not applicable to the not-run parts
evidence limitations: jsdom performs no layout/paint; it cannot confirm actual two-column
  grid rendering, dialog max-height/scroll behaviour, or visual desktop navigation order
```

### Entry 4 — 200% text scaling and text expansion (NOT RUN)

```
commit/build: 93b5b96
browser/version: not available — no real browser to set text zoom
OS/device or viewport: n/a
assistive technology/language condition: 200% browser text zoom; long/expanded synthetic
  UI-string stand-ins
journey/state: controls remaining reachable, banners wrapping, dialog content scrolling, status
  labels staying adjacent to their meaning, no essential action clipped
observed result: not run
severity/workaround/remediation: not applicable — not run
evidence limitations: no browser zoom capability or visual regression tool is available to this
  agent. The stylesheet uses relative rem/token-based sizing and flex-wrap on banners/status
  rows (apps/web/src/styles/global.css `.top-banner`, `.result-card__status-row`,
  `.detail-sheet__status-row` all set `flex-wrap: wrap`), which is source-level evidence
  consistent with text-reflow tolerance, but this was not verified by an actual 200%-zoom
  rendering pass
```

### Entry 5 — assistive technology: desktop keyboard/screen reader (PARTIAL — automated only)

```
commit/build: 93b5b96
browser/version: not available — no real desktop browser+screen-reader combination running
OS/device or viewport: n/a
assistive technology/language condition: desktop keyboard + screen reader combination
journey/state: landmarks, labels, dialog title, focus movement, live status changes, status
  icon/text pairing, no hidden duplicate announcements
observed result: not run as an actual assistive-technology session. The accessible-name/role
  tree that a screen reader would consume WAS verified programmatically via jsdom/Testing
  Library, which is a real (if partial) proxy for what an accessibility tree exposes:
  - exactly one `main#main-content` landmark (apps/web/src/App.test.tsx)
  - one `nav[aria-label="Primary"]` with three ordinary buttons, `aria-current="page"` on the
    active tab only (apps/web/src/components/__tests__/NavBar.test.tsx)
  - skip link moves DOM focus to `main#main-content` (apps/web/src/App.test.tsx)
  - detail dialog has `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at a
    real `<h2>` title, and moves focus onto itself when opened
    (apps/web/src/components/__tests__/SearchScreen.test.tsx)
  - loading/zero-result states use `role="status"`/`aria-live="polite"`, errors use
    `role="alert"`; each state exposes exactly one such region, never two simultaneously
    (apps/web/src/components/__tests__/SafeStates.test.tsx)
  - every result card's accessible name (`aria-label`) includes the plain-language
    availability word (e.g. "In stock"), not colour alone
    (apps/web/src/components/__tests__/SearchScreen.test.tsx)
severity/workaround/remediation: not applicable to the not-run parts; no blocker found in the
  accessible-name/role/focus assertions that were run
evidence limitations: a real screen reader also exercises speech-output phrasing, verbosity
  settings, and browser/AT-specific quirks (e.g. how a specific screen reader announces
  `aria-live="polite"` regions during rapid state changes) that a jsdom accessible-tree
  assertion cannot reproduce. This is real evidence for the underlying markup contract, not
  a substitute for an actual AT listening pass.
```

### Entry 6 — iPhone Safari VoiceOver (NOT AVAILABLE)

```
commit/build: 93b5b96
browser/version: not available — no iPhone/Safari/VoiceOver device or simulator accessible to
  this agent
OS/device or viewport: iPhone, iOS Safari, VoiceOver
assistive technology/language condition: VoiceOver screen reader
journey/state: full changed-flow journey (search, results, detail dialog, install/offline
  banners)
observed result: not available
severity/workaround/remediation: not applicable — not available
evidence limitations: this agent has no macOS/iOS device or Safari instance; VoiceOver evidence
  cannot be produced in this environment under any circumstance
```

### Entry 7 — Android browser TalkBack (NOT AVAILABLE)

```
commit/build: 93b5b96
browser/version: not available — no Android device/emulator or TalkBack accessible to this
  agent
OS/device or viewport: Android, Chrome, TalkBack
assistive technology/language condition: TalkBack screen reader
journey/state: full changed-flow journey (search, results, detail dialog, install/offline
  banners)
observed result: not available
severity/workaround/remediation: not applicable — not available
evidence limitations: this agent has no Android device/emulator or TalkBack accessible; this
  evidence cannot be produced in this environment under any circumstance
```

### Entry 8 — reduced motion (PARTIAL — source-level only)

```
commit/build: 93b5b96
browser/version: not available for a live prefers-reduced-motion emulation/visual check
OS/device or viewport: n/a
assistive technology/language condition: OS/browser "reduce motion" preference enabled
journey/state: no essential information depends on animation
observed result: source-level only. apps/web/src/styles/global.css defines
  `@media (prefers-reduced-motion: reduce)` collapsing `animation-duration`,
  `animation-iteration-count` and `transition-duration` globally (`*` selector) to near-zero,
  without hiding or removing any content (`display:none`/`visibility:hidden` do not appear in
  that block) — verified by an added automated test in
  apps/web/src/components/__tests__/SearchScreen.test.tsx ("respects prefers-reduced-motion by
  collapsing animation/transition duration, not by hiding content"). No essential UI in this
  app (search, results, detail dialog, banners) is animation-only or timed; all state changes
  are also expressed as static text/DOM changes.
severity/workaround/remediation: none found — passed at the source level
evidence limitations: no live rendering engine was used to actually toggle the OS/browser
  reduced-motion preference and observe motion suppression in real time
```

### Entry 9 — offline load/refresh and install capability paths (PARTIAL — automated + source-level)

```
commit/build: 93b5b96
browser/version: not available for a live network-toggle/offline-reload test
OS/device or viewport: n/a
assistive technology/language condition: n/a
journey/state: initial load/refresh offline after the static shell is cached; offline banner
  dismissal/reappearance; default fixture search without a network; install guidance with/
  without `beforeinstallprompt`; no Worker response cached by the service worker; install
  denial leaves the app usable
observed result:
  - Offline banner dismissal/reappearance and its reaction to `online`/`offline` events only
    (never to an unrelated event, and never a `fetch` call to probe connectivity) is REAL,
    passing jsdom coverage: apps/web/src/components/__tests__/OfflineBanner.test.tsx.
  - Default fixture search making zero `fetch` calls is REAL, passing jsdom coverage:
    apps/web/src/components/__tests__/SearchScreen.test.tsx ("never calls fetch in the default
    fixture-backed mode").
  - Install guidance rendering without a captured `beforeinstallprompt` (no install button,
    only dismiss), and never invoking Notification/geolocation/localStorage APIs on mount, is
    REAL, passing jsdom coverage: apps/web/src/components/__tests__/InstallBanner.test.tsx.
  - The service worker precaching only the static shell and registering no runtime route for
    `/v1/` or any API response is REAL, verified against the actual built `sw.js` output (not
    a mock) by a build-and-inspect test added in apps/web/__tests__/pages-preview.test.ts,
    which built the real default artifact in a temp directory and parsed its generated
    `workbox.precacheAndRoute([...])` call and `registerRoute(...)` calls.
  - An actual "go offline in a real browser tab, reload, confirm the app still boots from the
    installed service worker cache" pass — not run; no browser/network-toggle tooling is
    available to this agent.
severity/workaround/remediation: none found in the parts that were run
evidence limitations: the real end-to-end "install to Home Screen, then physically disconnect
  network, then relaunch" flow was not exercised; this requires a real device/browser and is
  explicitly out of reach for this agent
```

### Entry 10 — PWA/static capability boundary: explicit Worker-mode build (REAL)

```
commit/build: 93b5b96, plus two synthetic local builds performed by
  apps/web/__tests__/pages-preview.test.ts during `pnpm test`: one with
  VITE_MEDIFIND_SEARCH_MODE unset (the default/Pages-preview artifact) and one with it set to
  "worker" (an explicit local development check only)
browser/version: n/a — build/static-analysis check, no browser involved
OS/device or viewport: n/a
assistive technology/language condition: n/a
journey/state: confirm the default build is the only artifact ever classified as the Pages
  preview artifact, and that the worker-mode build never contacts Cloudflare and is never
  treated as the default
observed result: PASS — both synthetic builds complete locally (no wrangler invocation, no
  Cloudflare credential/env var supplied to either child process, so neither could contact
  Cloudflare); the default-artifact assertions (required files, no secret/binding/analytics
  pattern, sw.js precaches only static-shell assets, no `/v1/` runtime cache route) all run
  exclusively against the unset-env build; a separate, explicit classification rule
  (`isDefaultPreviewArtifact`) confirms the worker-mode build is never treated as the default.
severity/workaround/remediation: none — passed
evidence limitations: none for this entry — this check was fully and directly executed by
  this agent as part of the automated test suite
```

## Summary

- **Real evidence produced by this agent**: local static build + local HTTP serve + curl
  checks (Entry 1); the full automated jsdom/Testing Library suite backing the accessible-name/
  role/focus/live-region/capability-denial claims referenced in Entries 5, 8, 9; and the
  build-and-inspect PWA/static boundary guard (Entry 10).
- **Not run / not available**: every row requiring an actual browser viewport resize, real
  200% OS/browser zoom, a live network offline toggle in a browser tab, iPhone Safari
  VoiceOver, Android TalkBack, or a genuine `beforeinstallprompt` capture (Entries 2, 3
  partially, 4, 6, 7, and the live-offline-reload half of Entry 9). No agent fabricated a
  result for any of these; each is recorded as `not run` / `not available` with the specific
  reason, per the task instructions.
- **No essential-flow blocker was found** in anything that was actually run. The unresolved
  gap is coverage, not a known defect: the narrow-mobile, desktop-reflow, 200%-zoom, and real
  AT rows require tooling (a browser engine, real devices, VoiceOver/TalkBack) that does not
  exist in this agent's environment, and must be completed by a human or a browser-automation
  toolchain before this can be treated as a release-grade accessibility sign-off rather than
  a component-level one.
