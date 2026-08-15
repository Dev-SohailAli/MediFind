# Pharmacy branch location and hours policy

## Branch location contract

Every pharmacy branch stores a protected structured Fiji address:

- address line 1 and optional line 2;
- locality/city/town;
- province where applicable;
- fixed country code `FJ`;
- validated latitude/longitude and validation/source state; and
- a public-display address derived from the approved verified branch address.

The system supports all Fiji addresses for future expansion. The Suva-only limitation is a pilot activation/visibility rule, not an address-schema restriction. Owner-submitted address/coordinate changes are private until re-verification approves the material branch-location change.

## Directions and buyer location

The app uses only the verified public branch address/coordinates to open directions in the buyer's installed native mapping application. MVP does not embed an interactive map or transmit buyer location to pharmacies. Nearby search may use an approximate foreground buyer location transiently as defined in the [mobile permissions policy](mobile-permissions-policy.md); it is not stored on the branch, listing, request, reservation or analytics records.

## Opening-hours contract

- Store regular weekly hours as one or more open intervals per weekday, allowing closed days and split hours.
- Store exceptional dated closures or replacement intervals separately from regular hours. An exception takes precedence over regular hours.
- All branch business-day, request-expiry, reservation-expiry, reminder and public-hours calculations use the IANA timezone `Pacific/Fiji`.
- Validate that an approved reservation pickup deadline is compatible with an open branch interval. Explain the actual pickup window/expiry to the buyer; do not infer availability outside published hours.
- A change to routine hours is an owner/authorised operational update using version/concurrency controls and audit event. A branch address is a material re-verification change.

## Public projection and tests

Public branch detail exposes only approved display address, directions coordinate/address, phone/contact, normal/exceptional hours and safe verification status. It excludes evidence, staff, owner, exact geocoding validation detail and private administration metadata.

Tests cover Fiji address validation/display, private-before-approval address change, directions generation without buyer-location disclosure, weekly split/closed hours, exception precedence, daylight/timezone correctness, and reservation/request expiry near closing/holiday boundaries.
