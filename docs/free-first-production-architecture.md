# Free-first production architecture

## Decision

MediFind uses a **free-first, scale-in-place** architecture. A service is suitable when it can begin inside a durable no-cost allowance, preserves the required privacy/security controls, and can move to paid usage without replacing the application contract or migrating solely because the pilot succeeded.

“Free-first” does not mean “no billing account” or “free at any cost.” The production Firebase/GCP project uses Blaze/pay-as-you-go billing with hard application limits, quotas, budgets and circuit breakers. It may still incur no or very low usage charges while inside provider allowances. Trial credits are excluded from the baseline because they expire.

No-cost options are automatically preferred where they satisfy this document. A free tier must never justify putting prescription data in an unapproved region, removing backups, weakening MFA, exposing a backend, using a public scanning service, adding advertising/tracking, or accepting an unreviewed processor.

Pricing and quotas below were verified on 2026-08-16 and must be checked again immediately before provisioning and at every quarterly cost review.

## Approved service map

| Capability | Approved pilot choice | Pilot cost posture | Production-scale path without product rewrite |
| --- | --- | --- | --- |
| Mobile application | TypeScript, React Native and Expo Prebuild/CNG | Open-source toolchain; no framework licence fee | Keep the shared codebase; scale build/release capacity independently |
| Native builds/submission | Expo EAS Free for low-frequency signed beta builds; local builds remain a fallback | Current Free plan includes up to 15 Android and 15 iOS builds and store submission | Move to EAS Starter/Production or founder-controlled CI; no app rewrite |
| Source and CI | Private GitHub Free plus GitHub Actions for synthetic work | 2,000 Linux Actions minutes and 500 MB artifact storage per month | Upgrade repository controls/minutes or use a reviewed runner; workflows remain portable |
| API edge | One regional Google Cloud API Gateway using its generated hostname | First 2 million calls per billing account/month are currently no-cost | Usage bills per call; add custom domain, external load balancer and Cloud Armor when triggered |
| API compute | TypeScript/Fastify on Sydney Cloud Run, request-based billing, minimum instances `0` | Cloud Run monthly CPU/RAM no-cost allowance may cover the pilot; Sydney usage consumes the allowance at region pricing | Increase max instances/concurrency and pay for usage; same container/API |
| Operational database | Sydney Firestore Standard, default database | One database receives 1 GiB storage, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day and 10 GiB monthly egress at no cost | Firestore bills beyond quota and scales without a database-engine migration |
| Medicine search | Server-generated normalized public-search projection and explicit Firestore indexes | Uses the existing Firestore quota; no external search SaaS or query-history processor | Keep a backend-owned search interface and add a private managed index only when measured quality/latency/volume triggers it |
| Identity | Firebase Authentication upgraded to Identity Platform | Email/custom Tier-1 identity is no-cost through 50,000 MAU; TOTP MFA uses the same platform | Pay per MAU above the threshold; no identity migration |
| Identity/security email | Firebase Authentication templates using the verified MediFind custom domain for sender/action links | Uses the existing identity service and its sending limits; no separate workflow-email SaaS | Generate action links and add an approved SMTP/API adapter only if provider limits/control require it |
| Fiji phone verification | Firebase/Identity Platform phone authentication | Usage-based and **not assumed free**; first 10 SMS/day are currently unbilled, then Fiji is currently USD 0.18 per SMS | Same provider supports higher volume; assess negotiated/local provider only through a future adapter ADR |
| App attestation | Firebase App Check with App Attest/DeviceCheck and Play Integrity | App Check itself is no-cost, subject to attestation-provider quotas | Request quota increases or paid attestation capacity; keep backend verification contract |
| Push notifications | Direct FCM and APNs, generic payloads only | No FCM fee; APNs has no separate message fee | Same push adapters at scale; in-app API state remains authoritative |
| Prescription objects | Private Sydney Cloud Storage buckets | **Paid from first real byte/operation** because Google Cloud Always Free storage is restricted to eligible US regions | Same regional object store and IAM model scale with usage |
| Backups and restore | Firestore scheduled backups plus controlled object backup/lifecycle as legally approved | **Paid from activation**; Firestore backup/PITR/restore has no free quota | Increase retention/frequency and add disaster-recovery capability without changing domain/API contracts |
| Secrets | Google Secret Manager with dedicated least-privilege identities | First six active versions and 10,000 access operations/month are currently no-cost | Pay small usage charges beyond allowance; same access model |
| Container images | Regional Artifact Registry with aggressive old-image retention | First 0.5 GiB/month per billing account is currently no-cost | Pay for additional retained images; release format stays the same |
| Logs and metrics | Cloud Logging/Monitoring with redaction and sampling | First 50 GiB logging ingestion/project/month is currently no-cost | Pay for volume/retention or route approved archives; event contracts remain unchanged |
| Crash reporting | Firebase Crashlytics with tested redaction | No-cost Firebase product | Retain or replace behind the telemetry adapter if legal/scale needs change |
| Malware scanning | ClamAV in a private Sydney Cloud Run Job, one bounded execution per scan | ClamAV is open source; small job usage may remain in Cloud Run allowances; signature/object storage can be billable | Add private Cloud Tasks dispatch when measured backlog/recovery needs justify it, then increase job capacity or replace the scanner behind the same fail-closed interface |
| Scheduled work | Two private Cloud Scheduler jobs: 15-minute idempotent reconciliation to a dedicated scale-to-zero maintenance service, and six-hour ClamAV signature-updater Job | Both fit within the current first-three-jobs billing-account allowance; short reconciliation is request-billed and the bounded updater runs only four times/day | Split schedules/workers or increase capacity only when operations require it; state rules and scanner interface stay unchanged |
| Infrastructure as code | OpenTofu plus Firebase CLI/provider-supported configuration | OpenTofu and provider CLIs are open source/no-licence-cost | Retain declarative resources and reviewed plans; a future automation platform can consume the same configuration |
| Deployment identity | GitHub Actions OIDC through Google Workload Identity Federation | No stored cloud key and no additional identity SaaS | Narrow conditions/service accounts per environment and scale runner capacity independently |
| Public support site | Static Cloudflare Pages site, no Functions, forms, cookies or analytics | Static requests are currently free/unlimited; Free plan permits 500 builds/month | Paid Pages/Workers or another static host can serve the same generated assets; no app workflow depends on it |
| Directions | OS-native map links/intents using verified branch coordinates | No embedded map, routing or geocoding API fee | Add an approved maps adapter later only when in-app mapping has demonstrated value |
| Product analytics | Server-produced privacy-minimised aggregate counters plus app-store operational statistics | Uses existing database/monitoring allowances; no analytics SDK or data broker | Export approved aggregates to a warehouse when volume/analysis justifies it |
| Feature configuration | Server-owned configuration in the API/Firestore; build-time non-secret config in repository | Uses existing services | Add a dedicated configuration service only if operational evidence requires it |
| Pharmacy notifications | Generic FCM/APNs plus authenticated in-app inbox/status | No transactional-email provider in the MVP notification path | Add a domain-authenticated email adapter only after need, processor and cost approval |

