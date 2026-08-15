# Architecture decision: shared-codebase mobile pilot

## Decision

Build v1 after documentation approval as a shared-codebase mobile client that supports iOS and Android, backed by a secure API and admin workspace. Keep provider choices open until the privacy/compliance review completes.

## Required boundaries

- Mobile client: buyer and pharmacy-staff experiences, localization, device push registration and safe display of data.
- API/service layer: authentication, role enforcement, search, pharmacy verification workflow, request/reservation state machine and audit event creation.
- Private file service: encrypted prescription storage, malware scanning, short-lived authorised retrieval and lifecycle deletion.
- Notification adapters: push to buyers and secure email notification to pharmacy staff; delivery status and retry events are auditable.
- Location/maps adapter: Suva pharmacy discovery and directions without exposing buyer location to pharmacies unless the buyer explicitly shares it.
- Admin operations: verification queue, moderation, support lookup and immutable audit review.

## Vendor decision gates

Before choosing authentication, cloud hosting, storage, push, email or maps vendors, document data residency/transfer, encryption, access controls, deletion, support access, cost, service availability in Fiji, exportability and incident commitments. The selected stack must pass the security/compliance checklist and support the stated retention policy.

## Non-functional acceptance

The production design must support API versioning, monitoring, backup/restore tests, least-privilege service identities, rate limits, structured security logs, and graceful low-connectivity behaviour. It must not put prescription content in push notifications, email bodies, analytics events or client logs.
