# Backend and prescription-upload pipeline

## Backend decision

MediFind uses a TypeScript Fastify REST API deployed to Google Cloud Run in `australia-southeast1` (Sydney), subject to the existing legal/processor/data-residency gates. API Gateway is the only public business-API entry point; IAM-private Cloud Run is the only MediFind business-operation handler. The web app/PWA does not directly read/write Firestore or Cloud Storage.

Configure the pilot API with zero minimum instances to allow scale-to-zero, an explicit conservative maximum-instance limit, request concurrency/timeout/body limits appropriate to each route, least-privilege service identity, regional logs and budget/latency/error alerts. Reassess cold-start impact with physical Fiji-device beta tests before raising minimum instances or changing cost limits. [Cloud Run regions](https://cloud.google.com/run/docs/locations) and [scale-to-zero](https://cloud.google.com/run/docs/overview/what-is-cloud-run)

Fastify is the approved HTTP framework because it supports a typed, schema-validated TypeScript API with controlled request/response handling. Framework plugins, versions and deployment artefacts require normal dependency/supply-chain review; a framework choice does not permit new data collection or a direct database client.

## Request trust chain

1. App sends HTTPS request to the regional API Gateway with Firebase ID token, Firebase App Check token, API version and idempotency key for a repeatable state change.
2. API Gateway terminates TLS, validates the configured Firebase JWT issuer/audience/signature/expiry for protected operations and invokes the private Cloud Run API using only its dedicated service account. The web app/PWA never receives that service identity.
3. Cloud Run accepts the gateway-provided verified identity context only from the IAM-authenticated gateway, verifies the Firebase App Check token, derives MediFind role/branch/request scope server-side, applies request-size/schema/per-actor/action abuse controls and rejects invalid/untrusted requests with a generic error.
4. Sensitive/expensive mutation endpoints use limited-use/replay-resistant App Check tokens where supported and practical; they do not rely on App Check in place of authorization. [Firebase App Check](https://firebase.google.com/products/app-check)
5. The API performs its own authorization, state/concurrency/idempotency validation, transaction and immutable audit event before responding with minimum necessary data. An API key embedded in the app is never treated as authentication or an abuse-control secret.

The gateway generated HTTPS hostname is used for the low-cost pilot. Cloud Armor, a custom API domain and an external load balancer are introduced only under the documented scale/security triggers in the [free-first architecture](free-first-production-architecture.md), with direct-path bypass prevented before cutover.

Rate limiting is distributed and fail-safe. Store short-window per-account/device/action counters and privacy-preserving, rotated-hash IP signals in Firestore records with expiration; do not rely on a Cloud Run instance's memory or one global hot counter. Use transaction/precondition semantics for sensitive/expensive actions, return the standard generic `RATE_LIMITED` contract and never expose thresholds. Global cost/abuse totals use sharded counters and periodic roll-ups. If national-scale contention or attack volume outgrows this model, add the approved edge/managed counter control behind the same rate-limit interface.

## Prescription upload pipeline

1. The authenticated buyer selects one verified pharmacy and gives specific consent. App validates only allowed type, page and size before sending; it does not decide legitimacy.
2. API re-validates the file and request context, creates a private quarantine object/record and emits an audit event. The app never receives a general storage credential or reusable file URL.
3. A regional, MediFind-controlled non-public scanning worker/service receives an opaque internal job for the quarantined object through least-privilege internal access. It performs malware/content/type/page/metadata handling and produces a minimal scan classification. Prescription files must never be uploaded to public analysis sites, consumer file-sharing services or third-party malware-intelligence feeds. The exact fail-closed job/access model is in the [prescription scanning workflow policy](prescription-scanning-workflow-policy.md).
4. Malware/technically unsafe files are blocked and receive only generic buyer feedback. Safely processed files with reviewable technical/legibility/duplicate signals enter the selected pharmacy's restricted quarantine inbox; the selected pharmacy's qualified reviewer makes all clinical/legal validity and dispensing decisions.
5. On authorised review, the API issues a short-lived single-purpose access grant after current request/branch/role/MFA/biometric checks. No record/file display is served from stale local cache.
6. Metadata/device/GPS elements not needed for legally required evidence are removed from the reviewer rendition where technically safe. Retention/deletion of originals, derivatives and scan artifacts remains governed by the legal/pharmacy-approved schedule.

The API starts one opaque, bounded Cloud Run Job execution per scan in the pilot and persists the intended scan state before dispatch. The maintenance reconciler detects a persisted scan with no viable execution and safely retries within the three-attempt limit. If measured dispatch recovery, backlog or throughput requires durable queuing, add a regional authenticated Cloud Tasks adapter carrying only the opaque scan ID; the upload/request API and fail-closed state model do not change.

## Scheduled maintenance

Every 15 minutes, one Sydney Cloud Scheduler job invokes a dedicated IAM-private, scale-to-zero maintenance Cloud Run service through an OIDC scheduler identity. It is not a route on the business API, preventing the scheduler's service-level invoker grant from reaching buyer/staff operations. Each invocation is idempotent, cursor-based and bounded; it reconciles listing staleness/removal, request/reservation expiry, retention/deletion work, orphaned scan dispatch and aggregate roll-ups. Record the run ID, cursor, processed/error counts and safe operational timings without sensitive contents. The product evaluates effective expiry/staleness from server time on every relevant read/action, so a late or failed scheduler invocation never revives an expired reservation or falsely fresh listing.

## Build and security acceptance

- Run the API/scanning pipeline only with fictional documents in development/beta.
- Test maximum-instance/cost containment, cold starts, timeout/retry/idempotency, malformed files, scan-worker least privilege, cross-branch denial, blocked/quarantine classifications, metadata stripping, short-lived grant expiry and audit completeness.
- Before real uploads, document the exact scanner implementation, regional placement, Cloud Run Job resource limits/concurrency/retry cost estimate, signature/definition update source, vulnerability/patch ownership, processor status, data flow and cost in the vendor/processor register. No scanner is production-ready merely because the pipeline exists on paper.
