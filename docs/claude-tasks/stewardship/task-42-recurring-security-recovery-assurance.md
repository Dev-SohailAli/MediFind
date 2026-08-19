# Task 42: Recurring security and recovery assurance

## Goal

Schedule and evidence recurring security, privacy, incident, backup/restore,
cost-breaker and recovery exercises so readiness does not decay after release.

Prepared implementation plan: [Task 42 recurring security and recovery assurance](../../superpowers/plans/2026-08-18-task-42-recurring-security-recovery-assurance-implementation.md).

## Gate

Requires Tasks 18, 20, 27, 36 and 37, named security/recovery owners,
approved synthetic scenarios, current access/vendor register and a rule for
when independent review is required.

## Read first

- [Incident response runbook](../../incident-response-runbook.md)
- [Security architecture and threat model](../../security-architecture-threat-model.md)
- [Pilot operations](../../pilot-operations.md)
- [Cost circuit breaker](../../cost-circuit-breaker-policy.md)
- [Repository security and delivery](../../repository-security-and-delivery.md)

## Scope

- Create a calendar for quarterly restore checks, annual incident exercises,
  access/vendor review, dependency/secret review, cost-breaker rehearsal,
  authorization/redaction regression and accessibility/security review.
- Define scenario owners, evidence minimums, severity, time-to-contain,
  recovery/data-loss targets, corrective-action deadlines and retest rules.
- Rehearse synthetic prescription-exposure, MFA compromise, malicious file,
  cross-branch authorization, kill-switch and backup-failure scenarios.
- Track findings to closure and require an ADR/policy update when a control or
  architecture changes.

## Out of scope

Real incident simulation, production credential handling, formal certification,
public vulnerability disclosure of unfixed issues, automatic remediation and
weakening controls to meet a schedule.

## Acceptance

- Each recurring control has owner, cadence, evidence location, stop condition
  and last/next review date.
- Failed critical containment, restore or authorization exercises block the
  relevant protected capability until corrected and retested.
- Exercises preserve synthetic data boundaries and redacted evidence.
- The release owner can see unresolved risk without receiving prohibited raw
  prescription, token or support content.

## Verification and handoff

Run document checks and approved synthetic exercises; run repository security
checks where code/config changed. Attach the calendar and corrective-action
register. Commit:
`chore: schedule recurring security and recovery assurance`
