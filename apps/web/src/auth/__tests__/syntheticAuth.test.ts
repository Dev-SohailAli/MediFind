import { describe, expect, it } from 'vitest';

import {
  SYNTHETIC_AUTH_CODE_TTL_MINUTES,
  SYNTHETIC_AUTH_DEMO_CODE,
  SYNTHETIC_AUTH_MAX_ATTEMPTS,
  SYNTHETIC_AUTH_RECOVERY_HOLD_HOURS,
  createInitialSyntheticAuthState,
  syntheticAuthReducer,
  type SyntheticAuthState,
  type SyntheticBuyerProfile,
} from '../syntheticAuth';

const NOW = new Date('2026-08-19T00:00:00.000Z');

const PROFILE: SyntheticBuyerProfile = {
  phone: '+6797654321',
  legalName: 'Demo Buyer',
  email: 'demo.buyer@example.test',
};

function afterMinutes(base: Date, minutes: number): Date {
  return new Date(base.getTime() + minutes * 60_000);
}

function afterHours(base: Date, hours: number): Date {
  return new Date(base.getTime() + hours * 60 * 60_000);
}

function sendCode(
  state: SyntheticAuthState = createInitialSyntheticAuthState(),
): SyntheticAuthState {
  return syntheticAuthReducer(state, { type: 'send_code', profile: PROFILE }, NOW);
}

