import type {
  PublicSearchResponse,
  PublicSearchResultItem,
  SyntheticSearchListing,
} from '@medifind/contracts';

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

function parseWorkerResponse(value: unknown): PublicSearchResponse {
  if (
    typeof value !== 'object' ||
    value === null ||
    !Array.isArray((value as { results?: unknown }).results)
  ) {
    throw new Error('Worker search unavailable');
  }

  return value as PublicSearchResponse;
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

  let response: Response;
  try {
    response = await fetchImpl(`/v1/search?${params.toString()}`, {
      headers: { accept: 'application/json' },
    });
  } catch {
    throw new Error('Worker search unavailable');
  }

  if (!response.ok) {
    throw new Error('Worker search unavailable');
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Worker search unavailable');
  }

  const body = parseWorkerResponse(payload);
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
