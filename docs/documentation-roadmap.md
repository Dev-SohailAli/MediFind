# Documentation completion roadmap

## Purpose

This roadmap identifies the documentation that must be completed or approved before Claude begins application code. It deliberately separates stable product decisions from implementation specifications.

## Documentation status

### Completed planning baseline

- Product, pilot, commercial and pharmacy-operating model.
- Buyer, pharmacy, owner, reviewer and admin journeys; reservations, prescription routing, support and recovery rules.
- Medicine listing/search/normalisation/catalog moderation policy.
- Security architecture, threat model, privacy principles, incident/recovery/audit/permission/accessibility policies.
- Mobile/API architecture, Cloud Run/Firebase direction, environments, cost guardrails, low-connectivity and recovery targets.
- Free-first production service map, no-cost allowances, paid safety exceptions, API Gateway/private Cloud Run edge, Firestore search projection/scale adapter, persistent rate limits, scheduled maintenance, OpenTofu/Workload Identity Federation, Cloud Armor upgrade triggers and scale-in-place thresholds.
- Claude Code handoff, task template, Superpowers setup/precedence, repository-security and monorepo policies.
- GitHub work-management policy, reusable issue templates, labels, staged milestones and an initial explicitly gated backlog for Claude work.
- Founder-approved whole-MVP low-fidelity design proposal, including visual tokens, role navigation, states, safety, accessibility and localisation treatment. It authorises only bounded future UI implementation after the remaining readiness gates.
- Draft public-support, public-notice, pilot agreement, pharmacy onboarding/training and verification policies.

### Still required before Claude writes the first synthetic-data-only code

| Deliverable | Owner | Completion standard |
| --- | --- | --- |
| Implementation-grade API/data specification | Documentation agent + product owner | **Foundation-only specification approved:** [first synthetic-foundation API/data specification](first-synthetic-foundation-api-data-specification.md) fixes a zero-route/zero-data first task. It still requires the separate test-foundation, repository-readiness and task-brief gates before it can support code. Each later feature task needs its own exact schema/authorization/state contract. |
| Cloud foundation implementation specification | Documentation agent + product owner | Assign final project/resource names; pin exact IAM custom/predefined permissions, OpenAPI JWT scheme, Authentication/API App Check handling, Fiji SMS breaker, quotas/max instances, persistent rate-limit schema, search indexes, maintenance schedule, ClamAV image/signature updater, OpenTofu state bootstrap and OIDC/Workload Identity conditions/commands from the approved free-first blueprint. No production resource is created yet. |
| Test foundation specification | Documentation agent + product owner | **Task-1 specification approved:** [first synthetic-foundation test specification](first-synthetic-foundation-test-specification.md) fixes the local/CI verification, evidence and zero-data rules for the first task. It still requires the repository-readiness and task-brief gates before code. |
| Repository readiness | Founder | **Synthetic-phase baseline recorded:** [repository readiness record](repository-readiness-record.md) verifies the private-repository workflow, single owner, issue controls, Dependabot and vulnerability-alert state. Gitleaks/Trivy CI must pass in the first implementation PR; GitHub secret scanning is unavailable and remains compensated by those checks. Before cloud-connected/sensitive code, upgrade the private repo for enforced `main` protection or separately approve public-source visibility; verify required checks and least-privilege Actions. |
| Claude readiness | Founder + Claude Code | Install Superpowers from the official marketplace, disable its optional telemetry and verify Claude reads `CLAUDE.md`/handoff before task one. |
| First approved Claude task brief | Documentation agent + product owner | Narrow, synthetic-data-only bootstrap task with scope, non-goals, interfaces, tests, exact commands and no production/cloud deployment authority. |

### Still required before an external pilot or real prescription is enabled

| Deliverable/gate | Owner | Completion standard |
| --- | --- | --- |
| MediFind business identity and legal operator details | Founder + Fiji adviser | Establish the non-personal public business identity/contact and insert legally required operator/contract disclosures. |
| Fiji legal/pharmacy/regulatory review | Fiji legal and pharmacy stakeholders | Validate Pharmacy & Poisons/MRA implications, medicine categories, pharmacy evidence, prescription/reservation workflow, records and advertising/search boundary. |
| Final privacy/terms/retention/processor documents | Documentation agent + Fiji adviser | Approve three-language public notices, processor register, data-transfer analysis, retention/deletion schedule, legal request process and final in-app pilot agreement. |
| Production vendor/configuration review | Founder + documentation agent | Re-verify actual Firebase/GCP/API Gateway/Cloudflare/EAS/GitHub configurations and prices, hosting/transfer path, ClamAV, SMS/native-map/static-site choices, cost estimates, backup/restore and incident contacts. |
| Pilot-pharmacy readiness | Founder + 2-3 pilot pharmacies | Complete verification, agreement acceptance, MFA, synthetic training, listing-quality and request/reservation walkthroughs. |
| Buyer/pilot readiness | Founder | Validate Fiji OTP delivery, translations, accessibility, physical-device workflows, public support/status/security pages, and invite-only beta communications. |
| Independent security assessment | Qualified independent assessor | Complete scoped mobile/API assessment and resolve high-severity findings before real prescription uploads. |

### Deliberately deferred until after pilot evidence

- Payments, delivery, paid subscriptions/billing, inventory-system integrations and wider Fiji coverage.
- Barcode scanning, external medicine catalogs, government-program/product-registry integrations.
- Embedded map, public ratings/reviews, saved searches/favourites, buyer/pharmacy chat and any advertising/sponsored result feature.
- Active multi-region failover, customer-managed encryption keys unless legal review requires them, and other scale/cost upgrades.

## Sequencing

1. Complete screen/design, API/data and state-machine specifications together; these determine the code interfaces.
2. Complete Firebase/GCP blueprint and test strategy; these determine safe build and environment setup.
3. Create the first narrow Claude task brief for a synthetic-data-only foundation, after the previous items are approved.
4. Complete legal/pharmacy approval and operating documents before enabling real prescriptions.

The approved code sequence is recorded in [implementation sequencing](implementation-sequencing.md). Claude creates a requirements-driven UI design proposal for approval before implementing any visual flow.

The first required UI proposal scope is fixed in the [initial Claude design-review brief](initial-claude-design-review-brief.md).

The public-notice requirements, in-app pilot agreement, pharmacy onboarding/training pack and public-support presence are drafted. They remain pending Fiji legal/pharmacy review, a legally valid non-personal public operator identity/contact, approved retention periods, translated final copy and pilot-pharmacy walkthrough.

## Documentation change rule

If implementation reveals a missing decision, create a decision-change request. The documentation agent resolves it, updates the relevant source documents and records an ADR before Claude changes the affected behaviour.
