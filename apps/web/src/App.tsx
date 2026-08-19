import * as React from 'react';

import { AccountScreen, RecoveryHoldState } from './components/AccountScreen';
import { InstallBanner } from './components/InstallBanner';
import { type AppTab, NavBar } from './components/NavBar';
import { OfflineBanner } from './components/OfflineBanner';
import { PrototypePlaceholder } from './components/PrototypePlaceholder';
import { SearchScreen } from './components/SearchScreen';
import { SignInScreen } from './components/SignInScreen';
import { SyntheticAuthProvider, useSyntheticAuth } from './auth/AuthContext';
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

export default function App() {
  const [activeTab, setActiveTab] = React.useState<AppTab>('search');

  return (
    <SyntheticAuthProvider>
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
          {activeTab === 'search' ? <SearchScreen /> : null}
          {activeTab === 'requests' ? (
            <PrototypePlaceholder
              title={strings.requestsPlaceholderTitle}
              body={strings.requestsPlaceholderBody}
            />
          ) : null}
          {activeTab === 'account' ? <AccountTabContent /> : null}
        </main>

        <p className="build-label">{strings.localDevBuildLabel}</p>

        <NavBar active={activeTab} onSelect={setActiveTab} />
      </div>
    </SyntheticAuthProvider>
  );
}
