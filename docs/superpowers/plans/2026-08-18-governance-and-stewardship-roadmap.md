# MediFind governance and stewardship roadmap

> **Handoff status:** planning only. These tasks maintain accountability and
> readiness; they do not authorise product expansion, data collection, a
> provider, billing, public activation or a change to an accepted ADR.

This horizon follows the scale-options and public-growth queue. It turns the
project's recurring legal, privacy, accessibility, support, security and
decision-control obligations into reviewable work. The service remains
web-only, Cloudflare-first, synthetic by default and founder-approved at every
material boundary.

## Entry gate

Tasks 30-37 must be accepted or explicitly closed with documented reasons. The
founder/release owner must name the current operator identity, legal/privacy
review status, support owner, security owner, accessibility/language reviewers,
repository owner and recovery contacts. Missing owners are a stop condition,
not a reason to invent a process.

## Dependency graph

```text
Tasks 30-37 accepted
  |\
  | +--> Task 38 operator/legal identity and obligations
  | +--> Task 39 privacy rights, retention and data governance
  | +--> Task 40 public support, status and disclosure operations
  | +--> Task 41 accessibility and localization maintenance
  | +--> Task 42 recurring security, recovery and incident assurance
  | +--> Task 43 ADR/source-of-truth governance
  | +--> Task 44 support and contributor capacity governance
  |
  +-----> any renewed public, paid or protected-data release decision

Task 38 + Task 39 + Task 40 + Task 41 + Task 42
  ---------> Task 45 annual/public readiness review

Task 43 + Task 44
  ---------> any material scope, owner, provider or release change

Task 45
  ---------> renewed decision or orderly exit

Task 46
  ---------> any external account, provider, contract or billing action

Task 47
  ---------> recurring buyer-facing safety and marketplace-integrity review

Task 48
  ---------> recurring pharmacy-professional protected-workflow review

Task 49
  ---------> recurring dependent-user data and authority review
```

## Task queue

| Task | Brief | Primary outcome | Depends on | Execution state |
| --- | --- | --- | --- | --- |
| 38 | [Operator/legal identity and obligations](../../claude-tasks/stewardship/task-38-operator-legal-identity.md) | Current operator, contract and insurance decision record | 30, 35-37, Fiji legal review | Future/gated |
| 39 | [Privacy rights, retention and data governance](../../claude-tasks/stewardship/task-39-privacy-rights-retention-governance.md) | Approved data map, rights and retention operating model | 27, 36-37, legal/privacy review | Future/gated |
| 40 | [Public support, status and disclosure operations](../../claude-tasks/stewardship/task-40-public-support-status-disclosure.md) | Safe public communication and responsible-disclosure runbook | 30, 36-37, operator identity | Future/gated |
| 41 | [Accessibility and localization maintenance](../../claude-tasks/stewardship/task-41-accessibility-localization-maintenance.md) | Recurring inclusive release evidence | 24, 30, 36 | Future/gated |
| 42 | [Recurring security and recovery assurance](../../claude-tasks/stewardship/task-42-recurring-security-recovery-assurance.md) | Annual/quarterly assurance calendar and exercises | 18, 20, 27, 36-37 | Future/gated |
| 43 | [ADR and source-of-truth governance](../../claude-tasks/stewardship/task-43-adr-source-governance.md) | Controlled policy, roadmap and supersession workflow | 29, 36-37 | Future/gated |
| 44 | [Support and contributor capacity governance](../../claude-tasks/stewardship/task-44-support-contributor-capacity.md) | Safe human-operations scaling and access review | 30, 37, support-owner review | Future/gated |
| 45 | [Annual and renewed public-readiness review](../../claude-tasks/stewardship/task-45-annual-public-readiness-review.md) | Dated continue/cap/pause/prepare/exit decision packet | 38-44, current owners and independent review where required | Future/gated |
| 46 | [Vendor, processor and contract renewal review](../../claude-tasks/stewardship/task-46-vendor-processor-renewal-review.md) | Redacted service register and renewal/reauthentication gate | 38-45, current account and terms evidence | Future/gated |
| 47 | [Consumer safety and marketplace-integrity review](../../claude-tasks/stewardship/task-47-consumer-safety-marketplace-integrity-review.md) | Recurring content, claim and pharmacy-note safety review | 23-24, 30, 36, 39, 41, 45 | Future/gated |
| 48 | [Pharmacy-professional oversight and protected-workflow review](../../claude-tasks/stewardship/task-48-pharmacy-professional-oversight-review.md) | Verification, role, training and protected-workflow ownership review | 16, 30, 36, 38, 42, 45, 47 | Future/gated |
| 49 | [Child, dependent and vulnerable-user safeguards review](../../claude-tasks/stewardship/task-49-dependent-user-safeguards-review.md) | Adult-for-child/dependent data, authority and safe-handoff review | 39, 45, 47, 48, Fiji legal/privacy/pharmacy review | Future/gated |

