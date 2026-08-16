import { describe, expect, it } from 'vitest';
import type { SyntheticSearchListing } from '@medifind/contracts';

import { classifyMatch } from '../match';
import { normalizeText, tokenize } from '../normalize';

const listing: SyntheticSearchListing = {
  id: 'test-listing',
  medicineDisplayName: 'Calorex Relief',
  activeIngredientDisplayName: 'Zephyramine',
  strength: '200 mg',
  dosageForm: 'Capsule',
  packDescription: 'Pack of 10',
  aliases: ['zephyramine forte', 'calorex alt'],
  pharmacyDisplayName: 'Gardenview Apothecary (synthetic)',
  syntheticArea: 'garden',
  syntheticDistanceLabel: '0.8 km (synthetic)',
  syntheticDistanceRank: 1,
  availability: 'in_stock',
  priceFjdMinor: 1120,
  freshness: 'current',
  lastUpdatedDisplay: 'Today',
  searchEligible: true,
};

function tokensFor(query: string): string[] {
  return tokenize(normalizeText(query));
}

describe('classifyMatch', () => {
  it('classifies a display-name hit as exact_product', () => {
    expect(classifyMatch(listing, tokensFor('Calorex'))).toBe('exact_product');
  });

  it('classifies a prefix of the display name as exact_product', () => {
    expect(classifyMatch(listing, tokensFor('Calo'))).toBe('exact_product');
  });

  it('classifies an active-ingredient hit as active_ingredient, never exact_product', () => {
    expect(classifyMatch(listing, tokensFor('Zephyramine'))).toBe('active_ingredient');
  });

  it('classifies an approved alias hit as active_ingredient', () => {
    expect(classifyMatch(listing, tokensFor('calorex alt'))).toBe('active_ingredient');
  });

  it('returns null for an unrelated query (no fuzzy/semantic invention)', () => {
    expect(classifyMatch(listing, tokensFor('unrelated query term'))).toBeNull();
  });

  it('does not match a query that is only a suffix, not a prefix', () => {
    expect(classifyMatch(listing, tokensFor('orex'))).toBeNull();
  });
});
