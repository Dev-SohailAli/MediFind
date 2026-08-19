# MediFind Protected-Pilot Development Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Prepare the post-synthetic implementation path from a verified public search slice to a narrowly scoped protected pilot without bypassing legal, privacy, security, recovery, cost, accessibility, or pharmacy-operational gates.

**Architecture:** The browser remains an untrusted responsive web/PWA client. The Cloudflare Worker owns identity context, authorization, validation, state transitions, rate limits, idempotency, version conflicts, redacted audit events and safe errors. D1 is authoritative for structured records; private files use R2 only after the upload/scanning gate; cache/notification services never become authoritative.

**Tech Stack:** TypeScript React/Vite web app, Cloudflare Worker/D1/R2 only through approved bindings, provider-neutral contracts, Vitest, browser acceptance checks, pinned CI security checks and synthetic fixtures in tests.

**Spec:** `docs/requirements.md`, `docs/security-privacy-compliance.md`, `docs/security-architecture-threat-model.md`, `docs/api-mutation-and-concurrency-policy.md`, `docs/api-error-contract.md`, `docs/phone-verification-policy.md`, `docs/staff-access-lifecycle-policy.md`, `docs/pharmacy-verification-policy.md`, `docs/price-integrity-policy.md`, `docs/notification-and-status-synchronisation.md`, `docs/worker-and-upload-pipeline.md`, and `docs/prescription-scanning-workflow-policy.md`.

## Non-negotiable gates

- No protected implementation starts until Task 7 records the approved provider, region/transfer position, data categories, retention/deletion, backup/restore, support access, recovery owner, cost ceiling and rollback path.
- No account activation starts until the authentication, MFA, recovery, anti-enumeration and session-revocation design is approved for the selected provider.
- No pharmacy activation starts until verification evidence, owner continuity, reviewer continuity, branch scope and audit ownership are approved.
- No mutation may accept an arbitrary state patch; every state change is a named Worker command with server-derived state, a 24-hour idempotency key and current-version enforcement where required.
- No real buyer, pharmacy, contact, health, prescription or production data enters local tests, public preview, fixtures, logs, screenshots or CI artifacts.
- No prescription upload or scan implementation starts until region, privacy, retention, quarantine, malware scanning, access control, recovery, independent security and budget gates pass together.
- Every task preserves safe generic errors, redacted audit/telemetry, rate limits, direct-binding denial, offline safety and WCAG 2.2 AA acceptance.

## Dependency graph

```text
Task 7 approval and provider gate
  ├── Task 8 identity/session/recovery boundary
  │     ├── Task 9 pharmacy verification and staff access
  │     │     └── Task 10 listing ownership, price and public projection
  │     └── Task 11 buyer OTC reservation lifecycle
  │           └── Task 12 status refresh and generic notifications
  ├── Task 14 support/reporting/admin access (after Task 8 and audit design)
  └── Task 13 prescription quarantine/scanning (after separate high-risk gate)

Task 15 public static support/legal/status presence may proceed only after
operator identity, approved contact details and publishing ownership exist.
```

## Future task queue

Task 7 has a detailed [protected-pilot gate implementation plan](2026-08-18-task-7-protected-pilot-gate-implementation.md) covering the evidence record, stable gate IDs, dependent-task references and fail-closed approval workflow. Task 8 has a [provider-neutral identity/session/recovery implementation plan](2026-08-18-task-8-identity-session-recovery-implementation.md), but it remains undispatchable until the specified Task 7 rows pass. Task 9 has a [pharmacy verification/staff-access implementation plan](2026-08-18-task-9-pharmacy-verification-staff-access-implementation.md), and remains blocked until Task 7, Task 8 and the exact verification field/role matrices pass. Task 10 has a [listing lifecycle/price-integrity implementation plan](2026-08-18-task-10-listing-lifecycle-price-integrity-implementation.md), and remains blocked until Task 9 authorization and the approved listing schema pass. Task 11 has a [buyer OTC reservation implementation plan](2026-08-18-task-11-buyer-otc-reservations-implementation.md), and remains blocked until Task 8, Task 9, Task 10, notification fallback and reservation retention gates pass. Task 12 has a [status-refresh/notification implementation plan](2026-08-18-task-12-status-refresh-notifications-implementation.md), and remains blocked until Task 11, the notification decision/privacy contract and cost breaker evidence pass. Task 13 has a [high-risk prescription quarantine/scanning gate plan](2026-08-18-task-13-prescription-quarantine-scanning-gate-implementation.md), and remains non-executable until every prescription gate and independent security assessment passes. Task 14 has a [support/report/admin-audit implementation plan](2026-08-18-task-14-support-reports-admin-audit-implementation.md), and remains blocked until Task 7 retention/support/audit gates and Task 8 break-glass rules pass. Task 15 has a [static public support/legal/status implementation plan](2026-08-18-task-15-public-support-presence-implementation.md), and remains blocked until operator, domain, contact, legal, translation and publisher gates pass.

