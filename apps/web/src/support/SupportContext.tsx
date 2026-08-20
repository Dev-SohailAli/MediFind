import * as React from 'react';

import {
  createInitialSupportState,
  syntheticSupportReducer,
  type SupportAction,
  type SyntheticSupportState,
} from './syntheticSupport';

export interface SyntheticSupportContextValue {
  readonly state: SyntheticSupportState;
  readonly dispatch: React.Dispatch<SupportAction>;
}

const SyntheticSupportContext = React.createContext<SyntheticSupportContextValue | null>(null);

export interface SyntheticSupportProviderProps {
  readonly children: React.ReactNode;
}

// React's useReducer overload resolution can't cope with the reducer's
// optional third `now` clock parameter (kept for deterministic unit
// tests); see apps/web/src/auth/AuthContext.tsx for the same pattern.
function reduceWithRealClock(
  state: SyntheticSupportState,
  action: SupportAction,
): SyntheticSupportState {
  return syntheticSupportReducer(state, action);
}

/**
 * Holds every synthetic support report for the lifetime of the app only
 * — deliberately not written to any persistent browser storage. Shared
 * at the app root because a report submitted from Search/Account must be
 * visible from the support/moderation view reached through Account.
 */
export function SyntheticSupportProvider({ children }: SyntheticSupportProviderProps) {
  const [state, dispatch] = React.useReducer(
    reduceWithRealClock,
    undefined,
    createInitialSupportState,
  );
  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <SyntheticSupportContext.Provider value={value}>{children}</SyntheticSupportContext.Provider>
  );
}

export function useSyntheticSupport(): SyntheticSupportContextValue {
  const context = React.useContext(SyntheticSupportContext);
  if (!context) {
    throw new Error('useSyntheticSupport must be used within a SyntheticSupportProvider');
  }
  return context;
}
