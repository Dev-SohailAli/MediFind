# Task 33: Catalog-source and barcode decision

## Goal

Revisit the deferred barcode and external-catalog question using search-quality
evidence, with a strict distinction between medicine identity support and
clinical or dispensing advice.

## Gate

Requires Task 23 curation evidence, Task 26 aggregate search-quality evidence,
named pharmacy/clinical reviewers, and a legal/privacy/security review of each
candidate source. No external source is approved by this brief.

## Read first

- [Data and search](../../data-and-search.md)
- [Data dictionary and ownership](../../data-dictionary-and-ownership.md)
- [Requirements](../../requirements.md)
- [Experience and content](../../experience-and-content.md)
- [Decision log](../../decisions.md) (ADR-198 and ADR-199)

## Scope

- Compare continued pharmacy-authored curation, barcode-assisted entry,
  licensed catalog reference and government/product-registry reference as
  separate options.
- Define identity provenance, versioning, licensing, correction, conflict,
  expiry, regional applicability and curator accountability.
- Prove that strength, form, route, release, pack, brand and prescription
  status cannot be silently merged or inferred from a scan/source record.
- Define safe handling for unknown, ambiguous, recalled, discontinued or
  conflicting records.
- Produce a decision packet with evidence requirements and a separate task
  outline if an option is recommended.

## Out of scope

Clinical substitution, treatment advice, automated dispensing decisions,
unreviewed imports, public catalog dumps, camera permissions, barcode scanning
code, source credentials and government eligibility decisions.

## Acceptance

- The current pharmacy-authored/MediFind-reviewed source remains valid and
  continues to work if every option is rejected.
- Any recommended source has named license, processor, region, update,
  correction, retention and rollback questions; unanswered items block use.
- Synthetic provenance and conflict fixtures prove public search never treats
  an unreviewed source as authoritative availability or price.
- The output records whether ADR-199 should remain accepted, be amended or be
  reopened through a separate founder decision.

## Verification and handoff

Run quality checks, catalog provenance tests and redacted synthetic export
checks. Attach reviewer sign-off requirements and unresolved source risks.
Commit:
`docs: record catalog source and barcode evaluation decision`

Implementation plan: [Task 33 catalog source and barcode decision plan](../../superpowers/plans/2026-08-18-task-33-catalog-source-barcode-decision-implementation.md)
