# Task 22 Staged Invite-Only Release and Rollback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Release the reviewed web/PWA and optional Worker only through a founder-approved authenticated workflow to a tiny invite-only Suva cohort, with exact environment separation, immutable rollback, safe degraded behavior and no accidental public or production activation.

**Architecture:** Local, synthetic preview, isolated rehearsal and protected pilot environments have separate Pages/Worker/D1/R2 bindings, domains, secrets and access. The reviewed commit and migrations are promoted through an evidence-backed release board. Pages/Worker versions are immutable release artifacts; rollback selects a prior safe version or approved forward fix and never deletes data. The browser receives safe health/capability status and no deployment secrets or internal release detail.

**Tech Stack:** Existing `apps/web` PWA and optional `apps/worker`, pinned pnpm build, Wrangler only through the approved authenticated founder workflow, exact environment manifests, migration/export/restore evidence, server-side flags/capability checks, synthetic preflight/rollback harness, browser/accessibility checks, cost/incident/support records and PR evidence. No deployment, credential, real-data, public acquisition, domain, binding or secret change is authorized by this planning document alone.

**Spec:** `docs/claude-tasks/operations/task-22-staged-release-rollback.md`, `docs/infrastructure-and-release-blueprint.md`, `docs/repository-security-and-delivery.md`, `docs/pilot-operations.md`, `docs/public-support-presence.md`, `docs/cost-circuit-breaker-policy.md`, `docs/incident-response-runbook.md`, `docs/test-and-acceptance-strategy.md`, accepted Tasks 16-21 evidence and the final founder release decision.

## Global Constraints

- Do not deploy, reauthenticate, provision, publish, migrate or enable protected data during plan drafting. Before any later deployment action, reauthenticate to the founder-approved service/account in the approved browser/CLI workflow; do not reuse stale sessions or copy tokens.
- Require accepted Tasks 16-21 evidence, approved public support/legal presence, exact environment separation, named release and rollback owners, recovery contact, cost alerts, support/status process and founder release approval. Any missing artifact or unresolved high-severity issue blocks the cohort.
- Verify separate bindings, domains, secrets and access for local, synthetic, rehearsal and protected environments before any release action.
- Keep all preflight, rollback and failed-release fixtures synthetic. No real buyer, pharmacy, medicine, health, prescription, contact, support, account or production data may enter artifacts, logs, screenshots or test environments.
- Main remains PR-only. Deploy only the reviewed commit through a restricted founder-controlled workflow. Never commit API tokens, account secrets, OTPs, `.env` files, private legal documents or production exports.
- Preview cannot reach protected data; protected pilot cannot be treated as production; no public acquisition, open registration, broad Fiji rollout or unapproved domain is enabled by this task.
- Verify exact routes, bindings, flags, migrations, domains, headers, environment variables and cost settings before release. Unknown/unapproved routes or capability defaults fail closed.
- Rollback means selecting a previous immutable web/Worker artifact or applying an approved forward fix plus compatible data migration. Never roll back by deleting data, dropping tables or weakening authorization/audit/recovery controls.
- Do not claim a hosted deployment, domain, browser-device result, release or production outcome unless it was actually executed and inspected.

## Task 1: Build the release gate and artifact manifest

**Files:**

- Create: release board/evidence record using the repository's approved evidence convention
- Modify: `docs/claude-tasks/operations/task-22-staged-release-rollback.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md` to link this plan
- Read: accepted Tasks 16-21 evidence, public/legal/support approval, founder release decision and current environment records

**Interfaces:**

- Input: reviewed commit/PR, artifact hashes, migrations, bindings, flags, routes, domains, secrets references, quality/security/browser evidence, cost forecast, rollback and support owners.
- Output: versioned PASS/FAIL release board, cohort scope, release/rollback commands and residual-risk record.

- [ ] **Step 1: Check the required evidence rows**

Verify Tasks 16-21 acceptance, legal/support/public presence, identity/session/recovery, verification/listing/reservation/status, backup/restore/deletion, cost breakers, incident exercises, accessibility/language, performance, support ownership, recovery contact and founder approval. A missing row is `NOT APPROVED`, not an assumption.

