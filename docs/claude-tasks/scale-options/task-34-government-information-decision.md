# Task 34: Government-information decision

## Goal

Decide whether MediFind should publish carefully bounded, non-clinical
government-program information, while never making eligibility, entitlement,
dispensing or treatment decisions.

## Gate

Requires Tasks 24 and 26, named Fiji legal/content reviewers, a source-owner
and update process, accessibility/language review, and explicit founder
approval of the public-information purpose. No program information is added by
this brief.

## Read first

- [Product brief](../../product-brief.md)
- [Requirements](../../requirements.md)
- [Experience and content](../../experience-and-content.md)
- [Public support presence](../../public-support-presence.md)
- [Data and search](../../data-and-search.md)

## Scope

- Define permissible information categories such as official program name,
  published contact route, source date and official link where verified.
- Define source provenance, review cadence, change/withdrawal, translation,
  accessibility, stale-content and correction controls.
- State the boundary between information and an eligibility or benefits
  determination; route users to the official authority where appropriate.
- Evaluate static public-support content versus authenticated application
  content and choose the lower-risk boundary.
- Produce a decision packet and a separate content implementation brief only
  if approved.

## Out of scope

Eligibility screening, application submission, government account access,
medical advice, medicine substitution, claims about entitlement, scraped
content, unverified links, personalized recommendations and analytics.

## Acceptance

- Every proposed statement has an accountable source, review/expiry date,
  language/accessibility owner and correction path.
- Stale or withdrawn information is clearly marked or removed without hiding
  the official source boundary.
- The design collects no health, identity, financial or eligibility data.
- The recommendation clearly states whether the feature should remain static
  and public or not proceed.

## Verification and handoff

Run document/link checks, content-key completeness checks and synthetic stale-
source scenarios. Attach legal/content review requirements and unresolved
provenance risks. Commit:
`docs: evaluate bounded government information support`

Implementation plan: [Task 34 bounded government information decision plan](../../superpowers/plans/2026-08-18-task-34-government-information-decision-implementation.md)
