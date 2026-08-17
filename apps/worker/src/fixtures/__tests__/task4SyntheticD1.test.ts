import { describe, expect, it } from 'vitest';

import {
  medicineConcepts,
  medicineListings,
  pharmacyBranches,
  pharmacyOrganisations,
  publicSearchProjection,
  publicSearchTerms,
  SYNTHETIC_ONLY,
} from '../task4SyntheticD1.js';

describe('Task 4 synthetic D1 fixture set', () => {
  it('is marked synthetic-only', () => {
    expect(SYNTHETIC_ONLY).toBe(true);
  });

  it('matches the accepted row counts exactly (7/4/4/8 source rows, 7 projected)', () => {
    expect(medicineConcepts).toHaveLength(7);
    expect(pharmacyOrganisations).toHaveLength(4);
    expect(pharmacyBranches).toHaveLength(4);
    expect(medicineListings).toHaveLength(8);
    expect(publicSearchProjection).toHaveLength(7);
  });

  it('excludes the stale Excludex listing from the projection and its search terms', () => {
    expect(
      publicSearchProjection.some((row) => row.listingId === 'excludex-solandra-ineligible'),
    ).toBe(false);
    expect(
      publicSearchTerms.some((term) => term.listingId === 'excludex-solandra-ineligible'),
    ).toBe(false);
    expect(medicineListings.some((row) => row.id === 'excludex-solandra-ineligible')).toBe(true);
  });

  it('projects two listings for Nivaprin, both searchable by the Bentholine ingredient/alias', () => {
    const nivaprinRows = publicSearchProjection.filter(
      (row) => row.medicineDisplayName === 'Nivaprin',
    );
    expect(nivaprinRows).toHaveLength(2);
    expect(nivaprinRows.map((row) => row.listingId).sort()).toEqual([
      'nivaprin-marketside',
      'nivaprin-solandra',
    ]);

    for (const listingId of ['nivaprin-solandra', 'nivaprin-marketside']) {
      expect(
        publicSearchTerms.some(
          (term) => term.listingId === listingId && term.normalizedTerm === 'bentholine',
        ),
      ).toBe(true);
    }
  });

  it('retains every other listing price and availability exactly as the existing web fixture set', () => {
    const byId = new Map(publicSearchProjection.map((row) => [row.listingId, row]));

    expect(byId.get('calorex-gardenview')).toMatchObject({
      priceFjdMinor: 1120,
      availabilityState: 'in_stock',
    });
    expect(byId.get('quandryl-harbourline')).toMatchObject({
      priceFjdMinor: 640,
      availabilityState: 'unavailable',
    });
    expect(byId.get('trelavex-marketside')).toMatchObject({
      priceFjdMinor: 990,
      availabilityState: 'in_stock',
    });
    expect(byId.get('purenex-gardenview')).toMatchObject({
      priceFjdMinor: 430,
      availabilityState: 'low_stock',
    });
    expect(byId.get('zephyrium-harbourline')).toMatchObject({
      priceFjdMinor: 710,
      availabilityState: 'in_stock',
    });
  });

  it('never contains a prohibited field: no person name, phone, email, token or exact stock quantity', () => {
    const serialized = JSON.stringify({
      medicineConcepts,
      pharmacyOrganisations,
      pharmacyBranches,
      medicineListings,
      publicSearchProjection,
      publicSearchTerms,
    });

    expect(serialized).not.toMatch(/@[\w-]+\.\w+/); // email-shaped
    expect(serialized).not.toMatch(/\+?\d{7,}/); // phone-shaped digit runs
    expect(serialized).not.toMatch(/token|secret|password|prescription/i);
  });
});
