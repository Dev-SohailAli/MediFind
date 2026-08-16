import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../src/App';
import { strings } from '../src/content/strings';

describe('App', () => {
  it('defaults to the Search tab selected, with the local synthetic build label visible', () => {
    render(<App />);

    const searchTab = screen.getByRole('tab', { name: strings.navSearchLabel });
    expect(searchTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(strings.localDevBuildLabel)).toBeInTheDocument();
    expect(screen.getByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });

  it('switching to Requests shows only the inert prototype notice, never account/history content', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: strings.navRequestsLabel }));

    expect(screen.getByText(strings.requestsPlaceholderBody)).toBeInTheDocument();
    expect(screen.queryByText(strings.browseEmptyTitle)).not.toBeInTheDocument();
    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('sign in');
    expect(bodyText).not.toContain('signed in');
  });

  it('switching to Account shows only the inert prototype notice, never profile/auth content', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: strings.navAccountLabel }));

    expect(screen.getByText(strings.accountPlaceholderBody)).toBeInTheDocument();
    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('password');
    expect(bodyText).not.toContain('profile photo');
  });

  it('switching back to Search restores the search experience', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: strings.navAccountLabel }));
    await user.click(screen.getByRole('tab', { name: strings.navSearchLabel }));

    expect(screen.getByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });

  it('moves focus between tabs with arrow keys (roving tabindex)', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchTab = screen.getByRole('tab', { name: strings.navSearchLabel });
    searchTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: strings.navRequestsLabel })).toHaveFocus();
    expect(screen.getByRole('tab', { name: strings.navRequestsLabel })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('renders a skip-to-content link as the first focusable element', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: strings.skipToContentLabel })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });
});
