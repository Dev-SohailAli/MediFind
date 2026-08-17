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
