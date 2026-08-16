import * as React from 'react';
import type { SyntheticArea, SyntheticSort } from '@medifind/contracts';

import { strings } from '../content/strings';
import { syntheticListings } from '../fixtures/syntheticListings';
import { MAX_RESULTS_PER_PAGE, paginate, searchListings } from '../search/searchListings';
import { AreaSelector } from './AreaSelector';
import { LoadMoreButton } from './LoadMoreButton';
import { ResultCard } from './ResultCard';
import { ResultDetailSheet } from './ResultDetailSheet';
import { BrowseEmptyState, ZeroResultState } from './SafeStates';
import { SearchBar } from './SearchBar';
import { SortSelector } from './SortSelector';

export function SearchScreen() {
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

  const outcome = React.useMemo(
    () => searchListings(syntheticListings, { query, sort, selectedArea }),
    [query, sort, selectedArea],
  );

  const page = React.useMemo(
    () => paginate(outcome.rows, revealedCount),
    [outcome.rows, revealedCount],
  );

  const selectedRow = selectedListingId
    ? outcome.rows.find((row) => row.listing.id === selectedListingId)
    : undefined;

  return (
    <div id="main-content" className="screen" tabIndex={-1}>
      <h1 className="sr-only">{strings.navSearchLabel}</h1>
      <SearchBar value={query} onChange={handleQueryChange} />

      <div className="controls-row">
        <AreaSelector value={selectedArea} onChange={handleAreaChange} />
        <SortSelector value={sort} onChange={handleSortChange} />
      </div>

      {outcome.isEmptyQuery ? (
        <BrowseEmptyState />
      ) : outcome.rows.length === 0 ? (
        <ZeroResultState />
      ) : (
        <div className="results-block">
          <p className="results-count" role="status">
            {outcome.rows.length} {strings.resultsCountSuffix}
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
        <ResultDetailSheet
          listing={selectedRow.listing}
          matchKind={selectedRow.matchKind}
          displayDistance={selectedRow.displayDistance}
          showDistance={selectedArea !== null}
          onClose={() => setSelectedListingId(null)}
        />
      ) : null}
    </div>
  );
}
