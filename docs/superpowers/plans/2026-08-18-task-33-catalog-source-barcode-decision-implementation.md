# Task 33 Catalog Source and Barcode Decision Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revisit deferred barcode and external-catalog options using search-quality evidence while preserving the strict distinction between medicine identity support and clinical or dispensing advice.

**Architecture:** This is a decision packet, not barcode/scanning or catalog import implementation. Pharmacy-authored/MediFind-reviewed curation remains the working source and continues safely if every option is rejected. Any candidate source is treated as untrusted reference data behind a Worker adapter, with provenance/version/conflict/expiry/review state; it cannot become authoritative availability, price, prescription status or dispensing logic.

**Tech Stack:** Existing `apps/web`, optional `apps/worker`, `packages/contracts`, synthetic provenance/source/barcode fixtures, curation/projection contracts, redacted exports and decision documentation. No camera permission, barcode scanning code, external catalog dump, source credential, public catalog, clinical inference, government eligibility workflow or new provider is added.

**Spec:** `docs/claude-tasks/scale-options/task-33-catalog-source-barcode-decision.md`, `docs/data-and-search.md`, `docs/data-dictionary-and-ownership.md`, `docs/requirements.md`, `docs/experience-and-content.md`, `docs/decisions.md` (ADR-198/ADR-199), accepted Tasks 23 and 26 evidence and named pharmacy/clinical/legal/privacy/security reviewers.

## Global Constraints

- Do not start until Task 23 curation and Task 26 search-quality evidence, named reviewers and legal/privacy/security review of each candidate source are accepted.
- No external source is approved by this task. Any recommendation requires separate licensing, processor/region, update/correction, retention, security, cost, export, rollback and implementation approval.
- Use synthetic provenance, source records and barcode values only. No real medicine catalogue, pharmacy export, product/health/prescription data, source credential or public catalog dump may enter the repository.
- Preserve strength, form, route, release, pack, brand, OTC/prescription status and other approved attributes. A scan/source record cannot silently merge incompatible products or infer clinical equivalence.
- Unknown, ambiguous, recalled, discontinued, conflicting or expired source records remain non-authoritative and are explained safely without clinical advice.
- Current pharmacy-authored/MediFind-reviewed curation must keep working if every candidate is rejected. No live barcode/camera permission, automatic matching or public availability mutation is enabled.

## Task 1: Establish source decision gate and baseline

**Files:**

- Create: synthetic catalog-source/barcode decision packet
- Modify: `docs/claude-tasks/scale-options/task-33-catalog-source-barcode-decision.md` to link this plan and record outcomes
- Modify: `docs/README.md` and `docs/superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md` to link this plan
- Read: Task 23/26 evidence, ADR-198/ADR-199, reviewer assignments and candidate-source review

- [ ] **Step 1: Record current curation baseline**

Capture synthetic fixture count, exact/alias/ambiguous/no-result quality, manual curator burden, correction/staleness issues and sample/uncertainty. Do not use raw query or pharmacy correspondence.

- [ ] **Step 2: Define candidate options**

Compare continued manual curation, barcode-assisted entry, licensed catalog reference and government/product-registry reference as separate options. Record identity benefit, coverage, provenance, licensing, processor/region, update/correction, cost, support, security, privacy and rollback.

- [ ] **Step 3: Define stop criteria**

Unresolved source authority, licence/terms, regional applicability, correction/recall freshness, identity conflict, safety/legal review, cost, support or migration risk blocks use. Record rejection/no-change as a valid outcome.

## Task 2: Define provenance and source-reference contracts

**Files:**

- Create: synthetic source/provenance/conflict schemas and validators
- Modify: existing curation contracts only for approved decision scope
- Create: forbidden-field and export/redaction tests

- [ ] **Step 1: Model source lifecycle**

Use explicit proposed, reviewed, approved-reference, stale, expired, conflicting, rejected, recalled/discontinued and retired states with opaque ID, source/version, effective/expiry, reviewer, correction reference and audit metadata.

- [ ] **Step 2: Separate reference from authority**

Reference data may suggest a candidate identity for curator review but cannot publish listing, price, availability, stock, prescription status or dispensing decision. Pharmacy/MediFind-reviewed records remain authoritative for public projection.

- [ ] **Step 3: Preserve attribute integrity**

Require explicit comparison of generic/brand, strength, form, route, release, pack and status. Unknown or conflicting attributes block exact matching and use safe ambiguous language.

- [ ] **Step 4: Define barcode limits without implementing scanning**

Treat a synthetic barcode as an optional candidate key only. Define duplicate/unknown/check-digit/version/region/correction behavior, never use it as a health or eligibility identifier and do not collect camera data or store scan history.

## Task 3: Rehearse source conflicts and safe projection behavior

**Files:**

- Create: synthetic provenance/barcode/conflict fixtures
- Create: curation/projection/authorization/export tests
- Review: Task 23 exact-product and Task 26 privacy metrics boundaries

- [ ] **Step 1: Exercise source states**

Cover unknown, ambiguous, recalled, discontinued, expired, duplicate, malformed, wrong-region, conflicting-attribute and corrected source records. Verify safe non-exact result or exclusion and no clinical substitution.

- [ ] **Step 2: Exercise public projection**

Verify an unreviewed source cannot enter public projection, change pharmacy price/availability, create exact stock, alter freshness or route a prescription. Approved curation remains deterministic and auditable.

- [ ] **Step 3: Exercise rollback/correction**

Supersede/revoke a synthetic source, rebuild projections and verify existing approved records retain integrity, stale/unsafe results are removed/labelled and no data is deleted or silently rerouted.

- [ ] **Step 4: Exercise privacy and access**

Attempt browser/source-direct access, raw source payload logging, source credential leakage, buyer/location linkage and prescription/health content. Verify generic denial, redaction, scoped review and safe exports.

## Task 4: Produce ADR decision and future-task outline

**Files:**

- Create: decision matrix, reviewer requirements and synthetic export report
- Modify: task brief/roadmap/decision log with exact ADR outcome

- [ ] **Step 1: Decide current path**

Record whether current pharmacy-authored/MediFind-reviewed curation remains accepted, ADR-199 remains accepted, is amended or should be reopened through a founder decision. Do not silently change an ADR.

- [ ] **Step 2: Name unresolved source facts**

List licensing, processor/region, update/correction, recall/discontinuation, retention/deletion, security, cost, support and rollback questions with owner/due date.

- [ ] **Step 3: Separate future implementation**

If an option is recommended, outline a new task for exact source/provenance, reviewer authority, adapter, privacy, contract, failure, audit, export, cost and rollback. Do not implement camera, barcode or external source now.

- [ ] **Step 4: Run checks and commit packet**

Run format, lint, typecheck, tests, build, provenance/contract/redaction/export checks and relevant local Wrangler validation only without deployment or credentials. Commit `docs: record catalog source and barcode evaluation decision` with no external data/code.
