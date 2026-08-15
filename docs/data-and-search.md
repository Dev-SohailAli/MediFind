# Data and search rules

## Core records

| Record | Required information |
| --- | --- |
| User | role, verified contact method, consent version, account state |
| Pharmacy | owner, legal/display name, Fiji address and coordinates, normal hours, exceptional closure/holiday hours, contact, verification state, responsible-person evidence reference |
| Staff assignment | user, pharmacy, permission, status |
| Medicine listing | pharmacy, pharmacy-authored display name, brand and/or active ingredient, strength where applicable, dosage form, pack size, OTC/prescription-required status, availability, FJD price, updated-at, moderation state |
| Prescription request | buyer, selected pharmacy, encrypted file reference, state, timestamps, reviewer/audit events |
| Reservation | request/listing reference, pharmacy decision, confirmed FJD collection price, pickup instruction, expiry, collected-by-pharmacy timestamp, buyer-confirmation feedback, state history |

## Visibility and lifecycle

Only verified pharmacies and active, non-suspended listings can be returned publicly. Public records expose no exact quantity and never expose prescription data. `Unavailable` listings may remain visible only when clearly labelled. A listing that has not been refreshed for more than 24 hours is visibly labelled "may be outdated" and de-ranked. A listing that remains unrefreshed for seven days is removed from search until its pharmacy refreshes it. These thresholds must be configurable, audited and communicated to pharmacies.

Prescription-required listings are visible only when the verified branch has at least one active authorised prescription reviewer. Controlled, restricted and otherwise legally sensitive medicine categories are not accepted, indexed or returned until an approved Fiji legal/pharmacy policy permits them.

`Low stock` is a pharmacy-managed availability status. MediFind does not display exact stock quantity or impose a universal numeric threshold; public wording must make clear that supply may change before collection.

## Search and normalization

Pharmacies author listing records, but the platform derives a normalized search index. It preserves the original entry and links normalized terms for case, whitespace, punctuation, generic names, brands, strengths, forms, common spelling variants and transliterations. Thus `Paracetamol` and `paracetamol` resolve to the same search concept while the pharmacy-entered display name remains visible. A brand-name search may show a listing with the same active ingredient, but the result must be explicitly labelled “active-ingredient match”, not “same product”; strength, form, pack size and brand remain visible. Search must not infer a therapeutic substitute or recommend a medicine. It must not automatically merge products that differ in active ingredient, strength, dosage form, route, release type, pack size or brand. Potential duplicates are grouped for admin review; they are not silently merged across pharmacies.

The default result order is exact medicine match and listing freshness, then buyer distance where location is available, then listed price. Buyers may explicitly choose a different supported sort. Display the active sort and relevant freshness context. Sponsored placement, paid ranking, hidden commercial boosts and any pharmacy payment that changes medicine-search order are prohibited.

For a zero-result search, offer only non-clinical search expansion (spelling, brand and active-ingredient terms) and a private unmet-demand report. Do not store the buyer's medicine-search history or suggestions as a profile feature in v1.

## Data quality rules

Listed price is in FJD, includes applicable taxes/standard charges, is non-binding until reservation approval, and shows its update time. Any unavoidable pharmacy-specific charge must be stated before approval. A listing requires a brand and/or active ingredient, dosage form, pack size, and strength where applicable before publication. Verified-pharmacy listings publish automatically after required-field, format and duplicate/safety checks. A listing is attributable to exactly one pharmacy. Changes to price, availability, identity, verification, staff permission, report/moderation and review/reservation status create immutable audit events.
