# Data and search rules

## Core records

| Record | Required information |
| --- | --- |
| User | role, verified contact method, consent version, account state |
| Pharmacy | owner, legal/display name, Suva address and coordinates, hours, contact, verification state, responsible-person evidence reference |
| Staff assignment | user, pharmacy, permission, status |
| Medicine listing | pharmacy, pharmacy-authored name, brand/generic fields where known, strength, dosage form, availability, FJD price, updated-at, moderation state |
| Prescription request | buyer, selected pharmacy, encrypted file reference, state, timestamps, reviewer/audit events |
| Reservation | request/listing reference, pharmacy decision, pickup instruction, expiry, state history |

## Visibility and lifecycle

Only verified pharmacies and active, non-suspended listings can be returned publicly. Public records expose no exact quantity and never expose prescription data. `Unavailable` listings may remain visible only when clearly labelled; stale listings must be flagged rather than presented as current. The freshness threshold is a pilot operating decision and must be configured, audited and communicated to pharmacies.

## Search and normalization

Pharmacies author listing records, but the platform derives a normalized search index. It preserves the original entry and links normalized terms for generic names, brands, strengths, forms, common spelling variants and transliterations. Search must not infer a therapeutic substitute or recommend a medicine. Potential duplicates are grouped for admin review; they are not silently merged across pharmacies. Results rank verified, current, matching listings before distance and price, with the applied sort made clear to buyers.

## Data quality rules

Price is a non-binding listed FJD price and must show its update time. Medicine identity requires a name and dosage form; strength is required when applicable. A listing is attributable to exactly one pharmacy. Changes to price, availability, identity, verification and review/reservation status create immutable audit events.
