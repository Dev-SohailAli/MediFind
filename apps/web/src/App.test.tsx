import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { strings } from './content/strings';

describe('App', () => {
  it('renders exactly one main#main-content landmark', () => {
    render(<App />);

    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute('id', 'main-content');
  });

  it('renders the skip link with the reviewed label, pointing at the main landmark', () => {
    render(<App />);

    const skipLink = screen.getByRole('link', { name: strings.skipToContentLabel });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('activating the skip link moves focus to main#main-content', async () => {
    const user = userEvent.setup();
    render(<App />);

    const skipLink = screen.getByRole('link', { name: strings.skipToContentLabel });
    await user.click(skipLink);

    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('renders exactly three ordinary navigation buttons with aria-current="page" on Search by default', () => {
    render(<App />);

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav.querySelectorAll('button')).toHaveLength(3);
    expect(screen.getByRole('button', { name: strings.navSearchLabel })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('switching to Requests keeps the same skip target and shows no protected workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navRequestsLabel }));

    expect(screen.getByRole('button', { name: strings.navRequestsLabel })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute('id', 'main-content');
    expect(
      screen.getByRole('heading', { name: strings.requestsPlaceholderTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText(strings.requestsPlaceholderBody)).toBeInTheDocument();

    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('sign in');
    expect(bodyText).not.toContain('log in');
    expect(bodyText).not.toContain('password');
  });

  it('switching to Account keeps the same skip target and shows only the synthetic sign-in form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));

    expect(screen.getByRole('button', { name: strings.navAccountLabel })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('heading', { name: strings.signInTitle })).toBeInTheDocument();

    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('password');
  });

  it('the skip link still works after navigating to Requests/Account', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));
    await user.click(screen.getByRole('link', { name: strings.skipToContentLabel }));

    expect(screen.getByRole('main')).toHaveFocus();
  });
});
