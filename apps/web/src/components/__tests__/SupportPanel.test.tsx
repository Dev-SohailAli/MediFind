import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import type { SyntheticPrescription } from '../../prescriptions/syntheticPrescriptions';
import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import type { SyntheticSupportReport } from '../../support/syntheticSupport';
import { SupportPanel } from '../SupportPanel';

function report(overrides: Partial<SyntheticSupportReport> = {}): SyntheticSupportReport {
  return {
    id: 'rep1',
    category: 'listing_quality',
    reportedBy: '+679 000 0000',
    note: 'Price shown does not match.',
    targetListingId: 'listing-1',
    status: 'open',
    submittedAt: '2026-08-20T00:00:00.000Z',
    lastUpdatedAt: '2026-08-20T00:00:00.000Z',
    resolutionNote: null,
    ...overrides,
  };
}

describe('SupportPanel — reports', () => {
  it('shows the empty state when there are no reports', () => {
    render(<SupportPanel reports={[]} dispatch={() => {}} reservations={[]} prescriptions={[]} />);
    expect(screen.getByText(strings.supportReportsEmpty)).toBeInTheDocument();
  });

  it('resolve requires an outcome note before dispatching', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <SupportPanel
        reports={[report()]}
        dispatch={dispatch}
        reservations={[]}
        prescriptions={[]}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.supportResolveLabel }));
    expect(screen.getByText(strings.supportResolveNoteError)).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalled();

    await user.type(
      screen.getByPlaceholderText(strings.supportResolveNoteLabel),
      'Confirmed and corrected.',
    );
    await user.click(screen.getByRole('button', { name: strings.supportResolveLabel }));
    expect(dispatch).toHaveBeenCalledWith({
      type: 'resolve',
      reportId: 'rep1',
      resolutionNote: 'Confirmed and corrected.',
    });
  });

  it('escalate and defer dispatch directly', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(
      <SupportPanel
        reports={[report()]}
        dispatch={dispatch}
        reservations={[]}
        prescriptions={[]}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.supportEscalateLabel }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'escalate', reportId: 'rep1' });

    await user.click(screen.getByRole('button', { name: strings.supportDeferLabel }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'defer', reportId: 'rep1' });
  });

  it('a decided report has no decision controls', () => {
    render(
      <SupportPanel
        reports={[report({ status: 'resolved', resolutionNote: 'Done.' })]}
        dispatch={() => {}}
        reservations={[]}
        prescriptions={[]}
      />,
    );

    expect(
      screen.queryByRole('button', { name: strings.supportResolveLabel }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/Done\./)).toBeInTheDocument();
  });
});

describe('SupportPanel — audit view', () => {
  it('shows the empty state with no audit-worthy events', () => {
    render(<SupportPanel reports={[]} dispatch={() => {}} reservations={[]} prescriptions={[]} />);
    expect(screen.getByText(strings.auditViewEmpty)).toBeInTheDocument();
  });

  it('derives and displays a safe audit event from reservation/prescription state', () => {
    const reservation: SyntheticReservation = {
      id: 'r1',
      listingId: 'listing-1',
      branchId: 'suva-central',
      medicineDisplayName: 'Farovex',
      pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
      requestedPriceFjdMinor: 675,
      patientName: 'Litia Waqa',
      relationship: 'self',
      buyerKey: '+679 000 0000',
      status: 'approved',
      requestedAt: '2026-08-20T00:00:00.000Z',
      lastUpdatedAt: '2026-08-20T00:00:00.000Z',
      confirmedPriceFjdMinor: 700,
      pickupInstructions: 'Front counter',
      expiresAt: '2026-08-21T00:00:00.000Z',
      declineReason: null,
      cancelReason: null,
      cancelledBy: null,
      buyerConfirmedCollectedAt: null,
    };

    render(
      <SupportPanel
        reports={[]}
        dispatch={() => {}}
        reservations={[reservation]}
        prescriptions={[]}
      />,
    );

    expect(screen.getByText('Reservation approved')).toBeInTheDocument();
    expect(screen.queryByText('Litia Waqa')).not.toBeInTheDocument();
    expect(screen.queryByText('Farovex')).not.toBeInTheDocument();
  });

  it('never renders any prescription content in the audit view', () => {
    const prescription: SyntheticPrescription = {
      id: 'p1',
      buyerKey: '+679 000 0000',
      branchId: 'suva-central',
      pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
      patientName: 'Litia Waqa',
      relationship: 'self',
      status: 'rejected',
      quarantined: false,
      submittedAt: '2026-08-20T00:00:00.000Z',
      lastUpdatedAt: '2026-08-20T00:00:00.000Z',
      expiresAt: '2026-08-22T00:00:00.000Z',
      rejectReason: 'illegible',
    };

    render(
      <SupportPanel
        reports={[]}
        dispatch={() => {}}
        reservations={[]}
        prescriptions={[prescription]}
      />,
    );

    expect(screen.getByText(/Prescription rejected: illegible/)).toBeInTheDocument();
    expect(screen.queryByText('Litia Waqa')).not.toBeInTheDocument();
  });
});
