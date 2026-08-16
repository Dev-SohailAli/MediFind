# API mutation and concurrency policy

## Command model

The web app/PWA never submits a generic record-state patch. Every state-changing operation uses an explicit, documented API command with server-side role, branch, record-relationship, current-state and transition validation. Examples include create/refresh listing, approve/decline/cancel/collect reservation, submit/cancel/review prescription request, invite/revoke staff, approve/suspend pharmacy, update approved branch details and activate a feature flag.

An action command accepts only the minimum inputs for that action. The server, not the client, determines legal next state, prices already confirmed in an action, expiry computations, audit event and notification. Unknown fields and unauthorised state/field combinations are rejected with a stable safe error.

## Idempotency

- Every externally repeatable state-changing request requires a client-generated opaque idempotency key in the approved request header.
- The API binds the key to authenticated user, action/route and a canonical safe request fingerprint. It stores the completed/in-progress outcome for 24 hours.
- A retry with the same key and same request returns the original safe response; reuse with a changed request is a conflict. A different user/action/route cannot reuse another context’s key.
- The server creates one state transition/audit/notification side effect for a successful command. The client must retain a pending key only for the active attempt and never log it as a credential.
- Idempotency does not replace authorization, current-state checks, quota/rate limits, transactions or upload/content validation.

## Concurrency and versions

Mutable conflict-prone records expose an opaque `version` value in their authorised read model. An update/action that depends on current content must provide that version. The API uses server-side conditional/transactional updates and rejects a stale version with `CONFLICT`, returning only the minimum current safe information needed to refresh the screen.

Version enforcement is mandatory for listing price/availability/identity fields, branch hours/contact changes, staff assignment/role changes, verification decisions, reservation approval/decline/cancel/collect operations, feature flags and other high-risk administration. Prescription workflow commands also validate current request state and authorised reviewer relationship; clients cannot supply a future state.

## Audit and tests

Every successful command, rejected state transition and material conflict creates the safe audit/security evidence required by the [audit-log policy](audit-log-policy.md). Tests must prove duplicate retries create one result, cross-context/reused keys fail safely, stale versions do not overwrite data, concurrent reservations/staff/listing changes remain consistent and a client cannot invoke an unlisted state transition.
