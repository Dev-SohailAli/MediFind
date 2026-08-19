import type { PublicSearchResultItem } from '@medifind/contracts';

import type { Env } from '../types/env.js';
import { DEFAULT_STALE_AFTER_MS, type SyntheticArea } from './projection.js';

export type SearchSort = 'relevance' | 'price_low_to_high' | 'distance';

// The package's shared, versioned response-item contract (ADR-275); the
// Worker never invents its own parallel shape for what a route returns.
export type PublicProjectionResult = PublicSearchResultItem;

export interface NormalizedSearchInput {
  readonly queryTokens: readonly string[];
  readonly area: SyntheticArea | null;
  readonly sort: SearchSort;
  readonly page: number;
  readonly pageSize: number;
  readonly referenceNowIso?: string;
}

// "total results are capped at 100" (Task 4 data contract).
export const MAX_TOTAL_RESULTS = 100;

export type D1Failure = {
  readonly status: 'unavailable';
  readonly reason: 'binding_disabled' | 'quota_or_provider_error';
};

export type SearchOutcome =
  | {
      readonly status: 'ok';
      readonly results: readonly PublicProjectionResult[];
      readonly total: number;
    }
  | D1Failure;

export type ListingOutcome =
  { readonly status: 'ok'; readonly result: PublicProjectionResult | null } | D1Failure;

interface RawProjectionRow {
  readonly listing_id: string;
  readonly medicine_display_name: string;
  readonly brand_name: string | null;
  readonly active_ingredient_display_name: string;
  readonly strength: string;
  readonly dosage_form: string;
  readonly pack_description: string;
  readonly pharmacy_display_name: string;
  readonly synthetic_area: SyntheticArea;
  readonly direction_text: string;
  readonly availability_state: 'in_stock' | 'low_stock' | 'unavailable';
  readonly price_fjd_minor: number;
  readonly synthetic_distance_label: string;
  readonly synthetic_distance_rank: number;
  readonly last_refreshed_at: string;
}

const PUBLIC_PROJECTION_COLUMNS =
  'listing_id, medicine_display_name, brand_name, active_ingredient_display_name, strength, dosage_form, pack_description, pharmacy_display_name, synthetic_area, direction_text, availability_state, price_fjd_minor, synthetic_distance_label, synthetic_distance_rank, last_refreshed_at';

