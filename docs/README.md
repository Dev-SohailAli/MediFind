# MediFind documentation index

| Document | Purpose |
| --- | --- |
| [Product brief](product-brief.md) | Outcome, audience, pilot scope, success measures, roadmap |
| [Requirements and journeys](requirements.md) | Behaviours, roles, user journeys, acceptance criteria |
| [Data and search](data-and-search.md) | Information model, visibility and normalization rules |
| [Experience and content](experience-and-content.md) | Mobile, accessibility, language and safety guidance |
| [Security, privacy and compliance](security-privacy-compliance.md) | Controls and Fiji validation checklist |
| [Security architecture and threat model](security-architecture-threat-model.md) | Technical controls, attack scenarios and security verification gates |
| [Architecture decision](architecture.md) | Target system boundaries and vendor-selection constraints |
| [Engineering delivery](engineering-delivery.md) | Stack direction, quality gates, testing and change-control rules |
| [Claude Code handoff](claude-code-handoff.md) | Agent authority, task readiness, review and escalation protocol |
| [Claude task template](claude-task-template.md) | Required brief format for each implementation task |
| [Claude Code setup](claude-code-setup.md) | Superpowers installation, telemetry setting and MediFind precedence rules |
| [Claude Design agent brief](claude-design-agent-brief.md) | Claude-facing visual system, product/safety design contract and copyable kickoff prompt |
| [Claude design proposal protocol](claude-design-proposal-protocol.md) | Requirements-driven UI proposal and approval rule for Claude |
| [Design-review acceptance checklist](design-review-acceptance-checklist.md) | Founder review gate and bounded handoff from approved design to a coding task |
| [Initial Claude design-review brief](initial-claude-design-review-brief.md) | Required whole-MVP low-fidelity design proposal scope before UI code |
| [Design proposal workspace](design-proposals/README.md) | Location and required structure for Claude Design review artefacts |
| [Implementation sequencing](implementation-sequencing.md) | Synthetic-data-first task order and later security/legal gates |
| [Documentation roadmap](documentation-roadmap.md) | Remaining pre-code documentation deliverables and sequence |
| [Design system and screens](design-system-and-screens.md) | Visual direction, onboarding, role navigation and screen inventory |
| [API and data contracts](api-and-data-contracts.md) | REST boundary, resource/state contracts and server-only data rules |
| [First synthetic-foundation API/data specification](first-synthetic-foundation-api-data-specification.md) | Exact zero-route/zero-data boundary for the first monorepo and application-shell task |
| [API mutation and concurrency](api-mutation-and-concurrency-policy.md) | Explicit commands, idempotency and version-conflict rules |
| [API error contract](api-error-contract.md) | Safe machine codes, local translation keys, correlation IDs and anti-enumeration rules |
| [V1 API endpoint inventory](v1-api-endpoint-inventory.md) | Approved REST route/action map for task-level schema design |
| [Notification and status synchronisation](notification-and-status-synchronisation.md) | Generic push, authorised refresh and no-persistent-realtime update model |
| [Data dictionary and ownership](data-dictionary-and-ownership.md) | Logical records, minimum fields, privacy classification and mutation ownership |
| [Infrastructure and release blueprint](infrastructure-and-release-blueprint.md) | Reproducible Firebase/GCP configuration, flags and staged beta rollout |
| [Test and acceptance strategy](test-and-acceptance-strategy.md) | Synthetic test environments, security coverage and beta release evidence |
| [Pilot operations](pilot-operations.md) | Onboarding, support, analytics, risk and release readiness |
| [Business and commercial model](business-and-commercial.md) | Ownership, pilot pricing and future subscription direction |
| [Cost and environment plan](cost-and-environment-plan.md) | Pilot cost ceiling, Firebase/GCP setup and production-data gates |
| [Free-first production architecture](free-first-production-architecture.md) | Approved no-cost services, unavoidable costs, secure API edge and scale-in-place triggers |
| [Cost circuit breaker](cost-circuit-breaker-policy.md) | Budget alert, costly-action pause and founder-only re-enable controls |
| [Public notice and legal identity](public-notice-and-legal-identity.md) | Public-notice requirements and pre-pilot legal identity gate |
| [Free pilot pharmacy agreement](pilot-pharmacy-agreement.md) | Required pilot terms and pharmacy activation checklist |
| [Pharmacy onboarding and training](pharmacy-onboarding-and-training.md) | Activation sequence, staff training and go-live checklist |
| [Public support presence](public-support-presence.md) | Minimal legal, status, support and security-reporting website policy |
| [Mobile permissions policy](mobile-permissions-policy.md) | Just-in-time minimum permission, fallback and store-disclosure rules |
| [Accessibility policy](accessibility-policy.md) | WCAG target, inclusive mobile requirements and assistive-technology release tests |
| [Audit-log policy](audit-log-policy.md) | Append-only event fields, visibility restrictions and sensitive-data exclusions |
| [Performance and reliability targets](performance-and-reliability-targets.md) | Pilot latency, result-size, listing-propagation and measurement targets |
| [Phone verification policy](phone-verification-policy.md) | Fiji number normalisation, OTP lifecycle, fallback and beta validation rules |
| [Branch location and hours](branch-location-and-hours-policy.md) | Fiji address, directions, hours and business-time calculation contract |
| [Dynamic pharmacy content](dynamic-pharmacy-content-policy.md) | Translated system templates and safe pharmacy-authored note controls |
| [Price integrity](price-integrity-policy.md) | Exact-pack FJD price, versioning, audit and reservation-price protection |
| [Pharmacy verification policy](pharmacy-verification-policy.md) | Evidence expiry, renewal reminders, suspension and material-change controls |
| [Staff access lifecycle](staff-access-lifecycle-policy.md) | Invitation expiry, owner continuity and reviewer-dependent prescription controls |
| [Backend and upload pipeline](backend-and-upload-pipeline.md) | Cloud Run/Fastify boundary, App Check trust chain and private prescription scanning flow |
| [Prescription scanning workflow](prescription-scanning-workflow-policy.md) | Private asynchronous quarantine, worker access and fail-closed scan outcome controls |
| [Account-recovery runbook](account-recovery-runbook.md) | Secure buyer, staff, owner and admin recovery procedures |
| [Incident response runbook](incident-response-runbook.md) | Critical security/privacy containment, notification and corrective-review procedure |
| [Repository security and delivery](repository-security-and-delivery.md) | Required GitHub protection, dependency and secret-management controls |
| [Monorepo and toolchain policy](monorepo-and-toolchain-policy.md) | pnpm workspace layout, dependency boundaries and reproducible setup rules |
| [GitHub work-management policy](github-work-management.md) | Documentation-governed issues, milestones, labels and Claude task workflow |
| [Decision log](decisions.md) | Decisions that govern future implementation |

## Change policy

Before implementation, approve this documentation baseline with product, pharmacy and legal stakeholders. Any material product or implementation change must update the affected document and add an entry to the decision log in the same change.
