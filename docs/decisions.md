# Decision log

| ID | Date | Decision | Status |
| --- | --- | --- | --- |
| ADR-001 | 2026-08-15 | V1 is a Suva pilot for verified pharmacies. | Accepted |
| ADR-002 | 2026-08-15 | Buyers must use accounts; pharmacies self-register but require MediFind verification before public visibility. | Accepted |
| ADR-003 | 2026-08-15 | Listings show availability, FJD price and update time, never exact quantity. | Accepted |
| ADR-004 | 2026-08-15 | Pharmacies manually maintain pharmacy-authored medicine listings; platform normalizes search without clinical substitution. | Accepted |
| ADR-005 | 2026-08-15 | Prescription files go only to the selected verified pharmacy; secure email notifies staff and push notifies buyers. | Accepted |
| ADR-006 | 2026-08-15 | V1 supports pharmacy-approved collection reservations; no payments or delivery. | Accepted |
| ADR-007 | 2026-08-15 | Launch user-facing content in English, iTaukei and Fiji Hindi. | Accepted |
| ADR-008 | 2026-08-15 | Use a shared-codebase mobile approach for iOS and Android; select concrete vendors after privacy/compliance review. | Accepted |
| ADR-009 | 2026-08-15 | Founder funds and operates a free pilot with 2–3 Suva pharmacies; pharmacy SaaS subscriptions/listing fees are a post-pilot option. | Accepted |
| ADR-010 | 2026-08-15 | Begin operating as an individual; review incorporation and related obligations before paid commercial operation. | Accepted |
| ADR-011 | 2026-08-15 | Buyer account verification requires email and phone; no government ID is collected in v1 unless legal advice requires it. | Accepted |
| ADR-012 | 2026-08-15 | Pharmacies refresh public listings daily and aim to respond within one business day; reservations default to 24 hours with pharmacy-selected expiry. | Accepted |
| ADR-013 | 2026-08-15 | V1 uses a shared iOS/Android mobile app for buyer, pharmacy and MediFind-admin workflows; no web dashboard is in scope. | Accepted |
| ADR-014 | 2026-08-15 | Pharmacy owners require MFA; staff/admin MFA is required unless a documented pilot exception is approved. | Accepted |
| ADR-015 | 2026-08-15 | Buyers may delete a prescription before the selected pharmacy first opens it; after opening, retention follows the approved privacy/legal policy. | Accepted |
| ADR-016 | 2026-08-15 | Buyer location is optional and used only for an explicit nearby search; manual area/address search remains available. | Accepted |
| ADR-017 | 2026-08-15 | Buyer recovery requires verified email and replacement-phone verification with a security delay; privileged-role recovery is manual and role-verified. | Accepted |
| ADR-018 | 2026-08-15 | Prescription upload supports camera capture and supported PDF/image selection with file validation and buyer legibility confirmation. | Accepted |
| ADR-019 | 2026-08-15 | Pharmacy owners manage named individual staff accounts and least-privilege pharmacy permissions; shared credentials are prohibited. | Accepted |
| ADR-020 | 2026-08-15 | Push notifications use generic, non-sensitive content; users authenticate in-app to view an update. | Accepted |
| ADR-021 | 2026-08-15 | Search normalizes harmless variants such as case while preserving pharmacy entries and never auto-merging clinically distinct products. | Accepted |
| ADR-022 | 2026-08-15 | Brand searches may surface clearly labelled active-ingredient matches; displayed products remain distinguished by brand, strength, form and pack size. | Accepted |
| ADR-023 | 2026-08-15 | Published listings require brand and/or active ingredient, dosage form, pack size and applicable strength. | Accepted |
| ADR-024 | 2026-08-15 | Pharmacy roles are owner, inventory manager and prescription reviewer; named staff may hold multiple roles. | Accepted |
| ADR-025 | 2026-08-15 | Verified-pharmacy listings publish after automatic validation; MediFind retains moderation and removal authority. | Accepted |
| ADR-026 | 2026-08-15 | Buyers can submit private listing-quality reports for MediFind review; reports are not public accusations. | Accepted |
| ADR-027 | 2026-08-15 | Listings are marked outdated and de-ranked after 24 hours without refresh, then removed from search after seven days until refreshed. | Accepted |
| ADR-028 | 2026-08-15 | Prefer Australia or New Zealand hosting for production data, subject to Fiji legal/privacy validation and vendor controls. | Accepted |
| ADR-029 | 2026-08-15 | Use isolated development, staging and production environments; production is the only environment permitted to contain real user, pharmacy or prescription data. | Accepted |
| ADR-030 | 2026-08-15 | The founder owns and controls all critical vendor accounts with MFA and recovery information; contractors receive only limited access. | Accepted |
| ADR-031 | 2026-08-15 | Use encrypted daily backups with initial 30-day retention and test restore before pilot launch and quarterly thereafter. | Accepted |
| ADR-032 | 2026-08-15 | Show in-app outage messaging and a public status page during service interruptions. | Accepted |
| ADR-033 | 2026-08-15 | Pilot support is founder-operated Monday–Friday, 9:00am–5:00pm Fiji time; MediFind is not an emergency or clinical support service. | Accepted |
| ADR-034 | 2026-08-15 | Pharmacy verification captures applicable business, pharmacy/licensing, responsible-pharmacist and Fiji address/contact evidence; exact documents remain subject to Fiji professional/legal review. | Accepted |
| ADR-035 | 2026-08-15 | Pharmacy owners invite named staff by phone number; recipients prove control of that number before assigned access is granted. | Accepted |
| ADR-036 | 2026-08-15 | Owners may manage multiple independently verified pharmacy branches; branch records have their own address, hours, staff, listings and search visibility. | Accepted |
| ADR-037 | 2026-08-15 | Pharmacy staff can use verified phone-first accounts; email is optional for recovery and not required to operate. | Accepted |
| ADR-038 | 2026-08-15 | Generic in-app push is the primary prescription-reviewer alert; email is optional fallback only. | Accepted |
| ADR-039 | 2026-08-15 | Privileged roles use authenticator-app or passkey MFA, with clear in-app explanation and setup guidance; SMS alone is insufficient. | Accepted |
| ADR-040 | 2026-08-15 | Buyer registration collects legal full name plus verified phone/email; no date of birth, government ID or medical history in v1 unless Fiji legal advice requires it. | Accepted |
| ADR-041 | 2026-08-15 | Every prescription upload requires separate consent and is disclosed only to the buyer-selected verified pharmacy; no nearby-pharmacy broadcast is permitted. | Accepted |
| ADR-042 | 2026-08-15 | Buyers can request in-app account deletion, subject to transparent retention of records required by the approved policy. | Accepted |
| ADR-043 | 2026-08-15 | Buyers may request a reservation directly for an in-stock over-the-counter listing; the pharmacy decides approval and expiry. | Accepted |
| ADR-044 | 2026-08-15 | Prescription-required reservations can be created only after the selected pharmacy approves prescription review. | Accepted |
| ADR-045 | 2026-08-15 | V1 has no in-app buyer/pharmacy chat; buyers use published pharmacy contact details for direct follow-up. | Accepted |
| ADR-046 | 2026-08-15 | Default search order is exact match and freshness, then distance and price; buyers can select another supported sort. | Accepted |
| ADR-047 | 2026-08-15 | Results use a low-data list by default with an optional map view. | Accepted |
| ADR-048 | 2026-08-15 | Paid/sponsored placement and any commercial influence on medicine-search ranking are prohibited. | Accepted |
| ADR-049 | 2026-08-15 | Zero-result searches may expand non-clinical terms and collect private unmet-demand reports; MediFind never suggests a therapeutic substitute. | Accepted |
| ADR-050 | 2026-08-15 | Low stock is pharmacy-managed with no public exact quantity or universal numeric threshold. | Accepted |
| ADR-051 | 2026-08-15 | V1 does not retain saved medicine searches, favourites or medicine-search history; pharmacy favourites are deferred. | Accepted |
| ADR-052 | 2026-08-15 | Build a shared TypeScript React Native/Expo application for iOS and Android with a TypeScript backend/API. | Accepted |
| ADR-053 | 2026-08-15 | Prefer managed database, storage, authentication, notification and monitoring services that pass MediFind's hosting/security/vendor gates. | Accepted |
| ADR-054 | 2026-08-15 | Require automated formatting, checks, tests, dependency/security scanning and builds before merge; production deployment is manually approved. | Accepted |
| ADR-055 | 2026-08-15 | Buyers use passwordless phone-code sign-in, verified-email recovery and optional device-biometric session unlock. | Accepted |
| ADR-056 | 2026-08-15 | Begin with invite-only TestFlight and Google Play closed-testing distribution for the pilot. | Accepted |
| ADR-057 | 2026-08-15 | Target iOS 15+ and Android 10+ for the initial mobile application. | Accepted |
| ADR-058 | 2026-08-15 | The pilot buyer audience is invite-only and limited to MediFind or pilot-pharmacy referrals. | Accepted |
| ADR-059 | 2026-08-15 | Pilot success requires 2–3 active verified pharmacies, at least 80% refresh compliance, timely request responses, no unresolved high-severity security/privacy issue, and evidence of future paid value. | Accepted |
| ADR-060 | 2026-08-15 | MediFind performs technical prescription-upload abuse checks only; the selected pharmacy's authorised reviewer decides validity and dispensing. | Accepted |
| ADR-061 | 2026-08-15 | Pharmacies may reject or allow prescription requests to expire; buyers then select another pharmacy and submit a new request. | Accepted |
| ADR-062 | 2026-08-15 | Unsafe/malware prescription uploads are blocked; safely processed reviewable flags use a restricted pharmacy quarantine inbox. | Accepted |
| ADR-063 | 2026-08-15 | Suspending a pharmacy immediately removes listings and revokes staff access; pending prescriptions are not forwarded and buyers choose a new pharmacy themselves. | Accepted |
| ADR-064 | 2026-08-15 | Listed prices are in FJD and include applicable taxes/standard charges; any unavoidable pharmacy-specific charge is disclosed before reservation approval. | Accepted |
| ADR-065 | 2026-08-15 | Reservation approval confirms the collection price or clearly discloses a changed price before approval. | Accepted |
| ADR-066 | 2026-08-15 | Branches maintain normal and exceptional hours; reservation expiry must be compatible with collection availability. | Accepted |
| ADR-067 | 2026-08-15 | Launch all buyer, pharmacy and admin user-facing content in English, iTaukei and Fiji Hindi, with professionally reviewed safety/legal wording. | Accepted |
| ADR-068 | 2026-08-15 | Default to the supported device language and always offer onboarding/settings language selection. | Accepted |
| ADR-069 | 2026-08-15 | Preserve official/pharmacy-entered medicine identity; translate surrounding labels/explanations only. | Accepted |
| ADR-070 | 2026-08-15 | Buyers self-attest they are 18+ and verify phone/email; v1 collects no date of birth or identity documents. | Accepted |
| ADR-071 | 2026-08-15 | Adult account holders may act for a child/dependent; v1 has no minor accounts or parental-consent workflow and pharmacies retain authority checks. | Accepted |
| ADR-072 | 2026-08-15 | Unviewed prescription requests expire after two pharmacy business days with prominent advance disclosure and buyer notification; file deletion timing requires Fiji legal/pharmacy approval. | Accepted |
| ADR-073 | 2026-08-15 | Retention for opened prescription, review, reservation and audit records remains unset until Fiji legal/pharmacy advice approves it. | Accepted |
| ADR-074 | 2026-08-15 | Operational messages are default; marketing/non-essential communication requires separate opt-in consent. | Accepted |
| ADR-075 | 2026-08-15 | V1 has no public pharmacy ratings/reviews; MediFind may collect private post-reservation pilot feedback. | Accepted |
| ADR-076 | 2026-08-15 | Buyers can mark reservations collected or no longer needed for pharmacy workflow and pilot measurement. | Accepted |
| ADR-077 | 2026-08-15 | Pharmacies may cancel an approved reservation only with a recorded operational reason, immediate buyer notice and clear explanation. | Accepted |
| ADR-078 | 2026-08-15 | Admin prescription-content access is prohibited routinely; break-glass access is reasoned, time-limited, audited and notified where appropriate. | Accepted |
| ADR-079 | 2026-08-15 | Buyers receive security alerts for new devices, contact changes and recovery, with unrecognised-activity reporting. | Accepted |
| ADR-080 | 2026-08-15 | Pharmacy owners receive alerts for staff-access grants, changes and revocations at their branches. | Accepted |
| ADR-081 | 2026-08-15 | Use an auditable kill switch to disable prescription uploads/reservations independently while retaining safe pharmacy search where possible. | Accepted |
| ADR-082 | 2026-08-15 | Critical security signals notify the founder immediately, including outside public support hours. | Accepted |
| ADR-083 | 2026-08-15 | Plan maintenance outside typical Fiji pharmacy hours where practical and give at least 24 hours' notice. | Accepted |
| ADR-084 | 2026-08-15 | Every listing carries a visible OTC or prescription-required status. | Accepted |
| ADR-085 | 2026-08-15 | Exclude controlled, restricted and other legally sensitive medicines until Fiji legal/pharmacy review approves a documented policy. | Accepted |
| ADR-086 | 2026-08-15 | Prescription-required listings and requests require at least one active authorised reviewer at the branch; eligible OTC listings may remain available. | Accepted |
| ADR-087 | 2026-08-15 | Pharmacy staff are the source of truth for reservation collection; buyer collection confirmation is feedback only. | Accepted |
| ADR-088 | 2026-08-15 | Reservations automatically expire at their stated deadline unless already collected or cancelled. | Accepted |
| ADR-089 | 2026-08-15 | Buyers may cancel pending/approved reservations before collection, with immediate pharmacy notice and audit. | Accepted |
| ADR-090 | 2026-08-15 | Limit account holders to one active reservation per medicine/person until it completes, expires, is declined or is cancelled. | Accepted |
| ADR-091 | 2026-08-15 | Three confirmed no-shows in 30 days temporarily disable reservations pending review while preserving search access. | Accepted |
| ADR-092 | 2026-08-15 | Rate-limit verification, sign-in, search, uploads, reports and reservations; present user-safe retry/support messages. | Accepted |
| ADR-093 | 2026-08-15 | A compromised/rooted/jailbroken device is blocked from sensitive and privileged functions while non-sensitive search may remain available where safe. | Accepted |
| ADR-094 | 2026-08-15 | Critical app-security fixes can require an update before sensitive features are accessible. | Accepted |
| ADR-095 | 2026-08-15 | An independent OWASP-informed mobile/API security assessment is required before real prescription uploads; high-severity findings block launch. | Accepted |
| ADR-096 | 2026-08-15 | Every user can view and revoke active devices/sessions. | Accepted |
| ADR-097 | 2026-08-15 | Privileged roles are limited to two active devices; new-device enrollment requires MFA and alerts the user. | Accepted |
| ADR-098 | 2026-08-15 | Prevent prescription screenshots/recordings/task previews where the OS permits and clearly disclose physical-world limits. | Accepted |
| ADR-099 | 2026-08-15 | All public traffic uses managed DDoS protection and WAF/API gateway; data stores and internal services are never publicly reachable. | Accepted |
| ADR-100 | 2026-08-15 | Routine direct production-database access is prohibited; exceptional access is MFA-protected, reasoned, audited and time-limited. | Accepted |
| ADR-101 | 2026-08-15 | Patch/mitigate critical vulnerabilities within 24 hours, high severity within seven days and review routine updates monthly. | Accepted |
| ADR-102 | 2026-08-15 | Design the MVP around a FJD 50–100 monthly infrastructure ceiling, excluding developer accounts, domains and SMS charges. | Accepted |
| ADR-103 | 2026-08-15 | Use Firebase/Google Cloud Sydney where supported for the low-cost MVP; a TypeScript backend/API enforces policy rather than broad client data access. | Accepted |
| ADR-104 | 2026-08-15 | Use free/lowest-cost tiers only for synthetic/non-sensitive development/closed-beta work; real prescriptions require approved paid production controls. | Accepted |
| ADR-105 | 2026-08-15 | Use provider-managed encryption at rest with strict IAM/private access for the MVP; assess customer-managed keys only if required by legal/privacy review. | Accepted |
| ADR-106 | 2026-08-15 | Use separate Firebase/GCP projects for development, beta and real-prescription production from day one. | Accepted |
| ADR-107 | 2026-08-15 | Enforce per-user and global OTP/SMS limits that pause sends and alert the founder before approved spend is exceeded. | Accepted |
| ADR-108 | 2026-08-15 | Privileged pharmacy-owner/admin sessions expire after eight hours and require MFA reauthentication; buyer sessions remain revocable. | Accepted |
| ADR-109 | 2026-08-15 | Require fresh MFA for privileged high-risk actions including staff/role, ownership/contact, device, recovery and break-glass changes. | Accepted |
| ADR-110 | 2026-08-15 | Require biometric unlock for prescription review where supported, otherwise fresh MFA. | Accepted |
| ADR-111 | 2026-08-15 | Publish official channels and anti-phishing guidance; never solicit credentials, OTPs or prescriptions through unsolicited communication. | Accepted |
| ADR-112 | 2026-08-15 | Provide in-app reporting for suspicious messages/account activity using minimum necessary evidence. | Accepted |
| ADR-113 | 2026-08-15 | Pilot builds are distributed only through TestFlight and Google Play closed testing, never unofficial links or files. | Accepted |
| ADR-114 | 2026-08-15 | Advertising SDKs, data brokers, behavioural profiling and sale of buyer/pharmacy data are prohibited. | Accepted |
| ADR-115 | 2026-08-15 | Collect only essential, privacy-minimised crash/performance/security/aggregated telemetry. | Accepted |
| ADR-116 | 2026-08-15 | Public privacy documentation names each processor and its data/transfer role, backed by a maintained processor register. | Accepted |
| ADR-117 | 2026-08-15 | Send production email only from a founder-controlled domain with SPF, DKIM and strict DMARC. | Accepted |
| ADR-118 | 2026-08-15 | Verify inbound provider callbacks with signature, replay, schema and idempotency controls. | Accepted |
| ADR-119 | 2026-08-15 | Publish security-reporting contact and security.txt; acknowledge valid reports within one business day without a paid bug bounty. | Accepted |

## Entry template

Add a new row for each material decision or deviation. Include date, decision, alternatives considered where useful, owner, evidence/approval link, and status (`proposed`, `accepted`, `superseded`).
