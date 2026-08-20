import * as React from 'react';

import {
  createInitialNotificationOptInStatus,
  createInitialNotificationReadState,
  notificationOptInReducer,
  notificationReadReducer,
  type NotificationOptInAction,
  type NotificationOptInStatus,
  type NotificationReadAction,
  type NotificationReadState,
} from './syntheticNotifications';

export interface SyntheticNotificationsContextValue {
  readonly readState: NotificationReadState;
  readonly readDispatch: React.Dispatch<NotificationReadAction>;
  readonly optInStatus: NotificationOptInStatus;
  readonly optInDispatch: React.Dispatch<NotificationOptInAction>;
}

const SyntheticNotificationsContext =
  React.createContext<SyntheticNotificationsContextValue | null>(null);

export interface SyntheticNotificationsProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Holds only the read/unread and opt-in-explainer UI state for the
 * lifetime of the app — deliberately not persisted. The notification
 * entries themselves are never stored here; they are derived on demand
 * from reservation state (see `deriveNotifications` in
 * syntheticNotifications.ts) wherever they are displayed.
 */
export function SyntheticNotificationsProvider({ children }: SyntheticNotificationsProviderProps) {
  const [readState, readDispatch] = React.useReducer(
    notificationReadReducer,
    undefined,
    createInitialNotificationReadState,
  );
  const [optInStatus, optInDispatch] = React.useReducer(
    notificationOptInReducer,
    undefined,
    createInitialNotificationOptInStatus,
  );
  const value = React.useMemo(
    () => ({ readState, readDispatch, optInStatus, optInDispatch }),
    [readState, optInStatus],
  );

  return (
    <SyntheticNotificationsContext.Provider value={value}>
      {children}
    </SyntheticNotificationsContext.Provider>
  );
}

export function useSyntheticNotifications(): SyntheticNotificationsContextValue {
  const context = React.useContext(SyntheticNotificationsContext);
  if (!context) {
    throw new Error(
      'useSyntheticNotifications must be used within a SyntheticNotificationsProvider',
    );
  }
  return context;
}
