# Task 10: Implement listing lifecycle and price integrity

## Gate

Requires Task 9's verified branch and role authorization plus an approved
additive D1 schema. Do not expose mutation routes to anonymous callers or
permit a browser-selected branch/pharmacy authority.

See the [Task 10 implementation plan](../../superpowers/plans/2026-08-18-task-10-listing-lifecycle-price-integrity-implementation.md) for the exact-pack price contract, command lifecycle, deterministic projection and Task 11 reservation-price compatibility gate.

## Goal

Allow an authorized inventory manager to create and refresh pharmacy-owned
listings while the Worker enforces canonical identity, exact-pack pricing,
availability freshness, version conflicts and public projection eligibility.

## Required commands

Use named commands rather than generic PATCH semantics: create listing,
refresh availability/price, submit ambiguous identity for MediFind review,
and withdraw listing. Each accepts only minimum fields plus an opaque
idempotency key and current version where required.

## Rules

- Canonical medicine identity, aliases and prescription-required classification
  remain MediFind-owned; pharmacy staff cannot change them arbitrarily.
- Price is non-negative integer FJD minor units for the exact
  identity/form/strength/pack. Ranges, estimates and contact-for-price are
  rejected.
- Every successful refresh increments the version and audit record; stale
  updates return safe `CONFLICT` without overwriting newer data.
- Only verified, visible branches with valid listing identity and freshness
  enter the public projection. Listing removal is fail-closed.
- Projection rebuild is deterministic and preserves the read-only search
  contract used by the current web app.

## Acceptance

Cover role/branch isolation, unknown fields, invalid price/pack, duplicate
identity, ambiguous identity, stale version, duplicate idempotency, quota or
provider failure, last-reviewer behavior, projection exclusion and public
response redaction. Verify exact-pack price preservation for approved
reservations is possible before Task 11 begins.

Commit: `feat: add pharmacy listing lifecycle and price integrity`
