# Cost and environment plan

## Budget objective

Target zero usage charges for local development and synthetic closed-beta work, then keep real-pilot infrastructure within the founder-approved FJD 50–100 monthly ceiling wherever actual usage permits. This ceiling excludes Apple/Google developer accounts, domain/business email, SMS/phone verification and separately approved legal, translation and security-assessment costs.

Configure budget notifications at 50%, 80% and 100% of the approved ceiling and implement the [cost circuit breaker](cost-circuit-breaker-policy.md). Unexpected spend is an operational/security incident because it can indicate abuse, configuration drift or a runaway workload.

The complete service-by-service choice, current allowance and scale path is the [free-first production architecture](free-first-production-architecture.md). Provider pricing and quotas change; verify official sources before provisioning and quarterly thereafter.

## Free-first rules

- Prefer a durable no-cost allowance on the chosen production-capable service over a trial, sleeping database or throwaway platform.
- A Blaze/pay-as-you-go billing account is required for production even when most usage falls inside no-cost allowances. Billing enables phone authentication, Cloud Run, regional storage, backups and scale; it does not authorise real data by itself.
- Exclude introductory credits from every baseline forecast.
- Crossing an allowance should create a usage charge, not force an emergency migration.
- Never move prescription or identity data to a free US-only region, remove recovery/security controls, expose a backend, or introduce an unreviewed processor to make a bill appear to be zero.
- Measure cost per successful user/pharmacy workflow, not only total cloud spend.

## Selected production-capable stack

Use Firebase/Google Cloud in Sydney (`australia-southeast1`) where supported:

- API Gateway is the only public business-API endpoint. It validates Firebase JWTs and calls IAM-private Cloud Run through a dedicated gateway service account. The first 2 million calls/month are currently no-cost.
- TypeScript/Fastify Cloud Run uses request-based billing, minimum instances `0`, conservative concurrency and max instances. Pilot usage may fit the Cloud Run CPU/RAM allowance.
- Firestore Standard's default Sydney database is server-accessed only and currently includes one free-quota database per project.
- Firebase Authentication with Identity Platform provides verified email and TOTP MFA with the first 50,000 Tier-1 MAU currently no-cost. Fiji verification SMS remains usage-priced; first 10 sent per day are currently unbilled and subsequent Fiji SMS are currently USD 0.18 each.
- Firebase Authentication email templates use the verified MediFind custom domain for sender/action links. Do not add a second transactional provider for identity or workflow notifications unless Firebase limits/control create an approved need.
- Firebase App Check, FCM and Crashlytics are currently no-cost products subject to provider quotas/configuration and privacy controls.
- Prescription/quarantine objects stay in private Sydney Cloud Storage. This is billable because Cloud Storage Always Free applies only in eligible US regions.
- Firestore backups/PITR/restore are billable and mandatory before real prescriptions; Firestore does not include them in free quota.
- Secret Manager, Artifact Registry and Cloud Logging begin inside their current small no-cost allowances and charge usage beyond them.
- ClamAV scanning runs as a bounded private Cloud Run Job. It is open source, but job/signature/object usage is measured and may be billable.
- Two private Sydney Cloud Scheduler jobs invoke a 15-minute request-billed scale-to-zero reconciliation service and a six-hour bounded ClamAV signature-updater Job. Production therefore fits inside the current first-three-Scheduler-jobs billing-account allowance; non-production schedules remain manual/paused unless explicitly costed.
- OpenTofu and Firebase declarative configuration carry no licence fee; production state uses a tiny private Sydney GCS bucket and is billable rather than unsafe local or US-only free state. GitHub-to-GCP deployment uses OIDC/Workload Identity Federation instead of stored keys.

Use Cloudflare Pages for the static public support/legal/status/security site with no Functions, forms, cookies or analytics. Use OS-native map links/intents rather than an embedded or server-side maps API. Use direct generic FCM/APNs plus the in-app inbox/status path for pharmacy and buyer operational notifications; no transactional-email provider is required for MVP workflow notifications.

## Environment policy

| Environment | Data | Billing/cost posture | Required isolation |
| --- | --- | --- | --- |
| Local | Fictional fixtures only | Open-source tools and Firebase emulators; target FJD 0 | No cloud/production credentials; App Check debug tokens private |
| Development | Synthetic only | Separate project; use no-cost allowances and zero/low quotas | Separate service accounts, app registrations, secrets and storage |
| Closed beta | Synthetic/non-sensitive until all real-data gates pass | Separate billed project if needed to exercise production-capable services; target no-cost allowances | App Check enforced, invite-only testers, no production copies |
| Production pilot | Approved real buyer/pharmacy/prescription data only | Separate Blaze project; paid exceptions enabled with quotas/budgets | Sydney data path, legal/processor approval, backups, MFA, audit and incident controls |

Never copy production data, credentials, logs, prescription objects or backups into another environment. Environment promotion moves reviewed configuration and code, not data.

## Expected cost classes

### Target no-cost at pilot usage

