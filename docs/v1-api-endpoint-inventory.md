# V1 API endpoint inventory

## Use of this inventory

This is the approved route/action map, not a promise to implement every endpoint in the first Claude task. Each implementation task selects a narrow subset and supplies exact request/response schemas from the data dictionary. All protected routes require Firebase identity and App Check verification; every mutation uses the [mutation and concurrency policy](api-mutation-and-concurrency-policy.md), and every response follows the [error contract](api-error-contract.md).

Routes do not expose raw tokens, prescription file paths, direct storage capability or sequential IDs. `{id}` values are opaque IDs. Generic route shape is deliberate: state-changing actions are commands, not open state patches.

## Account, devices and consent

| Method/route | Action | Caller |
| --- | --- | --- |
| `GET /v1/me` | Read authorised profile, roles/workspaces, safe preferences and account state | Signed-in user |
| `PATCH /v1/me/preferences` | Update language/theme/non-sensitive preferences | Self |
| `POST /v1/me/contact-change/start` | Start verified phone/email change | Self, fresh auth |
| `POST /v1/me/contact-change/confirm` | Confirm protected contact change | Self, fresh auth |
| `POST /v1/me/deletion-requests` | Request account deletion | Self |
| `GET /v1/me/sessions` | List own safe device/session records | Self |
| `POST /v1/me/sessions/{id}/revoke` | Revoke own device/session | Self |
| `POST /v1/me/push-devices/register` | Register/update current device push reference | Self |
| `POST /v1/me/push-devices/{id}/revoke` | Revoke device push reference | Self |
| `POST /v1/me/recovery/start` | Start buyer recovery case | Safe anti-enumeration flow |
| `POST /v1/me/recovery/confirm` | Complete recovery/hold transition | Verified recovery session |
| `POST /v1/me/security-reports` | Report suspicious message/activity | Self |

Firebase-native sign-in, phone OTP, email verification and privileged MFA enrollment/challenge remain identity-provider flows; API routes record/verify MediFind operational state and do not replace identity-provider credentials.

## Search, pharmacies, catalog and listings

| Method/route | Action | Caller |
| --- | --- | --- |
| `GET /v1/search/medicines` | Search eligible public listing projection with approved query/sort/cursor | Signed-in buyer/staff as permitted |
| `GET /v1/listings/{id}` | Read authorised safe listing/detail projection | Signed-in user |
| `GET /v1/branches/{id}` | Read authorised safe branch/detail projection | Signed-in user |
| `POST /v1/listing-quality-reports` | Submit private bounded listing-quality report | Buyer |
| `GET /v1/owner/branches` | List assigned owner branch workspaces | Pharmacy owner |
| `POST /v1/owner/branches` | Propose/create branch onboarding record | Pharmacy owner |
| `POST /v1/owner/branches/{id}/details` | Submit material branch detail/contact change for review | Branch owner |
| `POST /v1/listings` | Create branch listing draft/proposal | Assigned inventory role |
| `GET /v1/listings/manage` | List authorised branch inventory and private match state | Assigned inventory role |
| `POST /v1/listings/{id}/update` | Update listing fields using current version | Assigned inventory role |
| `POST /v1/listings/{id}/refresh` | Refresh current price/availability/time | Assigned inventory role |
| `POST /v1/listings/{id}/archive` | Archive own branch listing | Assigned inventory role |
| `POST /v1/listings/{id}/identity-proposals` | Propose/correct canonical match input | Assigned inventory role |

## Pharmacy application, staff and training

| Method/route | Action | Caller |
| --- | --- | --- |
| `POST /v1/pharmacy-applications` | Start self-service pharmacy application | Eligible signed-in owner |
| `GET /v1/pharmacy-applications/{id}` | Read own safe application/verification status | Applying owner/admin |
| `POST /v1/pharmacy-applications/{id}/evidence` | Submit protected required evidence metadata/file through approved flow | Applying owner |
| `POST /v1/pharmacies/{id}/pilot-agreement/accept` | Record owner agreement acceptance | Authorised verified owner |
| `POST /v1/branches/{id}/staff-invitations` | Invite named person to a scoped branch role | Branch owner, fresh MFA |
| `POST /v1/staff-invitations/accept` | Accept own phone-linked invitation after required identity/MFA checks | Invited person |
| `GET /v1/branches/{id}/staff` | List safe staff assignments | Branch owner/admin |
| `POST /v1/branches/{id}/staff/{assignmentId}/roles` | Change scoped assignment roles | Branch owner, fresh MFA |
| `POST /v1/branches/{id}/staff/{assignmentId}/revoke` | Revoke branch assignment | Branch owner, fresh MFA |
| `POST /v1/branches/{id}/training-completions` | Record own module completion/attestation | Assigned staff/owner |
| `GET /v1/branches/{id}/training-status` | Read branch training readiness | Branch owner/admin |

