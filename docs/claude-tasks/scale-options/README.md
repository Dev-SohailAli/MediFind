# Scale-options and public-growth task queue

These tasks follow the post-pilot growth queue. They prepare decisions for
larger Fiji coverage and explicitly deferred capabilities; they do not grant
permission to implement those capabilities.

| Task | Brief | Status | Hard boundary |
| --- | --- | --- | --- |
| 30 | [National Fiji cohort governance](task-30-national-fiji-cohort-governance.md) | Future/gated | No nationwide activation by code alone |
| 31 | [Pharmacy-integration evaluation](task-31-pharmacy-integration-evaluation.md) | Future/gated | No live POS/inventory connection |
| 32 | [Communication fallback evaluation](task-32-communication-fallback-evaluation.md) | Future/gated | No provider or message-content expansion |
| 33 | [Catalog-source and barcode decision](task-33-catalog-source-barcode-decision.md) | Future/gated | No external catalog or clinical inference |
| 34 | [Government-information decision](task-34-government-information-decision.md) | Future/gated | No eligibility or benefits determination |
| 35 | [Paid-plan implementation gate](task-35-paid-plan-implementation-gate.md) | Future/gated | No billing implementation or charges |
| 36 | [Independent assurance and public readiness](task-36-independent-assurance-public-readiness.md) | Future/gated | No public release claim without evidence |
| 37 | [Continuity, ownership and service exit](task-37-continuity-ownership-service-exit.md) | Future/gated | No transfer of accounts or credentials |

## Queue rules

- Read the [scale-options roadmap](../../superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md), the selected brief and linked policy documents.
- Confirm Tasks 23-29 are accepted or explicitly closed before execution.
- A decision packet may recommend a future capability but cannot implement it.
- Preserve provider-neutral Worker/domain boundaries and the synthetic-data
  default.
- Stop on missing legal, privacy, region, processor, security, cost, recovery,
  accessibility, support-owner or founder-approval evidence.
- Use task branches, PRs and exact verification output; do not merge, deploy,
  enable billing, connect external systems or expand a cohort from a brief.

After Tasks 30–37, continue through the gated [governance and stewardship
queue](../stewardship/README.md). Capability decisions remain separate from
the recurring controls needed to operate them safely.