| Task | Major deliverable | Execution state |
| --- | --- | --- |
| 7 | Protected-pilot decision and evidence gate | Documentation/approval; dispatch first |
| 8 | Provider-neutral Worker identity, session, MFA and recovery boundary | Blocked until Task 7 provider decision |
| 9 | Pharmacy verification, owner continuity and staff invitation lifecycle | After Task 8 and verification evidence decision |
| 10 | Pharmacy-owned listing mutation, price integrity and projection lifecycle | After Task 9; synthetic mutation tests first |
| 11 | Buyer OTC reservation command/state machine | After Task 8 and verified public listing owner |
| 12 | In-app status refresh and generic notification adapter | After Task 11; provider push remains optional |
| 13 | Private prescription upload/quarantine/scanning workflow | High-risk gate; do not dispatch with current approvals |
| 14 | Support reports, admin moderation and scoped audit views | After Task 8 and audit/access review |
| 15 | Static public legal/support/status/security presence | After approved identity/contact/publisher details |

## Efficient execution strategy

Dispatch Task 7 as a documentation review first. Once its gates are genuinely
accepted, run Task 8 as the first protected code task. Tasks 9 and 11 can then
be developed in parallel only if they use disjoint D1 migrations, route files,
contracts and UI surfaces. Task 10 must serialize after Task 9 because branch
verification and staff ownership determine listing authorization. Task 12
serializes after the state machine is stable. Tasks 13 and 15 remain separate
release tracks and must never be smuggled into a lower-risk task.

Each protected task gets a fresh coding agent, a focused reviewer, and a final
security/privacy review. The implementer must return the exact schema/migration,
route/action list, authorization matrix, negative tests, browser evidence,
cost/usage impact, rollback plan and unresolved gate list. A green unit suite
never substitutes for provider, region, legal, browser or hosted evidence.

## Ready-to-paste future coordinator prompt

```text
Read docs/superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md
and docs/claude-tasks/future/README.md. Start with Task 7 as a documentation
and approval gate. Do not dispatch Tasks 8–15 until their listed prerequisites
are recorded as accepted. After Task 7, dispatch only disjoint tasks in
parallel, serialize shared D1 migrations and contracts, and use a separate
security/privacy reviewer after every implementation.

Every agent must preserve the web-only Cloudflare architecture, use synthetic
fixtures in tests, keep the browser away from bindings, implement explicit
commands rather than state patches, enforce idempotency/version checks, redact
logs/errors/notifications, and report exact evidence. Stop at any missing
provider, region, legal, recovery, cost, schema, binding or release approval.
Never infer permission from this roadmap, never add a credential or real data,
and never merge, deploy or activate a protected workflow without the recorded
approval and human handoff.
```

## Future task briefs

- [Task 7 — protected-pilot gate](../../claude-tasks/future/task-7-protected-pilot-gate.md)
- [Task 8 — identity/session/recovery](../../claude-tasks/future/task-8-identity-session-recovery.md)
- [Task 9 — pharmacy verification and staff access](../../claude-tasks/future/task-9-pharmacy-verification-staff-access.md)
- [Task 10 — listing lifecycle and price integrity](../../claude-tasks/future/task-10-listing-lifecycle-price-integrity.md)
- [Task 11 — buyer OTC reservations](../../claude-tasks/future/task-11-buyer-otc-reservations.md)
- [Task 12 — status refresh and notifications](../../claude-tasks/future/task-12-status-refresh-notifications.md)
- [Task 13 — prescription quarantine and scanning](../../claude-tasks/future/task-13-prescription-quarantine-scanning.md)
- [Task 14 — support, reports and admin audit](../../claude-tasks/future/task-14-support-reports-admin-audit.md)
- [Task 15 — public support/legal/status presence](../../claude-tasks/future/task-15-public-support-presence.md)

Once Tasks 7–15 pass, the operational gate continues in the
[pilot operations and release roadmap](2026-08-18-pilot-operations-release-roadmap.md)
with [Tasks 16–22](../../claude-tasks/operations/README.md). Do not treat a
feature-complete code branch as pilot-ready until those operational exercises
and release evidence exist.
