# Task 7: Prepare the protected-pilot approval gate

## Goal

Produce an evidence-backed decision packet that determines whether MediFind
may begin protected implementation. This task is documentation and review only;
it does not provision services or enable accounts.

See the [Task 7 implementation plan](../../superpowers/plans/2026-08-18-task-7-protected-pilot-gate-implementation.md) for the gate IDs, evidence matrix, dependent-brief mapping and validation sequence.

## Required inputs

Read `docs/architecture.md`, `docs/cloudflare-web-architecture.md`,
`docs/security-privacy-compliance.md`, `docs/security-architecture-threat-model.md`,
`docs/cost-and-environment-plan.md`, `docs/cost-circuit-breaker-policy.md`,
`docs/public-notice-and-legal-identity.md`, and the exact Cloudflare product
terms/region evidence selected by the founder.

## Deliverable

Create a review record containing explicit pass/fail evidence for:

- operator/legal identity and support owner;
- Cloudflare products, account separation, region/transfer position and
  subprocessors;
- data categories and purpose, retention/deletion, export and user rights;
- authentication, MFA, recovery, revocation and privileged support access;
- D1 backup/restore, R2 recovery if applicable, incident response and deletion;
- rate limits, anti-enumeration, audit redaction, abuse controls and direct-
  binding denial;
- monthly cost ceiling, 50/80/100% alerts, provider breakers and re-enable
  authority;
- browser accessibility, offline safety and support escalation;
- rollback, owner, review date and exact release evidence expected.

Record a proposed ADR only after the founder accepts the packet. An absent,
uncertain or conflicting fact is a failed gate, not permission to choose a
default provider or region.

## Acceptance

- Every protected task in Tasks 8–15 references a specific gate outcome.
- No old Firebase/GCP/native direction is revived.
- The packet explicitly keeps prescription uploads disabled unless their own
  high-risk gate passes.
- No Cloudflare command, secret, binding, account, real data or production
  release is performed.

Commit: `docs: prepare protected pilot approval gate`
