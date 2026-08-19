import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

import {
  medicineConcepts,
  medicineListings,
  pharmacyBranches,
  pharmacyOrganisations,
  publicSearchProjection,
  publicSearchTerms,
} from '../fixtures/task4SyntheticD1.js';
import { createFakeD1 } from './support/fakeD1.js';

const migrationPath = fileURLToPath(
  new URL('../../migrations/0001_task4_synthetic_search.sql', import.meta.url),
);

/**
 * Executes the real, committed migration SQL against an in-memory SQLite
 * database (node:sqlite — not a Cloudflare D1 binding, no network, no
 * account) and proves it produces exactly the accepted Task 4 shape: right
 * row counts, intact foreign keys, and content that is byte-identical to the
 * TypeScript fixture module the migration was generated from. This is the
 * "migration verification evidence" the Task 4 contract requires before any
 * D1 binding is ever wired in.
 */
describe('0001_task4_synthetic_search.sql migration', () => {
  it('applies cleanly and produces the exact accepted row counts', () => {
    const { db } = createFakeD1(migrationPath);

    const count = (table: string) =>
      (db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n;

    expect(count('medicine_concepts')).toBe(7);
    expect(count('pharmacy_organisations')).toBe(4);
    expect(count('pharmacy_branches')).toBe(4);
    expect(count('medicine_listings')).toBe(8);
    expect(count('public_search_projection')).toBe(7);
    expect(count('public_search_terms')).toBe(publicSearchTerms.length);
  });

  it('has no foreign-key integrity violation', () => {
    const { db } = createFakeD1(migrationPath);

    expect(db.prepare('PRAGMA foreign_key_check').all()).toEqual([]);
  });

  it('excludes the stale Excludex listing from the projection but keeps it in medicine_listings', () => {
    const { db } = createFakeD1(migrationPath);

    const listingRow = db
      .prepare('SELECT listing_state FROM medicine_listings WHERE id = ?')
      .get('excludex-solandra-ineligible');
    expect(listingRow).toEqual({ listing_state: 'excluded' });

    const projectionRow = db
      .prepare('SELECT * FROM public_search_projection WHERE listing_id = ?')
      .get('excludex-solandra-ineligible');
    expect(projectionRow).toBeUndefined();

    const termRows = db
      .prepare('SELECT * FROM public_search_terms WHERE listing_id = ?')
      .all('excludex-solandra-ineligible');
    expect(termRows).toEqual([]);
  });

  it('matches the medicine_concepts table exactly to the TypeScript fixture module (no drift)', () => {
    const { db } = createFakeD1(migrationPath);

    const rows = db
      .prepare(
        'SELECT id, display_name, active_ingredient_display_name, strength, dosage_form, pack_description, aliases_json, approval_state FROM medicine_concepts ORDER BY id',
      )
      .all() as Array<{
      id: string;
      display_name: string;
      active_ingredient_display_name: string;
      strength: string;
      dosage_form: string;
      pack_description: string;
      aliases_json: string;
      approval_state: string;
    }>;

    const expected = [...medicineConcepts]
      .map((c) => ({
        id: c.id,
        display_name: c.displayName,
        active_ingredient_display_name: c.activeIngredientDisplayName,
        strength: c.strength,
        dosage_form: c.dosageForm,
        pack_description: c.packDescription,
        aliases_json: JSON.stringify(c.aliases),
        approval_state: c.approvalState,
      }))
      .sort((a, b) => a.id.localeCompare(b.id));

    expect(rows).toEqual(expected);
  });

  it('matches public_search_projection exactly to the TypeScript fixture module (no drift)', () => {
    const { db } = createFakeD1(migrationPath);

    const rows = db
      .prepare(
        'SELECT listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, source_version FROM public_search_projection ORDER BY listing_id',
      )
      .all();

    const expected = [...publicSearchProjection]
      .map((p) => ({
        listing_id: p.listingId,
        medicine_display_name: p.medicineDisplayName,
        brand_name: p.brandName,
        active_ingredient_display_name: p.activeIngredientDisplayName,
        strength: p.strength,
        dosage_form: p.dosageForm,
        pack_description: p.packDescription,
        pharmacy_display_name: p.pharmacyDisplayName,
        synthetic_area: p.syntheticArea,
        direction_text: p.directionText,
        availability_state: p.availabilityState,
        price_fjd_minor: p.priceFjdMinor,
        synthetic_distance_label: p.syntheticDistanceLabel,
        synthetic_distance_rank: p.syntheticDistanceRank,
        last_refreshed_at: p.lastRefreshedAt,
        source_version: p.sourceVersion,
      }))
      .sort((a, b) => a.listing_id.localeCompare(b.listing_id));

    expect(rows).toEqual(expected);
  });

  it('matches public_search_terms exactly to the TypeScript fixture module (no drift)', () => {
    const { db } = createFakeD1(migrationPath);

    const rows = db
      .prepare(
        'SELECT listing_id, normalized_term, match_kind FROM public_search_terms ORDER BY listing_id, normalized_term, match_kind',
      )
      .all();

    const expected = [...publicSearchTerms]
      .map((t) => ({
        listing_id: t.listingId,
        normalized_term: t.normalizedTerm,
        match_kind: t.matchKind,
      }))
      .sort((a, b) =>
        a.listing_id !== b.listing_id
          ? a.listing_id.localeCompare(b.listing_id)
          : a.normalized_term !== b.normalized_term
            ? a.normalized_term.localeCompare(b.normalized_term)
            : a.match_kind.localeCompare(b.match_kind),
      );

    expect(rows).toEqual(expected);
  });

  it('matches pharmacy_organisations and pharmacy_branches row counts and area values to the fixture module', () => {
    const { db } = createFakeD1(migrationPath);

    const orgIds = (
      db.prepare('SELECT id FROM pharmacy_organisations ORDER BY id').all() as Array<{ id: string }>
    ).map((r) => r.id);
    expect(orgIds).toEqual([...pharmacyOrganisations].map((o) => o.id).sort());

    const branchAreas = db
      .prepare('SELECT id, synthetic_area FROM pharmacy_branches ORDER BY id')
      .all() as Array<{ id: string; synthetic_area: string }>;
    const expectedAreas = [...pharmacyBranches]
      .map((b) => ({ id: b.id, synthetic_area: b.syntheticArea }))
      .sort((a, b) => a.id.localeCompare(b.id));
    expect(branchAreas).toEqual(expectedAreas);
  });

  it('rejects an out-of-range CHECK-constrained value (schema enforces its own invariants)', () => {
    const { db } = createFakeD1(migrationPath);

    expect(() =>
      db
        .prepare(
          "INSERT INTO medicine_listings (id, concept_id, branch_id, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at, listing_state, identity_match_state, version, schema_version, created_at, updated_at) VALUES ('bad', 'concept-nivaprin', 'branch-solandra', 'not_a_real_state', 100, 'x', 0, '2026-08-17T00:00:00.000Z', 'active', 'approved', 1, 1, '2026-08-17T00:00:00.000Z', '2026-08-17T00:00:00.000Z')",
        )
        .run(),
    ).toThrow();
  });

  it('has the same number of medicine_listings rows as the fixture module (8, including the excluded one)', () => {
    expect(medicineListings).toHaveLength(8);
  });
});
