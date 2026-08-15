# Security and privacy incident response runbook

## Purpose and operating rule

This runbook governs security, privacy and workflow-safety incidents during the pilot. It is not legal advice; Fiji legal/pharmacy requirements govern final notification, evidence and record obligations. Protect people and stop harmful access first. Do not delay safe containment while waiting for perfect facts.

## Severity classification

| Severity | Examples | Initial response |
| --- | --- | --- |
| Critical | Suspected prescription exposure; privileged pharmacy/admin compromise; cross-pharmacy prescription routing/access; active malware/unsafe upload bypass; lost production signing/secret; destructive data-loss/backup failure | Immediate automatic/manual containment and founder alert, including outside support hours |
| High | Confirmed account takeover without known prescription exposure; material authorization defect; repeated suspicious access; major API/OTP abuse; unavailable prescription/reservation workflow without safe fallback | Contain and triage urgently during the next practical support response; elevate to critical when sensitive data/safety impact is suspected |
| Normal | Individual listing, translation, access or service issue without security/privacy/safety impact | Handle through normal support and track trend/escalation |

## Critical incident procedure

1. **Contain immediately.** Revoke affected sessions/tokens, suspend roles/branches, quarantine files, disable affected feature flags or use the prescription/reservation kill switch. Preserve safe non-sensitive search where possible. Do not change or delete forensic evidence merely to make the alert disappear.
2. **Alert and record.** Alert the founder immediately. Open an immutable incident record with unique ID, reporter/source, initial time, classification, containment actions, systems/functions affected and assigned owner. Keep prescription content and unnecessary identifiers out of the record.
3. **Assess safely.** Establish what happened, whether data/access was affected, the known affected population, ongoing risk, vendor/processor involvement and legal/pharmacy escalation needs. Use least-privilege, audited access; break-glass rules still apply.
4. **Communicate.** Give affected buyers/pharmacies timely, factual notice through verified channels once facts and Fiji legal obligations permit. Do not conceal a confirmed incident, speculate, blame, include unnecessary personal data or explain attacker methods. Publish a safe status update for a material service outage without revealing sensitive forensic detail.
5. **Recover.** Correct the cause, rotate compromised credentials, restore only verified-safe systems/data, validate authorization and monitoring, and obtain explicit owner approval before re-enabling sensitive functions.
6. **Review.** Complete a documented post-incident review within five business days. Record root cause/contributing factors, affected data/systems, timeline, containment, notification decisions, corrective/preventive actions, owner/due date and verification evidence. Track actions to closure; update the relevant docs/ADR when policy or architecture changes.

## Evidence and privacy

Preserve only necessary evidence with limited, logged access and an integrity-preserving timeline. Do not paste raw prescriptions, OTPs, passwords, access tokens, full phone/email values or sensitive support free text into tickets, chat, analytics or status pages. Follow the approved retention schedule when available; if not yet approved, preserve evidence only under the documented legal/pharmacy escalation path.

## Exercises and acceptance

Before pilot activation and at least annually thereafter, rehearse with synthetic data: a suspected prescription exposure, privileged MFA compromise, malicious file, accidental cross-branch authorization attempt, kill-switch use and a backup/restore failure. Record elapsed containment, missed controls, communications rehearsal and corrective actions. A failed critical containment exercise blocks real-prescription activation until corrected and re-tested.
