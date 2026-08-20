import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import { RequestsScreen } from '../RequestsScreen';

const BUYER = '+679 000 0000';

function reservation(overrides: Partial<SyntheticReservation> = {}): SyntheticReservation {
  return {
    id: 'r1',
    listingId: 'listing-1',
    branchId: 'suva-central',
    medicineDisplayName: 'Farovex',
    pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
    requestedPriceFjdMinor: 675,
    patientName: 'Litia Waqa',
    relationship: 'self',
    buyerKey: BUYER,
    status: 'pending',
    requestedAt: '2026-08-20T00:00:00.000Z',
    lastUpdatedAt: '2026-08-20T00:00:00.000Z',
    confirmedPriceFjdMinor: null,
    pickupInstructions: null,
    expiresAt: null,
    declineReason: null,
    cancelReason: null,
    cancelledBy: null,
    buyerConfirmedCollectedAt: null,
    ...overrides,
  };
}

describe('RequestsScreen — signed out', () => {
  it('offers sign-in and no request content', () => {
    const onNavigateToAccount = vi.fn();
    render(
      <RequestsScreen
        buyerKey={null}
        reservations={[reservation()]}
        dispatch={() => {}}
        onNavigateToAccount={onNavigateToAccount}
      />,
    );

    expect(screen.getByText(strings.requestsSignInRequiredTitle)).toBeInTheDocument();
    expect(screen.queryByText('Farovex')).not.toBeInTheDocument();
  });

  it('the sign-in prompt action calls onNavigateToAccount', async () => {
    const user = userEvent.setup();
    const onNavigateToAccount = vi.fn();
    render(
      <RequestsScreen
        buyerKey={null}
        reservations={[]}
        dispatch={() => {}}
        onNavigateToAccount={onNavigateToAccount}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.requestsSignInRequiredAction }));
    expect(onNavigateToAccount).toHaveBeenCalledTimes(1);
  });
});

describe('RequestsScreen — signed in', () => {
  it('shows the empty state when the buyer has no reservations', () => {
    render(
      <RequestsScreen
        buyerKey={BUYER}
        reservations={[]}
        dispatch={() => {}}
        onNavigateToAccount={() => {}}
      />,
    );

    expect(screen.getByText(strings.requestsEmptyTitle)).toBeInTheDocument();
  });

  it("only shows this buyer's own reservations", () => {
    render(
      <RequestsScreen
        buyerKey={BUYER}
        reservations={[
          reservation(),
          reservation({ id: 'r2', buyerKey: '+679 111 1111', medicineDisplayName: 'OtherMed' }),
        ]}
        dispatch={() => {}}
        onNavigateToAccount={() => {}}
      />,
    );

    expect(screen.getByText('Farovex')).toBeInTheDocument();
    expect(screen.queryByText('OtherMed')).not.toBeInTheDocument();
  });

  it('a pending reservation offers Cancel, which dispatches a buyer cancel', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <RequestsScreen
        buyerKey={BUYER}
        reservations={[reservation()]}
        dispatch={dispatch}
        onNavigateToAccount={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.requestsCancelLabel }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'cancel',
      reservationId: 'r1',
      by: 'buyer',
      reason: null,
    });
  });

  it('an approved reservation shows confirmed price/pickup/expiry and offers Confirm collected / No longer needed', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <RequestsScreen
        buyerKey={BUYER}
        reservations={[
          reservation({
            status: 'approved',
            confirmedPriceFjdMinor: 700,
            pickupInstructions: 'Front counter',
            expiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
          }),
        ]}
        dispatch={dispatch}
        onNavigateToAccount={() => {}}
      />,
    );

    expect(screen.getByText(/FJD 7\.00/)).toBeInTheDocument();
    expect(screen.getByText(/Front counter/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: strings.requestsConfirmCollectedLabel }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'confirm_collected', reservationId: 'r1' });

    await user.click(screen.getByRole('button', { name: strings.requestsNoLongerNeededLabel }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'cancel',
      reservationId: 'r1',
      by: 'buyer',
      reason: null,
    });
  });

  it('a declined reservation shows the reason and no actions', () => {
    render(
      <RequestsScreen
        buyerKey={BUYER}
        reservations={[reservation({ status: 'declined', declineReason: 'Out of stock' })]}
        dispatch={() => {}}
        onNavigateToAccount={() => {}}
      />,
    );

    expect(screen.getByText(/Out of stock/)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.requestsCancelLabel }),
    ).not.toBeInTheDocument();
  });

  it('shows a "Check for updates" refresh action only when an approved reservation is overdue, and dispatches expire', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const { rerender } = render(
      <RequestsScreen
        buyerKey={BUYER}
        reservations={[
          reservation({
            status: 'approved',
            confirmedPriceFjdMinor: 700,
            pickupInstructions: 'Front counter',
            expiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
          }),
        ]}
        dispatch={dispatch}
        onNavigateToAccount={() => {}}
      />,
    );
    expect(
      screen.queryByRole('button', { name: strings.requestsRefreshLabel }),
    ).not.toBeInTheDocument();

    rerender(
      <RequestsScreen
        buyerKey={BUYER}
        reservations={[
          reservation({
            status: 'approved',
            confirmedPriceFjdMinor: 700,
            pickupInstructions: 'Front counter',
            expiresAt: new Date(Date.now() - 60_000).toISOString(),
          }),
        ]}
        dispatch={dispatch}
        onNavigateToAccount={() => {}}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.requestsRefreshLabel }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'expire', reservationId: 'r1' });
  });
});
