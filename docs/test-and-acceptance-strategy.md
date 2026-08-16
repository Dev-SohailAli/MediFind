# Test and acceptance strategy

## Test environment rule

Automated tests never use a production Firebase/GCP project, production credentials or real buyer/pharmacy/prescription data. Backend/Firebase integration tests run against emulators or a separate synthetic-data test project. Test projects have their own credentials, App Check debug setup and budgets; debug tokens remain private and are never committed or shipped.

## Required test layers

| Layer | Required coverage |
| --- | --- |
| Unit | Domain/state-transition logic, validation, money/time calculations, normalisation, privacy helpers, error mapping |
| API/integration | Authentication/App Check verification, role/branch/request authorization, Firestore transactions, file quarantine, rate limits, audit events, idempotency and feature flags |
| End-to-end | Approved buyer, pharmacy and admin journeys using synthetic fixtures only |
| Security | Negative access tests, malformed input, replay/idempotency, session/device revocation, upload quarantine, log/telemetry/crash-report redaction and kill-switch behaviour |
| Accessibility/localisation | WCAG 2.2 AA target; screen-reader labels/order, touch targets, 200% text scaling, contrast, light/dark themes, English/iTaukei/Fiji Hindi layout and safe fallback strings; physical VoiceOver/TalkBack critical-journey validation |
| Device/release | Signed beta build on at least one physical iPhone and one physical Android device before every beta release, including grant/deny/revoke flows for each permitted mobile permission |

## Security-sensitive coverage standard

Maintain at least 90% branch coverage for security-sensitive and domain/API code. This includes authorization guards, role/branch/request checks, prescription/quarantine handling, reservation/prescription state machines, session/device management, feature flags, rate limits, audit emission, privacy redaction and money/time calculations. Coverage is a floor, not proof of correctness.

Every role, authorization boundary and allowed/forbidden state transition requires explicit positive and negative tests. Tests must prove a buyer cannot access another buyer's request, a staff member cannot cross branch boundaries, inventory roles cannot view prescriptions, admins cannot routinely view content, stale/idempotent requests do not create duplicate actions, and disabled features fail safely.

Edge tests must prove API Gateway rejects an invalid Firebase issuer/audience/signature/expiry, passes only its verified identity context, and alone can invoke Cloud Run. Direct/unauthenticated Cloud Run calls and spoofed gateway identity headers must fail. Backend tests separately prove missing/invalid App Check, role/record and rate-limit failures even after gateway authentication. Distributed rate-limit tests use multiple instances/concurrent requests and prove counters survive cold starts, avoid raw IP storage/global hot documents, expire correctly and fail safely. If Cloud Armor/load balancing is later enabled, test that every default/direct endpoint is blocked from bypassing it.

Mutation tests must prove 24-hour same-context idempotent retries return one result/side effect, changed/cross-context key reuse conflicts safely, stale record versions never overwrite current data, and a client cannot invoke an arbitrary or unlisted state transition.

API error tests must validate allow-listed stable code/message key/request ID output, translated client coverage, safe caller-field validation only, anti-enumeration behaviour and absence of stack/provider/database/security-rule/raw exception detail.

Role-combination tests must prove a buyer/staff account switches to a distinct authorised workspace without cross-context data leakage, multi-branch access requires separate assignments, and a pharmacy owner without explicit reviewer role cannot list, open or download prescription requests.

Staff-lifecycle tests must prove seven-day invitation expiry/reissue invalidation, one active invitation context, proof/MFA before activation, last-owner protection, ownership re-verification, last-reviewer Rx disablement/hide, OTC continuity and safe restoration.

Audit tests must prove every mandatory action produces a structured append-only event; event payloads omit prescription content, tokens, OTPs and unnecessary identifiers; owners see only their branch-scoped permitted history; and no normal user or routine administrator can alter/delete audit history.

Catalog tests must prove harmless variants link to the same canonical concept while preserving the pharmacy display entry; incompatible active ingredient/strength/form/route/release/pack/brand variations never auto-merge; ambiguous/unmatched listings remain private; and admin concept moderation cannot change pharmacy price, availability or clinical/dispensing outcomes.

Recovery tests must prove buyer recovery revokes old sessions and imposes the full 24-hour sensitive-action hold, staff cannot bypass authenticator MFA without owner-controlled revoke/reset/re-invitation, and owner/admin recovery leaves privileged actions suspended until manual evidence verification, fresh sign-in and new MFA enrollment complete.

Phone-verification tests must cover E.164 `+679` normalisation/masking, six-digit code expiry, resend invalidation, repeated-attempt throttling, generic anti-enumeration errors, no manual/WhatsApp/unverified-email bypass, Fiji-only SMS-region enforcement, Authentication App Check, provider sent/blocked/verified alerts, provider-level breaker propagation/restore and Fiji mobile-network synthetic delivery evidence before buyer beta activation.

Pharmacy-verification tests must cover 12-month/earliest-evidence expiry calculation, 60/30-day reminders, automatic branch suspension on unrenewed expiry, neutral buyer handling with no prescription forwarding, re-approval restoration, and mandatory review before a material change becomes public.

