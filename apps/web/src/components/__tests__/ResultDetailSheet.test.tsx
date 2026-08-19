import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { SyntheticSearchListing } from '@medifind/contracts';

import { strings } from '../../content/strings';
import { ResultDetailSheet, type ResultDetailSheetProps } from '../ResultDetailSheet';

const readyListing: SyntheticSearchListing = {
  id: 'listing-alpha',
  medicineDisplayName: 'AlphaMed',
  brandName: 'AlphaMed Brand',
  activeIngredientDisplayName: 'Alphaline',
  strength: '10 mg',
  dosageForm: 'Tablet',
  packDescription: 'Pack of 10',
  aliases: [],
  pharmacyDisplayName: 'Alpha Pharmacy',
  syntheticArea: 'harbour',
  syntheticDistanceLabel: '1 synthetic km',
  syntheticDistanceRank: 1,
  availability: 'in_stock',
  priceFjdMinor: 500,
  freshness: 'current',
  lastUpdatedDisplay: 'Today',
  searchEligible: true,
};

function readyProps(onClose: () => void): ResultDetailSheetProps {
  return {
    status: 'ready',
    listing: readyListing,
    matchKind: 'exact_product',
    displayDistance: { label: '1 synthetic km', rank: 1 },
    showDistance: true,
    onClose,
  };
}

/**
 * Mirrors how SearchScreen uses ResultDetailSheet: a real trigger button
 * that owns focus before the dialog opens (so focus-restoration assertions
 * are meaningful), and a `variant` prop that swaps only the sheet's status.
 */
function Harness({ variant }: { variant: 'loading' | 'error' | 'ready' }) {
  const [open, setOpen] = React.useState(false);
  const onClose = React.useCallback(() => setOpen(false), []);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open detail
      </button>
      {open ? (
        variant === 'ready' ? (
          <ResultDetailSheet {...readyProps(onClose)} />
        ) : (
          <ResultDetailSheet status={variant} onClose={onClose} />
        )
      ) : null}
    </div>
  );
}

function TransitionHarness({ status }: { status: 'ready' | 'loading' | 'error' }) {
  return status === 'ready' ? (
    <ResultDetailSheet {...readyProps(() => {})} />
  ) : (
    <ResultDetailSheet status={status} onClose={() => {}} />
  );
}

describe('ResultDetailSheet — ready variant', () => {
  it('renders identity, price, pharmacy and the required safety copy', () => {
    render(<ResultDetailSheet {...readyProps(() => {})} />);

    const dialog = screen.getByRole('dialog', { name: strings.detailSheetTitle });
    expect(within(dialog).getByText('AlphaMed')).toBeInTheDocument();
    expect(within(dialog).getByText('FJD 5.00')).toBeInTheDocument();
    expect(within(dialog).getByText(/Alpha Pharmacy/)).toBeInTheDocument();
    expect(within(dialog).getByText(strings.matchExactLabel)).toBeInTheDocument();
    expect(within(dialog).getByText('1 synthetic km')).toBeInTheDocument();
    expect(within(dialog).getByText(strings.safetyAvailabilityPrice)).toBeInTheDocument();
    expect(within(dialog).getByText(strings.safetyReservationNoGuarantee)).toBeInTheDocument();
    expect(within(dialog).getByText(strings.safetyPrescriptionMayBeRequired)).toBeInTheDocument();
    expect(within(dialog).getByText(strings.safetyNoMedicalAdvice)).toBeInTheDocument();
  });

  it('omits the distance line when showDistance is false', () => {
    render(
      <ResultDetailSheet
        status="ready"
        listing={readyListing}
        matchKind="exact_product"
        displayDistance={{ label: '1 synthetic km', rank: 1 }}
        showDistance={false}
        onClose={() => {}}
      />,
    );

    expect(screen.queryByText('1 synthetic km')).not.toBeInTheDocument();
  });
});

