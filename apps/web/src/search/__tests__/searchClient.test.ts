import { afterEach, describe, expect, it, vi } from 'vitest';

import type { PublicSearchResponse, PublicSearchResultItem } from '@medifind/contracts';

import { fetchWorkerSearch, fetchWorkerListing, isWorkerSearchMode } from '../searchClient';

describe('isWorkerSearchMode', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is false when VITE_MEDIFIND_SEARCH_MODE is unset', () => {
    vi.stubEnv('VITE_MEDIFIND_SEARCH_MODE', undefined);

    expect(isWorkerSearchMode()).toBe(false);
  });

  it('is true only when VITE_MEDIFIND_SEARCH_MODE is exactly "worker"', () => {
    vi.stubEnv('VITE_MEDIFIND_SEARCH_MODE', 'worker');

    expect(isWorkerSearchMode()).toBe(true);
  });

  it('is false for any other value, such as "fixture"', () => {
    vi.stubEnv('VITE_MEDIFIND_SEARCH_MODE', 'fixture');

    expect(isWorkerSearchMode()).toBe(false);
  });
});

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

const listingItem: PublicSearchResultItem = {
  id: 'listing/nivaprin',
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

    try {
      await fetchWorkerSearch(
        { query: 'Nivaprin', sort: 'relevance', selectedArea: null },
        fetchMock,
      );
      throw new Error('expected fetchWorkerSearch to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('D1_ERROR');
      expect(message).not.toContain('internal database path');
      expect(message).not.toContain('503');
    }
  });

  it('accepts a valid response even when a result item carries an unknown internal field', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...apiResponse,
          results: [{ ...apiResponse.results[0], internalState: 'moderation-pending' }],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    const outcome = await fetchWorkerSearch(
      { query: 'Nivaprin', sort: 'relevance', selectedArea: null },
      fetchMock,
    );

    expect(outcome.isEmptyQuery).toBe(false);
    expect(outcome.rows[0]?.listing.id).toBe('listing-nivaprin-solandra');
  });

  it('rejects a response missing envelope pagination fields as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ results: apiResponse.results }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    try {
      await fetchWorkerSearch(
        { query: 'Nivaprin', sort: 'relevance', selectedArea: null },
        fetchMock,
      );
      throw new Error('expected fetchWorkerSearch to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('page');
      expect(message).not.toContain('pageSize');
      expect(message).not.toContain('total');
    }
  });

  it('rejects a response with an invalid item enum value as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...apiResponse,
          results: [{ ...apiResponse.results[0], availabilityState: 'maybe' }],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    try {
      await fetchWorkerSearch(
        { query: 'Nivaprin', sort: 'relevance', selectedArea: null },
        fetchMock,
      );
      throw new Error('expected fetchWorkerSearch to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('maybe');
      expect(message).not.toContain('availabilityState');
    }
  });

  it('rejects a response with a negative item price as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...apiResponse,
          results: [{ ...apiResponse.results[0], priceFjdMinor: -1 }],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    try {
      await fetchWorkerSearch(
        { query: 'Nivaprin', sort: 'relevance', selectedArea: null },
        fetchMock,
      );
      throw new Error('expected fetchWorkerSearch to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('-1');
      expect(message).not.toContain('priceFjdMinor');
    }
  });

  it('rejects a response with an invalid item timestamp as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...apiResponse,
          results: [{ ...apiResponse.results[0], lastRefreshedAt: 'not-a-date' }],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    try {
      await fetchWorkerSearch(
        { query: 'Nivaprin', sort: 'relevance', selectedArea: null },
        fetchMock,
      );
      throw new Error('expected fetchWorkerSearch to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('not-a-date');
      expect(message).not.toContain('lastRefreshedAt');
    }
  });

  it('rejects invalid JSON bodies as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('not-json{', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    try {
      await fetchWorkerSearch(
        { query: 'Nivaprin', sort: 'relevance', selectedArea: null },
        fetchMock,
      );
      throw new Error('expected fetchWorkerSearch to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('not-json');
      expect(message).not.toContain('{');
      expect(message).not.toContain('Unexpected token');
    }
  });

  it('never leaks the raw body, field value, provider path or JSON in the rejection message', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('D1_ERROR: internal database path', { status: 503 }));

    try {
      await fetchWorkerSearch(
        { query: 'Nivaprin', sort: 'relevance', selectedArea: null },
        fetchMock,
      );
      throw new Error('expected fetchWorkerSearch to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('D1_ERROR');
      expect(message).not.toContain('internal database path');
      expect(message).not.toContain('{');
    }
  });
});

