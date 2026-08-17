# GitHub work-management policy

## Purpose

MediFind's Markdown documentation is the durable source of truth. GitHub Issues are the executable work queue for Claude Code and other contributors; pull requests provide the implementation and verification record. This keeps detailed task instructions out of long-lived product and architecture documents while retaining traceability.

## Source-of-truth order

1. Approved product, security, legal, architecture, design and data-contract Markdown documents.
2. Accepted architecture decision records in [decisions](decisions.md).
3. A founder-approved GitHub implementation issue that links the governing documents.
4. The implementation pull request and its verification evidence.

An issue never overrides an approved document or ADR. If a conflict or gap exists, open a decision-request issue, update the relevant documentation and record an ADR before implementation changes behaviour.

## Issue types and workflow

| Type | Purpose | May Claude start work? |
| --- | --- | --- |
| Epic | Groups a measurable outcome into bounded issues. | No; it is not an implementation contract. |
| Implementation task | Defines one small, testable change. | Only with `status:ready`, the required authority and all named reading complete. |
| Decision request | Records a choice or missing rule. | No, until documented and approved. |
| Security review | Assesses a capability/change and required evidence. | Only when its recorded outcome permits it. |
| Bug | Captures a reproducible defect using redacted/synthetic evidence. | Only after triage establishes safe scope. |

Use the repository issue templates. Every implementation task names its scope, non-goals, document links, data/cloud/release authority, acceptance criteria, exact verification commands and stop-and-ask conditions.

## Labels and milestones

Labels classify area (`area:*`), type (`type:*`), work state (`status:*`) and hard gates (`data:synthetic-only`, `gate:cloud`, `gate:prescription`). Milestones show planned maturity stages only; they do not authorize work.

The active milestones are Documentation Reset, Synthetic Web Preview, Cloudflare Worker Foundation, D1 Data Slice, Pharmacy Operations and Pilot Readiness. Native/mobile and Firebase/GCP milestones are closed and must not receive new work.

## Web-only GitHub synchronization record

The web-only reset was synchronized through the authenticated GitHub CLI after
the connector's write endpoints returned `403 Resource not accessible by
integration`:

- [Issue #3](https://github.com/Dev-SohailAli/MediFind/issues/3) is closed as
  not planned; its obsolete Expo/Metro audit exception no longer applies.
- [Issue #19](https://github.com/Dev-SohailAli/MediFind/issues/19) remains the
  synthetic Cloudflare Pages preview task and now uses `apps/web/dist` and
  current web-only terminology.
- [Issue #24](https://github.com/Dev-SohailAli/MediFind/issues/24) is the
  synthetic Cloudflare Worker foundation task linked to the current Task 3
  brief and specification.
- [PR #21](https://github.com/Dev-SohailAli/MediFind/pull/21) is closed as
  superseded because its branch and description depend on the retired mobile
  workspace.
- [PR #22](https://github.com/Dev-SohailAli/MediFind/pull/22) is the merged
  historical visual-system change; its follow-up comment points to the
  repository reset.
- [PR #23](https://github.com/Dev-SohailAli/MediFind/pull/23) is the current
  draft review for commit `686d62b`, covering the web-only/Cloudflare reset.

Re-read every listed GitHub record after mutation. No open issue or PR may name
native apps, Firebase/GCP, Cloud Run, API Gateway, Firestore, native push or
store distribution as active work. GitHub write access should continue through
the authenticated CLI until the connector permissions are corrected.

## Claude Code operating rule

Claude reads `CLAUDE.md`, the issue, all linked documents and applicable ADRs before editing. It works only within the issue boundary, runs the required verification, opens or updates a pull request, and reports evidence. It stops for clarification when a document is missing/ambiguous or when a requested change would add an unapproved dependency, network call, cloud resource, secret, real data, cost, permission or release authority.

No issue authorizes production deployment, public release, real buyer/pharmacy data or real prescription handling unless that authority is explicit and all documented gates are complete.
