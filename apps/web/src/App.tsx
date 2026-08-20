import * as React from 'react';

import { AccountScreen, RecoveryHoldState } from './components/AccountScreen';
import { InstallBanner } from './components/InstallBanner';
import { type AppTab, NavBar } from './components/NavBar';
import { OfflineBanner } from './components/OfflineBanner';
import { RequestsScreen } from './components/RequestsScreen';
import { SearchScreen } from './components/SearchScreen';
import { SignInScreen } from './components/SignInScreen';
import { SyntheticAuthProvider, useSyntheticAuth } from './auth/AuthContext';
import {
  SyntheticNotificationsProvider,
  useSyntheticNotifications,
} from './notifications/NotificationsContext';
import {
  SyntheticReservationsProvider,
  useSyntheticReservations,
} from './reservations/ReservationsContext';
import { strings } from './content/strings';

function handleSkipLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('main-content');
  if (!target) {
    return;
  }
  event.preventDefault();
  target.focus();
  target.scrollIntoView?.();
}

function AccountTabContent() {
  const { state } = useSyntheticAuth();

  if (state.status === 'signed_in') {
    return <AccountScreen />;
  }
  if (state.status === 'recovery_hold') {
    return <RecoveryHoldState />;
  }
  return <SignInScreen />;
}

function useBuyerKey(): string | null {
  const { state } = useSyntheticAuth();
  return state.status === 'signed_in' && state.session ? state.session.profile.phone : null;
}

interface AppShellProps {
  readonly activeTab: AppTab;
  readonly onSelectTab: (tab: AppTab) => void;
}

/**
 * Separated from `App` so it can call `useSyntheticAuth`/
 * `useSyntheticReservations` — both providers wrap this component, not the
 * other way around.
 */
function AppShell({ activeTab, onSelectTab }: AppShellProps) {
  const buyerKey = useBuyerKey();
  const { state: reservationsState, dispatch: reservationsDispatch } = useSyntheticReservations();
  const {
    readState: notificationReadState,
    readDispatch: notificationReadDispatch,
    optInStatus: notificationOptInStatus,
    optInDispatch: notificationOptInDispatch,
  } = useSyntheticNotifications();

  return (
    <div className="app-root">
      <a href="#main-content" className="skip-link" onClick={handleSkipLinkClick}>
        {strings.skipToContentLabel}
      </a>

      <InstallBanner />
      <OfflineBanner />

      {/*
        One persistent <main id="main-content"> around whichever page is
        active, so the skip link works identically from Search, Requests
        and Account — not only from Search, which previously owned the id
        itself and left Requests/Account with no skip target at all.
      */}
      <main id="main-content" tabIndex={-1} className="app-body">
        {activeTab === 'search' ? (
          <SearchScreen
            buyerKey={buyerKey}
            reservations={reservationsState.reservations}
            onRequestReservation={(input) =>
              buyerKey && reservationsDispatch({ type: 'request', buyerKey, input })
            }
          />
        ) : null}
        {activeTab === 'requests' ? (
          <RequestsScreen
            buyerKey={buyerKey}
            reservations={reservationsState.reservations}
            dispatch={reservationsDispatch}
            onNavigateToAccount={() => onSelectTab('account')}
            notificationReadState={notificationReadState}
            notificationReadDispatch={notificationReadDispatch}
            notificationOptInStatus={notificationOptInStatus}
            notificationOptInDispatch={notificationOptInDispatch}
          />
        ) : null}
        {activeTab === 'account' ? <AccountTabContent /> : null}
      </main>

      <p className="build-label">{strings.localDevBuildLabel}</p>

      <NavBar active={activeTab} onSelect={onSelectTab} />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = React.useState<AppTab>('search');

  return (
    <SyntheticAuthProvider>
      <SyntheticReservationsProvider>
        <SyntheticNotificationsProvider>
          <AppShell activeTab={activeTab} onSelectTab={setActiveTab} />
        </SyntheticNotificationsProvider>
      </SyntheticReservationsProvider>
    </SyntheticAuthProvider>
  );
}
