# Task 3: Cloudflare Worker foundation specification

## Status and authority

This replaces the former protected-platform specification. It is the
documentation deliverable for the next platform task and authorises only a
synthetic Cloudflare environment after the separate task brief and repository
checks are approved. It does not authorise real accounts, health data,
prescription files, paid resources or a production release.

## Objective

Prove the smallest server boundary for the web app:

```text
browser/PWA -> Cloudflare Worker -> synthetic D1 (if enabled)
```

The foundation must demonstrate request validation, safe errors, server-owned
authorization context, persistent rate-limit seams, audit seams, environment
separation, quota failure handling and redaction. The browser must never read
D1, R2, KV or secrets directly.

## Environment contract

- `local`: no external data and no secret required; use deterministic fixtures
  and a local Worker test harness.
- `preview`: Cloudflare Pages synthetic static build; Worker/D1 bindings remain
  disabled until the task explicitly enables synthetic resources.
- `synthetic`: isolated Cloudflare Worker and optional D1 database containing
  invented records only; founder owns the account and deployment approval.
- `production`: not enabled by this task and must not share synthetic secrets,
  bindings, databases or deployment tokens.

Required founder inputs are the Cloudflare account/project names, deployment
owner/recovery contact, chosen preview hostname, synthetic database approval and
explicit confirmation that no real data, paid commitment or production binding
is in scope. These values must not be invented in Git.

## Worker boundary

The Worker must:

1. accept only allow-listed versioned routes and methods;
2. validate headers, body size, content type and request schema before domain
   logic;
3. derive actor/context from the approved web authentication adapter rather
   than trusting browser-supplied roles;
4. enforce authorization, rate limits, idempotency and current-version checks;
5. return a stable error code, local message key and opaque request ID without
   provider paths, stack traces or account-enumeration clues;
6. write structured redacted audit events for approved mutations; and
7. fail closed when D1/KV/R2 or a quota/binding is unavailable.

The first task must keep the route set minimal. It must not implement pharmacy
operations, reservations, prescription uploads, authentication provider setup
or real notifications merely to demonstrate connectivity.

## Data boundary

Synthetic D1 records may include only invented pharmacy/listing values needed
for the test. No buyer identity, phone/email, contact detail, prescription,
health information or production export is permitted. KV is cache/config only.
R2 is not bound by Task 3 unless a separate private-file task approves it.

## Cloudflare and cost controls

- Use Wrangler configuration without committed account IDs, tokens or secrets.
- Use separate bindings per environment and least-privilege deployment access.
- Record the current Workers/D1/R2 limits used by tests and recheck them before
  enabling an environment.
- Add bounded request/body/CPU limits and a safe response when a quota is hit.
- Preserve search/read availability where safe, but pause costly or sensitive
  mutations at the approved circuit-breaker threshold.
- Do not use KV as a global hot counter; use a bounded, privacy-minimised rate
  limit design appropriate for the chosen store.

## Required evidence

- invalid method, route, content type, body size and schema rejection;
- spoofed actor/role and cross-tenant/branch authorization denial;
- generic anti-enumeration errors and redacted logs;
- duplicate idempotency and stale-version handling;
- rate-limit behaviour across cold starts/concurrent requests;
- D1 unavailable/quota-exceeded safe degradation and migration/export check;
- no direct browser binding access, credential or secret in build output; and
- formatting, lint, typecheck, tests, build and Cloudflare configuration
  validation from the exact PR revision.

## Completion boundary

Task 3 is complete only when synthetic Worker evidence is green and the PR
clearly states that no real identity, prescription, pharmacy operation, paid
resource or production release was activated.
