import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { strings } from '../../content/strings';
import {
  BrowseEmptyState,
  ErrorState,
  LoadingState,
  OfflineState,
  ZeroResultState,
} from '../SafeStates';

describe('SafeStates', () => {
  it('BrowseEmptyState shows the safe local-prototype browse prompt', () => {
    render(<BrowseEmptyState />);

    expect(screen.getByText(strings.browseEmptyTitle)).toBeInTheDocument();
    expect(screen.getByText(strings.browseEmptyBody)).toBeInTheDocument();
  });

  it('ZeroResultState shows the safe non-diagnostic copy and never implies unavailability', () => {
    render(<ZeroResultState />);

    const region = screen.getByRole('status');
    expect(region).toHaveTextContent(strings.zeroResultTitle);
    expect(region).toHaveTextContent(strings.zeroResultBody);
    expect(region).toHaveTextContent(strings.zeroResultSubstituteNotice);
  });

  it('LoadingState is an accessible, polite live region with the loading label', () => {
    render(<LoadingState />);

    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveTextContent(strings.loadingLabel);
  });

  it('OfflineState explains the prototype needs no network, without a stack/provider detail', () => {
    render(<OfflineState />);

    expect(screen.getByText(strings.offlineTitle)).toBeInTheDocument();
    expect(screen.getByText(strings.offlineBody)).toBeInTheDocument();
  });

  it('ErrorState is a safe generic alert with plain-language copy, no stack/provider detail', () => {
    render(<ErrorState />);

    const region = screen.getByRole('alert');
    expect(region).toHaveTextContent(strings.errorTitle);
    expect(region).toHaveTextContent(strings.errorBody);
    const text = region.textContent?.toLowerCase() ?? '';
    expect(text).not.toMatch(/stack|trace|exception|typeerror|at \w+\.\w+/);
  });
});
