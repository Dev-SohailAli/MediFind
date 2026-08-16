import type { SyntheticArea, SyntheticSearchListing, SyntheticSort } from '@medifind/contracts';

import { getDisplayDistance } from './distance';
import { classifyMatch } from './match';
import { normalizeText, tokenize } from './normalize';
import { type RankedRow, sortRows } from './rank';

export const MAX_RESULTS_PER_PAGE = 20;
export const MAX_RESULTS_PER_QUERY = 100;

export interface SearchInput {
  query: string;
  sort: SyntheticSort;
  selectedArea: SyntheticArea | null;
}

export interface SearchOutcome {
  isEmptyQuery: boolean;
  rows: RankedRow[];
}

/**
 * Pure local search: normalizes the query, excludes ineligible fixtures,
 * classifies/matches deterministically, ranks and caps at
 * MAX_RESULTS_PER_QUERY. It never mutates a fixture, persists a query,
 * calls a network service or infers clinical equivalence.
 */
export function searchListings(
  fixtures: readonly SyntheticSearchListing[],
  input: SearchInput,
): SearchOutcome {
  const normalizedQuery = normalizeText(input.query);

  if (normalizedQuery.length === 0) {
    return { isEmptyQuery: true, rows: [] };
  }

  const queryTokens = tokenize(normalizedQuery);

  const matched: RankedRow[] = [];
  for (const listing of fixtures) {
    if (!listing.searchEligible) {
      continue;
    }
    const matchKind = classifyMatch(listing, queryTokens);
    if (matchKind === null) {
      continue;
    }
    matched.push({
      listing,
      matchKind,
      displayDistance: getDisplayDistance(listing, input.selectedArea),
    });
  }

  const sorted = sortRows(matched, input.sort, input.selectedArea);
  const capped = sorted.slice(0, MAX_RESULTS_PER_QUERY);

  return { isEmptyQuery: false, rows: capped };
}

export interface PageWindow<T> {
  visible: T[];
  hasMore: boolean;
}

/** Pure pagination over an already-searched/ranked/capped row list. */
export function paginate<T>(rows: readonly T[], revealedCount: number): PageWindow<T> {
  const visible = rows.slice(0, revealedCount);
  return { visible, hasMore: revealedCount < rows.length };
}
