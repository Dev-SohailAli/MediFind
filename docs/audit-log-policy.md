# Audit-log policy

## Purpose

Audit logs provide accountable, append-only evidence for security, operational and compliance-relevant actions. They are not an event dump, analytics store or secondary prescription record. Retention remains subject to the Fiji legal/pharmacy-approved schedule.

## Required event structure

Each auditable event contains only the minimum necessary structured fields:

- immutable event ID and server timestamp;
- actor type, opaque actor ID and effective role/branch context;
- action name and opaque target type/ID;
- request/correlation ID and source/application context needed for investigation;
- safe before/after state or state-transition reference, excluding sensitive content;
- required operational reason/category, approval/reference or incident link; and
- integrity/version metadata needed to detect or investigate tampering.

Never record prescription/document content, file bytes/URLs, OTPs, access/refresh tokens, passwords, authenticator secrets, full phone/email values, raw search text, unnecessary device identifiers or support free text. Use protected references/pseudonymous IDs where an investigation needs correlation.

## Mandatory audit events

- sign-in, recovery, contact change, session/device grant/revocation and privileged MFA enrollment/reset;
- pharmacy verification, activation/suspension, ownership/contact changes and staff-role changes;
- listing create/update/refresh, canonical-identity moderation, public visibility and buyer quality-report handling;
- prescription submit, technical classification, view/download grant/use, status decision, expiry/cancel and break-glass request/access;
- reservation state/price/pickup/expiry/collection/cancellation changes;
- support/security case creation and material action;
- API authorization denial/anomaly signals where safe to record; and
- feature flag, kill switch, production configuration or exceptional access changes.

## Visibility and immutability

- Buyers see only their own user-facing request/reservation status history, not internal security/audit metadata.
- A pharmacy owner may view branch-scoped staff-access, listing and reservation audit history needed to operate its branch. It cannot view another branch/pharmacy’s records or prescription-file content; prescription reviewer audit views remain limited to the minimum permitted request metadata.
- MediFind admins see only the audit views needed for their role. Every admin verification, moderation, suspension, support lookup, break-glass, configuration and kill-switch action is itself audited.
- Normal users, pharmacy staff/owners and routine admins cannot edit or delete audit events. Store them through server-only append paths with least-privilege access, integrity controls, monitored export/backup and legal-approved retention/deletion handling.

## Verification

- Test that every mandatory action emits one complete event and failed/unauthorised actions cannot forge or modify an event.
- Test branch/role-scoped audit visibility and absence of prohibited data in events, logs, exports and support views.
- Alert on anomalous privileged/file/audit access and audit-view export attempts. Treat suspicious audit integrity failures as a security incident.
