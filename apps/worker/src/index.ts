import { buildErrorResponse } from './http/errors.js';
import { matchListingRoute, matchRoute } from './http/router.js';
import { checkDeclaredBodySize, validateNoBodyPayload } from './http/validate.js';
import { buildHealthConfig } from './routes/health.js';
import { handleListingRequest } from './routes/listings.js';
import { handleSearchRequest } from './routes/search.js';
import { deriveActor } from './security/actor.js';
import { authorize } from './security/authorize.js';
import { createRateLimiter } from './security/rateLimit.js';
import type { Env } from './types/env.js';

export const PACKAGE_BOUNDARY = 'worker' as const;

export const ROUTES = [
  { method: 'GET', path: '/v1/health', action: 'health:read' },
  { method: 'GET', path: '/v1/search', action: 'search:read' },
  { method: 'GET', path: '/v1/listings/:id', action: 'listing:read' },
] as const;

const EXACT_ROUTES = [ROUTES[0], ROUTES[1]] as const;

// Instance-local; see the persistence caveat on `createRateLimiter`. Shared
// across every route: the consume() key already includes the route action,
// so each route still gets its own independent budget from one instance.
const apiRateLimiter = createRateLimiter({ limit: 60, windowMs: 60_000 });

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const exactRoute = matchRoute(EXACT_ROUTES, request.method, url.pathname);
  const listingId = exactRoute ? null : matchListingRoute(request.method, url.pathname);

  if (!exactRoute && listingId === null) {
    return buildErrorResponse('NOT_FOUND', 'error.route.not_found');
  }

  const action = exactRoute ? exactRoute.action : 'listing:read';

  const sizeCheck = checkDeclaredBodySize(request);
  if (!sizeCheck.ok) {
    return buildErrorResponse(sizeCheck.code, sizeCheck.messageKey);
  }

  const rawBody = await request.text();
  const bodyCheck = validateNoBodyPayload(rawBody, request.headers.get('content-type'));
  if (!bodyCheck.ok) {
    return buildErrorResponse(bodyCheck.code, bodyCheck.messageKey);
  }

  const actor = deriveActor(request);
  const decision = authorize({ actor, action });
  if (!decision.allowed) {
    return buildErrorResponse('UNAUTHENTICATED', 'error.unauthenticated.generic');
  }

  // Cloudflare sets this header itself at the edge; it is not a
  // client-suppliable value the way an X-Forwarded-For style header would be.
  const rateLimitSourceKey = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const rateLimitDecision = apiRateLimiter.consume(`${action}:${rateLimitSourceKey}`);
  if (!rateLimitDecision.allowed) {
    return buildErrorResponse('RATE_LIMITED', 'error.rate_limited.generic', {
      headers: { 'retry-after': Math.ceil(rateLimitDecision.retryAfterMs / 1000).toString() },
    });
  }

  if (exactRoute?.action === 'health:read') {
    const config = buildHealthConfig(env);
    return new Response(JSON.stringify(config), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  if (exactRoute?.action === 'search:read') {
    return handleSearchRequest(request, env);
  }

  // Only remaining possibility: the dynamic GET /v1/listings/{id} route.
  return handleListingRequest(listingId as string, env);
}

const worker = {
  fetch: handleRequest,
};

export default worker;
