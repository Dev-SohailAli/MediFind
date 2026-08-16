import { describe, expect, it } from 'vitest';
import type { SyntheticSearchListing } from '@medifind/contracts';

import { getDisplayDistance } from '../distance';

const listing: SyntheticSearchListing = {
  id: 'test-listing',
  medicineDisplayName: 'Quandryl',
  activeIngredientDisplayName: 'Marisolvin',
  strength: '10 mg',
  dosageForm: 'Tablet',
  packDescription: 'Pack of 30',
  aliases: [],
  pharmacyDisplayName: 'Harbourline Pharmacy (synthetic)',
  syntheticArea: 'harbour',
  syntheticDistanceLabel: '2.1 km (synthetic)',
  syntheticDistanceRank: 2,
  availability: 'unavailable',
  priceFjdMinor: 640,
  freshness: 'current',
  lastUpdatedDisplay: '2 days ago',
  searchEligible: true,
};

describe('getDisplayDistance', () => {
  it("returns the fixture's own static distance when no area is selected", () => {
    expect(getDisplayDistance(listing, null)).toEqual({
      label: '2.1 km (synthetic)',
      rank: 2,
    });
  });

  it('marks a same-area listing as nearby when that area is selected', () => {
    const result = getDisplayDistance(listing, 'harbour');

    expect(result.rank).toBe(0);
    expect(result.label).toContain('Nearby');
  });

  it("keeps a different-area listing's own distance, ranked below same-area listings", () => {
    const result = getDisplayDistance(listing, 'market');

    expect(result.label).toBe('2.1 km (synthetic)');
    expect(result.rank).toBeGreaterThan(listing.syntheticDistanceRank);
  });

  it('never reads a real coordinate or device location field', () => {
    const source = getDisplayDistance.toString();

    expect(source).not.toMatch(/navigator\.geolocation/i);
    expect(source).not.toMatch(/latitude|longitude/i);
  });
});
