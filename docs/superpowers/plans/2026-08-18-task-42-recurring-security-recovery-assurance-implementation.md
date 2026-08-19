# Task 42 Recurring Security and Recovery Assurance Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep security, privacy, recovery, cost and release controls exercised after pilot readiness without using production credentials, real sensitive data or formal-certification claims.

**Architecture:** A founder-owned assurance calendar schedules synthetic restore, incident, access, dependency/secret, cost-breaker, authorization/redaction and accessibility/security exercises. Each control has an owner, evidence location, stop condition, last/next review date, corrective-action record and retest outcome. Critical failures block only the affected protected capability until explicit re-approval.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, approved local fixtures, repository checks, redacted documents and the existing runbooks. No production deployment, new binding, secret, monitoring provider, certification service, automatic remediation or real incident simulation is added.

**Spec:** `docs/claude-tasks/stewardship/task-42-recurring-security-recovery-assurance.md`, `docs/incident-response-runbook.md`, `docs/security-architecture-threat-model.md`, `docs/pilot-operations.md`, `docs/cost-circuit-breaker-policy.md`, `docs/repository-security-and-delivery.md`, and accepted Tasks 18, 20, 27, 36 and 37 evidence.

## Global Constraints

- Do not begin until the required task evidence, named security/recovery owners, synthetic scenarios, current access/vendor register and independent-review rule are accepted.
- Use synthetic records and redacted evidence only. Never place prescriptions, OTPs, passwords, tokens, raw contact details or sensitive support text in reports, tickets or logs.
- Do not weaken a control to meet a calendar date. Failed critical containment, restore or authorization tests block the relevant protected workflow and require corrective action plus retest.
- Preserve least privilege, append-only audit expectations, anti-enumeration, branch isolation, idempotency, offline safety and safe search fallback.
- Record legal/pharmacy escalation questions without inventing notification duties, retention periods, recovery guarantees or vendor commitments.

## Task 1: Build the recurring assurance calendar

**Files:**

- Create: calendar and control register with owner, cadence, scope, evidence location, stop condition and last/next review date
- Create: corrective-action and retest register
- Modify: task brief, governance roadmap and decision log with the accepted outcome
- Read: Tasks 18/20/27/36/37 evidence and current service-account/vendor register

- [ ] **Step 1: Define cadence and ownership**

Schedule quarterly restore and access/vendor reviews; annual incident and recovery exercises; and dependency/secret, cost-breaker, authorization/redaction and accessibility/security checks at release or after material change.

- [ ] **Step 2: Define evidence and thresholds**

For each control record scenario, synthetic fixture set, expected containment/recovery/data-loss target, evidence minimum, severity, owner, reviewer, stop condition and next review date. Use existing pilot targets only where already approved.

- [ ] **Step 3: Define independent review**

Document when a critical finding, production-boundary change, legal/privacy question, or repeated failed retest requires an independent reviewer. Do not treat an internal checklist as independent assurance.

## Task 2: Rehearse synthetic security and recovery scenarios

**Files:**

- Create: scenario scripts and redacted result records
- Modify: incident, backup/restore, cost-breaker and access-control evidence registers

- [ ] **Step 1: Exercise critical scenarios**

Rehearse suspected prescription exposure, privileged MFA compromise, malicious file, cross-branch authorization attempt, kill-switch activation and backup/restore failure using synthetic identities and documents.

- [ ] **Step 2: Verify safe containment and recovery**

Confirm session/role revocation, quarantine, branch isolation, generic status communication, verified-safe restore, audit integrity, redaction and explicit approval before re-enabling sensitive functions. Check safe non-sensitive search fallback where applicable.

- [ ] **Step 3: Track corrective actions**

Record elapsed containment, missed controls, owner, due date, affected capability, retest evidence and unresolved residual risk. Do not close a critical finding through an undocumented waiver.

## Task 3: Exercise assurance against change and cost risk

**Files:**

- Create: synthetic dependency/secret, authorization/redaction and cost-breaker exercises
- Modify: release gate and feature-switch evidence with exact scope

- [ ] **Step 1: Test change-triggered review**

For a synthetic Worker, route, schema, dependency, secret, vendor or policy change, verify the required security, privacy, cost, ADR and release reviews are identified before implementation.

- [ ] **Step 2: Test cost and capability stops**

Exercise approved spend thresholds and feature switches without contacting production services. Confirm the stop leaves safe search and data integrity intact and records actor, reason, scope, start/end and recovery validation.

- [ ] **Step 3: Check evidence privacy**

Review reports for prohibited raw values, unnecessary identifiers and exposed internal details. Replace them with opaque IDs, categories and aggregate timing before acceptance.

## Task 4: Close, retest and hand off

**Files:**

- Create: annual/quarterly assurance summary and unresolved-risk list
- Modify: task brief, relevant ADR/policy links and roadmap status

- [ ] **Step 1: Run document and repository checks**

Run link/structure checks and repository security checks where tooling or configuration changes. Run approved synthetic exercises only; do not imply hosted or production verification.

- [ ] **Step 2: Obtain release decision**

Classify each result as continue, remediate, cap, pause or independent review. Protected capability reactivation requires named owner approval and successful retest.

- [ ] **Step 3: Commit the evidence**

Commit `chore: schedule recurring security and recovery assurance`; leave unresolved risks visible and do not stage credentials, real records or public vulnerability details.
