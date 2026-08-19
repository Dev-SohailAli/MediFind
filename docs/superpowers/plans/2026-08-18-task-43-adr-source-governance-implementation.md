# Task 43 ADR and Source-of-Truth Governance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep product, architecture, security, cost, legal and task-roadmap decisions consistent for future coding agents without changing accepted policy or granting an agent release authority.

**Architecture:** Approved Markdown policies and ADRs remain authoritative; founder-approved implementation issues make bounded work executable; pull requests hold implementation and verification evidence. A lightweight audit identifies missing links, owners, gates, stale claims and conflicts, while humans decide policy changes and releases.

**Tech Stack:** Repository Markdown, ADR decision log, task briefs, issue/PR templates, link/structure checks and synthetic examples. No deployment automation, provider, credential, permission, history rewrite, automatic policy rewrite or native/mobile work is added.

**Spec:** `docs/claude-tasks/stewardship/task-43-adr-source-governance.md`, `docs/decisions.md`, `docs/monorepo-and-toolchain-policy.md`, `docs/engineering-delivery.md`, `docs/github-work-management.md`, `docs/claude-code-handoff.md`, and the active web-only Cloudflare architecture documents.

## Global Constraints

- Preserve the source-of-truth order and active web-only Cloudflare direction. Superseded native, Firebase/GCP and other stale decisions remain historical and cannot authorize work.
- Do not silently resolve a policy conflict, invent a provider/region/credential/retention rule, or treat a task queue, milestone or agent suggestion as approval.
- Separate proposal, accepted decision, implementation evidence and human release approval. A coding agent stops when any required authority or exact scope is absent.
- Keep public and repository examples synthetic; do not place secrets, raw health/prescription content, production identifiers or private personnel data in governance artifacts.
- Documentation audits may report defects and propose edits, but policy meaning changes require the named owner and applicable legal/security/product review.

## Task 1: Define the decision and artifact map

**Files:**

- Create: governance matrix mapping change types to ADR, source-of-truth, design, legal, security, cost, task and release review
- Modify: `docs/decisions.md`, `docs/github-work-management.md`, `docs/claude-code-handoff.md` only where the accepted workflow is clarified
- Read: current architecture, security, cost, legal, data and design authority

- [ ] **Step 1: Classify material changes**

Define triggers for an ADR or source update, including new route/data field/provider/binding, auth or role change, retention or legal boundary, cost commitment, design-system change, public claim, production capability, rollback change and release-surface change.

- [ ] **Step 2: Define required reviewers**

Map founder/product, architecture, security/privacy, cost, legal/pharmacy, accessibility/localization and release owners to the change categories they may review. Reviewers advise within scope; they do not grant missing authority.

- [ ] **Step 3: Define status vocabulary**

Distinguish proposal, decision requested, accepted, superseded, rejected, implementation-ready, in progress, verified and released. Ensure only accepted authority plus a ready task can start coding.

## Task 2: Add coding-agent readiness and conflict checks

**Files:**

- Create: task-brief readiness checklist and source/conflict audit report template
- Modify: task templates and handoff guidance
- Read: existing task queue and current branch/PR workflow

- [ ] **Step 1: Require an implementation contract**

Require exact files/routes/data/providers, in/out scope, synthetic-data boundary, tests, cost, rollback, owners, gates, verification commands, release authority and stop-and-ask conditions before handoff.

- [ ] **Step 2: Require source links and supersession**

Every material task links governing policies and ADRs. A superseded decision links its replacement and states the conflict boundary; active links must resolve.

- [ ] **Step 3: Exercise safe refusal**

Use synthetic briefs requesting an unapproved provider, secret, region, data field, retention period, production deployment or native capability. Verify the agent reports the missing authority and does not implement it.

## Task 3: Audit documentation health without changing policy meaning

**Files:**

- Create: periodic audit report and unresolved-decision register
- Modify: roadmap/queue status only after human review of findings

- [ ] **Step 1: Check structure and links**

Find orphaned task briefs/plans, broken local links, missing owners/gates, incomplete checklists, stale hosted/production claims and decision references that point only to superseded authority.

- [ ] **Step 2: Check active-direction conflicts**

Report any new native, Firebase/GCP, direct-binding, unsupported provider, credential or production-data language as a conflict for human resolution. Do not delete historical material or automatically rewrite its meaning.

- [ ] **Step 3: Publish unresolved items**

Record issue, affected artifact, authority owner, severity, proposed next decision and stop condition. Keep ambiguous work out of the ready queue.

## Task 4: Verify and hand off

**Files:**

- Create: accepted governance matrix, checklist, audit report and decision list
- Modify: task brief, roadmap and decision log with exact outcome

- [ ] **Step 1: Run checks**

Run link/structure and formatting checks; run repository checks only if tooling or templates change. Review the active branch/PR and confirm no governance artifact claims unrun hosted or production results.

- [ ] **Step 2: Obtain human approval**

Have the named documentation/release owner accept the workflow and review all unresolved conflicts. Acceptance does not change product decisions or authorize deployment.

- [ ] **Step 3: Commit the governance update**

Commit `chore: govern ADRs and coding-agent source of truth`; preserve historical decisions, visible supersession links and the stop-and-ask rule.
