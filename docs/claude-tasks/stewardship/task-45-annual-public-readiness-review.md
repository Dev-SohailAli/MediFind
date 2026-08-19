# Task 45: Annual and renewed public-readiness review

## Goal

Re-evaluate whether MediFind should continue, cap, pause or prepare for a
renewed public, paid or protected-data release after stewardship evidence has
been refreshed.

## Gate

Requires accepted or explicitly closed Tasks 38-44, current operator/legal and
privacy review, independent assurance outcome where required, current security
and recovery evidence, accessibility/language evidence, support-capacity
evidence and a founder/release-owner decision meeting. Missing owners or stale
evidence are stop conditions.

## Read first

- [Governance and stewardship roadmap](../../superpowers/plans/2026-08-18-governance-and-stewardship-roadmap.md)
- [Independent assurance and public readiness](../scale-options/task-36-independent-assurance-public-readiness.md)
- [Continuity, ownership and service exit](../scale-options/task-37-continuity-ownership-service-exit.md)
- [Operator/legal identity](task-38-operator-legal-identity.md)
- [Privacy rights and retention](task-39-privacy-rights-retention-governance.md)
- [Public support and disclosure](task-40-public-support-status-disclosure.md)
- [Accessibility and localization](task-41-accessibility-localization-maintenance.md)
- [Security and recovery assurance](task-42-recurring-security-recovery-assurance.md)
- [ADR/source governance](task-43-adr-source-governance.md)
- [Support and contributor capacity](task-44-support-contributor-capacity.md)

## Scope

- Assemble a dated evidence matrix covering legal/operator identity, privacy,
  security, recovery, accessibility, language, support, cost, continuity,
  source-of-truth and protected-data boundaries.
- Identify stale, missing, conflicting or independently unverified evidence;
  assign owners, remediation dates and capability impact.
- Reconfirm the current web-only Cloudflare direction, approved data scope,
  providers, regions, costs, retention, support boundaries and release surface.
- Produce a founder/release-owner recommendation: continue current scope, cap
  growth, pause a capability, prepare a separate decision request, or begin
  orderly exit.
- Record the next review date and triggers for an earlier review after a
  material incident, owner/provider change, legal advice, cost change, data
  expansion, accessibility regression or public claim.

## Out of scope

Declaring public readiness from a checklist alone, formal certification,
automatic cohort expansion, production deployment, new provider or binding,
contract signing, legal conclusions, public announcements, credential changes,
or changing an accepted ADR without its own approval.

## Acceptance

- Every required evidence area has an owner, review date, source, status,
  confidence/independence note and stop condition.
- The packet distinguishes local synthetic rehearsal, protected evidence and
  hosted/public evidence; it contains no real sensitive records or secrets.
- Critical unresolved legal, privacy, authorization, recovery, safety or
  capacity gaps block the affected capability until corrected and re-reviewed.
- The recommendation and residual risks are explicit, but no capability is
  activated by the packet itself.

## Verification and handoff

Run document/link/structure checks and only the approved local, synthetic or
independent reviews. Attach the evidence matrix, unresolved-risk register and
decision record. Commit:
`docs: prepare annual public-readiness review`
