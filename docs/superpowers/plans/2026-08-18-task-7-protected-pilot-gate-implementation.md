# Task 7 Protected-Pilot Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a reviewable, fail-closed evidence packet that decides whether MediFind may begin protected-pilot implementation. The packet must make missing founder, legal, privacy, security, provider, recovery and cost evidence visible without inventing a provider, region, contact, retention period or approval.

**Architecture:** This is a documentation and review task only. The browser remains web-only, the Worker remains the future server boundary, and D1/R2/KV remain unapproved until the packet's exact gates pass. The review record is not an authorization to provision Cloudflare, add bindings, collect real data or enable an account. A proposed ADR may be drafted only after the founder accepts a complete packet; until then the recorded outcome is `NOT APPROVED` for every unresolved gate.

**Tech Stack:** Markdown, repository links, deterministic evidence IDs, source-controlled review tables and existing ADR conventions. No application code, provider SDK, Cloudflare CLI, secret, external account or hosted environment is required.

**Spec:** `docs/claude-tasks/future/task-7-protected-pilot-gate.md`, `docs/architecture.md`, `docs/cloudflare-web-architecture.md`, `docs/security-privacy-compliance.md`, `docs/security-architecture-threat-model.md`, `docs/cost-and-environment-plan.md`, `docs/cost-circuit-breaker-policy.md`, `docs/public-notice-and-legal-identity.md`, `docs/decisions.md` and `docs/superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md`.

## Global Constraints

- Create only the review record and its documentation links. This is a no Cloudflare, no-provisioning task: do not run Wrangler, contact Cloudflare, create an account/project/binding, read credentials, add a secret or use real data.
- Treat an absent, stale, uncertain or conflicting fact as `FAIL — UNVERIFIED`; never turn a roadmap preference into approval.
- Keep the active web-only Cloudflare direction. Do not revive Firebase, Google Cloud, Cloud Run, API Gateway, Firestore, native apps, app stores or native push.
- Keep public preview, local fixtures, screenshots, logs and test artifacts synthetic-only.
- Prescription upload, quarantine and scanning remain disabled unless the separate high-risk prescription gate passes; Task 7 cannot approve it implicitly.
- Do not record a provider, region, subprocessors, legal identity, retention period, support contact, cost ceiling or recovery owner unless the required founder/legal/privacy/security evidence is supplied and cited.
- Preserve anti-enumeration, server-side authorization, rate limits, idempotency, redacted audit data, direct-binding denial, offline safety and WCAG 2.2 AA requirements as release conditions.

## Task 1: Establish the review-record contract

**Files:**

- Create: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Modify: `docs/claude-tasks/future/task-7-protected-pilot-gate.md`
- Modify: `docs/README.md`
- Modify: `docs/superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md`
- Modify: `docs/superpowers/plans/2026-08-18-synthetic-queue-current-state-and-dispatch.md` only if the handoff index needs the new record linked

**Interfaces:**

- Consumes the required policy sources and founder-supplied evidence packet.
- Produces one versioned review record with stable gate IDs, explicit status, evidence citations, owner, reviewer, review date, blockers and release conditions.

- [ ] **Step 1: Define the record header and status vocabulary**

Use a document title, packet version, prepared date, review owner, required reviewers, evidence cutoff and decision field. Define only `PASS`, `FAIL — UNVERIFIED`, `FAIL — CONFLICTING`, and `NOT REVIEWED`; state that `PASS` requires an authoritative citation and named approver. Do not use a blank cell or prose implication as approval.

- [ ] **Step 2: Assign stable gate IDs**

Use these IDs consistently in the record and dependent briefs:

| ID | Gate |
| --- | --- |
| `G-01` | Operator/legal identity, support owner and public accountability |
| `G-02` | Exact provider products, account separation, region/transfer position and subprocessors |
| `G-03` | Data categories, purpose, minimisation, retention/deletion, export and user rights |
| `G-04` | Authentication, MFA, sessions, recovery, revocation and privileged support access |
| `G-05` | D1 backup/restore, R2 recovery if applicable, incident response and deletion execution |
| `G-06` | Rate limits, anti-enumeration, authorization, redaction, abuse controls and direct-binding denial |
| `G-07` | Monthly ceiling, 50/80/100% alerts, provider breakers and re-enable authority |
| `G-08` | Browser accessibility, offline safety, support escalation and user-safe failure states |
| `G-09` | Rollback, release owner, review date and exact launch evidence |
| `G-10` | Separate prescription high-risk gate: region, quarantine, scanning, access, recovery, legal and independent security review |

- [ ] **Step 3: Define evidence-entry fields**

Each gate row must contain: status; requirement; current repository baseline; missing or conflicting fact; exact evidence expected; source/attachment link; named decision owner; reviewer; date; expiry/review date; dependent tasks; and the action required before a pass. Do not paste credentials, tokens, personal contact values, prescription content or sensitive legal documents into the repository; link to a founder-controlled evidence location only when its existence and review status can be recorded safely.

