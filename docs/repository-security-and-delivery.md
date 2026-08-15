# Repository security and delivery controls

## Purpose

GitHub is a security boundary for MediFind source, infrastructure configuration and documentation. Use every available no-cost control immediately. GitHub Free currently does not enforce protected branches/rulesets or CodeQL scanning on a private repository, so this document separates synthetic-only procedural controls from the enforced gate required before cloud-connected or sensitive implementation.

## Required `main` protections

When the repository plan/visibility supports enforcement:

- Disallow direct pushes and force pushes to `main`.
- Require a pull request before merge. The founder is the required approver during the sole-proprietor pilot; Claude may open a pull request but cannot approve/merge it.
- Require passing automated checks appropriate to the change before merge: formatting, type/static checks, tests, secret scan, SAST/dependency scan and build when applicable.
- Require branches to be current with `main` before merge where GitHub settings support it.
- Restrict branch-protection changes, repository administration, Actions workflow changes, environments, deployment secrets and release creation to the founder-controlled account unless explicitly delegated.
- Block unresolved review conversations and prohibit bypassing required checks except for a documented emergency, with an incident/ADR record and immediate follow-up remediation.

While the sole-proprietor private repository remains on GitHub Free and work is documentation or synthetic-only:

- Claude and the founder use task branches and pull requests; Claude never pushes implementation directly to `main` or merges its own work.
- Run the full required checks on pull requests even though GitHub cannot enforce them as required checks.
- Never configure production credentials, deployments or real data in this procedural-only phase.
- Before cloud-connected, identity, storage, prescription, pharmacy-admin or production-capable implementation begins, upgrade the private repository to a plan with branch enforcement or explicitly approve public-source visibility after an intellectual-property/security review. Repository visibility is never changed automatically for cost reasons.

## Dependency management

- Enable weekly automated dependency-update pull requests for application, backend, infrastructure and GitHub Actions dependencies after code exists.
- Dependency PRs never auto-merge. A reviewer checks release notes, security impact, lockfile changes, compatibility, tests/build results and any mobile native impact before merge.
- Critical/high vulnerabilities follow the documented 24-hour/seven-day response target. If an update cannot be safely merged in time, use the kill switch/minimum-version control where relevant and document the mitigation.

## Secret protection

- Enable GitHub secret scanning and push protection wherever the current private-repository plan supports them. Independently run pinned Gitleaks and Trivy secret scans in CI so the control does not depend on a paid GitHub security product.
- Enable Dependabot alerts/security updates or equivalent dependency-vulnerability alerts.
- Never store secrets in Git, GitHub Actions variables, examples, fixtures, screenshots, issues or pull-request descriptions. Use reference names only; production secrets remain in the approved provider secret manager.
- Treat a detected or suspected secret exposure as an incident: revoke/rotate it promptly, assess access/logs, document containment and avoid merely deleting the committing line as remediation.

## No-cost private-repository security stack

- GitHub dependency graph, Dependabot alerts/security updates and reviewed weekly version-update PRs.
- Pinned Gitleaks secret/history scan.
- Pinned Trivy dependency, filesystem, container, infrastructure and SBOM scan plus package-manager audit.
- OWASP ZAP and MobSF/applicable OWASP mobile tooling against synthetic environments/builds as those artefacts exist.
- GitHub Actions Ubuntu runner with least job permissions, concurrency cancellation, dependency caching and short artifact retention to stay within the current 2,000-minute/500-MB allowance.

Do not configure private CodeQL as a required free control: GitHub currently requires paid Code Security capability for private repositories. Reassess it when the repository plan changes. Free tools do not replace the independent pre-prescription assessment.

## Pull-request evidence

Every implementation PR links the approved Claude task brief and states changed behaviour/interfaces, automated/manual results, security/privacy impact, dependency changes, documentation-change requests and residual risks. Synthetic data only is allowed. A release/deployment remains a separate explicit approval after merge.

## Pre-synthetic-code verification checklist

- [ ] Current GitHub plan/visibility capability recorded; PR-only workflow tested with a harmless branch.
- [ ] Founder account has MFA and recovery documented; no unintended repository administrators.
- [ ] Available GitHub secret controls enabled; Gitleaks/Trivy CI result and alert routing verified.
- [ ] Dependency alerts and weekly PR schedule configured for when manifests/workflows exist.
- [ ] Actions permissions follow least privilege and no unreviewed third-party action can access production credentials.
- [ ] `CLAUDE.md`, handoff protocol and task-template rules are visible in the default branch.

## Pre-cloud/sensitive-code enforcement checklist

- [ ] Private plan with enforced branch protection is active, or public-source visibility was separately reviewed/approved.
- [ ] Direct/force push and deletion are blocked; pull request and passing checks are required and tested.
- [ ] Security Actions are pinned to full commit SHAs and run without production credentials.
- [ ] Deployment environments require founder approval and use short-lived workload identity, not stored cloud keys.
