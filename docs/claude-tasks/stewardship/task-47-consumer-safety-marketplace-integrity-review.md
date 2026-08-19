# Task 47: Consumer safety and marketplace-integrity review

## Goal

Regularly verify that MediFind's buyer-facing claims, pharmacy-authored
content, search presentation and operational states remain accurate,
non-clinical, non-misleading and consistent with verified-pharmacy boundaries.

Prepared implementation plan: [Task 47 consumer safety and marketplace-integrity review](../../superpowers/plans/2026-08-18-task-47-consumer-safety-marketplace-integrity-review-implementation.md).

## Gate

Requires accepted Tasks 23, 24, 30, 36, 39, 41 and 45, a named Fiji
pharmacy/safety reviewer, a redacted pilot feedback sample or synthetic
reproduction, current content versions and a founder/release-owner review.

## Read first

- [Functional requirements and journeys](../../requirements.md)
- [Experience and content](../../experience-and-content.md)
- [Dynamic pharmacy content policy](../../dynamic-pharmacy-content-policy.md)
- [Data and search](../../data-and-search.md)
- [Incident response](../../incident-response-runbook.md)
- [Catalog curation and search quality](../post-pilot/task-23-catalog-curation-search-quality.md)
- [Multilingual system content](../post-pilot/task-24-multilingual-system-content.md)
- [Annual public-readiness review](task-45-annual-public-readiness-review.md)

## Scope

- Review search/result/detail/reservation/prescription and support copy for
  claims about availability, price, freshness, guarantees, dispensing,
  substitutes, medical advice, urgency, pharmacy verification and safety.
- Review pharmacy-authored notes for attribution, language labels, plain-text
  limits, non-clinical purpose, prohibited content and branch scope.
- Review exact-product identity, active-ingredient labels, stale/unavailable
  states, prescription-required boundaries, price changes, expiry and safe
  error/fallback states across English, iTaukei and Fiji Hindi.
- Classify complaints or synthetic findings, assign owner/severity/remediation
  and verify that no reporter identity, raw health content or prescription
  detail enters search, analytics, public accusations or generic errors.
- Recommend continue, correct, restrict, pause or request a decision change;
  do not silently change clinical, legal, ranking or pharmacy policy.

## Out of scope

Clinical advice or medicine substitution, public ratings/reviews, paid or
sponsored ranking, automatic content rewriting/translation, external catalog
imports, a new moderation provider, profiling, public complaint publication,
legal conclusions or activation of a new capability.

## Acceptance

- Each reviewed surface has current copy/version, language/reviewer evidence,
  safety boundary, source policy and release status.
- Critical misleading, unsafe, unauthorized, untranslated safety/legal or
  privacy-disclosing content blocks the affected surface until corrected and
  retested.
- Pharmacy-authored text remains attributable, entered-language and
  non-clinical; medicine identity is not silently normalized into a substitute.
- Findings use synthetic or redacted evidence and preserve anti-enumeration,
  branch isolation, audit redaction and accessibility requirements.
- The output is a recommendation and remediation register, not a public launch
  approval or a professional/legal certification.

## Verification and handoff

Run document/link checks, locale/content-key checks, sanitization and
accessibility checks, plus approved synthetic review journeys. Attach the
redacted finding and retest register. Commit:
`chore: review consumer safety and marketplace integrity`
