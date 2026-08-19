# Claude Code handoff

## Authority

Claude implements only a founder-approved written task. The active product is
the web/PWA in `apps/web` with an optional Cloudflare Worker in `apps/worker`.
Read the active architecture, cost/security policies and task brief before
editing. Archived native experiments are not task authority.

## Required handoff

Every task names exact files, interfaces, synthetic-data boundary, Cloudflare
resource/binding authority, acceptance tests, security/privacy/cost impact,
rollback path and stop conditions. A missing provider, data field, route,
credential, cost, region, auth method or release permission stops the task.

The current synthetic coding queue is recorded in
[the development roadmap](superpowers/plans/2026-08-18-coding-agent-development-roadmap.md)
and its [six task briefs](claude-tasks/README.md). Dispatch one fresh coding
agent per brief, serialize shared-contract work, and use a separate review
agent after each task. The queue does not authorize protected workflows or
external mutations; Task 1 is the only remote task and requires fresh
Cloudflare authentication before any Wrangler command that can access the
hosted environment.

Use the [current synthetic queue dispatch plan](superpowers/plans/2026-08-18-synthetic-queue-current-state-and-dispatch.md)
for the verified local baseline, remaining task gaps, isolated dispatch order
and Task 1 reauthentication gate.

For a bounded first coding session, use the [Claude Batch A execution prompt](superpowers/plans/2026-08-18-claude-batch-a-execution-prompt.md).
It dispatches only Tasks 2, 4, 5 and 6, then requires a report and stop; it
does not authorize Task 1, Task 3 or the later queues.

For cross-chat continuity, maintain the [Claude handoff ledger](superpowers/plans/2026-08-18-claude-handoff-ledger.md).
It records which tasks are ready, deferred, held or actually verified. Use the
[Task 3 follow-up prompt](superpowers/plans/2026-08-18-claude-task-3-follow-up-prompt.md)
only after Task 2 review, and use the [supervised Task 1 prompt](superpowers/plans/2026-08-18-claude-task-1-supervised-cloudflare-prompt.md)
only while the human is present for fresh Cloudflare authentication.

The post-synthetic horizon is maintained in the
[protected-pilot roadmap](superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md)
and [future task queue](claude-tasks/future/README.md). A coding agent must
stop at the first unmet gate and return the missing evidence; it must not
replace an approval with a guessed provider, region, schema, credential or
workflow.

When the protected-pilot tasks pass, continue through the [pilot operations
roadmap](superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md) and
[Tasks 16–22](claude-tasks/operations/README.md). Do not treat a
feature-complete code branch as pilot-ready until onboarding, recovery, cost,
incident, accessibility, performance and rollback evidence exists.

## Evidence

The PR reports exact format, lint, typecheck, test, build, secret/dependency
scan, browser and Wrangler results. It never claims hosted or production
evidence that was not run. Documentation and ADRs are updated in the same
change when a web/platform decision changes.

After the staged release, use the [post-pilot growth
roadmap](superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md) and
[Tasks 23–29](claude-tasks/post-pilot/README.md). These remain gated by
founder-reviewed pilot evidence; they do not authorise a new provider, paid
usage, billing, public expansion, external catalog, or broader release.

After the post-pilot queue, use the [scale-options and public-growth
roadmap](superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md)
and [Tasks 30–37](claude-tasks/scale-options/README.md). These are decision
and assurance gates for optional capabilities; they do not authorise a new
provider, external integration, billing, government eligibility workflow,
public cohort or transfer of credentials.

After Tasks 30–37, use the [governance and stewardship
roadmap](superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md)
and [Tasks 38–49](claude-tasks/stewardship/README.md). These maintain legal,
privacy, accessibility, assurance, source-of-truth and human-operations
controls; they do not grant public, billing, provider or access authority.
