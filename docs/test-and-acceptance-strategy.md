# Test and acceptance strategy

## Test environments

Automated tests use local fixtures, a Worker test harness and isolated
synthetic D1/R2 emulators or test bindings where available. They never use
real buyer/pharmacy/prescription data, production secrets or a protected
Cloudflare environment.

## Required layers

| Layer | Coverage |
| --- | --- |
| Unit | Search, normalization, validation, state transitions, money/time and redaction helpers |
| Web component | Keyboard/focus, screen readers, safe states, responsive layout and PWA manifest |
| Worker integration | Route/method/schema errors, authorization, rate limits, idempotency, D1 failure and safe error mapping |
| Security | Secret scanning, dependency scanning, direct-binding denial, log redaction and anti-enumeration |
| Browser acceptance | Desktop and mobile-browser viewports, offline shell, installability, reduced capabilities and 200% text scaling |
| Release | Exact commit, Pages/Worker build, migration/export evidence, cost forecast and rollback path |

## Mandatory negative cases

Tests must prove that the browser cannot access D1/R2/KV bindings, supply a
trusted role, bypass Worker validation, enumerate protected records, queue a
sensitive mutation offline or expose tokens/health data in logs. Quota and
binding failures must fail safely.

Prescription and protected-account tests remain synthetic and are not a release
approval. Real activation requires the separate legal, privacy, security,
recovery and operational gates.

## Quality commands

Every implementation PR reports exact results for format, lint, typecheck,
tests, build, secret scan, dependency audit and relevant Wrangler validation.
Manual browser or hosted evidence is reported only when actually run.
