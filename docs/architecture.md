# Architecture decision: shared-codebase mobile pilot

## Decision

Build v1 after documentation approval as a TypeScript React Native/Expo shared-codebase mobile application that supports iOS and Android for buyers, pharmacy staff, pharmacy owners and MediFind admins, backed by a TypeScript API on Firebase/Google Cloud. The mobile app must present role-appropriate workspaces after authentication; it is not a public, shared-device administration surface. Keep production data in Sydney where supported and retain vendor/legal gates for every external service.

## Required boundaries

- Mobile client: buyer, pharmacy-staff, pharmacy-owner and admin experiences, localization, device push registration and safe display of data.
- Authentication: buyer passwordless phone-code sign-in with verified-email recovery and optional device-biometric session unlock; privileged roles add authenticator/passkey MFA.
- API/service layer: TypeScript regional managed backend/API with Firebase Authentication, Firebase App Check verification, role enforcement, search, pharmacy verification workflow, request/reservation state machine and audit event creation.
- Edge/API protection: TLS-only API gateway/WAF with authentication, rate limits, schema/request-size validation, abuse controls and structured security logging before business handlers execute.
- Private file service: encrypted prescription storage, malware scanning, short-lived authorised retrieval and lifecycle deletion.
- Data services: private managed Firestore and private encrypted Cloud Storage in Sydney where supported; mobile clients have no broad direct database/object-store/secret-store access.
- Notification adapters: push to buyers and secure email notification to pharmacy staff; delivery status and retry events are auditable.
- Location/maps adapter: Suva pharmacy discovery and directions without exposing buyer location to pharmacies unless the buyer explicitly shares it.
- Admin operations: a protected, role-restricted mobile workspace for verification, moderation, support lookup and immutable audit review.
- Safety controls: an audited emergency kill switch that can disable prescription uploads and reservations independently while leaving non-sensitive pharmacy search available.

## Vendor decision gates

Firebase/Google Cloud is the selected low-cost MVP platform. Before activating real prescriptions, document the precise Firebase/GCP services, regional placement, authentication/Identity Platform configuration, data residency/transfer, encryption, access controls, deletion, support access, cost, service availability in Fiji, exportability and incident commitments. Prefer Australia or New Zealand hosting for prescription and application data, subject to Fiji legal/privacy review and vendor controls; do not select another region by default. Prefer managed services over self-hosted servers where they pass these gates and retain adequate data exportability. The selected stack must pass the security/compliance checklist and support the stated retention policy.

## Environment and account ownership

Maintain separate development, staging and production environments with separate credentials, secrets, storage and notification configuration. Real buyer accounts, pharmacy records and prescription files are prohibited from development and staging. Use synthetic or explicitly approved, non-sensitive test data only.

The founder directly owns and controls the Apple Developer, Google Play, cloud, domain, email, push-notification and other critical vendor accounts. Each account uses MFA and founder-controlled recovery details. Contractors may receive time-limited least-privilege access, never sole ownership or sole recovery control.

The pilot supports iOS 15 or later and Android 10 or later. Validate the final supported-version policy against the selected React Native/Expo release and authentication/security controls before development begins.

## Non-functional acceptance

The production design must support API versioning, monitoring, backup/restore tests, least-privilege service identities, rate limits, structured security logs, and graceful low-connectivity behaviour. It must not put prescription content in push notifications, email bodies, analytics events or client logs. The design must also prevent protected screens and prescription previews from being exposed in app switchers, screenshots where platform controls allow it, or notification previews.

Use encrypted daily backups with an initial 30-day retention period, pending final legal advice on prescription-record retention. Complete a full production-equivalent restore test before pilot launch and at least quarterly thereafter; record the result, recovery time and any corrective action.
