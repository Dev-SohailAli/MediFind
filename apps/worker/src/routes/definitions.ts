export const PACKAGE_BOUNDARY = 'worker' as const;

export const ROUTES = [
  { method: 'GET', path: '/v1/health', action: 'health:read' },
  { method: 'GET', path: '/v1/search', action: 'search:read' },
  { method: 'GET', path: '/v1/listings/:id', action: 'listing:read' },
] as const;
