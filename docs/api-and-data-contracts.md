# API and data contracts

## Boundary and protocol

The web application/PWA communicates with a versioned REST/JSON API under `/v1`. Firebase Authentication establishes user identity, but all MediFind operational reads and writes—including search, listings, branches, reservations, prescriptions, staff management, reports and admin actions—flow through the TypeScript backend API. The browser receives no broad Firestore/Cloud Storage capability and never chooses authorization from local role state.

Every protected request includes a Firebase identity token and Firebase App Check token. API Gateway validates the Firebase JWT and invokes private Cloud Run with its service identity; Cloud Run accepts gateway-provided identity context only from that IAM-authenticated caller, verifies App Check, derives user/role/branch context server-side and authorizes access. Sensitive/expensive mutation endpoints use limited-use/replay-resistant App Check tokens where supported. App Check and gateway authentication are abuse/trust controls, not replacements for MediFind authorization.

Application rate limits are backend-owned and distributed: use persistent short-window account/device/action records plus a rotated-hash IP signal where justified, with expiry and transaction/precondition enforcement. Never depend on one Cloud Run instance's memory, raw IP retention or a single global counter. Global monitoring/cost totals may use sharded counters and scheduled roll-ups; they do not replace the per-request decision.

Use JSON request/response bodies, HTTPS only, explicit API versioning, allow-list schemas, request-size limits and idempotency keys for externally repeatable state-changing operations. Do not put tokens, prescription references, raw contact details or sensitive values in URLs. The API rejects unknown/malformed fields by default where compatibility permits. All mutations follow the explicit command, 24-hour idempotency and record-version rules in the [API mutation and concurrency policy](api-mutation-and-concurrency-policy.md).

Search returns a maximum of 20 results per page and 100 results per query, using explicit cursor/page continuation. The public search projection applies a pharmacy listing price/availability change within five minutes and returns the actual pharmacy `lastUpdatedAt`; an index delay must never falsely refresh that timestamp.

## Response and error conventions

Successful responses return only the data needed by the caller. Errors follow the [API error contract](api-error-contract.md): stable code, local translation key and opaque request ID with safe caller-field errors only. Internal detail remains in protected logs. Do not reveal whether another user, pharmacy, record, phone/email or prescription exists.

| Category | Examples | Client behaviour |
| --- | --- | --- |
| `UNAUTHENTICATED` | missing/expired identity | sign in again |
| `FORBIDDEN` | role/branch/record access denied | show safe access message; do not retry blindly |
| `VALIDATION_FAILED` | missing/invalid field, invalid state transition | highlight safe actionable field/state |
| `RATE_LIMITED` | OTP/search/upload/request throttle | show retry/support message without threshold |
| `CONFLICT` | stale edit, duplicate active reservation, idempotency conflict | refresh current state and explain conflict |
| `UNAVAILABLE` | maintenance, kill switch, provider outage | preserve entered non-sensitive form data where safe and show status path |

When offline, the web client/PWA may display only explicitly cacheable public listing/search data with its original last-updated time. It must disable prescription upload/review, reservation/status mutations, staff/admin changes and any protected data display that cannot be freshly authorised. It must not create a deferred/queued sensitive API request. On reconnect or application resume, the API remains the source of truth and the client re-fetches the record before a sensitive action.

Push notifications are generic refresh prompts only. The app follows the authorised re-fetch/no-polling/no-persistent-realtime rules in the [notification and status synchronisation policy](notification-and-status-synchronisation.md).

## Resource contracts

