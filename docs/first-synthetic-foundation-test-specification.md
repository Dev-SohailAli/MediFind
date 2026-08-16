# First synthetic-foundation test specification

## Purpose and authority

This specification converts the founder-approved test decisions for **task 1: Foundation only** into an executable verification contract. It applies only to the zero-route, zero-domain-data, no-network boundary in the [first synthetic-foundation API/data specification](first-synthetic-foundation-api-data-specification.md).

It authorises neither application implementation nor cloud configuration by itself. The first Claude implementation brief must incorporate this specification, the approved foundation API/data specification and the repository-readiness result before any code starts.

## Task-1 quality objective

Task 1 proves that a clean checkout can reproduce a TypeScript pnpm workspace, a minimal local-only mobile shell, an empty API package boundary and shared non-secret configuration. It does **not** prove a buyer, pharmacy, medicine, account, API, workflow, cloud service or release behaviour.

The quality system must therefore verify four things only:

1. declared local tooling is reproducible and version-pinned;
2. packages build/type-check without server, provider or network behaviour;
3. package/dependency boundaries do not accidentally introduce prohibited capability; and
4. source, configuration and CI are free of known secrets and obvious dependency/filesystem risk.

## Approved tool choices and pinning rules

| Concern | Approved choice | Task-1 rule |
| --- | --- | --- |
| Runtime | Node.js 24 LTS | The task brief records the exact installed 24.x release in a repository version file; local Windows and GitHub Actions use that same release. |
| Package manager | pnpm 11.22.0 through Corepack | Set the exact `packageManager` value; commit `pnpm-lock.yaml`; CI installs with a frozen/immutable lockfile. |
| Language | TypeScript, strict mode | Use `strict: true`; do not introduce `any`, unchecked JSON bags or a relaxed project-wide compiler exception. |
| Formatting | Prettier | Project-local dependency and `format`/`format:check` scripts; CI uses check mode only. |
| Static analysis | ESLint | Project-local dependency and `lint` script; CI uses zero warnings as the threshold. |
| Unit tests | Vitest | Project-local dependency and non-watch `test` script. It starts as a tool/configuration and safe-boundary test runner, then expands for domain/API work. |
| Secret scanning | Gitleaks | Run locally where available and in CI using a pinned full-commit-SHA action/container/tool version. |
| Dependency/filesystem scanning | Trivy plus pnpm audit | Run locally where available and in CI using a pinned full-commit-SHA action/container/tool version. |
| CI runtime | GitHub Actions Ubuntu runner | No cloud credential, deployment identity, app secret, real data or production configuration is available to the workflow. |

The task brief resolves and pins exact compatible package versions in `package.json` and the lockfile. It must not use global project tooling, floating `latest` dependencies or an unreviewed version range that changes CI behaviour without a lockfile update. Expo/React Native versions must be selected together from their then-current compatibility guidance; the task may not substitute Expo Go for the approved Expo Prebuild/CNG direction.

## Required scripts and expected outcomes

The first task creates these root scripts or documented exact equivalents. Each has a non-interactive CI form and a clear non-zero failure result.

| Command | Required result | Task-1 boundary |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | Reproduces exactly the committed dependency graph. | No secret/environment bootstrap or cloud access. |
| `pnpm format:check` | All tracked source/config/docs checked by the selected formatter are formatted. | No automatic file write in CI. |
| `pnpm lint` | Lint completes with zero warnings. | Enforces dependency/package boundaries where a static rule can do so. |
| `pnpm typecheck` | Every workspace package type-checks with no emitted build output. | No weakening of strict TypeScript policy. |
| `pnpm test` | Vitest finishes non-interactively and reports raw result. | Tests use only anonymous, non-domain values and make no network request. |
| `pnpm build` | Mobile shell and API/package build boundaries complete locally. | Does not create a release artefact, sign an app, start a public listener or invoke a provider. |
| `pnpm security:secrets` | Gitleaks finds no reportable secret in the checked scope/history defined by the task brief. | Output redacts candidate secret values. |
| `pnpm security:trivy` | Trivy finds no unapproved critical/high issue in the selected dependency/filesystem scope. | Reports are redacted/minimal and contain no secret value. |
| `pnpm audit` | Package-manager audit runs and findings are triaged under the vulnerability policy. | A failure/exception needs an issue and founder-approved recorded rationale. |

The exact arguments, package filters and report locations are pinned in the task brief. Claude must run the commands it reports; it must never represent an unrun command as passing.

## Minimal test content

Task 1 is not permitted to introduce product fixtures or fake flows just to satisfy a test count. Instead, its small test suite may verify only:

- workspace/package configuration is loadable by the selected toolchain;
- the API package exposes no listener, business route or provider initialisation;
- the mobile shell uses only its permitted static local-development label and does not request permissions or make network calls; and
- prohibited imports/configuration (Firebase, cloud SDKs, database/storage clients, analytics, secrets and domain fixtures) are absent from task-1 package boundaries.

