# MediFind Pilot Operations and Release Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Convert protected features into an operated, measurable, recoverable and supportable invite-only Suva pilot before any broader release.

**Architecture:** Operations remain server-owned and privacy-minimised. The Worker emits only approved aggregate operational events and owns kill-switch enforcement; D1 remains authoritative; backups/exports and recovery are tested with synthetic data. The browser receives truthful status and safe degraded behavior, never operational secrets or incident detail.

**Spec:** `docs/pilot-operations.md`, `docs/pharmacy-onboarding-and-training.md`, `docs/performance-and-reliability-targets.md`, `docs/incident-response-runbook.md`, `docs/data-dictionary-and-ownership.md`, `docs/cost-circuit-breaker-policy.md`, `docs/infrastructure-and-release-blueprint.md`, and `docs/accessibility-policy.md`.

## Release dependency graph

```text
Protected tasks 8–15
  ├── Task 16 pharmacy onboarding/training/activation
  ├── Task 17 branch hours, freshness and reconciliation
  ├── Task 18 backup/export/restore/deletion
  ├── Task 19 cost breakers and independent feature kill switches
  ├── Task 20 incident exercises and privacy-minimised operations
  └── Task 21 performance, accessibility, language and beta acceptance
       └── Task 22 staged invite-only release and rollback rehearsal
```

No task in this roadmap authorizes a public acquisition campaign, payment,
delivery, analytics SDK, session replay, production real data or a production
release by itself.

## Operational task table

| Task | Deliverable | Depends on |
| --- | --- | --- |
| 16 | Pharmacy onboarding, training and activation readiness | Protected workflows 8–12 |
| 17 | Fiji hours, freshness and bounded reconciliation | Branch/listing/reservation contracts |
| 18 | Backup, export, restore and deletion rehearsal | Data classification and retention approval |
| 19 | Cost breakers and independent feature kill switches | Founder budget and re-enable authority |
| 20 | Incident exercises and operational privacy controls | Named incident owners and synthetic scenarios |
| 21 | Performance, accessibility, language and beta acceptance | Stable protected flows and test devices |
| 22 | Staged invite-only release and rollback rehearsal | Tasks 16–21 and release owner |

## Execution rules

Run Tasks 17–20 in parallel only when their D1 migration and Worker route
scopes are disjoint. Task 18 must be complete before real data activation.
Task 19 must be rehearsed before enabling any costly or sensitive mutation.
Task 20 must be exercised before prescription activation. Task 21 combines
manual browser evidence with synthetic load evidence. Task 22 is a release
board gate, not a coding shortcut.

Each agent reports exact device/network/load inputs, data classification,
retention, owner, alert threshold, rollback, evidence location and unresolved
risk. A missing operational owner blocks release.

## Task briefs

- [Task 16 — pharmacy onboarding and activation](../../claude-tasks/operations/task-16-pharmacy-onboarding-activation.md)
  - [Implementation plan](2026-08-18-task-16-pharmacy-onboarding-activation-implementation.md)
- [Task 17 — branch hours, freshness and reconciliation](../../claude-tasks/operations/task-17-hours-freshness-reconciliation.md)
  - [Implementation plan](2026-08-18-task-17-hours-freshness-reconciliation-implementation.md)
- [Task 18 — backup, export, restore and deletion](../../claude-tasks/operations/task-18-backup-restore-deletion.md)
  - [Implementation plan](2026-08-18-task-18-backup-restore-deletion-implementation.md)
- [Task 19 — cost breakers and feature kill switches](../../claude-tasks/operations/task-19-cost-breakers-kill-switches.md)
  - [Implementation plan](2026-08-18-task-19-cost-breakers-kill-switches-implementation.md)
- [Task 20 — incident exercises and operational privacy](../../claude-tasks/operations/task-20-incident-exercises-operations.md)
  - [Implementation plan](2026-08-18-task-20-incident-exercises-operational-privacy-implementation.md)
- [Task 21 — performance, accessibility and beta acceptance](../../claude-tasks/operations/task-21-performance-accessibility-beta.md)
  - [Implementation plan](2026-08-18-task-21-performance-accessibility-beta-implementation.md)
- [Task 22 — staged invite-only release](../../claude-tasks/operations/task-22-staged-release-rollback.md)
  - [Implementation plan](2026-08-18-task-22-staged-release-rollback-implementation.md)

The next horizon is the [post-pilot growth roadmap](2026-08-18-post-pilot-growth-roadmap.md)
with [Tasks 23–29](../../claude-tasks/post-pilot/README.md). It begins only
after the release owner reviews pilot value, support load, cost, accessibility,
safety incidents and pharmacy/buyer feedback.
