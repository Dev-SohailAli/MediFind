import { describe, expect, it } from 'vitest';

import { deriveActor } from '../security/actor.js';

describe('actor derivation', () => {
  it('treats an ordinary request with no auth adapter as anonymous', () => {
    const request = new Request('https://worker.local/v1/health');

    expect(deriveActor(request)).toEqual({ type: 'anonymous', actorId: null });
  });

  it('ignores a spoofed actor/role header instead of trusting it', () => {
    const request = new Request('https://worker.local/v1/health', {
      headers: {
        'x-medifind-actor-id': 'pharmacy-owner-1',
        'x-medifind-actor-role': 'pharmacy_owner',
        'x-medifind-branch-id': 'branch-9',
      },
    });

    expect(deriveActor(request)).toEqual({ type: 'anonymous', actorId: null });
  });

  it('ignores every known spoofable header variant equally', () => {
    const headerNames = [
      'x-user-role',
      'x-actor-role',
      'x-role',
      'x-admin',
      'authorization',
      'x-medifind-actor-id',
    ];

    for (const headerName of headerNames) {
      const request = new Request('https://worker.local/v1/health', {
        headers: { [headerName]: 'admin' },
      });

      expect(deriveActor(request)).toEqual({ type: 'anonymous', actorId: null });
    }
  });
});
