import * as React from 'react';
import type { SyntheticArea, SyntheticSearchListing, SyntheticSort } from '@medifind/contracts';

import { searchListings, type SearchInput, type SearchOutcome } from './searchListings';

/**
 * Fixed local UI delay before a query change settles. This is not a
 * simulated network request: it exists only so the approved local
 * "loading" state (docs/task-2-synthetic-buyer-search-specification.md)
 * is genuinely reachable rather than dead UI, since the underlying search
 * function itself is a synchronous pure function. No network, persistence
 * or production capability is involved — see
 * apps/web/__tests__/boundary.test.ts, which forbids exactly that.
 */
export const SEARCH_LOADING_DELAY_MS = 150;

export type SearchExecutionState =
  { status: 'loading' } | { status: 'ready'; outcome: SearchOutcome } | { status: 'error' };

/**
 * Wraps the pure searchListings call in a small local state machine.
 *
 * Only the query text is debounced through SEARCH_LOADING_DELAY_MS, so
 * typing a new search genuinely shows the loading state. Sort and area
 * changes re-rank the already-committed query synchronously (no delay),
 * so refining an already-open result never interrupts an open
 * result-detail dialog with a spurious loading flash.
 *
 * If the pure search function ever throws, the error is caught here and
 * this returns the safe generic error state instead of crashing the app.
 * `runSearch` defaults to the real searchListings and only exists so
 * tests can inject a throwing implementation to prove that path is real,
 * reachable code, not exercise a production capability.
 */
export function useSearchExecution(
  fixtures: readonly SyntheticSearchListing[],
  query: string,
  sort: SyntheticSort,
  selectedArea: SyntheticArea | null,
  runSearch: (
    fixtures: readonly SyntheticSearchListing[],
    input: SearchInput,
  ) => SearchOutcome = searchListings,
): SearchExecutionState {
  const [committedQuery, setCommittedQuery] = React.useState(query);
  const isPending = committedQuery !== query;

  React.useEffect(() => {
    if (query === committedQuery) {
      return;
    }
    const timer = setTimeout(() => setCommittedQuery(query), SEARCH_LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query, committedQuery]);

  return React.useMemo<SearchExecutionState>(() => {
    if (isPending) {
      return { status: 'loading' };
    }
    try {
      return {
        status: 'ready',
        outcome: runSearch(fixtures, { query: committedQuery, sort, selectedArea }),
      };
    } catch {
      return { status: 'error' };
    }
  }, [isPending, fixtures, committedQuery, sort, selectedArea, runSearch]);
}