const SYNTHETIC_AREAS: readonly SyntheticArea[] = ['harbour', 'market', 'garden'];
const AVAILABILITY_STATES: readonly RawProjectionRow['availability_state'][] = [
  'in_stock',
  'low_stock',
  'unavailable',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isRawProjectionRow(value: unknown): value is RawProjectionRow {
  if (!isRecord(value)) return false;

  return (
    typeof value.listing_id === 'string' &&
    value.listing_id.length > 0 &&
    typeof value.medicine_display_name === 'string' &&
    (typeof value.brand_name === 'string' || value.brand_name === null) &&
    typeof value.active_ingredient_display_name === 'string' &&
    typeof value.strength === 'string' &&
    typeof value.dosage_form === 'string' &&
    typeof value.pack_description === 'string' &&
    typeof value.pharmacy_display_name === 'string' &&
    SYNTHETIC_AREAS.includes(value.synthetic_area as SyntheticArea) &&
    typeof value.direction_text === 'string' &&
    AVAILABILITY_STATES.includes(
      value.availability_state as RawProjectionRow['availability_state'],
    ) &&
    Number.isSafeInteger(value.price_fjd_minor) &&
    (value.price_fjd_minor as number) >= 0 &&
    typeof value.synthetic_distance_label === 'string' &&
    Number.isSafeInteger(value.synthetic_distance_rank) &&
    (value.synthetic_distance_rank as number) >= 0 &&
    typeof value.last_refreshed_at === 'string' &&
    Number.isFinite(Date.parse(value.last_refreshed_at))
  );
}

function assertRawProjectionRow(value: unknown): RawProjectionRow {
  if (!isRawProjectionRow(value)) {
    throw new Error('invalid public search projection row');
  }
  return value;
}

function freshnessCutoffIso(referenceNowIso: string): string {
  const referenceMs = Date.parse(referenceNowIso);
  if (!Number.isFinite(referenceMs)) {
    throw new Error('invalid search reference time');
  }
  return new Date(referenceMs - DEFAULT_STALE_AFTER_MS).toISOString();
}

function mapRow(row: RawProjectionRow): PublicProjectionResult {
  return {
    id: row.listing_id,
    medicineDisplayName: row.medicine_display_name,
    brandName: row.brand_name,
    activeIngredientDisplayName: row.active_ingredient_display_name,
    strength: row.strength,
    dosageForm: row.dosage_form,
    packDescription: row.pack_description,
    pharmacyDisplayName: row.pharmacy_display_name,
    syntheticArea: row.synthetic_area,
    directionText: row.direction_text,
    availabilityState: row.availability_state,
    priceFjdMinor: row.price_fjd_minor,
    syntheticDistanceLabel: row.synthetic_distance_label,
    syntheticDistanceRank: row.synthetic_distance_rank,
    lastRefreshedAt: row.last_refreshed_at,
  };
}

/**
 * SQLite LIKE treats `%`/`_` as wildcards and normalizeText's punctuation
 * strip list does not remove them, so a query containing either character is
 * escaped before being used as a bound LIKE prefix parameter. This changes
 * matching behaviour only (a literal "%"/"_" in a query no longer acts as an
 * unintended wildcard); it is not a SQL-injection concern because every
 * value here is always passed as a bound parameter, never concatenated into
 * the query text.
 */
function likePrefixParam(token: string): string {
  return `${token.replace(/[\\%_]/g, (ch) => `\\${ch}`)}%`;
}

function resolveDisplayRank(row: RawProjectionRow, area: SyntheticArea | null): number {
  if (area === null) return row.synthetic_distance_rank;
  return row.synthetic_area === area ? 0 : row.synthetic_distance_rank + 100;
}

function compareByStableId(a: RawProjectionRow, b: RawProjectionRow): number {
  return a.listing_id.localeCompare(b.listing_id);
}

function compareByPrice(a: RawProjectionRow, b: RawProjectionRow): number {
  return a.price_fjd_minor !== b.price_fjd_minor
    ? a.price_fjd_minor - b.price_fjd_minor
    : compareByStableId(a, b);
}

function compareByDistance(
  a: RawProjectionRow,
  b: RawProjectionRow,
  area: SyntheticArea | null,
): number {
  const rankA = resolveDisplayRank(a, area);
  const rankB = resolveDisplayRank(b, area);
  return rankA !== rankB ? rankA - rankB : compareByStableId(a, b);
}

/**
 * Relevance ordering matches apps/web/src/search/rank.ts's matchKind ->
 * (area-adjusted distance) -> price -> id chain. Freshness is enforced at
 * read time by the projection query, so stale rows cannot enter this sort.
 */
function compareByRelevance(
  a: RawProjectionRow,
  b: RawProjectionRow,
  matchPriority: Map<string, number>,
  area: SyntheticArea | null,
): number {
  const priorityA = matchPriority.get(a.listing_id) ?? 1;
  const priorityB = matchPriority.get(b.listing_id) ?? 1;
  if (priorityA !== priorityB) return priorityA - priorityB;

  if (area !== null) {
    const rankA = resolveDisplayRank(a, area);
    const rankB = resolveDisplayRank(b, area);
    if (rankA !== rankB) return rankA - rankB;
  }

  return compareByPrice(a, b);
}

async function fetchCandidateListingIds(
  db: NonNullable<Env['DB']>,
  tokens: readonly string[],
  freshnessCutoff: string,
): Promise<string[]> {
  const productClauses = tokens
    .map(
      () =>
        `EXISTS (SELECT 1 FROM public_search_terms t WHERE t.listing_id = p.listing_id AND t.match_kind = 'product' AND t.normalized_term LIKE ? ESCAPE '\\')`,
    )
    .join(' AND ');
  const ingredientClauses = tokens
    .map(
      () =>
        `EXISTS (SELECT 1 FROM public_search_terms t WHERE t.listing_id = p.listing_id AND t.match_kind IN ('ingredient', 'alias') AND t.normalized_term LIKE ? ESCAPE '\\')`,
    )
    .join(' AND ');
  const sql = `SELECT p.listing_id AS listing_id FROM public_search_projection p WHERE p.last_refreshed_at >= ? AND ((${productClauses}) OR (${ingredientClauses})) LIMIT ${MAX_TOTAL_RESULTS}`;
  const params = [freshnessCutoff, ...tokens.map(likePrefixParam), ...tokens.map(likePrefixParam)];

  const { results } = await db
    .prepare(sql)
    .bind(...params)
    .all<{ listing_id: string }>();
  return results.map((row) => row.listing_id);
}

async function fetchMatchPriority(
  db: NonNullable<Env['DB']>,
  candidateIds: readonly string[],
  tokens: readonly string[],
): Promise<Map<string, number>> {
  const idPlaceholders = candidateIds.map(() => '?').join(', ');
  const sql = `SELECT listing_id, normalized_term, match_kind FROM public_search_terms WHERE listing_id IN (${idPlaceholders})`;
  const params = [...candidateIds];

  const { results } = await db
    .prepare(sql)
    .bind(...params)
    .all<{
      listing_id: string;
      normalized_term: string;
      match_kind: 'product' | 'ingredient' | 'alias';
    }>();

  const productMatches = new Map<string, Set<string>>();
  const ingredientMatches = new Map<string, Set<string>>();
  for (const row of results) {
    const matchedTokens = tokens.filter((token) => row.normalized_term.startsWith(token));
    if (matchedTokens.length === 0) continue;
    const matches = row.match_kind === 'product' ? productMatches : ingredientMatches;
    const listingMatches = matches.get(row.listing_id) ?? new Set<string>();
    for (const token of matchedTokens) listingMatches.add(token);
    matches.set(row.listing_id, listingMatches);
  }

  const priority = new Map<string, number>();
  for (const listingId of candidateIds) {
    priority.set(listingId, productMatches.get(listingId)?.size === tokens.length ? 0 : 1);
  }
  return priority;
}

async function fetchProjectionRowsByIds(
  db: NonNullable<Env['DB']>,
  candidateIds: readonly string[],
  freshnessCutoff: string,
): Promise<RawProjectionRow[]> {
  const idPlaceholders = candidateIds.map(() => '?').join(', ');
  const sql = `SELECT ${PUBLIC_PROJECTION_COLUMNS} FROM public_search_projection WHERE last_refreshed_at >= ? AND listing_id IN (${idPlaceholders})`;

  const { results } = await db
    .prepare(sql)
    .bind(freshnessCutoff, ...candidateIds)
    .all<unknown>();
  return results.map(assertRawProjectionRow);
}

/**
 * Bounded, parameterized, indexed reads only. No caller input ever selects a
 * table, column or sort expression; `sort`/`area` are validated to a fixed
 * enum before this function is called (see routes/search.ts), and every
 * query token is bound as a LIKE value, never concatenated into SQL text.
 * An empty query returns the safe browse state (no results) without issuing
 * any D1 query at all, matching apps/web/src/search/searchListings.ts.
 */
export async function searchProjection(
  env: Env,
  input: NormalizedSearchInput,
): Promise<SearchOutcome> {
  if (!env.DB) {
    return { status: 'unavailable', reason: 'binding_disabled' };
  }
  if (input.queryTokens.length === 0) {
    return { status: 'ok', results: [], total: 0 };
  }

  const db = env.DB;

  try {
    const referenceNowIso = input.referenceNowIso ?? new Date().toISOString();
    const cutoff = freshnessCutoffIso(referenceNowIso);
    const candidateIds = await fetchCandidateListingIds(db, input.queryTokens, cutoff);
    if (candidateIds.length === 0) {
      return { status: 'ok', results: [], total: 0 };
    }

    const [matchPriority, rows] = await Promise.all([
      fetchMatchPriority(db, candidateIds, input.queryTokens),
      fetchProjectionRowsByIds(db, candidateIds, cutoff),
    ]);

    const sorted = [...rows];
    switch (input.sort) {
      case 'price_low_to_high':
        sorted.sort(compareByPrice);
        break;
      case 'distance':
        sorted.sort((a, b) => compareByDistance(a, b, input.area));
        break;
      case 'relevance':
      default:
        sorted.sort((a, b) => compareByRelevance(a, b, matchPriority, input.area));
        break;
    }

    const capped = sorted.slice(0, MAX_TOTAL_RESULTS);
    const start = (input.page - 1) * input.pageSize;
    const page = capped.slice(start, start + input.pageSize);

    return { status: 'ok', results: page.map(mapRow), total: capped.length };
  } catch {
    return { status: 'unavailable', reason: 'quota_or_provider_error' };
  }
}

export async function getListingById(
  env: Env,
  listingId: string,
  referenceNowIso = new Date().toISOString(),
): Promise<ListingOutcome> {
  if (!env.DB) {
    return { status: 'unavailable', reason: 'binding_disabled' };
  }

  try {
    const cutoff = freshnessCutoffIso(referenceNowIso);
    const row = await env.DB.prepare(
      `SELECT ${PUBLIC_PROJECTION_COLUMNS} FROM public_search_projection WHERE listing_id = ? AND last_refreshed_at >= ?`,
    )
      .bind(listingId, cutoff)
      .first<unknown>();

    return { status: 'ok', result: row ? mapRow(assertRawProjectionRow(row)) : null };
  } catch {
    return { status: 'unavailable', reason: 'quota_or_provider_error' };
  }
}
