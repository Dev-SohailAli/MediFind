import { describe, expect, it } from 'vitest';

import {
  parsePublicSearchResponse,
  parsePublicSearchResultItem,
  type PublicSearchResultItem,
} from '../index.js';

/**
 * Synthetic fixture values only, reused from
 * apps/web/src/search/__tests__/searchClient.test.ts. None of these values
 * describe a real medicine, pharmacy, buyer or production record.
 */
function validItem(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'listing-nivaprin-solandra',
    medicineDisplayName: 'Nivaprin',
    brandName: 'Nivaprin Core',
    activeIngredientDisplayName: 'Bentholine',
    strength: '500 mg',
    dosageForm: 'Tablet',
    packDescription: 'Pack of 20',
    pharmacyDisplayName: 'Solandra Pharmacy',
    syntheticArea: 'harbour',
    directionText: 'Synthetic direction text',
    availabilityState: 'in_stock',
    priceFjdMinor: 1299,
    syntheticDistanceLabel: '2 synthetic km',
    syntheticDistanceRank: 2,
    lastRefreshedAt: '2026-08-17T00:00:00.000Z',
    ...overrides,
  };
}

function validResponse(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    results: [validItem()],
    page: 1,
    pageSize: 20,
    total: 1,
    hasMore: false,
    ...overrides,
  };
}

describe('parsePublicSearchResultItem', () => {
  it('accepts a valid synthetic result item and returns exactly the allow-listed public fields', () => {
    const parsed = parsePublicSearchResultItem(validItem());

    expect(parsed).toEqual({
      id: 'listing-nivaprin-solandra',
      medicineDisplayName: 'Nivaprin',
      brandName: 'Nivaprin Core',
      activeIngredientDisplayName: 'Bentholine',
      strength: '500 mg',
      dosageForm: 'Tablet',
      packDescription: 'Pack of 20',
      pharmacyDisplayName: 'Solandra Pharmacy',
      syntheticArea: 'harbour',
      directionText: 'Synthetic direction text',
      availabilityState: 'in_stock',
      priceFjdMinor: 1299,
      syntheticDistanceLabel: '2 synthetic km',
      syntheticDistanceRank: 2,
      lastRefreshedAt: '2026-08-17T00:00:00.000Z',
    } satisfies PublicSearchResultItem);
  });

  it('allows a null brandName', () => {
    const parsed = parsePublicSearchResultItem(validItem({ brandName: null }));
    expect(parsed.brandName).toBeNull();
  });

  it('strips unknown/internal fields such as internalState from the returned object', () => {
    const parsed = parsePublicSearchResultItem(
      validItem({
        internalState: 'moderation-pending',
        sourceId: 'source-internal-001',
        moderationNotes: 'internal only',
      }),
    ) as unknown as Record<string, unknown>;

    expect(parsed).not.toHaveProperty('internalState');
    expect(parsed).not.toHaveProperty('sourceId');
    expect(parsed).not.toHaveProperty('moderationNotes');
    expect(Object.keys(parsed).sort()).toEqual(
      [
        'id',
        'medicineDisplayName',
        'brandName',
        'activeIngredientDisplayName',
        'strength',
        'dosageForm',
        'packDescription',
        'pharmacyDisplayName',
        'syntheticArea',
        'directionText',
        'availabilityState',
        'priceFjdMinor',
        'syntheticDistanceLabel',
        'syntheticDistanceRank',
        'lastRefreshedAt',
      ].sort(),
    );
  });
});

describe('parsePublicSearchResponse', () => {
  it('accepts a valid synthetic search envelope', () => {
    const parsed = parsePublicSearchResponse(validResponse());

    expect(parsed).toEqual({
      results: [
        {
          id: 'listing-nivaprin-solandra',
          medicineDisplayName: 'Nivaprin',
          brandName: 'Nivaprin Core',
          activeIngredientDisplayName: 'Bentholine',
          strength: '500 mg',
          dosageForm: 'Tablet',
          packDescription: 'Pack of 20',
          pharmacyDisplayName: 'Solandra Pharmacy',
          syntheticArea: 'harbour',
          directionText: 'Synthetic direction text',
          availabilityState: 'in_stock',
          priceFjdMinor: 1299,
          syntheticDistanceLabel: '2 synthetic km',
          syntheticDistanceRank: 2,
          lastRefreshedAt: '2026-08-17T00:00:00.000Z',
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
      hasMore: false,
    } satisfies ReturnType<typeof parsePublicSearchResponse>);
  });

  it('sanitizes an unknown/internal field on a nested result item', () => {
    const parsed = parsePublicSearchResponse(
      validResponse({ results: [validItem({ internalState: 'moderation-pending' })] }),
    );

    expect(parsed.results[0]).not.toHaveProperty('internalState');
  });

  it.each([
    ['null envelope', null],
    ['missing results', { page: 1, pageSize: 20, total: 0, hasMore: false }],
    ['results is not an array', { results: {}, page: 1, pageSize: 20, total: 0, hasMore: false }],
    ['missing result field', { results: [{}], page: 1, pageSize: 20, total: 1, hasMore: false }],
    ['invalid area', validResponse({ results: [validItem({ syntheticArea: 'space-station' })] })],
    [
      'invalid availability',
      validResponse({ results: [validItem({ availabilityState: 'maybe' })] }),
    ],
    ['negative price', validResponse({ results: [validItem({ priceFjdMinor: -1 })] })],
    [
      'fractional distance rank',
      validResponse({ results: [validItem({ syntheticDistanceRank: 1.5 })] }),
    ],
    [
      'invalid timestamp',
      validResponse({ results: [validItem({ lastRefreshedAt: 'not-a-date' })] }),
    ],
    ['negative page', validResponse({ page: 0 })],
    ['fractional page size', validResponse({ pageSize: 1.5 })],
    ['negative total', validResponse({ total: -1 })],
    ['non-boolean hasMore', validResponse({ hasMore: 'false' })],
  ])('rejects: %s', (_name, input) => {
    expect(() => parsePublicSearchResponse(input)).toThrow('Invalid public search response');
  });
});

describe('parsePublicSearchResultItem invalid input', () => {
  it.each([
    ['null item', null],
    ['missing result field', {}],
    ['invalid area', validItem({ syntheticArea: 'space-station' })],
    ['invalid availability', validItem({ availabilityState: 'maybe' })],
    ['negative price', validItem({ priceFjdMinor: -1 })],
    ['fractional distance rank', validItem({ syntheticDistanceRank: 1.5 })],
    ['invalid timestamp', validItem({ lastRefreshedAt: 'not-a-date' })],
  ])('rejects: %s', (_name, input) => {
    expect(() => parsePublicSearchResultItem(input)).toThrow('Invalid public search response');
  });
});
