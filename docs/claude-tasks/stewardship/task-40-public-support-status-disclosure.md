# Task 40: Public support, status and disclosure operations

## Goal

Maintain a safe, accessible, multilingual public support/legal/status presence
and responsible-disclosure process as MediFind's operator, domain or cohort
changes.

## Gate

Requires Tasks 30, 36 and 37, an approved operator identity/contact, named
support and security owners, reviewed translations and an explicit release
decision for any external publishing. A brief cannot activate the public site.

## Read first

- [Public support presence](../../public-support-presence.md)
- [Public notice and legal identity](../../public-notice-and-legal-identity.md)
- [Accessibility policy](../../accessibility-policy.md)
- [Incident response runbook](../../incident-response-runbook.md)
- [Repository security and delivery](../../repository-security-and-delivery.md)

## Scope

- Define versioned publishing, approval, rollback and review cadence for home,
  privacy, terms, support, status, security-reporting and `security.txt` pages.
- Maintain support hours, non-emergency/clinical boundary, anti-phishing copy,
  official contacts, status update categories and safe outage wording.
- Rehearse responsible-disclosure intake, one-business-day acknowledgement,
  confidential triage, escalation and publication decisions without attacker
  content or private data.
- Verify static-site restrictions: no forms, cookies, analytics, identity,
  application proxy, prescription access or sensitive operational detail.

## Out of scope

Public chat, WhatsApp support, medical advice, public incident forensics,
account workflows, forms, support SaaS, advertising and a public release by
documentation alone.

## Acceptance

- Every public page has an owner, version, translation/accessibility evidence,
  source date, rollback artifact and next review date.
- Status/disclosure operations expose only safe information and route users to
  verified channels; no credentials, OTPs or prescription files are requested.
- Synthetic outage, disclosure and impersonation scenarios produce the correct
  escalation and redaction behaviour.
- Static deployment inspection proves prohibited requests/capabilities are
  absent before any external activation decision.

## Verification and handoff

Run quality checks, static-site request inspection, keyboard/screen-reader
checks and synthetic disclosure/outage rehearsals. Record exact commit and
environment; do not claim external publication unless it ran. Commit:
`docs: govern public support and disclosure operations`

Implementation plan: [Task 40 public support, status and disclosure operations plan](../../superpowers/plans/2026-08-18-task-40-public-support-status-disclosure-implementation.md)
