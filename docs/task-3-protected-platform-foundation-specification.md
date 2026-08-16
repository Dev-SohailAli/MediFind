# Task 3: protected-platform foundation specification

## Status and authority

This is the documentation deliverable for [issue #10](https://github.com/Dev-SohailAli/MediFind/issues/10). It converts the accepted architecture into an implementation boundary for a **synthetic environment only**. It does not create a Firebase/GCP project, change repository visibility, configure a credential, apply infrastructure, deploy a service or activate production data.

The following remain required before implementation begins:

- founder approval of the repository-control path and the exact founder-owned environment inputs;
- documentation-owner acceptance of this specification and its linked ADR/decision changes;
- a task-specific implementation PR from a new branch with all required checks; and
- separate legal, privacy, security, cost, operational and release approvals before any production capability is enabled.

If this specification conflicts with an accepted policy, Claude stops and raises a decision-change request. It must not choose a broader or less secure interpretation.

## Objective

Create the smallest protected platform foundation that can prove the MediFind trust chain with synthetic identities and data:

`browser/PWA client -> API Gateway -> IAM-private API -> private data/services`

The foundation must prove authentication, App Check, server-side authorization context, safe API errors, rate-limit decisions, audit boundaries, isolated environments, least-privilege delivery and recoverable infrastructure. It must not yet implement pharmacy operations, prescription handling, real buyer accounts, live Fiji SMS or a production release.

## Environment and ownership contract

| Environment | Data | Credentials | Allowed purpose |
| --- | --- | --- | --- |
| Local | Fixtures and emulator data only | Developer-local emulator credentials; never committed | Unit, contract and integration tests without a cloud dependency |
| Synthetic development | Non-sensitive synthetic data only | Founder-controlled, environment-scoped identities/secrets | Manual API/web integration and security exercises |
| Synthetic CI | Ephemeral fixtures/emulators where practical | GitHub OIDC only if a hosted synthetic check genuinely needs a cloud service | Reproducible checks and disposable integration evidence |
| Production | Not enabled by Task 3 | Separate founder-approved deployment identity | Explicit future release gate only |

The approved service region is `australia-southeast1` where the selected service supports it. The implementation must record the current service-region limitation and any cross-border transfer or subprocesser review before data is placed there. Project IDs, billing-account references, service-account emails, custom domains and secret names are **founder inputs**, not values Claude may invent or commit.

Required founder inputs before infrastructure bootstrap:

1. repository-control decision: GitHub Pro branch enforcement or separately approved public-source visibility after IP/security review;
2. exact synthetic Firebase/GCP project ID and billing-account owner;
3. founder-owned operational owner, recovery path and escalation contacts held outside Git;
4. approved synthetic API hostname/domain choice, if a domain is needed; and
5. explicit confirmation that no production project, credential, real data or live SMS is in scope.

## Protected request path

The only public business-API edge is API Gateway. The intended request path is:

1. The client sends HTTPS with the API version and, for repeatable mutations, an idempotency key. The client never receives a service identity or database credential.
2. API Gateway validates the Firebase JWT issuer, audience, signature and expiry for protected routes. Invalid or missing identity is rejected before Cloud Run invocation.
3. API Gateway invokes Cloud Run using its dedicated least-privilege service identity. Cloud Run is not unauthenticated and is not directly reachable as a business endpoint.
4. The API verifies Firebase App Check independently, validates the allow-listed request schema and size, derives actor/role/branch context server-side and applies authorization, rate limits, concurrency rules and audit requirements.
5. The API reads and writes private data services through server-only identities. Web/PWA code never reads Firestore, Cloud Storage, Secret Manager or an internal queue directly.

Gateway identity and App Check are trust controls, not substitutes for application authorization. A spoofed gateway header, direct Cloud Run request, missing App Check token or stale/invalid user token must fail closed.

## Identity and authorization boundary

Task 3 must define adapters rather than scatter provider calls through route handlers:

- `IdentityVerifier`: validates the provider token and returns only the minimum verified subject/claims needed by the server.
- `AppCheckVerifier`: returns an explicit verified/unverified result and provider reference suitable for safe audit metadata.
- `AuthorizationContext`: contains server-derived actor, role, branch and environment scope; clients cannot supply or override it.
- `Authorizer`: checks the named command/resource relationship and returns a safe denial code without leaking record existence.
- `AuditWriter`: accepts allow-listed event names and redacted opaque references only.

No client role switcher, trusted role claim, direct Firestore rule, generic record patch, service-account JSON key or reusable token is permitted. Privileged roles require the separate MFA and recovery policies already accepted in the repository.

## API and error contract

The implementation brief must select only a minimal foundation route set from the approved [v1 endpoint inventory](v1-api-endpoint-inventory.md). It must not add a business workflow merely to demonstrate connectivity.

Every response follows [the API error contract](api-error-contract.md): stable machine code, local message key, request/correlation reference and safe details only. Responses must not contain stack traces, provider exceptions, SQL/Firestore paths, raw tokens, phone/email values, prescription references or authorization clues that enable enumeration.

All externally repeatable mutations use explicit commands, current-state/version checks and the 24-hour idempotency rules in [the mutation and concurrency policy](api-mutation-and-concurrency-policy.md). Unknown fields, oversized bodies, unsupported API versions and malformed headers fail closed.

## Rate limits, cost controls and circuit breakers

Per-actor/action/window limits are persistent server-side records keyed by pseudonymous subjects. They must:

- survive multiple Cloud Run instances and cold starts;
- avoid a single global hot document;
- expire predictably and fail safely when the counter store is unavailable;
- return the generic `RATE_LIMITED` contract without exposing thresholds; and
- keep raw IP data out of ordinary logs and records unless separately approved and privacy-minimised.

Gateway/provider quotas, Cloud Run maximum instances/concurrency/timeouts, scheduler bounds and the documented 50/80/100% cost circuit breakers are separate controls. Billing alerts do not cap spend. A breaker may pause costly non-essential actions but must not silently disable security, recovery, backup or integrity controls.

## Data, search and maintenance boundaries

Task 3 may use synthetic records only. It must not accept real buyer, pharmacy, medicine, prescription or contact data. The future public-search projection contains only the minimum approved public fields, never a buyer query/location, exact private stock, prescription content or private branch record.

The platform specification reserves these isolated maintenance boundaries:

- one 15-minute Sydney scheduler invocation for bounded stale-listing, expiry, retention, deletion and orphan-recovery reconciliation;
- one six-hour Sydney scheduler invocation for a bounded ClamAV signature updater;
- a writer-only updater identity for the private signature mirror and reader-only scanner identities; and
- fail-closed scanning when verified definitions exceed the approved 24-hour age.

Non-production schedules remain paused/manual unless a synthetic test explicitly needs them. No prescription upload or scanning workflow is implemented by Task 3.

## Infrastructure and delivery boundary

OpenTofu is the source of truth for supported GCP resources. Firebase/App Check configuration that cannot be represented safely in OpenTofu must use reviewed provider configuration files or documented manual steps with no secret values in the repository.

The remote state boundary is a dedicated private, versioned Sydney GCS bucket with uniform access, least privilege, no public access and documented recovery/export. State is sensitive: it is never committed, printed in CI logs or copied to a developer machine as an unreviewed artifact.

GitHub Actions uses repository/environment-restricted OIDC and Google Workload Identity Federation. It never stores a long-lived service-account JSON key. Separate identities are required for plan, synthetic apply and any future production apply. Production apply requires founder approval and is not part of this task.

Before cloud-connected implementation, the repository must have either enforced `main` protection or an explicitly approved public-source path. The selected path must block direct/force pushes and deletion, require pull requests and passing checks, restrict deployment environments to founder approval and retain full-SHA-pinned Actions.

## Required security and acceptance evidence

The future implementation PR must prove, with synthetic fixtures and emulator/test environments where possible:

- invalid JWT issuer/audience/signature/expiry rejection;
- missing, invalid and replay/expiry-sensitive App Check rejection;
- direct/unauthenticated Cloud Run and spoofed gateway-context rejection;
- cross-role, cross-branch and cross-resource authorization denial;
- generic anti-enumeration errors and absence of sensitive values in logs;
- persistent rate-limit behaviour across instances/concurrency and safe store failure;
- idempotency, version conflict and malformed-request handling;
- scheduler OIDC scope, bounded cursor/resume and safe duplicate-run behaviour;
- ClamAV updater writer/scanner reader separation and stale-definition fail-closed behaviour;
- OpenTofu plan without secrets, state access recovery and rejection of untrusted OIDC subjects; and
- no stored service-account key, real data, production credential or unapproved external processor.

Required commands remain the repository quality suite, plus the task-specific emulator/integration, infrastructure validation and security evidence named in the approved implementation brief. No device, hosted cloud or production result may be claimed unless it was actually run.

## Decisions still requiring explicit record

This document intentionally does not invent values that must be founder-owned or globally unique. Before implementation, record:

- the repository public-source/IP review outcome and default-branch correction;
- project IDs, billing account, service accounts and operational owners;
- exact API Gateway JWT issuer/audience configuration;
- synthetic environment secret references and rotation owners;
- backup/restore and retention values where the accepted policy leaves a legal decision open; and
- current provider prices, quotas, Fiji service availability and cross-border/privacy review evidence.

If any choice changes accepted product, legal, privacy, security, architecture or cost policy, create and approve a decision-change request before code.

## Completion boundary

Task 3 documentation is ready for implementation only when the founder/documentation owner approves this specification, the separate Claude brief, the repository-control path and every listed founder input. Completion does not authorize production deployment, real-data collection, real authentication, live SMS, prescription activation or a public product release.
