# Claude Batch A Execution Prompt

This is the bounded first coding batch for the synthetic web/PWA queue. It is
intentionally limited to Tasks 2, 4, 5 and 6. It does not authorize Claude to
consume the full roadmap.

## Copy/paste prompt

```text
You are the implementation agent for MediFind Batch A. Execute only Tasks 2,
4, 5 and 6 from the synthetic coding queue, then stop and report. Do not start
Task 1, Task 3, Tasks 7-49, or any unlisted work in this session.

Read these first, completely:

- AGENTS.md
- README.md
- docs/README.md
- docs/architecture.md
- docs/cloudflare-web-architecture.md
- docs/web-app-and-pwa-direction.md
- docs/repository-security-and-delivery.md
- docs/superpowers/plans/2026-08-18-coding-agent-development-roadmap.md
- docs/superpowers/plans/2026-08-18-synthetic-queue-current-state-and-dispatch.md
- Each selected brief and its linked implementation plan:
  - docs/claude-tasks/task-2-public-contract-validation.md
  - docs/claude-tasks/task-4-browser-pwa-acceptance.md
  - docs/claude-tasks/task-5-synthetic-verification-tooling.md
  - docs/claude-tasks/task-6-pages-preview-release-guards.md

Before editing:

1. Inspect the current branch and dirty worktree. The existing changes belong
   to the user. Create isolated task branches/worktrees and preserve all
   unrelated changes; never reset, clean, checkout-overwrite or force-push.
2. Reconfirm that this batch is local and synthetic-only. Tasks 2, 4, 5 and 6
   do not require Cloudflare, GitHub, browser-device accounts or any external
   service authentication. If any requested step would require an external
   service, secret, account, provider, binding, real data or new permission,
   stop and report the exact blocker instead of improvising.
3. Do not modify files outside the selected brief's allowed scope except for
   the explicitly named focused tests, package scripts, quality hook or
   documentation evidence allowed by that brief.

Execution boundary:

- Task 2: implement and test the dependency-free public response/result
  parsers, sanitize unknown fields, and map malformed Worker responses to the
  existing generic unavailable state. Do not add a dependency, endpoint,
  response field, auth, persistence or provider.
- Task 4: run the browser/PWA acceptance lane and make only the smallest fixes
  within its allowed component/style/test scope. Record observed browser,
  viewport, keyboard/screen-reader, offline, install and 200% evidence. Do
  not claim device or hosted evidence that was not actually observed.
- Task 5: add the local-only synthetic verifier and `verify:local` command.
  It must use `wrangler.local.toml` and `--local`, reject remote/config/SQL
  arguments, verify the six exact table counts, foreign keys, projection
  exclusion and export checksums, and emit redacted JSON with `remote: false`.
- Task 6: add the local Pages preview build guard. The default build must stay
  fixture-backed, static, no-indexed and free of runtime Worker calls. The
  guard must check shell assets, PWA files, headers, robots policy, secrets,
  bindings, functions, analytics, cookies and persistence without falsely
  rejecting unused Worker adapter code.

Ordering and coordination:

- Tasks 2, 4, 5 and 6 have separate write scopes and may be worked in parallel
  only when the tooling supports isolated agents/worktrees. Otherwise execute
  them one at a time in that order.
- Do not start Task 3 in this batch. Task 3 waits for Task 2's separate
  contract/quality review and is a future handoff.
- Do not run Wrangler remote commands, deploy Pages, create accounts, enable
  billing, use real data, or stage secrets.

For every selected task:

1. Write or strengthen focused tests before implementation where the brief
   requires test-first work.
2. Follow the detailed implementation plan checkbox by checkbox and stop when
   the brief's acceptance boundary is met.
3. Run the task-specific checks, then the repository format, lint, typecheck,
   test and build checks relevant to the changed scope. Run local security
   scans when available; do not claim checks that were not run.
4. Review the diff for accidental routes, providers, credentials, network
   calls, browser persistence, production claims, native/mobile references or
   unrelated edits.
5. Commit each task separately with the exact commit message in its brief or
   plan. Do not merge, deploy, publish, push or open a release/production
   change from this batch.

When the four selected task reports are complete—or when any task is blocked—
STOP. Do not continue into the next queue. Return a concise table containing:

- task and commit;
- exact files changed;
- tests/checks run and their results;
- browser/device or hosted evidence actually observed, if any;
- synthetic-only confirmation;
- security, privacy, cost and rollback impact;
- unresolved risks or gates;
- whether Task 3 is now ready for separate review.

A blocked or incomplete task must be reported as blocked/incomplete. Never mark
the entire roadmap complete because Batch A passed.
```

## Batch boundary

| Included now | Explicitly deferred |
| --- | --- |
| Task 2 public contract parser | Task 1 Cloudflare environment/authentication |
| Task 4 browser/PWA acceptance | Task 3 Worker listing detail until Task 2 review |
| Task 5 local synthetic verifier | Tasks 7-49 protected, operations, growth and stewardship queues |
| Task 6 Pages preview guard | Any deployment, billing, account, provider or real-data action |

## Coordinator evidence

The authoritative dispatch state and dependency graph remain in
[the synthetic queue dispatch plan](2026-08-18-synthetic-queue-current-state-and-dispatch.md).
This prompt is a bounded execution handoff, not an approval to change that
roadmap or to authenticate to external services.
