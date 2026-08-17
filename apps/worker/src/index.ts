import { buildErrorResponse } from './http/errors.js';
import { matchRoute } from './http/router.js';
import { checkDeclaredBodySize, validateNoBodyPayload } from './http/validate.js';
import { buildHealthConfig } from './routes/health.js';
import { deriveActor } from './security/actor.js';
import { authorize } from './security/authorize.js';
import { createRateLimiter } from './security/rateLimit.js';
import type { Env } from './types/env.js';

export const PACKAGE_BOUNDARY = 'worker' as const;

export const ROUTES = [{ method: 'GET', path: '/v1/health', action: 'health:read' }] as const;

// Instance-local; see the persistence caveat on `createRateLimiter`.
const healthRateLimiter = createRateLimiter({ limit: 60, windowMs: 60_000 });

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const route = matchRoute(ROUTES, request.method, url.pathname);

  if (!route) {
    return buildErrorResponse('NOT_FOUND', 'error.route.not_found');
  }

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
  const decision = authorize({ actor, action: route.action });
  if (!decision.allowed) {
    return buildErrorResponse('UNAUTHENTICATED', 'error.unauthenticated.generic');
  }

  // Cloudflare sets this header itself at the edge; it is not a
  // client-suppliable value the way an X-Forwarded-For style header would be.
  const rateLimitSourceKey = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const rateLimitDecision = healthRateLimiter.consume(`${route.action}:${rateLimitSourceKey}`);
  if (!rateLimitDecision.allowed) {
    return buildErrorResponse('RATE_LIMITED', 'error.rate_limited.generic', {
      headers: { 'retry-after': Math.ceil(rateLimitDecision.retryAfterMs / 1000).toString() },
    });
  }

  const config = buildHealthConfig(env);
  return new Response(JSON.stringify(config), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

const worker = {
  fetch: handleRequest,
};

export default worker;
