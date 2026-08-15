# API error contract

## Production response shape

Every production API error returns a stable, allow-listed machine-readable `code`, client-localisation `messageKey`, opaque correlation `requestId`, optional safe `fieldErrors` for the caller's submitted fields, and a retryability/category signal where applicable. The mobile app renders translated safe language; the API does not return unreviewed human exception text.

```text
{
  code,
  messageKey,
  requestId,
  retryable,
  fieldErrors?: [{ field, code, messageKey }]
}
```

Exact wire names/schema validation are pinned in the relevant task contract. A response never includes a stack trace, provider/internal identifier, database/security-rule detail, raw exception, token, OTP, contact data, prescription detail or inaccessible record identifier.

## Disclosure and validation rules

- `fieldErrors` may describe only fields the authenticated caller sent in this request, using safe validation codes. They must not reveal whether an existing phone/email/account/pharmacy/prescription/listing belongs to another party.
- Authentication, permission, record-relationship, rate-limit, generic upload and not-found-like failures use anti-enumeration-safe responses. The app must not distinguish “does not exist” from “exists but is inaccessible” where that distinction exposes protected information.
- Input errors remain specific enough for the caller to correct formatting, required fields or state that the caller is authorised to know. Security-detection/abuse/malware logic remains generic.
- The server logs protected diagnostic detail linked to `requestId` under the log/audit policy; a user-facing response is not an operational investigation record.

## Required error classes

Use the categories in [API and data contracts](api-and-data-contracts.md): `UNAUTHENTICATED`, `FORBIDDEN`, `VALIDATION_FAILED`, `RATE_LIMITED`, `CONFLICT` and `UNAVAILABLE`, plus reviewed resource/action-specific safe codes. Unknown errors map to a generic retry/support message with correlation ID, while monitoring receives redacted diagnostics.

## Tests

- Schema-test every error response and reject unexpected fields.
- Test translation-key coverage in English, iTaukei and Fiji Hindi.
- Test account/record enumeration attempts, malformed requests, provider failures and internal exceptions for absence of sensitive/internal output.
- Test that `requestId` links to protected redacted diagnostics/audit evidence but contains no meaningful sequential or sensitive value.
