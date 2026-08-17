# Cloudflare infrastructure and release blueprint

## Environments

| Environment | Hosting | Data | Authority |
| --- | --- | --- | --- |
| Local | Vite and Worker test harness | Fixtures only | Developer, no secrets |
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
