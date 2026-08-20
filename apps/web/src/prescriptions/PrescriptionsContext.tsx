import * as React from 'react';

import {
  createInitialPrescriptionsState,
  syntheticPrescriptionsReducer,
  type SyntheticPrescriptionsAction,
  type SyntheticPrescriptionsState,
} from './syntheticPrescriptions';

export interface SyntheticPrescriptionsContextValue {
  readonly state: SyntheticPrescriptionsState;
  readonly dispatch: React.Dispatch<SyntheticPrescriptionsAction>;
}

const SyntheticPrescriptionsContext =
  React.createContext<SyntheticPrescriptionsContextValue | null>(null);

export interface SyntheticPrescriptionsProviderProps {
  readonly children: React.ReactNode;
}

// React's useReducer overload resolution can't cope with the reducer's
// optional third `now` clock parameter (kept for deterministic unit
// tests); see apps/web/src/auth/AuthContext.tsx for the same pattern.
function reduceWithRealClock(
  state: SyntheticPrescriptionsState,
  action: SyntheticPrescriptionsAction,
): SyntheticPrescriptionsState {
  return syntheticPrescriptionsReducer(state, action);
}

/**
 * Holds every synthetic prescription for the lifetime of the app only —
 * deliberately not written to any persistent browser storage. Shared at
 * the app root (like ReservationsContext) because a prescription uploaded
 * from the buyer Requests screen must be visible from the pharmacy
 * Requests queue too.
 */
export function SyntheticPrescriptionsProvider({ children }: SyntheticPrescriptionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    reduceWithRealClock,
    undefined,
    createInitialPrescriptionsState,
  );
  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <SyntheticPrescriptionsContext.Provider value={value}>
      {children}
    </SyntheticPrescriptionsContext.Provider>
  );
}

export function useSyntheticPrescriptions(): SyntheticPrescriptionsContextValue {
  const context = React.useContext(SyntheticPrescriptionsContext);
  if (!context) {
    throw new Error(
      'useSyntheticPrescriptions must be used within a SyntheticPrescriptionsProvider',
    );
  }
  return context;
}
