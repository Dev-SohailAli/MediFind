# Task 23: Catalog curation and search quality

## Goal

Use pilot search feedback to improve canonical medicine identity matching while
preserving exact-product safety. Add a reviewed curation path for aliases and
identity decisions; do not import an external medicine catalogue.

## Gate

Requires accepted Task 22 evidence, a bounded pilot feedback sample, a named
curator/reviewer and approval of the categories that may be stored. If the
feedback contains real prescription or health information, stop and request a
redacted synthetic reproduction.

## Read first

- [Data and search](../../data-and-search.md)
- [Data dictionary and ownership](../../data-dictionary-and-ownership.md)
- [Data and search](../../data-and-search.md)
- [Audit-log policy](../../audit-log-policy.md)
- [API mutation and concurrency policy](../../api-mutation-and-concurrency-policy.md)

## Scope

- Define canonical concept, reviewed alias, candidate-match and rejection
  states using existing contracts and version fields.
- Add explicit curator commands and server-side authorization; never allow a
  pharmacy or buyer to create a public canonical identity directly.
- Keep strength, form, route, release, pack and brand distinctions visible.
- Add bounded quality reports and reviewer outcomes without public ratings,
  free-form clinical text or ranking manipulation.
- Add deterministic regression fixtures for exact tokens, approved aliases,
  incompatible attributes, stale results, duplicate candidates and no-result
  language.

## Out of scope

External catalogues, clinical substitution, treatment recommendations, fuzzy
matching without review, user favourites, saved searches, paid ranking,
public reviews and buyer-location collection.

## Acceptance

- Public search uses only approved concept/alias data and retains exact-product
  safety rules.
- Every curation mutation has role, scope, version, idempotency and redacted
  audit coverage.
- Rejected, ambiguous and stale identities are safe and explainable to the
  buyer without exposing internal evidence.
- Tests prove no raw report text, buyer identity or prescription content enters
  search projection, logs, metrics or generic errors.
- A reviewer can export a synthetic curation decision set and reproduce the
  search-quality baseline.

## Verification and handoff

Run format, lint, typecheck, tests, build and the catalog-specific contract/
Worker tests. Record the synthetic fixture count, baseline queries, changed
ranking inputs, privacy review and rollback path. Commit:
`feat: add reviewed synthetic catalog curation workflow`

Implementation plan: [Task 23 catalog curation and search quality implementation plan](../../superpowers/plans/2026-08-18-task-23-catalog-curation-search-quality-implementation.md)
