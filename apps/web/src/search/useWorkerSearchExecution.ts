import * as React from 'react';

import { fetchWorkerSearch } from './searchClient';
import type { SearchInput, SearchOutcome } from './searchListings';
import type { SearchExecutionState } from './useSearchExecution';

export type WorkerSearchRunner = (input: SearchInput) => Promise<SearchOutcome>;

const EMPTY_OUTCOME: SearchOutcome = { isEmptyQuery: true, rows: [] };
const DEFAULT_WORKER_SEARCH: WorkerSearchRunner = fetchWorkerSearch;

/**
 * Async state machine for the opt-in local Worker adapter. Disabled mode
 * never invokes fetch and returns the same browse state as fixture search.
 */
export function useWorkerSearchExecution(
  enabled: boolean,
  query: string,
  sort: SearchInput['sort'],
  selectedArea: SearchInput['selectedArea'],
  runSearch: WorkerSearchRunner = DEFAULT_WORKER_SEARCH,
): SearchExecutionState {
  const [state, setState] = React.useState<SearchExecutionState>(() =>
    enabled && query.trim().length > 0
      ? { status: 'loading' }
      : { status: 'ready', outcome: EMPTY_OUTCOME },
  );

  React.useEffect(() => {
    if (!enabled || query.trim().length === 0) {
      setState({ status: 'ready', outcome: EMPTY_OUTCOME });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    void runSearch({ query, sort, selectedArea })
      .then((outcome) => {
        if (!cancelled) {
          setState({ status: 'ready', outcome });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: 'error' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, query, sort, selectedArea, runSearch]);

  return state;
}
