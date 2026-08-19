import * as React from 'react';

import { fetchWorkerListing } from './searchClient';
import type { SyntheticSearchListing } from '@medifind/contracts';

export type WorkerListingRunner = (listingId: string) => Promise<SyntheticSearchListing>;

export type WorkerListingExecutionState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; listing: SyntheticSearchListing }
  | { status: 'error' };

const IDLE_STATE: WorkerListingExecutionState = { status: 'idle' };
const DEFAULT_WORKER_LISTING: WorkerListingRunner = fetchWorkerListing;

/**
 * Async state machine for the opt-in local Worker listing-detail fetch.
 * Disabled mode or a null listing ID never invokes the runner and returns
 * idle. Stale responses (an older resolution after the ID has changed,
 * unmount or a null ID) are ignored and never committed.
 */
export function useWorkerListingExecution(
  enabled: boolean,
  listingId: string | null,
  runListing: WorkerListingRunner = DEFAULT_WORKER_LISTING,
): WorkerListingExecutionState {
  const [state, setState] = React.useState<WorkerListingExecutionState>(() =>
    enabled && listingId !== null ? { status: 'loading' } : IDLE_STATE,
  );

  React.useEffect(() => {
    if (!enabled || listingId === null) {
      setState(IDLE_STATE);
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    void runListing(listingId)
      .then((listing) => {
        if (!cancelled) {
          setState({ status: 'ready', listing });
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
  }, [enabled, listingId, runListing]);

  return state;
}
