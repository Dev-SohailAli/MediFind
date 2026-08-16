import type { SyntheticMatchKind, SyntheticSearchListing } from '@medifind/contracts';

import { normalizeText, tokenize } from './normalize';

/**
 * Deterministic exact-token/prefix matching only. A candidate matches when
 * every query token is a prefix of some token in the normalized candidate.
 * No fuzzy, semantic or clinical-equivalence matching is applied.
 */
function candidateMatchesQuery(candidate: string, queryTokens: readonly string[]): boolean {
  const candidateTokens = tokenize(normalizeText(candidate));

  return queryTokens.every((queryToken) =>
    candidateTokens.some((candidateToken) => candidateToken.startsWith(queryToken)),
  );
}

/**
 * Classifies a listing against the already-normalized query tokens.
 * Display-name/brand hits are `exact_product`; active-ingredient/alias-only
 * hits are `active_ingredient`. Returns null when nothing matches.
 */
export function classifyMatch(
  listing: SyntheticSearchListing,
  queryTokens: readonly string[],
): SyntheticMatchKind | null {
  const displayCandidates = [listing.medicineDisplayName, listing.brandName].filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );

  if (displayCandidates.some((candidate) => candidateMatchesQuery(candidate, queryTokens))) {
    return 'exact_product';
  }

  const ingredientCandidates = [listing.activeIngredientDisplayName, ...listing.aliases];

  if (ingredientCandidates.some((candidate) => candidateMatchesQuery(candidate, queryTokens))) {
    return 'active_ingredient';
  }

  return null;
}