## Prescription requests and reservations

| Method/route | Action | Caller |
| --- | --- | --- |
| `POST /v1/prescription-requests` | Create selected-branch request and specific consent record | Buyer |
| `POST /v1/prescription-requests/{id}/uploads` | Upload permitted file through API quarantine flow | Request owner before expiry/open |
| `GET /v1/prescription-requests` | List caller-authorised request summaries | Buyer or explicit branch reviewer |
| `GET /v1/prescription-requests/{id}` | Read minimum authorised request detail/status | Request owner or explicit branch reviewer |
| `POST /v1/prescription-requests/{id}/cancel` | Cancel/delete before reviewer opens | Request owner |
| `POST /v1/prescription-requests/{id}/review-access` | Request short-lived authorised reviewer display grant | Explicit branch reviewer, fresh MFA/biometric gate |
| `POST /v1/prescription-requests/{id}/review-decisions` | Approve/reject according to pharmacy process | Explicit branch reviewer |
| `POST /v1/prescription-requests/{id}/expire` | Expire eligible request | Authorised system/reviewer policy path |
| `POST /v1/reservations` | Request OTC reservation or post-approval prescription reservation | Buyer |
| `GET /v1/reservations` | List caller-authorised reservation summaries | Buyer or authorised branch role |
| `GET /v1/reservations/{id}` | Read minimum authorised reservation detail | Buyer or authorised branch role |
| `POST /v1/reservations/{id}/approve` | Approve with price/pickup/expiry | Authorised branch reviewer/role |
| `POST /v1/reservations/{id}/decline` | Decline with safe reason category | Authorised branch role |
| `POST /v1/reservations/{id}/cancel` | Buyer cancel, or pharmacy operational cancel with required reason | Authorised buyer/branch action context |
| `POST /v1/reservations/{id}/collect` | Mark collection as pharmacy source of truth | Authorised branch role |
| `POST /v1/reservations/{id}/buyer-feedback` | Buyer confirms collection/no-longer-needed | Reservation owner |

## Admin, support, audit and operations

| Method/route | Action | Caller |
| --- | --- | --- |
| `GET /v1/admin/verification-cases` | List scoped pharmacy verification queue | MediFind verifier/admin |
| `POST /v1/admin/verification-cases/{id}/decision` | Approve/reject/suspend/reapprove verification | MediFind verifier/admin, fresh MFA where high risk |
| `GET /v1/admin/catalog-review` | List identity-review queue | MediFind verifier/admin |
| `POST /v1/admin/catalog-review/{id}/decision` | Approve/reject concept/alias match | MediFind verifier/admin |
| `GET /v1/admin/listing-reports` | List private listing-quality queue | MediFind verifier/admin |
| `POST /v1/admin/listing-reports/{id}/decision` | Close/escalate/moderate safely | MediFind verifier/admin |
| `POST /v1/support-cases` | Create authenticated support case | Buyer/pharmacy user as scoped |
| `GET /v1/support-cases` | List caller-authorised support cases | Reporter or authorised admin |
| `POST /v1/support-cases/{id}/actions` | Record scoped support action | Authorised admin |
| `GET /v1/audit-events` | Read authorised branch/admin audit projection | Branch owner or scoped admin |
| `POST /v1/admin/break-glass-cases` | Request exceptional access | Authorised admin, fresh MFA |
| `POST /v1/admin/break-glass-cases/{id}/decision` | Approve/reject/time-limit exceptional access | Authorised approver |
| `POST /v1/admin/feature-flags/{id}/change` | Change server-side flag | Authorised founder/admin path |
| `POST /v1/admin/kill-switch/change` | Enable/disable sensitive-function kill switch | Authorised founder/admin path, fresh MFA |

## Route implementation notes

- Endpoint field schemas use strict allow-lists, safe pagination cursor and resource versioning. Queries/URLs contain no raw contact, prescription or sensitive values.
- The inventory does not authorise all listed callers to see the same fields. The server returns the minimum role/branch/request projection defined by the data dictionary.
- System-triggered expiry, scanning, propagation and notification work is invoked through private internal/job interfaces, not public mobile routes.
- A route can be omitted from early synthetic tasks; adding a route not listed here requires the decision-change process.
