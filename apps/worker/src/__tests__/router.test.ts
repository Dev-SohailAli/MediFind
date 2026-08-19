import { describe, expect, it } from 'vitest';

import { matchListingRoute, matchRoute } from '../http/router.js';

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

describe('matchListingRoute', () => {
  it('extracts the opaque id segment from a GET /v1/listings/{id} path', () => {
    expect(matchListingRoute('GET', '/v1/listings/nivaprin-solandra')).toBe('nivaprin-solandra');
  });

  it('returns null for a non-GET method on the same path (never a distinct 405)', () => {
    expect(matchListingRoute('POST', '/v1/listings/nivaprin-solandra')).toBeNull();
    expect(matchListingRoute('DELETE', '/v1/listings/nivaprin-solandra')).toBeNull();
  });

  it('returns null for the collection path with no id segment', () => {
    expect(matchListingRoute('GET', '/v1/listings')).toBeNull();
    expect(matchListingRoute('GET', '/v1/listings/')).toBeNull();
  });

  it('returns null for a path with an extra nested segment', () => {
    expect(matchListingRoute('GET', '/v1/listings/abc/def')).toBeNull();
  });

  it('returns null for an unrelated path', () => {
    expect(matchListingRoute('GET', '/v1/health')).toBeNull();
  });

  it('URL-decodes the id segment but never crosses a path boundary via an encoded slash', () => {
    expect(matchListingRoute('GET', '/v1/listings/abc%2Fdef')).toBeNull();
  });
});
