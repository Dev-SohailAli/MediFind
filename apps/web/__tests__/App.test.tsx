import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../src/App';
import { strings } from '../src/content/strings';

describe('App', () => {
  it('defaults to the Search tab selected, with the local synthetic build label visible', async () => {
    render(<App />);

    const searchTab = screen.getByRole('button', { name: strings.navSearchLabel });
    expect(searchTab).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText(strings.localDevBuildLabel)).toBeInTheDocument();
    expect(await screen.findByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });

  it('switching to Requests shows only the inert prototype notice, never account/history content', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navRequestsLabel }));

    expect(screen.getByText(strings.requestsPlaceholderBody)).toBeInTheDocument();
    expect(screen.queryByText(strings.browseEmptyTitle)).not.toBeInTheDocument();
    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('sign in');
    expect(bodyText).not.toContain('signed in');
  });

  it('switching to Account shows only the inert prototype notice, never profile/auth content', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));

    expect(screen.getByText(strings.accountPlaceholderBody)).toBeInTheDocument();
    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('password');
    expect(bodyText).not.toContain('profile photo');
  });

  it('switching back to Search restores the search experience', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));
    await user.click(screen.getByRole('button', { name: strings.navSearchLabel }));

    expect(await screen.findByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });

  it('marks only the active nav button with aria-current="page"', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchTab = screen.getByRole('button', { name: strings.navSearchLabel });
    const requestsTab = screen.getByRole('button', { name: strings.navRequestsLabel });
    const accountTab = screen.getByRole('button', { name: strings.navAccountLabel });

    expect(searchTab).toHaveAttribute('aria-current', 'page');
    expect(requestsTab).not.toHaveAttribute('aria-current');
    expect(accountTab).not.toHaveAttribute('aria-current');

    await user.click(requestsTab);

    expect(searchTab).not.toHaveAttribute('aria-current');
    expect(requestsTab).toHaveAttribute('aria-current', 'page');
  });

  it('the nav is a plain landmark, not the (incomplete) ARIA tabs pattern', () => {
    render(<App />);

    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('renders a skip-to-content link targeting the persistent main landmark', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: strings.skipToContentLabel })).toHaveAttribute(
      'href',
      '#main-content',
    );
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it.each([
    ['Search', strings.navSearchLabel],
    ['Requests', strings.navRequestsLabel],
    ['Account', strings.navAccountLabel],
  ])('the skip link moves focus to main content from the %s page', async (_label, navLabel) => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: navLabel }));

    const skipLink = screen.getByRole('link', { name: strings.skipToContentLabel });
    await user.click(skipLink);

    expect(screen.getByRole('main')).toHaveFocus();
  });
});
