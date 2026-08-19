# Task 24: Multilingual system content and pharmacy-note governance

## Goal

Make system-controlled safety, status, consent, support and error content
reviewable in English, iTaukei and Fiji Hindi, while keeping pharmacy-authored
operational notes attributed, language-labelled and untranslated.

## Gate

Requires accepted Task 22 browser/accessibility evidence, named professional
reviewers or an approved translation workflow, and a decision on which content
is safety/legal-critical. Do not ship machine-translated safety wording.

## Read first

- [Experience and content](../../experience-and-content.md)
- [Dynamic pharmacy content policy](../../dynamic-pharmacy-content-policy.md)
- [Accessibility policy](../../accessibility-policy.md)
- [API error contract](../../api-error-contract.md)
- [Design system and screens](../../design-system-and-screens.md)

## Scope

- Inventory user-facing strings and classify system-controlled versus
  pharmacy-authored text.
- Add translation keys, locale completeness checks, safe fallback behaviour,
  text-expansion coverage and a visible language-selection path.
- Version reviewed safety/status/consent/error templates and record reviewer
  evidence without putting private correspondence in source or logs.
- Implement or verify plain-text note limits, escaping, prohibited-link/contact
  checks, attribution, language labels, screen-reader announcements and
  moderation states.
- Ensure generic notifications, analytics and errors never include pharmacy
  note text or medicine/prescription details.

## Out of scope

Machine translation, translation of medicine identity or clinical instructions,
arbitrary HTML/Markdown, dynamic links, marketing copy, chat, public reviews
and new notification providers.

## Acceptance

- Every changed buyer, staff and admin state has reviewed keys in all three
  supported languages or a documented release-blocking gap.
- Missing or failed translations fall back to safe reviewed content and are
  observable without exposing user text.
- Dynamic notes are visibly attributed and language-labelled; they are never
  silently translated or promoted in ranking.
- Accessibility tests cover 200% text scaling, wrapping, keyboard focus and
  screen-reader announcement of attribution/language.

## Verification and handoff

Run repository quality checks plus locale, sanitisation, accessibility and
notification-redaction tests. Attach the translation review matrix and list
any unresolved language gaps. Commit:
`feat: govern reviewed multilingual system content`

Implementation plan: [Task 24 multilingual system content and pharmacy-note governance plan](../../superpowers/plans/2026-08-18-task-24-multilingual-system-content-implementation.md)
