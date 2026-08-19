import type { PublicSearchResponse } from '@medifind/contracts';

import { buildErrorResponse, type SafeFieldError } from '../http/errors.js';
import { normalizeText, tokenizeWords } from '../data/normalize.js';
import { searchProjection, type NormalizedSearchInput, type SearchSort } from '../data/search.js';
import type { SyntheticArea } from '../data/projection.js';
import type { Env } from '../types/env.js';

const MAX_QUERY_LENGTH = 80;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 20;
const ALLOWED_AREAS: readonly SyntheticArea[] = ['harbour', 'market', 'garden'];
const ALLOWED_SORTS: readonly SearchSort[] = ['relevance', 'price_low_to_high', 'distance'];
const POSITIVE_INTEGER = /^[1-9]\d*$/;

export type SearchResponseBody = PublicSearchResponse;

export type ParsedSearchRequest =
  | { readonly ok: true; readonly value: NormalizedSearchInput }
  | { readonly ok: false; readonly response: Response };

function validationFailure(field: string): Response {
  const fieldError: SafeFieldError = {
    field,
    code: 'invalid',
    messageKey: 'error.validation.invalid_field',
  };
  return buildErrorResponse('VALIDATION_FAILED', 'error.validation.invalid_field', {
    fieldErrors: [fieldError],
  });
}

/**
 * Every parameter is validated against a fixed allow-list/shape before it
 * ever reaches data/search.ts; nothing here can select a table, column or
 * sort expression, and a rejected value never reaches D1. Unicode length is
 * counted in code points (not UTF-16 code units) for the 80-character query
 * limit.
 */
export function parseSearchRequest(url: URL): ParsedSearchRequest {
  const rawQuery = (url.searchParams.get('query') ?? '').trim();
  if ([...rawQuery].length > MAX_QUERY_LENGTH) {
    return { ok: false, response: validationFailure('query') };
  }
  const queryTokens = tokenizeWords(normalizeText(rawQuery));

  const rawArea = url.searchParams.get('area');
  if (rawArea !== null && !ALLOWED_AREAS.includes(rawArea as SyntheticArea)) {
    return { ok: false, response: validationFailure('area') };
  }
  const area = (rawArea as SyntheticArea | null) ?? null;

  const rawSort = url.searchParams.get('sort');
  if (rawSort !== null && !ALLOWED_SORTS.includes(rawSort as SearchSort)) {
    return { ok: false, response: validationFailure('sort') };
  }
  const sort = (rawSort as SearchSort | null) ?? 'relevance';

  const rawPage = url.searchParams.get('page');
  if (rawPage !== null && !POSITIVE_INTEGER.test(rawPage)) {
    return { ok: false, response: validationFailure('page') };
  }
  const page = rawPage === null ? 1 : Number(rawPage);

  const rawPageSize = url.searchParams.get('pageSize');
  if (rawPageSize !== null && !POSITIVE_INTEGER.test(rawPageSize)) {
    return { ok: false, response: validationFailure('pageSize') };
  }
  const pageSize = rawPageSize === null ? MAX_PAGE_SIZE : Number(rawPageSize);
  if (pageSize < MIN_PAGE_SIZE || pageSize > MAX_PAGE_SIZE) {
    return { ok: false, response: validationFailure('pageSize') };
  }

  return { ok: true, value: { queryTokens, area, sort, page, pageSize } };
}

export async function handleSearchRequest(request: Request, env: Env): Promise<Response> {
  const parsed = parseSearchRequest(new URL(request.url));
  if (!parsed.ok) {
    return parsed.response;
  }

  const outcome = await searchProjection(env, parsed.value);
  if (outcome.status === 'unavailable') {
    return buildErrorResponse('UNAVAILABLE', 'error.unavailable.search_backend');
  }

  const body: SearchResponseBody = {
    results: outcome.results,
    page: parsed.value.page,
    pageSize: parsed.value.pageSize,
    total: outcome.total,
    hasMore: parsed.value.page * parsed.value.pageSize < outcome.total,
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
