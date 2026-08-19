import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { NavBar } from '../NavBar';

describe('NavBar', () => {
  it('renders a Primary nav landmark with exactly three ordinary navigation buttons', () => {
    render(<NavBar active="search" onSelect={() => {}} />);

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons.every((button) => nav.contains(button))).toBe(true);
    expect(screen.getByRole('button', { name: strings.navSearchLabel })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: strings.navRequestsLabel })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: strings.navAccountLabel })).toBeInTheDocument();
  });

  it('marks only the active tab with aria-current="page"', () => {
    render(<NavBar active="requests" onSelect={() => {}} />);

    expect(screen.getByRole('button', { name: strings.navRequestsLabel })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: strings.navSearchLabel })).not.toHaveAttribute(
      'aria-current',
    );
    expect(screen.getByRole('button', { name: strings.navAccountLabel })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('is not the ARIA tabs pattern: no tablist/tab roles are used', () => {
    render(<NavBar active="search" onSelect={() => {}} />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('all three tabs are ordinary Tab-focusable buttons (no roving-tabindex scheme)', () => {
    render(<NavBar active="search" onSelect={() => {}} />);

    for (const button of screen.getAllByRole('button')) {
      expect(button).not.toHaveAttribute('tabindex', '-1');
    }
  });

  it('calls onSelect with the pressed tab value', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<NavBar active="search" onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));

    expect(onSelect).toHaveBeenCalledWith('account');
  });
});
