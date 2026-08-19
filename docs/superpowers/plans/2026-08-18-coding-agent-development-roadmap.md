# MediFind Coding-Agent Development Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Turn the current synthetic web/PWA and Worker/D1 vertical slice into a verified, browser-tested, release-ready synthetic environment while preserving the web-only and no-real-data boundary.

**Architecture:** The browser uses fixture-backed search by default. An explicit local or synthetic environment flag may call the server-only Worker, which reads the approved public D1 projection. The Worker remains the only database boundary; Pages stays a static synthetic preview and protected workflows remain disabled.

**Tech Stack:** Node.js 24.19.0, pnpm 11.22.0, TypeScript 6, React 19, Vite 8, Vitest, Cloudflare Workers/Wrangler 4, D1/SQLite, Cloudflare Pages, ESLint and Prettier.

**Spec:** `docs/cloudflare-web-architecture.md`, `docs/task-4-synthetic-d1-data-contract-proposal.md`, `docs/task-4-synthetic-cloudflare-environment-brief.md`, `docs/web-app-and-pwa-direction.md`, `docs/test-and-acceptance-strategy.md`, `docs/claude-code-handoff.md` and the six task briefs in `docs/claude-tasks/`.

## Global Constraints

- The only active client is the responsive web/PWA in `apps/web`.
- The only active server boundary is the optional Cloudflare Worker in `apps/worker`.
- The browser never receives Worker secrets or direct D1/R2/KV access.
- Local and hosted preview data must remain invented synthetic data only.
- Task 4 remains read-only: no accounts, authentication provider, mutations, reservations, prescriptions, uploads, analytics, R2, KV or queues.
- The default web build remains fixture-backed, offline-safe and free of runtime API calls.
- Every Worker request keeps bounded body, query, page and rate-limit controls with safe generic errors.
- No native app, Expo/React Native, Firebase, Google Cloud, Cloud Run, API Gateway, Firestore, native push SDK, store package, payment or delivery work is allowed.
- Every task ends with its own focused tests, full repository quality checks and a PR-ready evidence report.

## Current baseline and non-goals

The current branch contains the synthetic D1 search slice, local Wrangler/D1 development path and opt-in web Worker search adapter. The latest committed baseline is `9aeb55d`; the worktree may contain user-owned line-ending noise and local agent settings, so implementers must inspect `git status` and never reset or clean it.

The next queue does not implement protected buyer/pharmacy workflows. Requests and Account remain explicit prototype placeholders until authentication, privacy, legal, recovery, role, and operational decisions are separately approved.

## Task graph

| Task | Deliverable | Depends on | Safe parallel lane |
| --- | --- | --- | --- |
| 1 | Isolated synthetic Cloudflare Worker/D1 environment verified remotely | Fresh Cloudflare authentication | Serial external lane |
| 2 | Runtime-validated shared public response contract | Current Task 4 slice | Code lane; before Task 3 |
| 3 | Worker-backed listing-detail adapter and UI state | Task 2 | Code lane; after Task 2 |
| 4 | Browser accessibility, responsive and PWA hardening for the search flow | Current web slice; Task 3 for detail states | Browser/UI lane |
| 5 | Local synthetic smoke/evidence command and release verification | Current Worker/D1 slice; Task 1 for hosted evidence | Tooling lane |
| 6 | Synthetic Pages preview release guards and no-capability regression checks | Current web/PWA slice | Web/release lane |

Tasks 1 and 2 can begin independently. Task 3 follows Task 2. Tasks 4 and 6 can proceed in parallel with Task 3 if they do not change the shared contracts. Task 5 can be developed locally in parallel, then used after Tasks 1–3 for the final evidence pass.

## Efficient Claude execution model

Use one fresh coding-agent job per task, with a separate review job after each task. Do not give one agent overlapping write scopes. Batch only the independent lanes shown above, and serialize contract changes before consumers.

Each coding-agent prompt must include:

