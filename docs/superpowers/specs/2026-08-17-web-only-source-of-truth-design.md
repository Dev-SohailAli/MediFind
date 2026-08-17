# Web-Only Source-of-Truth Cleanup Design

**Status:** Approved for implementation in the active task continuation

## Goal

Make the MediFind repository and its GitHub-facing work unambiguously describe
one responsive web/PWA client, an optional Cloudflare Worker boundary, and a
free-first Cloudflare data path that remains synthetic-only until separately
approved.

## Scope

- Keep `apps/web` as the only active client and `apps/worker` as the only
  optional server package.
- Keep Cloudflare Pages and Workers as the current platform direction. Treat
  D1, R2 and KV as gated candidates with explicit cost, privacy, export and
  recovery requirements.
- Remove stale active workspace/configuration/documentation references to the
  retired native/mobile/Firebase/GCP design without erasing clearly labelled
  historical material in `archive/` or guardrails that prohibit regression.
- Add automated repository-boundary checks for forbidden active artifacts and
  stale workspace entries.
- Align open pull-request metadata with the verified repository state: update
  the current web PR and close the obsolete mobile-era PR as superseded.

## Architecture and safety boundary

```text
browser/PWA -> Cloudflare Pages -> Cloudflare Worker -> D1/R2/KV (server only)
```

The preview remains local/public synthetic data only. No real buyer, pharmacy,
medicine, contact, health or prescription data; credentials; production
bindings; native SDKs; Firebase/GCP services; or direct browser data-store
access may be introduced by this cleanup.

## Verification contract

The final evidence must include a repository-wide stale-reference/artifact
scan, workspace-boundary tests, format, lint, typecheck, unit tests, web build,
Worker tests/configuration validation, and secret/dependency scans. GitHub PR
state must be read back after any metadata mutation. No hosted Cloudflare or
production result may be claimed unless it was actually run.