describe('fetchWorkerListing', () => {
  it('requests the bounded public listing route and maps the response to the web result contract', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(listingItem), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const listing = await fetchWorkerListing('listing/nivaprin', fetchMock);

    expect(fetchMock).toHaveBeenCalledWith('/v1/listings/listing%2Fnivaprin', {
      headers: { accept: 'application/json' },
    });
    expect(listing).toMatchObject({
      id: 'listing/nivaprin',
      medicineDisplayName: 'Nivaprin',
      brandName: 'Nivaprin Core',
      activeIngredientDisplayName: 'Bentholine',
      strength: '500 mg',
      dosageForm: 'Tablet',
      packDescription: 'Pack of 20',
      aliases: [],
      pharmacyDisplayName: 'Solandra Pharmacy',
      syntheticArea: 'harbour',
      syntheticDistanceLabel: '2 synthetic km',
      syntheticDistanceRank: 2,
      availability: 'in_stock',
      priceFjdMinor: 1299,
      freshness: 'current',
      lastUpdatedDisplay: '2026-08-17T00:00:00.000Z',
      searchEligible: true,
    });
    expect(listing).not.toHaveProperty('directionText');
  });

  it('rejects a network error as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network timeout'));

    try {
      await fetchWorkerListing('listing/nivaprin', fetchMock);
      throw new Error('expected fetchWorkerListing to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('Network timeout');
      expect(message).not.toContain('timeout');
    }
  });

  it('rejects a non-success response with provider/D1 body as the generic unavailable error', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('D1_ERROR: internal database path', { status: 503 }));

    try {
      await fetchWorkerListing('listing/nivaprin', fetchMock);
      throw new Error('expected fetchWorkerListing to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('D1_ERROR');
      expect(message).not.toContain('internal database path');
      expect(message).not.toContain('503');
    }
  });

  it('rejects invalid JSON responses as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('not-json{', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    try {
      await fetchWorkerListing('listing/nivaprin', fetchMock);
      throw new Error('expected fetchWorkerListing to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('not-json');
      expect(message).not.toContain('{');
      expect(message).not.toContain('Unexpected token');
    }
  });

  it('rejects a response with a malformed public item as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...listingItem,
          availabilityState: 'maybe',
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    );

    try {
      await fetchWorkerListing('listing/nivaprin', fetchMock);
      throw new Error('expected fetchWorkerListing to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('maybe');
      expect(message).not.toContain('availabilityState');
    }
  });

  it('rejects a response where the returned ID differs from the requested ID as the generic unavailable error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...listingItem,
          id: 'listing-different-id',
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    );

    try {
      await fetchWorkerListing('listing/nivaprin', fetchMock);
      throw new Error('expected fetchWorkerListing to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('listing-different-id');
      expect(message).not.toContain('listing-nivaprin-solandra');
      expect(message).not.toContain('listing/nivaprin');
    }
  });

  it('never leaks the raw body, ID details, provider path or parser message in the rejection', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('D1_ERROR: internal database path', { status: 503 }));

    try {
      await fetchWorkerListing('listing/nivaprin', fetchMock);
      throw new Error('expected fetchWorkerListing to reject');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toBe('Worker search unavailable');
      expect(message).not.toContain('D1_ERROR');
      expect(message).not.toContain('internal database path');
      expect(message).not.toContain('listing/nivaprin');
      expect(message).not.toContain('{');
    }
  });

  it('uses only one encoded path segment with no query string or second route segment', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ ...listingItem, id: 'id-with/slash?query#anchor and spaces' }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    );

    await fetchWorkerListing('id-with/slash?query#anchor and spaces', fetchMock);

    expect(fetchMock).toHaveBeenCalledWith(
      '/v1/listings/id-with%2Fslash%3Fquery%23anchor%20and%20spaces',
      {
        headers: { accept: 'application/json' },
      },
    );
    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain('?');
    expect(url).not.toMatch(/\/v1\/listings\/.*\/.+/);
  });
});
