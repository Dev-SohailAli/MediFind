# Web repository readiness record

## Scope

This record covers the public synthetic/documentation repository and the
web-only Cloudflare direction. It does not certify readiness for real data,
protected identity, prescriptions or production release.

## Required controls

- `main` is PR-only with required quality checks and no force/deletion pushes.
- Third-party Actions are pinned to full commit SHAs and use least privilege.
- Dependabot/security updates remain enabled where available.
- Gitleaks, dependency audit and Trivy run in local/hosted quality checks.
- No Cloudflare account token, Worker secret, database export or real data is
  committed.
- Preview deployments contain synthetic data only and do not have production
  bindings.

## Current readiness

The repository is ready for web-only synthetic work once the current migration
PR passes the quality workflow. A separate founder approval is required before
creating a synthetic Cloudflare Worker/D1 environment. A separate legal,
privacy, security and operational gate is required before protected data.
