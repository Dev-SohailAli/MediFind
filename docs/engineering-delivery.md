# Engineering delivery

## Technology direction

After documentation approval, build the responsive web application/PWA in TypeScript as the primary shared client. Use standards-based browser authentication, installability, accessible responsive UI and safe browser capability fallbacks. The existing React Native/Expo package is retained only as a future native-shell option; EAS, App Store and TestFlight work is not part of the current pilot path.

Build a TypeScript backend/API on Firebase/Google Cloud behind API Gateway, with Firebase Authentication, App Check where supported, IAM-private Cloud Run, private Firestore access through the API, encrypted Sydney object storage, generic web notifications and managed monitoring. Production services remain subject to the documented privacy, security, exportability and [free-first cost](free-first-production-architecture.md) gates. Use the pnpm TypeScript monorepo and independently deployable web/API boundaries in the [monorepo and toolchain policy](monorepo-and-toolchain-policy.md).

Declare supported cloud resources with OpenTofu and reviewed Firebase configuration files. CI/CD uses GitHub OIDC and Google Workload Identity Federation with environment-specific least-privilege identities; never create a long-lived deployment key. Production plans/applies require founder review/approval, and sensitive remote state remains in the private versioned Sydney bucket.

## Source control and change control

`main` is the protected, deployable branch. Every material product or implementation change updates the relevant Markdown document and decision log. Future code work uses short-lived branches and reviewable pull requests. Secrets, real prescription data, production exports and credentials must never be committed to Git. Configure and verify the concrete GitHub controls in the [repository-security checklist](repository-security-and-delivery.md) before implementation begins.

## Required quality gates

Every change must run automated formatting, type/static checks, unit tests, secret scanning, SAST, dependency/vulnerability checks and a web build appropriate to its scope before merge. Begin with no-cost pinned tools: Dependabot/dependency graph, Gitleaks, Trivy/package audit and ZAP for the synthetic API/web surface. Generate an SBOM for each release and retain reports briefly enough to stay within GitHub Free artifact limits. Add integration, accessibility, end-to-end, API authorization/DAST and browser testing as each capability is implemented. Test all supported language variants for layout, fallback strings, safe consent wording and notification/error-state rendering. Production deployment is a deliberate, manually approved action after all required checks pass; no automatic push to production is permitted. Automated dependency updates run weekly but never auto-merge.

Critical/high security findings block production release. Maintain at least 90% branch coverage for security-sensitive/domain API code and explicit positive/negative tests for every role, authorization boundary and state transition. Before accepting real prescriptions, complete an independent, scoped web/API security assessment against applicable OWASP ASVS and browser security controls; fix high-severity findings before activation.

Patch or safely mitigate critical vulnerabilities within 24 hours and high-severity vulnerabilities within seven days; review routine dependency updates monthly. Record ownership, mitigation, verification and closure for each security finding. If a safe patch cannot ship in time, use the documented kill switch or sensitive-feature minimum-version gate.

## Test-data rule

Use synthetic, non-sensitive fixtures in local development and staging. Test prescription flows with representative fake documents that contain no real person, pharmacy or medical information. Never use production data to reproduce a defect outside the approved production incident process.

## Pilot distribution

Distribute the first 2–3 pharmacy pilot through an invite-only HTTPS web/PWA environment. Test buyer, pharmacy and admin workflows in supported browsers before considering any store packaging. Do not present a web wrapper as a store-membership bypass. Founder-controlled domain/hosting access controls publishing, tester access and emergency withdrawal.

Use server-controlled, audited feature flags to expose new sensitive functionality first to founder/test accounts and then approved pilot cohorts. Each web beta release has staged rollout, documented validation and independent hosting/feature-flag/kill-switch rollback paths.
