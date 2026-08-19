# Task 41: Accessibility and localization maintenance

## Goal

Make accessibility and English/iTaukei/Fiji Hindi review a recurring release
discipline instead of a one-time pilot checklist.

Prepared implementation plan: [Task 41 accessibility and localization maintenance](../../superpowers/plans/2026-08-18-task-41-accessibility-localization-maintenance-implementation.md).

## Gate

Requires Task 24, Task 30, Task 36, named language/accessibility reviewers,
representative devices/networks and a decision on the supported release
surface. This task does not claim WCAG certification.

## Read first

- [Accessibility policy](../../accessibility-policy.md)
- [Experience and content](../../experience-and-content.md)
- [Dynamic pharmacy content policy](../../dynamic-pharmacy-content-policy.md)
- [Design-review acceptance checklist](../../design-review-acceptance-checklist.md)
- [Performance and reliability targets](../../performance-and-reliability-targets.md)

## Scope

- Define a per-release matrix covering changed buyer, pharmacy, admin and
  public-support journeys across iPhone Safari VoiceOver, Android TalkBack and
  desktop keyboard/screen-reader use.
- Track 200% text scaling, contrast, focus/order, touch targets, reduced motion,
  offline/stale/error/security states and text expansion in all supported
  languages.
- Maintain translation-key completeness, reviewer/version evidence and safe
  fallback rules; keep medicine identity and pharmacy-authored notes in their
  approved language boundary.
- Define defect severity, release-blocker rules, exception approval, retest
  owner and trend review without claiming formal certification.

## Out of scope

Machine translation, unreviewed safety copy, automatic dark-mode redesign,
custom accessibility claims, user profiling, new design-system rules and
language-dependent medicine identity changes.

## Acceptance

- Every release candidate has an evidence matrix with device, browser,
  language, journey, issue, severity, owner and result.
- Essential-journey blockers stop release; exceptions are documented with
  impact, workaround, approver and remediation date.
- Automated checks and manual assistive-technology checks cover all changed
  critical states and public-support pages.
- Dynamic pharmacy notes remain attributed, language-labelled, un-translated
  and accessible.

## Verification and handoff

Run repository checks plus the defined browser/accessibility and locale
matrix. Attach screenshots/logs only when they contain no protected data.
Commit:
`chore: establish recurring accessibility and localization review`
