# Security, privacy and compliance

## Security and privacy baseline

- Authenticate all accounts; verify buyer email and phone during registration; permit phone-first pharmacy staff accounts with optional recovery email; require MFA for pharmacy owners before production launch and require it for staff/admin roles unless a documented pilot exception is approved. Privileged MFA must use an authenticator app or passkey, not SMS alone.
- Require individual named accounts for pharmacy owners and staff; prohibit credential sharing; require device screen lock for privileged mobile sessions; let pharmacy owners revoke staff pharmacy access immediately and record each grant/revocation in the audit log.
- Expire pharmacy-owner/admin sessions after eight hours and require fresh MFA. Require fresh MFA for staff/role changes, pharmacy ownership/contact changes, privileged-device approval, privileged recovery and break-glass access.
- Enforce role-, pharmacy- and request-scoped authorisation server-side.
- Collect device location only after a buyer's specific “near me” action. Manual area/address search must be available without location permission; do not retain precise location beyond the search session unless a future, separately consented feature requires it.
- Encrypt prescription files in transit and at rest; store them separately from public listing data; use short-lived signed access and email links that require re-authentication.
- Before routing a prescription file, perform technical abuse controls: supported file/type and size validation, malware scanning, encrypted upload, duplicate/tamper-signal detection and legibility confirmation. Malware or technically unsafe files are blocked and never exposed to a pharmacy. Safely processed files with reviewable suspicion, duplicate/tamper or legibility flags are isolated in a restricted, labelled pharmacy quarantine inbox for an authorised reviewer. These controls do not determine clinical or legal validity; only the selected pharmacy's authorised reviewer may do so.
- Keep development, staging and production data/secrets isolated. Real buyer, pharmacy and prescription data is permitted only in production; use synthetic, non-sensitive data elsewhere.
- Keep audit events for verification, staff access, upload/view/download, status decisions, listing edits and administrative action. Alert on anomalous prescription access.
- MediFind admins cannot view prescription contents during normal operations. Any exceptional break-glass access requires a specific documented reason, time-limited grant, immutable audit event and buyer notification where legally appropriate; review each event after access ends.
- Obtain explicit buyer consent before upload; publish a plain-language privacy notice; support access, correction and deletion requests subject to legal-retention advice.
- Require buyer self-attestation of age 18+ and collect only legal full name, verified email and verified phone at registration in v1; do not collect date of birth, government ID or medical history unless Fiji legal advice later requires it. Contact-method verification is not represented as government identity verification.
- Before every prescription upload, obtain separate, specific confirmation that the file will be disclosed only to the pharmacy the buyer selected. Do not broadcast, route, expose or solicit the prescription to/from nearby or alternative pharmacies.
- Provide in-app account deletion requests with clear retention explanation; promptly revoke active sessions/notifications and complete deletion or de-identification of eligible data under the approved policy.
- A buyer may delete an uploaded prescription before the selected pharmacy has opened it. After first pharmacy access, the file becomes part of the review record and is retained/deleted under the approved privacy policy and Fiji legal advice; the buyer must see this boundary before upload.
- An unviewed prescription request expires after two pharmacy business days. Clearly disclose this before upload, notify the buyer at expiry, and delete the associated file after a short retention period approved through Fiji legal/pharmacy review while retaining only the minimum necessary audit record.
- Use an account-recovery security delay before restored buyer accounts may access or submit prescription requests; revoke prior sessions and push tokens when phone recovery completes. Pharmacy/admin recovery requires a logged manual role-verification process and must not use email alone.
- Provide a devices/sessions view and immediate self-service session revocation for every user. Limit privileged roles to two active devices; require MFA and generate a security alert when a privileged device is enrolled.
- Send buyers a generic security alert for a new-device sign-in, phone/email change or account recovery, with an in-app way to report unrecognised activity. Send pharmacy owners a generic security alert whenever staff access at their branch is granted, changed or revoked.
- Use generic push notifications as the primary prescription-reviewer alert and never include medicine names, prescription information, reservation details, prices or other sensitive content in a notification title/body or lock-screen preview. Email is optional fallback only.
- Suppress task-switcher previews and screenshots/screen recording of prescription content where the platform supports it; explain that physical photography cannot be prevented.
- Require biometric unlock before a prescription reviewer displays prescription content when supported; otherwise require fresh MFA.
- Apply rate limits and abuse detection to verification-code delivery, sign-in attempts, search, uploads, reports and reservation requests. Give users a clear retry/support message without exposing detection thresholds or security logic.
- Publish official MediFind support channels and anti-phishing guidance. MediFind and pharmacies must never request OTPs, passwords, authenticator codes or prescription files through unsolicited communication. Provide an in-app suspicious-message/account-activity reporting path that collects only minimum necessary evidence.
- Define retention and secure deletion periods with Fiji legal counsel before collection. Backups and logs must follow the same classification and retention controls.
- Do not set a product-defined retention period for opened prescription, review, reservation or audit records until Fiji legal/pharmacy advice approves the retention schedule.
- Send verification, request-status, security and outage communications as operational messages. Require separate, freely given opt-in for marketing, subscription promotion or non-essential communications, with an easy withdrawal mechanism.
- Prohibit advertising SDKs, data brokers, behavioural profiling and sale of buyer/pharmacy data. Collect only essential crash, performance, security and aggregated operational telemetry; never send prescription content, raw contact details, medicine-search history or free-text health information to telemetry.
- The privacy notice must identify each third-party processor that receives personal/device data, its purpose, data categories, hosting/transfer location and relevant user controls. Maintain a current processor register covering Firebase/Google Cloud, Apple, Google/FCM, SMS, maps, error monitoring and any future provider.
- Maintain incident response: contain access, preserve evidence, assess affected people/data, notify stakeholders as legally required, remediate and document closure.
- Encrypt backups, restrict access to the same or tighter roles as production data, include backup restoration in incident exercises, and validate backup retention/deletion against the approved prescription-retention policy.

## Required pre-pilot validation

This is a product compliance checklist, not legal advice. Obtain written Fiji legal and pharmacy-professional review before activating any pharmacy or accepting any prescription.

- Confirm verification evidence against the Fiji Pharmacy Profession Board/Fiji MRA registers and applicable licensing requirements.
- Confirm the public-search, prescription-upload and reservation flows do not breach requirements for prescriptions, dispensing, record keeping, restricted supply, or advertising under the [Pharmacy & Poisons Act](https://www.health.gov.fj/wp-content/uploads/2014/09/20_Pharmacy-Poisons-Act-Cap-115.pdf).
- Confirm medicines listed by pharmacies are appropriate to advertise/search and that no controlled or restricted item is exposed contrary to law or professional guidance.
- Confirm the permitted OTC/prescription-required classification process and any future controlled/restricted-medicine policy with Fiji pharmacy/legal review before those categories are exposed.
- Confirm privacy, hosting, cross-border transfer, retention, consent, breach notification and data-subject requirements applicable in Fiji.
- Review Fiji MRA requirements and the status of participating pharmacies/products with the [Fiji Medicines Regulatory Authority](https://www.health.gov.fj/fiji-mra/).
- Validate proposed Australia/New Zealand hosting and every cross-border transfer, subprocesser and support-access route with Fiji privacy/legal advice before production data is collected.
- Obtain pharmacy SOPs covering prescription review, reservation expiry, buyer communication, price accuracy and escalation of suspect/falsified medicine reports.

No legal/compliance check may be marked complete solely by product or engineering staff.
