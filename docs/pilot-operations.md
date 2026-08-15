# Pilot operations, release readiness and risks

## Pharmacy onboarding checklist

1. Capture owner and pharmacy details, Suva address, hours, contact and responsible-person evidence.
2. Verify against required regulator/professional records; record decision, reviewer and evidence reference.
3. Assign owner/staff roles; train staff on listings, prices, freshness, prescription handling, reservation expiry and support escalation.
4. Create test listings and test a prescription notification/review without real health data.
5. Approve public activation only when the compliance checklist and pharmacy SOP acknowledgement are complete.

## Support and escalation

Support may resolve account, access, translation, listing-quality and technical issues. It must not provide medical advice or make dispensing decisions. Urgent health concerns are directed to emergency/health services. Suspected forged prescription, unsafe medicine, account compromise, data exposure or regulatory complaint is escalated immediately to the designated security/compliance lead and pharmacy owner, with an audit case.

## Analytics

Collect the minimum aggregated operational data needed for: searches and zero-result rate; listing freshness; search-to-detail and request conversion; pharmacy verification duration; prescription and reservation response times; approval/decline/expiry rates; notification delivery; support categories; and accessibility/language feedback. Do not put prescription content, medicine free text entered for clinical context, or direct identifiers in analytics.

## Key risks and controls

| Risk | Control |
| --- | --- |
| Stale or inaccurate stock/price | timestamps, stale labels, staff training, reminders, moderation and buyer reporting |
| Fraudulent pharmacy or staff access | verification, owner approval, MFA, scoped roles and audit logs |
| Prescription disclosure | encryption, selected-pharmacy-only access, expiring links, audit alerts and retention deletion |
| Buyer assumes a guarantee or medical advice | explicit safety language, controlled UX and pharmacy final decision |
| Translation changes safety meaning | professional review and versioned translated content |
| Connectivity/notification failure | in-app status is source of truth, delivery monitoring and retry/fallback support |

## Release gate

Release only when documentation approval, Fiji legal/pharmacy review, security/privacy review, translated-content review, pharmacy onboarding completion, buyer/pharmacy/admin journey tests, accessibility checks, recovery/incident exercises and pilot support ownership are documented. Record approval in the decision log.
