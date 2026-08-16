# Data dictionary and ownership model

## Rules of interpretation

This is the implementation-grade logical model for MediFind’s first API/data specification. Collection names are internal implementation names, not mobile-client capabilities. The TypeScript API is the only operational reader/writer; Firebase client SDKs receive no broad access to these records. Every record has opaque immutable ID, `createdAt`, `updatedAt`, schema version and safe audit/correlation reference where applicable. Timestamps are UTC; user-facing display/business rules use `Pacific/Fiji`.

`Public` means eligible for anonymous-style search response after account authentication in v1; it never means writeable by a client or visible without buyer sign-in. `Protected` means only the authenticated owner/role/branch relationship can access it. `Restricted` means privileged, minimal-use access only. Prescription content is never included in a general record response.

## Identity and account records

| Record | Minimum fields | Classification and ownership |
| --- | --- | --- |
| `user` | `id`, account state, age self-attestation version/time, UI language/theme, consent references, created/updated timestamps | Protected; user owns permitted profile/preferences; API controls state. No DOB, government ID or medical history. |
| `verifiedContact` | protected normalised phone or email value, masked display value, verification state/time, purpose, change history reference | Restricted; API/auth system only. Store full values separately from public records; never return another user’s value. |
| `userRole` | user ID, role (`buyer`, `inventory_manager`, `prescription_reviewer`, `pharmacy_owner`, `medifind_admin`), branch/pharmacy scope when applicable, state, grant/revoke audit reference | Protected/restricted; one account may hold buyer and staff roles, but context/data stay separate. Role is granted/revoked only by authorised owner/admin API path. Owner role does not imply reviewer access; a client never self-assigns it. |
| `sessionDevice` | user ID, opaque device/session reference, role class, enrolled/last-seen/revoked timestamps, secure-device/integrity state, notification token reference | Protected to its owner; privileged-device count/max enforced server-side. Never return raw device push token. |
| `consentRecord` | user ID, consent/notice version, purpose, action/time, withdrawal time where applicable | Protected; append-only evidence. Separate prescription-upload consent is attached to its request. |
| `accountRecoveryCase` | opaque user/case references, state, safe evidence category, hold start/end, reviewer/action audit references | Restricted; no raw recovery evidence, passwords, OTPs or authenticator secrets. |

## Pharmacy organisation and verification records

| Record | Minimum fields | Classification and ownership |
| --- | --- | --- |
| `pharmacyOrganisation` | ID, legal/display name, owner reference, verification state, public-safe brand/display data | Protected until verification; public-safe data only after approved branch activation. Owner may propose changes; admin approves protected identity changes. |
| `pharmacyBranch` | organisation ID, display name, structured Fiji address/validated coordinates, `Pacific/Fiji` timezone, weekly/exceptional hours, public contact, verification/activation state, public visibility state | Public-safe projection after approval; owner proposes changes; material identity/address/contact changes require re-verification. Exact verification evidence is excluded. See [branch location/hours policy](branch-location-and-hours-policy.md). |
| `pharmacyVerificationCase` | organisation/branch reference, required evidence categories/references, decision/state, evidence/review expiry, reviewer, reasons/audit refs | Restricted admin/owner-by-scope; evidence files/references never public. |
| `staffAssignment` | user/branch IDs, roles, active/revoked state, invitation/recovery references, grant/revoke timestamps and audit refs | Protected to branch owner/admin; user sees own assignment. Every branch assignment is separately invited/approved; branch scope is mandatory. |
| `pilotAgreementAcceptance` | organisation/branch, approved owner account, agreement/notice version/hash, server time, safe session/device acceptance evidence | Restricted; append-only. No unnecessary IP/device data beyond approved privacy policy. |
| `trainingCompletion` | learner/branch, module/version, completion/attestation time, retraining due, follow-up state | Protected owner/admin-by-scope; no health data or quiz free-text. |

## Medicine catalog and listing records

