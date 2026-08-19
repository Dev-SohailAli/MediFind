# Task 36: Independent assurance and public readiness

## Goal

Create an evidence packet for an independent review of security, privacy,
accessibility, language, safety, cost, recovery and release controls before a
larger public cohort is considered.

## Gate

Requires Tasks 23-29, a named independent reviewer or review scope, current
legal/privacy position, representative synthetic/protected test evidence as
approved, and a founder decision on the proposed cohort. This task does not
declare public readiness.

## Read first

- [Security/privacy/compliance](../../security-privacy-compliance.md)
- [Security architecture and threat model](../../security-architecture-threat-model.md)
- [Accessibility policy](../../accessibility-policy.md)
- [Incident response runbook](../../incident-response-runbook.md)
- [Test and acceptance strategy](../../test-and-acceptance-strategy.md)
- [Repository security and delivery](../../repository-security-and-delivery.md)

## Scope

- Define review scope, evidence inventory, reviewer independence, severity
  model, remediation owner, retest and release-blocking criteria.
- Include authorization/anti-enumeration, redaction, file/quarantine status
  where applicable, recovery, backup/restore, rate limits, cost breakers,
  accessibility/language and rollback.
- Reconcile hosted claims, browser/device results, Worker results, dependency/
  secret scans and operational exercises to exact commits/environments.
- Establish a public-readiness decision record with continue, remediate,
  restrict or stop outcomes.

## Out of scope

Formal certification claims, a bug bounty, public vulnerability disclosure of
unfixed details, production penetration testing without written scope,
deployment, public-source visibility change and cohort expansion.

## Acceptance

- Every critical control has direct evidence or is explicitly marked missing;
  absence of a finding is not treated as proof.
- Critical privacy, authorization, safety, recovery or rollback gaps block the
  proposed cohort until retested.
- Findings contain no credentials, raw prescription content or private
  correspondence in source, PRs or public artifacts.
- The final record names approver, scope, commit, environment, residual risk
  and next review date without claiming more than was tested.

## Verification and handoff

Run the repository quality suite and evidence-integrity checks; perform only
approved local/browser/synthetic review steps. Attach the independent review
plan and unresolved blockers. Commit:
`docs: prepare independent public-readiness assurance packet`

Implementation plan: [Task 36 independent assurance and public readiness plan](../../superpowers/plans/2026-08-18-task-36-independent-assurance-public-readiness-implementation.md)
