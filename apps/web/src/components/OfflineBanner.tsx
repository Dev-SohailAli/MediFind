import * as React from 'react';
import { X } from 'lucide-react';

import { strings } from '../content/strings';
import { iconStrokeWidth } from '../theme/tokens';

function getInitialOnlineState(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

/**
 * Reflects the browser's connectivity signal only (navigator.onLine plus
 * the online/offline events) — it does not probe the network. In the default
 * fixture mode this local synthetic prototype does not need a connection; the
 * opt-in Worker mode reports its own safe unavailable state.
 */
export function OfflineBanner() {
  const [online, setOnline] = React.useState(getInitialOnlineState);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }
    function handleOffline() {
      setOnline(false);
      setDismissed(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online || dismissed) {
    return null;
  }

  return (
    <div className="top-banner top-banner--warning" role="status">
      <span>
        <strong>{strings.offlineTitle}</strong> {strings.offlineBody}
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={strings.offlineBannerDismissLabel}
        className="top-banner__dismiss"
      >
        <X aria-hidden="true" size={18} strokeWidth={iconStrokeWidth} />
      </button>
    </div>
  );
}
