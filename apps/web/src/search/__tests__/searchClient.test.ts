import { describe, expect, it, vi } from 'vitest';

import type { PublicSearchResponse } from '@medifind/contracts';

import { fetchWorkerSearch } from '../searchClient';

const apiResponse: PublicSearchResponse = {
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
};

describe('fetchWorkerSearch', () => {
  it('keeps the browse state local and does not call the Worker for an empty query', async () => {
    const fetchMock = vi.fn();

    const outcome = await fetchWorkerSearch(
      { query: '   ', sort: 'relevance', selectedArea: null },
      fetchMock,
    );

    expect(outcome).toEqual({ isEmptyQuery: true, rows: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('requests only the bounded public search route and maps the response to the web result contract', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(apiResponse), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const outcome = await fetchWorkerSearch(
      { query: 'Nivaprin', sort: 'price_low_to_high', selectedArea: 'harbour' },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/^\/v1\/search\?/), {
      headers: { accept: 'application/json' },
    });
    const requestedUrl = new URL(`http://worker.local${fetchMock.mock.calls[0]?.[0] as string}`);
    expect(Object.fromEntries(requestedUrl.searchParams)).toEqual({
      query: 'Nivaprin',
      sort: 'price_low_to_high',
      page: '1',
      pageSize: '20',
      area: 'harbour',
    });
    expect(outcome.isEmptyQuery).toBe(false);
    expect(outcome.rows[0]?.listing).toMatchObject({
      id: 'listing-nivaprin-solandra',
      medicineDisplayName: 'Nivaprin',
      availability: 'in_stock',
      priceFjdMinor: 1299,
      searchEligible: true,
    });
    expect(outcome.rows[0]?.matchKind).toBe('exact_product');
  });

  it('maps non-success responses to a generic local error without exposing the response body', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('D1_ERROR: internal database path', { status: 503 }));

    await expect(
      fetchWorkerSearch({ query: 'Nivaprin', sort: 'relevance', selectedArea: null }, fetchMock),
    ).rejects.toThrow('Worker search unavailable');
  });
});
