# Pharmacy staff-access lifecycle policy

## Invitation lifecycle

- A branch staff invitation is scoped to one invited phone/person, branch and proposed role set. It expires seven days after issue.
- A branch may have only one active invitation for the same phone/person/role context. Reissuing/replacing it invalidates the prior invitation immediately and emits an audit event.
- Invitation acceptance requires phone proof, verified personal email, required MFA and owner-granted scoped roles. An invitation never itself grants active access.
- Invitation endpoints use generic anti-enumeration responses, rate limits and no raw invitation token in logs/URLs. The accepted task schema decides the safe opaque acceptance mechanism.

## Owner continuity

- A branch must retain at least one active pharmacy-owner assignment at all times. The API rejects removal, revocation or downgrade of the final active owner.
- A transfer/addition of ownership requires fresh MFA, audit evidence and the [pharmacy re-verification](pharmacy-verification-policy.md) process before it becomes effective publicly/operationally.
- An owner who needs prescription access must separately hold active reviewer assignment; owner continuity never bypasses reviewer/MFA requirements.

## Reviewer continuity

- A prescription-required listing can be public, and a branch can receive/review prescription requests, only while that branch has at least one active authorised `prescription_reviewer` assignment.
- When the last reviewer is revoked, suspended, expired or otherwise inactive, the API atomically disables new prescription requests, removes prescription-required listings from public search and emits owner/admin alerts/audit events. Eligible OTC listings remain available.
- Restoring prescription functionality requires an active authorised reviewer, current branch verification and safe re-evaluation of the relevant public projection; it is not restored merely by an old session.
- Existing pending prescription records are not forwarded. The pharmacy/admin follows the documented suspension/expiry/buyer-notice process without revealing prescription details in notifications.

## Test requirements

Test seven-day expiry, single-active-invitation replacement, invitation anti-enumeration, acceptance without all proof/MFA, last-owner protection, ownership-transfer re-verification, last-reviewer automatic disablement, OTC continuity, restoration and cross-branch role isolation.