## Task 2: Populate the protected-pilot evidence matrix

**Files:**

- Modify: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Read and cite: the files listed in `Spec` and the exact Cloudflare product terms/region evidence selected by the founder

**Interfaces:**

- The policy baseline supplies required controls, not approval.
- Founder/legal/privacy/security/cost evidence supplies the only possible pass condition for protected activation.

- [ ] **Step 1: Record operator, legal and support ownership (`G-01`)**

Require the approved MediFind operator identity, Fiji legal review outcome, public contact method, support owner/hours, escalation path, business/pharmacy agreement ownership and publisher/domain ownership. Record the current prohibition on using a founder's personal name or placeholder identity in external notices. Missing identity or support details remain failed.

- [ ] **Step 2: Record provider and transfer evidence (`G-02`)**

List each exact product and environment separately: Pages, Worker, D1 and any proposed R2/KV/auth/notification provider. Require founder-controlled account separation, data location/region, transfer mechanism or position, processor/subprocessor terms, backup/deletion behavior, access controls and current official product terms. Cloudflare's global presence or free tier is not evidence of Fiji suitability. Do not select a substitute provider to fill a gap.

- [ ] **Step 3: Record data governance (`G-03`)**

Enumerate minimum buyer, pharmacy, branch, listing, reservation, support, audit and (if separately approved) prescription categories with purpose, access role, legal/privacy basis as advised, retention, deletion, export, correction/access request process and backup implications. Preserve the rule that prescription retention remains unset and uploads disabled until approved.

- [ ] **Step 4: Record identity and privileged-access controls (`G-04`)**

Require the selected provider-neutral contract, MFA assurance for privileged roles, session lifetime/revocation, buyer recovery and security-delay behavior, support break-glass rules, fresh-MFA requirements, owner continuity and auditable re-enable/recovery authority. Do not accept an SDK, OTP vendor, email sender or recovery default as implied approval.

- [ ] **Step 5: Record recovery and incident controls (`G-05`)**

Require encrypted backup scope, D1 export/restore procedure, R2 recovery only if R2 is proposed, restore test evidence using synthetic data, deletion propagation, incident contact, containment, access revocation, notification/escalation and post-incident review. Include the exact rollback owner and the condition under which protected workflows are disabled.

- [ ] **Step 6: Record application and abuse controls (`G-06`)**

Require positive and negative authorization evidence, opaque IDs, generic not-found/denied responses, persistent per-actor/action limits, body/request caps, idempotency and version checks, audit redaction, safe error mapping, direct-binding denial and abuse/cost exhaustion controls. State that a green unit suite alone cannot pass this gate.

- [ ] **Step 7: Record cost and breaker controls (`G-07`)**

Require a founder-approved monthly ceiling, service-by-service forecast, 50/80/100% alert owners, propagation expectations, provider-level breakers, pause behavior, safe search preservation, restore/re-enable authority, audit trail and migration/export path. The record must not replace a spend cap with a free-tier assumption.

- [ ] **Step 8: Record web safety and support (`G-08`)**

Require desktop/mobile browser and PWA acceptance, keyboard/screen-reader/zoom evidence, accessible loading/error/maintenance states, offline behavior that never queues sensitive mutations, generic status messaging and a support escalation path. No hosted/browser result may be claimed unless the evidence actually exists.

- [ ] **Step 9: Record release and rollback (`G-09`)**

Require an approved environment separation map, release owner, PR/review path, exact build/security/browser/hosted evidence expected, rollback trigger, rollback command/procedure, data compatibility strategy, review date and expiry of approvals. The record must explicitly distinguish local synthetic evidence from hosted protected evidence.

- [ ] **Step 10: Record the separate prescription gate (`G-10`)**

Mark it failed unless all required region, privacy, retention, private quarantine, object-key, access logging, malware engine/update, scanner isolation, retry/backlog/cost, recovery, audit redaction, legal/privacy and independent-security evidence is present. Keep upload UI/routes disabled while any item is unresolved.

## Task 3: Map every protected brief to explicit gate outcomes

**Files:**

- Modify: `docs/claude-tasks/future/task-8-identity-session-recovery.md`
- Modify: `docs/claude-tasks/future/task-9-pharmacy-verification-staff-access.md`
- Modify: `docs/claude-tasks/future/task-10-listing-lifecycle-price-integrity.md`
- Modify: `docs/claude-tasks/future/task-11-buyer-otc-reservations.md`
- Modify: `docs/claude-tasks/future/task-12-status-refresh-notifications.md`
- Modify: `docs/claude-tasks/future/task-13-prescription-quarantine-scanning.md`
- Modify: `docs/claude-tasks/future/task-14-support-reports-admin-audit.md`
- Modify: `docs/claude-tasks/future/task-15-public-support-presence.md`

