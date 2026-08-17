import * as React from 'react';
import { X } from 'lucide-react';

import { strings } from '../content/strings';
import { iconStrokeWidth } from '../theme/tokens';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
}

/**
 * Just-in-time installability guidance, per docs/web-platform-capabilities-policy.md
 * ("PWA installation/offline shell ... Installation is optional"). Never
 * blocks app use; dismissing it only hides the banner for this session (no
 * browser storage is used to remember the choice).
 */
export function InstallBanner() {
  const [dismissed, setDismissed] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);

  React.useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (dismissed) {
    return null;
  }

  const hint = isIosSafari() ? strings.installBannerIosHint : strings.installBannerAndroidHint;

  return (
    <div className="top-banner" role="region" aria-label={strings.installBannerTitle}>
      <span>
        <strong>{strings.installBannerTitle}</strong> {strings.installBannerBody} {hint}
      </span>
      {deferredPrompt ? (
        <button
          type="button"
          onClick={() => {
            void deferredPrompt.prompt();
            setDeferredPrompt(null);
          }}
          className="top-banner__dismiss"
        >
          {strings.installBannerInstallLabel}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={strings.installBannerDismissLabel}
        className="top-banner__dismiss"
      >
        <X aria-hidden="true" size={18} strokeWidth={iconStrokeWidth} />
      </button>
    </div>
  );
}
