# MediFind scale-options and public-growth roadmap

> **Handoff status:** planning only. This horizon does not authorise a new
> provider, billing, public release, external data source, integration, real
> data, or change to an accepted ADR.

This horizon follows the post-pilot Tasks 23-29. It covers the optional
capabilities named in the product roadmap and the assurance needed before
MediFind becomes a larger Fiji service. It preserves the web-only client,
server-owned Worker boundary, provider-neutral contracts and explicit safety
gates.

## Entry gate

Start only after Tasks 23-29 have been reviewed and the founder has a written
decision on pilot value, support capacity, cost, current legal/privacy status,
accessibility outcomes, incident history, retention/deletion evidence,
rollback readiness and whether a larger public cohort is wanted. Every task
below may stop at a decision packet; none may infer approval from demand.

## Dependency graph

```text
Tasks 23-29 accepted
  |\
  | +--> Task 30 national Fiji cohort governance
  | +--> Task 31 pharmacy-integration evaluation
  | +--> Task 32 communication fallback evaluation
  | +--> Task 33 catalog-source and barcode decision
  | +--> Task 34 government-information decision
  | +--> Task 36 independent assurance and public-readiness review
  | +--> Task 37 continuity, ownership and service-exit plan
  |
  +-----> Task 35 paid-plan implementation gate (requires Task 28 decision)

Task 30 + Task 36 + Task 37
  ---------> larger public cohort or nationwide activation

Task 31 ----> any live pharmacy/POS/inventory integration task
Task 32 ----> any new notification/email provider task
Task 33 ----> any barcode/catalog-source implementation task
Task 34 ----> any government-program content or eligibility workflow
Task 35 ----> billing implementation only after legal, tax and founder approval
```

## Task queue

| Task | Brief | Primary outcome | Depends on | Execution state |
| --- | --- | --- | --- | --- |
| 30 | [National Fiji cohort governance](../../claude-tasks/scale-options/task-30-national-fiji-cohort-governance.md) | Evidence-based locality/cohort expansion controls | 23-29, legal/ops review | Future/gated |
| 31 | [Pharmacy-integration evaluation](../../claude-tasks/scale-options/task-31-pharmacy-integration-evaluation.md) | Provider-neutral integration decision packet | 23, 26, 27 | Future/gated |
| 32 | [Communication fallback evaluation](../../claude-tasks/scale-options/task-32-communication-fallback-evaluation.md) | Notification/email fallback options and privacy gate | 24, 26, 27 | Future/gated |
| 33 | [Catalog-source and barcode decision](../../claude-tasks/scale-options/task-33-catalog-source-barcode-decision.md) | Safety/legal decision on catalog expansion | 23, 26 | Future/gated |
| 34 | [Government-information decision](../../claude-tasks/scale-options/task-34-government-information-decision.md) | Non-clinical public-information scope decision | 24, 26, legal review | Future/gated |
| 35 | [Paid-plan implementation gate](../../claude-tasks/scale-options/task-35-paid-plan-implementation-gate.md) | Billing readiness packet, not billing code | 28, 30, 36, legal/tax | Future/gated |
| 36 | [Independent assurance and public readiness](../../claude-tasks/scale-options/task-36-independent-assurance-public-readiness.md) | External review and release decision evidence | 23-29, named reviewers | Future/gated |
| 37 | [Continuity, ownership and service exit](../../claude-tasks/scale-options/task-37-continuity-ownership-service-exit.md) | Founder continuity, access and shutdown plan | 27-29, legal review | Future/gated |

Implementation plans currently prepared: [Task 30 national Fiji cohort governance](2026-08-18-task-30-national-fiji-cohort-governance-implementation.md), [Task 31 pharmacy integration evaluation](2026-08-18-task-31-pharmacy-integration-evaluation-implementation.md), [Task 32 communication fallback evaluation](2026-08-18-task-32-communication-fallback-evaluation-implementation.md), [Task 33 catalog source and barcode decision](2026-08-18-task-33-catalog-source-barcode-decision-implementation.md), [Task 34 government information decision](2026-08-18-task-34-government-information-decision-implementation.md), [Task 35 paid-plan implementation gate](2026-08-18-task-35-paid-plan-implementation-gate-implementation.md), [Task 36 independent assurance and public readiness](2026-08-18-task-36-independent-assurance-public-readiness-implementation.md), [Task 37 continuity and service exit](2026-08-18-task-37-continuity-ownership-service-exit-implementation.md)

## Execution strategy

Tasks 30-34, 36 and 37 may be prepared in parallel when their evidence and
review scopes are separate. Task 35 stays documentation-only until the
commercial decision, legal/tax review and independent assurance are accepted.
No task should add a provider SDK, payment data, external catalog record,
government eligibility decision or public cohort flag as part of preparation.

Each coding-agent handoff must:

1. identify whether it is a decision packet, synthetic rehearsal or approved
   implementation;
2. name the exact policy/ADR and founder decision that opens its gate;
3. preserve the `apps/web` -> Pages -> Worker -> server-only data boundary;
4. state data categories, region/processor assumptions, retention, cost,
   failure behaviour, authorization, rollback and support owner;
5. use synthetic fixtures and redacted exports until protected approval is
   explicitly documented; and
6. return a stop report instead of guessing when a gate is missing.

## Coordinator handoff prompt

```text
Use docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md
as the planning source of truth. Read docs/claude-tasks/scale-options/README.md
and the selected brief before starting. Tasks 30-34, 36 and 37 are primarily
decision/readiness work. Task 35 must remain a billing-readiness packet unless
the founder has separately approved legal, tax, provider, data, security,
recovery, cost and rollback decisions.

Keep the product web-only and Cloudflare-first. Do not add native apps,
Firebase/GCP, a second backend, direct browser database access, external
catalog data, barcode scanning, live POS/inventory sync, email/SMS provider,
government eligibility logic, payments, delivery, advertising, public reviews,
chat or unrestricted public rollout. Do not infer a provider, region,
credential, contract, fee, retention rule or release cohort.

Use a task branch and PR, preserve unrelated worktree changes, run exact
repository and brief-specific checks, and report synthetic/protected status,
security/privacy/cost impact, rollback, support owner and residual risks. Do
not merge, deploy, enable billing, connect a live pharmacy system or expand
the cohort.
```

## Completion boundary

Even if this roadmap is accepted, MediFind is not automatically a nationwide,
paid, integrated or public service. Each optional capability needs its own
implementation task and current legal, privacy, security, cost, operational
and founder approvals.

The following maintenance horizon is the [governance and stewardship
roadmap](2026-08-18-governance-and-stewardship-roadmap.md), covering recurring
legal, privacy, accessibility, assurance, policy and human-operations work.
