import type {
  SyntheticArea,
  SyntheticMatchKind,
  SyntheticSearchListing,
  SyntheticSort,
} from '@medifind/contracts';

import type { DisplayDistance } from './distance';

export interface RankedRow {
  listing: SyntheticSearchListing;
  matchKind: SyntheticMatchKind;
  displayDistance: DisplayDistance;
}

function matchKindRank(kind: SyntheticMatchKind): number {
  switch (kind) {
    case 'exact_product':
      return 0;
    case 'active_ingredient':
      return 1;
  }
}

function freshnessRank(freshness: SyntheticSearchListing['freshness']): number {
  switch (freshness) {
    case 'current':
      return 0;
    case 'may_be_outdated':
      return 1;
  }
}

function compareByStableId(a: RankedRow, b: RankedRow): number {
  return a.listing.id.localeCompare(b.listing.id);
}

function compareByPrice(a: RankedRow, b: RankedRow): number {
  if (a.listing.priceFjdMinor !== b.listing.priceFjdMinor) {
    return a.listing.priceFjdMinor - b.listing.priceFjdMinor;
  }
  return compareByStableId(a, b);
}

function compareByDistance(a: RankedRow, b: RankedRow): number {
  if (a.displayDistance.rank !== b.displayDistance.rank) {
    return a.displayDistance.rank - b.displayDistance.rank;
  }
  return compareByStableId(a, b);
}

function compareByRelevance(
  a: RankedRow,
  b: RankedRow,
  selectedArea: SyntheticArea | null,
): number {
  if (matchKindRank(a.matchKind) !== matchKindRank(b.matchKind)) {
    return matchKindRank(a.matchKind) - matchKindRank(b.matchKind);
  }

  if (freshnessRank(a.listing.freshness) !== freshnessRank(b.listing.freshness)) {
    return freshnessRank(a.listing.freshness) - freshnessRank(b.listing.freshness);
  }

  if (selectedArea !== null && a.displayDistance.rank !== b.displayDistance.rank) {
    return a.displayDistance.rank - b.displayDistance.rank;
  }

  return compareByPrice(a, b);
}

export function sortRows(
  rows: readonly RankedRow[],
  sort: SyntheticSort,
  selectedArea: SyntheticArea | null,
): RankedRow[] {
  const copy = [...rows];

  switch (sort) {
    case 'price_low_to_high':
      copy.sort(compareByPrice);
      break;
    case 'distance':
      copy.sort(compareByDistance);
      break;
    case 'relevance':
    default:
      copy.sort((a, b) => compareByRelevance(a, b, selectedArea));
      break;
  }

  return copy;
}
