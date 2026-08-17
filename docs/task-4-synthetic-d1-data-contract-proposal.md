# Task 4: synthetic D1 search data-contract proposal

## Status and decision boundary

**Status:** Proposed; not yet accepted for implementation.

This document proposes the smallest useful D1 slice after the Worker
foundation: server-owned synthetic search data for `GET /v1/search` and
`GET /v1/listings/{id}`. It is a contract proposal, not permission to create a
Cloudflare database, add a binding, deploy a route or enable protected data.

If accepted, the next implementation task may create only the schema,
migration, deterministic synthetic fixtures, projection builder, read-only
Worker routes and their tests. It may not add accounts, contacts, authentication
providers, reservations, prescriptions, uploads, audit storage, runtime
mutations or real data.

The contract preserves the existing boundary:

```text
browser/PWA -> Cloudflare Pages -> Cloudflare Worker -> synthetic D1
```

The browser never receives a D1 credential or reads a D1 table directly. The
Worker is the only operational reader, projection builder and future mutation
boundary.

## Scope

### Included

- Six D1 tables for synthetic medicine, pharmacy, branch, listing and public
  search-projection data.
- The public-safe read projection used by search and listing detail.
- Deterministic prefix matching over reviewed synthetic aliases and display
  terms.
- Eight existing synthetic listing fixtures, including one deliberately
  excluded stale fixture.
- A versioned logical export and additive migration shape.
- Field-level privacy classification and ownership rules.

### Explicitly excluded

- `user`, `verifiedContact`, `userRole`, `sessionDevice`, consent or recovery
  records.
- Pharmacy verification evidence, staff assignments, pilot agreements or
  training records.
- Buyer, patient, prescription, reservation, support or incident records.
- Search-query history, location history, exact stock quantities and contact
  details.
- Runtime D1 mutations. The first Task 4 routes are read-only.
- R2, KV, Durable Objects, Queues, external search providers and analytics.
- Real pharmacy, medicine, buyer, health, prescription or production data.

## Proposed authorization owner

The Worker authorization boundary owns every access decision. The database
does not receive a role or authorization decision from the browser.

| Operation | Owner | Task 4 rule |
| --- | --- | --- |
| Read search/listing projection | Worker route authorization and response mapper | Read only the approved projection; return no source-table or internal search columns. The authentication provider remains provider-neutral and is not selected here. |
| Load synthetic fixtures | Reviewed migration/fixture command under PR control | No runtime endpoint or browser action can load or alter fixtures. |
| Build or replace projection | Server-only Worker maintenance seam or reviewed migration step | Must be deterministic, bounded, idempotent and auditable in implementation tests; no browser write path. |
| Curate medicine concepts | Future `medifind_admin`/curator owner | Not enabled by Task 4; fixture values are invented and repository-reviewed. |
| Own pharmacy/branch display data | Future pharmacy owner scoped to its branch, with admin verification | Not enabled by Task 4; no owner account or staff role is created. |
| Own listing availability and price | Future branch-scoped pharmacy role | Not enabled by Task 4; fixture values are synthetic. |
| Authorize export/restore | Founder-controlled deployment/recovery owner | No production export or restore is enabled. Synthetic export is repository-local and reviewable. |

The authorization policy is therefore **server-owned, provider-neutral,
read-only and synthetic-only** for this task. A caller-supplied role, branch,
pharmacy ID or D1 table name is never trusted.

## Privacy classification

The contract uses these classifications:

- **Public projection:** eligible for a filtered Worker response after route
  policy permits it; never directly writable or directly queryable by the
  browser.
- **Internal:** server/D1 implementation data; never returned by a public
  route.
- **Protected:** scoped operational data for an authenticated owner/role; not
  enabled in this task.
- **Restricted:** privileged or sensitive data; not present in this task.
- **Prohibited:** data that must not become a column, fixture, log, export or
  response field for this task.

