# Task 6: Add Pages preview release guards

## Goal

Prevent a synthetic Pages preview from accidentally enabling Worker mode,
shipping secrets, losing PWA shell assets, or weakening the static security
headers and no-index posture.

## Authority and exact scope

Read `docs/cloudflare-web-architecture.md`,
`docs/web-app-and-pwa-direction.md`, `docs/infrastructure-and-release-blueprint.md`,
`docs/repository-security-and-delivery.md`, and the current Pages preview tests.

Allowed files:

- `apps/web/__tests__/pages-preview.test.ts`.
- `apps/web/src/__tests__/pwa-manifest.test.ts` or a focused new test.
- Add `apps/web/scripts/verify-preview-build.mjs`.
- Modify `apps/web/package.json` and the root quality workflow only to run the
  guard after the normal web build.
- Modify `apps/web/public/_headers`, `robots.txt`, or manifest assets only if
  a failing test proves the existing preview contract is incomplete.

## Required guard

Add a command that verifies a production-style web build was created with
`VITE_MEDIFIND_SEARCH_MODE` unset and then checks:

- `dist/index.html` exists and references the built shell.
- `dist/manifest.webmanifest`, service-worker output, icons and required
  static assets exist.
- `_headers` and `robots.txt` preserve the synthetic preview policy.
- No `.env`, credential-looking file, D1 ID in browser config, or direct D1/R2/KV
  reference is emitted as a runtime binding.
- No Pages Function, API proxy, analytics, cookie or client-side persistence
  capability has been added.

The guard must not falsely reject the bundled, unused Worker adapter code; it
must prove the default mode is not enabled and the generated shell does not
make a Worker request on initial load.

## Acceptance

- The default `pnpm --filter @medifind/web build` followed by the guard passes.
- A build with `VITE_MEDIFIND_SEARCH_MODE=worker` is clearly identified as an
  explicit development/synthetic integration build and is not accepted as the
  default Pages preview artifact.
- Missing manifest, service worker, headers, robots policy or shell asset fails
  the command with a named reason.
- The guard does not deploy Pages or contact Cloudflare.

Commit: `test: guard synthetic pages preview artifacts`

For the exact artifact checks, default/Worker-mode negative tests and CI
handoff, use the [Task 6 implementation plan](../superpowers/plans/2026-08-18-task-6-pages-preview-guard-implementation.md).
