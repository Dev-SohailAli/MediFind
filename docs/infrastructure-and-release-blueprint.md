# Infrastructure and release blueprint

## Principle

All Firebase/GCP environments are reproducible from version-controlled configuration. Use OpenTofu for supported GCP resources and reviewed Firebase CLI/provider-owned declarative configuration where OpenTofu coverage is incomplete. Console changes are treated as exceptions, not the system of record. This prevents configuration drift, makes security review possible and lets a future engineer rebuild an environment safely.

## Configuration under version control

Before provisioning, create an implementation-owned infrastructure/configuration area that declares or scripts, as supported by each service:

- separate Firebase/GCP project identifiers and region settings for development, closed beta and production;
- Firebase Authentication/Identity Platform providers, privileged MFA and authorised domains;
- Firebase identity/security email templates, verified MediFind sender/action-link domain and required DNS records;
- Firestore collection/index/security-rule configuration and private data access policy;
- server-generated public-search projection/indexes and persistent pseudonymous rate-limit/cost-counter collections with TTL/lifecycle rules;
- Cloud Storage bucket region, private access, lifecycle/deletion and upload-quarantine policy;
- regional API Gateway OpenAPI configuration, Firebase JWT security scheme, dedicated gateway service account and service-level-only `roles/run.invoker` grant;
- private regional TypeScript Cloud Run backend, dedicated runtime service account, no `allUsers` invoker, App Check enforcement, request-based billing, minimum instances `0`, max instances and concurrency;
- private scanner Cloud Run Job, separate API/job identities, opaque job references, bounded resources/concurrency/three attempts and ClamAV signature-mirror lifecycle;
- one dedicated IAM-private idempotent maintenance Cloud Run service with minimum instances `0`, its own runtime/invoker identities and a 15-minute Sydney Cloud Scheduler OIDC trigger for stale/expiry/deletion/scan-recovery/aggregate reconciliation;
- one dedicated bounded ClamAV signature-updater Cloud Run Job with its own runtime/invoker identities and a six-hour Sydney Cloud Scheduler OAuth trigger, writing only the private signature mirror;
- API rate/request-size/OTP quotas, feature flags, audit/monitoring alerts, budget alerts, cost circuit-breaker and kill-switch configuration;
- direct APNs/FCM credentials references, not credential values;
- backup/export/restore configuration, including 24-hour RPO and one-business-day core-service RTO evidence; and
- explicit outputs needed by the mobile build, with no secrets in source control.

OpenTofu state is sensitive. Store each cloud-connected environment's state in a dedicated private, versioned Sydney GCS bucket with uniform access, retention/recovery protection and a separate least-privilege state identity. Never commit state/plan output, expose it in CI logs or share a production state bucket with development. Bootstrap the state bucket through a reviewed founder-controlled procedure, then import/record it under the infrastructure baseline.

GitHub Actions uses repository/environment-restricted OIDC and Google Workload Identity Federation with separate plan and deployment service accounts. Do not create or store a long-lived Google service-account key. Pull requests may run read-only validation/plan with synthetic configuration; production apply requires the founder-controlled GitHub environment approval and the narrowly scoped production deploy identity.

The pilot app calls the API Gateway generated HTTPS hostname. Do not provision an external load balancer, Cloud Armor or custom API domain until a trigger in the [free-first production architecture](free-first-production-architecture.md) is met. If upgraded later, make the load-balanced/Cloud Armor route the only usable public path and test that default/direct endpoints cannot bypass it.

The static public-support site is a separate Cloudflare Pages project containing generated static assets only. It uses no Pages Functions, forms, cookies, analytics, identity or application API proxy. DNS/domain ownership remains founder-controlled; deployment uses least-privilege repository access and secure response headers.

The shared app uses React Native Firebase native modules for Firebase Authentication TOTP MFA and direct FCM messaging. Therefore, all developer, beta and release validation uses an Expo development or production build generated through Expo Prebuild/Continuous Native Generation; Expo Go is not a supported MediFind runtime.

Use reviewed pull requests for configuration changes. Record every manual emergency console change, immediately reconcile it back into version-controlled configuration, and include it in post-incident review when applicable.

## Environment safety

Each environment uses its own project, service accounts, App Check app registrations, storage, data and credentials. Never copy production credentials/data into development or beta. Configuration promotion proceeds development → closed beta → production through reviewed, tested changes; it is not a console click-through.

Attach billing only where required to exercise the production-capable architecture. Use separate budgets/quotas per project and remember that some no-cost allowances aggregate across the billing account. Trial credits are ignored in forecasts. A billed beta project remains synthetic-only.

## Feature flags and kill switch

Feature flags are server-controlled, default-off for new sensitive functionality, and evaluated by the backend—not trusted from local app state. Each flag has:

- a purpose and linked task/ADR;
- owner, creation date, target audience and expiry/removal date;
- an explicit default and safe disabled behaviour;
- no sensitive data or authorization policy embedded in its client-visible value; and
- an immutable audit event for every change.

Use flags to enable a feature first for the founder/test accounts, then a specifically approved pilot pharmacy/buyer cohort. The emergency kill switch remains separate and can disable prescription upload/reservations immediately.

## Beta release sequence

1. Create a signed internal build using synthetic data and validate the approved test matrix.
2. Release to founder/test accounts only; confirm App Check, authentication, alerts, error reporting and rollback behaviour.
3. Enable the build/feature for one approved pilot pharmacy and a small linked buyer cohort.
4. Review functional, security, privacy, cost and support signals before expanding to remaining invited testers.
5. Stop rollout or roll back immediately on a high-severity security/privacy issue, unsafe clinical/prescription workflow, data-loss risk, unexpected cost or material support failure.

Every release has a documented version, commit, approved scope, environment, tester cohort, validation evidence, rollback procedure and owner. App-store beta withdrawal, server feature-flag disablement and the sensitive-function kill switch are independently tested rollback paths. A restored environment cannot re-enable prescription/reservation functions until integrity, authorization, audit and notification validation completes.

## Pre-provisioning checklist

- Current service/region/quota/price evidence, free-versus-paid classification and processor-register entry approved under the free-first architecture.
- Infrastructure/configuration review and no secrets committed.
- Separate projects and founder-controlled IAM/recovery access.
- Gateway-to-private-Cloud-Run IAM tested; unauthenticated/direct Cloud Run invocation denied.
- OpenTofu remote-state versioning/access/recovery and OIDC/Workload Identity conditions tested; no long-lived cloud key exists.
- App Check configured in development, then enforced before beta.
- Firebase Authentication App Check enforcement, Fiji-only SMS-region policy and identity custom-domain email/action links tested.
- Budget/OTP quota/monitoring alerts tested with a safe simulated event.
- Persistent distributed rate limits and the private idempotent maintenance schedule tested across multiple Cloud Run instances/retries.
- Separate updater/scanner IAM, six-hour signature schedule, verified mirror version/time and 24-hour stale-definition fail-closed alert tested.
- Sydney storage and paid backup/restore cost accepted before any real prescription; no free US storage substituted.
- Public static site verified to make no dynamic/function/analytics requests.
- Synthetic-data deployment and rollback rehearsal completed.