1. The exact task-brief path, introduced as the requirements source.
2. The current branch and the instruction to preserve unrelated user changes.
3. The explicit no-real-data/no-new-provider boundary.
4. The exact files allowed to change.
5. The focused test command and expected evidence.
6. The required commit title and PR handoff report.

The agent must stop before any external mutation. For Task 1, the human must freshly reauthenticate to Cloudflare before `whoami`, migration, or deployment commands. Agents must never put account IDs, tokens, secrets or hosted response captures containing sensitive values in Git.

## Ready-to-paste coordinator prompt

Use this prompt to launch the first efficient batch:

```text
You are coordinating the MediFind synthetic web/PWA coding queue. Read
docs/superpowers/plans/2026-08-18-coding-agent-development-roadmap.md and
docs/claude-tasks/README.md first. Dispatch one fresh coding agent for each of
Tasks 2, 4, 5 and 6 in parallel because their write scopes are disjoint. Do
not dispatch Task 3 until Task 2's contract change is reviewed and accepted.
Do not dispatch Task 1 or run any remote Wrangler command until the human has
freshly reauthenticated to Cloudflare.

Every implementer must read only its own brief plus the named authority docs,
preserve existing user changes, use synthetic fixtures only, write focused
tests first, run the required checks, commit only its task scope, and return a
report with commit, tests, security/privacy/cost impact, rollback and residual
risk. After each implementer, run a separate spec-and-quality review before
accepting the task. Do not merge, deploy, clean, reset, or force-push.
```

After Batch 1, dispatch Task 3 against the reviewed Task 2 commit. Then run
Task 1 as a separately supervised external operation after reauthentication.
Finally rerun Task 5 and the full browser/release evidence gate against the
combined synthetic result.

For the current worktree-specific baseline and dispatch evidence, use the
[synthetic queue dispatch plan](2026-08-18-synthetic-queue-current-state-and-dispatch.md).

## Standard task loop

- [ ] Read the named brief and its linked authority documents.
- [ ] Inspect `git status --short --branch` and record the baseline commit.
- [ ] Write failing focused tests before implementation, except for a purely operational command whose verification is itself the test.
- [ ] Implement the smallest bounded change in the listed files.
- [ ] Run the focused tests, then `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm run security:secrets`, `pnpm run audit`, `pnpm run security:trivy`, and relevant Wrangler/browser checks.
- [ ] Review the diff for real data, credentials, native files, unapproved providers, direct bindings, raw query logging and unrelated edits.
- [ ] Commit only the task files with the required message; do not merge or deploy from the coding agent.
- [ ] Return the commit, exact commands/results, changed interfaces, security/privacy/cost impact, rollback path and residual risks.

## Task briefs

- [Task 1 — synthetic Cloudflare environment](../../claude-tasks/task-1-synthetic-cloudflare-environment.md)
- [Task 2 — shared public response validation](../../claude-tasks/task-2-public-contract-validation.md)
- [Task 3 — Worker-backed listing detail](../../claude-tasks/task-3-worker-listing-detail.md)
- [Task 4 — browser and PWA acceptance](../../claude-tasks/task-4-browser-pwa-acceptance.md)
- [Task 5 — synthetic verification and evidence tooling](../../claude-tasks/task-5-synthetic-verification-tooling.md)
- [Task 6 — Pages preview release guards](../../claude-tasks/task-6-pages-preview-release-guards.md)

The next horizon is documented separately in the
[protected-pilot development roadmap](2026-08-18-protected-pilot-development-roadmap.md)
and its [future task queue](../../claude-tasks/future/README.md). Do not merge
those gated tasks into the synthetic batch without first satisfying their
approval conditions.

## Final integration gate

The queue is ready for a final synthetic release review when all six task reports exist, the hosted environment evidence is independently recorded, the default Pages build remains fixture-only, all quality/security checks pass, and the browser acceptance record covers desktop, narrow mobile, keyboard, screen-reader, offline, install and 200% text-scaling behavior. That gate does not authorize a protected pilot or production release.
