# Claude implementation task brief

Copy this template into a task/issue before asking Claude Code to implement anything.

## Task

- **Title:**
- **Goal:**
- **User-facing outcome:**
- **Owner/approver:**

## Vertical-slice shape

- **Capability outcome:**
- **Related deliverables that belong in the same PR:** <!-- Group client, Worker, contracts, tests, docs and CI only when they share the outcome and rollback story. -->
- **Internal work packages:** <!-- Claude may track these separately without opening separate PRs. -->
- **Required split trigger:** <!-- Name the independent approval/security/deployment/rollback boundary, or write "none". -->

## Scope

- **In scope:**
- **Out of scope:**
- **Relevant roles:**
- **Documentation/ADR links:**

## Behaviour contract

- **Inputs and validation:**
- **Authorization rules:**
- **State transitions:**
- **Success, empty, loading and error behaviour:**
- **Accessibility and language requirements:**
- **Security/privacy constraints:**
- **Cost/vendor/infrastructure impact:** approved service, no-cost allowance affected, estimated units, paid exception/threshold, quota/circuit-breaker and scale path

## Interfaces and data

- **API/interface changes:**
- **Data model changes:**
- **Migration/backward-compatibility plan:**
- **Telemetry/audit events:**

## Acceptance and validation

- **Functional acceptance cases:**
- **Negative/authorization cases:**
- **Security/privacy cases:**
- **Unit/integration/end-to-end/accessibility tests:**
- **Required commands/checks:**

## Delivery rules

- Work from one task-specific branch and open one PR for the complete vertical slice; do not create one PR per file or implementation layer.
- Keep related deliverables together, but split when the issue identifies an independent approval/security/deployment/rollback gate or unrelated release.
- Use internal checklists and incremental commits for work packages; the final PR must present one coherent outcome and one integrated verification matrix.
- Use synthetic fixtures only.
- List every documentation change request separately; do not silently change ADRs.
- PR must include implementation summary, tests/results, security impact and residual risk.