describe('synthetic buyer auth reducer', () => {
  it('starts signed out with zero attempts and no session', () => {
    const state = createInitialSyntheticAuthState();

    expect(state).toEqual({ status: 'signed_out', attempts: 0 });
  });

  it('moves to code_sent after send_code, storing only the pending profile and issue time', () => {
    const state = sendCode();

    expect(state.status).toBe('code_sent');
    expect(state.pendingProfile).toEqual(PROFILE);
    expect(state.codeIssuedAt).toBe(NOW.toISOString());
    expect(state.attempts).toBe(0);
    expect(state.lastError).toBeUndefined();
  });

  it('ignores send_code when not signed out (defensive no-op)', () => {
    const codeSent = sendCode();
    const result = syntheticAuthReducer(codeSent, { type: 'send_code', profile: PROFILE }, NOW);

    expect(result).toBe(codeSent);
  });

  it('signs in on the correct demo code within the TTL window and clears the pending profile', () => {
    const codeSent = sendCode();
    const verifyAt = afterMinutes(NOW, SYNTHETIC_AUTH_CODE_TTL_MINUTES - 1);

    const result = syntheticAuthReducer(
      codeSent,
      { type: 'submit_code', code: SYNTHETIC_AUTH_DEMO_CODE },
      verifyAt,
    );

    expect(result.status).toBe('signed_in');
    expect(result.pendingProfile).toBeUndefined();
    expect(result.session).toEqual({
      sessionId: expect.any(String),
      profile: PROFILE,
      issuedAt: verifyAt.toISOString(),
      expiresAt: expect.any(String),
    });
    expect(new Date(result.session!.expiresAt).getTime()).toBeGreaterThan(verifyAt.getTime());
    expect(result.attempts).toBe(0);
    expect(result.lastError).toBeUndefined();
  });

  it('rejects an expired code without counting it as a wrong attempt', () => {
    const codeSent = sendCode();
    const verifyAt = afterMinutes(NOW, SYNTHETIC_AUTH_CODE_TTL_MINUTES + 1);

    const result = syntheticAuthReducer(
      codeSent,
      { type: 'submit_code', code: SYNTHETIC_AUTH_DEMO_CODE },
      verifyAt,
    );

    expect(result.status).toBe('code_sent');
    expect(result.lastError).toBe('expired_code');
    expect(result.attempts).toBe(0);
  });

  it('rejects a wrong code, incrementing attempts with a generic invalid_code error', () => {
    const codeSent = sendCode();

    const result = syntheticAuthReducer(codeSent, { type: 'submit_code', code: '000000' }, NOW);

    expect(result.status).toBe('code_sent');
    expect(result.lastError).toBe('invalid_code');
    expect(result.attempts).toBe(1);
  });

  it('never reveals the demo code or a real-looking value in a rejected state', () => {
    const codeSent = sendCode();
    const result = syntheticAuthReducer(codeSent, { type: 'submit_code', code: '000000' }, NOW);

    expect(JSON.stringify(result)).not.toContain(SYNTHETIC_AUTH_DEMO_CODE);
  });

  it(`rate-limits after ${SYNTHETIC_AUTH_MAX_ATTEMPTS} wrong attempts with a generic status, not a threshold-revealing message`, () => {
    let state = sendCode();
    for (let attempt = 1; attempt < SYNTHETIC_AUTH_MAX_ATTEMPTS; attempt += 1) {
      state = syntheticAuthReducer(state, { type: 'submit_code', code: '000000' }, NOW);
      expect(state.status).toBe('code_sent');
    }

    const limited = syntheticAuthReducer(state, { type: 'submit_code', code: '000000' }, NOW);

    expect(limited.status).toBe('rate_limited');
    expect(limited.attempts).toBe(SYNTHETIC_AUTH_MAX_ATTEMPTS);
    expect(limited.lastError).toBeUndefined();
  });

  it('resend_code issues a fresh window and resets attempts from code_sent or rate_limited', () => {
    const codeSent = sendCode();
    const wrong = syntheticAuthReducer(codeSent, { type: 'submit_code', code: '000000' }, NOW);
    const resendAt = afterMinutes(NOW, 1);

    const resent = syntheticAuthReducer(wrong, { type: 'resend_code' }, resendAt);

    expect(resent.status).toBe('code_sent');
    expect(resent.attempts).toBe(0);
    expect(resent.lastError).toBeUndefined();
    expect(resent.codeIssuedAt).toBe(resendAt.toISOString());
  });

  it('an old code becomes invalid once resend_code issues a new one', () => {
    const codeSent = sendCode();
    const resendAt = afterMinutes(NOW, 1);
    const resent = syntheticAuthReducer(codeSent, { type: 'resend_code' }, resendAt);

    // The original demo code is still textually correct, but the state
    // machine must key expiry/validity off codeIssuedAt, so resubmitting at
    // the *original* issue time must not be treated as fresh.
    const result = syntheticAuthReducer(
      resent,
      { type: 'submit_code', code: SYNTHETIC_AUTH_DEMO_CODE },
      afterMinutes(resendAt, SYNTHETIC_AUTH_CODE_TTL_MINUTES + 1),
    );

    expect(result.status).toBe('code_sent');
    expect(result.lastError).toBe('expired_code');
  });

  it('signs out from signed_in, clearing the session and resetting attempts', () => {
    const signedIn = syntheticAuthReducer(
      sendCode(),
      { type: 'submit_code', code: SYNTHETIC_AUTH_DEMO_CODE },
      NOW,
    );

    const result = syntheticAuthReducer(signedIn, { type: 'sign_out' }, NOW);

    expect(result).toEqual({ status: 'signed_out', attempts: 0 });
  });

  it('expire_session (demo-only) drops straight back to signed_out from signed_in', () => {
    const signedIn = syntheticAuthReducer(
      sendCode(),
      { type: 'submit_code', code: SYNTHETIC_AUTH_DEMO_CODE },
      NOW,
    );

    const result = syntheticAuthReducer(
      signedIn,
      { type: 'expire_session' },
      afterMinutes(NOW, 45),
    );

    expect(result).toEqual({ status: 'signed_out', attempts: 0 });
  });

  it(`request_recovery revokes the session and opens a ${SYNTHETIC_AUTH_RECOVERY_HOLD_HOURS}-hour hold`, () => {
    const signedIn = syntheticAuthReducer(
      sendCode(),
      { type: 'submit_code', code: SYNTHETIC_AUTH_DEMO_CODE },
      NOW,
    );

    const result = syntheticAuthReducer(signedIn, { type: 'request_recovery' }, NOW);

    expect(result.status).toBe('recovery_hold');
    expect(result.session).toBeUndefined();
    expect(result.recoveryHoldUntil).toBe(
      afterHours(NOW, SYNTHETIC_AUTH_RECOVERY_HOLD_HOURS).toISOString(),
    );
  });

  it('complete_recovery_hold (demo-only) returns to signed_out once the hold has elapsed', () => {
    const signedIn = syntheticAuthReducer(
      sendCode(),
      { type: 'submit_code', code: SYNTHETIC_AUTH_DEMO_CODE },
      NOW,
    );
    const onHold = syntheticAuthReducer(signedIn, { type: 'request_recovery' }, NOW);

    const result = syntheticAuthReducer(
      onHold,
      { type: 'complete_recovery_hold' },
      afterHours(NOW, SYNTHETIC_AUTH_RECOVERY_HOLD_HOURS + 1),
    );

    expect(result).toEqual({ status: 'signed_out', attempts: 0 });
  });

  it('ignores sign_out, request_recovery and submit_code while already signed out (defensive no-op)', () => {
    const initial = createInitialSyntheticAuthState();

    expect(syntheticAuthReducer(initial, { type: 'sign_out' }, NOW)).toBe(initial);
    expect(syntheticAuthReducer(initial, { type: 'request_recovery' }, NOW)).toBe(initial);
    expect(
      syntheticAuthReducer(initial, { type: 'submit_code', code: SYNTHETIC_AUTH_DEMO_CODE }, NOW),
    ).toBe(initial);
    expect(syntheticAuthReducer(initial, { type: 'complete_recovery_hold' }, NOW)).toBe(initial);
    expect(syntheticAuthReducer(initial, { type: 'expire_session' }, NOW)).toBe(initial);
  });
});
