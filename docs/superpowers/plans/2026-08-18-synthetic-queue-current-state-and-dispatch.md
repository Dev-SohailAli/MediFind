# Synthetic coding queue current state and dispatch plan

> **Handoff status:** evidence-backed dispatch planning. This document does
> not merge, deploy, authenticate to Cloudflare, add a provider or authorize
> protected data/workflows.

## Verified baseline

The current worktree is on
`agent/claude/task-31-d1-search-vertical-slice`, tracking its remote branch at
the `ef1c9d9` local merge checkpoint, whose historical base was `9aeb55d`.
Batch A is merged locally; the base worktree has only the excluded untracked
`.claude/` session tree. A coding agent must preserve unrelated changes and
must not remove the locked source worktree until its Claude session ends.

The local preservation checkpoint is `4818f55`; the Batch A source head is
`ae0400b`. No remote push or hosted Cloudflare result is claimed.

Task 2 has a detailed [implementation plan](2026-08-18-task-2-public-contract-validation-implementation.md)
that maps the parser contract to the current `packages/contracts` and
`apps/web` files.

Task 3 has a dependent [implementation plan](2026-08-18-task-3-worker-listing-detail-implementation.md)
and must wait for Task 2's reviewed parser commit before implementation.

Task 4 has a parallel [browser/PWA implementation plan](2026-08-18-task-4-browser-pwa-acceptance-implementation.md)
covering automated checks, manual evidence and static capability guards.

Task 5 has a parallel [local verification implementation plan](2026-08-18-task-5-synthetic-verification-implementation.md)
covering fixed local Wrangler calls, exact D1/export invariants and safe JSON
evidence.

Task 6 has a parallel [Pages preview guard implementation plan](2026-08-18-task-6-pages-preview-guard-implementation.md)
covering generated shell assets, static policy, capability checks and explicit
Worker-mode rejection.

Checks recorded for the merged result on 2026-08-19:

| Check | Result |
| --- | --- |
| `pnpm run format:check` | Passed |
| `pnpm lint` | Passed |
| `pnpm typecheck` | Passed |
| `pnpm test` | Passed: root 6, contracts 32, Worker 192, web 168 |
| `pnpm build` | Passed: contracts, Worker and web/PWA build |
| Hosted Cloudflare evidence | Not claimed; no remote command was run in this audit |

These results prove the merged local Batch A test result only. They do not
prove that the hosted environment is current, that Task 1 is complete, or that
the branch is ready for a remote PR.

## Evidence of remaining synthetic work

The active six-task queue remains the authoritative implementation backlog.
Current source inspection found no implementation marker for the required
Task 2 parser, Task 3 listing-detail operation, Task 5 local verification
command or Task 6 preview-build guard. The existing Worker search and opt-in
search mode are useful prerequisites, not completion evidence for those tasks.

| Task | Current evidence | Dispatch state | Next proof required |
| --- | --- | --- | --- |
| 1 | Brief requires remote D1/Worker verification; current audit ran no remote command | Hold | Human freshly reauthenticates; `wrangler whoami`, dry-run, migration, route evidence and rollback record |
| 2 | Parser and contract tests are present; merged in `93b5b96` with fix wave in `ae0400b` | Verified locally and merged | Retain review evidence; no hosted claim |
| 3 | Task 2 review is accepted and merged; detail operation remains unimplemented | Ready as separate follow-up | Encoded route, stale-response protection, accessible loading/error/close/focus evidence |
| 4 | Browser/PWA acceptance implementation and evidence are present; merged in `f73249b` | Verified locally and merged | Retain observed browser evidence; no unsupported hosted/device claim |
| 5 | Local verifier and idempotency fix are present; merged in `130cc00` and `c78301d` | Verified locally and merged | Keep `--local`/no-auth boundary |
| 6 | Preview guard and final artifact-boundary fix are present; merged in `b0691c7` and `ae0400b` | Verified locally and merged | Add the parked `verify:preview` documentation in a separate docs follow-up |

## Recommended dispatch order

```text
Batch A (complete and merged): Tasks 2, 4, 5, 6
                                      |
                                      v
Task 2 review accepted ----------------+--> Task 3 (next separate handoff)

Fresh Cloudflare reauthentication -------------------------------> Task 1
                                                                   (separate supervised lane)

After Tasks 1-6 reports exist: final synthetic integration/release review
```

Task 4 may proceed without Task 3 if it records current detail-sheet evidence
and leaves any final Worker-detail state for a follow-up review. Task 5 can
run locally without Cloudflare authentication. Task 6 must not contact
Cloudflare. Task 1 must not be started merely because local quality checks are
green.

## Coordinator prompt

For the copy/paste bounded first batch, use the [Claude Batch A execution prompt](2026-08-18-claude-batch-a-execution-prompt.md). It limits one coding session to Tasks 2, 4, 5 and 6, with Task 3 held for separate review and Task 1 kept in the separately reauthenticated Cloudflare lane.

For cross-chat status, use the [Claude handoff ledger](2026-08-18-claude-handoff-ledger.md), which links the Task 3 follow-up and separately supervised Task 1 prompts.

```text
Read docs/superpowers/plans/2026-08-18-synthetic-queue-current-state-and-dispatch.md,
docs/superpowers/plans/2026-08-18-coding-agent-development-roadmap.md and the
selected task brief before dispatch.

The current worktree is dirty and user-owned. Use a separate task branch or
worktree; preserve unrelated changes and never reset, clean, merge, deploy or
force-push. Dispatch Tasks 2, 4, 5 and 6 in parallel with one fresh agent per
brief. Do not dispatch Task 3 until Task 2 has a separate contract/quality
review. Do not dispatch Task 1 or run remote Wrangler commands until the human
has freshly reauthenticated to the founder-owned Cloudflare account.

Keep all work synthetic-only and web-only. Do not add accounts, auth providers,
mutations, prescriptions, reservations, uploads, payments, analytics, R2,
KV, queues, native apps, Firebase/GCP, direct browser bindings or new routes
outside the selected brief. Follow the exact allowed-file scope.

Each agent writes focused tests first, runs the brief-specific command plus
format/lint/typecheck/test/build/security checks, and reports commit, changed
interfaces, synthetic/protected status, security/privacy/cost impact,
rollback, exact evidence and residual risks. A missing gate becomes a stop
report, not a guessed implementation.
```

## Acceptance for dispatch readiness

- Every selected agent receives one brief and an isolated write scope.
- The current local baseline is recorded before each task branch starts.
- Task 2's shared contract is reviewed before Task 3 begins.
- Task 1's reauthentication and hosted evidence are handled separately from
  local code work.
- No task report claims hosted, browser-device or production evidence that was
  not actually run.
- The final synthetic release review waits for all six task reports and
  reruns the full quality/security/browser/relevant Wrangler evidence.
