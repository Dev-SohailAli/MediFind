# Task 26: Privacy-minimised product evidence and metrics

## Goal

Turn pilot learning into repeatable product decisions using aggregate,
privacy-minimised evidence rather than raw analytics or user surveillance.

## Gate

Requires Task 22 release evidence, a founder-approved metric list, data-owner
review and confirmation that every metric has a retention, access and deletion
rule. Do not add an analytics SDK, session replay or advertising system.

## Read first

- [Data dictionary and ownership](../../data-dictionary-and-ownership.md)
- [Pilot performance and reliability targets](../../performance-and-reliability-targets.md)
- [Audit-log policy](../../audit-log-policy.md)
- [Business and commercial model](../../business-and-commercial.md)
- [Free-first production architecture](../../free-first-production-architecture.md)

## Scope

- Define a small event/metric dictionary for search success, freshness,
  reservation outcomes, support load, accessibility findings, latency and
  cost-breaker events.
- Store only bounded aggregate/time-bucketed values with no raw query,
  medicine, prescription, contact, device token or unnecessary identifier.
- Add server-side redaction tests and role-scoped operational views/exports.
- Define baselines, sustained thresholds, cohort comparisons and decision
  templates for expansion, remediation, pause and rollback.
- Reconcile metrics against operational records without making metrics the
  authority for state transitions.

## Out of scope

Advertising, cross-site tracking, session replay, buyer profiling, public
ratings, raw query history, location trails, health inference and automatic
ranking or pricing decisions based on metrics.

## Acceptance

- Every emitted metric has an owner, purpose, aggregation, retention and
  access classification.
- Synthetic tests prove prohibited values cannot enter events, logs, exports or
  error messages.
- Dashboards/exports show uncertainty and sample limits; no metric silently
  represents missing data as zero.
- The founder can use the evidence to decide whether to expand, fix, pause or
  keep the pilot unchanged.

## Verification and handoff

Run quality checks, metric schema tests, redaction tests and representative
load checks. Attach a metric dictionary and sample synthetic export. Commit:
`feat: add privacy-minimised pilot evidence metrics`

Implementation plan: [Task 26 privacy-minimised product evidence and metrics plan](../../superpowers/plans/2026-08-18-task-26-product-evidence-metrics-implementation.md)
