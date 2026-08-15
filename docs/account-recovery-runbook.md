# Account-recovery runbook

## Principle

Recovery is a security-sensitive state, never a support shortcut. It must be rate-limited, resistant to account enumeration, recorded in the audit log and communicated through verified channels without exposing health/prescription data. Support never requests an OTP, password, authenticator code or prescription file.

## Buyer: lost phone

1. The buyer starts recovery using their verified email and proves control of a replacement phone number.
2. The service revokes all existing sessions and push tokens, marks the account `recovery_hold`, and sends a generic security alert through the verified email and any still-valid device route.
3. A mandatory 24-hour security hold begins. During the hold the user cannot view/upload prescriptions, create/manage reservations or perform other sensitive actions. Account/support screens show the end time and a safe unrecognised-activity report path.
4. At the end of the hold, only the verified recovery session is restored. The app requires a fresh server state before enabling sensitive access. Any suspicious report escalates the case and extends/restricts recovery until resolved.

## Pharmacy staff: lost authenticator device

1. The staff member uses the published operational-support route; no self-service MFA bypass is available.
2. The pharmacy owner verifies the staff member through an already established, out-of-band contact method, then revokes the staff member's pharmacy access/sessions and starts an auditable reset/re-invitation.
3. The staff member re-proves the invited phone number, re-verifies the approved personal email and enrols a new authenticator factor before the owner re-grants only the necessary branch roles.
4. MediFind support may assist operationally but cannot grant a role, suppress MFA or substitute its own judgment for owner approval. A suspected compromise follows the security-incident process instead.

## Pharmacy owner or MediFind admin: lost MFA

1. Immediately suspend the affected privileged account's role actions and revoke its sessions/factors where safe. Preserve non-sensitive audit evidence.
2. Open a manual recovery case. Verify the person and role using established, verified business/contact evidence; email alone is insufficient. For an owner, confirm with the verified pharmacy records and a second approved trusted contact or documented legal/pharmacy evidence as the final policy requires. For a MediFind admin, use founder-controlled recovery evidence and separation of duties where practical.
3. Record requester, evidence categories, reviewer, decision, timestamps, actions and any exception. Do not place prescription content in the case record.
4. On approval, require fresh verified email sign-in, fresh authenticator enrollment and least-privilege re-grant. Notify other applicable owners/admins of the recovery. Keep privileged actions suspended until this succeeds.
5. If verification is inconclusive, leave access suspended, protect active buyer/prescription workflows through the documented operational escalation and seek legal/pharmacy guidance where necessary.

## Required controls and tests

- Recovery requests have rate limits, generic responses, case correlation IDs and fraud/anomaly monitoring.
- Recovery/role/MFA events are immutable audit events and trigger generic security alerts.
- Automated tests cover wrong email/phone, expired hold, repeated attempts, old-session revocation, MFA-reset denial without owner/manual approval, incomplete manual recovery, cross-branch role attempts and final re-enrollment.
- Rehearse each recovery path using synthetic accounts before beta and after any identity-provider/workflow change.
