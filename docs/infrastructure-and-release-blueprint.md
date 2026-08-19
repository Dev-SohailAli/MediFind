# Cloudflare infrastructure and release blueprint

## Environments

| Environment | Hosting | Data | Authority |
| --- | --- | --- | --- |
| Local | Vite and Wrangler local Worker | Invented fixtures and local-only synthetic D1 | Developer, no secrets |
| Synthetic preview | Cloudflare Pages; Worker/D1 only when explicitly enabled | Invented records only | Founder-owned Cloudflare account |
| Protected pilot | Separate Pages/Worker/D1/R2 environment | Only after legal/privacy/security gates | Founder-approved deployment |
| Production | Not active | Not authorised by current work | Separate release decision |

## Deployment rules

- Pages builds from the reviewed web commit and publishes `apps/web/dist`.
- Worker deployments use Wrangler from the reviewed Worker task and contain no
  account token or secret in GitHub source, artifacts or logs.
- Every environment has separate bindings and secrets. Preview cannot reach
  protected data.
- Main is PR-only. Required quality checks must pass before merge; deployment
  requires a separate founder-approved environment action.
- Rollback is a previous immutable Pages/Worker version plus a tested data
  migration rollback or forward-fix plan. Never roll back by deleting data.

## Required release evidence

Record the commit, environment, changed routes/bindings, migrations, test and
security results, accessibility/browser results, usage/cost forecast, rollback
path, owner and residual risks. Do not claim a Cloudflare deployment unless it
was actually performed and inspected.

## Current local evidence

The local synthetic path uses `apps/worker/wrangler.local.toml` and the
reviewed `0001_task4_synthetic_search.sql` migration. The local database was
verified with 7 medicine concepts, 4 pharmacy organisations, 4 branches, 8
listings, 7 public projections and 31 search terms; one excluded listing has
zero projection rows and `PRAGMA foreign_key_check` returns no rows.

## Hosted synthetic evidence

On 2026-08-17, the authenticated founder-owned account created the approved
synthetic D1 database `medifind-synthetic-search` with UUID
`cb372f8c-ce1d-4443-bc72-dec144bf4dfa`, primary location hint `OC` and read
replication disabled. The reviewed migration has not yet been applied and the
synthetic Worker has not yet been deployed because the short-lived OAuth device
approval was not completed in the available browser session. No Pages project,
production resource, secret or real data was created.
