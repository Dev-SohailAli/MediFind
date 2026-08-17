# Prescription scanning workflow policy

## Status

Prescription upload and scanning are disabled. This policy records the future
web-only gates and does not authorize an R2 binding, upload route, scanner or
real prescription.

## Required future boundary

The browser submits only to an authenticated Cloudflare Worker route. The
Worker creates a private quarantine object in R2, issues an opaque scan-job
reference and exposes only generic status. Ordinary clients, pharmacy staff
without explicit reviewer access and routine admin views cannot read the file.

Any scanner must be isolated, least-privilege, asynchronous and fail closed on
timeout, unknown, stale-definition or provider failure. It must not decide
whether a prescription is clinically valid or whether a pharmacy dispenses.

## Gates before activation

Approve the exact R2 region/processor terms, object lifecycle and deletion,
content limits, malware engine/source and update process, Worker/job identity,
retry/backlog/cost controls, audit/redaction, recovery/restore, legal/privacy
retention and independent security assessment. Test all of this with synthetic
documents first. If the cost or controls cannot be demonstrated, keep
discovery and non-sensitive collection workflows available and uploads off.
