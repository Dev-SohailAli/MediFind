import { describe, expect, it } from 'vitest';

import { createRateLimiter } from '../security/rateLimit.js';

describe('rate limiter seam', () => {
  it('allows requests under the configured limit within the window', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000, now: () => 0 });

    expect(limiter.consume('client-a')).toEqual({ allowed: true });
    expect(limiter.consume('client-a')).toEqual({ allowed: true });
    expect(limiter.consume('client-a')).toEqual({ allowed: true });
  });

  it('denies a request once the per-key limit is exceeded and reports a retry delay', () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => 0 });

    limiter.consume('client-a');
    limiter.consume('client-a');
    const denied = limiter.consume('client-a');

    expect(denied.allowed).toBe(false);
    if (!denied.allowed) {
      expect(denied.retryAfterMs).toBeGreaterThan(0);
    }
  });

  it('scopes limits per key so one client cannot exhaust another client budget', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });

    expect(limiter.consume('client-a')).toEqual({ allowed: true });
    expect(limiter.consume('client-b')).toEqual({ allowed: true });
    expect(limiter.consume('client-a').allowed).toBe(false);
  });

  it('resets the window over time (no stale denial once the window elapses)', () => {
    let currentTime = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => currentTime });

    expect(limiter.consume('client-a')).toEqual({ allowed: true });
    expect(limiter.consume('client-a').allowed).toBe(false);

    currentTime = 1001;
    expect(limiter.consume('client-a')).toEqual({ allowed: true });
  });

  it('starts with a clean state on a fresh instance (proves no cross-cold-start leakage assumption)', () => {
    const first = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    first.consume('client-a');

    const second = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });

    expect(second.consume('client-a')).toEqual({ allowed: true });
  });

  it('handles many concurrent consumes for the same key deterministically', () => {
    const limiter = createRateLimiter({ limit: 5, windowMs: 1000, now: () => 0 });

    const results = Array.from({ length: 8 }, () => limiter.consume('client-a'));
    const allowedCount = results.filter((result) => result.allowed).length;

    expect(allowedCount).toBe(5);
  });
});
