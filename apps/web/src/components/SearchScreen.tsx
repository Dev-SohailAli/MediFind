import * as React from 'react';
import type { SyntheticArea, SyntheticSort } from '@medifind/contracts';

import { strings } from '../content/strings';
import { syntheticListings } from '../fixtures/syntheticListings';
import type {
  SyntheticReservation,
  SyntheticReservationRequestInput,
} from '../reservations/syntheticReservations';
import { MAX_RESULTS_PER_PAGE, paginate } from '../search/searchListings';
import { isWorkerSearchMode } from '../search/searchClient';
import { useSearchExecution } from '../search/useSearchExecution';
import { useWorkerListingExecution } from '../search/useWorkerListingExecution';
import { useWorkerSearchExecution } from '../search/useWorkerSearchExecution';
import type { SupportReportCategory } from '../support/syntheticSupport';
import { AreaSelector } from './AreaSelector';
import { LoadMoreButton } from './LoadMoreButton';
import { ResultCard } from './ResultCard';
import { ResultDetailSheet } from './ResultDetailSheet';
import { BrowseEmptyState, ErrorState, LoadingState, ZeroResultState } from './SafeStates';
import { SearchBar } from './SearchBar';
import { SortSelector } from './SortSelector';

export interface SearchScreenProps {
  readonly buyerKey?: string | null;
  readonly reservations?: readonly SyntheticReservation[];
  readonly onRequestReservation?: (input: SyntheticReservationRequestInput) => void;
  readonly onSubmitReport?: (input: {
    category: SupportReportCategory;
    reportedBy: string;
    note: string;
    targetListingId: string | null;
  }) => void;
}

export function SearchScreen({
  buyerKey = null,
  reservations = [],
  onRequestReservation = () => {},
  onSubmitReport = () => {},
}: SearchScreenProps = {}) {
  const workerSearchEnabled = isWorkerSearchMode();
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState<SyntheticSort>('relevance');
  const [selectedArea, setSelectedArea] = React.useState<SyntheticArea | null>(null);
  const [revealedCount, setRevealedCount] = React.useState(MAX_RESULTS_PER_PAGE);
  const [selectedListingId, setSelectedListingId] = React.useState<string | null>(null);

  const handleQueryChange = React.useCallback((next: string) => {
    setQuery(next);
    setRevealedCount(MAX_RESULTS_PER_PAGE);
  }, []);

  const handleSortChange = React.useCallback((next: SyntheticSort) => {
    setSort(next);
    setRevealedCount(MAX_RESULTS_PER_PAGE);
  }, []);

  const handleAreaChange = React.useCallback((next: SyntheticArea | null) => {
    setSelectedArea(next);
    setRevealedCount(MAX_RESULTS_PER_PAGE);
  }, []);

  const fixtureExecution = useSearchExecution(syntheticListings, query, sort, selectedArea);
  const workerExecution = useWorkerSearchExecution(workerSearchEnabled, query, sort, selectedArea);
  const execution = workerSearchEnabled ? workerExecution : fixtureExecution;

  const rows = execution.status === 'ready' ? execution.outcome.rows : [];

  const page = React.useMemo(() => paginate(rows, revealedCount), [rows, revealedCount]);

  const selectedRow =
    execution.status === 'ready' && selectedListingId
      ? execution.outcome.rows.find((row) => row.listing.id === selectedListingId)
      : undefined;

  const workerListingExecution = useWorkerListingExecution(
    workerSearchEnabled,
    selectedRow ? selectedRow.listing.id : null,
  );

  // A query/sort/area change or a search error can remove the currently
  // selected row from the active result set. When that happens the sheet
  // must close and no detail request may be left running for an item that
  // is no longer present.
  React.useEffect(() => {
    if (selectedListingId === null) return;
    if (execution.status === 'error') {
      setSelectedListingId(null);
      return;
    }
    if (execution.status === 'ready') {
      const stillPresent = execution.outcome.rows.some(
        (row) => row.listing.id === selectedListingId,
      );
      if (!stillPresent) {
        setSelectedListingId(null);
      }
    }
  }, [execution, selectedListingId]);

  return (
    <div className="screen">
      <h1 className="sr-only">{strings.navSearchLabel}</h1>
      <SearchBar value={query} onChange={handleQueryChange} />

      <div className="controls-row">
        <AreaSelector value={selectedArea} onChange={handleAreaChange} />
        <SortSelector value={sort} onChange={handleSortChange} />
      </div>

      {execution.status === 'loading' ? (
        <LoadingState />
      ) : execution.status === 'error' ? (
        <ErrorState />
      ) : execution.outcome.isEmptyQuery ? (
        <BrowseEmptyState />
      ) : execution.outcome.rows.length === 0 ? (
        <ZeroResultState buyerKey={buyerKey} onSubmitReport={onSubmitReport} />
      ) : (
        <div className="results-block">
          <p className="results-count" role="status">
            {execution.outcome.rows.length} {strings.resultsCountSuffix}
          </p>
          <div className="results-grid">
            {page.visible.map((row) => (
              <ResultCard
                key={row.listing.id}
                listing={row.listing}
                matchKind={row.matchKind}
                displayDistance={row.displayDistance}
                showDistance={selectedArea !== null}
                onPress={() => setSelectedListingId(row.listing.id)}
              />
            ))}
          </div>
          {page.hasMore ? (
            <LoadMoreButton onPress={() => setRevealedCount((c) => c + MAX_RESULTS_PER_PAGE)} />
          ) : null}
        </div>
      )}

      {selectedRow ? (
        workerSearchEnabled ? (
          workerListingExecution.status === 'ready' &&
          workerListingExecution.listing.id === selectedRow.listing.id ? (
            <ResultDetailSheet
              status="ready"
              listing={workerListingExecution.listing}
              matchKind={selectedRow.matchKind}
              displayDistance={selectedRow.displayDistance}
              showDistance={selectedArea !== null}
              onClose={() => setSelectedListingId(null)}
              buyerKey={buyerKey}
              reservations={reservations}
              onRequestReservation={onRequestReservation}
              onSubmitReport={onSubmitReport}
            />
          ) : workerListingExecution.status === 'error' ? (
            <ResultDetailSheet status="error" onClose={() => setSelectedListingId(null)} />
          ) : (
            <ResultDetailSheet status="loading" onClose={() => setSelectedListingId(null)} />
          )
        ) : (
          <ResultDetailSheet
            status="ready"
            listing={selectedRow.listing}
            matchKind={selectedRow.matchKind}
            displayDistance={selectedRow.displayDistance}
            showDistance={selectedArea !== null}
            onClose={() => setSelectedListingId(null)}
            buyerKey={buyerKey}
            reservations={reservations}
            onRequestReservation={onRequestReservation}
            onSubmitReport={onSubmitReport}
          />
        )
      ) : null}
    </div>
  );
}
