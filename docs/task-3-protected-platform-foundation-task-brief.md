# Claude task brief: Task 3 protected-platform foundation

## Task

- **Title:** Task 3: synthetic protected-platform foundation
- **Goal:** Implement the smallest synthetic-environment platform boundary that proves the approved API trust chain, server-derived authorization context, safe errors, rate-limit/audit seams, isolated delivery and recoverable infrastructure.
- **Tracking issue:** [#10](https://github.com/Dev-SohailAli/MediFind/issues/10)
- **Approval state:** Founder-approved Claude handoff (2026-08-16). This brief authorizes preparation of a separate synthetic-environment implementation PR; it does not authorize production resources, credentials or deployment.

## Sources of authority

Read before changing code:

- [Task 3 protected-platform foundation specification](task-3-protected-platform-foundation-specification.md)
- [Implementation sequencing](implementation-sequencing.md)
- [Architecture](architecture.md)
- [Free-first production architecture](free-first-production-architecture.md)
- [Web/PWA free-first options](web-free-first-options.md)
- [Backend and upload pipeline](backend-and-upload-pipeline.md)
- [API and data contracts](api-and-data-contracts.md)
- [API error contract](api-error-contract.md)
- [API mutation and concurrency policy](api-mutation-and-concurrency-policy.md)
- [Security architecture and threat model](security-architecture-threat-model.md)
- [Security, privacy and compliance](security-privacy-compliance.md)
- [Test and acceptance strategy](test-and-acceptance-strategy.md)
- [Repository security and delivery](repository-security-and-delivery.md)
- [Monorepo and toolchain policy](monorepo-and-toolchain-policy.md)
- [Claude Code handoff protocol](claude-code-handoff.md)

If these conflict, stop and submit a decision-change request.

## Authority and release boundary

- Data classification: synthetic-only.
- Cloud authority: only the founder-approved isolated synthetic environment named in the final brief; no production project or credential.
- Production or public-release authority: none.
- Real buyer, pharmacy, medicine, prescription, contact, SMS or payment data: prohibited.
- Long-lived service-account keys, committed secrets, direct client database access and unauthenticated Cloud Run: prohibited.

## In scope after approval

1. Add the minimal API/application boundary named in the approved contract, keeping provider verification and authorization behind narrow adapters.
2. Add the synthetic-environment configuration and emulator/test fixtures without embedding credentials or environment URLs in source.
3. Implement API Gateway-to-private-API trust verification, Firebase JWT/App Check validation, server-derived authorization context and safe error mapping for the approved foundation routes only.
4. Add persistent rate-limit and idempotency seams with deterministic synthetic tests; do not use one-instance memory as the security decision.
5. Add redacted audit-event seams and prove prohibited values never enter event payloads or logs.
6. Add reviewed OpenTofu/provider configuration and OIDC/WIF workflow changes only for the approved synthetic environment, with plan evidence and founder-approved apply gates.
7. Add isolated scheduler/maintenance contracts for the approved bounded reconciliation and signature-update boundaries; production schedules remain disabled/manual.
8. Add positive and negative tests for every identity, App Check, IAM, authorization, branch/resource, rate-limit, idempotency and environment boundary.

## Explicitly out of scope

- Production deployment or production credentials/data.
- Public buyer account activation, live Fiji SMS, real pharmacy/listing data, prescription upload/scanning, reservation, pharmacy operations, notifications or analytics.
- Broad Firestore/Cloud Storage client access, generic record patching, client-supplied roles, trusted gateway headers, direct Cloud Run access or service-account JSON keys.
- Unapproved endpoint additions, speculative domain schemas, cloud vendor substitution, a second auth/notification provider, custom domains, Cloud Armor or a paid service unless separately approved.
- Public repository visibility changes, branch-protection changes or account administration from the implementation PR.

## Interface and data contract

- Use the approved `/v1` namespace and the exact foundation route/contract selected before implementation; do not invent business routes in code.
- All responses use the stable error code/message-key/request-reference contract. Never return provider/database/stack detail.
- All mutations use explicit commands, current-state/version checks and the approved idempotency policy.
- Contracts contain validation bounds, optionality, data classification, authorization relationship and compatibility/migration rules; no loose JSON bag or `any` escape hatch.
- Synthetic fixtures are fictional and contain no real or realistic personal, pharmacy, medicine, prescription, coordinate, contact or credential value.

## Required verification

Run and report raw results for:

```text
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm security:secrets
pnpm security:trivy
pnpm run audit
```

Also run the approved emulator/integration suite, OpenTofu formatting/validation/plan, OIDC subject tests, API authorization tests, rate-limit concurrency tests and redaction/security evidence. Hosted Quality CI must pass. Do not claim a cloud/device/production check that was not run.

## Stop and ask conditions

- A required project ID, region, billing owner, service account, domain, secret reference, retention value or legal/privacy decision is missing.
- A change requires public visibility, a new processor, a new cost, a permission, a real credential, real data or a production resource not explicitly named in the approved brief.
- A provider limitation prevents the documented trust chain or safe rollback.
- A test reveals authorization, privacy, audit, cost-circuit-breaker or environment-isolation weakness.

## Delivery evidence

The PR must include changed files/interfaces, environment and fixture statement, architecture/trust-chain diagram or equivalent prose, all test/scan/plan results, security/privacy/cost impact, secret-handling statement, rollback/recovery path, documentation/ADR changes, residual risks and a clear statement that no production capability was activated.
