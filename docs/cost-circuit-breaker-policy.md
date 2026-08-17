# Cost circuit-breaker policy

## Scope

This policy applies to Cloudflare Pages, Workers, D1, R2, KV, queues and any
future approved provider. It does not create a billing account or enable a
production binding.

## Controls

- Measure Worker requests/CPU, D1 rows/storage, R2 operations/storage and
  third-party services separately.
- Configure warning and ceiling alerts before protected usage.
- At the ceiling, pause new costly or sensitive mutations and show truthful,
  generic maintenance status while preserving safe search and existing-record
  integrity.
- Never delete records, disable authorization, remove backups or weaken
  security controls to reduce spend.
- Only the founder-controlled, freshly authenticated and audited path may
  change the ceiling or re-enable a paused feature.

## Testing

Exercise warning, pause, restore, quota-exceeded, provider-unavailable and
duplicate-event behaviour with synthetic data. Record propagation delay,
remaining safe functionality, rollback path and owner before enabling a
protected environment.
