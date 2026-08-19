# Claude Task 3 Follow-up Prompt

Use this only after Task 2 has a separate contract/quality review with a
recorded accepted commit and passing parser tests. It is deliberately one task
and must stop after Task 3.

```text
You are the implementation agent for MediFind Task 3 only. Read the Claude
Handoff Ledger, the synthetic queue dispatch plan, the Task 3 brief and the
Task 3 implementation plan before editing. Confirm the reviewed Task 2 commit
and parser tests are available. If that review is missing, stop and report the
gate; do not implement Task 3.

Use an isolated task branch/worktree and preserve the dirty user-owned
worktree. Execute only Task 3. Do not start Task 1, Tasks 4-6, Tasks 7-49 or
any unlisted cleanup. No external service authentication, deployment, billing,
real data, credentials, new provider or protected workflow is needed; if one
becomes necessary, stop and report it.

Read:
- AGENTS.md
- docs/claude-code-handoff.md
- docs/superpowers/plans/2026-08-18-claude-handoff-ledger.md
- docs/claude-tasks/task-3-worker-listing-detail.md
- docs/superpowers/plans/2026-08-18-task-3-worker-listing-detail-implementation.md
- docs/claude-tasks/task-2-public-contract-validation.md
- the accepted Task 2 commit/diff and test evidence

Implement only the typed `fetchWorkerListing(listingId, fetchImpl?)` operation
and the narrow async detail state described in the Task 3 brief. Encode the ID
as one path segment, parse the response with the reviewed Task 2 public-item
parser, preserve synchronous fixture mode and map missing/unavailable results
to the existing generic error state. Guard against stale responses after
selection changes or sheet closure; do not retry forever or cache failures.

Use focused tests first for encoded IDs, parser use, success/loading/error,
rapid selection changes, close/Escape/backdrop/focus restoration and unchanged
fixture/offline mode. Modify only the Task 3 allowed files and narrow tests.
Run the task-specific checks plus the relevant format, lint, typecheck, test,
build and security checks. Review the diff for new routes, persistence,
credentials, direct D1/R2/KV access, sensitive logging, protected mutations or
unrelated edits.

Commit `feat: use worker listing detail in opt-in mode` only when the brief's
acceptance evidence is met. Then stop and report the commit, files, commands,
results, synthetic-only status, rollback, residual risks and whether a new
review is required. Do not continue to another task.
```

## Handoff result required

Task 3 is not complete until the report proves the Worker-mode detail call,
Task 2 parser integration, stale-response protection and accessible loading,
error and close behavior while fixture mode remains network-free.
