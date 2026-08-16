import { describe, expect, it } from 'vitest';
import type { SyntheticSearchListing } from '@medifind/contracts';

import { syntheticListings } from '../../fixtures/syntheticListings';
import {
  MAX_RESULTS_PER_PAGE,
  MAX_RESULTS_PER_QUERY,
  paginate,
  searchListings,
} from '../searchListings';

describe('searchListings', () => {
  it('renders the safe empty/browse state for an empty query', () => {
    const outcome = searchListings(syntheticListings, {
      query: '',
      sort: 'relevance',
      selectedArea: null,
    });

    expect(outcome.isEmptyQuery).toBe(true);
    expect(outcome.rows).toEqual([]);
  });

  it('returns the same result set for case/whitespace/punctuation query variants', () => {
    const variants = ['Nivaprin', 'nivaprin', '  NIVAPRIN  ', 'Nivaprin.', 'Nivaprin!!'];

    const resultSets = variants.map((query) =>
      searchListings(syntheticListings, { query, sort: 'relevance', selectedArea: null }).rows.map(
        (row) => row.listing.id,
      ),
    );

    for (const resultSet of resultSets) {
      expect(resultSet).toEqual(resultSets[0]);
    }
    expect(resultSets[0]?.length).toBeGreaterThan(0);
  });

  it('labels an approved alias/active-ingredient query as active_ingredient, never exact_product', () => {
    const outcome = searchListings(syntheticListings, {
      query: 'zephyramine',
      sort: 'relevance',
      selectedArea: null,
    });

    expect(outcome.rows.length).toBeGreaterThan(0);
    for (const row of outcome.rows) {
      expect(row.matchKind).toBe('active_ingredient');
    }
  });

  it('never excludes/merges results across pharmacies for the same medicine', () => {
    const outcome = searchListings(syntheticListings, {
      query: 'nivaprin',
      sort: 'relevance',
      selectedArea: null,
    });

    const pharmacyNames = outcome.rows.map((row) => row.listing.pharmacyDisplayName);
    expect(new Set(pharmacyNames).size).toBe(pharmacyNames.length);
    expect(pharmacyNames.length).toBeGreaterThanOrEqual(2);
  });

  it('excludes a searchEligible:false fixture even when every other field matches', () => {
    const ineligible = syntheticListings.find((listing) => !listing.searchEligible);
    expect(ineligible).toBeDefined();

    const outcome = searchListings(syntheticListings, {
      query: ineligible!.medicineDisplayName,
      sort: 'relevance',
      selectedArea: null,
    });

    expect(outcome.rows.some((row) => row.listing.id === ineligible!.id)).toBe(false);
  });

  it('returns zero rows for a query that matches nothing (safe zero-result state)', () => {
    const outcome = searchListings(syntheticListings, {
      query: 'zzz-not-a-real-fixture-zzz',
      sort: 'relevance',
      selectedArea: null,
    });

    expect(outcome.isEmptyQuery).toBe(false);
    expect(outcome.rows).toEqual([]);
  });

  it('fixtures cover in_stock, low_stock, unavailable and may_be_outdated states', () => {
    const availabilities = new Set(syntheticListings.map((listing) => listing.availability));
    const freshnesses = new Set(syntheticListings.map((listing) => listing.freshness));

    expect(availabilities).toEqual(new Set(['in_stock', 'low_stock', 'unavailable']));
    expect(freshnesses.has('may_be_outdated')).toBe(true);
  });

  it('no fixture exposes an exact stock quantity field', () => {
    for (const listing of syntheticListings) {
      expect(Object.keys(listing)).not.toContain('quantity');
      expect(Object.keys(listing)).not.toContain('stockQuantity');
    }
  });

  it('no searchEligible:true fixture is older than the seven-day unrefreshed-removal threshold', () => {
    // docs/data-and-search.md: "A listing that remains unrefreshed for seven
    // days is removed from search until its pharmacy refreshes it." A
    // searchEligible:true fixture with a display age of 7+ days would
    // contradict that policy.
    const daysAgo = (label: string): number => {
      if (label === 'Today') return 0;
      if (label === 'Yesterday') return 1;
      const match = /^(\d+) days ago$/.exec(label);
      return match ? Number(match[1]) : 0;
    };

    for (const listing of syntheticListings) {
      if (listing.searchEligible) {
        expect(daysAgo(listing.lastUpdatedDisplay)).toBeLessThan(7);
      }
    }
  });

  it('orders default relevance by match kind before freshness before price', () => {
    const controlled: SyntheticSearchListing[] = [
      {
        id: 'b-stale-exact',
        medicineDisplayName: 'Ordotest',
        activeIngredientDisplayName: 'Ordamine',
        strength: '1 mg',
        dosageForm: 'Tablet',
        packDescription: 'Pack of 1',
        aliases: [],
        pharmacyDisplayName: 'Ordo Pharmacy (synthetic)',
        syntheticArea: 'harbour',
        syntheticDistanceLabel: '1 km (synthetic)',
        syntheticDistanceRank: 1,
        availability: 'in_stock',
        priceFjdMinor: 200,
        freshness: 'may_be_outdated',
        lastUpdatedDisplay: '9 days ago',
        searchEligible: true,
      },
      {
        id: 'a-current-exact',
        medicineDisplayName: 'Ordotest',
        activeIngredientDisplayName: 'Ordamine',
        strength: '1 mg',
        dosageForm: 'Tablet',
        packDescription: 'Pack of 1',
        aliases: [],
        pharmacyDisplayName: 'Ordo Second Pharmacy (synthetic)',
        syntheticArea: 'harbour',
        syntheticDistanceLabel: '1 km (synthetic)',
        syntheticDistanceRank: 1,
        availability: 'in_stock',
        priceFjdMinor: 100,
        freshness: 'current',
        lastUpdatedDisplay: 'Today',
        searchEligible: true,
      },
      {
        id: 'c-ingredient-only',
        medicineDisplayName: 'Unrelated Display Name',
        activeIngredientDisplayName: 'Ordotest',
        strength: '1 mg',
        dosageForm: 'Tablet',
        packDescription: 'Pack of 1',
        aliases: [],
        pharmacyDisplayName: 'Ordo Third Pharmacy (synthetic)',
        syntheticArea: 'harbour',
        syntheticDistanceLabel: '1 km (synthetic)',
        syntheticDistanceRank: 1,
        availability: 'in_stock',
        priceFjdMinor: 50,
        freshness: 'current',
        lastUpdatedDisplay: 'Today',
        searchEligible: true,
      },
    ];

    const outcome = searchListings(controlled, {
      query: 'ordotest',
      sort: 'relevance',
      selectedArea: null,
    });

    // Both exact_product rows outrank the active_ingredient-only row despite
    // its lower price, and within exact_product the current listing outranks
    // the stale one despite its higher price.
    expect(outcome.rows.map((row) => row.listing.id)).toEqual([
      'a-current-exact',
      'b-stale-exact',
      'c-ingredient-only',
    ]);
  });

  it('is deterministic: repeated calls with identical input produce identical order', () => {
    const run = () =>
      searchListings(syntheticListings, {
        query: 'nivaprin',
        sort: 'relevance',
        selectedArea: null,
      }).rows.map((row) => row.listing.id);

    expect(run()).toEqual(run());
  });

  it('price_low_to_high sort is ascending by priceFjdMinor', () => {
    const outcome = searchListings(syntheticListings, {
      query: 'nivaprin',
      sort: 'price_low_to_high',
      selectedArea: null,
    });

    expect(outcome.rows.length).toBeGreaterThan(1);
    const prices = outcome.rows.map((row) => row.listing.priceFjdMinor);
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  it("distance sort ranks the selected area's listings first", () => {
    const outcome = searchListings(syntheticListings, {
      query: 'nivaprin',
      sort: 'distance',
      selectedArea: 'market',
    });

    expect(outcome.rows.length).toBeGreaterThan(1);
    expect(outcome.rows[0]?.listing.syntheticArea).toBe('market');
  });

  it('selecting a manual area only changes distance context, not the matched result set', () => {
    const withoutArea = searchListings(syntheticListings, {
      query: 'nivaprin',
      sort: 'relevance',
      selectedArea: null,
    }).rows.map((row) => row.listing.id);
    const withArea = searchListings(syntheticListings, {
      query: 'nivaprin',
      sort: 'relevance',
      selectedArea: 'harbour',
    }).rows.map((row) => row.listing.id);

    expect(new Set(withArea)).toEqual(new Set(withoutArea));
  });

  it('caps results at MAX_RESULTS_PER_QUERY for a broad query against a large synthetic collection', () => {
    const generated: SyntheticSearchListing[] = Array.from({ length: 150 }, (_, index) => ({
      id: `generated-${index}`,
      medicineDisplayName: `Genericol ${index}`,
      activeIngredientDisplayName: 'Genericolamine',
      strength: '1 mg',
      dosageForm: 'Tablet',
      packDescription: 'Pack of 1',
      aliases: [],
      pharmacyDisplayName: `Generated Pharmacy ${index} (synthetic)`,
      syntheticArea: 'harbour',
      syntheticDistanceLabel: '1 km (synthetic)',
      syntheticDistanceRank: index,
      availability: 'in_stock',
      priceFjdMinor: 100 + index,
      freshness: 'current',
      lastUpdatedDisplay: 'Today',
      searchEligible: true,
    }));

    const outcome = searchListings(generated, {
      query: 'Genericol',
      sort: 'relevance',
      selectedArea: null,
    });

    expect(generated.length).toBeGreaterThan(MAX_RESULTS_PER_QUERY);
    expect(outcome.rows).toHaveLength(MAX_RESULTS_PER_QUERY);
  });
});

describe('paginate', () => {
  it('reveals MAX_RESULTS_PER_PAGE rows at a time and reports hasMore correctly', () => {
    const rows = Array.from({ length: 45 }, (_, index) => index);

    const firstPage = paginate(rows, MAX_RESULTS_PER_PAGE);
    expect(firstPage.visible).toHaveLength(MAX_RESULTS_PER_PAGE);
    expect(firstPage.hasMore).toBe(true);

    const secondPage = paginate(rows, MAX_RESULTS_PER_PAGE * 2);
    expect(secondPage.visible).toHaveLength(MAX_RESULTS_PER_PAGE * 2);
    expect(secondPage.hasMore).toBe(true);

    const finalPage = paginate(rows, rows.length);
    expect(finalPage.visible).toHaveLength(rows.length);
    expect(finalPage.hasMore).toBe(false);
  });
});
