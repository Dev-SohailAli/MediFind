import { describe, expect, it } from 'vitest';

import { matchRoute } from '../http/router.js';

const routes = [{ method: 'GET', path: '/v1/health', action: 'health:read' }];

describe('router', () => {
  it('matches an allow-listed method and path', () => {
    expect(matchRoute(routes, 'GET', '/v1/health')).toEqual(routes[0]);
  });

  it('returns null for an unknown path', () => {
    expect(matchRoute(routes, 'GET', '/v1/unknown')).toBeNull();
  });

  it('returns null for a disallowed method on a known path (never a distinct 405)', () => {
    expect(matchRoute(routes, 'POST', '/v1/health')).toBeNull();
  });

  it('is case-sensitive and does not trailing-slash-normalise a path', () => {
    expect(matchRoute(routes, 'GET', '/v1/health/')).toBeNull();
    expect(matchRoute(routes, 'GET', '/V1/HEALTH')).toBeNull();
  });
});
