# MediFind post-pilot growth roadmap

> **Handoff status:** planning only. These tasks are future work and do not
> authorise production data, paid usage, a new provider, a public launch or a
> change to an accepted ADR.

This horizon begins only after the protected pilot operations and staged
invite-only release have produced founder-reviewed evidence. It extends the
web-only Cloudflare direction without widening the product into payments,
advertising, public reviews, delivery, chat, embedded maps, external medicine
catalogues or native applications.

## Entry gate

Do not start this horizon until Tasks 7-22 are either accepted or explicitly
closed with a documented reason. The founder must have reviewed pilot value,
support load, cost, accessibility, safety incidents, data-retention evidence
and pharmacy/buyer feedback. Any task that needs real health data, a new
provider, paid capability, new region, billing or a public cohort requires its
own approval packet before implementation.

## Dependency graph

```text
Task 22 staged release / rollback
  |\
  | +--> Task 23 catalog curation and search quality
  | +--> Task 24 multilingual system content and pharmacy-note governance
  | +--> Task 26 privacy-minimised product evidence
  |
  +-----> Task 25 Fiji branch expansion
  |
  +-----> Task 27 scale, provider adapter and migration readiness
  |
  +-----> Task 28 commercial-readiness decision
  |
  +-----> Task 29 repository and supply-chain governance

Task 23 + Task 24 + Task 26 + Task 27 + Task 29
  ---------> any larger beta or public-source/paid-platform change

Task 28 ----> paid-plan implementation only after separate legal and founder approval
```

## Task queue

| Task | Brief | Primary outcome | Depends on | Execution state |
| --- | --- | --- | --- | --- |
| 23 | [Catalog curation and search quality](../../claude-tasks/post-pilot/task-23-catalog-curation-search-quality.md) | Reviewed identity/alias workflow and quality evidence | 22, pilot search feedback | Future/gated |
| 24 | [Multilingual system content](../../claude-tasks/post-pilot/task-24-multilingual-system-content.md) | Reviewed translation-key and dynamic-note governance | 22, language review | Future/gated |
| 25 | [Fiji branch expansion](../../claude-tasks/post-pilot/task-25-fiji-branch-expansion.md) | Safe activation path beyond the Suva pilot | 22, verification/operations evidence | Future/gated |
| 26 | [Product evidence and metrics](../../claude-tasks/post-pilot/task-26-product-evidence-metrics.md) | Aggregate, privacy-minimised product decisions | 22, metric/privacy review | Future/gated |
| 27 | [Scale and migration readiness](../../claude-tasks/post-pilot/task-27-scale-migration-readiness.md) | Measured provider/scale trigger and export rehearsal | 22, cost/reliability evidence | Future/gated |
| 28 | [Commercial readiness](../../claude-tasks/post-pilot/task-28-commercial-readiness.md) | Founder/legal decision packet for any paid model | 22, sustained pilot value | Future/gated |
| 29 | [Repository and supply-chain governance](../../claude-tasks/post-pilot/task-29-repository-supply-chain-governance.md) | Durable source, CI and deployment controls | 22, release-owner review | Future/gated |

Implementation plans currently prepared: [Task 23 catalog curation and search quality](2026-08-18-task-23-catalog-curation-search-quality-implementation.md), [Task 24 multilingual system content](2026-08-18-task-24-multilingual-system-content-implementation.md), [Task 25 Fiji branch expansion](2026-08-18-task-25-fiji-branch-expansion-implementation.md), [Task 26 product evidence and metrics](2026-08-18-task-26-product-evidence-metrics-implementation.md), [Task 27 scale and migration readiness](2026-08-18-task-27-scale-migration-readiness-implementation.md), [Task 28 commercial readiness](2026-08-18-task-28-commercial-readiness-decision-implementation.md), [Task 29 repository and supply-chain governance](2026-08-18-task-29-repository-supply-chain-governance-implementation.md)

## Efficient execution strategy

Tasks 23, 24, 26 and 29 can be prepared in parallel because their main
deliverables are separate documentation, contracts or review tooling. Task 25
must wait for the operational proof that a new branch can be verified,
onboarded, trained and supported. Task 27 must use measured pilot usage and
restore/export evidence; it must not be a speculative vendor migration. Task
28 is a decision packet, not a billing implementation.

For each brief, the coding agent should:

1. read the brief and every linked policy;
2. confirm its gate is satisfied or stop with a decision request;
3. work on a task branch with synthetic fixtures unless the brief explicitly
   records an approved protected environment;
4. keep browser contracts provider-neutral and Worker-owned;
5. add tests for authorization, safe errors, privacy redaction, accessibility,
   language coverage, cost/failure behaviour and rollback where relevant;
6. open a PR with exact verification output and residual risks;
7. leave merge, deploy, billing and cohort expansion to the founder/release
   owner.

## Coordinator handoff prompt

```text
Use docs/superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md as the
planning source of truth. Read docs/claude-tasks/post-pilot/README.md and only
the selected brief(s) before starting. Dispatch Tasks 23, 24, 26 and 29 as
separate reviewable branches if their entry gates are satisfied. Keep Task 25
behind the branch-expansion gate, Task 27 behind measured scale/export
evidence, and Task 28 as a documentation-only commercial decision packet.

Use the existing web-only apps/web, apps/worker and packages/contracts shape.
Do not add native apps, Firebase/GCP, a second backend, an external medicine
catalogue, payments, advertising, public reviews, chat, delivery, direct
browser database access or real health/contact/prescription data. Do not infer
a provider, region, credential, schema, retention period, billing authority or
release cohort. If a gate is missing, stop and report the exact decision needed.

For every implementation PR, run the repository quality checks plus the
brief-specific tests, record synthetic/protected status, security/cost/privacy
impact, rollback and residual risk. Do not merge, deploy, enable billing or
expand the cohort.
```

## Completion boundary

Completing this roadmap does not mean MediFind is ready for unrestricted
public growth. A later release decision must still review the active legal and
privacy position, support capacity, incident history, cost ceiling, data
retention, accessibility outcomes, provider terms and rollback evidence.

The next planning horizon is the [scale-options and public-growth
roadmap](2026-08-18-scale-options-and-public-growth-roadmap.md), covering
larger Fiji cohorts and separately gated optional capabilities.
