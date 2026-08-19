# Task 13: Implement private prescription quarantine and scanning

## Status

This task is not executable under the current approvals. It is a high-risk
future brief only. Keep prescription upload disabled until every gate below
has a recorded pass.

See the [Task 13 high-risk gate plan](../../superpowers/plans/2026-08-18-task-13-prescription-quarantine-scanning-gate-implementation.md) for the fail-closed evidence matrix, synthetic rehearsal and conditional post-approval handoff.

## Required gates

Approve the exact R2 region/processor terms, object key scheme, content types,
10 MB/10-page limits, retention/deletion, access logging, recovery/restore,
malware engine/source and update freshness, isolated scanner identity/job
boundary, retry/backlog/cost controls, audit redaction, legal/privacy review
and independent security assessment. Rehearse all of them with synthetic
documents before real activation.

## Intended scope after approval

- Browser submits only to an authenticated Worker upload command.
- Worker creates a private quarantine object, returns an opaque request/scan
  reference and exposes only generic status.
- An isolated least-privilege asynchronous scanner fails closed on timeout,
  unknown, stale definitions or provider failure.
- Ordinary clients, non-reviewer staff and routine admins cannot read files.
- A reviewer sees only the selected pharmacy-scoped request after fresh MFA;
  the scanner never decides clinical validity or dispensing.
- Buyer cancellation/deletion behavior changes safely after pharmacy opening
  according to the approved retention policy.

## Acceptance after gates

Test unsupported type, oversize, page limit, malware, suspicious/legibility
flags, duplicate, timeout, stale scanner definitions, retry cap, unauthorized
download, retention deletion, recovery and cost breaker. Any unknown result
remains quarantined and generic.

Commit after approval: `feat: add private prescription quarantine workflow`
