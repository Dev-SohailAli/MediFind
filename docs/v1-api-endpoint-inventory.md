# V1 Worker route inventory

This is a future route map, not permission to implement every route. Each task
selects a minimal subset and supplies exact request/response schemas,
authorization tests and migration evidence.

## Route rules

- All business routes pass through the Cloudflare Worker.
- Routes use opaque IDs, explicit commands, safe errors and version/idempotency
  controls for mutations.
- The browser never receives D1/R2/KV credentials or raw provider errors.
- No route is active in the current synthetic Pages preview.

## Planned groups

| Group | Examples | Status |
| --- | --- | --- |
| Health/config | `GET /v1/health`, safe public configuration | Foundation candidate |
| Search | `GET /v1/search`, `GET /v1/listings/{id}` | Synthetic D1 task candidate |
| Pharmacy operations | listing refresh, verification and branch actions | Later protected task |
| Buyer collection | request, approve/decline, cancel, collected | Later protected task |
| Prescription | upload/review/status | Disabled pending legal/security gates |
| Admin/support | verification, moderation, audit views | Later protected task |

Authentication and MFA are provider-neutral adapter concerns and must not be
invented inside a route task. No route may trust a browser role or expose
prescription content in logs, notifications or errors.
