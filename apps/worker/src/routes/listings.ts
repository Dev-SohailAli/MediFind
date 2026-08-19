import { buildErrorResponse } from '../http/errors.js';
import { getListingById } from '../data/search.js';
import type { Env } from '../types/env.js';

/**
 * The id has already been extracted by `http/router.ts`'s `matchListingRoute`
 * (decoded, single-segment, never containing a `/`) before this runs. A
 * missing, hidden, excluded or unauthorized record all fall through to the
 * same generic NOT_FOUND as an id that never existed — the response never
 * reveals which internal gate failed (see docs/api-error-contract.md
 * anti-enumeration rules).
 */
export async function handleListingRequest(listingId: string, env: Env): Promise<Response> {
  const outcome = await getListingById(env, listingId);

  if (outcome.status === 'unavailable') {
    return buildErrorResponse('UNAVAILABLE', 'error.unavailable.search_backend');
  }

  if (!outcome.result) {
    return buildErrorResponse('NOT_FOUND', 'error.route.not_found');
  }

  return new Response(JSON.stringify(outcome.result), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
