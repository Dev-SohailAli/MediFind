# Task 46: Vendor, processor and contract renewal review

## Goal

Keep every approved external service, processor, domain, account and material
contract aligned with MediFind's web-only Cloudflare direction, privacy,
security, cost, recovery and operator obligations.

Prepared implementation plan: [Task 46 vendor, processor and contract renewal review](../../superpowers/plans/2026-08-18-task-46-vendor-processor-renewal-review-implementation.md).

## Gate

Requires Tasks 38, 39, 42, 43 and 45, the current founder-controlled account
register, named vendor/privacy/security/cost owners, current terms and region/
processor evidence, and a reauthentication plan for any external inspection.

## Read first

- [Architecture](../../architecture.md)
- [Cloudflare web architecture](../../cloudflare-web-architecture.md)
- [Cost and environment plan](../../cost-and-environment-plan.md)
- [Business and commercial model](../../business-and-commercial.md)
- [Stewardship roadmap](../../superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md)
- [Security and recovery assurance](task-42-recurring-security-recovery-assurance.md)
- [Annual public-readiness review](task-45-annual-public-readiness-review.md)

## Scope

- Maintain a founder-owned register of approved services/accounts, purpose,
  environment, data class, region/transfer role, processor/subprocessor,
  contract/terms source, billing owner, cost threshold, MFA/recovery owner,
  authorised users, renewal date and exit path.
- Recheck current official pricing/limits, privacy/security/backup/restore,
  support and termination terms before renewal or material use.
- Require fresh authentication before any external dashboard, CLI, billing,
  account, domain, deployment or provider inspection; never request or store
  passwords, tokens, OTPs or recovery codes in the repository.
- Define continue, restrict, replace, pause or exit recommendations when
  terms, region, processor, cost, recovery, security or ownership no longer
  satisfy accepted decisions.

## Out of scope

Creating accounts, accepting terms, enabling billing, rotating credentials,
deploying, changing DNS, adding a provider/binding, signing a contract,
exporting production data or treating a vendor's claim as legal approval.

## Acceptance

- Every in-scope service has an owner, review/renewal date, source evidence,
  approved purpose, data/cost/security boundary and tested exit owner.
- Missing or stale terms, region/processor review, cost evidence, recovery
  access or reauthentication blocks the affected external action.
- The register contains no secret, OTP, token, real sensitive record or raw
  private correspondence.
- The outcome is a recommendation and escalation list; it grants no account,
  provider, billing, deployment or production authority.

## Verification and handoff

Run document/link/structure checks and approved local register validation. Any
external review must stop for fresh reauthentication and founder approval at
the point of access. Commit:
`chore: review vendor processor and contract renewals`
