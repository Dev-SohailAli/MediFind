# Pilot operations, release readiness and risks

## Pharmacy onboarding checklist

1. Capture owner and pharmacy details, Fiji address, hours, contact, business-registration evidence, pharmacy/licensing evidence and responsible-person evidence.
2. Verify against required regulator/professional records; record decision, reviewer and evidence reference. The pilot activates only Suva branches, while the data model supports future Fiji expansion.
3. Assign owner/staff roles; train staff on listings, prices, freshness, prescription handling, reservation expiry and support escalation.
4. Create test listings and test a prescription notification/review without real health data.
5. Approve public activation only when the compliance checklist and pharmacy SOP acknowledgement are complete.

Verification remains valid for 12 months or the earliest relied-on evidence expiry, with owner reminders at 60 and 30 days. Expired evidence or a material pharmacy ownership/legal-name/branch/licence/responsible-person/official-contact change suspends public discovery, prescription handling and reservations until MediFind re-approves it under the [pharmacy verification policy](pharmacy-verification-policy.md).

## Pilot service commitments

- Pharmacy staff must review and refresh publicly visible availability and listed prices at least once per business day.
- The platform visibly labels and de-ranks listings that exceed the configured freshness threshold; it must never imply that a stale listing is current.
- At 24 hours without a listing refresh, mark it "may be outdated" and de-rank it. At seven days, remove it from search until refreshed. Monitor these thresholds and notify pharmacies before removal where feasible.
- Each pharmacy is expected to respond to prescription reviews and reservation requests within one pharmacy business day. MediFind must show its opening hours and must not promise a response outside them.
- The default approved-reservation expiry is 24 hours. The approving pharmacy may set a shorter or longer expiry and must communicate the actual expiry and pickup instructions to the buyer.
- Each branch maintains normal operating hours plus holiday/exceptional closures. Validate reservation expiry against those hours and do not present an expiry that prevents collection while the branch is open.

## Pilot audience and success criteria

The buyer pilot is invite-only and limited to people personally invited by MediFind or referred by a participating pilot pharmacy. Do not publish a general buyer acquisition campaign during this phase.

Pilot success requires: two to three verified and actively maintained pharmacy branches; at least 80% listing-refresh compliance; most prescription/review and reservation requests answered within one pharmacy business day; no unresolved high-severity privacy or security incident; and clear qualitative evidence that participating pharmacies see enough value to consider a future paid service. Refine numerical thresholds after representative pilot volume is known.

## Availability and support

MediFind provides founder-operated support Monday to Friday, 9:00am–5:00pm Fiji time, excluding public holidays, during the pilot. The app and support content must make these hours clear and must never imply emergency, clinical or 24/7 support. Urgent health concerns are directed to emergency/health services, not MediFind.

During a planned or unplanned service interruption, show a clear in-app maintenance/outage notice and link to a simple public status page. The status page must state the affected function, start time, current state and next update time without exposing sensitive operational/security details.

Schedule planned maintenance outside typical Fiji pharmacy hours whenever practical and provide at least 24 hours' in-app/status-page notice. For suspected prescription exposure, suspicious privileged access, backup/restore failure or another critical security signal, notify the founder immediately even outside published support hours. This internal alerting does not create a public 24/7 support promise.

Maintain an audited emergency kill switch that can suspend prescription upload and reservation functions independently, while retaining non-sensitive pharmacy search if safe. Record the reason, actor, affected functions, start/end time, buyer/pharmacy notice and recovery validation for every activation.

For a recoverable outage, target restoration of core service within one Fiji business day and accept no more than a 24-hour data-loss window from the most recent verified backup. Do not re-enable prescription upload/review or reservations after restore until data integrity, authorization, audit and notification checks succeed. The MVP does not provide active multi-region failover; communicate a regional outage and recovery state through the public status page without exposing sensitive infrastructure detail.

The public status page is an informational static page, not a support inbox. Buyers report account/security/technical issues through the authenticated in-app route and contact pharmacies directly for medicine/prescription/reservation questions. Pharmacy owners/staff use a branch-scoped in-app operational support route. There is no official WhatsApp support channel during the MVP.

## Service-account ownership