| Resource | Operations | Authorization/data rule |
| --- | --- | --- |
| Search/listing | search, result/detail read | public read returns verified, eligible, non-stale public fields only; no quantities or private records |
| Pharmacy branch | public detail read; owner/admin update | public result is branch-specific; multi-branch staff access requires distinct branch assignments |
| Medicine listing | create/update/refresh/moderate | inventory manager for assigned branch; required identity/form/pack/price/status fields; canonical-match state gates public visibility; audit every change |
| Canonical medicine concept | propose/review/approve/reject aliases and identity match | pharmacy may propose through listing input; MediFind admin controls approval; never changes pharmacy price/availability or clinical decision |
| Prescription request | create, status read, cancel before open, reviewer decision | buyer-selected branch only; file upload/quarantine flow; explicit reviewer role plus biometric/MFA gate; owner role alone is insufficient |
| Reservation | create, approve/reject/cancel/expire/collect | OTC direct request; prescription after approval; branch/reviewer/owner source of truth as documented |
| Staff assignment | invite, accept, change role, revoke | branch owner only; seven-day phone invitation; fresh MFA/audit; last-owner and last-reviewer lifecycle guards |
| Pharmacy verification | submit, review, activate/suspend | owner submits; admin verifies; no routine prescription-content access |
| Reports/security | submit, triage, status where appropriate | private reports; admin scope only; minimal evidence |
| Devices/sessions | list, revoke | user owns own sessions; privileged-device limit enforced server-side |

Exact endpoint names and request fields are defined in each approved Claude task brief before implementation. A task may not add an endpoint that expands data collection, processor exposure, permissions or an accepted product boundary without a decision-change request.

The approved v1 route/action map is in the [v1 API endpoint inventory](v1-api-endpoint-inventory.md). Each task pins exact field schemas for its selected routes; it may not invent an unlisted route or use a generic state patch.

## Canonical data and time rules

- Use opaque immutable IDs; never expose sequential identifiers as an authorization mechanism.
- Store timestamps in UTC ISO 8601 form. Render user-visible time in `Pacific/Fiji`; calculate pharmacy business days, opening hours, reservation expiry and reminder schedules in the branch's Fiji timezone using an IANA timezone identifier. Branch address/hours/public directions follow the [branch location and hours policy](branch-location-and-hours-policy.md).
- Store money as an integer minor-unit amount plus `FJD` currency, never floating point. Display formatted FJD values only at the UI boundary.
- Keep public listing data separate from private buyer, staff, prescription and audit records. A file reference alone never grants access.
- Represent status as an explicit enum and record an immutable state transition event with actor, server timestamp and reason where required.
- Create all audit events through the server-only append path defined in the [audit-log policy](audit-log-policy.md). Audit data is role/branch scoped, never a source of prescription content and never editable by normal users.
- Use opaque optimistic concurrency/version fields for edits/actions that can conflict, especially listing price/availability, pharmacy hours, verification, reservations and role assignments; never silently overwrite a stale version.
- Use the field classification, ownership and collection-boundary rules in the [data dictionary](data-dictionary-and-ownership.md). Those logical records are implementation guidance, not direct browser/PWA database capability.

## State contracts

### Prescription request

`submitted` → `quarantined` (when reviewable technical flag) or `under_review` → `approved` / `rejected` / `expired` / `cancelled`.

Unsafe/malware files are blocked before a usable request is created. Only the selected authorised branch reviewer makes an `approved` or `rejected` decision. An unviewed request expires after two pharmacy business days. Terminal states cannot be overwritten; a buyer submits a new request to another branch instead of forwarding data.

### Reservation

`submitted` → `approved` / `declined` / `cancelled` / `expired`; approved reservations become `collected` only through pharmacy staff action. A pharmacy cancellation after approval requires recorded operational reason and immediate buyer notice. Only one active reservation exists per medicine/person/account holder.

## Firestore implementation rules

Firestore collections and documents are an internal persistence implementation, not the web/PWA contract. The backend service identity uses collection/document-level least privilege. Security rules default-deny client access to private operational collections and prescription metadata/files. Public search data, if materialized for performance, is a deliberately minimal projection generated by server-side writes and contains no private or exact-stock data.

Every Firestore query is constrained by the caller's authorized branch/request relationship and supported by explicit indexes. Do not use client-side filtering as a security control. All cross-document state changes that affect reservations, staff access, quotas or state transitions use a server-side transaction/atomic workflow and emit audit events.

The search projection/index is generated by the backend and is accessed only through an internal search adapter. Web contracts never expose Firestore syntax. A future managed index can replace the adapter only with the same minimum public fields, ranking/safety rules and no query/location retention.

One private scheduled maintenance workflow processes bounded cursor pages for staleness, expiries, retention/deletion, orphaned scan recovery and aggregate roll-ups. Every relevant API read/action also evaluates effective expiry/staleness from trusted server time; correctness never depends solely on scheduler timeliness.