Tests use anonymous non-domain strings only. They may not contain a medicine name, Fiji location, person/contact, pharmacy, role, prescription, inventory, price, reservation state, realistic document or a representation of any future workflow.

No task-1 coverage threshold applies because it contains no domain, security-sensitive or API business logic. The existing 90% branch-coverage floor applies immediately when a later task introduces security-sensitive/domain/API code. A coverage report may be produced only if it carries no misleading product-quality claim and includes no sensitive/source-derived data beyond ordinary test metadata.

## CI workflow contract

The task-1 workflow runs on pull requests and task branches. It must use least-privilege read-only default permissions, explicit dependency caching only where safe, concurrency cancellation for superseded runs and short-lived/minimal artifacts. It does not run a deployment, publish a package, create a release, access a Firebase/GCP project, call an external business API or accept repository/cloud secrets.

CI order is:

1. check out the exact pull-request revision using a full-commit-SHA-pinned action;
2. install the pinned Node/pnpm toolchain and frozen lockfile;
3. run formatting, lint, type, test and build checks;
4. run Gitleaks, Trivy and package-manager audit; and
5. expose only redacted summary evidence needed for the pull request.

A job failure fails the workflow. No `continue-on-error`, warning-only conversion, skip flag or unreviewed alternate command is allowed for a required check. A temporarily unavailable scanner/tool creates or updates a `status:blocked` issue; it does not silently weaken the baseline.

Before a workflow/action is added, the task brief must pin every third-party GitHub Action by full commit SHA, identify its publisher/purpose and ensure it receives no credential other than the ephemeral read-only `GITHUB_TOKEN` needed for repository checkout/reporting.

## Data, privacy, security and cost controls

- No test uses real, realistic or re-identifiable buyer, pharmacy, staff, medicine, inventory, prescription, document, location, contact or health data.
- No `.env` file, API key, access token, service-account key, App Check debug token, phone number, sender domain, cloud/project identifier or provider endpoint enters source, fixtures, screenshots, issues, logs or CI artifacts.
- Tests must make no runtime network request. Dependency installation and approved security tool/update retrieval are development-tool operations only; they do not justify an application network capability.
- Scanner/test output must not print credentials, full source copies, private paths outside the repository or unredacted suspected-secret values.
- No test result, artifact, cache or summary may become a substitute telemetry, user analytics or production operational record.
- CI has a zero intended vendor-runtime cost for task 1. Any billing, build-service, device farm, cloud project or external runtime implication requires a decision request.

## Pull-request evidence

The task-1 pull request uses the repository pull-request template and links its `status:ready` implementation issue. It includes:

- the exact command list and pass/fail result;
- tool/runtime versions used;
- the resulting lockfile/package-boundary change summary;
- redacted Gitleaks, Trivy and audit outcome;
- a statement that no cloud project, credential, real data, network capability, user workflow or release artefact was added; and
- any failed/blocked check, risk acceptance or documentation change request.

The founder reviews and merges after required evidence is present. Claude may open/update the pull request but cannot merge it.

## Failure and exception rules

| Condition | Required action |
| --- | --- |
| Formatting/lint/type/test/build failure | Fix within the approved issue scope, add the safe regression/configuration test where applicable, then rerun the full affected command set. |
| Secret scanner finding | Stop, avoid copying the value into an issue/PR, treat as a suspected exposure, follow the repository security policy and rotate/revoke if genuine. |
| Critical/high vulnerability | Open/update a security issue, identify whether the dependency is used, patch/remove/mitigate within policy, and obtain documented approval for any temporary exception. |
| Missing compatible dependency/tool or incompatible Expo toolchain | Stop and open a decision request; do not swap frameworks, lower versions or use a global workaround silently. |
| Need for a network call, fixture, route, account, provider, cloud setting or domain UI | Stop and request a new scoped task/contract. It is outside task 1. |
| CI/scanner unavailable | Mark the relevant issue blocked and preserve the limitation in the pull request; do not merge on an assumed pass. |

## Task-1 acceptance checklist

- [ ] Node 24 LTS and pnpm 11.22.0 are pinned/reproducible with a committed lockfile.
- [ ] Strict TypeScript, Prettier, ESLint and Vitest are project-local and have non-interactive root commands.
- [ ] Required format, lint, type, test, build, Gitleaks, Trivy and audit checks are defined with failure semantics.
- [ ] Tests/configuration prove the task-1 package boundary and no-network/no-provider/no-domain-data limits without inventing product fixtures.
- [ ] CI is pull-request/task-branch scoped, least-privilege, SHA-pinned and has no cloud/deployment/real-data capability.
- [ ] Pull-request evidence and failure/exception handling are explicit.
- [ ] The specification adds no authority for code, production, beta, real data, cloud resources or feature work beyond the later founder-approved task brief.
