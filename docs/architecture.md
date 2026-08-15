# Architecture decision: shared-codebase mobile pilot

## Decision

Build v1 after documentation approval as a TypeScript React Native/Expo shared-codebase mobile application that supports iOS and Android for buyers, pharmacy staff, pharmacy owners and MediFind admins, backed by a TypeScript API on Firebase/Google Cloud. The mobile app must present role-appropriate workspaces after authentication; it is not a public, shared-device administration surface. Keep production data in Sydney where supported and retain vendor/legal gates for every external service.

## Required boundaries

- Mobile client: buyer, pharmacy-staff, pharmacy-owner and admin experiences, localization, device push registration and safe display of data.
- Local resilience: retain only a short-lived cache of minimum public search/listing data for offline/poor-connectivity display. Do not durably cache prescription files, request/reservation details, privileged data or sensitive screen content; never queue a sensitive submission while offline.
- Authentication: buyer passwordless phone-code sign-in with verified-email recovery and optional device-biometric session unlock; privileged roles use verified personal-email primary sign-in plus authenticator-app TOTP MFA. Implement Firebase native Auth through React Native Firebase; this requires Expo development/production builds, never Expo Go.
- API/service layer: TypeScript Fastify API on regional Google Cloud Run with Firebase Authentication and App Check verification, role enforcement, search, pharmacy verification workflow, request/reservation state machine and audit event creation.
- Edge/API protection: a regional Google Cloud API Gateway is the only public business-API entry point. It validates Firebase JWTs and invokes a private Cloud Run backend through a dedicated least-privilege service account. Cloud Run separately verifies App Check and enforces schema/request-size validation, per-actor/action abuse limits, authorization and structured security logging. Cloud Armor/load balancing is an additive scale/assurance upgrade, not a pilot dependency.
- Private file service: regional MediFind-controlled encrypted quarantine/scanning pipeline, short-lived authorised retrieval and lifecycle deletion; never send prescription files to public analysis/scanning services.
- Data services: private managed Firestore and private encrypted Cloud Storage in Sydney where supported; mobile clients have no broad direct database/object-store/secret-store access.
- Notification adapters: generic direct FCM/APNs push prompts authorised re-fetch for buyers/pharmacy staff; authenticated in-app state remains authoritative. There is no transactional pharmacy-email notification dependency in MVP. A future generic email fallback requires separate need, processor, domain-authentication and cost approval. No persistent realtime channel is used in MVP.
- Location/maps adapter: Suva pharmacy discovery and directions without exposing buyer location to pharmacies unless the buyer explicitly shares it.
- Permissions: just-in-time notifications, foreground approximate location, camera and scoped system picker only; each feature has the documented decline/manual fallback and no broad/background permissions.
- Admin operations: a protected, role-restricted mobile workspace for verification, moderation, support lookup and immutable audit review.
- Public support presence: a static, no-account website for legal notices, support, status and security reporting only; it is not an application workflow or personal-data collection surface.
- Safety controls: an audited emergency kill switch that can disable prescription uploads and reservations independently while leaving non-sensitive pharmacy search available.

## Vendor decision gates

Firebase/Google Cloud is the selected low-cost MVP platform. The [free-first production architecture](free-first-production-architecture.md) fixes the approved pilot services, no-cost allowances, paid exceptions and scale triggers. Before activating real prescriptions, verify the then-current Firebase/GCP service configuration, regional placement, authentication/Identity Platform configuration, data residency/transfer, encryption, access controls, deletion, support access, cost, service availability in Fiji, exportability and incident commitments. Prefer Australia or New Zealand hosting for prescription and application data, subject to Fiji legal/privacy review and vendor controls; do not select a free US-only data location. Prefer managed services over self-hosted servers where they pass these gates and retain adequate data exportability.

## Environment and account ownership

Maintain separate development, closed-beta and production environments with separate credentials, secrets, storage and notification configuration. Real buyer accounts, pharmacy records and prescription files are prohibited from development and synthetic beta. Use synthetic, non-sensitive test data only outside production. A billing account may be attached to preserve the same service architecture and no-cost allowances; billing status never authorises real data.

The founder directly owns and controls the Apple Developer, Google Play, cloud, domain, email, push-notification and other critical vendor accounts. Each account uses MFA and founder-controlled recovery details. Contractors may receive time-limited least-privilege access, never sole ownership or sole recovery control.

The pilot supports iOS 15 or later and Android 10 or later. Validate the final supported-version policy against the selected React Native/Expo release and authentication/security controls before development begins.

## Non-functional acceptance

The production design must support API versioning, monitoring, backup/restore tests, least-privilege service identities, rate limits, structured security logs, and graceful low-connectivity behaviour. It must meet and measure the [pilot performance and reliability targets](performance-and-reliability-targets.md). It must not put prescription content in push notifications, email bodies, analytics events, crash reports or client logs. The design must also prevent protected screens and prescription previews from being exposed in app switchers, screenshots where platform controls allow it, or notification previews. After reconnect or app reopen, sensitive screens/actions re-fetch and authorise against current server state before display or mutation.

Use encrypted daily backups with an initial 30-day retention period, pending final legal advice on prescription-record retention. The low-cost pilot recovery-point objective (RPO) is a maximum 24-hour data-loss window. Complete a full production-equivalent restore test before pilot launch and at least quarterly thereafter; record the result, recovery time and any corrective action. The recovery-time objective (RTO) for core service is one business day; prescription/reservation functions remain disabled until integrity, authorization and audit checks pass.

The MVP has no active multi-region failover. Sydney is the primary region; a regional outage uses the tested restore procedure, sensitive-function disablement and transparent status communication. Any active multi-region design requires a separate cost, privacy/legal and operational decision.
