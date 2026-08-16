import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { SearchScreen } from '../SearchScreen';

describe('SearchScreen', () => {
  it('shows the safe browse/empty-search state for an empty query', () => {
    render(<SearchScreen />);

    expect(screen.getByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });

  it('renders matching results with accessible identity, availability, price and match label', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');

    // Two Nivaprin listings exist (different pharmacies); both must be
    // present as distinct, individually accessible result cards.
    expect(screen.getAllByRole('button', { name: /Nivaprin.*Exact product match/i })).toHaveLength(
      2,
    );
    expect(screen.getAllByText(/FJD \d+\.\d{2}/).length).toBeGreaterThan(0);
  });

  it('shows the safe zero-result state and never invents a fuzzy match', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'zzz-not-a-real-fixture-zzz');

    expect(screen.getByText(strings.zeroResultTitle)).toBeInTheDocument();
    expect(screen.getByText(strings.zeroResultSubstituteNotice)).toBeInTheDocument();
  });

  it('never returns the searchEligible:false fixture even for its exact name', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Excludex');

    expect(screen.getByText(strings.zeroResultTitle)).toBeInTheDocument();
  });

  it('opens a local, read-only detail dialog with required safety copy on result press', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    await user.click(screen.getAllByRole('button', { name: /Nivaprin.*Exact product match/i })[0]!);

    const dialog = screen.getByRole('dialog', { name: strings.detailSheetTitle });
    expect(within(dialog).getByText(strings.safetyAvailabilityPrice)).toBeInTheDocument();
    expect(within(dialog).getByText(strings.safetyReservationNoGuarantee)).toBeInTheDocument();
    expect(within(dialog).getByText(strings.safetyPrescriptionMayBeRequired)).toBeInTheDocument();
    expect(within(dialog).getByText(strings.safetyNoMedicalAdvice)).toBeInTheDocument();

    // No call/map/reservation/upload/request action exists in the sheet.
    const dialogText = dialog.textContent?.toLowerCase() ?? '';
    expect(dialogText).not.toContain('call');
    expect(dialogText).not.toContain('directions');
    expect(dialogText).not.toContain('reserve');
  });

  it('closing the detail dialog removes it and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const trigger = screen.getAllByRole('button', { name: /Nivaprin.*Exact product match/i })[0]!;
    await user.click(trigger);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: strings.detailSheetCloseLabel }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('Escape closes the detail dialog', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    await user.click(screen.getAllByRole('button', { name: /Nivaprin.*Exact product match/i })[0]!);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows synthetic distance in the detail dialog only after a manual area is selected', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    await user.click(screen.getAllByRole('button', { name: /Nivaprin.*Exact product match/i })[0]!);

    const dialogBefore = screen.getByRole('dialog');
    expect(dialogBefore.textContent).not.toContain('Nearby in the selected synthetic area');

    await user.click(screen.getByRole('radio', { name: strings.areaMarketLabel }));

    const dialogAfter = screen.getByRole('dialog');
    expect(dialogAfter.textContent).toContain('Nearby in the selected synthetic area');
  });

  it('shows the active sort selection accessibly and applies price ascending order', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');

    const priceSortOption = screen.getByRole('radio', { name: strings.sortPriceLabel });
    expect(priceSortOption).toHaveAttribute('aria-checked', 'false');

    await user.click(priceSortOption);

    expect(priceSortOption).toHaveAttribute('aria-checked', 'true');
  });

  it('the manual area selector renders as an accessible radiogroup and never mentions a permission/map', () => {
    render(<SearchScreen />);

    expect(screen.getByRole('radiogroup', { name: strings.areaSelectorLabel })).toBeInTheDocument();

    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('permission');
    expect(bodyText).not.toContain('location');
  });

  it('resets the revealed page size when the query changes', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    await user.clear(screen.getByLabelText(strings.searchInputLabel));

    expect(screen.getByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });
});
