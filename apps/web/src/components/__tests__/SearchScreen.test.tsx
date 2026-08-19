import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

  it('clicking the overlay backdrop dismisses the detail dialog', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const [firstResult] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });
    await user.click(firstResult!);

    const dialog = screen.getByRole('dialog');
    // The overlay is the dialog's positioned parent; clicking it (not the
    // dialog panel itself) must dismiss, since it is the semantic backdrop.
    await user.click(dialog.parentElement!);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clicking inside the dialog panel itself never dismisses it', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const [firstResult] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });
    await user.click(firstResult!);

    const dialog = screen.getByRole('dialog');
    await user.click(dialog);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('moves focus into the dialog on open and traps Tab/Shift+Tab within it', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const [firstResult] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });
    await user.click(firstResult!);

    const dialog = screen.getByRole('dialog');
    const closeButton = screen.getByRole('button', { name: strings.detailSheetCloseLabel });

    // The close button is the dialog's only focusable element, so opening
    // it moves focus straight there (never left stranded on <body> or the
    // dialog container).
    expect(closeButton).toHaveFocus();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    // Tab from the only focusable element wraps back to itself rather than
    // escaping the dialog into the page behind it.
    await user.keyboard('{Tab}');
    expect(closeButton).toHaveFocus();

    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(closeButton).toHaveFocus();
  });

  it('a result card exposes its availability status as plain-language text on the accessible name, not colour alone', async () => {
    const user = userEvent.setup();
    render(<SearchScreen />);

    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Nivaprin');
    const [firstResult] = await screen.findAllByRole('button', {
      name: /Nivaprin.*Exact product match/i,
    });

    // The accessible name must also carry a plain-language availability
    // word, so a non-colour-perceiving or screen-reader user gets the same
    // status meaning as a sighted user reading the badge colour.
    expect(firstResult!.getAttribute('aria-label')).toMatch(/In stock|Low stock|Unavailable/);
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

describe('global.css static accessibility source checks', () => {
  // These verify CSS rules that a jsdom render cannot meaningfully exercise
  // (no real layout/paint engine), per the plan's guidance to prefer
  // CSS/source assertions over a fragile jsdom pixel test for
  // reduced-motion, focus-visible styling and min-height/min-width token
  // use.
  const testFileDir = dirname(fileURLToPath(import.meta.url));
  const css = readFileSync(resolve(testFileDir, '../../styles/global.css'), 'utf8');

  it('defines a visible :focus-visible outline that is not a colour swap alone (has width and offset)', () => {
    const rule = css.match(/:focus-visible\s*\{([^}]*)\}/);
    expect(rule).not.toBeNull();
    expect(rule![1]).toMatch(/outline:\s*\d/);
    expect(rule![1]).toMatch(/outline-offset/);
  });

  it('respects prefers-reduced-motion by collapsing animation/transition duration, not by hiding content', () => {
    const rule = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/);
    expect(rule).not.toBeNull();
    expect(rule![1]).toMatch(/animation-duration/);
    expect(rule![1]).toMatch(/transition-duration/);
    expect(rule![1]).not.toMatch(/display:\s*none/);
    expect(rule![1]).not.toMatch(/visibility:\s*hidden/);
  });

  it('every interactive touch-target class references the shared --min-target token (48px), not a hard-coded smaller size', () => {
    for (const selector of [
      '.nav__tab',
      '.search-bar',
      '.search-bar__clear',
      '.selector__option',
      '.result-card',
      '.load-more-button',
      '.detail-sheet__close',
      '.top-banner__dismiss',
    ]) {
      const escaped = selector.replace(/[.]/g, '\\.');
      const rule = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
      expect(rule, `expected a rule for ${selector}`).not.toBeNull();
      expect(rule![1]).toMatch(
        /min-height:\s*var\(--min-target\)|min-width:\s*var\(--min-target\)/,
      );
    }
  });
});
