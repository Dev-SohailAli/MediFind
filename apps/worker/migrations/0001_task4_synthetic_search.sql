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
-- never drift. This migration is not applied to any live D1 database by
-- this task; D1 stays disabled (see apps/worker/wrangler.toml).

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

-- Reviewed synthetic fixtures: 7 medicine_concepts (one per fictional
-- medicine name; Nivaprin is shared by two listings so 8 listings collapse
-- to 7 concepts).

INSERT INTO medicine_concepts (id, display_name, active_ingredient_display_name, strength, dosage_form, pack_description, aliases_json, approval_state, schema_version, created_at, updated_at) VALUES ('concept-nivaprin', 'Nivaprin', 'Bentholine', '500 mg', 'Tablet', 'Pack of 20', '["bentholine relief"]', 'approved', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_concepts (id, display_name, active_ingredient_display_name, strength, dosage_form, pack_description, aliases_json, approval_state, schema_version, created_at, updated_at) VALUES ('concept-calorex-relief', 'Calorex Relief', 'Zephyramine', '200 mg', 'Capsule', 'Pack of 10', '["zephyramine forte","calorex alt"]', 'approved', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_concepts (id, display_name, active_ingredient_display_name, strength, dosage_form, pack_description, aliases_json, approval_state, schema_version, created_at, updated_at) VALUES ('concept-quandryl', 'Quandryl', 'Marisolvin', '10 mg', 'Tablet', 'Pack of 30', '[]', 'approved', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_concepts (id, display_name, active_ingredient_display_name, strength, dosage_form, pack_description, aliases_json, approval_state, schema_version, created_at, updated_at) VALUES ('concept-trelavex', 'Trelavex', 'Halvonide', '50 mg', 'Ointment', '30 g tube', '["halvonide cream"]', 'approved', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_concepts (id, display_name, active_ingredient_display_name, strength, dosage_form, pack_description, aliases_json, approval_state, schema_version, created_at, updated_at) VALUES ('concept-purenex', 'Purenex', 'Sanolithine', '5 mg', 'Tablet', 'Pack of 14', '["sanolithine mild"]', 'approved', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_concepts (id, display_name, active_ingredient_display_name, strength, dosage_form, pack_description, aliases_json, approval_state, schema_version, created_at, updated_at) VALUES ('concept-zephyrium', 'Zephyrium', 'Corvaline', '100 mg', 'Capsule', 'Pack of 20', '["corvaline plus"]', 'approved', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_concepts (id, display_name, active_ingredient_display_name, strength, dosage_form, pack_description, aliases_json, approval_state, schema_version, created_at, updated_at) VALUES ('concept-excludex', 'Excludex', 'Voidamine', '20 mg', 'Tablet', 'Pack of 10', '[]', 'approved', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');

INSERT INTO pharmacy_organisations (id, display_name, verification_state, public_visibility_state, schema_version, created_at, updated_at) VALUES ('org-solandra', 'Solandra Pharmacy (synthetic)', 'verified', 'visible', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO pharmacy_organisations (id, display_name, verification_state, public_visibility_state, schema_version, created_at, updated_at) VALUES ('org-marketside', 'Marketside Pharmacy (synthetic)', 'verified', 'visible', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO pharmacy_organisations (id, display_name, verification_state, public_visibility_state, schema_version, created_at, updated_at) VALUES ('org-gardenview', 'Gardenview Apothecary (synthetic)', 'verified', 'visible', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO pharmacy_organisations (id, display_name, verification_state, public_visibility_state, schema_version, created_at, updated_at) VALUES ('org-harbourline', 'Harbourline Pharmacy (synthetic)', 'verified', 'visible', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');

INSERT INTO pharmacy_branches (id, organisation_id, display_name, synthetic_area, direction_text, timezone, public_visibility_state, schema_version, created_at, updated_at) VALUES ('branch-solandra', 'org-solandra', 'Solandra Pharmacy (synthetic)', 'harbour', 'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).', 'Pacific/Fiji', 'visible', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO pharmacy_branches (id, organisation_id, display_name, synthetic_area, direction_text, timezone, public_visibility_state, schema_version, created_at, updated_at) VALUES ('branch-marketside', 'org-marketside', 'Marketside Pharmacy (synthetic)', 'market', 'Synthetic directions: near the market synthetic checkpoint (fixture data only).', 'Pacific/Fiji', 'visible', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO pharmacy_branches (id, organisation_id, display_name, synthetic_area, direction_text, timezone, public_visibility_state, schema_version, created_at, updated_at) VALUES ('branch-gardenview', 'org-gardenview', 'Gardenview Apothecary (synthetic)', 'garden', 'Synthetic directions: near the garden synthetic checkpoint (fixture data only).', 'Pacific/Fiji', 'visible', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO pharmacy_branches (id, organisation_id, display_name, synthetic_area, direction_text, timezone, public_visibility_state, schema_version, created_at, updated_at) VALUES ('branch-harbourline', 'org-harbourline', 'Harbourline Pharmacy (synthetic)', 'harbour', 'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).', 'Pacific/Fiji', 'visible', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');

INSERT INTO medicine_listings (id, concept_id, branch_id, brand_name, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('nivaprin-solandra', 'concept-nivaprin', 'branch-solandra', 'Nivaprin Rapid', 'in_stock', 850, '1.2 km (synthetic)', 1, '2026-08-17T00:00:00.000Z', 'active', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_listings (id, concept_id, branch_id, brand_name, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('nivaprin-marketside', 'concept-nivaprin', 'branch-marketside', 'Nivaprin Rapid', 'low_stock', 790, '3.4 km (synthetic)', 4, '2026-08-16T00:00:00.000Z', 'active', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_listings (id, concept_id, branch_id, brand_name, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('calorex-gardenview', 'concept-calorex-relief', 'branch-gardenview', NULL, 'in_stock', 1120, '0.8 km (synthetic)', 1, '2026-08-17T00:00:00.000Z', 'active', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_listings (id, concept_id, branch_id, brand_name, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('quandryl-harbourline', 'concept-quandryl', 'branch-harbourline', NULL, 'unavailable', 640, '2.1 km (synthetic)', 2, '2026-08-15T00:00:00.000Z', 'active', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_listings (id, concept_id, branch_id, brand_name, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('trelavex-marketside', 'concept-trelavex', 'branch-marketside', NULL, 'in_stock', 990, '3.0 km (synthetic)', 3, '2026-08-15T00:00:00.000Z', 'active', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_listings (id, concept_id, branch_id, brand_name, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('purenex-gardenview', 'concept-purenex', 'branch-gardenview', NULL, 'low_stock', 430, '1.5 km (synthetic)', 2, '2026-08-17T00:00:00.000Z', 'active', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO medicine_listings (id, concept_id, branch_id, brand_name, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('zephyrium-harbourline', 'concept-zephyrium', 'branch-harbourline', NULL, 'in_stock', 710, '1.8 km (synthetic)', 2, '2026-08-17T00:00:00.000Z', 'active', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
-- Deliberately stale/excluded: listing_state is 'excluded' and
-- last_refreshed_at (2026-08-08) is 9 days before the fixture reference
-- instant (2026-08-17), past the 7-day search eligibility window. It is
-- never present in public_search_projection or public_search_terms below.
INSERT INTO medicine_listings (id, concept_id, branch_id, brand_name, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('excludex-solandra-ineligible', 'concept-excludex', 'branch-solandra', NULL, 'in_stock', 500, '1.0 km (synthetic)', 1, '2026-08-08T00:00:00.000Z', 'excluded', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');

INSERT INTO public_search_projection (listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, source_version, projection_version, schema_version, projected_at, created_at, updated_at) VALUES ('calorex-gardenview', 'Calorex Relief', NULL, 'Zephyramine', '200 mg', 'Capsule', 'Pack of 10', 'Gardenview Apothecary (synthetic)', 'garden', 'Synthetic directions: near the garden synthetic checkpoint (fixture data only).', 'in_stock', 1120, '0.8 km (synthetic)', 1, '2026-08-17T00:00:00.000Z', 1, 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_projection (listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, source_version, projection_version, schema_version, projected_at, created_at, updated_at) VALUES ('nivaprin-marketside', 'Nivaprin', 'Nivaprin Rapid', 'Bentholine', '500 mg', 'Tablet', 'Pack of 20', 'Marketside Pharmacy (synthetic)', 'market', 'Synthetic directions: near the market synthetic checkpoint (fixture data only).', 'low_stock', 790, '3.4 km (synthetic)', 4, '2026-08-16T00:00:00.000Z', 1, 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_projection (listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, source_version, projection_version, schema_version, projected_at, created_at, updated_at) VALUES ('nivaprin-solandra', 'Nivaprin', 'Nivaprin Rapid', 'Bentholine', '500 mg', 'Tablet', 'Pack of 20', 'Solandra Pharmacy (synthetic)', 'harbour', 'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).', 'in_stock', 850, '1.2 km (synthetic)', 1, '2026-08-17T00:00:00.000Z', 1, 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_projection (listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, source_version, projection_version, schema_version, projected_at, created_at, updated_at) VALUES ('purenex-gardenview', 'Purenex', NULL, 'Sanolithine', '5 mg', 'Tablet', 'Pack of 14', 'Gardenview Apothecary (synthetic)', 'garden', 'Synthetic directions: near the garden synthetic checkpoint (fixture data only).', 'low_stock', 430, '1.5 km (synthetic)', 2, '2026-08-17T00:00:00.000Z', 1, 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_projection (listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, source_version, projection_version, schema_version, projected_at, created_at, updated_at) VALUES ('quandryl-harbourline', 'Quandryl', NULL, 'Marisolvin', '10 mg', 'Tablet', 'Pack of 30', 'Harbourline Pharmacy (synthetic)', 'harbour', 'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).', 'unavailable', 640, '2.1 km (synthetic)', 2, '2026-08-15T00:00:00.000Z', 1, 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_projection (listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, source_version, projection_version, schema_version, projected_at, created_at, updated_at) VALUES ('trelavex-marketside', 'Trelavex', NULL, 'Halvonide', '50 mg', 'Ointment', '30 g tube', 'Marketside Pharmacy (synthetic)', 'market', 'Synthetic directions: near the market synthetic checkpoint (fixture data only).', 'in_stock', 990, '3.0 km (synthetic)', 3, '2026-08-15T00:00:00.000Z', 1, 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_projection (listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, source_version, projection_version, schema_version, projected_at, created_at, updated_at) VALUES ('zephyrium-harbourline', 'Zephyrium', NULL, 'Corvaline', '100 mg', 'Capsule', 'Pack of 20', 'Harbourline Pharmacy (synthetic)', 'harbour', 'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).', 'in_stock', 710, '1.8 km (synthetic)', 2, '2026-08-17T00:00:00.000Z', 1, 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');

INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('calorex-gardenview', 'alt', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('calorex-gardenview', 'calorex', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('calorex-gardenview', 'calorex', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('calorex-gardenview', 'forte', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('calorex-gardenview', 'relief', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('calorex-gardenview', 'zephyramine', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('calorex-gardenview', 'zephyramine', 'ingredient', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-marketside', 'bentholine', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-marketside', 'bentholine', 'ingredient', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-marketside', 'nivaprin', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-marketside', 'rapid', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-marketside', 'relief', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-solandra', 'bentholine', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-solandra', 'bentholine', 'ingredient', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-solandra', 'nivaprin', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-solandra', 'rapid', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('nivaprin-solandra', 'relief', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('purenex-gardenview', 'mild', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('purenex-gardenview', 'purenex', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('purenex-gardenview', 'sanolithine', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('purenex-gardenview', 'sanolithine', 'ingredient', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('quandryl-harbourline', 'marisolvin', 'ingredient', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('quandryl-harbourline', 'quandryl', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('trelavex-marketside', 'cream', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('trelavex-marketside', 'halvonide', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('trelavex-marketside', 'halvonide', 'ingredient', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('trelavex-marketside', 'trelavex', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('zephyrium-harbourline', 'corvaline', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('zephyrium-harbourline', 'corvaline', 'ingredient', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('zephyrium-harbourline', 'plus', 'alias', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
INSERT INTO public_search_terms (listing_id, normalized_term, match_kind, schema_version, created_at, updated_at) VALUES ('zephyrium-harbourline', 'zephyrium', 'product', 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z');
