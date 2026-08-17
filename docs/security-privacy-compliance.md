# Web security, privacy and compliance

## Current data boundary

The active app and public preview use invented fixtures only. They collect no
accounts, contact details, health data, cookies, analytics or prescriptions.
Cloudflare Pages is treated as a static operational supplier for this preview.

## Future protected web pilot

Before collecting personal or health data, document the selected Cloudflare
products, processing purpose, data categories, region/transfer position,
subprocessors, retention/deletion, support access, backup/recovery and user
rights. Obtain Fiji legal and pharmacy review before activation.

The future Worker must enforce server-side authorization, persistent rate
limits, safe anti-enumeration errors, explicit state transitions, idempotency,
version conflicts and append-only redacted audit events. Browser code must not
access D1/R2/KV directly.

Authentication, MFA, recovery, notification, file quarantine and scanning are
separate approval gates. No provider is allowed to be selected solely because
it has a free tier.

## Privacy prohibitions

Do not put names, phone/email values, tokens, prescription content, health
information, search text or support free text in logs, browser analytics,
notifications or public URLs. Do not use advertising, session replay, public
ratings, data brokers or unrelated third-party processors in the MVP.

## Incident and deletion readiness

Before a protected pilot, establish a founder-owned incident contact, access
revocation, breach containment, retention/deletion execution, export, backup
restore and user-support procedure. Test these procedures with synthetic data.
