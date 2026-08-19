/**
 * Local-only synthetic buyer sign-in/session/recovery simulation (ADR-277,
 * Milestone B of docs/superpowers/plans/2026-08-19-claude-full-synthetic-prototype-execution.md).
 * This is a demonstration state machine only: `SYNTHETIC_AUTH_DEMO_CODE` is a
 * fixed, publicly-known value, never a real one-time code, and no value here
 * is sent to or validated by a network request. Nothing in this module talks
 * to a real identity system or holds anything sensitive that would need
 * protecting.
 */

export const SYNTHETIC_AUTH_DEMO_CODE = '123456';
export const SYNTHETIC_AUTH_CODE_TTL_MINUTES = 10;
export const SYNTHETIC_AUTH_MAX_ATTEMPTS = 5;
export const SYNTHETIC_AUTH_SESSION_TTL_MINUTES = 30;
export const SYNTHETIC_AUTH_RECOVERY_HOLD_HOURS = 24;

export interface SyntheticBuyerProfile {
  readonly phone: string;
  readonly legalName: string;
  readonly email: string;
}

export type SyntheticAuthStatus =
  'signed_out' | 'code_sent' | 'signed_in' | 'rate_limited' | 'recovery_hold';

export interface SyntheticSession {
  readonly sessionId: string;
  readonly profile: SyntheticBuyerProfile;
  readonly issuedAt: string;
  readonly expiresAt: string;
}

export interface SyntheticAuthState {
  readonly status: SyntheticAuthStatus;
  readonly attempts: number;
  readonly pendingProfile?: SyntheticBuyerProfile;
  readonly codeIssuedAt?: string;
  readonly lastError?: 'invalid_code' | 'expired_code';
  readonly session?: SyntheticSession;
  readonly recoveryHoldUntil?: string;
}

export type SyntheticAuthAction =
  | { readonly type: 'send_code'; readonly profile: SyntheticBuyerProfile }
  | { readonly type: 'resend_code' }
  | { readonly type: 'submit_code'; readonly code: string }
  | { readonly type: 'sign_out' }
  | { readonly type: 'request_recovery' }
  | { readonly type: 'complete_recovery_hold' }
  | { readonly type: 'expire_session' };

export function createInitialSyntheticAuthState(): SyntheticAuthState {
  return { status: 'signed_out', attempts: 0 };
}

function issueCode(profile: SyntheticBuyerProfile, now: Date): SyntheticAuthState {
  return {
    status: 'code_sent',
    attempts: 0,
    pendingProfile: profile,
    codeIssuedAt: now.toISOString(),
  };
}

function isCodeExpired(codeIssuedAt: string, now: Date): boolean {
  const ageMinutes = (now.getTime() - new Date(codeIssuedAt).getTime()) / 60_000;
  return ageMinutes > SYNTHETIC_AUTH_CODE_TTL_MINUTES;
}

function createSession(profile: SyntheticBuyerProfile, now: Date): SyntheticSession {
  return {
    sessionId: crypto.randomUUID(),
    profile,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SYNTHETIC_AUTH_SESSION_TTL_MINUTES * 60_000).toISOString(),
  };
}

/**
 * Pure reducer: every transition is a deterministic function of the current
 * state, the action and an explicit clock, so tests never depend on real
 * wall-clock time. `expire_session` and `complete_recovery_hold` are
 * demo-only manual actions standing in for time actually passing, since this
 * simulation never runs a background timer.
 */
export function syntheticAuthReducer(
  state: SyntheticAuthState,
  action: SyntheticAuthAction,
  now: Date = new Date(),
): SyntheticAuthState {
  switch (action.type) {
    case 'send_code': {
      if (state.status !== 'signed_out') {
        return state;
      }
      return issueCode(action.profile, now);
    }

    case 'resend_code': {
      if (state.status !== 'code_sent' && state.status !== 'rate_limited') {
        return state;
      }
      if (!state.pendingProfile) {
        return state;
      }
      return issueCode(state.pendingProfile, now);
    }

    case 'submit_code': {
      if (state.status !== 'code_sent' || !state.pendingProfile || !state.codeIssuedAt) {
        return state;
      }

      if (isCodeExpired(state.codeIssuedAt, now)) {
        return { ...state, lastError: 'expired_code' };
      }

      if (action.code !== SYNTHETIC_AUTH_DEMO_CODE) {
        const attempts = state.attempts + 1;
        if (attempts >= SYNTHETIC_AUTH_MAX_ATTEMPTS) {
          return {
            status: 'rate_limited',
            attempts,
            pendingProfile: state.pendingProfile,
            codeIssuedAt: state.codeIssuedAt,
          };
        }
        return { ...state, attempts, lastError: 'invalid_code' };
      }

      return {
        status: 'signed_in',
        attempts: 0,
        session: createSession(state.pendingProfile, now),
      };
    }

    case 'sign_out': {
      if (state.status !== 'signed_in') {
        return state;
      }
      return createInitialSyntheticAuthState();
    }

    case 'expire_session': {
      if (state.status !== 'signed_in') {
        return state;
      }
      return createInitialSyntheticAuthState();
    }

    case 'request_recovery': {
      if (state.status !== 'signed_in') {
        return state;
      }
      return {
        status: 'recovery_hold',
        attempts: 0,
        recoveryHoldUntil: new Date(
          now.getTime() + SYNTHETIC_AUTH_RECOVERY_HOLD_HOURS * 60 * 60_000,
        ).toISOString(),
      };
    }

    case 'complete_recovery_hold': {
      if (state.status !== 'recovery_hold') {
        return state;
      }
      return createInitialSyntheticAuthState();
    }

    default:
      return state;
  }
}
