import * as React from 'react';

import {
  createInitialReservationsState,
  syntheticReservationsReducer,
  type SyntheticReservationsAction,
  type SyntheticReservationsState,
} from './syntheticReservations';

export interface SyntheticReservationsContextValue {
  readonly state: SyntheticReservationsState;
  readonly dispatch: React.Dispatch<SyntheticReservationsAction>;
}

const SyntheticReservationsContext = React.createContext<SyntheticReservationsContextValue | null>(
  null,
);

export interface SyntheticReservationsProviderProps {
  readonly children: React.ReactNode;
}

// React's useReducer overload resolution can't cope with the reducer's
// optional third `now` clock parameter (kept for deterministic unit
// tests); see apps/web/src/auth/AuthContext.tsx for the same pattern.
function reduceWithRealClock(
  state: SyntheticReservationsState,
  action: SyntheticReservationsAction,
): SyntheticReservationsState {
  return syntheticReservationsReducer(state, action);
}

/**
 * Holds every synthetic reservation for the lifetime of the app only —
 * deliberately not written to any persistent browser storage, so a page
 * reload always returns to no reservations. Shared at the app root (rather
 * than owned locally like `syntheticListings` in PharmacyWorkspaces) because
 * a reservation created from the buyer Search screen must be visible from
 * both the buyer Requests screen and the pharmacy Requests queue.
 */
export function SyntheticReservationsProvider({ children }: SyntheticReservationsProviderProps) {
  const [state, dispatch] = React.useReducer(
    reduceWithRealClock,
    undefined,
    createInitialReservationsState,
  );
  const value = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <SyntheticReservationsContext.Provider value={value}>
      {children}
    </SyntheticReservationsContext.Provider>
  );
}

export function useSyntheticReservations(): SyntheticReservationsContextValue {
  const context = React.useContext(SyntheticReservationsContext);
  if (!context) {
    throw new Error('useSyntheticReservations must be used within a SyntheticReservationsProvider');
  }
  return context;
}