Official references: [Firebase pricing](https://firebase.google.com/pricing), [Identity Platform pricing](https://cloud.google.com/identity-platform/pricing), [Firestore pricing](https://cloud.google.com/firestore/pricing), [Cloud Run pricing](https://cloud.google.com/run/pricing), [API Gateway pricing](https://cloud.google.com/api-gateway/pricing), [Cloud Storage pricing](https://cloud.google.com/storage/pricing), [Cloud Scheduler pricing](https://cloud.google.com/scheduler/pricing), [Cloud Tasks pricing](https://cloud.google.com/tasks/pricing), [Cloud Logging pricing](https://cloud.google.com/logging), [Secret Manager pricing](https://cloud.google.com/secret-manager/pricing), [Artifact Registry pricing](https://cloud.google.com/artifact-registry/pricing), [Expo pricing](https://expo.dev/pricing), [GitHub included usage](https://docs.github.com/en/billing/reference/product-usage-included), [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/) and [Cloudflare static asset pricing](https://developers.cloudflare.com/pages/functions/pricing/).

Firebase supports a verified custom domain in authentication email `From` fields and action links, which satisfies the anti-phishing domain requirement without a second sender for MVP identity mail. See [Firebase custom authentication email domains](https://firebase.google.com/docs/auth/email-custom-domain).

## Public API security at the free-first edge

The pilot request path is:

`mobile app -> API Gateway -> private Cloud Run API -> private Firestore/Cloud Storage/internal jobs`

- API Gateway is the only public MediFind business-API endpoint. The Cloud Run API requires IAM invocation from the gateway's dedicated service account and does not grant unauthenticated/public invocation.
- Protected gateway operations validate Firebase JWT issuer, audience, signature and expiry. API Gateway supplies the verified identity result to the private backend; the backend accepts that identity context only because IAM proves the caller is the configured gateway. It still derives MediFind roles/branches server-side.
- Cloud Run independently verifies the Firebase App Check token, validates the allow-listed request schema and size, enforces per-account/device/IP/action abuse limits, authorization, version/idempotency rules and audit emission.
- Do not embed an API key as a security credential in the mobile app. Gateway-wide/provider quotas are cost containment, not a substitute for application rate limits.
- Application rate limits must use persistent server-side per-actor/action/window records keyed by pseudonymous account/device/IP subjects; they must not depend on one Cloud Run instance's memory. Avoid one global hot document. Use sharded/rolled-up counters only for global monitoring and cost signals, not as the sole per-request authorization decision.
- Logs contain opaque request/security references only. Costly routes have stricter concurrency, quota and circuit-breaker controls.
- The gateway's generated HTTPS hostname is used initially. A custom API domain is not required for mobile operation.

Google documents direct Firebase JWT validation in API Gateway and a private Cloud Run backend invoked only by the gateway service account. See [Firebase user authentication](https://cloud.google.com/api-gateway/docs/authenticating-users-firebase) and [securing backend services](https://cloud.google.com/api-gateway/docs/securing-backend-services).

Cloud Armor is an additive hardening upgrade, not an MVP dependency. Add an external Application Load Balancer, custom API domain and Cloud Armor Standard before the gateway when any of these occurs:

- the independent security assessment or Fiji legal/privacy review requires managed WAF rules;
- observed attack traffic cannot be safely contained by gateway, App Check and API controls;
- public launch materially exceeds the closed pilot threat/traffic model;
- a custom API domain or edge policy is operationally required; or
- the fixed load-balancer/WAF cost fits an approved funded budget.

The upgrade must block bypass of the load balancer/default paths and is tested before traffic cutover. Current base pricing includes USD 0.025/hour for the first global forwarding rules, plus Cloud Armor policy/rule/request charges, so it is deliberately excluded from the FJD 50–100 pilot baseline. See [load-balancer pricing](https://cloud.google.com/load-balancing/pricing) and [Cloud Armor pricing](https://cloud.google.com/armor/pricing).

## Free developer and security toolchain

The private repository stays on GitHub Free during documentation and synthetic-only work. GitHub Actions uses Ubuntu jobs, concurrency cancellation, dependency caching and short artifact retention to remain inside the current allowance. macOS CI is not part of the free baseline; signed iOS beta builds use the EAS allowance or an approved founder-controlled Mac.

Use no-cost, pinned security tools in normal CI rather than depending on paid private-repository CodeQL:

- GitHub dependency graph, Dependabot alerts and reviewed Dependabot update PRs;
- [Gitleaks](https://github.com/gitleaks/gitleaks) for repository/history secret detection;
- [Trivy](https://github.com/aquasecurity/trivy) for dependency, container, filesystem, secret and infrastructure-misconfiguration scanning and SBOM evidence;
- package-manager audit plus lockfile/allow-list checks;
- [OWASP ZAP](https://www.zaproxy.org/) against the synthetic deployed API when that environment exists;
- [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) or applicable OWASP MASTG tooling for signed synthetic mobile builds; and
- Syft/CycloneDX-compatible SBOM generation if Trivy's SBOM output does not meet the release evidence need.

Pin third-party GitHub Actions to full commit SHAs, grant job-level minimum permissions and review tool/database download provenance. Free automated tools supplement rather than replace the required independent human security assessment before real prescriptions.

GitHub Free does **not** enforce protected branches/rulesets on a private repository, and private CodeQL scanning requires paid GitHub security capability. During synthetic-only solo work, the founder and Claude follow PR-only process controls and never push implementation directly to `main`. Before cloud-connected or sensitive implementation begins, choose and record one of these gates:

1. upgrade the private repository to GitHub Pro or another plan that provides enforced branch protection; or
2. explicitly approve a public-source repository after intellectual-property and security review, where GitHub Free branch protection/code scanning is available.

Repository visibility must never be changed automatically merely to save money.

See GitHub's current [protected-branch availability](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches) and [private code-scanning requirement](https://docs.github.com/en/code-security/reference/code-scanning/troubleshoot-analysis-errors/private-repository-enablement).

## Search, background work and infrastructure growth

V1 search does not need a second database. The API queries a server-generated public projection containing approved canonical identifiers, normalized tokens/aliases, branch coordinates, price, availability, freshness and only the fields allowed in public results. Exact normalized matches and approved aliases are resolved before deterministic ranking. The projection is rebuilt idempotently from authoritative listing/concept records and never stores a buyer's query or location. Firestore is not treated as an unrestricted full-text search engine: fuzzy matching is limited to curated aliases and safe normalized tokens.

The API owns an internal search boundary so mobile contracts and domain ranking rules do not depend on Firestore syntax. Add a private managed search index only if representative measurements repeatedly miss the approved quality/latency targets, index/write amplification threatens the cost ceiling, or national-scale catalogue volume makes the projection impractical. A future index receives only the minimum public projection, stays in an approved region/processor path and must preserve no-sponsored-ranking and no-query-history rules.

Use one Cloud Scheduler job in `australia-southeast1` every 15 minutes to invoke a dedicated IAM-private, minimum-instances-`0`, idempotent Cloud Run maintenance service through an OIDC scheduler identity. Keep it separate from the business API so the scheduler's `run.invoker` grant cannot call buyer/staff routes. A run processes bounded pages for stale-listing transitions, request/reservation expiry, deletion/retention reconciliation, orphaned scan recovery and aggregate roll-ups; it records a cursor/run ID and safely resumes after failure. User reads also calculate effective expiry/staleness from server time, so a delayed schedule never makes an expired record valid.

Use a second Sydney Cloud Scheduler job every six hours to invoke a dedicated, bounded ClamAV signature-updater Cloud Run Job. The scheduler identity can execute only that updater; the updater can retrieve the approved ClamAV source and write only the private signature mirror; scanner identities can read but not alter the mirror. Alert on an update failure and fail scans closed when the last verified definitions exceed the approved 24-hour maximum age. Production uses two of the current three no-cost Scheduler jobs per billing account. Non-production schedules stay paused/manual unless a synthetic test needs them; any additional job is explicitly costed (currently USD 0.10/job/month) rather than weakening isolation.

Keep one bounded Cloud Run Job per prescription scan for the pilot. If dispatch loss/recovery, queue delay or throughput becomes material, place an authenticated regional Cloud Tasks queue in front of the same opaque scan command; its first one million operations/month are currently no-cost. No task contains prescription content or a reusable object URL. This is an operational adapter, not a change to the upload/request API.

Use OpenTofu for supported GCP resources and provider/CLI-owned declarative files for Firebase/App Check gaps. Store production state in a dedicated private, versioned Sydney GCS bucket with uniform access, least privilege and no public access; state is sensitive, never committed, printed in logs or copied to development. The tiny regional state bucket is billable and is preferred over unsafe local/US-only free state. GitHub Actions authenticates through repository/environment-restricted OIDC and Google Workload Identity Federation, never a long-lived service-account JSON key. Production apply requires founder approval and uses a separate least-privilege deploy identity.

References: [Cloud Scheduler free usage](https://cloud.google.com/scheduler/pricing), [secure scheduled Cloud Run services](https://cloud.google.com/run/docs/triggering/using-scheduler), [Cloud Tasks pricing](https://cloud.google.com/tasks/pricing), [authenticated Cloud Tasks targets](https://cloud.google.com/tasks/docs/creating-http-target-tasks), [OpenTofu GCS backend](https://opentofu.org/docs/language/settings/backends/gcs/) and [Google Workload Identity Federation for deployment pipelines](https://cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines).

## Costs that are not removed

| Cost | Why it remains |
| --- | --- |
| Fiji verification SMS | Phone ownership is an accepted identity requirement; Fiji delivery is usage-priced and must be tested on local networks. |
| Sydney prescription storage and operations | The US-only Always Free location is incompatible with the approved Australia-region privacy/data path. |
| Backups, PITR/restore and restore testing | Firestore explicitly excludes these from free quota; omitting recovery is not acceptable. |
| Apple/Google developer accounts | Required for official TestFlight/Play closed distribution; already outside the infrastructure ceiling. |
| Domain and authenticated business email | Required for public trust, legal notices, support and anti-phishing controls; already separately budgeted. |
| Legal/pharmacy/privacy review, professional translation and independent security assessment | These are human assurance gates, not replaceable by free software or AI output. |
| Private GitHub branch enforcement | Required before sensitive/cloud-connected code unless public-source release is explicitly approved. |

## Cost model and controls

Maintain a monthly worksheet using actual billing exports, not optimistic estimates:

- `identity_cost = Fiji_SMS_sent_billable × current_Fiji_SMS_rate + MAU_over_free_tier × current_MAU_rate`
- `edge_cost = gateway_calls_over_free_tier × current_gateway_rate + network_egress`
- `compute_cost = Cloud_Run_service_and_job_usage_after_billing-account_allowance`
- `data_cost = Firestore_usage_after_quota + Sydney_object_storage/operations/egress + backup/restore`
- `delivery_cost = build/CI usage after allowance + retained artifacts/images`
- `operations_cost = logging/secret/monitoring usage after allowance`

Set provider quotas/max instances before launch and preserve the 50/80/100% cost circuit breaker. Billing alerts can lag and do not cap spend. Do not disable billing automatically because that can also disable safety, recovery and data-access functions.

## Scale and upgrade triggers

Review capacity/cost at least monthly and before expanding beyond 2–3 pilot pharmacies. Upgrade deliberately when forecast usage reaches 70% of any no-cost allowance or operational limit, when the last 30 days show sustained p95/reliability pressure, or when an assurance review requires a stronger tier.

Track at minimum:

- authenticated MAU, SMS sent/verified/blocked and cost per verified buyer;
- gateway calls and rejected/abusive traffic;
- Cloud Run CPU/RAM/job time, cold starts, concurrency and max-instance rejection;
- Firestore reads/writes/storage/index growth and query cost;
- search zero-result/normalization quality, p95 latency, projection lag and index amplification;
- prescription object/backup/log volume and retention growth;
- maintenance duration/backlog/cursor age, scan dispatch delay and oldest quarantined item;
- signature update success/source/version/age and stale-definition blocks;
- App Check attestation use/failures (Play Integrity standard quota is currently 10,000/day; see [App Check provider guidance](https://firebase.google.com/docs/app-check/android/play-integrity-provider));
- CI minutes/artifact storage, EAS builds and security-scan duration; and
- public-site builds and availability.

Crossing a free limit is a planned billing event, not a migration event. Vendor replacement is considered only for a documented reliability, compliance, functionality, support or material total-cost reason.

## Alternatives deliberately rejected for MVP

- Do not place production prescription files in a free US storage region.
- Do not replace the integrated Firebase identity/App Check/Firestore stack with a second free hosted database/auth provider merely to avoid negligible pilot usage charges.
- Do not run an always-on low-cost VM; it adds patching, availability and incident workload to a sole-operator project.
- Do not use public Nominatim, scraping or an unapproved free geocoding service. Verified coordinates plus native map intents meet v1 needs.
- Do not upload prescriptions to VirusTotal or any public/free malware-analysis service. ClamAV remains inside the private project.
- Do not add a free transactional-email, analytics, session-replay, chat or support SaaS to the sensitive workflow.
- Do not rely on expiring cloud credits, a free database that sleeps/pauses, or a provider whose free-to-paid path changes the application data model.
- Do not depend on over-the-air JavaScript updates for MVP safety fixes. Use reviewed signed store builds, minimum-version controls and server-side kill switches.

## Review evidence

Before each environment is created, record current official price URLs, region, quota, billing-account aggregation rule, privacy/processor approval, cost owner, alert/quota configuration, export/exit procedure and scale trigger in the processor/vendor register. A pricing page is evidence for cost only; it is not evidence of legal suitability, security configuration or service availability in Fiji.
