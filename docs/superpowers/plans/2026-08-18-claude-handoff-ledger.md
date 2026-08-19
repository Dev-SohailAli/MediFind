# Claude Handoff Ledger

> **Purpose:** Durable cross-chat handoff state. This ledger distinguishes
> planning from implementation evidence. Update it only with observed commits,
> tests, reviews or explicit human decisions; never infer completion from a
> plan existing.

## Last recorded baseline

- Workspace: `C:\Users\sohai\Documents\Projects\MediFind`
- Baseline branch: `agent/claude/task-31-d1-search-vertical-slice`
- Recorded baseline commit: `9aeb55d`
- Worktree status at last audit: substantially dirty with user-owned tracked
  edits and untracked `.claude/`, task briefs and implementation plans.
- Preservation rule: create an isolated task branch/worktree; never reset,
  clean, overwrite or discard unrelated work.
- Planning evidence date: 2026-08-18.
- External state: no hosted Cloudflare result is claimed by this ledger. No
  external service was accessed while preparing these handoffs.

## What exists versus what is complete

Implementation plans and briefs exist through Task 49. They are handoff
artifacts, not proof that the corresponding code, operations or approvals are
complete. The local quality baseline recorded in the dispatch plan passed
format, lint, typecheck, test and build on the stated date; every coding batch
must rerun relevant checks after its changes.

## Current execution ledger

| Task | State | Next handoff/proof | Boundary |
| --- | --- | --- | --- |
| 1 | Hold | [Task 1 supervised Cloudflare prompt](2026-08-18-claude-task-1-supervised-cloudflare-prompt.md); fresh human reauthentication, `wrangler whoami`, dry-run and remote evidence | Only remote/external task; no command before reauthentication |
| 2 | Ready in Batch A | [Batch A prompt](2026-08-18-claude-batch-a-execution-prompt.md); parser tests, sanitized contract and generic error mapping | Synthetic/local only |
| 3 | Deferred | [Task 3 follow-up prompt](2026-08-18-claude-task-3-follow-up-prompt.md), only after separate Task 2 review | No start before Task 2 contract review |
| 4 | Ready in Batch A | Browser/PWA acceptance and observed evidence | No unsupported hosted/device claims |
| 5 | Ready in Batch A | Local verifier, exact counts/checksums and fail-closed CLI tests | `--local` only; no Cloudflare auth |
| 6 | Ready in Batch A | Static Pages preview guard and negative capability tests | No deploy or Worker-mode default artifact |
| 7-15 | Future/gated | Protected-pilot gate and later briefs only after required approvals | No provider, auth, real data or protected workflow by queue position |
| 16-22 | Future/gated | Pilot operations evidence after protected tasks | No pilot activation by implementation alone |
| 23-29 | Future/gated | Post-pilot evidence after staged release | No billing, public expansion or external catalog by queue position |
| 30-37 | Future/gated | Scale/options decisions after pilot evidence | Decision packets only; no automatic capability activation |
| 38-49 | Future/gated | Stewardship reviews and human decisions | No public, billing, provider or access authority |

## Required sequence

1. Run [Claude Batch A](2026-08-18-claude-batch-a-execution-prompt.md) for
   Tasks 2, 4, 5 and 6 only.
2. Review each Batch A result separately. Do not call a task complete without
   its exact acceptance evidence and clean scoped diff.
3. If Task 2 is accepted, run [the Task 3 follow-up](2026-08-18-claude-task-3-follow-up-prompt.md)
   as a separate bounded handoff.
4. Run [the Task 1 supervised prompt](2026-08-18-claude-task-1-supervised-cloudflare-prompt.md)
   only when the human is present to freshly reauthenticate to Cloudflare.
5. After Tasks 1-6 have separate reports, perform a synthetic integration and
   release review. Do not start Task 7 from a green local build alone.

## Every future chat must read

1. `AGENTS.md`
2. `README.md`, `docs/README.md` and `docs/claude-code-handoff.md`
3. This ledger and the [synthetic dispatch plan](2026-08-18-synthetic-queue-current-state-and-dispatch.md)
4. The selected task brief and its linked implementation plan
5. The current `git status`, branch and relevant test/build output

## Handoff update protocol

After a coding task, append or update only observed facts:

- task state: `Ready`, `In progress`, `Blocked`, `Verified locally`, or
  `Verified hosted`;
- branch and commit;
- exact files changed;
- commands and results;
- browser/device/hosted evidence actually observed;
- security/privacy/cost/rollback impact;
- unresolved gates and the next handoff link.

If a task stops for missing approval, authentication, provider, region, data,
cost, legal or security evidence, record `Blocked` and the precise evidence
needed. Do not silently move it to a later queue or mark the whole roadmap
complete.

## Safety invariant

No handoff in this ledger authorizes native apps, Firebase/GCP, a second
backend, direct browser data bindings, real buyer/pharmacy/medicine/
prescription data, production deployment, billing, public activation, shared
credentials or a new provider. Those require a separate approved decision and
task.
