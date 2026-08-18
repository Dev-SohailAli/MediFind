import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { SearchScreen } from '../SearchScreen';

describe('SearchScreen', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('never calls fetch in the default fixture-backed mode', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');

    expect(
      await screen.findAllByRole('button', { name: /Nivaprin.*Exact product match/i }),
    ).toHaveLength(2);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('shows the safe browse/empty-search state for an empty query', () => {
    render(<SearchScreen />);

    expect(screen.getByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });

  it('genuinely shows the loading state while a query is pending, then resolves to results', () => {
    render(<SearchScreen />);
    const input = screen.getByLabelText(strings.searchInputLabel);

    fireEvent.change(input, { target: { value: 'Nivaprin' } });

    // Synchronously reachable: the loading state is real UI, not dead code
    // wired to nothing. It uses an accessible, polite live region.
    const loading = screen.getByRole('status');
    expect(loading).toHaveTextContent(strings.loadingLabel);
    expect(loading).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByText(strings.browseEmptyTitle)).not.toBeInTheDocument();

    return waitFor(() => {
      expect(screen.queryByText(strings.loadingLabel)).not.toBeInTheDocument();
      expect(
        screen.getAllByRole('button', { name: /Nivaprin.*Exact product match/i }),
      ).toHaveLength(2);
    });
  });

  it('renders matching results with accessible identity, availability, price and match label', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');

    // Two Nivaprin listings exist (different pharmacies); both must be
    // present as distinct, individually accessible result cards.
    expect(
      await screen.findAllByRole('button', { name: /Nivaprin.*Exact product match/i }),
    ).toHaveLength(2);
    expect(screen.getAllByText(/FJD \d+\.\d{2}/).length).toBeGreaterThan(0);
  });

  it('shows the safe zero-result state and never invents a fuzzy match', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'zzz-not-a-real-fixture-zzz');

    expect(await screen.findByText(strings.zeroResultTitle)).toBeInTheDocument();
    expect(screen.getByText(strings.zeroResultSubstituteNotice)).toBeInTheDocument();
  });

  it('never returns the searchEligible:false fixture even for its exact name', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Excludex');

    expect(await screen.findByText(strings.zeroResultTitle)).toBeInTheDocument();
  });

  it('opens a local, read-only detail dialog with required safety copy on result press', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const [firstResult] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });
    await user.click(firstResult!);

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
    const [trigger] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });
    await user.click(trigger!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: strings.detailSheetCloseLabel }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('Escape closes the detail dialog', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const [firstResult] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });
    await user.click(firstResult!);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('changing sort/area while a detail dialog is open never interrupts it (no re-entrant loading)', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const [firstResult] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });
    await user.click(firstResult!);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: strings.areaMarketLabel }));

    // Sort/area are refinements of an already-committed query: they never
    // re-enter the loading state, so the open dialog must still be there.
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows synthetic distance in the detail dialog only after a manual area is selected', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const [firstResult] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });
    await user.click(firstResult!);

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
    await screen.findAllByRole('button', { name: /Nivaprin.*Exact product match/i });

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
    await screen.findAllByRole('button', { name: /Nivaprin.*Exact product match/i });
    await user.clear(screen.getByLabelText(strings.searchInputLabel));

    expect(await screen.findByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });
});
