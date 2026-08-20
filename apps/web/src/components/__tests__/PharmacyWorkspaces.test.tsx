import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import { PharmacyWorkspaces } from '../PharmacyWorkspaces';

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

describe('PharmacyWorkspaces', () => {
  it('lists every branch the demo identity holds a role at, with a verification-status badge', () => {
    render(<PharmacyWorkspaces />);

    expect(screen.getByText('Suva Central Pharmacy (synthetic)')).toBeInTheDocument();
    expect(screen.getByText('Harbourview Pharmacy (synthetic)')).toBeInTheDocument();
    expect(screen.getByText('Gardenview Apothecary (synthetic)')).toBeInTheDocument();
    expect(screen.queryByText('Market Square Pharmacy (synthetic)')).not.toBeInTheDocument();

    expect(screen.getAllByText(strings.workspaceStatusLiveLabel)).toHaveLength(2);
    expect(screen.getByText(strings.workspaceStatusNeedsMoreInformationLabel)).toBeInTheDocument();
  });

  it('shows the full access matrix for a live branch where the identity is owner and reviewer', () => {
    render(<PharmacyWorkspaces />);

    const suvaCentralHeading = screen.getByText('Suva Central Pharmacy (synthetic)');
    const card = suvaCentralHeading.closest('li');
    expect(card).not.toBeNull();

    expect(card).toHaveTextContent(`${strings.workspaceDashboardAccessLabel}: ✓`);
    expect(card).toHaveTextContent(`${strings.workspaceInventoryAccessLabel}: ✓`);
    expect(card).toHaveTextContent(strings.workspaceRequestsAccessGatedNote);
  });

  it('denies Requests access for an owner-only branch with no reviewer role assigned (ADR-202)', () => {
    render(<PharmacyWorkspaces />);

    const harbourviewHeading = screen.getByText('Harbourview Pharmacy (synthetic)');
    const card = harbourviewHeading.closest('li');
    expect(card).not.toBeNull();

    expect(card).toHaveTextContent(`${strings.workspaceDashboardAccessLabel}: ✓`);
    expect(card).toHaveTextContent(strings.workspaceRequestsAccessDeniedNote);
    expect(card).not.toHaveTextContent(strings.workspaceRequestsAccessGatedNote);
  });

  it('shows only the verification notice for a not-yet-live branch, no Dashboard/Inventory/Requests access rows', () => {
    render(<PharmacyWorkspaces />);

    const gardenviewHeading = screen.getByText('Gardenview Apothecary (synthetic)');
    const card = gardenviewHeading.closest('li');
    expect(card).not.toBeNull();

    expect(card).toHaveTextContent(strings.workspaceNotYetLiveNotice);
    expect(card).not.toHaveTextContent(strings.workspaceDashboardAccessLabel);
  });

  it('looking up an assigned branch by ID shows its workspace card', async () => {
    const user = userEvent.setup();
    render(<PharmacyWorkspaces />);

    await user.type(screen.getByLabelText(strings.workspaceLookupLabel), 'suva-central');
    await user.click(screen.getByRole('button', { name: strings.workspaceLookupOpenLabel }));

    expect(screen.getAllByText('Suva Central Pharmacy (synthetic)')).toHaveLength(2);
  });

  it('looking up a branch that exists but has no role assignment returns the generic not-permitted message', async () => {
    const user = userEvent.setup();
    render(<PharmacyWorkspaces />);

    await user.type(screen.getByLabelText(strings.workspaceLookupLabel), 'market-square');
    await user.click(screen.getByRole('button', { name: strings.workspaceLookupOpenLabel }));

    expect(screen.getByRole('alert')).toHaveTextContent(strings.workspaceLookupNotPermitted);
    expect(screen.queryByText('Market Square Pharmacy (synthetic)')).not.toBeInTheDocument();
  });

  it('looking up a branch ID that does not exist returns the identical not-permitted message (anti-enumeration)', async () => {
    const user = userEvent.setup();
    render(<PharmacyWorkspaces />);

    await user.type(screen.getByLabelText(strings.workspaceLookupLabel), 'does-not-exist-at-all');
    await user.click(screen.getByRole('button', { name: strings.workspaceLookupOpenLabel }));

    expect(screen.getByRole('alert')).toHaveTextContent(strings.workspaceLookupNotPermitted);
  });

  it('a live branch with a reviewer role can open its reservation queue and approve a pending request', async () => {
    const user = userEvent.setup();
    render(<PharmacyWorkspaces reservations={[reservation()]} reservationsDispatch={() => {}} />);

    const suvaCentralHeading = screen.getByText('Suva Central Pharmacy (synthetic)');
    const card = suvaCentralHeading.closest('li');
    expect(card).not.toBeNull();

    await user.click(screen.getByRole('button', { name: strings.pharmacyRequestsOpenLabel }));
    expect(card).toHaveTextContent('Farovex');
    expect(
      screen.getByRole('button', { name: strings.pharmacyRequestsApproveLabel }),
    ).toBeInTheDocument();
  });

  it('a live branch without a reviewer role never offers the reservation queue at all (ADR-202)', () => {
    render(
      <PharmacyWorkspaces
        reservations={[reservation({ branchId: 'harbourview' })]}
        reservationsDispatch={() => {}}
      />,
    );

    const harbourviewHeading = screen.getByText('Harbourview Pharmacy (synthetic)');
    const card = harbourviewHeading.closest('li');
    expect(card).not.toBeNull();

    expect(
      within(card!).queryByRole('button', { name: strings.pharmacyRequestsOpenLabel }),
    ).not.toBeInTheDocument();
  });
});