| Record | Minimum fields | Classification and ownership |
| --- | --- | --- |
| `medicineConcept` | canonical ID, generic/brand aliases, normalised terms, active ingredient, strength/form/route/release/pack attributes as applicable, approved/rejected state, curator audit refs | Restricted curation data; its minimum approved search projection supports public matching. Admin curates only identity/alias data. |
| `medicineListing` | branch ID, pharmacy-authored display name, brand/active ingredient, strength/form/route/release/pack, OTC/prescription status, availability, exact-pack FJD minor-unit price, last refreshed, permitted language-tagged operational note, concept/candidate, identity-match and moderation states, version | Branch-owned protected write; minimum public projection only when branch/listing/identity are eligible. Pharmacy owns price/availability, never admin. Dynamic notes follow [content policy](dynamic-pharmacy-content-policy.md); pricing follows [price policy](price-integrity-policy.md). |
| `listingModerationCase` | listing, category, evidence reference, state, decision/reason, moderator audit refs | Restricted; buyer reporter identity/content excluded from pharmacy view unless legally required. |
| `listingQualityReport` | buyer/listing references, bounded category, optional minimum safe evidence, state/outcome | Restricted. No public review/rating. Avoid clinical free text. |
| `publicSearchProjection` | safe listing/branch/concept fields, approved normalized tokens/aliases and geographic cell/coordinates, availability/price/last updated, ranking inputs, current projection version | Internal server-generated projection; never authoritative for branch write/authorization and never contains exact stock, buyer query/location or private fields. |

## Prescription and reservation records

| Record | Minimum fields | Classification and ownership |
| --- | --- | --- |
| `prescriptionRequest` | buyer/account-holder ID, request-scoped patient legal name/relationship, selected branch ID, prescription status, consent reference, expiry/business-time calculation, reviewer/decision refs, safe audit refs | Protected. Buyer reads own minimum status; only selected branch reviewers read authorised request data; admin content access prohibited except break-glass. No broadcast/forwarding. |
| `prescriptionFile` | request ID, private quarantine object reference, upload technical state/classification, safe metadata-stripping state, retention/deletion reference | Restricted. File/object URL/bytes never part of ordinary API response. Access is a short-lived authorised grant only. |
| `prescriptionAccessGrant` | file/request/recipient branch-user references, purpose, issue/expiry/use/revoke state, current-auth/MFA/biometric check reference | Restricted and short-lived; append-only access audit. |
| `reservation` | buyer/account-holder, request-scoped patient name/relationship, listing/branch, state, pharmacy-confirmed FJD price, structured pickup values plus permitted language-tagged note, expiry, operational cancellation reason, collected timestamp/by-role, buyer feedback state, version | Protected to buyer and branch-scoped authorised role. Pharmacy is source of truth for collection. |
| `requestStateEvent` | prescription/reservation ID, old/new state, actor role/reference, server time, required safe reason, correlation/audit ref | Protected to authorised parties; no file content or sensitive internal analysis. |

## Security, support and operations records

| Record | Minimum fields | Classification and ownership |
| --- | --- | --- |
| `auditEvent` | fields defined in [audit-log policy](audit-log-policy.md) | Restricted append-only server write; branch/role-scoped views only. |
| `securityIncident` | incident ID/severity/state, safe affected-system/data categories, containment/actions, notification decision, post-incident action refs | Restricted. Follow [incident runbook](incident-response-runbook.md); never add raw prescription content. |
| `supportCase` | reporter/account/branch scope, bounded category, minimal safe description/evidence ref, state, assigned owner, actions/audit refs | Restricted by support role. No prescription attachment route; free text is minimized/redacted. |
| `featureFlag` | server-side key, safe audience/scope, default, owner/expiry, change audit refs | Restricted; client never provides its own flag authority. |
| `operationalMetric` | aggregate/counted event and time bucket, no raw identifier/search/prescription content | Restricted analytics/operations; privacy-minimised only. |
| `rateLimitWindow` | pseudonymous subject type/hash, action, bounded window, count/state, expiry | Restricted server-only ephemeral control. Never store raw IP, phone/email, search text or prescription data; avoid a single global hot record. |
| `maintenanceRun` | run ID/type, cursor, start/end/state, processed/error counts, retry reference, safe timing | Restricted operations record; no prescription content or reusable object URL. Idempotent reconciliation only. |

## State and deletion principles

- Use explicit states, not implicit deletion, for account, verification, identity-match, listing, request, reservation, staff and incident lifecycle. Terminal transitions are immutable and produce state/audit events.
- Use version/optimistic-concurrency fields for mutable records: listing, branch hours/contact, staff assignment, verification case, reservation and feature flag.
- Account deletion immediately revokes sessions/notifications and removes/de-identifies eligible profile/contact data; opened prescription/review/reservation/audit record retention waits for Fiji legal/pharmacy-approved schedule.
- Deletion/retention jobs operate server-side with auditable outcome. Backups, derivatives and scanner artifacts follow the same approved classification/retention rules.

## First-task boundary

The first Claude task may create only the scaffolding/types/validation needed by its approved brief. It must not pre-create unapproved production collections, loose “future” fields, public client-access rules, real data or retention behaviour that bypasses legal gates.
