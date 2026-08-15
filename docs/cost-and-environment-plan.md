# Cost and environment plan

## Pilot cost constraint

Design the MVP infrastructure around a FJD 50–100 monthly ceiling. This excludes Apple/Google developer-account fees, domain registration, SMS/phone-verification charges and any separately approved legal/security assessment. Configure billing budgets and alerts at 50%, 80% and 100% of the approved monthly ceiling. Treat an unexpected-cost alert as an operational incident: investigate, contain and document it before raising the limit.

## Chosen MVP platform

Use Firebase/Google Cloud as the low-operations MVP platform. Production application data is located in Google Cloud Sydney (`australia-southeast1`) where supported: Firestore for operational data and private Cloud Storage for prescription files. Use Google-managed encryption at rest with strict IAM/private access in the MVP; evaluate customer-managed keys only if Fiji legal/privacy review requires them. The mobile app uses Firebase Authentication; a TypeScript API deployed as a regional managed backend is the policy-enforcement point. It authenticates each caller, verifies Firebase App Check, performs all authorization and writes data using server credentials. The app is not granted broad direct Firestore or Storage access.

Use Firebase App Check from initial development and enforce it before the closed beta. It complements authentication by attesting that a request comes from the genuine app; it does not replace server-side authorization. [Firebase App Check](https://firebase.google.com/products/app-check)

Privileged authenticator-app MFA uses Firebase Authentication with Identity Platform. This is a paid production capability and is required before pharmacy-owner, prescription-reviewer or admin access is activated. [Firebase TOTP MFA](https://firebase.google.com/docs/auth/web/totp-mfa)

## Environment policy

- **Development:** separate no-cost/lowest-cost Firebase/GCP project, synthetic data only, debug attestation tokens kept out of source control and never shipped.
- **Closed beta:** separate invite-only Firebase/GCP project; synthetic/non-sensitive workflows may use the low-cost tier; enforce App Check and use separate project credentials.
- **Real-prescription production:** separate billed Firebase/GCP project; Sydney regional data configuration, privacy/legal/vendor approval, private storage, backup/restore, MFA, audit/monitoring, cost budget and security release gates must all be complete before collection.

Free or paused tiers are never an approved home for real prescription data. If the approved production controls cannot operate within the cost ceiling, do not accept real prescriptions; restrict the pilot to non-sensitive discovery/reservation testing while funding or pricing is revisited.

## Cost controls

- Prefer serverless/scale-to-zero compute, managed authentication and usage-based storage over always-on instances.
- Store only approved, necessary prescription data; apply retention/deletion rules promptly after legal approval.
- Use direct APNs/FCM generic notifications, avoiding medical payloads and extra notification intermediaries.
- Set per-service quotas, API request-size/rate limits and budget alerts to contain denial-of-wallet abuse.
- Apply per-user and global daily/monthly OTP/SMS limits. Before the approved threshold is exceeded, automatically pause new verification sends, alert the founder and show users a safe retry/support message.
- Review spend, active services, SMS usage, storage growth and logs monthly; delete unused development resources and revoke unused credentials.
- Budget for a founder-controlled domain and authenticated operational email; configure SPF, DKIM and strict DMARC before sending production messages.

## Growth trigger

Re-evaluate the platform when the pilot approaches its cost ceiling, compliance requirements outgrow the managed configuration, pharmacy subscriptions begin, or the product expands beyond the Suva pilot. A move to AWS or another dedicated platform is a separately documented migration, never an emergency rewrite.

## Processor register

Before any production data collection, create and maintain a processor register. For each service, record service name, owner, purpose, data categories, regional placement/transfer path, privacy/security terms, cost, access roles, retention/deletion behaviour, incident contact and exit/export procedure. The public privacy notice must accurately reflect this register. Advertising, data-broker and behavioural-profiling providers are prohibited.
