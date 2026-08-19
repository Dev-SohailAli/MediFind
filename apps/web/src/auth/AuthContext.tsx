import * as React from 'react';

import {
  createInitialSyntheticAuthState,
  syntheticAuthReducer,
  type SyntheticAuthAction,
  type SyntheticAuthState,
} from './syntheticAuth';

export interface SyntheticAuthContextValue {
  readonly state: SyntheticAuthState;
  readonly dispatch: React.Dispatch<SyntheticAuthAction>;
}

const SyntheticAuthContext = React.createContext<SyntheticAuthContextValue | null>(null);

export interface SyntheticAuthProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Holds the synthetic sign-in/session/recovery state for the lifetime of the
 * app only — deliberately not written to any persistent browser storage, so
 * a page reload always returns to signed-out. See
 * apps/web/src/auth/syntheticAuth.ts for the state machine this wraps.
 */
// React's useReducer overload resolution can't cope with syntheticAuthReducer's
// optional third `now` clock parameter (kept for deterministic unit tests),
// so it's wrapped down to the plain two-argument shape React expects here;
// the real app always uses the real clock.
function reduceWithRealClock(
  state: SyntheticAuthState,
  action: SyntheticAuthAction,
): SyntheticAuthState {
  return syntheticAuthReducer(state, action);
}

export function SyntheticAuthProvider({ children }: SyntheticAuthProviderProps) {
  const [state, dispatch] = React.useReducer(
    reduceWithRealClock,
    undefined,
    createInitialSyntheticAuthState,
  );
  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return <SyntheticAuthContext.Provider value={value}>{children}</SyntheticAuthContext.Provider>;
}

export function useSyntheticAuth(): SyntheticAuthContextValue {
  const context = React.useContext(SyntheticAuthContext);
  if (!context) {
    throw new Error('useSyntheticAuth must be used within a SyntheticAuthProvider');
  }
  return context;
}