Maintain a founder-controlled register of every critical vendor account (Cloudflare, domain/DNS, source control, monitoring and any separately approved identity/notification provider), its purpose, billing owner, MFA/recovery method, authorised users and renewal date. Review it monthly during the pilot and immediately after any contributor departure.

## Support and escalation

Support may resolve account, access, translation, listing-quality and technical issues. It must not provide medical advice or make dispensing decisions. Urgent health concerns are directed to emergency/health services. Suspected forged prescription, unsafe medicine, account compromise, data exposure or regulatory complaint is escalated immediately to the designated security/compliance lead and pharmacy owner, with an audit case.

Treat a reported suspicious message, impersonation attempt or unofficial app link as a security case. Preserve only necessary evidence, warn affected users/pharmacies through verified channels, revoke compromised access where indicated and publish safe guidance without repeating attacker content unnecessarily. Suspected prescription exposure, privileged compromise or unsafe prescription routing follows the critical procedure in the [incident-response runbook](incident-response-runbook.md), including immediate founder alert regardless of public support hours.

Operate a responsible disclosure intake through the published security-reporting contact and `security.txt` page. Acknowledge legitimate vulnerability reports within one business day, log triage/containment/fix decisions and coordinate confidentially with the reporter where appropriate. The MVP has no paid bug bounty program.

Treat every break-glass prescription-access event as a security/compliance case: record reason, approver (if any), scope, start/end time, actions, buyer-notice decision and follow-up. Review it after access ends; routine support must use metadata/status views instead.

MediFind may block, quarantine or escalate technically unsafe/suspicious uploads, but it does not certify a prescription as legitimate. Malware/unsafe files are blocked; safely processed reviewable flags use the pharmacy's restricted quarantine inbox. The selected pharmacy's qualified reviewer owns the validity and dispensing decision under its professional obligations.

## Analytics

Collect the minimum aggregated operational data needed for: searches and zero-result rate; listing freshness; search-to-detail and request conversion; pharmacy verification duration; prescription and reservation response times; approval/decline/expiry/cancellation rates and reasons; collection/no-longer-needed confirmations; notification delivery; support categories; private pilot feedback; and accessibility/language feedback. Produce counters server-side from approved operational/audit events and use browser/server operational statistics; do not add an analytics or session-replay SDK in MVP. Do not put prescription content, medicine free text entered for clinical context, raw contact details, medicine-search history or direct identifiers in analytics. Advertising, behavioural profiling and data-broker tracking are prohibited.

## Key risks and controls

| Risk | Control |
| --- | --- |
| Stale or inaccurate stock/price | timestamps, stale labels, staff training, reminders, moderation and buyer reporting |
| Fraudulent pharmacy or staff access | verification, owner approval, MFA, scoped roles and audit logs |
| Prescription disclosure | encryption, selected-pharmacy-only short-lived in-app access grants, audit alerts and retention deletion |
| Buyer assumes a guarantee or medical advice | explicit safety language, controlled UX and pharmacy final decision |
| Translation changes safety meaning | professional review and versioned translated content |
| Connectivity/notification failure | in-app status is source of truth, delivery monitoring and retry/fallback support |
| Founder capacity creates delayed support or verification | limit pilot to 2–3 pharmacies, define support hours, record queues and defer automation only after evidence |
| Poor-quality or misleading listing | automatic required-field/format checks, private buyer reports, logged admin review and moderation/removal authority |
| Vendor/contractor account lockout | founder-owned accounts, MFA, recovery documentation, least privilege and monthly ownership review |
| Data loss or unrecoverable outage | encrypted daily backups, 30-day initial retention, pre-pilot and quarterly restore tests, documented recovery procedure |
| Support demand exceeds founder capacity | 2–3 pharmacy cap, published Fiji business hours, self-service help, support queue and non-emergency scope |
| Sensitive feature is unsafe during incident | auditable kill switch disables uploads/reservations while preserving safe search where possible |

## Release gate

Release only when documentation approval, Fiji legal/pharmacy review, security/privacy review, translated-content review, pharmacy onboarding completion, buyer/pharmacy/admin journey tests, accessibility checks, recovery/incident exercises and pilot support ownership are documented. Record approval in the decision log.
