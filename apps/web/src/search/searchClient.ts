import { parsePublicSearchResponse, parsePublicSearchResultItem } from '@medifind/contracts';
import type { PublicSearchResultItem, SyntheticSearchListing } from '@medifind/contracts';

import { getDisplayDistance } from './distance';
import type { RankedRow } from './rank';
import { MAX_RESULTS_PER_PAGE, type SearchInput, type SearchOutcome } from './searchListings';

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export function isWorkerSearchMode(): boolean {
  return import.meta.env.VITE_MEDIFIND_SEARCH_MODE === 'worker';
}

function toSyntheticListing(item: PublicSearchResultItem): SyntheticSearchListing {
  return {
    id: item.id,
    medicineDisplayName: item.medicineDisplayName,
    brandName: item.brandName ?? undefined,
    activeIngredientDisplayName: item.activeIngredientDisplayName,
    strength: item.strength,
    dosageForm: item.dosageForm,
    packDescription: item.packDescription,
    aliases: [],
    pharmacyDisplayName: item.pharmacyDisplayName,
    syntheticArea: item.syntheticArea,
    syntheticDistanceLabel: item.syntheticDistanceLabel,
    syntheticDistanceRank: item.syntheticDistanceRank,
    availability: item.availabilityState,
    priceFjdMinor: item.priceFjdMinor,
    freshness: 'current',
    lastUpdatedDisplay: item.lastRefreshedAt,
    searchEligible: true,
  };
}

/**
 * Opt-in local Worker search adapter. It only calls the bounded public search
 * route and maps its public projection into the existing read-only UI shape.
 * The default web build does not invoke this adapter.
 */
export async function fetchWorkerSearch(
  input: SearchInput,
  fetchImpl: FetchLike = globalThis.fetch.bind(globalThis),
): Promise<SearchOutcome> {
  const query = input.query.trim();
  if (query.length === 0) {
    return { isEmptyQuery: true, rows: [] };
  }

  const params = new URLSearchParams({
    query,
    sort: input.sort,
    page: '1',
    pageSize: MAX_RESULTS_PER_PAGE.toString(),
  });
  if (input.selectedArea !== null) {
    params.set('area', input.selectedArea);
  }

  let body: ReturnType<typeof parsePublicSearchResponse>;
  try {
    const response = await fetchImpl(`/v1/search?${params.toString()}`, {
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Worker search unavailable');
    }

    const payload: unknown = await response.json();
    body = parsePublicSearchResponse(payload);
  } catch {
    throw new Error('Worker search unavailable');
  }

  const rows: RankedRow[] = body.results.map((item) => {
    const listing = toSyntheticListing(item);
    return {
      listing,
      matchKind: 'exact_product',
      displayDistance: getDisplayDistance(listing, input.selectedArea),
    };
  });

  return { isEmptyQuery: false, rows };
}

/**
 * Opt-in Worker listing detail adapter. Fetches a single listing by ID from the
 * bounded public listing route and maps it to the existing read-only UI shape.
 */
export async function fetchWorkerListing(
  listingId: string,
  fetchImpl: FetchLike = globalThis.fetch.bind(globalThis),
): Promise<SyntheticSearchListing> {
  let item: PublicSearchResultItem;
  try {
    const response = await fetchImpl(`/v1/listings/${encodeURIComponent(listingId)}`, {
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Worker search unavailable');
    }

    const payload: unknown = await response.json();
    item = parsePublicSearchResultItem(payload);
  } catch {
    throw new Error('Worker search unavailable');
  }

  // Verify the returned item ID matches the requested ID
  if (item.id !== listingId) {
    throw new Error('Worker search unavailable');
  }

  return toSyntheticListing(item);
}
