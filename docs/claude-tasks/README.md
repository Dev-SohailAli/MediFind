# Claude coding task queue

These briefs are the executable queue for the synthetic web/PWA phase. Each
brief is independently reviewable and names its exact write scope. Read the
brief before opening a coding-agent job; do not combine tasks that share an
interface unless the dependency table in the roadmap says to serialize them.

| Task | Brief | Dependency |
| --- | --- | --- |
| 1 | [Synthetic Cloudflare environment](task-1-synthetic-cloudflare-environment.md) | Fresh Cloudflare authentication; serial external work |
| 2 | [Shared public contract validation](task-2-public-contract-validation.md) | Current Task 4 Worker/D1 slice |
| 3 | [Worker-backed listing detail](task-3-worker-listing-detail.md) | Task 2 |
| 4 | [Browser and PWA acceptance](task-4-browser-pwa-acceptance.md) | Current UI; Task 3 for final detail states |
| 5 | [Synthetic verification tooling](task-5-synthetic-verification-tooling.md) | Current local Worker/D1 path |
| 6 | [Pages preview release guards](task-6-pages-preview-release-guards.md) | Current web/PWA build |

Every brief is synthetic-only. None authorizes a protected account, real data,
authentication provider, mutation, prescription, reservation, upload, paid
usage, or production release.

After this queue, use the [future protected-pilot queue](future/README.md).
Those briefs are intentionally gated by provider, legal, privacy, security,
recovery, pharmacy and cost decisions.

Use the [current-state dispatch plan](../superpowers/plans/2026-08-18-synthetic-queue-current-state-and-dispatch.md)
to launch the synthetic batch. It records the verified local baseline, the
remaining implementation gaps and the separate fresh-authentication gate for
Task 1.
