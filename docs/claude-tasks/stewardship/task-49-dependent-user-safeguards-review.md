# Task 49: Child, dependent and vulnerable-user safeguards review

## Goal

Review the adult-account-for-child/dependent boundary so data minimization,
authority, language, safety messaging and pharmacy handoff remain explicit
without silently creating minor accounts or unsupported consent flows.

Prepared implementation plan: [Task 49 child, dependent and vulnerable-user safeguards review](../../superpowers/plans/2026-08-18-task-49-dependent-user-safeguards-review-implementation.md).

## Gate

Requires accepted Tasks 39, 45, 47 and 48, current Fiji legal/privacy/
pharmacy review, named product/privacy and pharmacy reviewers, a confirmed
data-field inventory and synthetic dependent scenarios.

## Read first

- [Functional requirements and journeys](../../requirements.md)
- [Privacy and security compliance](../../security-privacy-compliance.md)
- [Data dictionary and ownership](../../data-dictionary-and-ownership.md)
- [Experience and content](../../experience-and-content.md)
- [Pharmacy professional oversight](task-48-pharmacy-professional-oversight-review.md)
- [Privacy rights and retention](task-39-privacy-rights-retention-governance.md)
- [Consumer safety and marketplace integrity](task-47-consumer-safety-marketplace-integrity-review.md)

## Scope

- Reconfirm the adult account self-attestation, child/dependent relationship
  choices, patient legal-name field and no-reusable-dependent-profile rule.
- Map what the buyer, selected verified pharmacy, support/admin and audit
  records may receive, retain, display, export, delete or exclude.
- Review authority/uncertainty handling, age-appropriate and multilingual
  explanations, non-clinical boundaries, accessibility and safe errors without
  collecting date of birth, government ID or medical history unless separately
  required by approved Fiji legal advice.
- Rehearse synthetic self, child, dependent, unclear-authority, correction,
  deletion, pharmacy suspension, prescription routing and support scenarios.
- Record whether the current boundary remains acceptable, needs a separate
  legal/product decision, or requires the affected workflow to pause.

## Out of scope

Minor accounts, parental-consent tooling, identity/age verification provider,
biometric or government-ID collection, reusable dependent profiles, clinical
decision-making, new patient data fields, real dependent onboarding or public
claims about legal compliance.

## Acceptance

- Each dependent-related field and state has purpose, owner, recipient,
  classification, retention/deletion behavior, access rule, language/content
  review and stop condition.
- The selected pharmacy receives only the approved minimum data; unrelated
  profile/contact data, search history and dependent records are not exposed.
- Unclear authority, correction/deletion conflict, pharmacy suspension or
  unsafe request fails safely and escalates without enumeration or rerouting.
- Synthetic evidence proves branch isolation, audit redaction, accessibility,
  multilingual copy and no dependent data in generic notifications/analytics.
- The result does not approve a minor-account or consent product and does not
  make a legal or clinical determination.

## Verification and handoff

Run document/link checks, data-field/privacy matrix checks, locale/accessibility
checks and approved synthetic dependent scenarios. Attach redacted findings and
decision options. Commit:
`chore: review dependent user safeguards`
