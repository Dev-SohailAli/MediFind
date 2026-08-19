# Claude Task 1 Supervised Cloudflare Prompt

Use this as a separate supervised handoff. It must never be bundled with local
coding tasks, and it must not begin until the human has freshly reauthenticated
to the founder-controlled Cloudflare account.

```text
You are the supervised implementation agent for MediFind Task 1 only. Read
AGENTS.md, docs/claude-code-handoff.md, the Claude Handoff Ledger, the Task 1
brief, the Task 4 synthetic Cloudflare environment brief, the infrastructure
blueprint, cost plan and security threat model before doing anything.

This is the only remote task. Before any Wrangler command, pause and require
the human to freshly reauthenticate to the founder-owned Cloudflare account.
Do not receive, print, store or request passwords, API tokens, OTPs, recovery
codes or secret files. After reauthentication, run `wrangler whoami` and show
only safe account identity evidence. If authentication, account ownership,
region, cost, binding, migration or response evidence is uncertain, stop
without changing the Worker or D1.

Use an isolated task branch/worktree and preserve all dirty user-owned changes.
Execute only Task 1. Do not start Tasks 2-6, Task 3, Tasks 7-49, or any
unlisted cleanup. Keep the environment synthetic-only. Add only the approved
DB binding to the synthetic Worker config; do not add Pages settings, secrets,
auth, R2, KV, queues, mutations, production configuration or real data.

Before deployment, run the approved dry-run and inspect the binding list. Apply
only the reviewed synthetic migration. Verify exact table counts, foreign-key
integrity, excluded stale-listing projection behavior and the approved health,
search, listing-detail, invalid-input, anti-enumeration and safe-error routes.
Deploy only if the brief's dry-run, cost and binding gates pass. Record exact
observed URL/resource/migration/commit/time/route/rollback evidence without
including credentials, raw data or sensitive output.

Run the required repository and Wrangler checks. Do not claim hosted evidence
that was not actually observed. Commit `ops: verify synthetic cloudflare
environment` only after acceptance is proven. Rollback is never automatic;
Worker/D1 deletion requires explicit founder instruction after export
verification. Stop after the Task 1 report and return unresolved risks.
```

## Handoff result required

Task 1 is not complete until fresh authentication, safe `whoami`, dry-run,
remote migration, exact synthetic data checks, route evidence and rollback
record are all observed and documented. No local green build can substitute for
this evidence.
