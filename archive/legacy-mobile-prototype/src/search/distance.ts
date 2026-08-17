import type { SyntheticArea, SyntheticSearchListing } from '@medifind/contracts';

export interface DisplayDistance {
  label: string;
  rank: number;
}

/**
 * The manual synthetic area selector only changes which pre-authored
 * distance label/rank is shown; it never reads or approximates a real
 * device location. When no area is selected, each listing's own static
 * fixture distance is shown unchanged. When an area is selected, a listing
 * that belongs to that area is shown as nearby; every other listing keeps
 * its own fixture distance, offset so same-area listings always rank
 * closer.
 */
export function getDisplayDistance(
  listing: SyntheticSearchListing,
  selectedArea: SyntheticArea | null,
): DisplayDistance {
  if (selectedArea === null) {
    return { label: listing.syntheticDistanceLabel, rank: listing.syntheticDistanceRank };
  }

  if (listing.syntheticArea === selectedArea) {
    return { label: 'Nearby in the selected synthetic area', rank: 0 };
  }

  return {
    label: listing.syntheticDistanceLabel,
    rank: listing.syntheticDistanceRank + 100,
  };
}
