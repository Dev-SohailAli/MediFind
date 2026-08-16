# Phone verification and OTP policy

## Scope

Buyer and pharmacy-staff invitations use Fiji phone numbers in normalised international E.164 form (`+679` followed by the subscriber number). Store the normalised form as protected contact data; display only a masked version except where an authorised user must confirm their own contact method. Public pharmacy contact numbers are separately owner-supplied branch details and are not derived from staff/buyer identity data.

## Code lifecycle

- Issue a six-digit verification code through Firebase Authentication/Identity Platform phone verification. The mobile SDK/provider requests, generates and delivers the code; MediFind's business API does not sit in that send path and must not claim it can transactionally stop every send.
- Only one active code exists per phone/verification purpose at a time; a resend invalidates the prior code.
- Codes expire after 10 minutes and cannot be reused.
- Rate-limit sends and verification attempts by phone, account/device/IP signals and global cost budgets. After repeated failed attempts, temporarily block further attempts and show only a generic retry/support message; do not reveal thresholds, account existence or abuse-detection signals.
- Log pseudonymous verification lifecycle events and security signals, never raw OTP values or complete phone numbers.

## Cost and abuse controls

Firebase currently leaves the first 10 SMS sent per project/day unbilled and lists Fiji at USD 0.18 per subsequent SMS; this price is verified again before beta and monthly during the pilot. Treat the unbilled amount as an allowance, not a guaranteed budget. Configure Identity Platform's allowlist-only SMS region policy for Fiji (`FJ`), enforce App Check for Firebase Authentication after monitoring legitimate beta traffic, retain provider per-IP/number protections, and alert on provider `sent_sms_count`, `blocked_sms_count` and successful verification ratio. [Identity Platform pricing](https://cloud.google.com/identity-platform/pricing), [SMS region policy](https://cloud.google.com/identity-platform/docs/admin/sms-regions), [Firebase Authentication limits](https://firebase.google.com/docs/auth/limits) and [Firebase SMS abuse guidance](https://firebase.google.com/support/faq/)

MediFind also maintains founder-approved per-account/device/action limits around registration, recovery and session-sensitive operations. Because Firebase performs the actual SMS send, the independent SMS circuit breaker is implemented through tested provider configuration/quotas or a founder-controlled automated configuration action—not only an API flag. Before beta, pin the exact supported disable/restore mechanism, IAM permission, alert latency and safe user response. If provider controls cannot reliably stop new sends at the approved cap, keep phone registration disabled until they can; never promise a hard financial cap based only on delayed billing alerts.

Keep valid buyer sessions so routine app reopening does not send another SMS. Reverification occurs only for initial sign-in/registration, approved recovery or a documented risk-sensitive event. Do not weaken the phone-verification requirement solely to avoid SMS cost.

## Boundaries and fallback

- Initial buyer registration/sign-in requires successful phone verification. A verified email is recovery for an existing buyer account only; it never substitutes for initial phone verification.
- WhatsApp, manual support, phone calls and unverified email are not OTP or identity-verification substitutes.
- A delivery failure shows a generic retry/support path. Support may investigate provider/service status but cannot manually mark a number verified.
- Staff invitations use the same phone proof plus the required verified personal-email primary sign-in and authenticator MFA; phone invitation does not bypass privileged identity controls.

## Fiji delivery validation

Before closed beta, conduct an approved synthetic-data delivery test to representative Fiji mobile networks/devices using designated tester numbers. Record delivery, expiry/resend, failure/error wording, rate-limit safety and cost evidence. Do not use real prescriptions, pharmacy workflows or sensitive data in this test. Failure to demonstrate reliable enough delivery blocks buyer account/prescription beta activation until an approved remediation is documented.
