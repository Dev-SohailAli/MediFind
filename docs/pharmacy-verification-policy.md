# Pharmacy verification and re-verification policy

## Verification validity

A MediFind pharmacy verification is valid for 12 months from approval or until the earliest expiry date on its relied-on business, pharmacy/licensing or responsible-person evidence—whichever occurs first. The verifier records evidence category/reference, review date, expiry date, decision, reviewer and audit reference; do not expose evidence files/details publicly.

## Renewal lifecycle

- Send the verified pharmacy owner a generic in-app/email operational reminder 60 days and 30 days before verification expiry.
- The owner submits current replacement evidence through the protected verification flow; MediFind reviews before extending validity.
- If the verification expires without approved renewal, immediately suspend public discovery, prescription receipt/review and reservation handling for the affected branch. Remove public listings, revoke/pause branch staff access as required by the suspension procedure, and send pending buyers a neutral status notice. Never forward a pending prescription to another pharmacy.
- Restoring service requires documented MediFind re-approval, current staff/role review and audit evidence. Expiry is not automatically renewed by a pharmacy upload alone.

## Material-change re-verification

The following changes enter `reverification_required` and must be approved before becoming public or resuming affected sensitive functions:

- pharmacy ownership or legal/display name;
- participating branch address/location;
- pharmacy licence, responsible pharmacist/reviewer or other relied-on professional evidence;
- official pharmacy contact details; or
- a regulator/licensing concern, credible fraud/safety report or discrepancy that makes existing evidence unreliable.

The owner may prepare the change privately. MediFind records prior/new safe metadata, reviewer decision and effective time. A material change never silently carries forward the prior approval. Routine hours/listing/price/availability updates remain pharmacy operations and do not independently require full re-verification.

## Operating controls

- All verification decisions, expiry notices, submissions, suspensions, restorations and material-change decisions emit the append-only audit events required by the [audit-log policy](audit-log-policy.md).
- MediFind verifier/admin access is role-scoped; routine staff/owners cannot approve their own pharmacy or alter verification validity.
- Fiji legal/pharmacy review determines the final accepted document types, regulator checks and any statutory re-verification period. This policy does not replace professional/regulatory validation.
