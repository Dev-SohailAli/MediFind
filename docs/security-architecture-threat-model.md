# Security architecture and threat model

## Security objective and standard

MediFind handles prescription files and pharmacy operations, so it must minimise sensitive data, resist account and API abuse, and make every sensitive access attributable. The design baseline is the current [OWASP MASVS](https://mas.owasp.org/MASVS/) and testing guidance for the iOS/Android client, plus [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) for the backend/API. Apply the MASVS storage, cryptography, authentication, network, platform, code, resilience and privacy control groups that are relevant to the implemented design. This is a verification baseline, not a claim of OWASP certification.

## Assets and trust boundaries

| Asset | Required protection |
| --- | --- |
| Buyer/staff identity and sessions | authenticated, role-scoped, revocable, auditable |
| Prescription files and request metadata | encrypted, selected-pharmacy-only, short-lived access, no routine admin content access |
| Pharmacy listings, prices and reservations | authenticated branch-scoped writes, immutable change audit |
| Secrets, signing keys and service credentials | managed secret/key service, never in source/mobile build/logs |
| Audit/security events and backups | tamper-resistant access control, retention/deletion under approved policy |

The mobile app is an untrusted client. It communicates only with the MediFind API over TLS; it never connects directly to the database, object store, secret store or admin-only internal services. The API is the policy enforcement point. Database, file and provider credentials are never shipped to the app.

## Threats and required response

| Threat | Required controls |
| --- | --- |
| Stolen phone/session theft | short-lived access tokens, rotated/revocable refresh tokens, device-bound secure storage, biometric app unlock, security alerts, session revocation and recovery delay |
| Rooted/jailbroken or tampered app | integrity/root/jailbreak signals; block prescription upload/review, reservations and privileged functions; allow only non-sensitive search where safe; log privacy-preserving event and offer support |
| Account takeover or OTP abuse | phone/email verification, privileged authenticator/passkey MFA, anti-enumeration responses, rate limits, bot/abuse controls, new-device/contact/recovery alerts |
| Broken object-level or role authorization | server-side role, pharmacy, request and record ownership checks on every API call; deny by default; automated authorization tests |
| Prescription disclosure | encryption in transit/at rest, selected-pharmacy request binding, short-lived authorised file access, malware/quarantine pipeline, no content in logs/notifications/email/analytics, break-glass only |
| Injection, malformed input or API abuse | gateway authentication, App Check, allow-list schemas, server-side validation, parameterized database queries, output encoding where relevant, per-actor/action rate limits, request-size limits and cost circuit breakers; add managed WAF under recorded triggers |
| Malicious upload | type/size validation, content inspection, malware scan, encrypted quarantine, no pharmacy access to unsafe files, restricted reviewer quarantine for safely processed reviewable flags |
| Cloud/vendor or contributor compromise | least-privilege service identities, environment isolation, managed secret vault, founder-owned accounts, audit logs, dependency/secret scanning and access review |
| Data loss/ransomware/outage | encrypted daily backups, limited backup access, restore tests, incident playbooks, status page and sensitive-feature kill switch |

## Mobile-client controls

- Use platform secure storage only (iOS Keychain and Android Keystore-backed storage) for session material. Do not store prescriptions, file URLs, API secrets, passwords or sensitive request content in ordinary app storage, logs, clipboard or analytics.
- Cache only the minimum public search/listing projection for a short, documented time to improve poor-connectivity browsing. Do not persist prescription files, request/reservation details, staff/admin data or protected-screen content; never queue a sensitive mutation while offline.
- On reconnect or app resume, re-fetch and server-authorise every sensitive view/action before it is shown or changed. Cached public availability/price must remain visibly timestamped and must not be treated as current.
- Provide a devices/sessions screen for every user to review active sessions and revoke them immediately. Limit pharmacy owners, prescription reviewers and MediFind admins to two active devices; enrolling another device requires MFA and emits a security alert.
- Enforce TLS for every API/provider connection; reject clear-text traffic. Prefer modern TLS configuration managed by the selected provider. Evaluate certificate pinning only after selecting an update-safe implementation; pinning must never prevent emergency certificate rotation.
- Request only the minimum platform permissions described in the [mobile permissions policy](mobile-permissions-policy.md). Notifications are prompted only after a signed-in explanation; location is foreground approximate-only and only after nearby search; camera/scoped picker access occurs only for an upload action. Do not request contacts, microphone, SMS reading, call logs, broad media access or background location.
- Protect sensitive screens from task-switcher previews and screenshots/screen recording where platform controls allow, and redact notification content. Clearly state that the app cannot prevent someone from photographing another device. Never rely on device-side controls as the sole access control.
- Detect app integrity/root/jailbreak signals at runtime. Do not treat detection as proof or collect invasive device data; use it to gate sensitive actions and generate a reviewable security signal.
- Build reproducible release artifacts through CI, sign iOS/Android releases with founder-controlled credentials, and distribute pilot builds only through TestFlight/Google Play closed testing.

## Identity, API and data controls

- Use a managed identity provider with passwordless buyer phone-code sign-in and verified-email recovery. Invite privileged pharmacy/admin users by phone but require verified personal email as their primary sign-in provider and authenticator-app/passkey MFA as their second factor; use short-lived access tokens, refresh-token rotation and server-side session revocation.
- Privileged pharmacy-owner and MediFind-admin sessions expire after eight hours and require MFA again. Buyer sessions may persist longer for usability but remain device-bound, revocable and subject to the documented recovery/security controls.
- Require fresh MFA for high-risk actions: staff invitation/removal or role change, pharmacy ownership/contact changes, new privileged-device approval, privileged account recovery and break-glass access. Require biometric unlock before a prescription reviewer views prescription content when supported; otherwise require fresh MFA.
- Use regional API Gateway as the only public business-API entry point. It validates Firebase JWTs and invokes private Cloud Run using a dedicated service account. Cloud Run verifies App Check and enforces role/record authorization, per-actor/action rate limits, request body/schema limits, API versioning, cost containment and structured security logs.
- Persist per-actor/action/window limits using pseudonymous account/device/IP subjects and expiry; never rely on one Cloud Run instance's memory or a single global hot document. Global metrics use sharded/rolled-up counters. A future managed counter/edge control must stay behind the same policy interface and preserve privacy minimisation.
- Keep Cloud Run IAM-private to the gateway and keep databases, object storage, secret/key stores, scanner jobs and internal administration services non-public. Add an external load balancer and Cloud Armor WAF when the independent assessment/legal review requires it, observed attacks exceed application/gateway controls, public scale materially changes the threat model, or funded budget supports it. Prevent bypass of the hardened edge after cutover.
- Authorize every request on the server from the authenticated user, assigned role, branch, selected pharmacy and target record. Client-provided role, pharmacy ID, request ID or price is never trusted without ownership/relationship validation.
- Use private Firestore data access through the TypeScript backend/API, with encryption at rest, narrowly scoped collection/document rules as defense in depth and separate least-privilege service identities. Run public search through narrowly scoped read paths; never expose broad database credentials or rely on client-side rules as the primary authorization layer.
- Prohibit routine direct production-database access, including for the founder. Any exceptional production access uses an MFA-protected, audited, time-limited administrative path with a documented reason; prefer purpose-built support/audit views over queries.
- Store prescription files in a private encrypted object store. A file is created in quarantine, scanned and classified through the fail-closed [prescription scanning workflow](prescription-scanning-workflow-policy.md) before an authorised reviewer can access it. Issue a short-lived, single-purpose download/view grant only after server-side request/branch authorization.
- Use provider-managed encryption at rest with strict IAM/private access for the MVP. Manage provider credentials and signing material in a managed secret service; evaluate customer-managed encryption keys only if required by legal/privacy review. CI uses short-lived identity federation where supported; it must not use long-lived production secrets in repository settings.
- Send identity/security email through Firebase Authentication templates configured with the founder-controlled MediFind custom domain. Configure required DNS verification plus SPF/DKIM/strict DMARC as applicable and test action-link domains. Do not send operational email from personal accounts or unauthenticated domains; a future separate sender requires processor/cost approval.
- Verify every inbound provider webhook/callback with provider signature validation, timestamp/replay protection, allow-list schema validation and idempotent processing. Treat a callback as untrusted until all checks pass.

## Observability, privacy and incident handling

- Emit structured append-only audit events using the [audit-log policy](audit-log-policy.md) for authentication, device/session changes, privileged access, pharmacy/staff changes, upload/view/download, record edits, status transitions, break-glass access and kill-switch use.
- Keep logs free of prescription content, raw documents, access tokens, OTPs, full phone/email values and sensitive free text. Use event IDs and pseudonymous internal identifiers; tightly restrict log access.
- Use Firebase Crashlytics/Google Cloud error monitoring only with an approved processor-register entry and strict client/server redaction. Crash/error reports must exclude names, phone/email, tokens, prescription data, medicine-search text, reservation details and support free text; validate redaction with automated tests before beta.
- Alert immediately on suspected prescription exposure, anomalous privileged/file access, excessive authentication failures, malware detection, break-glass use, backup/restore failure, key/secret anomaly and kill-switch activation.
- For phone authentication, configure Fiji-only SMS-region policy, Authentication App Check, provider metrics/quotas and a tested provider-level disable/restore action. Firebase performs sends outside the business API, so an API flag alone is not a hard cap. Alert and activate the provider breaker before the approved SMS amount is exceeded, allowing for monitoring/configuration lag.
- Authenticate CI/CD to GCP through environment/repository-restricted OIDC and Workload Identity Federation with separate least-privilege identities; never store long-lived service-account keys. Treat OpenTofu state/plans as secrets in private versioned Sydney storage and keep them out of source/logs.
- Maintain runbooks for account takeover, malicious upload, data exposure, unavailable service, vendor compromise and lost signing credentials. The first safe action may be automatic containment (revoking sessions, quarantining a file or disabling sensitive features) before founder review.
- Publish a security-reporting contact and `security.txt` page. Acknowledge legitimate vulnerability reports within one business day; do not promise a paid bug bounty.

## Secure delivery and release gate

- Pin dependencies with lockfiles; scan dependencies, mobile packages, container/build inputs and infrastructure definitions for known vulnerabilities; generate and retain an SBOM for each release.
- Run formatting, static/type checks, secret scanning, SAST, dependency/vulnerability scans, API/integration tests and mobile builds on every change. Add DAST/API authorization testing and device testing for implemented sensitive flows.
- Remediate critical/high findings before production release. A high-severity mobile or backend security fix can require a minimum app version before sensitive functions are available; safe search may remain accessible where appropriate.
- Patch or safely mitigate critical vulnerabilities within 24 hours, high-severity vulnerabilities within seven days, and review routine dependency updates monthly. Use the kill switch or minimum-version gate when a safe code fix cannot ship within the required response window.
- Before real prescription uploads, complete an independent, scoped mobile and API security assessment using applicable OWASP MASVS/MASTG and ASVS controls. Fix every high-severity finding and document risk acceptance for any lower-severity exception before activation. Automated checks alone are insufficient. [OWASP assessment guidance](https://mas.owasp.org/MASVS/04-Assessment_and_Certification/)

## Decisions still gated on vendor selection

Firebase/Google Cloud is the selected MVP platform and the [free-first production architecture](free-first-production-architecture.md) identifies the initial service/edge choices. Exact Identity Platform, App Check, Firestore, Cloud Storage, API Gateway/private Cloud Run, malware-scanning, monitoring and key-management configurations remain release-gated. Cloud Armor/WAF remains a recorded trigger-based upgrade. Document the deployed configuration, regional placement, current price/quotas and operational owner in the vendor/processor register before production data collection.
