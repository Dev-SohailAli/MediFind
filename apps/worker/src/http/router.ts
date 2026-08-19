export interface RouteDefinition {
  readonly method: string;
  readonly path: string;
  readonly action: string;
}

/**
 * Exact allow-listed method+path match only. An unmatched path and a
 * mismatched method on a real path both return `null` on purpose: the caller
 * must not be able to tell "wrong method" from "no such route" (see
 * docs/api-error-contract.md anti-enumeration rules).
 */
export function matchRoute<T extends RouteDefinition>(
  routes: readonly T[],
  method: string,
  pathname: string,
): T | null {
  return routes.find((route) => route.method === method && route.path === pathname) ?? null;
}

const LISTING_PATH_PATTERN = /^\/v1\/listings\/([^/]+)$/;

/**
 * `matchRoute` only does exact static-path matching, so the one dynamic
 * `GET /v1/listings/{id}` route gets its own small, single-purpose matcher
 * instead of a general path-param scheme. A non-GET method on this path
 * falls through to the same generic NOT_FOUND as an unknown route (see
 * `../index.ts`), preserving the anti-enumeration invariant. The captured
 * segment is URL-decoded and rejected if decoding reveals an embedded `/`,
 * so a caller cannot smuggle an extra path segment past routing via
 * percent-encoding; this is the opaque listing ID as bound straight into a
 * parameterized D1 lookup, never as a table/column name.
 */
export function matchListingRoute(method: string, pathname: string): string | null {
  if (method !== 'GET') {
    return null;
  }

  const match = LISTING_PATH_PATTERN.exec(pathname);
  const rawSegment = match?.[1];
  if (rawSegment === undefined) {
    return null;
  }

  let decoded: string;
  try {
    decoded = decodeURIComponent(rawSegment);
  } catch {
    return null;
  }

  return decoded.includes('/') ? null : decoded;
}
