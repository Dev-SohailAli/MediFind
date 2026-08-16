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

The initial milestones are Documentation Readiness, Synthetic Foundation, Buyer Search Prototype, Protected Platform, Pharmacy Operations and Pilot Readiness.

## Claude Code operating rule

Claude reads `CLAUDE.md`, the issue, all linked documents and applicable ADRs before editing. It works only within the issue boundary, runs the required verification, opens or updates a pull request, and reports evidence. It stops for clarification when a document is missing/ambiguous or when a requested change would add an unapproved dependency, network call, cloud resource, secret, real data, cost, permission or release authority.

No issue authorizes production deployment, public release, real buyer/pharmacy data or real prescription handling unless that authority is explicit and all documented gates are complete.
