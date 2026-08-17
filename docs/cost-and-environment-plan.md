# Cost and environment plan

## Goal

Keep the early web product as close to zero cost as practical without making
security, privacy, recovery or data export dependent on an unreviewed free
tier. Cloudflare is the default platform for the static preview and future
Worker/data evaluation.

## Environment plan

- Local development uses fixtures and a Worker test harness only.
- The public Pages preview is static, synthetic-only and contains no secrets,
  accounts, cookies, analytics or protected data.
- A synthetic Worker/D1 environment is separate from preview and contains only
  invented records.
- Any protected pilot gets separate Cloudflare projects/bindings/secrets,
  explicit founder ownership, usage alerts and a recovery contact.

## Cost controls

- Track Pages builds, Worker requests/CPU, D1 rows/storage, R2 storage/ops,
  queues and any third-party auth/notification cost.
- Set a founder-approved monthly ceiling before enabling a protected binding.
- Use request/body/concurrency limits and application breakers; provider free
  limits are not spend caps.
- At the ceiling, pause new costly or sensitive mutations and preserve safe
  discovery and existing-record integrity.
- Never remove backups, authorization, audit logs or recovery controls to save
  money.
- Review current official Cloudflare pricing and limits before each environment
  change and at least quarterly.

## Paid exceptions

Paid usage may be approved only when it solves a documented requirement that
the free path cannot safely meet. The approval must record the service, region,
expected monthly cost, owner, alert threshold, rollback/disable path and
migration/export plan.

## Production gate

No real buyer, pharmacy, reservation or prescription data is enabled until
Fiji legal/privacy review, provider/region review, authentication and recovery,
backup/restore, file scanning, security assessment, pilot operations and cost
breaker rehearsal are all complete.