- [ ] **Step 2: Pin the exact artifact**

Record repository commit, PR/check results, web/Worker build hashes, migration list/order, contract versions, route inventory, environment, dependency lockfile, security scan, accessibility/browser evidence and previous immutable rollback versions. Do not use a moving branch, unpinned build or unreviewed generated output.

- [ ] **Step 3: Record cohort and capability scope**

List the tiny founder-approved Suva invite cohort, pharmacy branches, buyer invite/referral rule, start/end/review date, enabled capabilities and explicit disabled capabilities. Keep prescription/upload/scanning disabled unless the separate high-risk gate is accepted; do not turn a release record into a public acquisition approval.

## Task 2: Verify environment, identity and deployment controls

**Files:**

- Create: environment preflight script/report and safe route/binding manifest
- Review: Wrangler/Pages configuration, repository CI, founder account register and secret references
- Modify: configuration only when the approved release board identifies an exact bounded correction

- [ ] **Step 1: Reauthenticate before any external action**

At execution time, confirm the founder-approved Cloudflare/source-control/browser session is current, MFA-protected and scoped to the intended project/environment. If the session is stale, reauthenticate through the approved flow before reading or changing service state. Never print, commit or pass tokens through logs or source.

- [ ] **Step 2: Verify environment separation**

Check Pages project/domain, Worker name/route, D1/R2/KV bindings, secrets references, service-account ownership, callback/notification endpoints and access roles against the manifest. Preview and protected pilot must not share protected bindings, secrets, routes or public domains.

- [ ] **Step 3: Verify release permissions**

Confirm PR checks, restricted publisher/deployer role, MFA/recovery, release owner, rollback owner, least privilege and audit path. Contributors do not gain broad Cloudflare account access. No deployment occurs if authentication or ownership evidence is missing.

- [ ] **Step 4: Verify safe defaults**

Check protected flags, cohort gate, prescription/reservation kill switches, cost breakers, rate limits, anti-enumeration errors, secure headers, `robots`/indexing policy and synthetic-data guard. An unknown flag, route, domain or binding fails closed.

## Task 3: Run synthetic preflight and release validation

**Files:**

- Create: synthetic release-preflight fixtures/reports
- Review: built `apps/web/dist`, Worker artifact, migrations, route/contract manifest and environment configuration
- Modify: no protected data or production state

- [ ] **Step 1: Verify web and Worker artifacts**

Run format/lint/typecheck/test/build/security checks and inspect output for secrets, real data, unapproved routes, debug endpoints, source maps/headers that expose internals, direct D1/R2/KV access or public support/legal placeholders. Confirm the web build points only to the intended Worker contract/environment.

- [ ] **Step 2: Run migration and data preflight**

In isolated synthetic data, validate migration order, schema compatibility, foreign keys, projection rebuild, freshness, activation/capability state, retention boundaries, audit integrity and rollback/forward-fix path. Do not apply an unreviewed migration to protected or production data.

- [ ] **Step 3: Exercise health and safe route behavior**

Verify allowed health/status, search, detail, account/session, pharmacy, listing, reservation and approved operational routes using synthetic actors. Check method/schema/rate-limit/auth errors, anti-enumeration, generic unavailable/maintenance states, no direct binding access and no sensitive response/log leakage.

- [ ] **Step 4: Verify browser acceptance**

Run the accepted desktop/mobile/accessibility/language/offline checks against the reviewed artifact. Confirm sensitive mutations never queue offline, safe search behavior is truthful, public pages are separated, status/support hours are accurate and no install/cache path stores protected data unexpectedly.

- [ ] **Step 5: Verify cost and incident controls**

Exercise synthetic 50/80/100% breaker states, independent switches, safe search fallback, incident containment, audit, recovery hold and re-enable block. Record cost forecast/alerts and ensure no real notification, OTP, upload, scan, reservation or billing operation occurs during preflight.

