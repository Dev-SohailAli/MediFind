# MediFind documentation index

## Current implementation authority

The active product is the responsive web/PWA in `apps/web`. Platform work is
governed by the Cloudflare Worker foundation brief and specification; the
Task 2 web/PWA brief remains the feature-specific synthetic buyer-search
contract. The former native/mobile records are historical or explicit
prohibitions only and never authorize new work.

| Document | Purpose |
| --- | --- |
| [Product brief](product-brief.md) | Outcome, audience, pilot scope, success measures, roadmap |
| [Requirements and journeys](requirements.md) | Behaviours, roles, user journeys, acceptance criteria |
| [Data and search](data-and-search.md) | Information model, visibility and normalization rules |
| [Experience and content](experience-and-content.md) | Responsive web/PWA, accessibility, language and safety guidance |
| [Security, privacy and compliance](security-privacy-compliance.md) | Controls and Fiji validation checklist |
| [Security architecture and threat model](security-architecture-threat-model.md) | Technical controls, attack scenarios and security verification gates |
| [Architecture decision](architecture.md) | Web-only target system boundaries and vendor-selection constraints |
| [Cloudflare web architecture](cloudflare-web-architecture.md) | Web-only runtime, Cloudflare service map, free-first rules and data gates |
| [Engineering delivery](engineering-delivery.md) | Stack direction, quality gates, testing and change-control rules |
| [Claude Code handoff](claude-code-handoff.md) | Agent authority, task readiness, review and escalation protocol |
| [Claude task template](claude-task-template.md) | Required brief format for each implementation task |
| [Coding-agent development roadmap](superpowers/plans/2026-08-18-coding-agent-development-roadmap.md) | Sequenced synthetic development queue, parallel lanes and Claude handoff process |
| [Synthetic queue dispatch plan](superpowers/plans/2026-08-18-synthetic-queue-current-state-and-dispatch.md) | Evidence-backed current baseline, remaining gaps and safe coding-agent dispatch order |
| [Claude handoff ledger](superpowers/plans/2026-08-18-claude-handoff-ledger.md) | Cross-chat status, task states, next handoffs, gates and evidence update protocol |
| [Claude Batch A execution prompt](superpowers/plans/2026-08-18-claude-batch-a-execution-prompt.md) | Bounded first coding batch for Tasks 2, 4, 5 and 6 |
| [Claude Task 3 follow-up prompt](superpowers/plans/2026-08-18-claude-task-3-follow-up-prompt.md) | Bounded post-Task-2 listing-detail handoff |
| [Claude Task 1 supervised Cloudflare prompt](superpowers/plans/2026-08-18-claude-task-1-supervised-cloudflare-prompt.md) | Separate reauthenticated remote verification handoff |
| [Claude coding task queue](claude-tasks/README.md) | Six self-contained, reviewable briefs ready for coding-agent execution |
| [Protected-pilot development roadmap](superpowers/plans/2026-08-18-protected-pilot-development-roadmap.md) | Gated future sequence for identity, pharmacy operations, reservations, notifications and later capabilities |
| [Future protected-pilot task queue](claude-tasks/future/README.md) | Tasks 7–15 with explicit approval gates and dependency order |
| [Task 7 protected-pilot gate implementation plan](superpowers/plans/2026-08-18-task-7-protected-pilot-gate-implementation.md) | Documentation-only evidence packet, fail-closed gate IDs and protected-task handoff |
| [Task 8 identity/session/recovery implementation plan](superpowers/plans/2026-08-18-task-8-identity-session-recovery-implementation.md) | Provider-neutral Worker identity boundary, revocation, recovery hold and accessible web states |
| [Task 9 pharmacy verification/staff-access implementation plan](superpowers/plans/2026-08-18-task-9-pharmacy-verification-staff-access-implementation.md) | Approved metadata, branch-scoped roles, invitation lifecycle and owner/reviewer continuity |
| [Task 10 listing lifecycle/price-integrity implementation plan](superpowers/plans/2026-08-18-task-10-listing-lifecycle-price-integrity-implementation.md) | Pharmacy-owned commands, exact-pack FJD pricing, concurrency and deterministic public projection |
| [Task 11 buyer OTC reservation implementation plan](superpowers/plans/2026-08-18-task-11-buyer-otc-reservations-implementation.md) | Protected OTC state machine, Fiji-time expiry, immutable price and generic status signals |
| [Task 12 status-refresh/notification implementation plan](superpowers/plans/2026-08-18-task-12-status-refresh-notifications-implementation.md) | Worker-authoritative reads, generic signals, refresh-race safety and in-app fallback |
| [Task 13 prescription quarantine/scanning gate plan](superpowers/plans/2026-08-18-task-13-prescription-quarantine-scanning-gate-implementation.md) | High-risk R2/scanner evidence, synthetic rehearsal and fail-closed conditional handoff |
| [Task 14 support/report/admin-audit implementation plan](superpowers/plans/2026-08-18-task-14-support-reports-admin-audit-implementation.md) | Structured reports/cases, scoped moderation, redacted audit and break-glass controls |
| [Task 15 public support/legal/status implementation plan](superpowers/plans/2026-08-18-task-15-public-support-presence-implementation.md) | Static-only public presence, approved content/publisher gate and capability verification |
| [Task 16 pharmacy onboarding/activation implementation plan](superpowers/plans/2026-08-18-task-16-pharmacy-onboarding-activation-implementation.md) | Server-owned Suva invite-only activation readiness, training evidence, capability gating and synthetic lifecycle rehearsal |
| [Task 17 hours/freshness/reconciliation implementation plan](superpowers/plans/2026-08-18-task-17-hours-freshness-reconciliation-implementation.md) | Fiji business hours, stale listing enforcement, bounded maintenance and reservation expiry validation |
| [Task 18 backup/restore/deletion implementation plan](superpowers/plans/2026-08-18-task-18-backup-restore-deletion-implementation.md) | Isolated synthetic export/restore rehearsal, integrity checks, revocation and retention-aware deletion |
| [Task 19 cost breakers/feature switches implementation plan](superpowers/plans/2026-08-18-task-19-cost-breakers-kill-switches-implementation.md) | Privacy-minimised usage thresholds, independent pauses, safe search degradation and audited re-enable |
| [Task 20 incident exercises/operational privacy implementation plan](superpowers/plans/2026-08-18-task-20-incident-exercises-operational-privacy-implementation.md) | Synthetic critical containment drills, redacted evidence, generic status and fail-closed prescription gate |
| [Task 21 performance/accessibility/beta implementation plan](superpowers/plans/2026-08-18-task-21-performance-accessibility-beta-implementation.md) | Fiji browser/network performance targets, accessibility/language evidence and invite-only beta decision |
| [Task 22 staged release/rollback implementation plan](superpowers/plans/2026-08-18-task-22-staged-release-rollback-implementation.md) | Founder-approved environment preflight, tiny Suva cohort, synthetic rollback and release evidence |
| [Pilot operations and release roadmap](superpowers/plans/2026-08-18-pilot-operations-release-roadmap.md) | Operational readiness, recovery, cost breakers, incident exercises, beta evidence and staged release |
| [Pilot operations task queue](claude-tasks/operations/README.md) | Tasks 16–22 for onboarding, reliability and release after protected workflows pass |
| [Post-pilot growth roadmap](superpowers/plans/2026-08-18-post-pilot-growth-roadmap.md) | Gated catalog, content, expansion, evidence, scale, commercial and governance horizon after the pilot |
| [Post-pilot task queue](claude-tasks/post-pilot/README.md) | Tasks 23–29 for measured growth after staged release evidence |
| [Task 23 catalog/search-quality implementation plan](superpowers/plans/2026-08-18-task-23-catalog-curation-search-quality-implementation.md) | Synthetic reviewed canonical identity/alias curation, exact-product safety and deterministic search evidence |
| [Task 24 multilingual content/note governance implementation plan](superpowers/plans/2026-08-18-task-24-multilingual-system-content-implementation.md) | Reviewed three-language system states, safe fallback, attributed notes and sanitization/accessibility controls |
| [Task 25 Fiji branch expansion implementation plan](superpowers/plans/2026-08-18-task-25-fiji-branch-expansion-implementation.md) | Gated synthetic locality scope, verification/hours/freshness checks, privacy-safe directions and rollback |
| [Task 26 product evidence/metrics implementation plan](superpowers/plans/2026-08-18-task-26-product-evidence-metrics-implementation.md) | Aggregate privacy-minimised metrics, uncertainty-aware views, redaction and human decision gates |
| [Task 27 scale/migration readiness implementation plan](superpowers/plans/2026-08-18-task-27-scale-migration-readiness-implementation.md) | Measured triggers, provider-neutral adapters, synthetic migration rehearsal and safe degradation |
| [Task 28 commercial readiness decision implementation plan](superpowers/plans/2026-08-18-task-28-commercial-readiness-decision-implementation.md) | Documentation-only free/paid/stop decision packet with legal, cost, support and commercial invariants |
| [Task 29 repository/supply-chain governance implementation plan](superpowers/plans/2026-08-18-task-29-repository-supply-chain-governance-implementation.md) | PR-only source controls, pinned dependencies/actions, fresh-clone verification and audited emergency access |
| [Task 30 national Fiji cohort governance implementation plan](superpowers/plans/2026-08-18-task-30-national-fiji-cohort-governance-implementation.md) | Synthetic multi-locality evidence, cohort gates, support/cost controls and no-code-only activation decision |
| [Task 31 pharmacy integration evaluation implementation plan](superpowers/plans/2026-08-18-task-31-pharmacy-integration-evaluation-implementation.md) | Synthetic adapter evaluation, pharmacy-owned authority, conflict/revocation tests and no-live-connection boundary |
| [Task 32 communication fallback evaluation implementation plan](superpowers/plans/2026-08-18-task-32-communication-fallback-evaluation-implementation.md) | Generic status truth, synthetic delivery failures, redaction and no-provider decision boundary |
| [Task 33 catalog source/barcode decision implementation plan](superpowers/plans/2026-08-18-task-33-catalog-source-barcode-decision-implementation.md) | Synthetic provenance/conflict evaluation, exact-product safeguards and no-scan/no-external-catalog boundary |
| [Task 34 government information decision implementation plan](superpowers/plans/2026-08-18-task-34-government-information-decision-implementation.md) | Static-vs-authenticated boundary, source freshness, translation/accessibility and no-eligibility decision controls |
| [Task 35 paid-plan implementation gate plan](superpowers/plans/2026-08-18-task-35-paid-plan-implementation-gate-implementation.md) | Documentation-only paid-plan prerequisites, synthetic entitlements, commercial isolation and no-charge rehearsal |
| [Task 36 independent assurance/public readiness implementation plan](superpowers/plans/2026-08-18-task-36-independent-assurance-public-readiness-implementation.md) | Evidence-strength matrix, critical-gap remediation, redacted review scope and no-certification/public-readiness boundary |
| [Task 37 continuity/ownership/service-exit implementation plan](superpowers/plans/2026-08-18-task-37-continuity-ownership-service-exit-implementation.md) | Owner/access matrix, synthetic pause/recovery/exit rehearsal and no-transfer/no-secret boundary |
| [Task 38 operator/legal identity implementation plan](superpowers/plans/2026-08-18-task-38-operator-legal-identity-implementation.md) | Redacted operator decision matrix, notice/agreement dependencies and fail-closed legal readiness gates |
| [Task 39 privacy rights/retention governance implementation plan](superpowers/plans/2026-08-18-task-39-privacy-rights-retention-governance-implementation.md) | Approved data map, scoped rights lifecycle, retention/backup propagation and synthetic deletion evidence |
| [Task 40 public support/status/disclosure implementation plan](superpowers/plans/2026-08-18-task-40-public-support-status-disclosure-implementation.md) | Static publishing gate, safe outage/disclosure operations, restrictions and multilingual accessibility evidence |
| [Task 41 accessibility/localization implementation plan](superpowers/plans/2026-08-18-task-41-accessibility-localization-maintenance-implementation.md) | Recurring language, assistive technology, responsive-state and release-blocker evidence |
| [Task 42 security/recovery assurance implementation plan](superpowers/plans/2026-08-18-task-42-recurring-security-recovery-assurance-implementation.md) | Recurring synthetic incident, restore, authorization, cost and corrective-action evidence |
| [Task 43 ADR/source governance implementation plan](superpowers/plans/2026-08-18-task-43-adr-source-governance-implementation.md) | Source-of-truth hierarchy, task readiness, supersession and conflict-audit controls |
| [Task 44 support/contributor capacity implementation plan](superpowers/plans/2026-08-18-task-44-support-contributor-capacity-implementation.md) | Safe support coverage, training, least privilege, revocation and capacity thresholds |
| [Task 45 annual/public-readiness implementation plan](superpowers/plans/2026-08-18-task-45-annual-public-readiness-review-implementation.md) | Recurring evidence matrix, hard stops and founder/release-owner decision packet |
| [Task 46 vendor/processor renewal implementation plan](superpowers/plans/2026-08-18-task-46-vendor-processor-renewal-review-implementation.md) | Redacted service register, renewal gates, fresh-authentication boundary and exit evidence |
| [Task 47 consumer safety/marketplace-integrity implementation plan](superpowers/plans/2026-08-18-task-47-consumer-safety-marketplace-integrity-review-implementation.md) | Recurring claim, pharmacy-note, identity, language and safe-state review |
| [Task 48 pharmacy-professional oversight implementation plan](superpowers/plans/2026-08-18-task-48-pharmacy-professional-oversight-review-implementation.md) | Protected-workflow ownership, verification expiry, training, revocation and escalation evidence |
| [Task 49 dependent-user safeguards implementation plan](superpowers/plans/2026-08-18-task-49-dependent-user-safeguards-review-implementation.md) | Adult-for-child/dependent data minimization, authority, routing and safe-state review |
| [Scale-options and public-growth roadmap](superpowers/plans/2026-08-18-scale-options-and-public-growth-roadmap.md) | Gated national rollout, integrations, communication, catalog, government-information, commercial, assurance and continuity horizon |
| [Scale-options task queue](claude-tasks/scale-options/README.md) | Tasks 30–37 for optional capabilities and larger-cohort readiness |
| [Governance and stewardship roadmap](superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md) | Recurring legal, privacy, public-support, accessibility, assurance, policy and human-operations controls |
| [Stewardship task queue](claude-tasks/stewardship/README.md) | Tasks 38–49 for long-term governance and service stewardship |
| [Claude Code setup](claude-code-setup.md) | Superpowers installation, telemetry setting and MediFind precedence rules |
| [Claude Design agent brief](claude-design-agent-brief.md) | Claude-facing visual system, product/safety design contract and copyable kickoff prompt |
| [Claude design proposal protocol](claude-design-proposal-protocol.md) | Requirements-driven UI proposal and approval rule for Claude |
| [Design-review acceptance checklist](design-review-acceptance-checklist.md) | Founder review gate and bounded handoff from approved design to a coding task |
| [Initial Claude design-review brief](initial-claude-design-review-brief.md) | Required whole-MVP low-fidelity design proposal scope before UI code |
| [Design proposal workspace](design-proposals/README.md) | Location and required structure for Claude Design review artefacts |
| [Task 2 buyer-search design addendum](design-proposals/2026-08-16-task-2-synthetic-buyer-search.md) | Corrective, founder-approved visual-task addendum and process record for Task 2 |
| [Implementation sequencing](implementation-sequencing.md) | Synthetic-data-first task order and later security/legal gates |
| [Documentation roadmap](documentation-roadmap.md) | Remaining pre-code documentation deliverables and sequence |
| [Design system and screens](design-system-and-screens.md) | Visual direction, onboarding, role navigation and screen inventory |
| [API and data contracts](api-and-data-contracts.md) | REST boundary, resource/state contracts and server-only data rules |
| [First synthetic-foundation API/data specification](first-synthetic-foundation-api-data-specification.md) | Exact zero-route/zero-data boundary for the first monorepo and application-shell task |
| [First synthetic-foundation test specification](first-synthetic-foundation-test-specification.md) | Exact local/CI verification and synthetic-data boundary for the first task |
| [Task 2 synthetic buyer-search specification](task-2-synthetic-buyer-search-specification.md) | Exact synthetic-only fixture, search, UI, safety and test contract for buyer-search prototype work |
| [Task 2 Claude implementation brief](task-2-synthetic-buyer-search-task-brief.md) | Executable Claude task scope, exclusions, acceptance evidence and delivery rules for Task 2 |
| [Task 2 public-contract implementation plan](superpowers/plans/2026-08-18-task-2-public-contract-validation-implementation.md) | TDD file map and exact implementation/review steps for the next synthetic contract task |
| [Task 3 listing-detail implementation plan](superpowers/plans/2026-08-18-task-3-worker-listing-detail-implementation.md) | Dependent Worker-detail state, modal accessibility, stale-response and fixture-mode plan |
| [Task 4 browser/PWA implementation plan](superpowers/plans/2026-08-18-task-4-browser-pwa-acceptance-implementation.md) | Automated/manual accessibility, responsive, offline, install and static-preview acceptance plan |
| [Task 5 verification implementation plan](superpowers/plans/2026-08-18-task-5-synthetic-verification-implementation.md) | Local-only Wrangler/D1 verification, export checksum and fail-closed CLI plan |
| [Task 6 Pages-guard implementation plan](superpowers/plans/2026-08-18-task-6-pages-preview-guard-implementation.md) | Static preview artifact, PWA shell, no-index and default-mode release guard plan |
| [Task 2 web/PWA Claude implementation brief](task-2-web-pwa-buyer-search-task-brief.md) | Current executable synthetic web/PWA buyer-search scope |
| [Task 3 protected-platform foundation specification](task-3-protected-platform-foundation-specification.md) | Synthetic cloud, identity, API, CI, cost and repository-control boundary; implementation remains input-gated |
| [Task 3 Claude implementation brief](task-3-protected-platform-foundation-task-brief.md) | Founder-approved synthetic-environment platform handoff; no production authority |
| [Task 4 synthetic D1 data contract](task-4-synthetic-d1-data-contract-proposal.md) | Accepted exact synthetic search schema, fixtures, field privacy, authorization owner, export and migration shape; implementation still requires the approved Task 4 brief |
| [API mutation and concurrency](api-mutation-and-concurrency-policy.md) | Explicit commands, idempotency and version-conflict rules |
| [API error contract](api-error-contract.md) | Safe machine codes, local translation keys, correlation IDs and anti-enumeration rules |
| [V1 API endpoint inventory](v1-api-endpoint-inventory.md) | Approved REST route/action map for task-level schema design |
| [Notification and status synchronisation](notification-and-status-synchronisation.md) | Generic push, authorised refresh and no-persistent-realtime update model |
| [Data dictionary and ownership](data-dictionary-and-ownership.md) | Logical records, minimum fields, privacy classification and mutation ownership |
| [Infrastructure and release blueprint](infrastructure-and-release-blueprint.md) | Reproducible Cloudflare configuration, flags and staged web rollout |
| [Test and acceptance strategy](test-and-acceptance-strategy.md) | Synthetic test environments, security coverage and beta release evidence |
| [Pilot operations](pilot-operations.md) | Onboarding, support, analytics, risk and release readiness |
| [Business and commercial model](business-and-commercial.md) | Ownership, pilot pricing and future subscription direction |
| [Cost and environment plan](cost-and-environment-plan.md) | Pilot cost ceiling, Cloudflare account separation and production-data gates |
| [Free-first production architecture](free-first-production-architecture.md) | Approved Cloudflare-first services, unavoidable costs and scale-in-place triggers |
| [Web/PWA free-first options](web-free-first-options.md) | Cloudflare Pages/Workers/D1/R2/KV choices for synthetic previews and future evaluation |
| [Cost circuit breaker](cost-circuit-breaker-policy.md) | Budget alert, costly-action pause and founder-only re-enable controls |
| [Public notice and legal identity](public-notice-and-legal-identity.md) | Public-notice requirements and pre-pilot legal identity gate |
| [Free pilot pharmacy agreement](pilot-pharmacy-agreement.md) | Required pilot terms and pharmacy activation checklist |
| [Pharmacy onboarding and training](pharmacy-onboarding-and-training.md) | Activation sequence, staff training and go-live checklist |
| [Public support presence](public-support-presence.md) | Minimal legal, status, support and security-reporting website policy |
| [Web platform capabilities policy](web-platform-capabilities-policy.md) | Just-in-time browser capability, fallback and installability rules |
| [Accessibility policy](accessibility-policy.md) | WCAG target, responsive web requirements and assistive-technology release tests |
| [Audit-log policy](audit-log-policy.md) | Append-only event fields, visibility restrictions and sensitive-data exclusions |
| [Performance and reliability targets](performance-and-reliability-targets.md) | Pilot latency, result-size, listing-propagation and measurement targets |
| [Phone verification policy](phone-verification-policy.md) | Fiji number normalisation, OTP lifecycle, fallback and beta validation rules |
| [Branch location and hours](branch-location-and-hours-policy.md) | Fiji address, directions, hours and business-time calculation contract |
| [Dynamic pharmacy content](dynamic-pharmacy-content-policy.md) | Translated system templates and safe pharmacy-authored note controls |
| [Price integrity](price-integrity-policy.md) | Exact-pack FJD price, versioning, audit and reservation-price protection |
| [Pharmacy verification policy](pharmacy-verification-policy.md) | Evidence expiry, renewal reminders, suspension and material-change controls |
| [Staff access lifecycle](staff-access-lifecycle-policy.md) | Invitation expiry, owner continuity and reviewer-dependent prescription controls |
| [Worker and upload pipeline](worker-and-upload-pipeline.md) | Cloudflare Worker boundary and deferred private upload/scanning flow |
| [Prescription scanning workflow](prescription-scanning-workflow-policy.md) | Private asynchronous quarantine, worker access and fail-closed scan outcome controls |
| [Account-recovery runbook](account-recovery-runbook.md) | Secure buyer, staff, owner and admin recovery procedures |
| [Incident response runbook](incident-response-runbook.md) | Critical security/privacy containment, notification and corrective-review procedure |
| [Repository security and delivery](repository-security-and-delivery.md) | Required GitHub protection, dependency and secret-management controls |
| [Synthetic-code repository readiness record](repository-readiness-record.md) | Verified private-repository controls, limits and first-task merge gate |
| [Public-source visibility review](public-source-visibility-review.md) | Conditional IP/security review for the GitHub Free public-source alternative |
| [Web application and PWA direction](web-app-and-pwa-direction.md) | Current web-only product surface, PWA capabilities and Cloudflare distribution boundary |
| [Local synthetic development](local-synthetic-development.md) | Local Worker, Wrangler D1 and opt-in web integration commands |
| [Task 4 synthetic Cloudflare environment brief](task-4-synthetic-cloudflare-environment-brief.md) | Founder-approved isolated synthetic Worker/D1 provisioning boundary |
| [Monorepo and toolchain policy](monorepo-and-toolchain-policy.md) | pnpm workspace layout, web/Worker dependency boundaries and reproducible setup rules |
| [GitHub work-management policy](github-work-management.md) | Documentation-governed issues, milestones, labels and Claude task workflow |
| [Decision log](decisions.md) | Decisions that govern future implementation |

## Change policy

Before implementation, approve this documentation baseline with product, pharmacy and legal stakeholders. Any material product or implementation change must update the affected document and add an entry to the decision log in the same change.
