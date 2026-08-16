# Public-source visibility review

## Status

This is a conditional IP/security review for the GitHub Free alternative in [repository security and delivery](repository-security-and-delivery.md). It does not itself change repository visibility. Public visibility must be confirmed explicitly by the founder after reviewing the exposure described here.

## Requested decision

GitHub reports that enforced branch protection for this private repository requires GitHub Pro or public visibility. The founder has confirmed that GitHub Pro is not available and has selected the public-source route in principle. The remaining action is an explicit confirmation to change this repository from private to public after this review is accepted.

## Scope reviewed

- Current tracked source, documentation, workflows and full reachable Git history.
- Synthetic mobile fixtures and test fixtures.
- Pull-request/issue workflow and the current Task 2/Task 3 planning records.
- GitHub Actions workflow permissions, action pinning and security-scan configuration.

## Evidence

- Full-history Gitleaks scan on 32 commits: no leaks found.
- Current tracked-source credential-pattern review: no private key, GitHub token, provider key, email address or phone number was found. Matches were documentation/test words such as `password`, `secret` and `api key`, not secret values.
- Task 2 boundary tests and the merged PR evidence prohibit real or realistic buyer, pharmacy, medicine, prescription, contact, coordinate, credential and network data.
- The repository’s CI workflow uses read-only contents/pull-request permissions and full-commit-SHA-pinned third-party actions. Hosted Quality CI passed for the merged Task 2 PR.
- No Firebase/GCP project, deployment environment, cloud credential, signing credential or production export is present in the repository.

## Public exposure that remains

Making the repository public would expose the complete Git history, documentation, architecture/security policies, synthetic fixtures, workflows, issues, pull requests and contributor/account attribution. The documents include operational design and security-boundary detail; they do not contain credentials, real data or production configuration according to the evidence above.

The founder must also review issue and pull-request conversations separately because GitHub discussions are not covered by a source-tree secret scan. Do not place credentials, device tokens, EAS tokens, Apple signing material, cloud identifiers that are intended to be secret, or private support/legal correspondence in those records.

## Required actions before visibility change

1. Confirm the founder accepts public exposure of the complete Git history, documentation, issues and pull requests.
2. Set the GitHub default branch to `main`; it is currently `agent/free-first-documentation-baseline`.
3. Confirm the Task 3 documentation PR is reviewed and no private operational material was added after this scan.
4. Keep all credentials and signing material in founder-controlled keychains/provider secret managers; never commit them before or after visibility change.
5. After public visibility is enabled, verify pull-request workflow, required hosted checks, Dependabot and security-scan alerting again. Public visibility is not a substitute for least-privilege Actions, environment approvals or independent security review.

## Decision boundary

This review supports a conditional public-source decision for the current synthetic/documentation repository. It does not approve production data, authentication activation, cloud deployment, prescription workflows, public buyer access or a release. Those remain separate legal, privacy, security, cost, operational and founder-approval gates.
