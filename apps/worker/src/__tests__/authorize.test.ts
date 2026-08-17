import { describe, expect, it } from 'vitest';

import { authorize } from '../security/authorize.js';
import type { ActorContext } from '../security/actor.js';

const anonymous: ActorContext = { type: 'anonymous', actorId: null };

describe('authorize', () => {
  it('allows the public health-check action for an anonymous actor', () => {
    expect(authorize({ actor: anonymous, action: 'health:read' })).toEqual({ allowed: true });
  });

  it('denies an unrecognised or protected action for an anonymous actor', () => {
    expect(authorize({ actor: anonymous, action: 'reservation:approve' })).toEqual({
      allowed: false,
      reason: 'unauthenticated',
    });
  });

  it('denies a cross-branch protected action even when a branch context is spoofed on the request', () => {
    const decision = authorize({
      actor: anonymous,
      action: 'listing:refresh',
      resourceBranchId: 'branch-9',
    });

    expect(decision).toEqual({ allowed: false, reason: 'unauthenticated' });
  });

  it('never allows a protected action merely because the action string looks safe', () => {
    const decision = authorize({ actor: anonymous, action: 'health:read:all' });

    expect(decision).toEqual({ allowed: false, reason: 'unauthenticated' });
  });
});
