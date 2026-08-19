# Task 27: Scale, provider adapter and migration readiness

## Goal

Prove when the current Cloudflare-first implementation needs capacity,
regional, backup, search or file-processing changes, and make a provider
change reversible before it is needed.

## Gate

Requires Task 22 release evidence, measured usage/latency/cost data from Task
26, restore/export evidence from Task 18, and a founder-approved trigger to
study. This task does not itself approve a paid service or another provider.

## Read first

- [Cloudflare web architecture](../../cloudflare-web-architecture.md)
- [Free-first production architecture](../../free-first-production-architecture.md)
- [Web/PWA free-first options](../../web-free-first-options.md)
- [Infrastructure and release blueprint](../../infrastructure-and-release-blueprint.md)
- [Cost and environment plan](../../cost-and-environment-plan.md)

## Scope

- Measure current Worker/D1/Pages behaviour against agreed pilot targets and
  failure modes; include query volume, storage, propagation lag, CPU and
  restore time without sensitive telemetry.
- Define concrete scale triggers, capacity options, warning thresholds,
  circuit breakers, rollback and owner decisions.
- Keep domain contracts and Worker repositories behind provider-neutral
  adapters; document export format, checksum, schema version and migration
  rehearsal using synthetic data.
- Test safe degradation: public search may remain available while costly or
  sensitive mutations pause; no stale protected mutation is accepted.
- Produce an ADR only if the evidence shows a provider or architecture change
  is warranted.

## Out of scope

Speculative vendor replacement, direct browser storage access, Durable Objects,
Queues/Workflows, private prescription files, paid billing activation or data
migration without a separately approved ADR.

## Acceptance

- Each proposed trigger has a measured baseline, owner, action, cost impact,
  security/privacy review and rollback path.
- Synthetic export/import preserves identifiers, versions, terminal states and
  privacy classifications; checksums and failure recovery are tested.
- No provider-specific type or credential crosses the Worker/domain boundary
  into the web client or shared contracts.
- A provider change remains a decision, not an implementation, unless a new
  task explicitly authorises it.

## Verification and handoff

Run quality checks, load/latency checks, export/import rehearsal and failure
injection against synthetic data. Attach the trigger matrix and ADR request if
needed. Commit:
`docs: record measured scale and migration readiness`

Implementation plan: [Task 27 scale, provider adapter and migration readiness plan](../../superpowers/plans/2026-08-18-task-27-scale-migration-readiness-implementation.md)
