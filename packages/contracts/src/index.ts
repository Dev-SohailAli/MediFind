export const PACKAGE_BOUNDARY = 'contracts' as const;

/**
 * Task 2 synthetic buyer-search contract. Every value described by these
 * types is a fictional prototype demonstrator (see
 * docs/task-2-synthetic-buyer-search-specification.md). None of these types
 * describe a production/API/persistence schema.
 */

export type SyntheticAvailability = 'in_stock' | 'low_stock' | 'unavailable';

export type SyntheticFreshness = 'current' | 'may_be_outdated';

export type SyntheticMatchKind = 'exact_product' | 'active_ingredient';

export type SyntheticSort = 'relevance' | 'price_low_to_high' | 'distance';

export type SyntheticArea = 'harbour' | 'garden' | 'market';

export interface SyntheticSearchListing {
  id: string;
  medicineDisplayName: string;
  brandName?: string;
  activeIngredientDisplayName: string;
  strength: string;
  dosageForm: string;
  packDescription: string;
  aliases: readonly string[];
  pharmacyDisplayName: string;
  syntheticArea: SyntheticArea;
  syntheticDistanceLabel: string;
  syntheticDistanceRank: number;
  availability: SyntheticAvailability;
  priceFjdMinor: number;
  freshness: SyntheticFreshness;
  lastUpdatedDisplay: string;
  searchEligible: boolean;
}

/**
 * Task 4 synthetic D1 search Worker contract (ADR-275,
 * docs/task-4-synthetic-d1-data-contract-proposal.md). This describes the
 * public read-only search-result and single-listing response shape; it is
 * not a client-side fixture type and never exposes an internal source ID,
 * verification/moderation state or search term. `apps/web` may consume this
 * contract only through its explicit local Worker adapter; the default build
 * remains fixture-backed.
 */
export type PublicSearchAvailability = 'in_stock' | 'low_stock' | 'unavailable';

export interface PublicSearchResultItem {
  id: string;
  medicineDisplayName: string;
  brandName: string | null;
  activeIngredientDisplayName: string;
  strength: string;
  dosageForm: string;
  packDescription: string;
  pharmacyDisplayName: string;
  syntheticArea: SyntheticArea;
  directionText: string;
  availabilityState: PublicSearchAvailability;
  priceFjdMinor: number;
  syntheticDistanceLabel: string;
  syntheticDistanceRank: number;
  lastRefreshedAt: string;
}

export interface PublicSearchResponse {
  results: readonly PublicSearchResultItem[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