## Task 4: Execute staged release only after approval

**Files:**

- Evidence: release board, deployment output/inspection and cohort activation record
- Modify: environment release state only through the founder-approved authenticated deployment workflow
- Review: Pages/Worker version and public/route inspection if actually hosted

- [ ] **Step 1: Obtain final approval**

The founder/release owner confirms every gate row, artifact hash, cohort, capability state, maintenance window, support owner, status-page process, cost alert and rollback owner. A failed/review-pending row blocks deployment.

- [ ] **Step 2: Deploy in the approved order**

Use the documented authenticated workflow and exact reviewed artifacts. Keep sensitive capabilities disabled until post-deploy health, authorization, audit, notification fallback, data integrity and cost checks pass. Do not run arbitrary dashboard edits or shell commands outside the release procedure.

- [ ] **Step 3: Inspect actual hosted state**

If deployment is authorized and executed, record URL/project/environment, deployed version, route/binding/flag inspection, headers/status, browser checks, logs/metrics safety and timestamp. If not executed, mark hosted evidence not run; local build evidence cannot stand in for hosted proof.

- [ ] **Step 4: Activate the tiny cohort deliberately**

Enable only the founder-approved Suva invite/referral audience and approved capabilities. Verify an uninvited buyer/branch cannot enumerate or join, no general acquisition path exists, and an out-of-scope Fiji branch remains non-public. Record cohort start/end/review and support hours.

## Task 5: Rehearse rollback in synthetic environment

**Files:**

- Create: synthetic rollback rehearsal evidence
- Review: previous immutable Pages/Worker versions, migration forward-fix/rollback plan and backup/restore evidence
- Modify: no production data or public legal history

- [ ] **Step 1: Trigger a controlled synthetic rollback**

Use a documented synthetic failure or staged release defect and select the prior immutable web/Worker versions. Do not delete data or change the production release to test rollback. Keep rollback owner and approval recorded.

- [ ] **Step 2: Verify data and authorization integrity**

After rollback, check schema/data compatibility, foreign keys, projection eligibility, activation/capability states, staff/branch authorization, sessions/revocation, audit append-only behavior, cost breakers, kill switches and notification/status fallback. Sensitive features remain paused until checks pass.

- [ ] **Step 3: Verify user/support behavior**

Confirm safe maintenance/status copy, no stale private cache or unsafe mutation, no public acquisition leakage, support escalation path and generic errors. Search remains available only where its data/authorization path is verified safe.

- [ ] **Step 4: Record recovery and re-enable**

Record rollback start/end, artifact hashes, data point, owner, residual risk, observed downtime/data-loss window and re-enable approval. A rollback rehearsal is not a production result.

## Task 6: Handoff release evidence and residual risks

**Files:**

- Create: final staged-release evidence record and residual-risk register
- Modify: task brief/roadmap/decision log with exact outcome
- Review: support, status, cost, incident, recovery and next-review records

- [ ] **Step 1: Record release outcome**

Choose `not approved`, `synthetic rehearsal only`, `staged invite-only pilot` or another explicitly founder-approved state. Do not label a deployment production, public, nationally available or clinically supported without a separate decision.

- [ ] **Step 2: Record operational handoff**

Document support hours/owner, status update process, security escalation, recovery contact, cost alerts, cohort cap, monitoring, maintenance window, incident exercises, backup/restore cadence, rollback owner and next review date.

- [ ] **Step 3: Keep residual risks actionable**

For every accepted risk, record affected capability/cohort, user-safe workaround, owner, due date, release impact and trigger for pause/rollback. Unresolved high-severity privacy/security/accessibility/recovery failure blocks the cohort.

- [ ] **Step 4: Run final repository checks and commit evidence**

Run the required format/lint/typecheck/test/build/security/dependency checks and relevant Wrangler validation. Stage only Task 22 evidence/documentation and approved release changes. Use commit message `docs: record staged pilot release evidence`. Never stage credentials, deployment logs containing secrets, raw user data or unrelated work.
