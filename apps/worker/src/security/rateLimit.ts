export type RateLimitDecision =
  { readonly allowed: true } | { readonly allowed: false; readonly retryAfterMs: number };

export interface RateLimiter {
  consume(key: string): RateLimitDecision;
}

export interface RateLimitOptions {
  readonly limit: number;
  readonly windowMs: number;
  readonly now?: () => number;
}

// A bounded per-key sliding-window counter. This instance-local store is
// correct for the local Worker test harness and a single-instance dev
// preview; a persistent per-actor/action store (never one global counter)
// is required before this seam backs a real edge deployment with multiple
// concurrent Worker instances (see docs/cloudflare-web-architecture.md).
export function createRateLimiter(options: RateLimitOptions): RateLimiter {
  const now = options.now ?? (() => Date.now());
  const hits = new Map<string, number[]>();

  return {
    consume(key: string): RateLimitDecision {
      const currentTime = now();
      const windowStart = currentTime - options.windowMs;
      const recentHits = (hits.get(key) ?? []).filter((hitTime) => hitTime > windowStart);

      if (recentHits.length >= options.limit) {
        const oldestHit = recentHits[0] ?? currentTime;
        hits.set(key, recentHits);
        return {
          allowed: false,
          retryAfterMs: Math.max(oldestHit + options.windowMs - currentTime, 1),
        };
      }

      recentHits.push(currentTime);
      hits.set(key, recentHits);
      return { allowed: true };
    },
  };
}
