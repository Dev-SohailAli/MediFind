import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import type { SyntheticPrescription } from '../../prescriptions/syntheticPrescriptions';
import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import { PharmacyRequestsPanel, type PharmacyRequestsPanelProps } from '../PharmacyRequestsPanel';

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

function prescription(overrides: Partial<SyntheticPrescription> = {}): SyntheticPrescription {
  return {
    id: 'p1',
    buyerKey: '+679 000 0000',
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
    ...overrides,
  };
}

function baseProps(
  overrides: Partial<PharmacyRequestsPanelProps> = {},
): PharmacyRequestsPanelProps {
  return {
    branchId: 'suva-central',
    reservations: [],
    dispatch: () => {},
    prescriptions: [],
    prescriptionsDispatch: () => {},
    ...overrides,
  };
}

describe('PharmacyRequestsPanel — reservations', () => {
  it('shows the empty state when this branch has no reservations or prescriptions', () => {
    render(<PharmacyRequestsPanel {...baseProps()} />);
    expect(screen.getByText(strings.pharmacyRequestsEmpty)).toBeInTheDocument();
  });

  it('only shows reservations for this branch', () => {
    render(
      <PharmacyRequestsPanel
        {...baseProps({
          reservations: [
            reservation(),
            reservation({ id: 'r2', branchId: 'harbourview', medicineDisplayName: 'OtherMed' }),
          ],
        })}
      />,
    );

    expect(screen.getByText('Farovex')).toBeInTheDocument();
    expect(screen.queryByText('OtherMed')).not.toBeInTheDocument();
  });

  it('approving a pending reservation dispatches approve with the entered price/pickup/expiry', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(<PharmacyRequestsPanel {...baseProps({ reservations: [reservation()], dispatch })} />);

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
    render(<PharmacyRequestsPanel {...baseProps({ reservations: [reservation()], dispatch })} />);

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
        {...baseProps({
          reservations: [reservation({ status: 'approved', confirmedPriceFjdMinor: 700 })],
          dispatch,
        })}
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

describe('PharmacyRequestsPanel — prescriptions', () => {
  it('only shows prescriptions for this branch', () => {
    render(
      <PharmacyRequestsPanel
        {...baseProps({
          prescriptions: [
            prescription(),
            prescription({ id: 'p2', branchId: 'harbourview', patientName: 'Other Patient' }),
          ],
        })}
      />,
    );

    expect(screen.getByText('Litia Waqa')).toBeInTheDocument();
    expect(screen.queryByText('Other Patient')).not.toBeInTheDocument();
  });

  it('hides file/decision content behind the confirm-identity gate until confirmed', async () => {
    const user = userEvent.setup();
    render(<PharmacyRequestsPanel {...baseProps({ prescriptions: [prescription()] })} />);

    expect(screen.getByText(strings.pharmacyPrescriptionsMfaGateBody)).toBeInTheDocument();
    expect(screen.queryByText(strings.pharmacyPrescriptionsFileNotice)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.pharmacyPrescriptionsApproveLabel }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: strings.pharmacyPrescriptionsMfaGateConfirmLabel }),
    );

    expect(screen.getByText(strings.pharmacyPrescriptionsFileNotice)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: strings.pharmacyPrescriptionsApproveLabel }),
    ).toBeInTheDocument();
  });

  it('shows the quarantine banner only for a flagged prescription, after the gate is confirmed', async () => {
    const user = userEvent.setup();
    render(
      <PharmacyRequestsPanel
        {...baseProps({ prescriptions: [prescription({ quarantined: true })] })}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: strings.pharmacyPrescriptionsMfaGateConfirmLabel }),
    );

    expect(screen.getByText(strings.pharmacyPrescriptionsQuarantineBanner)).toBeInTheDocument();
  });

  it('approve dispatches an approve action for the prescription', async () => {
    const user = userEvent.setup();
    const prescriptionsDispatch = vi.fn();
    render(
      <PharmacyRequestsPanel
        {...baseProps({ prescriptions: [prescription()], prescriptionsDispatch })}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: strings.pharmacyPrescriptionsMfaGateConfirmLabel }),
    );
    await user.click(
      screen.getByRole('button', { name: strings.pharmacyPrescriptionsApproveLabel }),
    );

    expect(prescriptionsDispatch).toHaveBeenCalledWith({ type: 'approve', prescriptionId: 'p1' });
  });

  it('reject dispatches with the selected reason category', async () => {
    const user = userEvent.setup();
    const prescriptionsDispatch = vi.fn();
    render(
      <PharmacyRequestsPanel
        {...baseProps({ prescriptions: [prescription()], prescriptionsDispatch })}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: strings.pharmacyPrescriptionsMfaGateConfirmLabel }),
    );
    await user.selectOptions(
      screen.getByLabelText(strings.pharmacyPrescriptionsRejectReasonLabel),
      strings.prescriptionRejectReasonIncompleteLabel,
    );
    await user.click(
      screen.getByRole('button', { name: strings.pharmacyPrescriptionsRejectLabel }),
    );

    expect(prescriptionsDispatch).toHaveBeenCalledWith({
      type: 'reject',
      prescriptionId: 'p1',
      reason: 'incomplete_information',
    });
  });

  it('a decided prescription (not under_review) never shows the confirm-identity gate', () => {
    render(
      <PharmacyRequestsPanel
        {...baseProps({ prescriptions: [prescription({ status: 'approved' })] })}
      />,
    );

    expect(
      screen.queryByRole('button', { name: strings.pharmacyPrescriptionsMfaGateConfirmLabel }),
    ).not.toBeInTheDocument();
  });
});
