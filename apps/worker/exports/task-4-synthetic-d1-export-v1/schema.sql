-- Task 4 synthetic D1 search slice.
-- Schema, indexes and fixture data are exactly as accepted in ADR-275 /
-- docs/task-4-synthetic-d1-data-contract-proposal.md. Every value inserted
-- below is a deterministic transformation of the existing fictional
-- demonstrators in apps/web/src/fixtures/syntheticListings.ts (mirrored in
-- apps/worker/src/fixtures/task4SyntheticD1.ts, the single TypeScript source
-- of truth this file is generated from). apps/worker/src/__tests__/
-- migration.test.ts executes this file against an in-memory SQLite database
-- (Node's built-in node:sqlite, not a Cloudflare D1 binding) and asserts its
-- resulting rows are byte-identical to that TypeScript module, so the two
-- never drift. This migration is not applied to a hosted D1 database by this
-- task. The local Wrangler development config applies it to local-only D1.

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
