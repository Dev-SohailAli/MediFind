# Listing price integrity policy

## Public price rule

Every public medicine listing has exactly one current, non-negative FJD price in integer minor units for the exact listed medicine identity, strength where applicable, dosage form, route/release attributes where applicable and pack size. Public search/detail never displays “contact for price”, an unstructured price range, an estimated price or a price for a different pack/unit.

The displayed FJD amount includes applicable taxes and normal standard charges as documented. If an unavoidable pharmacy-specific charge may apply, it is disclosed before reservation approval; it does not replace the required listed price.

## Pack and unit integrity

- Price is a price for the declared listed pack, not a per-tablet, per-dose, per-gram or other derived unit price unless that exact unit is the declared purchasable pack.
- A staff member must create a separate listing when pack/form/strength/identity differs. The canonical-catalog rules prevent mismatched products from sharing a price comparison.
- The app formats FJD only at the UI boundary; all API/storage/calculation values use integer minor units plus explicit `FJD` currency.

## Change and reservation rule

- Price edits require current listing version, branch-authorised inventory role and an immutable audit event containing safe previous/new monetary values and reason/category where configured.
- Public projection propagates the update within the approved five-minute target and retains the pharmacy actual `lastUpdatedAt`.
- An approved reservation retains its pharmacy-confirmed FJD price. The pharmacy may not silently change it. If the pharmacy cannot honour it, it uses the existing approved-reservation cancellation path with operational reason and immediate buyer notice; the buyer does not discover an uncommunicated change at collection.
- Price history is operational/audit evidence, not a public price-tracking/advertising feature in v1.

## Tests

Test required price/pack attributes, FJD minor-unit formatting, zero/non-negative validation, separate-pack comparisons, stale-version conflict, audit/history, five-minute projection, confirmed-reservation price immutability and cancellation/notice when a confirmed price cannot be honoured.
