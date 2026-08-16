# Monorepo and toolchain policy

## Repository shape

MediFind uses one TypeScript monorepo once implementation begins:

```text
apps/
  mobile/       # React Native/Expo client
  api/          # Fastify service deployed to Cloud Run
packages/
  contracts/    # Versioned API schemas, safe shared types and validation
  config/       # Non-secret shared lint/type/build configuration
```

Additional packages require an approved task/ADR and a clear ownership/deployment reason. Do not create a shared package merely to avoid a small duplication if it obscures a security boundary.

## Boundary rules

- `apps/mobile` consumes only published/approved API contracts and public build configuration. It contains no Firebase Admin SDK, backend service identity, database client, prescription-scanner credential or server secret.
- `apps/api` owns authorization, Firestore/Storage access, transactions, audit emission, notification dispatch and integration credentials. It is independently buildable/deployable to Cloud Run.
- `packages/contracts` contains versioned request/response schemas, safe enums/value objects and validation. It contains no server credential, admin-only model, direct database access or clinical/product decision logic that would trust the client.
- `packages/config` contains non-secret tooling configuration only. Secrets remain in the approved environment/secret manager and never enter package source, test fixtures or generated artifacts.
- Shared source must not make a mobile build accidentally depend on server-only libraries. Enforce dependency boundaries through workspace configuration, linting and CI checks.

## Reproducible toolchain

- Use pnpm workspaces and commit the lockfile. CI uses immutable/frozen lockfile installation and fails on an unexpected lockfile change.
- At the first approved bootstrap task, select the then-current Node.js Active LTS release, pin the exact version in repository/tooling configuration, document it in the task/ADR and use the same version in local development, CI and container builds.
- Enable Corepack or the equivalent approved package-manager version control, pin pnpm's exact supported version and avoid globally installed project dependencies.
- Pin/verify mobile, Expo/React Native, Firebase and infrastructure tool versions in lockfiles/configuration; upgrade through reviewed dependency PRs with required mobile/API test evidence.
- Local setup uses documented commands and synthetic environment configuration only. A fresh clone must reproduce format, type, test and build commands without copying developer-local files or secrets.

## Delivery rules

Mobile and API release artifacts/deployments remain independent. A compatible contract change may require coordinated release/feature-flag sequencing; it must be backward compatible or use an explicitly approved API version/migration plan. A shared-package change receives both mobile and API checks when it can affect either consumer.
