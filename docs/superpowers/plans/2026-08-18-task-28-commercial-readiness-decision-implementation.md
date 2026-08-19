# Task 28 Commercial Readiness Decision Packet Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use sustained pilot value and operational evidence to decide whether MediFind should remain free, study a pharmacy SaaS/listing-fee model or stop/reshape the product before any billing work begins.

**Architecture:** This is a documentation-only decision packet. It consumes aggregate Task 26 evidence, anonymized/synthetic feedback and Task 22 operational evidence; it does not add payment, subscription, invoice, advertising or commercial data paths. Any future paid capability remains behind a new provider/region/data/security/recovery/cost/legal task and cannot influence search relevance, availability, safety wording, access control or dispensing claims.

**Tech Stack:** Markdown decision packet, linked evidence matrix, synthetic/anonymized summaries, cost and support calculations, invariant tests only if a guardrail code change is explicitly approved, repository link/format checks and existing quality gates. No Stripe, billing SDK, subscription database, payment data, financial identifiers, advertising network, affiliate relationship or paid-ranking mechanism is added.

**Spec:** `docs/claude-tasks/post-pilot/task-28-commercial-readiness.md`, `docs/business-and-commercial.md`, `docs/free-first-production-architecture.md`, `docs/cost-and-environment-plan.md`, `docs/public-source-visibility-review.md`, `docs/api-and-data-contracts.md`, accepted Tasks 22 and 26 evidence, founder capacity review and current Fiji legal/business/tax advice.

## Global Constraints

- Do not treat this plan or a coding-agent commit as approval to charge, bill, collect financial data, select a provider, change commercial terms, expand the cohort or make paid conversion automatic.
- Require Task 22 release evidence, Task 26 aggregate evidence, feedback from each pilot pharmacy and representative buyers, founder capacity review and current Fiji legal/business/tax advice. Missing or private-only evidence blocks a commercial decision.
- Use anonymized/synthetic summaries only. Never commit private pharmacy correspondence, buyer contacts, health/prescription details, raw feedback transcripts or financial data.
- Compare free continuation, research-only paid hypothesis and stop/reshape outcomes with explicit assumptions, uncertainty, taxes, refunds, contracts, support hours, cost ceiling, safety obligations and unresolved risks.
- Paid status must not affect search ranking, relevance, price/availability claims, safety language, public prominence, verification, authorization or pharmacy dispensing decisions.
- No billing provider, subscription state, invoice, payment, financial account, advertising, affiliate, sponsored placement or automatic conversion is implemented.
- Any unresolved legal, tax, contract, liability, insurance, privacy, region, security, support, recovery or cost question is a stop condition for implementation.

## Task 1: Establish the commercial decision gate and evidence map

**Files:**

- Create: `docs/evidence/2026-08-18-task-28-commercial-readiness-decision.md` or the repository-approved decision-packet path
- Modify: `docs/claude-tasks/post-pilot/task-28-commercial-readiness.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md` to link this plan
- Read: accepted release/metrics evidence, pilot agreement, legal identity, business/tax, cost/support and public-source review

**Interfaces:**

- Input: aggregate product evidence, anonymized pharmacy/buyer feedback, support/cost/safety outcomes, founder capacity and legal/business/tax advice.
- Output: decision packet with continue/stop/prepare outcome, named approver, assumptions, unresolved blockers, invariants and next review date.

- [ ] **Step 1: Confirm evidence provenance and privacy**

Record source artifact/hash, period, cohort, sample limits, anonymization/synthetic status, owner and access. Reject raw transcripts, contacts, prescription/health data and unapproved testimonials.

- [ ] **Step 2: Define decision outcomes**

Use explicit `continue free pilot`, `prepare paid research only`, `stop/reshape` or `decision incomplete` outcomes. A `prepare` result authorizes a decision packet or user research only, never charging or billing implementation.

- [ ] **Step 3: Define approval and review**

Name founder approver, legal/business/tax reviewer, data/privacy owner, support owner and next review date. Record the exact scope accepted and what remains prohibited.

## Task 2: Analyze sustained value, operations and cost

**Files:**

- Modify: commercial evidence packet with aggregate tables and assumptions
- Read: Task 26 metric dictionary/export, Task 22 support/release record and business model
- Create: synthetic calculation fixtures only if needed for reproducibility

