import * as React from 'react';

import { InstallBanner } from './components/InstallBanner';
import { type AppTab, NavBar } from './components/NavBar';
import { OfflineBanner } from './components/OfflineBanner';
import { PrototypePlaceholder } from './components/PrototypePlaceholder';
import { SearchScreen } from './components/SearchScreen';
import { strings } from './content/strings';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<AppTab>('search');

  return (
    <div className="app-root">
      <a href="#main-content" className="skip-link">
        {strings.skipToContentLabel}
      </a>

      <InstallBanner />
      <OfflineBanner />

      <div className="app-body">
        {activeTab === 'search' ? <SearchScreen /> : null}
        {activeTab === 'requests' ? (
          <PrototypePlaceholder
            title={strings.requestsPlaceholderTitle}
            body={strings.requestsPlaceholderBody}
          />
        ) : null}
        {activeTab === 'account' ? (
          <PrototypePlaceholder
            title={strings.accountPlaceholderTitle}
            body={strings.accountPlaceholderBody}
          />
        ) : null}
      </div>

      <p className="build-label">{strings.localDevBuildLabel}</p>

      <NavBar active={activeTab} onSelect={setActiveTab} />
    </div>
  );
}
