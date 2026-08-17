# Web-only documentation roadmap

## Completed direction reset

- Web/PWA is the only active product surface.
- Cloudflare Pages is the current static preview host.
- Cloudflare Workers, D1, R2 and KV are the documented first platform options.
- The former native prototype is archived outside the workspace.
- Firebase/GCP/API Gateway/Cloud Run plans are superseded by ADR-272.

## Required before the next Worker/data task

| Deliverable | Completion standard |
| --- | --- |
| Cloudflare architecture | [Cloudflare web architecture](cloudflare-web-architecture.md) and [architecture decision](architecture.md) are the active sources of truth |
| Web task brief | The brief names exact Worker files/routes, synthetic data boundary, tests and Cloudflare bindings; it contains no native/Firebase/GCP language |
| Cost plan | Free limits, alerting, failure behaviour and founder-controlled account ownership are recorded |
| Data contract | [Task 4 synthetic D1 data-contract proposal](task-4-synthetic-d1-data-contract-proposal.md) defines the exact search slice; it must be accepted before persistence code |
| Browser acceptance | Responsive, keyboard, screen-reader, offline, install and reduced-capability checks are recorded for the changed web flow |
| Repository controls | Main remains PR-only, checks are required, and no secret/deployment authority is committed |

## Required before a protected pilot

- Fiji legal/privacy review of Cloudflare products, region and processors.
- Authentication, MFA/recovery and account-enumeration design for the web app.
- D1/R2 backup, restore, deletion, export and incident procedures.
- Pharmacy verification, staff access, listing freshness and collection state
  contracts.
- Rate limits, audit events, safe errors, cost breakers and abuse controls.
- Accessibility and browser validation with pilot users.

## Deferred unless separately reopened

Native apps, store distribution, Firebase/GCP, payments, delivery, external
medicine catalogs, public reviews, embedded maps, chat and advertising.
