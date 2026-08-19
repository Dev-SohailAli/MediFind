# Task 28: Commercial-readiness decision packet

## Goal

Use sustained pilot value and operational evidence to decide whether MediFind
should remain free, test a pharmacy SaaS/listing-fee model, or stop/reshape the
product before any billing work begins.

## Gate

Requires Task 22 release evidence, Task 26 aggregate product evidence,
feedback from each pilot pharmacy and representative buyers, founder capacity
review, and current Fiji legal/business/tax advice. A coding agent cannot
declare the gate satisfied.

## Read first

- [Business and commercial model](../../business-and-commercial.md)
- [Free-first production architecture](../../free-first-production-architecture.md)
- [Cost and environment plan](../../cost-and-environment-plan.md)
- [Public-source visibility review](../../public-source-visibility-review.md)
- [API and data contracts](../../api-and-data-contracts.md)

## Scope

- Produce a decision packet covering sustained pharmacy value, buyer value,
  support effort, infrastructure cost, safety outcomes and unresolved risks.
- Compare free pilot continuation with a simple pharmacy SaaS/listing-fee
  hypothesis; record assumptions, taxes, refunds, contracts and founder
  support capacity without selecting a billing provider.
- Specify invariants: paid status never changes medicine ranking, availability,
  safety wording, access control or public prominence.
- Define a reversible research/communication plan if founder and legal review
  approve it, with no charge collection.
- Identify what evidence would close the proposal and what would stop it.

## Out of scope

Payment processing, subscriptions, invoices, buyer charges, advertising,
affiliate relationships, paid placement, ranking changes, financial data,
investor commitments and automatic conversion of pilot pharmacies.

## Acceptance

- The packet has a clear continue/stop/prepare decision with named approver.
- Cost ceiling, billing/legal obligations, support hours and refund/contract
  questions are explicit and unresolved items block implementation.
- Search and safety tests prove commercial status cannot influence relevance or
  dispensing/availability claims.
- Any future billing work is split into a new approved task with provider,
  region, data, security, recovery, cost and rollback decisions.

## Verification and handoff

Run document/link checks and the existing quality gates if any guardrail code
was changed. Attach anonymised/synthetic evidence only; do not put private
pharmacy correspondence in the repository. Commit:
`docs: record post-pilot commercial readiness decision`

Implementation plan: [Task 28 commercial readiness decision packet plan](../../superpowers/plans/2026-08-18-task-28-commercial-readiness-decision-implementation.md)
