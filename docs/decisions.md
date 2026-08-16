# Decision log

| ID | Date | Decision | Status |
| --- | --- | --- | --- |
| ADR-001 | 2026-08-15 | V1 is a Suva pilot for verified pharmacies. | Accepted |
| ADR-002 | 2026-08-15 | Buyers must use accounts; pharmacies self-register but require MediFind verification before public visibility. | Accepted |
| ADR-003 | 2026-08-15 | Listings show availability, FJD price and update time, never exact quantity. | Accepted |
| ADR-004 | 2026-08-15 | Pharmacies manually maintain pharmacy-authored medicine listings; platform normalizes search without clinical substitution. | Accepted |
| ADR-005 | 2026-08-15 | Prescription files go only to the selected verified pharmacy; secure email notifies staff and push notifies buyers. | Superseded by ADR-206 and ADR-245 |
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
| ADR-037 | 2026-08-15 | Pharmacy staff can use verified phone-first accounts; email is optional for recovery and not required to operate. | Superseded by ADR-141 |
| ADR-038 | 2026-08-15 | Generic in-app push is the primary prescription-reviewer alert; email is optional fallback only. | Superseded by ADR-245 |
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
| ADR-099 | 2026-08-15 | All public traffic uses managed DDoS protection and WAF/API gateway; data stores and internal services are never publicly reachable. | Superseded by ADR-240 and ADR-241 |
| ADR-100 | 2026-08-15 | Routine direct production-database access is prohibited; exceptional access is MFA-protected, reasoned, audited and time-limited. | Accepted |
| ADR-101 | 2026-08-15 | Patch/mitigate critical vulnerabilities within 24 hours, high severity within seven days and review routine updates monthly. | Accepted |
| ADR-102 | 2026-08-15 | Design the MVP around a FJD 50–100 monthly infrastructure ceiling, excluding developer accounts, domains and SMS charges. | Accepted |
| ADR-103 | 2026-08-15 | Use Firebase/Google Cloud Sydney where supported for the low-cost MVP; a TypeScript backend/API enforces policy rather than broad client data access. | Accepted |
| ADR-104 | 2026-08-15 | Use free/lowest-cost tiers only for synthetic/non-sensitive development/closed-beta work; real prescriptions require approved paid production controls. | Superseded by ADR-238 and ADR-239 |
| ADR-105 | 2026-08-15 | Use provider-managed encryption at rest with strict IAM/private access for the MVP; assess customer-managed keys only if required by legal/privacy review. | Accepted |
| ADR-106 | 2026-08-15 | Use separate Firebase/GCP projects for development, beta and real-prescription production from day one. | Accepted |
| ADR-107 | 2026-08-15 | Enforce per-user and global OTP/SMS limits that pause sends and alert the founder before approved spend is exceeded. | Superseded by ADR-249 |
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
| ADR-120 | 2026-08-15 | Claude Code implements only approved task briefs on feature branches and opens PRs; it never directly changes main, deploys or publishes without explicit approval. | Accepted |
| ADR-121 | 2026-08-15 | Accepted product, security and architecture documentation is immutable to Claude; conflicts become decision-change requests owned by the documentation agent. | Accepted |
| ADR-122 | 2026-08-15 | Every Claude task uses a written brief with scope, linked decisions, contracts, acceptance tests and security/privacy constraints. | Accepted |
| ADR-123 | 2026-08-15 | MediFind uses a clean, clinical, high-readability visual direction with calm blue/teal accents and no pharmacy-sale aesthetic. | Accepted |
| ADR-124 | 2026-08-15 | Buyers receive skippable onboarding covering search, pharmacy-managed data, prescription privacy and reservation limits before registration. | Accepted |
| ADR-125 | 2026-08-15 | Navigation is role-specific: buyer Search/Requests/Account; pharmacy roles use authorised Dashboard/Inventory/Requests/Account; admins use Verification/Reports/Account. | Accepted |
| ADR-126 | 2026-08-15 | The MVP is list-first; Directions opens the buyer's installed maps app and embedded maps are deferred for cost control. | Accepted |
| ADR-127 | 2026-08-15 | Support light/dark themes, defaulting to device preference with manual Account override. | Accepted |
| ADR-128 | 2026-08-15 | Use accessible system icons and defer custom logos/illustrations until demand is validated. | Accepted |
| ADR-129 | 2026-08-15 | The mobile app uses a versioned REST/JSON API rather than GraphQL for MVP operational data. | Accepted |
| ADR-130 | 2026-08-15 | The TypeScript backend API is the only operational data boundary; Firestore access is server-controlled and client roles are never trusted. | Accepted |
| ADR-131 | 2026-08-15 | Store timestamps in UTC and use Pacific/Fiji for display, pharmacy business rules and reservation expiry. | Accepted |
| ADR-132 | 2026-08-15 | Maintain Firebase/GCP configuration as reviewed version-controlled infrastructure/configuration; reconcile any emergency console change immediately. | Accepted |
| ADR-133 | 2026-08-15 | Use server-controlled, audited feature flags with safe defaults and limited pilot cohorts for sensitive functionality. | Accepted |
| ADR-134 | 2026-08-15 | Use staged beta rollout with documented rollback; stop/roll back on high-severity security/privacy, safety, cost or support failure. | Accepted |
| ADR-135 | 2026-08-15 | Automated tests never use production projects, credentials or real data; use emulators or dedicated synthetic-data test projects. | Accepted |
| ADR-136 | 2026-08-15 | Every beta release requires manual validation on one physical iPhone and one physical Android device. | Accepted |
| ADR-137 | 2026-08-15 | Security-sensitive/domain API code requires at least 90% branch coverage plus explicit role, authorization and state-transition tests. | Accepted |
| ADR-138 | 2026-08-15 | Caregiver requests capture patient legal name and self/child/dependent relationship per request only; v1 has no reusable dependent profile. | Accepted |
| ADR-139 | 2026-08-15 | Selected pharmacies receive only account-holder name/verified phone, patient name/relationship and minimum request data; no buyer email/address/DOB. | Accepted |
| ADR-140 | 2026-08-15 | Buyer phone/email changes require fresh verification, appropriate session revocation and security alert. | Accepted |
| ADR-141 | 2026-08-15 | Privileged pharmacy/admin users are invited by phone but use verified personal email as primary sign-in and authenticator-app MFA; company email is not required. | Accepted |
| ADR-142 | 2026-08-15 | Implement privileged Firebase TOTP MFA through React Native Firebase native modules in Expo development/production builds; Expo Go is not a supported MediFind runtime. | Accepted |
| ADR-143 | 2026-08-15 | Do not name the founder personally in public MediFind notices; approve the legally valid operator identity/contact with Fiji legal review before external activation. | Accepted |
| ADR-144 | 2026-08-15 | Use a free-pilot pharmacy agreement that assigns pharmacy operational, clinical, listing, staff-access and compliance responsibilities before activation. | Accepted |
| ADR-145 | 2026-08-15 | No real prescription collection or external activation occurs until Fiji legal/pharmacy review approves a specific retention/deletion schedule. | Accepted |
| ADR-146 | 2026-08-15 | Establish a MediFind business identity before external pilot activation, so public notices/contracts do not use the founder's personal name. | Accepted |
| ADR-147 | 2026-08-15 | Permit an authorised pharmacy owner to accept the final free-pilot agreement in-app, with versioned auditable acceptance evidence. | Accepted |
| ADR-148 | 2026-08-15 | Require role-specific synthetic-data onboarding and recorded training completion before pharmacy activation. | Accepted |
| ADR-149 | 2026-08-15 | Operate a minimal static public site for legal notices, support, status and security reporting only; core workflows remain mobile-only. | Accepted |
| ADR-150 | 2026-08-15 | Use authenticated in-app support for buyer account/security/technical and pharmacy operational issues; buyers contact pharmacies directly for medicine/prescription/reservation questions. | Accepted |
| ADR-151 | 2026-08-15 | Do not offer an official WhatsApp support channel in the MVP. | Accepted |
| ADR-152 | 2026-08-15 | Permit only short-lived caching of minimum public search/listing data; never persist or queue sensitive data/actions offline. | Accepted |
| ADR-153 | 2026-08-15 | Use Firebase Crashlytics/Google Cloud error monitoring only with processor approval and strict redaction of identifiers, health data, searches, tokens and free text. | Accepted |
| ADR-154 | 2026-08-15 | Re-fetch and server-authorise sensitive views/actions after reconnect or app resume; cached data is never current authority. | Accepted |
| ADR-155 | 2026-08-15 | Buyer lost-phone recovery requires verified email/replacement phone, revokes existing sessions and imposes a 24-hour hold on sensitive actions. | Accepted |
| ADR-156 | 2026-08-15 | A staff authenticator-device loss requires owner-controlled revocation and auditable reset/re-invitation; self-service MFA bypass is prohibited. | Accepted |
| ADR-157 | 2026-08-15 | Owner/admin MFA recovery is a logged manual evidence-verification process that suspends privileged actions until fresh sign-in and MFA enrollment finish. | Accepted |
| ADR-158 | 2026-08-15 | Protect `main` with founder-approved pull requests and required checks; Claude cannot directly push, approve, merge or bypass controls. | Accepted |
| ADR-159 | 2026-08-15 | Use weekly automated dependency-update PRs without auto-merge. | Accepted |
| ADR-160 | 2026-08-15 | Enable repository secret scanning and push protection; secret exposure triggers rotation/incident handling. | Accepted |
| ADR-161 | 2026-08-15 | Prescription uploads allow PDF/JPG/JPEG/PNG/HEIC only, up to 10 MB per file and 10 pages; unsafe-file feedback remains generic. | Accepted |
| ADR-162 | 2026-08-15 | Strip non-essential prescription-image device/GPS metadata before reviewer display where safe, preserving only legally required evidence. | Accepted |
| ADR-163 | 2026-08-15 | Claude Code uses Superpowers from Anthropic's official marketplace with optional telemetry disabled; MediFind documentation/security rules take precedence. | Accepted |
| ADR-164 | 2026-08-15 | Prompt for generic notifications only after explanation; in-app status remains authoritative when permission is declined. | Accepted |
| ADR-165 | 2026-08-15 | Nearby search uses foreground approximate location only, never background/retained location, and always provides manual area search. | Accepted |
| ADR-166 | 2026-08-15 | Prescription upload uses just-in-time camera and scoped system picker access, never broad photo-library permission. | Accepted |
| ADR-167 | 2026-08-15 | Use protected normalised `+679` phone numbers and masked display for buyer/staff identity contact data. | Accepted |
| ADR-168 | 2026-08-15 | Use one six-digit OTP at a time, expiring in 10 minutes; repeated failure is generically throttled. | Accepted |
| ADR-169 | 2026-08-15 | Verified email supports existing buyer recovery only; no WhatsApp, manual or unverified-email initial phone-verification bypass. | Accepted |
| ADR-170 | 2026-08-15 | Validate SMS delivery/cost on representative Fiji networks with synthetic accounts before buyer beta activation. | Accepted |
| ADR-171 | 2026-08-15 | Use a TypeScript Fastify REST API on Sydney Cloud Run, configured to scale to zero with maximum-instance/cost controls. | Accepted |
| ADR-172 | 2026-08-15 | Route all MediFind business operations through the Cloud Run API; the mobile app has no direct Firestore/Storage operation access. | Accepted |
| ADR-173 | 2026-08-15 | Scan prescription uploads only in a regional MediFind-controlled pipeline; never submit files to public or third-party malware-analysis feeds. | Accepted |
| ADR-174 | 2026-08-15 | Link listings automatically only to harmless/high-confidence canonical medicine matches while preserving the pharmacy-entered listing. | Accepted |
| ADR-175 | 2026-08-15 | Hold ambiguous/unmatched medicine identities from public search pending MediFind review; never auto-merge clinically distinct products. | Accepted |
| ADR-176 | 2026-08-15 | MediFind may curate canonical identities/aliases but cannot change pharmacy price, availability or clinical/dispensing decisions. | Accepted |
| ADR-177 | 2026-08-15 | Treat suspected prescription exposure, privileged compromise and unsafe prescription routing as critical incidents requiring immediate containment and founder alert. | Accepted |
| ADR-178 | 2026-08-15 | Notify affected parties through verified channels as facts and Fiji legal obligations permit; do not conceal confirmed incidents or speculate. | Accepted |
| ADR-179 | 2026-08-15 | Complete a documented post-incident review within five business days and track corrective actions to verified closure. | Accepted |
| ADR-180 | 2026-08-15 | Set a pilot backup recovery-point objective of 24 hours using encrypted daily backups. | Accepted |
| ADR-181 | 2026-08-15 | Target core-service restoration within one Fiji business day; sensitive prescription/reservation functions stay disabled until post-restore integrity checks pass. | Accepted |
| ADR-182 | 2026-08-15 | Do not implement active multi-region failover in MVP; use Sydney primary, tested restore and transparent outage status. | Accepted |
| ADR-183 | 2026-08-16 | Target WCAG 2.2 AA for the mobile app and minimal public-support site, subject to documented exception only. | Accepted |
| ADR-184 | 2026-08-16 | Support 200% text scaling, screen-reader semantics/focus, large touch targets and non-colour-only critical status. | Accepted |
| ADR-185 | 2026-08-16 | Require physical iOS VoiceOver and Android TalkBack validation for every critical buyer, pharmacy and admin beta journey. | Accepted |
| ADR-186 | 2026-08-16 | Use structured append-only audit events with minimum safe actor/action/target/state metadata and no sensitive content. | Accepted |
| ADR-187 | 2026-08-16 | Pharmacy owners view only permitted branch staff/listing/reservation audit history, never other pharmacies or prescription-file content. | Accepted |
| ADR-188 | 2026-08-16 | Audit all admin verification, moderation, suspension, support, break-glass and configuration/kill-switch actions; normal users cannot alter history. | Accepted |
| ADR-189 | 2026-08-16 | Target p95 medicine-search API response within two seconds and first visible results within three seconds under representative Fiji pilot conditions. | Accepted |
| ADR-190 | 2026-08-16 | Return search results in 20-result pages with a maximum 100 results per query. | Accepted |
| ADR-191 | 2026-08-16 | Propagate pharmacy price/availability updates to public search within five minutes while retaining actual last-updated time. | Accepted |
| ADR-192 | 2026-08-16 | Pharmacy verification lasts 12 months or until earliest relied-on evidence expiry, whichever comes first. | Accepted |
| ADR-193 | 2026-08-16 | Send renewal reminders at 60/30 days and suspend public discovery, prescription handling and reservations on unrenewed expiry. | Accepted |
| ADR-194 | 2026-08-16 | Require re-verification before material ownership, legal-name, branch, licence/responsible-person or official-contact changes become public. | Accepted |
| ADR-195 | 2026-08-16 | Use one TypeScript monorepo with mobile, API and narrowly scoped shared contract/config packages. | Accepted |
| ADR-196 | 2026-08-16 | Use pinned Node Active LTS and pnpm workspaces with committed lockfile and reproducible immutable installs. | Accepted |
| ADR-197 | 2026-08-16 | Keep mobile/API independently deployable; shared packages contain contracts/config only and never secrets or direct data access. | Accepted |
| ADR-198 | 2026-08-16 | Build the initial canonical catalog only from verified pharmacy-authored listings and MediFind review. | Accepted |
| ADR-199 | 2026-08-16 | Defer barcode scanning, automated medicine-data imports and external/government catalog integrations until post-pilot review. | Accepted |
| ADR-200 | 2026-08-16 | A person may use one account for buyer and pharmacy roles only with explicit workspace separation and no cross-context data access. | Accepted |
| ADR-201 | 2026-08-16 | Multi-branch staff access requires a distinct explicit invitation/assignment for each branch. | Accepted |
| ADR-202 | 2026-08-16 | Pharmacy ownership alone never grants prescription access; an owner needs explicit active prescription-reviewer role. | Accepted |
| ADR-203 | 2026-08-16 | Require a 24-hour scoped idempotency key for every state-changing API request. | Accepted |
| ADR-204 | 2026-08-16 | Require current record versions for conflict-prone edits/actions and reject stale changes safely. | Accepted |
| ADR-205 | 2026-08-16 | Model mutations as explicit server-validated action commands, never arbitrary client state patches. | Accepted |
| ADR-206 | 2026-08-16 | Use generic direct FCM/APNs push as the primary status-update signal; notification open re-fetches authorised API state. | Accepted |
| ADR-207 | 2026-08-16 | Refresh status screens on open/resume/pull-to-refresh/action completion without continuous background polling. | Accepted |
| ADR-208 | 2026-08-16 | Do not use WebSockets, direct Firestore listeners or realtime-database subscriptions in MVP. | Accepted |
| ADR-209 | 2026-08-16 | Production API errors use stable code, local translation key and opaque request ID with safe caller-field details only. | Accepted |
| ADR-210 | 2026-08-16 | API validation/errors never reveal inaccessible account, pharmacy, prescription or record existence. | Accepted |
| ADR-211 | 2026-08-16 | Production API responses never expose stacks, provider/internal IDs, security rules or raw exception messages. | Accepted |
| ADR-212 | 2026-08-16 | Store structured Fiji branch addresses with validated coordinates; show public address only after branch verification. | Accepted |
| ADR-213 | 2026-08-16 | Store weekly and exceptional branch hours in `Pacific/Fiji` and validate reservation expiry against collection availability. | Accepted |
| ADR-214 | 2026-08-16 | Use verified public branch location only for native-map directions; never disclose or retain buyer nearby-search location. | Accepted |
| ADR-215 | 2026-08-16 | Use structured MediFind-translated templates for safety-critical reservation, status, expiry and error content. | Accepted |
| ADR-216 | 2026-08-16 | Allow only limited language-tagged pharmacy operational notes; never machine-translate them or permit medical advice/prescription interpretation. | Accepted |
| ADR-217 | 2026-08-16 | Require plain-text sanitisation, strict length limits and no links/contact data in dynamic notes unless a future approved field permits it. | Accepted |
| ADR-218 | 2026-08-16 | Staff invitations expire in seven days; one active invitation per phone/person/role context and reissue invalidates prior invite. | Accepted |
| ADR-219 | 2026-08-16 | Prevent removal/downgrade of a branch's final active owner; ownership transfer requires re-verification. | Accepted |
| ADR-220 | 2026-08-16 | Loss of final active reviewer automatically disables new prescription requests and hides Rx listings while eligible OTC remains available. | Accepted |
| ADR-221 | 2026-08-16 | Every public listing shows one current exact-pack FJD price; contact-for-price, ranges and estimates are prohibited. | Accepted |
| ADR-222 | 2026-08-16 | Price applies only to the exact listed identity/form/strength/pack; separate packs require separate listings. | Accepted |
| ADR-223 | 2026-08-16 | Price changes are versioned/audited; approved reservations retain confirmed price unless operationally cancelled with notice. | Accepted |
| ADR-224 | 2026-08-16 | Begin implementation only with synthetic-data monorepo/tooling/CI/mobile-shell foundation; defer cloud/auth/production configuration. | Accepted |
| ADR-225 | 2026-08-16 | Implement non-sensitive synthetic buyer search/navigation before protected cloud/pharmacy/prescription capability. | Accepted |
| ADR-226 | 2026-08-16 | Claude must present a requirements-driven UI design proposal for approval before implementing a visual flow. | Accepted |
| ADR-227 | 2026-08-16 | First Claude design review covers a whole-MVP low-fidelity role/flow/system/state proposal before any UI code. | Accepted |
| ADR-228 | 2026-08-16 | Prescription uploads enter private quarantine and use an internal asynchronous non-public regional scanning worker. | Accepted |
| ADR-229 | 2026-08-16 | Only least-privilege scanning-worker identity accesses quarantined files; clients/ordinary API routes have no direct storage access. | Accepted |
| ADR-230 | 2026-08-16 | Scanner timeout/failure/unknown result fails closed in quarantine with generic buyer state and operational alert. | Accepted |
| ADR-231 | 2026-08-16 | Execute each prescription scan as a non-public Cloud Run Job using only an opaque scan-job ID. | Accepted |
| ADR-232 | 2026-08-16 | Restrict API to running the specific scanner job and scanner identity to minimum quarantine/result resources. | Accepted |
| ADR-233 | 2026-08-16 | Cap scan jobs at three attempts; third failure remains quarantined/unknown, alerts founder and requires controlled reprocess. | Accepted |
| ADR-234 | 2026-08-16 | Keep scanner scale-to-zero with capped pilot resources; do not enable real uploads if it cannot meet the FJD 50-100 budget. | Accepted |
| ADR-235 | 2026-08-16 | Alert at 50/80/100% cost and automatically pause new OTP sends plus prescription upload/scans at the approved ceiling while preserving safe search. | Superseded by ADR-249 and ADR-256 |
| ADR-236 | 2026-08-16 | Never automatically shut down the entire app or delete data for cost control alone. | Accepted |
| ADR-237 | 2026-08-16 | Only founder-authorised fresh-MFA/audited action can raise budget or re-enable a cost-paused function. | Accepted |
| ADR-238 | 2026-08-16 | Use a free-first, scale-in-place architecture: prefer durable no-cost allowances on production-capable services and exclude expiring trial credits from forecasts. | Accepted |
| ADR-239 | 2026-08-16 | Permit no-cost production quotas under a billed Blaze project when all security/privacy/region controls remain intact; Sydney storage and backups stay paid. | Accepted |
| ADR-240 | 2026-08-16 | Use regional API Gateway as the sole public business-API endpoint, validating Firebase JWTs and invoking IAM-private Cloud Run through a dedicated service account. | Accepted |
| ADR-241 | 2026-08-16 | Defer external load balancing and Cloud Armor until legal/assessment, attack, public-scale, custom-domain or funded-budget triggers require them; prevent path bypass on upgrade. | Accepted |
| ADR-242 | 2026-08-16 | Use EAS Free for low-volume signed beta builds without depending on EAS Update; paid EAS or founder-controlled builds scale the same native project. | Accepted |
| ADR-243 | 2026-08-16 | Use Cloudflare Pages for static public support/legal/status/security content only, with no Functions, forms, cookies, analytics, identity or application proxy. | Accepted |
| ADR-244 | 2026-08-16 | Use ClamAV in bounded private Cloud Run Jobs with a controlled signature mirror; public malware-analysis services remain prohibited. | Accepted |
| ADR-245 | 2026-08-16 | Use generic direct FCM/APNs and authenticated in-app status for buyer/pharmacy workflow notifications; no transactional-email notification provider is required in MVP. | Accepted |
| ADR-246 | 2026-08-16 | Use GitHub Free and no-cost pinned security tools for documentation/synthetic work; enforced private branch protection is required before cloud-connected/sensitive code unless public source is explicitly approved. | Accepted |
| ADR-247 | 2026-08-16 | Use native map intents and verified coordinates, server-produced aggregate metrics and existing managed observability; do not add map, analytics, session-replay or support SaaS for MVP. | Accepted |
| ADR-248 | 2026-08-16 | Send identity/security email through Firebase Authentication templates using a verified founder-controlled MediFind sender/action-link domain; defer a separate SMTP/API provider until measured need and approval. | Accepted |
| ADR-249 | 2026-08-16 | Restrict Identity Platform SMS to Fiji, enforce Authentication App Check, monitor provider sent/blocked/verified signals and use a tested provider-level disable/restore breaker; the business API alone is not a hard SMS cap. | Accepted |
| ADR-250 | 2026-08-16 | Build MVP medicine search from a server-generated minimum public Firestore projection behind a backend search adapter; add a private managed index only under measured quality/latency/volume triggers. | Accepted |
| ADR-251 | 2026-08-16 | Implement persistent pseudonymous per-actor/action/window rate limits with expiration and transaction/precondition enforcement; never rely on instance memory or one global hot counter. | Accepted |
| ADR-252 | 2026-08-16 | Every 15 minutes, use a private idempotent Sydney Cloud Scheduler trigger to a dedicated scale-to-zero Cloud Run maintenance service for bounded expiry, staleness, deletion, scan recovery and aggregate reconciliation; reads also enforce effective time state. | Accepted |
| ADR-253 | 2026-08-16 | Use OpenTofu plus reviewed Firebase declarative configuration, private versioned Sydney GCS remote state and GitHub OIDC/Google Workload Identity Federation with no long-lived deployment keys. | Accepted |
| ADR-254 | 2026-08-16 | Keep direct bounded Cloud Run Job scan execution for the pilot and add regional authenticated Cloud Tasks dispatch only when measured recovery/backlog/throughput requires it; tasks carry only opaque IDs. | Accepted |
| ADR-255 | 2026-08-16 | Use a second Sydney Cloud Scheduler job every six hours for a least-privilege ClamAV signature-updater Job; scanners read but cannot alter the mirror, and definitions older than 24 hours fail closed. | Accepted |
| ADR-256 | 2026-08-16 | Preserve 50/80/100% cost alerts; at the approved ceiling activate the tested provider-level SMS breaker and pause new prescription upload/scans while retaining safe search and existing records. | Accepted |
| ADR-257 | 2026-08-16 | Accept the initial whole-MVP low-fidelity design proposal, including its neutral unavailable treatment, generic buyer-facing prescription-review status and distinct collected state. This authorises only bounded future UI implementation after the remaining documentation gates; it does not authorise code, production data, cloud provisioning, release or a policy change. | Accepted |

## Entry template

Add a new row for each material decision or deviation. Include date, decision, alternatives considered where useful, owner, evidence/approval link, and status (`proposed`, `accepted`, `superseded`).
