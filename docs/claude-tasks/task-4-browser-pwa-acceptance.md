# Task 4: Harden browser accessibility and PWA acceptance

## Goal

Make the existing synthetic buyer search flow withstand the documented browser
acceptance gate at desktop and narrow mobile sizes without adding product
workflows or new services.

## Authority and exact scope

Read `docs/accessibility-policy.md`, `docs/design-system-and-screens.md`,
`docs/design-proposals/2026-08-17-organic-visual-system.md`,
`docs/web-platform-capabilities-policy.md`, and
`docs/test-and-acceptance-strategy.md`. Use the existing organic tokens and
Lucide icons; do not invent new colours, fonts, routes or actions.

Allowed files:

- Existing `apps/web/src/components/*` search, navigation, install and safe
  state components.
- `apps/web/src/styles/global.css`.
- Focused web tests and PWA/Pages preview tests.
- Documentation evidence under `docs/` only for observed results.

## Required checks and likely fixes

- Verify keyboard navigation, skip link, tab order, Escape handling, dialog
  focus return, visible focus, 48px targets and backdrop/close semantics.
- Verify search loading, zero, offline, unavailable and error states announce
  the meaningful status without duplicate live regions.
- Verify 200% browser text scaling, narrow iPhone-width layout, wide desktop
  layout, translated-text expansion tolerance, reduced-motion behavior and
  no colour-only status meaning.
- Verify install guidance is capability-driven, dismissible and does not
  request permissions or storage unnecessarily.
- Verify the service worker precaches only the static shell and does not
  runtime-cache Worker responses.

## Procedure

- [ ] Add or strengthen focused tests for every defect found in the existing
  implementation.
- [ ] Use the in-app browser at desktop and mobile viewport sizes for manual
  acceptance; record only observed results.
- [ ] Fix the smallest component/style issue for each failing case.
- [ ] Re-run focused tests and the full quality suite.
- [ ] Record browser, viewport, keyboard/screen-reader and offline evidence in
  the task report.

## Acceptance

- Search, result cards, detail sheet, navigation, install banner and offline
  banner meet the WCAG 2.2 AA target for the changed flow.
- No runtime network call exists in default fixture mode.
- No new browser capability, analytics, cookie, storage, map, contact or
  protected workflow is introduced.
- Any unresolved issue has a severity, workaround and explicit release gate;
  an essential-flow blocker stops the task.

Commit: `fix: harden synthetic search browser acceptance`

For the exact automated/manual acceptance matrix and evidence format, use the
[Task 4 implementation plan](../superpowers/plans/2026-08-18-task-4-browser-pwa-acceptance-implementation.md).