Implementation plans currently prepared: [Task 38 operator, legal identity and obligations](2026-08-18-task-38-operator-legal-identity-implementation.md), [Task 39 privacy rights, retention and data governance](2026-08-18-task-39-privacy-rights-retention-governance-implementation.md), [Task 40 public support, status and disclosure operations](2026-08-18-task-40-public-support-status-disclosure-implementation.md), [Task 41 accessibility and localization maintenance](2026-08-18-task-41-accessibility-localization-maintenance-implementation.md), [Task 42 recurring security and recovery assurance](2026-08-18-task-42-recurring-security-recovery-assurance-implementation.md), [Task 43 ADR and source-of-truth governance](2026-08-18-task-43-adr-source-governance-implementation.md), [Task 44 support and contributor capacity governance](2026-08-18-task-44-support-contributor-capacity-implementation.md), [Task 45 annual and renewed public-readiness review](2026-08-18-task-45-annual-public-readiness-review-implementation.md), [Task 46 vendor, processor and contract renewal review](2026-08-18-task-46-vendor-processor-renewal-review-implementation.md), [Task 47 consumer safety and marketplace-integrity review](2026-08-18-task-47-consumer-safety-marketplace-integrity-review-implementation.md), [Task 48 pharmacy-professional oversight and protected-workflow review](2026-08-18-task-48-pharmacy-professional-oversight-review-implementation.md), [Task 49 child, dependent and vulnerable-user safeguards review](2026-08-18-task-49-dependent-user-safeguards-review-implementation.md)

## Execution strategy

Tasks 38-41 and 43 may be prepared in parallel when their review artifacts are
separate. Task 42 should consume the backup, incident and release evidence
from earlier horizons. Task 44 must reflect actual founder/support capacity;
it must not create shared credentials or silently turn volunteers/contractors
into privileged operators. Any task can produce a stop report instead of an
implementation.

Each handoff must:

1. name the accountable human owner and review cadence;
2. identify the policy/ADR being maintained and any proposed amendment;
3. state data classification, retention, access, redaction and evidence
   storage rules;
4. distinguish synthetic rehearsal from protected or hosted evidence;
5. include accessibility, language, safety, cost, incident and rollback
   implications where relevant; and
6. leave publication, activation, contract signing, access grants and release
   approval to the founder/release owner.

## Coordinator handoff prompt

```text
Use docs/superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md as
the planning source of truth. Read docs/claude-tasks/stewardship/README.md and
the selected brief before starting. Tasks 38-44 are governance/readiness work;
do not treat them as authorization for public activation, billing, protected
data, new providers, new staff access or policy changes.

Preserve the web-only apps/web, apps/worker and packages/contracts boundary.
Do not add native apps, Firebase/GCP, a second backend, analytics/session
replay, WhatsApp support, public reviews, chat, delivery, clinical advice or
credentials in source. Do not guess the legal operator, retention period,
processor, support contact, reviewer, owner, contract or release date.

Use a task branch and PR, preserve unrelated worktree changes, run exact
repository and brief-specific checks, and report evidence, owner, cadence,
residual risk and stop conditions. Do not merge, deploy, publish notices,
grant access, sign contracts or expand a cohort from a coding-agent task alone.
```

## Completion boundary

This roadmap creates maintainable governance evidence, not a permanent
approval. Legal/privacy terms, owners, provider contracts, accessibility
results, threats, costs and operational capacity must be rechecked before each
material release or data-scope change.
