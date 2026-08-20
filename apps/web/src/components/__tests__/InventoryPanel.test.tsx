import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import type { SyntheticListing } from '../../pharmacy/syntheticListings';
import { InventoryPanel } from '../InventoryPanel';
import { PharmacyWorkspaces } from '../PharmacyWorkspaces';

async function openSuvaCentralInventory(user: ReturnType<typeof userEvent.setup>) {
  render(<PharmacyWorkspaces />);
  const card = screen.getByText('Suva Central Pharmacy (synthetic)').closest('li')!;
  await user.click(within(card).getByRole('button', { name: strings.inventoryOpenLabel }));
}

async function addListing(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(strings.addListingIngredientLabel), 'Zephyramine');
  await user.type(screen.getByLabelText(strings.addListingDosageFormLabel), 'Capsule');
  await user.type(screen.getByLabelText(strings.addListingPackLabel), 'Pack of 10');
  await user.type(screen.getByLabelText(strings.addListingPriceLabel), '11.20');
  await user.click(screen.getByRole('button', { name: strings.addListingSubmitLabel }));
}

describe('InventoryPanel (via PharmacyWorkspaces)', () => {
  it('shows the empty state before any listing exists', async () => {
    const user = userEvent.setup();
    await openSuvaCentralInventory(user);

    expect(screen.getByText(strings.inventoryEmpty)).toBeInTheDocument();
  });

  it('rejects an incomplete listing with field errors and does not create it', async () => {
    const user = userEvent.setup();
    await openSuvaCentralInventory(user);

    await user.click(screen.getByRole('button', { name: strings.addListingSubmitLabel }));

    expect(screen.getByText(strings.addListingIdentityError)).toBeInTheDocument();
    expect(screen.getByText(strings.addListingDosageFormError)).toBeInTheDocument();
    expect(screen.getByText(strings.addListingPackError)).toBeInTheDocument();
    expect(screen.getByText(strings.addListingPriceError)).toBeInTheDocument();
    expect(screen.queryByText(strings.listingLifecycleReviewLabel)).not.toBeInTheDocument();
  });

  it('creates a valid listing pending identity review, never immediately published', async () => {
    const user = userEvent.setup();
    await openSuvaCentralInventory(user);

    await addListing(user);

    expect(screen.getByText(strings.listingLifecycleReviewLabel)).toBeInTheDocument();
    expect(screen.getByText(/FJD 11\.20/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: strings.listingApproveIdentityLabel }),
    ).toBeInTheDocument();
  });

  it('warns (without blocking) when a new listing duplicates an existing identity/form/strength/pack', async () => {
    const user = userEvent.setup();
    await openSuvaCentralInventory(user);

    await addListing(user);
    await addListing(user);

    expect(screen.getByText(strings.addListingDuplicateWarning)).toBeInTheDocument();
    expect(screen.getAllByText(strings.listingLifecycleReviewLabel)).toHaveLength(2);
  });

  it('simulating identity approval moves a listing from review to published, enabling unpublish', async () => {
    const user = userEvent.setup();
    await openSuvaCentralInventory(user);
    await addListing(user);

    await user.click(screen.getByRole('button', { name: strings.listingApproveIdentityLabel }));

    expect(screen.getByText(strings.listingLifecyclePublishedLabel)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: strings.listingUnpublishLabel })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.listingApproveIdentityLabel }),
    ).not.toBeInTheDocument();
  });

  it('unpublish then publish round-trips the lifecycle state', async () => {
    const user = userEvent.setup();
    await openSuvaCentralInventory(user);
    await addListing(user);
    await user.click(screen.getByRole('button', { name: strings.listingApproveIdentityLabel }));

    await user.click(screen.getByRole('button', { name: strings.listingUnpublishLabel }));
    expect(screen.getByText(strings.listingLifecycleUnpublishedLabel)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: strings.listingPublishLabel }));
    expect(screen.getByText(strings.listingLifecyclePublishedLabel)).toBeInTheDocument();
  });

  it('a quick price/availability update refreshes the displayed price without changing lifecycle state', async () => {
    const user = userEvent.setup();
    await openSuvaCentralInventory(user);
    await addListing(user);

    const priceInput = screen.getByDisplayValue('11.2');
    await user.clear(priceInput);
    await user.type(priceInput, '9.50');
    await user.click(screen.getByRole('button', { name: strings.listingUpdatePricingSaveLabel }));

    expect(screen.getByText(/FJD 9\.50/)).toBeInTheDocument();
    expect(screen.getByText(strings.listingLifecycleReviewLabel)).toBeInTheDocument();
  });

  it('flags a listing as stale once its lastUpdatedAt is more than 24 hours old, and not otherwise', () => {
    // Rendered directly with a pre-seeded listing rather than driven
    // through the add-listing form + real time passing, since staleness
    // is computed at render time from `lastUpdatedAt` (see the exhaustive
    // isListingStale unit tests in syntheticListings.test.ts) — this keeps
    // the assertion deterministic without needing fake timers.
    const baseListing: SyntheticListing = {
      id: 'seed-1',
      branchId: 'suva-central',
      brandName: 'Calorex Relief',
      activeIngredientDisplayName: 'Zephyramine',
      dosageForm: 'Capsule',
      packDescription: 'Pack of 10',
      strength: '200 mg',
      category: 'otc',
      availability: 'in_stock',
      priceFjdMinor: 1120,
      note: null,
      lifecycleState: 'identity_review_required',
      lastUpdatedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    };

    const { rerender } = render(
      <InventoryPanel branchId="suva-central" listings={[baseListing]} dispatch={vi.fn()} />,
    );
    expect(screen.getByText(strings.listingStaleLabel)).toBeInTheDocument();

    const freshListing: SyntheticListing = {
      ...baseListing,
      lastUpdatedAt: new Date().toISOString(),
    };
    rerender(
      <InventoryPanel branchId="suva-central" listings={[freshListing]} dispatch={vi.fn()} />,
    );
    expect(screen.queryByText(strings.listingStaleLabel)).not.toBeInTheDocument();
  });
});