describe('ResultDetailSheet — loading variant', () => {
  it('renders only the accessible loading state, an accessible close button, and no listing content', () => {
    render(<ResultDetailSheet status="loading" onClose={() => {}} />);

    const dialog = screen.getByRole('dialog', { name: strings.detailSheetTitle });
    const status = within(dialog).getByRole('status');
    expect(status).toHaveTextContent(strings.loadingLabel);
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(
      within(dialog).getByRole('button', { name: strings.detailSheetCloseLabel }),
    ).toBeInTheDocument();

    expect(within(dialog).queryByText('AlphaMed')).not.toBeInTheDocument();
    expect(within(dialog).queryByText(strings.safetyAvailabilityPrice)).not.toBeInTheDocument();
  });
});

describe('ResultDetailSheet — error variant', () => {
  it('renders only the generic error copy, an accessible close button, and no listing content', () => {
    render(<ResultDetailSheet status="error" onClose={() => {}} />);

    const dialog = screen.getByRole('dialog', { name: strings.detailSheetTitle });
    const alert = within(dialog).getByRole('alert');
    expect(alert).toHaveTextContent(strings.errorTitle);
    expect(alert).toHaveTextContent(strings.errorBody);
    expect(
      within(dialog).getByRole('button', { name: strings.detailSheetCloseLabel }),
    ).toBeInTheDocument();

    expect(within(dialog).queryByText('AlphaMed')).not.toBeInTheDocument();
    expect(within(dialog).queryByText(strings.safetyAvailabilityPrice)).not.toBeInTheDocument();
  });
});

describe('ResultDetailSheet — stale-content safety', () => {
  it('never renders a partial or stale listing when the status transitions away from ready', () => {
    const { rerender } = render(<TransitionHarness status="ready" />);
    expect(screen.getByText('AlphaMed')).toBeInTheDocument();

    rerender(<TransitionHarness status="loading" />);
    expect(screen.queryByText('AlphaMed')).not.toBeInTheDocument();
    expect(screen.getByText(strings.loadingLabel)).toBeInTheDocument();

    rerender(<TransitionHarness status="ready" />);
    expect(screen.getByText('AlphaMed')).toBeInTheDocument();

    rerender(<TransitionHarness status="error" />);
    expect(screen.queryByText('AlphaMed')).not.toBeInTheDocument();
    expect(screen.getByText(strings.errorTitle)).toBeInTheDocument();
  });
});

describe.each([
  ['loading', 'loading'],
  ['error', 'error'],
  ['ready', 'ready'],
] as const)('ResultDetailSheet — shared dialog contract (%s variant)', (_label, variant) => {
  it('moves focus to the close button on open and returns focus to the trigger on close', async () => {
    const user = userEvent.setup();
    render(<Harness variant={variant} />);

    const trigger = screen.getByRole('button', { name: 'Open detail' });
    await user.click(trigger);

    const dialog = screen.getByRole('dialog', { name: strings.detailSheetTitle });
    const closeButton = within(dialog).getByRole('button', { name: strings.detailSheetCloseLabel });
    expect(closeButton).toHaveFocus();

    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('Escape closes the dialog', async () => {
    const user = userEvent.setup();
    render(<Harness variant={variant} />);

    await user.click(screen.getByRole('button', { name: 'Open detail' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clicking the overlay backdrop dismisses the dialog, but clicking inside the panel does not', async () => {
    const user = userEvent.setup();
    render(<Harness variant={variant} />);

    await user.click(screen.getByRole('button', { name: 'Open detail' }));
    const dialog = screen.getByRole('dialog');

    await user.click(dialog);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(dialog.parentElement!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has the same dialog title and aria-modal contract', async () => {
    const user = userEvent.setup();
    render(<Harness variant={variant} />);

    await user.click(screen.getByRole('button', { name: 'Open detail' }));

    const dialog = screen.getByRole('dialog', { name: strings.detailSheetTitle });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
