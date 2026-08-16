import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SyntheticArea, SyntheticSort } from '@medifind/contracts';

import { strings } from '../content/strings';
import { syntheticListings } from '../fixtures/syntheticListings';
import { MAX_RESULTS_PER_PAGE, paginate, searchListings } from '../search/searchListings';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';
import { AreaSelector } from './AreaSelector';
import { LoadMoreButton } from './LoadMoreButton';
import { ResultCard } from './ResultCard';
import { ResultDetailSheet } from './ResultDetailSheet';
import { BrowseEmptyState, ZeroResultState } from './SafeStates';
import { SearchBar } from './SearchBar';
import { SortSelector } from './SortSelector';

export function SearchScreen() {
  const colors = useThemeColors();
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
    <View style={[styles.screen, { backgroundColor: colors.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <SearchBar value={query} onChange={handleQueryChange} />

        <View style={styles.controlsBlock}>
          <AreaSelector value={selectedArea} onChange={handleAreaChange} />
          <SortSelector value={sort} onChange={handleSortChange} />
        </View>

        {outcome.isEmptyQuery ? (
          <BrowseEmptyState />
        ) : outcome.rows.length === 0 ? (
          <ZeroResultState />
        ) : (
          <View style={styles.resultsBlock}>
            <Text style={{ color: colors.textSecondary }}>
              {outcome.rows.length} {strings.resultsCountSuffix}
            </Text>
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
            {page.hasMore ? (
              <LoadMoreButton onPress={() => setRevealedCount((c) => c + MAX_RESULTS_PER_PAGE)} />
            ) : null}
          </View>
        )}
      </ScrollView>

      {selectedRow ? (
        <ResultDetailSheet
          listing={selectedRow.listing}
          matchKind={selectedRow.matchKind}
          displayDistance={selectedRow.displayDistance}
          onClose={() => setSelectedListingId(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  controlsBlock: {
    gap: spacing.sm,
  },
  resultsBlock: {
    gap: spacing.sm,
  },
});
