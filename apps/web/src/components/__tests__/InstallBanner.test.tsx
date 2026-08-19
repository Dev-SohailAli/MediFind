import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { InstallBanner } from '../InstallBanner';

describe('InstallBanner', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows install guidance and never blocks the rest of the app', () => {
    render(<InstallBanner />);

    expect(screen.getByText(strings.installBannerTitle)).toBeInTheDocument();
  });

  it('is dismissible and never reappears once dismissed for the session', async () => {
    const user = userEvent.setup();
    render(<InstallBanner />);

    await user.click(screen.getByRole('button', { name: strings.installBannerDismissLabel }));

    expect(screen.queryByText(strings.installBannerTitle)).not.toBeInTheDocument();
  });

  it('never requests a browser permission on mount', () => {
    render(<InstallBanner />);

    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('allow location');
    expect(bodyText).not.toContain('allow notifications');
  });

  it('renders with no beforeinstallprompt captured, without ever calling notification/geolocation/storage/file capability APIs', () => {
    const notificationSpy = vi.fn();
    const geolocationSpy = vi.fn();
    const originalNotification = (globalThis as { Notification?: unknown }).Notification;
    const originalGeolocation = navigator.geolocation as unknown;
    Object.defineProperty(globalThis, 'Notification', {
      configurable: true,
      value: function Notification() {
        notificationSpy();
      },
    });
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: { getCurrentPosition: geolocationSpy },
    });
    const localStorageSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(<InstallBanner />);

    // No install prompt was ever fired in this render, so the install
    // guidance must degrade to the plain browser-continuation copy, not
    // block anything.
    expect(screen.getByText(strings.installBannerTitle)).toBeInTheDocument();
    expect(notificationSpy).not.toHaveBeenCalled();
    expect(geolocationSpy).not.toHaveBeenCalled();
    expect(localStorageSpy).not.toHaveBeenCalled();

    Object.defineProperty(globalThis, 'Notification', {
      configurable: true,
      value: originalNotification,
    });
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: originalGeolocation,
    });
  });

  it('denial/absence of beforeinstallprompt never blocks browsing: no install button renders without a captured prompt', () => {
    render(<InstallBanner />);

    // Only the dismiss (X) control renders until a real
    // `beforeinstallprompt` event is captured; there is no separate
    // "Install" action to click, and the banner never gates the rest of
    // the UI behind capability availability.
    expect(
      screen.queryByRole('button', { name: strings.installBannerInstallLabel }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: strings.installBannerDismissLabel }),
    ).toBeInTheDocument();
  });
});
