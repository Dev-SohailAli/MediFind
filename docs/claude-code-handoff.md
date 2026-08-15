# Claude Code handoff protocol

## Purpose

This guide defines the boundary between MediFind documentation and Claude Code implementation. It keeps product, privacy, security and commercial decisions traceable while allowing implementation work to move quickly once a task is ready.

## Sources of authority

1. Accepted entries in [the decision log](decisions.md) and the associated documentation are binding.
2. A user-approved task brief defines the specific implementation scope.
3. `CLAUDE.md` defines Claude Code's operating rules.
4. If these conflict, Claude must stop and request a documentation decision; it must not choose the less secure or broader interpretation.

## Documentation ownership

The documentation agent owns product requirements, security/privacy policy, architecture decisions, commercial policy, legal/compliance checklists and accepted ADRs. Claude may:

- add implementation notes, API references and test evidence explicitly required by an approved task;
- identify conflicts, missing decisions or implementation risk; and
- propose a change in a separate decision-change request.

Claude must not independently alter accepted product, security or architecture policy to make implementation easier.

## Branch, review and deployment policy

- Create a task-specific branch from current `main`.
- Keep every change in a reviewable pull request. Direct commits to `main`, merging, production deployment, cloud configuration changes, store submissions and production data access require explicit user approval outside the task itself. Claude cannot approve, merge or bypass checks; repository protection is defined in [repository security and delivery controls](repository-security-and-delivery.md).
- The pull request must state: task brief reference; behaviour changed; files/interfaces changed; tests run and result; security/privacy impact; documentation-change requests; and residual risks.

## Definition of ready for a Claude task

Claude may begin an implementation task only when all are true:

- the task uses [the task template](claude-task-template.md) and is approved by the user;
- product behaviour, non-goals, roles and acceptance criteria are stated;
- data fields, authorization, state transitions and error/empty states are stated or explicitly deferred without affecting safety;
- relevant ADRs and security/privacy requirements are linked;
- tests, synthetic fixtures and validation commands are named or an explicit plan exists to add them;
- no real prescription or production data is required; and
- any new processor, cloud cost, permission, data type or external integration has its required documentation approval.

For a visual/UI task, the [Claude design proposal protocol](claude-design-proposal-protocol.md) must also be complete and approved before implementation.

If one condition is missing, Claude produces a decision-change request instead of code.

## Mandatory implementation controls

Every task preserves the security architecture: API Gateway Firebase-JWT validation, IAM-private Cloud Run, server-side authorization, Firebase App Check verification, private data access through the TypeScript API, role/branch/request scoping, private prescription quarantine, generic notifications, no sensitive logging, secret management, persistent distributed rate limiting, short-lived deployment identity and approved environment isolation. It also follows the [free-first production architecture](free-first-production-architecture.md): use the approved service/allowance, preserve paid safety exceptions and report any forecast threshold crossing before implementation. Use [the threat model](security-architecture-threat-model.md) as the implementation checklist.

When a task creates or changes workspace/toolchain files, it must follow the [monorepo and toolchain policy](monorepo-and-toolchain-policy.md), including exact version pinning, pnpm lockfile enforcement, mobile/server dependency boundaries and reproducible synthetic-data setup.

For every task that touches identity, authorization, prescription files, reservation status, pharmacy listings, notifications, telemetry or infrastructure, Claude must include explicit negative tests proving that unauthorised roles, branches and records cannot be accessed or changed.

## Decision-change request format

When blocked, Claude writes a concise request containing:

- affected task and document/ADR;
- observed ambiguity or conflict;
- safe options and trade-offs;
- recommended option;
- impact on data, security, privacy, cost, UX and testing; and
- the exact implementation work that remains blocked.

No workaround, hidden default or unapproved external service is allowed.
