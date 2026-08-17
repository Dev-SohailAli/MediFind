import { describe, expect, it } from 'vitest';

import { createIdempotencyStore } from '../security/idempotency.js';

describe('idempotency store seam', () => {
  it('treats the first use of a key/scope/fingerprint as new', () => {
    const store = createIdempotencyStore();

    expect(store.reserve('key-1', 'actor-1:reservation:approve', 'fingerprint-a')).toEqual({
      outcome: 'new',
    });
  });

  it('returns the original safe response on a duplicate retry with the same request fingerprint', () => {
    const store = createIdempotencyStore();
    store.reserve('key-1', 'actor-1:reservation:approve', 'fingerprint-a');
    store.complete('key-1', 'actor-1:reservation:approve', { status: 200, body: { ok: true } });

    const retry = store.reserve('key-1', 'actor-1:reservation:approve', 'fingerprint-a');

    expect(retry).toEqual({
      outcome: 'duplicate',
      response: { status: 200, body: { ok: true } },
    });
  });

  it('treats reuse of the same key with a changed request as a conflict', () => {
    const store = createIdempotencyStore();
    store.reserve('key-1', 'actor-1:reservation:approve', 'fingerprint-a');
    store.complete('key-1', 'actor-1:reservation:approve', { status: 200, body: { ok: true } });

    const changed = store.reserve('key-1', 'actor-1:reservation:approve', 'fingerprint-b');

    expect(changed).toEqual({ outcome: 'conflict' });
  });

  it('does not let a different actor/action/route context reuse the same key', () => {
    const store = createIdempotencyStore();
    store.reserve('key-1', 'actor-1:reservation:approve', 'fingerprint-a');
    store.complete('key-1', 'actor-1:reservation:approve', { status: 200, body: { ok: true } });

    const otherContext = store.reserve('key-1', 'actor-2:reservation:approve', 'fingerprint-a');

    expect(otherContext).toEqual({ outcome: 'new' });
  });

  it('expires a completed entry after the configured TTL', () => {
    let currentTime = 0;
    const store = createIdempotencyStore({ ttlMs: 1000, now: () => currentTime });
    store.reserve('key-1', 'actor-1:reservation:approve', 'fingerprint-a');
    store.complete('key-1', 'actor-1:reservation:approve', { status: 200, body: { ok: true } });

    currentTime = 1001;
    const afterExpiry = store.reserve('key-1', 'actor-1:reservation:approve', 'fingerprint-a');

    expect(afterExpiry).toEqual({ outcome: 'new' });
  });
});
