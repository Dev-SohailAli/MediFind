# Post-pilot task queue

These briefs cover the next product horizon after the protected pilot and
staged invite-only release. They are intentionally gated. A brief is not
permission to collect real data, add a service, spend money, change a provider
or release to a larger audience.

| Task | Brief | Status | Hard boundary |
| --- | --- | --- | --- |
| 23 | [Catalog curation and search quality](task-23-catalog-curation-search-quality.md) | Future/gated | No external catalogue or clinical substitution |
| 24 | [Multilingual system content](task-24-multilingual-system-content.md) | Future/gated | No machine translation of pharmacy-authored notes |
| 25 | [Fiji branch expansion](task-25-fiji-branch-expansion.md) | Future/gated | No activation outside the approved cohort |
| 26 | [Product evidence and metrics](task-26-product-evidence-metrics.md) | Future/gated | Aggregate events only; no raw queries or protected content |
| 27 | [Scale and migration readiness](task-27-scale-migration-readiness.md) | Future/gated | No provider migration without ADR/export/rollback |
| 28 | [Commercial readiness](task-28-commercial-readiness.md) | Future/gated | No billing, subscription or ranking influence |
| 29 | [Repository and supply-chain governance](task-29-repository-supply-chain-governance.md) | Future/gated | No deployment authority or credentials in source |

## Queue rules

- Read the [post-pilot roadmap](../../superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md), the selected brief and all linked policy documents first.
- Confirm Tasks 7-22 are accepted or explicitly closed before treating a brief as executable.
- Use a task branch and pull request. Preserve unrelated worktree changes.
- Stop at any missing legal, privacy, region, provider, cost, identity,
  accessibility, backup, recovery or founder-approval gate.
- Use invented fixtures and synthetic exports for development unless the brief
  contains a separately recorded protected-environment approval.
- Do not merge, deploy, enable billing, add a new vendor or expand the cohort
  from a coding-agent task alone.

After Tasks 23–29, continue only through the gated [scale-options and
public-growth queue](../scale-options/README.md). Optional capabilities still
require their own implementation brief and current approval evidence.
