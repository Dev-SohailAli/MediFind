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

/**
 * Task 2 dependency-free runtime parsers for the public search contract
 * above. These sanitize an `unknown` decoded-JSON value into a newly
 * constructed, allow-listed object so that no unknown/internal payload
 * field (source id, moderation state, search term, provider detail) can
 * reach the UI. Every rejection uses the same generic message; no field
 * name, value, JSON fragment or provider detail is ever interpolated into
 * it.
 */

const INVALID_MESSAGE = 'Invalid public search response';

function fail(): never {
  throw new Error(INVALID_MESSAGE);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) {
    fail();
  }
  return value;
}

function requireNullableString(value: unknown): string | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== 'string' || value.length === 0) {
    fail();
  }
  return value;
}

const SYNTHETIC_AREAS: readonly SyntheticArea[] = ['harbour', 'garden', 'market'];

function requireSyntheticArea(value: unknown): SyntheticArea {
  if (typeof value !== 'string' || !SYNTHETIC_AREAS.includes(value as SyntheticArea)) {
    fail();
  }
  return value as SyntheticArea;
}

const PUBLIC_SEARCH_AVAILABILITIES: readonly PublicSearchAvailability[] = [
  'in_stock',
  'low_stock',
  'unavailable',
];

function requirePublicSearchAvailability(value: unknown): PublicSearchAvailability {
  if (
    typeof value !== 'string' ||
    !PUBLIC_SEARCH_AVAILABILITIES.includes(value as PublicSearchAvailability)
  ) {
    fail();
  }
  return value as PublicSearchAvailability;
}

function requireNonNegativeSafeInteger(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    fail();
  }
  return value;
}

function requirePositiveSafeInteger(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) {
    fail();
  }
  return value;
}

function requireBoolean(value: unknown): boolean {
  if (typeof value !== 'boolean') {
    fail();
  }
  return value;
}

function requireTimestamp(value: unknown): string {
  if (typeof value !== 'string' || value.length === 0) {
    fail();
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    fail();
  }
  return value;
}

/**
 * Parses and sanitizes a single public search result item. Reads only the
 * approved public fields and returns a newly constructed object so that no
 * unknown/internal input property can pass through.
 */
export function parsePublicSearchResultItem(value: unknown): PublicSearchResultItem {
  if (!isRecord(value)) {
    fail();
  }

  const record = value as Record<string, unknown>;

  return {
    id: requireNonEmptyString(record.id),
    medicineDisplayName: requireNonEmptyString(record.medicineDisplayName),
    brandName: requireNullableString(record.brandName),
    activeIngredientDisplayName: requireNonEmptyString(record.activeIngredientDisplayName),
    strength: requireNonEmptyString(record.strength),
    dosageForm: requireNonEmptyString(record.dosageForm),
    packDescription: requireNonEmptyString(record.packDescription),
    pharmacyDisplayName: requireNonEmptyString(record.pharmacyDisplayName),
    syntheticArea: requireSyntheticArea(record.syntheticArea),
    directionText: requireNonEmptyString(record.directionText),
    availabilityState: requirePublicSearchAvailability(record.availabilityState),
    priceFjdMinor: requireNonNegativeSafeInteger(record.priceFjdMinor),
    syntheticDistanceLabel: requireNonEmptyString(record.syntheticDistanceLabel),
    syntheticDistanceRank: requireNonNegativeSafeInteger(record.syntheticDistanceRank),
    lastRefreshedAt: requireTimestamp(record.lastRefreshedAt),
  };
}

/**
 * Parses and sanitizes the public search response envelope. Every result
 * item is parsed through `parsePublicSearchResultItem`; the returned
 * envelope has no unknown properties.
 */
export function parsePublicSearchResponse(value: unknown): PublicSearchResponse {
  if (!isRecord(value) || !Array.isArray(value.results)) {
    fail();
  }

  const record = value as Record<string, unknown>;
  const results = (record.results as unknown[]).map((item) => parsePublicSearchResultItem(item));

  return {
    results,
    page: requirePositiveSafeInteger(record.page),
    pageSize: requirePageSize(record.pageSize, results.length),
    total: requireNonNegativeSafeInteger(record.total),
    hasMore: requireBoolean(record.hasMore),
  };
}

// The page-size upper bound below (20) is a protocol-wide value that is
// duplicated by hand in two other places: MAX_PAGE_SIZE in
// apps/worker/src/routes/search.ts and MAX_RESULTS_PER_PAGE in
// apps/web/src/search/searchListings.ts. The contracts package boundary
// test intentionally forbids exporting a shared runtime constant from this
// package, so keep all three literals equal by hand whenever one changes.
function requirePageSize(value: unknown, resultsLength: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1 || value > 20) {
    fail();
  }
  // An oversized results array (more items than the response's own declared
  // pageSize) is rejected the same way any other malformed envelope is,
  // rather than being silently accepted with no upper bound.
  if (resultsLength > value) {
    fail();
  }
  return value;
}
