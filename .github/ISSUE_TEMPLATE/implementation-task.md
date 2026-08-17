---
name: Implementation task
about: A coherent, documentation-governed vertical-slice task for Claude Code
title: "task: "
labels: "type:task, status:needs-approval"
---

## Objective

<!-- State one coherent user or engineering capability this issue delivers. It may contain several related deliverables, but must have one outcome and rollback story. -->

## Vertical-slice shape

- Capability outcome:
- Related deliverables in this task/PR: <!-- web, Worker, contracts, tests, docs, CI as applicable -->
- Internal work packages: <!-- Claude may track these without opening separate PRs. -->
- Required split trigger: <!-- independent approval/security/deployment/rollback gate, unrelated owner/release, or none -->

## Authority and release boundary

- Data classification: <!-- synthetic-only / approved non-sensitive / sensitive -->
- Cloud authority: <!-- none / named synthetic Cloudflare environment only / separate approval required -->
- Production or public-release authority: none unless this issue explicitly says otherwise.

## Required reading

<!-- Link exact Markdown documents and ADRs Claude must read before work begins. -->

## In scope

<!-- List concrete files, components, behaviours, contracts and related work packages Claude may change in the one vertical slice. -->

## Explicitly out of scope

<!-- State the tempting adjacent work that must not be added. -->

## Design and interface contract

<!-- Link approved design screens, API/data contract, state machine, or say none. -->

## Security, privacy, accessibility and cost constraints

<!-- State task-specific controls; link governing documents rather than duplicating them. -->

## Acceptance criteria

- [ ]

## Required verification

<!-- Pin exact commands and expected evidence before moving this to ready. -->

## Stop and ask conditions

- A governing document, design, contract or ADR is missing, ambiguous or conflicts with this issue.
- The work would add a dependency, network call, cloud resource, secret, real data, cost, permission, or release authority not named above.
- The work mentions a native app, Firebase, Google Cloud, Cloud Run, API Gateway, Firestore or another provider not approved by the active Cloudflare web architecture.
- A requirement needs to change.

## Pull-request evidence

<!-- State expected screenshots, test output, security scan, docs/ADR update, or rollback note. -->