Branch location/hours tests must cover Fiji structured address/private re-verification state, public directions without buyer-location disclosure, weekly split/closed hours, exceptional-date precedence and `Pacific/Fiji` request/reservation expiry at closing/holiday boundaries.

Offline/reconnect tests must prove that only minimum public results can be cached, sensitive content/mutations are unavailable offline, no sensitive request is queued, and reconnect/app-resume re-fetches/authorises the current server record before display or change. Redaction tests must capture representative failures and prove monitoring payloads contain none of the prohibited identifiers, health/prescription data, medicine-search text, tokens or support free text.

## Synthetic fixture catalogue

Create clearly fictional fixtures for buyer, dependent, pharmacy, branch, staff roles, eligible OTC listing, prescription-required listing, stale/unavailable listing, reservation states, quarantine cases and audit events. Use fake prescription documents with no real person, provider, medicine record or health information. Version fixtures with the relevant contract and never use screenshots/documents copied from real workflows.

Upload tests must cover each allowed type, 10 MB boundary, 10-page boundary, unsupported/oversized/unsafe file handling, metadata stripping, selected-pharmacy-only routing, generic error wording and the fact that no malware/tamper detection signal reaches the buyer.

Scanning-workflow tests must prove quarantine-before-processing, worker-only object access, authenticated/replay-safe internal jobs, fail-closed timeout/unknown/error handling, no reviewer grant before an authorised result, generic buyer messaging, branch isolation, alert/backlog handling and idempotent reprocess.

ClamAV tests must record pinned engine/signature versions, signature freshness/update failure, known harmless and standard anti-malware test fixtures, cold-start/mirror behaviour, three-attempt cost containment and fail-closed stale/unknown results. They do not claim that a clean result proves legitimacy or complete malware absence.

Notification tests must prove generic payloads only, permission-denial fallback to in-app status, deep-link authentication/re-fetch, stale/duplicated notification safety, token revocation and no direct realtime/polling dependency.

Dynamic-content tests must prove translated system templates, language-labelled pharmacy notes, strict plain-text length/sanitisation, link/contact rejection, prohibited-content moderation and absence from notifications/analytics/error logs.

Price tests must prove required exact-pack FJD price, no price range/contact/estimate exposure, FJD minor-unit handling, version/audit change control, public propagation and approved-reservation confirmed-price integrity.

Search-projection tests must prove deterministic exact/prefix/approved-alias results, no unrestricted fuzzy/clinical substitution, five-minute propagation, source `lastUpdatedAt` integrity, no buyer query/location/private data in the projection and identical API results through a fake alternate search adapter. Representative volume tests record index/write/read amplification and p95/quality evidence.

Scheduled-maintenance tests must prove private least-privilege 15-minute invocation, bounded cursor/resume, idempotent retries, 30-minute stale-cursor alert and safe reconciliation for listing staleness, request/reservation expiry, retention/deletion and orphaned scans. A missed/late/duplicated run must not make an expired record valid because API reads/actions independently use trusted server time. Signature tests prove the separate six-hour updater identity, mirror write/scanner read-only separation, verified version/time and fail-closed behaviour after 24 hours without verified definitions.

Infrastructure tests must validate/plan OpenTofu without secrets, prove remote-state access/version recovery, reject an untrusted repository/branch/environment OIDC subject, confirm no stored service-account JSON key and require founder approval for production apply.

## Beta release acceptance matrix

Before a beta release, record:

- commit/version, feature flags, environment and tester cohort;
- passed automated checks, coverage result and dependency/security scan result;
- API authorization/negative-test result and synthetic upload/quarantine result;
- accessibility/localisation result for changed screens;
- physical iOS 15+ and Android 10+ test device/version and result;
- budget/OTP alert, monitoring and rollback rehearsal result where changed;
- safe simulated cost circuit-breaker evidence where high-cost paths/budgets change;
- current free-allowance consumption/forecast, any 70% scale trigger and all billable exceptions (especially Fiji SMS, Sydney storage and backups);
- performance evidence for changed search/index paths against the approved p95/first-result/pagination/propagation targets;
- backup/restore evidence showing the 24-hour RPO and one-business-day core-service RTO targets, where backup/recovery is in scope;
- open defects, risk acceptance owner and release approval.

Block release for any failing required check, high-severity security/privacy issue, unresolved authorization/state-machine defect, synthetic-data policy breach, unavailable rollback path or unapproved documentation conflict.

Before pilot activation, complete and record synthetic incident exercises for suspected prescription exposure, privileged MFA compromise, malicious upload, cross-branch authorization failure, kill-switch operation and backup/restore failure. A failed critical containment exercise blocks real-prescription activation until corrected and re-tested.

## Claude task requirements

Each Claude task brief names the relevant test layers, fixture additions, acceptance cases and commands. Claude reports raw command outcomes and does not claim unrun tests passed. New bug fixes add a regression test unless a documented exception explains why this is not possible.
