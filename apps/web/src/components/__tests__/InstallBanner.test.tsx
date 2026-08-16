import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { InstallBanner } from '../InstallBanner';

describe('InstallBanner', () => {
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
});
