# Prescription scanning workflow policy

## Fail-closed private pipeline

Prescription files enter private quarantine after authenticated, selected-branch upload validation. They are not available to a pharmacy reviewer, web client/PWA or ordinary API route until a regional private scanning workflow produces an authorised safe/reviewable classification.

1. API validates selected branch/request/consent, permitted type/size/page count and creates a quarantine object/metadata record through server credentials.
2. API emits an internal, minimal job event to the approved private job/queue mechanism. The event contains opaque references only; no file bytes, public URL or prescription content.
3. A non-public regional scanning worker consumes the job asynchronously. It performs the approved technical scan/classification, metadata handling and result transition.
4. The worker writes only the minimum classification/status/audit output. It never determines prescription legitimacy, clinical validity or dispensing outcome.
5. Only after a safe/reviewable result does the API allow the selected branch’s explicit authorised reviewer to request a short-lived display grant under current MFA/biometric/role/branch checks.

## Access model

- The scanner uses a dedicated least-privilege service account limited to the quarantine object path and minimal result/job records. It has no general Firestore/Storage administration, user impersonation or broad production access.
- The web app/PWA receives no object-store credential, file path, reusable URL or scanner credential. Ordinary API routes cannot proxy arbitrary storage/object access.
- Internal queue/job invocations require authenticated service identity, schema validation, idempotency/replay protection and an audit/correlation reference. The worker endpoint is not publicly reachable.
- Scan definition/update source, worker image/dependency patch policy and service-account permissions require the same supply-chain and configuration review as other production components.

## Selected low-cost execution model

- Use ClamAV as the initial malware engine inside the MediFind-controlled scanner image. It is open source and Google documents a Cloud Storage/Cloud Run scanning architecture, but this selection does not make a file clinically valid or guarantee detection. Pin and scan the image/packages, test representative safe/malicious synthetic fixtures and maintain an approved signature update/mirror process. [Google Cloud reference architecture](https://cloud.google.com/architecture/automate-malware-scanning-for-documents-uploaded-to-cloud-storage) and [ClamAV documentation](https://docs.clamav.net/)
- Use one Cloud Run Job execution per submitted scan, with only an opaque scan-job ID passed at execution. A job runs its task and exits; there is no always-on scanning worker or public scanning HTTP endpoint.
- The API service account receives only the permission to run the specific scanner job. The scanner job service account receives only the particular quarantine/result/job resources it needs.
- Configure one task per scan execution, conservative memory/CPU/time limits, a low pilot concurrency cap and a maximum of three job attempts. Each job retry is auditable and uses the same opaque scan-job record.
- After the third failed attempt, mark the scan `unknown`, keep it quarantined, alert the founder and require a controlled server-side reprocess; no automatic safe release occurs.
- Keep an approved ClamAV signature mirror in private Sydney storage so parallel/cold-start jobs do not repeatedly download the full public database or trigger upstream rate limits. A dedicated Sydney Cloud Scheduler job invokes a bounded signature-updater Cloud Run Job every six hours. Its scheduler identity can execute only that updater; the updater can retrieve the approved ClamAV source and write only the mirror; scanner identities can read but not alter it. Record verified source/version/time without leaking credentials. Alert on an update failure and fail scans closed when the last verified definitions exceed 24 hours. Non-production uses manual/synthetic update execution unless its own schedule is explicitly costed.
- Monitor job count, duration, failures, retries, signature age, queue/backlog, storage growth and cost against the FJD 50-100 monthly ceiling. Small executions may fit Cloud Run's no-cost allowance, but Sydney signature/prescription storage remains billable. If actual scanner cost/controls cannot remain within budget, do not accept real prescriptions; retain discovery/reservation-only synthetic/non-sensitive validation while funding/pricing is revisited.

## Timeout, failure and unknown result

- The workflow is fail-closed. A timeout, worker/provider failure, malformed/unknown result or unprocessed job keeps the file blocked/quarantined and prevents reviewer file display.
- The buyer sees only a generic pending/retry/support state; never disclose malware, tamper, scanner/provider or detection detail. The selected pharmacy sees only the approved restricted technical status appropriate to its workflow.
- Alert on queue backlog, worker failure, scan timeout, repeated unknown classification or quarantine access anomaly. Investigate through the incident/runbook path and use the prescription kill switch where needed.
- A safe retry/reprocess uses a server-controlled, idempotent internal action; it does not expose the original file to a client or automatically treat a failed scan as safe.

## Tests and readiness

Test quarantine-before-scan, worker-only access, Cloud Run Job opaque-ID execution/IAM, three-attempt fail-closed outcome, safe/reviewable/blocked/unknown/timeout states, no reviewer grant before authorised result, selected-branch isolation, generic buyer response, alerts/backlog, reprocess idempotency, updater/scanner permission separation, six-hour update invocation, 24-hour stale-definition block, cost/concurrency containment and scan-worker permission denial. Real prescription activation also requires the scanner vendor/configuration/processor review listed in the backend pipeline documentation.