Add a short `Task 7 gate references` subsection to each brief. It must name the relevant IDs and say the task remains undispatchable unless those rows are `PASS` in the review record. Use this mapping as the minimum:

| Brief | Required Task 7 gate references |
| --- | --- |
| Task 8 | `G-02`, `G-03`, `G-04`, `G-06`, `G-07`, `G-09` |
| Task 9 | `G-01`, `G-02`, `G-03`, `G-04`, `G-05`, `G-06` |
| Task 10 | `G-03`, `G-05`, `G-06`, `G-07`, `G-09` |
| Task 11 | `G-03`, `G-04`, `G-05`, `G-06`, `G-07`, `G-08` |
| Task 12 | `G-02`, `G-03`, `G-04`, `G-07`, `G-08`, `G-09` |
| Task 13 | `G-02`, `G-03`, `G-05`, `G-06`, `G-07`, `G-09`, `G-10` |
| Task 14 | `G-01`, `G-03`, `G-04`, `G-05`, `G-06`, `G-08` |
| Task 15 | `G-01`, `G-08`, `G-09` |

Do not weaken a brief's existing gate text; the IDs make the dependency auditable and do not authorize implementation.

## Task 4: Define approval, ADR and handoff behavior

**Files:**

- Modify: `docs/evidence/2026-08-18-protected-pilot-approval-gate.md`
- Modify: `docs/decisions.md` only after the founder accepts the complete packet and the proposed decision has an explicit owner/date
- Modify: `docs/superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md` if the recorded outcome changes dispatch state

- [ ] **Step 1: Record the current decision without guessing**

Given the current repository evidence, mark unresolved operator identity, exact provider/region/processor terms, retention/deletion, recovery ownership, cost ceiling and release evidence as failed or unverified. State `Protected implementation: NOT APPROVED` and list the exact founder/legal/privacy/security/cost inputs needed to change each row.

- [ ] **Step 2: Define the acceptance signature block**

Require named founder approval plus the applicable Fiji legal/privacy, pharmacy, security and cost reviewers, each with decision date, scope, evidence version and expiry/review date. A comment, roadmap preference or local test result is not a signature block.

- [ ] **Step 3: Gate ADR creation**

Do not add an accepted ADR while any required row is unresolved. After acceptance, add one narrowly scoped ADR that records the selected provider/products, region/transfer position, data categories, retention/deletion, support/recovery owner, cost ceiling, rollback and explicit exclusions. It must preserve the web-only Cloudflare direction and keep `G-10` separate unless prescription approval is independently recorded.

- [ ] **Step 4: Produce the coordinator handoff**

Report the packet path, current status, failed gate IDs, evidence owners, exact next inputs, dependent task states, synthetic/protected status, security/privacy/cost impact, rollback and residual risks. Do not report a protected pilot, hosted readiness or production approval.

## Task 5: Validate the documentation packet

**Files:**

- Review only: the review record, eight protected briefs, the Task 7 brief, roadmap, queue indexes and linked source documents

- [ ] **Step 1: Run documentation checks**

Run `pnpm exec prettier --check` on every modified Markdown file. Run a local relative-Markdown-link audit over the review record, queue indexes, roadmap and all eight briefs. Fix broken links and line-format issues without rewriting unrelated user-owned changes.

- [ ] **Step 2: Run gate completeness checks**

Confirm every `G-01`–`G-10` row has status, evidence-needed field, owner, reviewer, review date and dependent-task references. Confirm every Task 8–15 brief names its Task 7 gate IDs and the review-record path. Confirm prescription upload remains explicitly disabled.

- [ ] **Step 3: Run source-boundary review**

Search the new/modified packet for accidental credentials, personal contact values, real data, provider invention, unsupported region claims, production language, direct browser binding access and revived Firebase/GCP/native direction. Historical decision-log references may remain as history, but the new packet must cite ADR-272 as current authority.

- [ ] **Step 4: Commit only the documentation scope**

```bash
git add docs/evidence/2026-08-18-protected-pilot-approval-gate.md docs/claude-tasks/future/task-7-protected-pilot-gate.md docs/claude-tasks/future/task-8-identity-session-recovery.md docs/claude-tasks/future/task-9-pharmacy-verification-staff-access.md docs/claude-tasks/future/task-10-listing-lifecycle-price-integrity.md docs/claude-tasks/future/task-11-buyer-otc-reservations.md docs/claude-tasks/future/task-12-status-refresh-notifications.md docs/claude-tasks/future/task-13-prescription-quarantine-scanning.md docs/claude-tasks/future/task-14-support-reports-admin-audit.md docs/claude-tasks/future/task-15-public-support-presence.md docs/README.md docs/decisions.md docs/superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md
git commit -m "docs: prepare protected pilot approval gate"
```

Do not commit external evidence, credentials or approval artifacts that the founder has not authorized for repository storage.
