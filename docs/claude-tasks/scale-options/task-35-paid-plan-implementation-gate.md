# Task 35: Paid-plan implementation gate

## Goal

Translate a positive commercial-readiness decision into a precise pre-build
packet for a possible pharmacy SaaS or listing-fee plan, without writing
billing code or accepting money.

## Gate

Requires Task 28's explicit continue/prepare decision, Task 30 cohort
evidence, Task 36 assurance evidence, current Fiji registration/tax/contract/
liability/privacy advice, founder-approved pricing and a named finance/support
owner. If any item is missing, produce a stop report.

## Read first

- [Business and commercial model](../../business-and-commercial.md)
- [Cost and environment plan](../../cost-and-environment-plan.md)
- [Free-first production architecture](../../free-first-production-architecture.md)
- [API mutation and concurrency policy](../../api-mutation-and-concurrency-policy.md)
- [Audit-log policy](../../audit-log-policy.md)

## Scope

- Define the intended payer, plan status, entitlements, trial/withdrawal,
  invoice/refund/dispute responsibilities and manual support path as a
  decision model only.
- Specify data minimisation, payment-provider boundary, region/processor,
  retention/deletion, reconciliation, idempotency, audit and failure states.
- Prove the non-influence invariant: commercial status cannot affect search
  ranking, public prominence, medicine identity, availability, safety copy,
  dispensing decisions or access beyond explicitly approved administration.
- Define founder-only enable/pause/rollback authority and a no-charge staging
  rehearsal using synthetic accounts.
- Produce the exact approval checklist for a later billing implementation task.

## Out of scope

Payment provider selection, checkout, stored payment data, invoices, charges,
subscriptions, advertising, commission on medicine sales and paid placement.

## Acceptance

- The packet has named legal, tax, finance, support, security and release
  owners and a stop condition for each unresolved issue.
- Synthetic state-machine tests cover activation, pause, failed reconciliation,
  refund/dispute placeholder, account closure and rollback without money.
- Pricing and commercial status are provably isolated from medicine search and
  safety decisions.
- A later implementation brief can be written without guessing provider,
  contract, region, retention or billing authority.

## Verification and handoff

Run quality checks, synthetic entitlement/idempotency/audit tests and a
documentation review. Attach the approval matrix; do not claim payment
readiness or production billing. Commit:
`docs: define gated paid-plan implementation requirements`

Implementation plan: [Task 35 gated paid-plan implementation requirements plan](../../superpowers/plans/2026-08-18-task-35-paid-plan-implementation-gate-implementation.md)
