# Synthetic-code repository readiness record

## Scope and status

This record captures the repository controls verified before the first **synthetic-only** Claude implementation task. It does not certify readiness for cloud-connected, identity, pharmacy-admin, prescription, real-data, beta or production work; those later gates remain governed by the [repository security and delivery controls](repository-security-and-delivery.md) and [documentation roadmap](documentation-roadmap.md).

**Repository:** `SohailMoinAli/MediFind` (private)

**Verified:** 2026-08-16

**Operational owner:** founder-controlled `SohailMoinAli` account
**Current result:** conditionally ready to prepare the first synthetic-only task; its own pull request must implement and pass the required CI/security checks before merge.

## Verified GitHub state

| Control | Verified state | Limitation or follow-up |
| --- | --- | --- |
| Visibility | Private repository. | Do not change visibility automatically. Public-source visibility needs separate founder approval and IP/security review. |
| Direct collaborators | One direct collaborator: the founder-controlled owner account. | Re-check before adding any collaborator, bot or deploy identity. |
| Pull-request process | Draft PR workflow, linked issue template and PR evidence template are configured. | Procedural during the current private-plan phase; founder does not merge a change without required evidence. |
| Issue governance | Templates, labels, staged milestones and gated initial backlog are configured. | Documents/ADRs override issues; blocked issues never grant implementation authority. |
| Dependency updates | `dependabot.yml` provides weekly npm and GitHub Actions update configuration once it reaches `main`. Dependabot security updates are enabled in repository settings. | No auto-merge; review every update. |
| Vulnerability alerts | Enabled in repository settings. | Triage alerts through the documented vulnerability policy. |
| GitHub secret scanning/push protection | Not available on the current private repository/plan at verification time. | Gitleaks and Trivy remain required local/CI compensating controls. Re-check availability before cloud/sensitive work or a plan change. |
| GitHub Actions | No application workflow or secret exists yet. | First task creates only the approved synthetic-only, least-privilege workflow. Pin third-party actions by full commit SHA. |
| Cloud/deployment configuration | None created. | No Firebase/GCP account/project, secret, environment, deployment token or release authority is allowed in the synthetic phase. |

## Pre-task operational confirmations

The founder must retain MFA and recovery control for the GitHub owner account. GitHub's repository API does not expose a user MFA/recovery attestation, so this remains a founder-operated account-security check rather than an automated claim in this record.

The local workstation toolchain was verified on 2026-08-16: Node.js 24.19.0, pnpm 11.22.0, Java 17, EAS CLI, Android Studio/SDK/ADB, Gitleaks 8.30.1, Trivy 0.74.0, OpenTofu 1.12.5, Firebase CLI 15.27.0 and Google Cloud SDK 580.0.0. No Firebase/GCP/Expo account sign-in, project, credential or deployment configuration was performed. The first task's pull request must still create and run the required CI checks; local availability never permits a check to be assumed passing.

## Synthetic-foundation merge gate

Before the first implementation PR merges, all of the following must be true:

- [ ] The pull request links the `status:ready` first Claude task issue and all governing documents.
- [ ] Node/pnpm and project dependencies are exactly pinned with a committed lockfile.
- [ ] Required format, lint, strict type, test, build, Gitleaks, Trivy and audit checks pass with retained redacted evidence.
- [ ] GitHub Actions use least privilege and SHA-pinned third-party actions, with no cloud/deployment/real-data capability.
- [ ] No real/realistic domain data, secret, provider setting, network capability or product workflow entered the change.
- [ ] The founder reviews the PR evidence and approves the merge.

## Hard stop before later capability

Before any cloud-connected, identity, pharmacy-admin, prescription, real-data or production-capable code, complete the separate enforced-branch-protection/visibility, cloud-foundation, legal/privacy and security gates. The procedural synthetic-only baseline in this record is not a substitute.
