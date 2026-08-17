# Account verification policy for the web app

## Current state

The public synthetic PWA has no account or phone verification. No SMS/email
provider, OTP, cookie or session store is active.

## Future protected web pilot

If phone verification is later required, select a provider through a separate
processor, region, privacy and cost decision. The Worker must own generic
anti-enumeration responses, attempt/resend throttles, expiry, invalidation,
audit events and breaker behaviour; it must not expose provider errors or
verification codes.

The design must support Fiji number normalization and masking, verified-channel
recovery, privileged MFA, account/session revocation and a manual support path
without bypassing verification. SMS cost is never assumed to be free, and a
provider-level cap must be tested separately from Worker request limits.

No account activation is authorized by this document.
