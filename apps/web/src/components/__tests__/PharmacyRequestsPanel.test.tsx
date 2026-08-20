import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import { PharmacyRequestsPanel } from '../PharmacyRequestsPanel';

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
    buyerKey: '+679 000 0000',
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

describe('PharmacyRequestsPanel', () => {
  it('shows the empty state when this branch has no reservations', () => {
    render(<PharmacyRequestsPanel branchId="suva-central" reservations={[]} dispatch={() => {}} />);
    expect(screen.getByText(strings.pharmacyRequestsEmpty)).toBeInTheDocument();
  });

  it('only shows reservations for this branch', () => {
    render(
      <PharmacyRequestsPanel
        branchId="suva-central"
        reservations={[
          reservation(),
          reservation({ id: 'r2', branchId: 'harbourview', medicineDisplayName: 'OtherMed' }),
        ]}
        dispatch={() => {}}
      />,
    );

    expect(screen.getByText('Farovex')).toBeInTheDocument();
    expect(screen.queryByText('OtherMed')).not.toBeInTheDocument();
  });

  it('approving a pending reservation dispatches approve with the entered price/pickup/expiry', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <PharmacyRequestsPanel
        branchId="suva-central"
        reservations={[reservation()]}
        dispatch={dispatch}
      />,
    );

    await user.clear(screen.getByPlaceholderText(strings.pharmacyRequestsConfirmedPriceLabel));
    await user.type(
      screen.getByPlaceholderText(strings.pharmacyRequestsConfirmedPriceLabel),
      '7.00',
    );
    await user.type(
      screen.getByPlaceholderText(strings.pharmacyRequestsPickupInstructionsLabel),
      'Front counter',
    );
    await user.click(screen.getByRole('button', { name: strings.pharmacyRequestsApproveLabel }));

    expect(dispatch).toHaveBeenCalledTimes(1);
    const call = dispatch.mock.calls[0]![0];
    expect(call.type).toBe('approve');
    expect(call.reservationId).toBe('r1');
    expect(call.confirmedPriceFjdMinor).toBe(700);
    expect(call.pickupInstructions).toBe('Front counter');
    expect(typeof call.expiresAt).toBe('string');
  });

  it('declining a pending reservation dispatches decline with the optional reason', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <PharmacyRequestsPanel
        branchId="suva-central"
        reservations={[reservation()]}
        dispatch={dispatch}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(strings.pharmacyRequestsDeclineReasonLabel),
      'Out of stock',
    );
    await user.click(screen.getByRole('button', { name: strings.pharmacyRequestsDeclineLabel }));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'decline',
      reservationId: 'r1',
      reason: 'Out of stock',
    });
  });

  it('an approved reservation offers Mark collected and a reason-gated Cancel', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <PharmacyRequestsPanel
        branchId="suva-central"
        reservations={[reservation({ status: 'approved', confirmedPriceFjdMinor: 700 })]}
        dispatch={dispatch}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: strings.pharmacyRequestsMarkCollectedLabel }),
    );
    expect(dispatch).toHaveBeenCalledWith({ type: 'mark_collected', reservationId: 'r1' });

    // Cancel without a reason shows a validation error and does not dispatch.
    await user.click(screen.getByRole('button', { name: strings.pharmacyRequestsCancelLabel }));
    expect(screen.getByText(strings.pharmacyRequestsCancelReasonError)).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'cancel' }));

    await user.type(
      screen.getByPlaceholderText(strings.pharmacyRequestsCancelReasonLabel),
      'Supply no longer available',
    );
    await user.click(screen.getByRole('button', { name: strings.pharmacyRequestsCancelLabel }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'cancel',
      reservationId: 'r1',
      by: 'pharmacy',
      reason: 'Supply no longer available',
    });
  });
});
