import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { SyntheticSearchListing } from '@medifind/contracts';

import { strings } from '../../content/strings';
import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import { ReservationRequestPanel } from '../ReservationRequestPanel';

const LISTING: SyntheticSearchListing = {
  id: 'farovex-suva-central',
  medicineDisplayName: 'Farovex',
  brandName: 'Farovex Comfort',
  activeIngredientDisplayName: 'Delunorphine',
  strength: '250 mg',
  dosageForm: 'Tablet',
  packDescription: 'Pack of 12',
  aliases: [],
  pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
  syntheticArea: 'harbour',
  syntheticDistanceLabel: '0.6 km',
  syntheticDistanceRank: 1,
  availability: 'in_stock',
  priceFjdMinor: 675,
  freshness: 'current',
  lastUpdatedDisplay: 'Today',
  searchEligible: true,
};

describe('ReservationRequestPanel', () => {
  it('shows a plain notice instead of the form for an unavailable listing', () => {
    render(
      <ReservationRequestPanel
        listing={{ ...LISTING, availability: 'unavailable' }}
        buyerKey="+679 000 0000"
        reservations={[]}
        onRequestReservation={() => {}}
      />,
    );

    expect(screen.getByText(strings.reservationUnavailableNotice)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.reservationSubmitLabel }),
    ).not.toBeInTheDocument();
  });

  it('prompts to sign in instead of showing the form when signed out', () => {
    render(
      <ReservationRequestPanel
        listing={LISTING}
        buyerKey={null}
        reservations={[]}
        onRequestReservation={() => {}}
      />,
    );

    expect(screen.getByText(strings.reservationSignInPrompt)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.reservationSubmitLabel }),
    ).not.toBeInTheDocument();
  });

  it('requires a patient name before submitting', async () => {
    const user = userEvent.setup();
    const onRequestReservation = vi.fn();
    render(
      <ReservationRequestPanel
        listing={LISTING}
        buyerKey="+679 000 0000"
        reservations={[]}
        onRequestReservation={onRequestReservation}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.reservationSubmitLabel }));

    expect(screen.getByText(strings.reservationPatientNameError)).toBeInTheDocument();
    expect(onRequestReservation).not.toHaveBeenCalled();
  });

  it('submits a valid request for self by default and shows the success notice', async () => {
    const user = userEvent.setup();
    const onRequestReservation = vi.fn();
    render(
      <ReservationRequestPanel
        listing={LISTING}
        buyerKey="+679 000 0000"
        reservations={[]}
        onRequestReservation={onRequestReservation}
      />,
    );

    await user.type(screen.getByLabelText(strings.reservationPatientNameLabel), 'Litia Waqa');
    await user.click(screen.getByRole('button', { name: strings.reservationSubmitLabel }));

    expect(onRequestReservation).toHaveBeenCalledWith({
      listingId: LISTING.id,
      branchId: 'suva-central',
      medicineDisplayName: LISTING.medicineDisplayName,
      pharmacyDisplayName: LISTING.pharmacyDisplayName,
      requestedPriceFjdMinor: LISTING.priceFjdMinor,
      patientName: 'Litia Waqa',
      relationship: 'self',
    });
    expect(screen.getByText(strings.reservationSuccessNotice)).toBeInTheDocument();
  });

  it('resolves branchId to null for a buyer-search pharmacy with no matching pharmacy-side branch', async () => {
    const user = userEvent.setup();
    const onRequestReservation = vi.fn();
    render(
      <ReservationRequestPanel
        listing={{ ...LISTING, pharmacyDisplayName: 'Solandra Pharmacy (synthetic)' }}
        buyerKey="+679 000 0000"
        reservations={[]}
        onRequestReservation={onRequestReservation}
      />,
    );

    await user.type(screen.getByLabelText(strings.reservationPatientNameLabel), 'Litia Waqa');
    await user.click(screen.getByRole('button', { name: strings.reservationSubmitLabel }));

    expect(onRequestReservation).toHaveBeenCalledWith(expect.objectContaining({ branchId: null }));
  });

  it('blocks submission and shows a conflict notice for an existing active reservation, same medicine/person', async () => {
    const user = userEvent.setup();
    const onRequestReservation = vi.fn();
    const existing: SyntheticReservation = {
      id: 'r1',
      listingId: LISTING.id,
      branchId: null,
      medicineDisplayName: LISTING.medicineDisplayName,
      pharmacyDisplayName: LISTING.pharmacyDisplayName,
      requestedPriceFjdMinor: LISTING.priceFjdMinor,
      patientName: 'Litia Waqa',
      relationship: 'self',
      buyerKey: '+679 000 0000',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      confirmedPriceFjdMinor: null,
      pickupInstructions: null,
      expiresAt: null,
      declineReason: null,
      cancelReason: null,
      cancelledBy: null,
      buyerConfirmedCollectedAt: null,
    };

    render(
      <ReservationRequestPanel
        listing={LISTING}
        buyerKey="+679 000 0000"
        reservations={[existing]}
        onRequestReservation={onRequestReservation}
      />,
    );

    await user.type(screen.getByLabelText(strings.reservationPatientNameLabel), 'Litia Waqa');
    await user.click(screen.getByRole('button', { name: strings.reservationSubmitLabel }));

    expect(screen.getByText(strings.reservationConflictNotice)).toBeInTheDocument();
    expect(onRequestReservation).not.toHaveBeenCalled();
  });

  it('shows the suspended notice instead of the form after three recent no-shows', () => {
    const expired = (i: number): SyntheticReservation => ({
      id: `ns-${i}`,
      listingId: 'other-listing',
      branchId: null,
      medicineDisplayName: 'Other',
      pharmacyDisplayName: 'Other Pharmacy',
      requestedPriceFjdMinor: 100,
      patientName: 'Someone',
      relationship: 'self',
      buyerKey: '+679 000 0000',
      status: 'expired',
      requestedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      confirmedPriceFjdMinor: 100,
      pickupInstructions: 'x',
      expiresAt: new Date().toISOString(),
      declineReason: null,
      cancelReason: null,
      cancelledBy: null,
      buyerConfirmedCollectedAt: null,
    });

    render(
      <ReservationRequestPanel
        listing={LISTING}
        buyerKey="+679 000 0000"
        reservations={[expired(1), expired(2), expired(3)]}
        onRequestReservation={() => {}}
      />,
    );

    expect(screen.getByText(strings.reservationSuspendedNotice)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.reservationSubmitLabel }),
    ).not.toBeInTheDocument();
  });
});
