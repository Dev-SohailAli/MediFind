# Task 14: Implement scoped support reports and admin audit views

## Gate

Requires Task 7 support/retention decision, Task 8 identity and break-glass
rules, and the approved audit visibility matrix. This task must not create a
general chat, arbitrary free-text support inbox or routine prescription
content access.

See the [Task 14 implementation plan](../../superpowers/plans/2026-08-18-task-14-support-reports-admin-audit-implementation.md) for the structured-field gate, least-privilege audit views, break-glass controls and redaction/accessibility tests.

## Goal

Provide safe buyer listing reports, pharmacy operational support cases and
MediFind admin moderation/audit views with least-privilege access and generic
buyer-facing confirmations.

## Required behavior

- Buyers can report an inaccurate, expired, misleading or unavailable listing
  without seeing a public accusation or another reporter's identity.
- Pharmacy support cases collect only approved minimum structured fields and
  must not invite prescription attachments.
- Admin moderation can suspend or correct public listing eligibility without
  changing pharmacy-owned price, availability or clinical decisions.
- Audit views expose only the actor's permitted scope; prescription content is
  excluded from routine admin views. Break-glass access is time-limited,
  reasoned, auditable and subject to the approved buyer-notice rule.
- All confirmations, errors and notifications use safe translated templates;
  raw free text, health data, contact data and internal IDs stay out of logs.

## Acceptance

Cover duplicate reports, rate limits, cross-pharmacy access, admin role limits,
break-glass expiry, redaction, deletion/retention, safe confirmation and
offline behavior. Include accessibility checks for form labels, validation,
focus and error announcement.

Commit: `feat: add scoped support reports and admin audit views`
