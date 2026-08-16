# Data and search rules

## Core records

| Record | Required information |
| --- | --- |
| User | role, verified contact method, consent version, account state |
| Pharmacy | owner, legal/display name, Fiji address and coordinates, normal hours, exceptional closure/holiday hours, contact, verification state, responsible-person evidence reference |
| Staff assignment | user, pharmacy, permission, status |
| Canonical medicine concept | approved generic/brand aliases, normalised identity terms, active ingredient, applicable strength/form/route/release/pack attributes, review status and audit references |
| Medicine listing | pharmacy, pharmacy-authored display name, brand and/or active ingredient, strength where applicable, dosage form, pack size, OTC/prescription-required status, availability, FJD price, updated-at, canonical-concept reference/candidate, identity-match state and moderation state |
| Prescription request | account holder, patient legal name, self/child/dependent relationship, selected pharmacy, encrypted file reference, state, timestamps, reviewer/audit events |
| Reservation | account holder, patient legal name, self/child/dependent relationship, request/listing reference, pharmacy decision, confirmed FJD collection price, pickup instruction, expiry, collected-by-pharmacy timestamp, buyer-confirmation feedback, state history |

## Visibility and lifecycle

Only verified pharmacies and active, non-suspended listings with an approved/high-confidence canonical identity match can be returned publicly. Public records expose no exact quantity and never expose prescription data. `Unavailable` listings may remain visible only when clearly labelled. A listing that has not been refreshed for more than 24 hours is visibly labelled "may be outdated" and de-ranked. A listing that remains unrefreshed for seven days is removed from search until its pharmacy refreshes it. These thresholds must be configurable, audited and communicated to pharmacies.

Prescription-required listings are visible only when the verified branch has at least one active authorised prescription reviewer. Controlled, restricted and otherwise legally sensitive medicine categories are not accepted, indexed or returned until an approved Fiji legal/pharmacy policy permits them.

`Low stock` is a pharmacy-managed availability status. MediFind does not display exact stock quantity or impose a universal numeric threshold; public wording must make clear that supply may change before collection.

## Search and normalization

Pharmacies author listing records, but the platform derives a normalized search index. It preserves the original entry and links normalized terms for case, whitespace, punctuation, generic names, brands, strengths, forms, common spelling variants and transliterations. Thus `Paracetamol` and `paracetamol` resolve to the same search concept while the pharmacy-entered display name remains visible. A brand-name search may show a listing with the same active ingredient, but the result must be explicitly labelled “active-ingredient match”, not “same product”; strength, form, pack size and brand remain visible. Search must not infer a therapeutic substitute or recommend a medicine. It must not automatically merge products that differ in active ingredient, strength, dosage form, route, release type, pack size or brand. Potential duplicates are grouped for admin review; they are not silently merged across pharmacies.

The default result order is exact medicine match and listing freshness, then buyer distance where location is available, then listed price. Buyers may explicitly choose a different supported sort. Display the active sort and relevant freshness context. Sponsored placement, paid ranking, hidden commercial boosts and any pharmacy payment that changes medicine-search order are prohibited.

For a zero-result search, offer only non-clinical search expansion (spelling, brand and active-ingredient terms) and a private unmet-demand report. Do not store the buyer's medicine-search history or suggestions as a profile feature in v1.

### Canonical identity workflow

Pharmacies create their own listing records, while the platform derives a normalized index against canonical medicine concepts. It preserves the exact pharmacy entry and can safely normalise case, whitespace, punctuation and approved aliases. A brand/active-ingredient result stays clearly labelled and retains brand, strength, dosage form and pack details; MediFind never claims an equivalent product or recommends a therapeutic substitute.

The initial canonical catalog is built only from verified pharmacy-authored listings and MediFind review. V1 does not scrape or import an external medicine database, use barcode scanning, or integrate government/product registries. Those sources remain post-pilot options subject to legal, data-quality, licensing, privacy, processor and cost review.

Automatic concept linking is allowed only for harmless, high-confidence variants whose active ingredient, strength, dosage form, route, release type, pack size and brand distinction remain compatible. Products that differ in any of those clinical/product attributes never auto-merge.

Ambiguous or unmatched listings receive the private state `identity_review_required`, are not indexed publicly, and wait for MediFind review. The pharmacy may correct its entered medicine details. MediFind may approve/reject a proposed canonical match and curate concepts/aliases with a complete audit record, but cannot change a pharmacy's price, availability, hours or clinical/dispensing decision. Potential duplicates remain separately attributable to their listing pharmacy.

### Search implementation and scale boundary

For MVP, the backend creates a minimal Firestore public-search projection from authoritative pharmacy listing and approved canonical-concept records. It contains canonical/listing identifiers, approved normalized tokens and aliases, public product/branch fields, verified branch coordinates, availability, listed FJD price, freshness and ranking inputs—never exact quantity, buyer identity, prescription data, raw buyer query or buyer location. Projection writes are idempotent and listing changes appear within the approved five-minute target without changing the pharmacy's true `lastUpdatedAt`.

Search supports deterministic exact-token/prefix/approved-alias lookup and the documented ranking/sorts. Do not attempt unrestricted fuzzy or clinical semantic search in Firestore, create arbitrary substring indexes, or retain searches to improve ranking. Misspellings are added only as reviewed non-clinical aliases. Nearby sorting receives transient coordinates for the request, calculates distance server-side or against precomputed geographic cells, and does not persist the buyer coordinates.

The API owns the search interface and result model; clients never depend on Firestore query/index syntax. If measured catalogue volume, write amplification, p95 latency or search-quality targets cannot be met, a future private managed index may consume the same minimum public projection after region, privacy, processor and cost approval. The web API, safety rules, canonical identity, attribution and no-sponsored-ranking policy remain unchanged.

## Data quality rules

Listed price is in FJD, includes applicable taxes/standard charges, applies to the exact declared listed pack and shows its update time. Public listings never use contact-for-price, unstructured ranges or estimated prices. It is non-binding until reservation approval; any unavoidable pharmacy-specific charge must be stated before approval. A listing requires a brand and/or active ingredient, dosage form, pack size, and strength where applicable before publication. Verified-pharmacy listings publish automatically only after required-field, format, duplicate/safety and high-confidence canonical-identity checks. An ambiguous/unmatched listing remains private pending canonical-identity review. A listing is attributable to exactly one pharmacy. Changes to price, availability, identity, verification, staff permission, report/moderation and review/reservation status create immutable audit events. See the [price integrity policy](price-integrity-policy.md).

Dependent/patient identity is request-scoped: capture patient legal name and self/child/dependent relationship on the request/reservation only; do not create reusable dependent profiles in v1. The selected pharmacy receives account-holder legal name/verified phone, patient name/relationship where different and the minimum request data it needs; buyer email, address and date of birth are excluded.
