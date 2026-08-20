import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import { createInitialNotificationReadState } from '../../notifications/syntheticNotifications';
import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import { RequestsScreen, type RequestsScreenProps } from '../RequestsScreen';

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

function baseProps(overrides: Partial<RequestsScreenProps> = {}): RequestsScreenProps {
  return {
    buyerKey: BUYER,
    reservations: [],
    dispatch: () => {},
    prescriptions: [],
    prescriptionsDispatch: () => {},
    onNavigateToAccount: () => {},
    notificationReadState: createInitialNotificationReadState(),
    notificationReadDispatch: () => {},
    notificationOptInStatus: 'not_asked',
    notificationOptInDispatch: () => {},
    ...overrides,
  };
}

describe('RequestsScreen — signed out', () => {
  it('offers sign-in and no request content', () => {
    const onNavigateToAccount = vi.fn();
    render(
      <RequestsScreen
        {...baseProps({ buyerKey: null, reservations: [reservation()], onNavigateToAccount })}
      />,
    );

    expect(screen.getByText(strings.requestsSignInRequiredTitle)).toBeInTheDocument();
    expect(screen.queryByText('Farovex')).not.toBeInTheDocument();
  });

  it('the sign-in prompt action calls onNavigateToAccount', async () => {
    const user = userEvent.setup();
    const onNavigateToAccount = vi.fn();
    render(<RequestsScreen {...baseProps({ buyerKey: null, onNavigateToAccount })} />);

    await user.click(screen.getByRole('button', { name: strings.requestsSignInRequiredAction }));
    expect(onNavigateToAccount).toHaveBeenCalledTimes(1);
  });
});

describe('RequestsScreen — signed in', () => {
  it('shows the empty state when the buyer has no reservations', () => {
    render(<RequestsScreen {...baseProps()} />);

    expect(screen.getByText(strings.requestsEmptyTitle)).toBeInTheDocument();
  });

  it("only shows this buyer's own reservations", () => {
    render(
      <RequestsScreen
        {...baseProps({
          reservations: [
            reservation(),
            reservation({ id: 'r2', buyerKey: '+679 111 1111', medicineDisplayName: 'OtherMed' }),
          ],
        })}
      />,
    );

    expect(screen.getByText('Farovex')).toBeInTheDocument();
    expect(screen.queryByText('OtherMed')).not.toBeInTheDocument();
  });

  it('a pending reservation offers Cancel, which dispatches a buyer cancel', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(<RequestsScreen {...baseProps({ reservations: [reservation()], dispatch })} />);

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
        {...baseProps({
          reservations: [
            reservation({
              status: 'approved',
              confirmedPriceFjdMinor: 700,
              pickupInstructions: 'Front counter',
              expiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
            }),
          ],
          dispatch,
        })}
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
        {...baseProps({
          reservations: [reservation({ status: 'declined', declineReason: 'Out of stock' })],
        })}
      />,
    );

    expect(screen.getByText(/Out of stock/)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.requestsCancelLabel }),
    ).not.toBeInTheDocument();
  });

  it('the "Check for updates" action is always available and only expires reservations that are actually overdue', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    const notificationReadDispatch = vi.fn();
    render(
      <RequestsScreen
        {...baseProps({
          reservations: [
            reservation({
              id: 'not-overdue',
              status: 'approved',
              confirmedPriceFjdMinor: 700,
              pickupInstructions: 'Front counter',
              expiresAt: new Date(Date.now() + 60 * 60_000).toISOString(),
            }),
            reservation({
              id: 'overdue',
              status: 'approved',
              confirmedPriceFjdMinor: 700,
              pickupInstructions: 'Front counter',
              expiresAt: new Date(Date.now() - 60_000).toISOString(),
            }),
          ],
          dispatch,
          notificationReadDispatch,
        })}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.requestsRefreshLabel }));

    expect(dispatch).toHaveBeenCalledWith({ type: 'expire', reservationId: 'overdue' });
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'expire', reservationId: 'not-overdue' }),
    );
  });

  it("renders the NotificationCenter with notifications derived from this buyer's reservations", () => {
    render(
      <RequestsScreen {...baseProps({ reservations: [reservation({ status: 'approved' })] })} />,
    );

    expect(screen.getByText(strings.notificationsGenericEntryTitle)).toBeInTheDocument();
  });

  it("renders this buyer's own prescriptions with status and offers Cancel while under_review", async () => {
    const user = userEvent.setup();
    const prescriptionsDispatch = vi.fn();
    render(
      <RequestsScreen
        {...baseProps({
          prescriptions: [
            {
              id: 'p1',
              buyerKey: BUYER,
              branchId: 'suva-central',
              pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
              patientName: 'Litia Waqa',
              relationship: 'self',
              status: 'under_review',
              quarantined: false,
              submittedAt: '2026-08-20T00:00:00.000Z',
              lastUpdatedAt: '2026-08-20T00:00:00.000Z',
              expiresAt: '2026-08-22T00:00:00.000Z',
              rejectReason: null,
            },
          ],
          prescriptionsDispatch,
        })}
      />,
    );

    expect(screen.getByText(strings.prescriptionStatusUnderReviewLabel)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: strings.prescriptionCancelLabel }));
    expect(prescriptionsDispatch).toHaveBeenCalledWith({ type: 'cancel', prescriptionId: 'p1' });
  });

  it('derives a generic notification from a prescription status change, alongside reservation notifications', () => {
    render(
      <RequestsScreen
        {...baseProps({
          prescriptions: [
            {
              id: 'p1',
              buyerKey: BUYER,
              branchId: 'suva-central',
              pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
              patientName: 'Litia Waqa',
              relationship: 'self',
              status: 'approved',
              quarantined: false,
              submittedAt: '2026-08-20T00:00:00.000Z',
              lastUpdatedAt: '2026-08-20T00:00:00.000Z',
              expiresAt: '2026-08-22T00:00:00.000Z',
              rejectReason: null,
            },
          ],
        })}
      />,
    );

    expect(screen.getByText(strings.notificationsGenericEntryTitle)).toBeInTheDocument();
  });

  it('always shows the prescription upload entry point for a signed-in buyer', () => {
    render(<RequestsScreen {...baseProps()} />);
    expect(screen.getByText(strings.prescriptionUploadTitle)).toBeInTheDocument();
  });
});
