# Task 29: Repository and supply-chain governance

## Goal

Keep the web-only product reviewable and recoverable as collaborators,
dependencies, environments and deployment risk grow.

## Gate

Requires Task 22 release-owner review and confirmation of the repository’s
visibility decision, default branch, required checks and environment owners.
No task may add deployment authority merely to improve convenience.

## Read first

- [Repository security and web delivery](../../repository-security-and-delivery.md)
- [Public-source visibility review](../../public-source-visibility-review.md)
- [Monorepo and toolchain policy](../../monorepo-and-toolchain-policy.md)
- [Engineering delivery](../../engineering-delivery.md)
- [Claude code setup](../../claude-code-setup.md)

## Scope

- Audit branch protection/PR requirements, CODEOWNERS or equivalent review
  ownership, pinned Actions, dependency update policy and release evidence.
- Make quality, secret, dependency and filesystem/security checks reproducible
  from a fresh clone without local credentials.
- Document environment separation, least-privilege deployment roles, approval
  points, artifact retention, rollback and emergency access review.
- Add synthetic dependency/build-provenance checks where they can be run
  without introducing a new vendor or secret.
- Review issues, PR discussions and generated artifacts for prohibited private
  data before any public-source or collaborator expansion decision.

## Out of scope

Cloudflare account changes, production deployment, secret rotation, public
visibility change, a new CI vendor, real data, credentials in fixtures and
automated merge/deploy authority.

## Acceptance

- The default branch remains PR-only with required quality checks and no
  force/deletion path for ordinary contributors.
- Third-party actions and dependencies have an owner, update path and risk
  review; credentials remain outside source and logs.
- Fresh-clone verification and release evidence are documented and reproducible.
- Emergency access and rollback are named, time-limited, auditable and tested
  without weakening normal review.
- Any visibility, deployment or provider change is explicitly left to the
  founder/release owner.

## Verification and handoff

Run the repository quality suite, secret scan, dependency/security checks and
fresh-clone instructions where available. Record any tool that cannot run and
why; do not claim hosted or production evidence. Commit:
`chore: strengthen repository and supply-chain governance`

Implementation plan: [Task 29 repository and supply-chain governance plan](../../superpowers/plans/2026-08-18-task-29-repository-supply-chain-governance-implementation.md)