Every value in the accepted Task 4 fixture set must also be marked synthetic in
the fixture source and contain no real-world identity or clinical claim.

## Exact proposed schema

SQLite/D1 types are intentional: IDs and timestamps are UTF-8 `TEXT`, booleans
are `INTEGER` constrained to `0` or `1`, prices are non-negative FJD minor
units, and JSON fields are validated by the application before insertion.
All timestamps are UTC ISO-8601 strings. User-facing business-time display
uses `Pacific/Fiji`.

The following is the complete Task 4 schema. No additional column is implied
by the logical dictionary.

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE medicine_concepts (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  active_ingredient_display_name TEXT NOT NULL,
  strength TEXT NOT NULL,
  dosage_form TEXT NOT NULL,
  pack_description TEXT NOT NULL,
  aliases_json TEXT NOT NULL,
  approval_state TEXT NOT NULL CHECK (approval_state IN ('approved', 'excluded')),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE pharmacy_organisations (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  verification_state TEXT NOT NULL
    CHECK (verification_state IN ('verified', 'unverified', 'suspended')),
  public_visibility_state TEXT NOT NULL
    CHECK (public_visibility_state IN ('visible', 'hidden')),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE pharmacy_branches (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES pharmacy_organisations(id),
  display_name TEXT NOT NULL,
  synthetic_area TEXT NOT NULL
    CHECK (synthetic_area IN ('harbour', 'market', 'garden')),
  direction_text TEXT NOT NULL,
  timezone TEXT NOT NULL CHECK (timezone = 'Pacific/Fiji'),
  public_visibility_state TEXT NOT NULL
    CHECK (public_visibility_state IN ('visible', 'hidden')),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE medicine_listings (
  id TEXT PRIMARY KEY,
  concept_id TEXT NOT NULL REFERENCES medicine_concepts(id),
  branch_id TEXT NOT NULL REFERENCES pharmacy_branches(id),
  brand_name TEXT,
  availability_state TEXT NOT NULL
    CHECK (availability_state IN ('in_stock', 'low_stock', 'unavailable')),
  price_fjd_minor INTEGER NOT NULL CHECK (price_fjd_minor >= 0),
  synthetic_distance_label TEXT NOT NULL,
  synthetic_distance_rank INTEGER NOT NULL CHECK (synthetic_distance_rank >= 0),
  last_refreshed_at TEXT NOT NULL,
  listing_state TEXT NOT NULL CHECK (listing_state IN ('active', 'excluded')),
  identity_match_state TEXT NOT NULL
    CHECK (identity_match_state IN ('approved', 'candidate', 'rejected')),
  version INTEGER NOT NULL CHECK (version >= 1),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE public_search_projection (
  listing_id TEXT PRIMARY KEY REFERENCES medicine_listings(id),
  medicine_display_name TEXT NOT NULL,
  brand_name TEXT,
  active_ingredient_display_name TEXT NOT NULL,
  strength TEXT NOT NULL,
  dosage_form TEXT NOT NULL,
  pack_description TEXT NOT NULL,
  pharmacy_display_name TEXT NOT NULL,
  synthetic_area TEXT NOT NULL
    CHECK (synthetic_area IN ('harbour', 'market', 'garden')),
  direction_text TEXT NOT NULL,
  availability_state TEXT NOT NULL
    CHECK (availability_state IN ('in_stock', 'low_stock', 'unavailable')),
  price_fjd_minor INTEGER NOT NULL CHECK (price_fjd_minor >= 0),
  synthetic_distance_label TEXT NOT NULL,
  synthetic_distance_rank INTEGER NOT NULL CHECK (synthetic_distance_rank >= 0),
  last_refreshed_at TEXT NOT NULL,
  source_version INTEGER NOT NULL CHECK (source_version >= 1),
  projection_version INTEGER NOT NULL CHECK (projection_version = 1),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  projected_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE public_search_terms (
  listing_id TEXT NOT NULL REFERENCES public_search_projection(listing_id),
  normalized_term TEXT NOT NULL,
  match_kind TEXT NOT NULL
    CHECK (match_kind IN ('product', 'ingredient', 'alias')),
  schema_version INTEGER NOT NULL CHECK (schema_version = 1),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (listing_id, normalized_term, match_kind)
);

CREATE INDEX idx_branches_organisation
  ON pharmacy_branches (organisation_id);
CREATE INDEX idx_listings_concept
  ON medicine_listings (concept_id);
CREATE INDEX idx_listings_branch
  ON medicine_listings (branch_id);
CREATE INDEX idx_projection_area
  ON public_search_projection (synthetic_area);
CREATE INDEX idx_search_terms_prefix
  ON public_search_terms (normalized_term, listing_id);
```

The migration must preserve foreign-key ordering: parent tables first, source
listings next, projection rows after source rows, and search terms last.
`public_search_projection` is the only table from which a public search mapper
may select response fields. `public_search_terms` is joined only to identify
matching projection IDs and is never returned.

### Field classification and owner matrix

| Table | Column | Classification | Owner/use |
| --- | --- | --- | --- |
| `medicine_concepts` | `id` | Internal | Worker projection reference; opaque and immutable. |
| `medicine_concepts` | `display_name`, `active_ingredient_display_name`, `strength`, `dosage_form`, `pack_description` | Public projection | Worker may copy approved values into the public projection; all fixture values are synthetic. |
| `medicine_concepts` | `aliases_json` | Internal | Curator/projection input; normalized aliases only, never query history. |
| `medicine_concepts` | `approval_state` | Internal | Curator/admin policy; only approved concepts may project. |
| `medicine_concepts` | `schema_version`, `created_at`, `updated_at` | Internal | Migration and maintenance metadata. |
| `pharmacy_organisations` | `id` | Internal | Opaque relationship key; never used as a caller authority. |
| `pharmacy_organisations` | `display_name` | Public projection | Worker may expose only after visibility and verification filtering; synthetic in Task 4. |
| `pharmacy_organisations` | `verification_state`, `public_visibility_state` | Internal | Verification and visibility gates; never returned as raw control data. |
| `pharmacy_organisations` | `schema_version`, `created_at`, `updated_at` | Internal | Migration and maintenance metadata. |
| `pharmacy_branches` | `id`, `organisation_id` | Internal | Server-only relationship keys. |
| `pharmacy_branches` | `display_name`, `synthetic_area`, `direction_text`, `timezone` | Public projection | Safe synthetic branch context; no exact address, phone, email or coordinates. |
| `pharmacy_branches` | `public_visibility_state` | Internal | Worker projection gate. |
| `pharmacy_branches` | `schema_version`, `created_at`, `updated_at` | Internal | Migration and maintenance metadata. |
| `medicine_listings` | `id`, `concept_id`, `branch_id` | Internal | Opaque server relationships; `id` may be exposed only as an opaque result reference. |
| `medicine_listings` | `brand_name`, `availability_state`, `price_fjd_minor`, `synthetic_distance_label`, `synthetic_distance_rank`, `last_refreshed_at` | Public projection | Worker may copy approved synthetic values to the projection; no exact stock quantity. |
| `medicine_listings` | `listing_state`, `identity_match_state`, `version` | Internal | Projection eligibility, moderation and future optimistic concurrency. |
| `medicine_listings` | `schema_version`, `created_at`, `updated_at` | Internal | Migration and maintenance metadata. |
| `public_search_projection` | `listing_id` | Public projection | Opaque result reference; no source-table IDs are returned. |
| `public_search_projection` | `medicine_display_name`, `brand_name`, `active_ingredient_display_name`, `strength`, `dosage_form`, `pack_description`, `pharmacy_display_name`, `synthetic_area`, `direction_text`, `availability_state`, `price_fjd_minor`, `synthetic_distance_label`, `synthetic_distance_rank`, `last_refreshed_at` | Public projection | The only fields eligible for the approved search/listing response. |
| `public_search_projection` | `source_version`, `projection_version`, `schema_version`, `projected_at`, `created_at`, `updated_at` | Internal | Projection freshness and migration evidence; never returned raw. |
| `public_search_terms` | `listing_id`, `normalized_term`, `match_kind` | Internal | Server-side deterministic matching only; never stores a caller query. |
| `public_search_terms` | `schema_version`, `created_at`, `updated_at` | Internal | Migration and maintenance metadata. |

### Prohibited fields

The following are prohibited from every Task 4 table, fixture, export, log and
response: person or patient names, phone/email values, user IDs, account
credentials, raw search text, location permission or history, exact stock
quantity, prescription or health content, support free text, tokens, secrets,
device identifiers, real pharmacy/medicine identity, provider paths and D1
binding credentials.

## Synthetic fixture plan

The fixture loader must transform the existing
`apps/web/src/fixtures/syntheticListings.ts` values without introducing new
real-world claims. The existing names are explicitly documented as fictional
demonstrators and remain synthetic-only.

The accepted fixture set is deterministic:

| Table | Rows | Fixture rule |
| --- | ---: | --- |
| `medicine_concepts` | 7 | One approved row for each existing fictional medicine concept; the stale exclusion is represented on the listing, not by inventing a concept-level rejection. |
| `pharmacy_organisations` | 4 | One row for Solandra, Marketside, Gardenview and Harbourline synthetic pharmacy labels. |
| `pharmacy_branches` | 4 | One branch per synthetic pharmacy label, using only `harbour`, `market` or `garden` area keys and synthetic direction text. |
| `medicine_listings` | 8 | One row per existing listing, including the deliberately stale `excludex-solandra-ineligible` row. |
| `public_search_projection` | 7 | Only listings that pass listing, identity, branch, organisation and freshness gates. |
| `public_search_terms` | Deterministic | Product, active-ingredient and approved-alias terms for each projected listing; no query rows. |

The exact existing fixture behaviours remain the acceptance baseline:

- `Nivaprin` has two projected listings and the approved alias/ingredient
  search uses the fictional `Bentholine` values.
- `Calorex Relief`, `Quandryl`, `Trelavex`, `Purenex` and `Zephyrium` retain
  their current synthetic fields and sort behaviour.
- The `Excludex` row remains excluded because its refresh age exceeds the
  documented seven-day search eligibility window; a matching query must not
  return it.
- Search normalization remains trim/lowercase/collapse/prefix matching. There
  is no fuzzy, clinical-substitute or semantic matching.
- Prices remain integer FJD minor units and are displayed only through the
  existing web contract formatter.

Fixture IDs must be stable, opaque-to-callers and derived from the existing
fixture IDs only. Fixture timestamps must be fixed in the seed data and tests
must inject the comparison clock; no test may depend on wall-clock time.

## Read contract boundary

The data contract supports these candidate routes only; the route is not live
until a separate Task 4 implementation brief and binding approval exist.

### `GET /v1/search`

Accepted query parameters:

| Parameter | Type and limit | Rule |
| --- | --- | --- |
| `query` | optional string, at most 80 Unicode characters after trim | An empty query returns the safe browse state; a non-empty query performs bounded result search. |
| `area` | `harbour \| market \| garden` | Optional synthetic area context; it does not request device location or change the matched set. |
| `sort` | `relevance \| price_low_to_high \| distance` | Optional; default `relevance`, with deterministic ID tie-breakers. |
| `page` | positive integer, default `1` | Bounded by the approved page size. |
| `pageSize` | integer `1–20`, default `20` | Worker clamps/rejects above the limit; total results are capped at `100`. |

The Worker normalizes the query, finds prefix matches in
`public_search_terms`, joins only eligible projection rows, applies the
existing deterministic ranking/area rules and returns public projection
fields. It does not persist the query or selected area.

### `GET /v1/listings/{id}`

The `{id}` is an opaque projected listing ID. The Worker returns the same
public projection fields as a single row only if the row is currently eligible.
Missing, hidden, excluded and unauthorized records use the existing generic
safe not-found/error mapping; the response must not reveal which internal gate
failed.

### Response prohibition

Neither route returns source IDs, verification states, moderation states,
projection metadata, search terms, exact stock, contact details, query text,
database errors or a caller's authorization context.

## Export and migration shape

### Logical export

The canonical synthetic export is a versioned directory, not a provider
database dump:

```text
task-4-synthetic-d1-export-v1/
  manifest.json
  schema.sql
  data/
    medicine_concepts.jsonl
    pharmacy_organisations.jsonl
    pharmacy_branches.jsonl
    medicine_listings.jsonl
    public_search_projection.jsonl
    public_search_terms.jsonl
```

`manifest.json` contains exactly `format_version`, `schema_version`,
`synthetic_only`, `contains_real_data`, `tables`, `row_counts` and per-file
SHA-256 checksums. `synthetic_only` must be `true` and `contains_real_data`
must be `false`. Each JSONL file is UTF-8, one complete object per line, sorted
by its primary key, with explicit `null` values and no omitted schema fields.

The export contains no D1 account/database IDs, bindings, credentials,
provider metadata, query history or runtime logs. It is safe to review in the
repository only while every value remains fictional; an implementation task
must not add a production export artifact.

### Migration

The first migration is named `0001_task4_synthetic_search.sql` and must:

1. enable foreign-key checks;
2. create the six tables and five indexes exactly as specified above;
3. load only the reviewed synthetic fixtures;
4. build the projection and search-term rows deterministically; and
5. verify expected row counts and projection exclusion before reporting
   success.

Future migrations are additive and numbered. They must not silently rename or
drop a column, reinterpret a classification, delete rows or change public
meaning. A breaking change requires a new decision and a new export format.
Before applying a migration, the implementation must produce the logical
export and checksum manifest. Verification must compare schema version, row
counts, foreign-key integrity, fixture IDs and projection checksums. Recovery
for this synthetic environment is restore-from-export plus reapplication of
numbered migrations; no production backup or restore authority is implied.

## Cost, failure and security obligations

- D1 remains disabled until the founder supplies the synthetic account,
  project/database approval and recovery owner required by the Task 3 gate.
- The Worker must fail closed when the binding is absent, unavailable, over
  quota or returns an invalid row. It must not fall back to an unbounded query
  or silently mix local browser fixtures with partial D1 results.
- Queries must use bound parameters, bounded result/page sizes and indexed
  relationships. No arbitrary table, column, sort expression or SQL fragment
  may be caller-controlled.
- Search and listing reads are rate-limited through the existing Worker seam;
  raw query text is not placed in logs or audit events.
- The route must preserve safe error codes, anti-enumeration behaviour,
  correlation IDs, redacted logs and direct-binding denial tests.
- Cloudflare pricing and current D1 limits must be rechecked in the Task 4
  brief. This proposal authorizes no paid usage, account, hostname, binding or
  production deployment.

## Acceptance gate for this proposal

This proposal is ready for founder/documentation review when the reviewer can
confirm all of the following:

- The six tables and every listed column are the intended minimum search slice.
- Public, internal, protected, restricted and prohibited classifications are
  correct for the synthetic phase.
- The Worker, not the browser or D1, owns authorization and projection access.
- The eight existing fixtures and seven-day stale exclusion are the intended
  synthetic baseline.
- The JSONL export/checksum and additive migration rules are sufficient for a
  later provider migration.
- No account, contact, reservation, prescription, real-data or production
  capability is accidentally authorized.

After this document and its proposed ADR row are accepted, create a separate
Task 4 implementation brief naming exact Worker files, route schemas, binding
approval, browser acceptance, cost evidence and verification commands. Only
that approved brief may authorize the D1 vertical-slice PR.
