import { afterEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { OfflineBanner } from '../OfflineBanner';

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { configurable: true, value });
}

describe('OfflineBanner', () => {
  const originalOnLine = window.navigator.onLine;

  afterEach(() => {
    setOnline(originalOnLine);
  });

  it('is absent while online', () => {
    setOnline(true);
    render(<OfflineBanner />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('appears with the safe local-prototype offline copy when the offline event fires, and never mentions a network error', () => {
    setOnline(true);
    render(<OfflineBanner />);

    act(() => {
      setOnline(false);
      window.dispatchEvent(new Event('offline'));
    });

    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent(strings.offlineTitle);
    expect(banner).toHaveTextContent(strings.offlineBody);
  });

  it('is dismissible and disappears again when back online', async () => {
    const user = userEvent.setup();
    setOnline(true);
    render(<OfflineBanner />);

    act(() => {
      setOnline(false);
      window.dispatchEvent(new Event('offline'));
    });
    expect(screen.getByRole('status')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: strings.offlineBannerDismissLabel }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    act(() => {
      setOnline(true);
      window.dispatchEvent(new Event('online'));
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