- [ ] **Step 1: Assess pharmacy value**

Summarize verified branch participation, listing-refresh compliance, response/fulfilment workflow, support effort, training burden, qualitative value and retention intent without naming private people or copying correspondence.

- [ ] **Step 2: Assess buyer value**

Summarize search success/zero-result, freshness usefulness, reservation outcomes, accessibility/language feedback, safe boundary comprehension and unresolved friction. Do not infer clinical benefit or use health outcomes.

- [ ] **Step 3: Assess cost and capacity**

Compare infrastructure/cost-breaker usage, support hours, verification/onboarding/recovery/incident effort, translation/accessibility assurance and expected paid-model obligations against the FJD 50-100 pilot ceiling and founder capacity. Identify costs excluded from the ceiling.

- [ ] **Step 4: State uncertainty and stop signals**

Mark small sample, missing data, conflicting feedback, unresolved safety/privacy/security incident, support overload, weak value, cost uncertainty and legal/tax gaps. Do not convert missing evidence to zero or a positive signal.

## Task 3: Compare commercial hypotheses without implementing billing

**Files:**

- Modify: decision packet comparison table
- Read: legal/business/tax advice and cost/environment decisions
- Create: no payment/provider code

- [ ] **Step 1: Compare free continuation**

Record benefits, support/cost limits, operational cap, review cadence, safety/privacy posture and trigger for pause/stop.

- [ ] **Step 2: Compare pharmacy SaaS/listing-fee research**

Record assumptions about payer, value metric, pricing hypothesis, taxes, contract, refunds, invoicing, support/SLA, cancellation, accessibility, legal/liability/insurance and data obligations. Mark each unresolved item as blocking implementation.

- [ ] **Step 3: Compare stop/reshape**

Define conditions for reducing scope, pausing sensitive features, closing the pilot, preserving lawful records, revoking access and communicating safely without deleting evidence or forwarding pending prescriptions.

- [ ] **Step 4: Define reversible research/communication**

If approved, allow only non-binding interviews, anonymized surveys or a reviewed pricing hypothesis with no charge collection, payment details, public promise, sponsored placement or automatic conversion. Record consent/privacy and stop criteria.

## Task 4: Prove commercial invariants and future-task boundary

**Files:**

- Create: invariant checklist/tests only if existing guardrail code is changed
- Modify: API/search/capability decision references only within approved scope
- Review: Task 10 listing/search, Task 19 breaker and Task 26 metric boundaries

- [ ] **Step 1: Pin ranking and safety invariants**

Prove a hypothetical paid status cannot alter relevance, exact/alias matching, freshness, availability, FJD price, no-guarantee language, verification, role access, prescription routing or pharmacy dispensing authority.

- [ ] **Step 2: Pin data and provider invariants**

Any future billing task must separately approve provider, region/transfer, data categories, retention/deletion, security, authorization, recovery, cost ceiling/breakers, export/migration, refund/contract and rollback. No payment data exists in this task.

- [ ] **Step 3: Pin release and commercial boundaries**

No code path automatically converts a free pilot pharmacy, no public paid claim is published, and no buyer is charged. A future billing implementation is a new task/ADR and cannot be inferred from this packet.

## Task 5: Verify and hand off the decision

**Files:**

- Review: evidence packet, aggregate/synthetic attachments, invariant tests and links
- Modify: task brief/roadmap/decision log with exact outcome

- [ ] **Step 1: Run document and link checks**

Run Markdown/link validation and Prettier. If guardrail code changed, run format/lint/typecheck/test/build/security checks and report exact results. No deployment or billing command is needed.

- [ ] **Step 2: Check privacy and repository safety**

Confirm no private correspondence, raw metrics, direct identifiers, financial data, payment provider, credential, `.env`, analytics or billing artifact is present.

- [ ] **Step 3: Record named decision and blockers**

Attach anonymized/synthetic evidence, selected outcome, approver, unresolved questions, owner/due date, stop criteria and next review. A coding agent cannot mark the gate satisfied.

- [ ] **Step 4: Commit only the packet**

Commit only approved Task 28 documentation with `docs: record post-pilot commercial readiness decision`. Do not stage billing code, contracts not approved by counsel, real feedback or unrelated changes.
