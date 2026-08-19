# Task 46 Vendor, Processor and Contract Renewal Review Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Maintain a founder-controlled, evidence-backed register for approved external services and contracts without accessing or changing an external account in this documentation task.

**Architecture:** The register maps service/account purpose, environment, data class, region/transfer, processor/subprocessor, terms, billing, cost threshold, MFA/recovery owner, authorised users, renewal date, review evidence and exit path. External inspection is a separate gated action requiring fresh authentication and explicit scope.

**Tech Stack:** Repository Markdown, redacted register entries, local checks and approved official terms/pricing/security sources. No account provisioning, billing, deployment, DNS, credential rotation, data export, new provider or binding is added.

**Spec:** `docs/claude-tasks/stewardship/task-46-vendor-processor-renewal-review.md`, `docs/architecture.md`, `docs/cloudflare-web-architecture.md`, `docs/cost-and-environment-plan.md`, `docs/business-and-commercial.md`, accepted Tasks 38, 39, 42, 43 and 45 evidence.

## Global Constraints

- This plan does not authorize external access. Before any dashboard, CLI, billing, domain, deployment or provider inspection, stop and require fresh authentication plus founder-approved scope.
- Never place passwords, tokens, OTPs, recovery codes, private keys, raw invoices, real sensitive records or private correspondence in source or evidence.
- Do not infer region, processor, transfer, retention, security, recovery, support, price or legal acceptability from a vendor name or stale documentation.
- Preserve the web-only Cloudflare boundary and current approved data, cost, support, recovery, privacy and release decisions.
- A missing register field or failed review blocks the affected external action; it is not permission to guess or continue.

## Task 1: Define the vendor and contract register

**Files:**

- Create: redacted approved-service/account register and field dictionary
- Read: architecture, cost, privacy, operator, security/recovery and readiness decisions
- Modify: task brief, stewardship README and roadmap links

- [ ] **Step 1: Define required fields**

Record service/account, purpose, environment, data class, region/transfer role, processor/subprocessor, terms source/version/date, billing owner, monthly threshold, MFA/recovery owner, authorised users, renewal date, reviewer, status and exit path.

- [ ] **Step 2: Separate candidates from approvals**

Mark deferred, synthetic-only candidates and approved services distinctly. A documented candidate never authorizes account creation, protected data, billing or production use.

- [ ] **Step 3: Define owners and cadence**

Set monthly account/ownership review where already required, renewal review before commitment and an immediate review after incident, owner departure, terms/region/processor/cost change or legal advice.

## Task 2: Define renewal and reauthentication controls

**Files:**

- Create: renewal checklist and external-access handoff record
- Modify: account-ownership and task-handoff guidance only after review

- [ ] **Step 1: Recheck evidence**

For each renewal, compare current official terms, pricing/limits, privacy/security controls, region/processor, backup/restore, support, suspension and exit behavior against approved decisions.

- [ ] **Step 2: Gate external access**

Capture requested service, purpose, read/write scope, account/environment, approver, fresh-authentication date and stop time. Do not ask an agent to receive or retain credentials; use the service's authenticated session only when separately authorized.

- [ ] **Step 3: Decide posture**

Recommend continue, restrict, replace, pause or exit. Record cost impact, data/capability impact, migration/rollback needs and unresolved legal/security/privacy questions.

## Task 3: Exercise failure and exit readiness

**Files:**

- Create: synthetic renewal-expiry, owner-loss, outage, cost-threshold and provider-exit scenarios
- Modify: continuity/recovery and corrective-action registers

- [ ] **Step 1: Exercise ownership loss**

Use synthetic account records to verify MFA/recovery ownership, authorised-user review, contributor departure removal and founder escalation without touching a real account.

- [ ] **Step 2: Exercise provider failure**

Verify the approved pause, safe fallback, data export/deletion boundary, contract notice, rollback and public-status decision without creating a real export or changing DNS/deployment.

- [ ] **Step 3: Track unresolved risk**

Record owner, severity, capability impact, deadline, stop condition and retest evidence. Escalate any provider/region/data/contract change to ADR and readiness review.

## Task 4: Verify and hand off

**Files:**

- Create: redacted register, renewal decisions and unresolved-risk report
- Modify: task brief, stewardship README, docs index and roadmap

- [ ] **Step 1: Run checks**

Run formatting and link/structure checks plus local register validation. Do not claim external terms, account state, pricing or authentication was checked unless it was actually and explicitly run.

- [ ] **Step 2: Preserve the access boundary**

Ensure the output does not grant credentials, permissions, billing, deployment, provider or production-data authority. Leave external checks as a future authenticated task.

- [ ] **Step 3: Commit the governance update**

Commit `chore: review vendor processor and contract renewals`; schedule the next review and keep candidates separate from approved services.