- React Native/Expo open-source framework and low-volume EAS Free builds;
- private GitHub Free repository/Actions allowance for synthetic work;
- API Gateway calls within the first 2 million/month;
- Cloud Run service/job compute inside the billing-account allowance;
- Firestore operations/storage/egress inside its project quota;
- Identity Platform Tier-1 MAU up to the current 50,000 threshold;
- App Check, FCM/APNs and privacy-redacted Crashlytics;
- Cloud Logging up to its current 50 GiB/project/month allowance;
- first six Secret Manager versions/10,000 monthly accesses;
- first 0.5 GiB Artifact Registry storage;
- static Cloudflare Pages assets; and
- native directions, the Firestore public-search projection, two production Cloud Scheduler jobs and server-produced aggregate product counters.

### Usage-priced or required paid from real pilot

- Fiji SMS after the provider's daily unbilled amount;
- Sydney Cloud Storage bytes, operations and applicable egress;
- the private Sydney OpenTofu state bucket;
- Firestore scheduled backups/PITR/restore and restore exercises;
- any usage beyond aggregated/project no-cost quotas;
- a private-GitHub plan with enforced branch protection before cloud-connected/sensitive code, unless public source is explicitly approved;
- domain, business email, developer accounts and independent/human assurance work outside the infrastructure ceiling.

## Cost containment

- Configure billing-account/project budgets, service quotas, Cloud Run max instances, job concurrency/retries, API route limits and storage/log lifecycle rules before enabling a feature.
- Use the API Gateway generated hostname until a custom domain/load balancer is justified. Defer Cloud Armor's fixed load-balancer/policy cost until a documented security/scale/funding trigger.
- Persist buyer sessions safely so SMS is used for initial verification, recovery or risk-triggered re-verification rather than every app open.
- Allow SMS only to Fiji through Identity Platform's allowlist-only region policy, enforce App Check on Authentication, monitor provider sent/blocked/verified signals and use a tested provider-level disable/quota action for the SMS breaker. The business API alone cannot intercept every SDK/provider send.
- Use direct FCM/APNs and in-app status instead of a transactional notification SaaS.
- Retain only approved prescription data and apply lifecycle deletion after legal approval; never weaken mandatory backup/retention to save cost.
- Use public-result pagination/indexes and avoid realtime listeners/background polling to control Firestore/API/network consumption.
- Use one bounded idempotent maintenance schedule; calculate expiry/staleness at read time so correctness does not depend on a cron run.
- Set log exclusions, redaction, sampling and short operational retention without suppressing mandatory audit/security evidence.
- Prune superseded container images/build artifacts while retaining release evidence required for rollback/investigation.
- Review spend, quota consumption, storage/log growth and projected 30/90-day usage monthly.

## Cost worksheet

The founder records actual monthly units, free allowance consumed, billable units, price source/date and FJD invoice amount for:

1. authentication MAU and SMS sent/verified/blocked;
2. gateway calls and outbound traffic;
3. Cloud Run API/maintenance CPU/RAM/requests and scanning/updater Job CPU/RAM/executions;
4. Firestore reads/writes/deletes/storage/index/egress, including search projection and rate-limit/roll-up amplification;
5. object/quarantine/signature/IaC-state/backup storage, operations, egress and restores;
6. Scheduler/Tasks operations, logging, secrets, artifacts/builds and public site;
7. unexpected/abusive usage and circuit-breaker actions.

Forecast at 1×, 5× and 10× current pilot usage. Start a capacity/cost decision before any service reaches 70% of its no-cost allowance or configured safe quota.

## Production gates

Before collecting real prescriptions, approve and record:

- current service prices/quotas, Sydney placement and transfer path;
- processor terms and privacy/legal suitability;
- Firebase/Identity Platform/App Check configuration and Fiji SMS delivery evidence;
- API Gateway/private Cloud Run IAM trust chain and application rate limits;
- storage quarantine, ClamAV definitions/job limits and fail-closed behaviour;
- paid scheduled backup/restore configuration and successful restore test;
- budgets, 50/80/100 alerts, cost circuit breaker and kill switches;
- founder-owned billing/recovery access and incident contacts; and
- data export/exit procedure for every stateful service.

If mandatory production controls cannot fit the approved budget, keep the pilot in discovery/reservation-only or synthetic prescription mode and seek funding. Do not accept real prescription data under a weaker configuration.

## Growth path

Firebase/Google Cloud remains the default as usage grows because the chosen services bill beyond their no-cost allowances without changing the app's API/domain model. Upgrade EAS/GitHub/edge capacity when operational triggers are met. Consider another platform only through a documented comparison covering compliance, reliability, migration/egress, total operating labour and cost—not simply because a free quota was crossed.

## Processor/vendor register

Before production, record service owner, purpose, data categories, region/transfer, privacy/security terms, cost/quota source and verification date, access roles, retention/deletion, support/incident contact, export/exit procedure and scale trigger for every processor. The public privacy notice reflects the current register. Advertising, data brokers, session replay and behavioural profiling remain prohibited.
