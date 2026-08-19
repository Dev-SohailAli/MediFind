# Task 43: ADR and source-of-truth governance

## Goal

Keep product, architecture, security, cost, legal and task-roadmap decisions
consistent as future coding agents and collaborators work across the web app,
Worker and documentation.

Prepared implementation plan: [Task 43 ADR and source-of-truth governance](../../superpowers/plans/2026-08-18-task-43-adr-source-governance-implementation.md).

## Gate

Requires Tasks 29, 36 and 37, a named documentation/release owner and an
explicit review of the current branch/PR and decision-log workflow.

## Read first

- [Decision log](../../decisions.md)
- [Monorepo and toolchain policy](../../monorepo-and-toolchain-policy.md)
- [Engineering delivery](../../engineering-delivery.md)
- [GitHub work-management policy](../../github-work-management.md)
- [Claude Code handoff](../../claude-code-handoff.md)

## Scope

- Define when a change needs an ADR, source-of-truth update, design review,
  task brief, legal review, security review or release decision.
- Maintain supersession links and conflict checks so stale native/provider
  plans cannot authorize work against the active web-only Cloudflare direction.
- Add a task-brief readiness checklist for exact files/routes/data/providers,
  tests, costs, rollback, owners and stop conditions.
- Define periodic documentation audits for orphaned links, incomplete queues,
  unresolved decisions, stale claims and untracked production authority.
- Preserve clear separation between proposal, accepted decision, implementation
  evidence and human release approval.

## Out of scope

Changing an accepted product decision, merging PRs, rewriting history,
automating deployment, granting authority to an agent or deleting historical
decisions.

## Acceptance

- A material change cannot be handed to a coding agent without a traceable
  brief and required approval checklist.
- Superseded decisions are visibly marked and active source links resolve.
- Documentation audit reports missing owners, links, gates and stale claims
  without silently fixing policy meaning.
- The handoff explicitly prevents guessing providers, regions, credentials,
  retention, data fields and release permissions.

## Verification and handoff

Run link/structure audits, repository quality checks for tooling changes and a
manual source-of-truth conflict review. Attach the audit report and unresolved
decision list. Commit:
`chore: govern ADRs and coding-agent source of truth`
