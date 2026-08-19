# Task 31: Pharmacy-integration evaluation

## Goal

Decide whether manual listing updates justify evaluating a pharmacy POS,
inventory or directory integration, without allowing an external system to
become an unreviewed source of truth.

## Gate

Requires Task 23 catalog quality evidence, Task 26 aggregate operational
evidence, Task 27 scale/export evidence, a named pilot pharmacy willing to
provide synthetic interface examples and a legal/privacy/security review of
the evaluation boundary.

## Read first

- [Product brief](../../product-brief.md)
- [Data and search](../../data-and-search.md)
- [Data dictionary and ownership](../../data-dictionary-and-ownership.md)
- [Cloudflare web architecture](../../cloudflare-web-architecture.md)
- [API mutation and concurrency policy](../../api-mutation-and-concurrency-policy.md)

## Scope

- Compare manual updates with bounded integration hypotheses using synthetic
  records, not live credentials or pharmacy exports.
- Define an adapter boundary, ownership of identity/price/availability,
  freshness semantics, conflict resolution, revocation and audit events.
- Identify required interface authentication, data minimisation, region,
  processor, support, quota, cost and outage controls.
- Model safe degradation when an integration is delayed, wrong, unavailable or
  revoked; MediFind must not silently publish unverified stock.
- Produce a recommendation and a separate implementation-task outline only if
  evidence supports it.

## Out of scope

Live POS/API connection, direct browser integration, exact stock quantities,
automatic price publication, vendor selection, credentials, scraping and
clinical/product substitutions.

## Acceptance

- The evaluation names a measurable problem, baseline manual burden and a
  decision threshold for proceeding or stopping.
- The proposed adapter keeps Worker/domain contracts provider-neutral and
  preserves pharmacy ownership and explicit review of public projections.
- Synthetic failure tests cover stale, conflicting, duplicate, malformed,
  revoked and rate-limited external data.
- No integration can publish or mutate protected records without a separate
  approved task, authorization design and rollback plan.

## Verification and handoff

Run quality checks, synthetic adapter-contract tests and export/redaction
checks. Attach the decision matrix and list any provider/region/contract facts
still requiring approval. Commit:
`docs: evaluate bounded pharmacy integration options`

Implementation plan: [Task 31 bounded pharmacy integration evaluation plan](../../superpowers/plans/2026-08-18-task-31-pharmacy-integration-evaluation-implementation.md)
