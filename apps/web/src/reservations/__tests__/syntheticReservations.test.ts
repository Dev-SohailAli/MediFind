import { describe, expect, it } from 'vitest';

import {
  countRecentNoShows,
  createInitialReservationsState,
  findActiveReservationConflict,
  isReservationOverdue,
  isReservationsSuspended,
  syntheticReservationsReducer,
  validateReservationRequest,
  type SyntheticReservation,
  type SyntheticReservationRequestInput,
  type SyntheticReservationsState,
} from '../syntheticReservations';

const NOW = new Date('2026-08-20T00:00:00.000Z');
const BUYER = '+679 000 0000';

const VALID_INPUT: SyntheticReservationRequestInput = {
  listingId: 'farovex-suva-central',
  branchId: 'suva-central',
  medicineDisplayName: 'Farovex',
  pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
  requestedPriceFjdMinor: 675,
  patientName: 'Litia Waqa',
  relationship: 'self',
};

function requestOne(
  state: SyntheticReservationsState = createInitialReservationsState(),
  input: SyntheticReservationRequestInput = VALID_INPUT,
  buyerKey = BUYER,
): SyntheticReservationsState {
  return syntheticReservationsReducer(state, { type: 'request', buyerKey, input }, NOW);
}

describe('validateReservationRequest', () => {
  it('accepts a non-empty patient name', () => {
    expect(validateReservationRequest({ patientName: 'Litia Waqa' })).toEqual([]);
  });

  it('requires a patient name', () => {
    expect(validateReservationRequest({ patientName: '  ' })).toEqual(['patientName']);
  });
});

describe('findActiveReservationConflict', () => {
  it('finds a pending reservation for the same buyer/listing/patient/relationship', () => {
    const state = requestOne();
    const conflict = findActiveReservationConflict(
      state.reservations,
      BUYER,
      VALID_INPUT.listingId,
      VALID_INPUT.patientName,
      VALID_INPUT.relationship,
    );
    expect(conflict?.id).toBe(state.reservations[0]!.id);
  });

  it('does not treat a different patient/relationship as a conflict', () => {
    const state = requestOne();
    const conflict = findActiveReservationConflict(
      state.reservations,
      BUYER,
      VALID_INPUT.listingId,
      'A Different Person',
      'child',
    );
    expect(conflict).toBeNull();
  });

  it('does not treat a different buyer as a conflict', () => {
    const state = requestOne();
    const conflict = findActiveReservationConflict(
      state.reservations,
      '+679 111 1111',
      VALID_INPUT.listingId,
      VALID_INPUT.patientName,
      VALID_INPUT.relationship,
    );
    expect(conflict).toBeNull();
  });

  it('does not treat a declined reservation as an active conflict', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const declined = syntheticReservationsReducer(
      created,
      { type: 'decline', reservationId: id, reason: 'Out of stock' },
      NOW,
    );
    const conflict = findActiveReservationConflict(
      declined.reservations,
      BUYER,
      VALID_INPUT.listingId,
      VALID_INPUT.patientName,
      VALID_INPUT.relationship,
    );
    expect(conflict).toBeNull();
  });
});

describe('syntheticReservationsReducer — request', () => {
  it('creates a pending reservation with no confirmed price/expiry yet', () => {
    const state = requestOne();

    expect(state.reservations).toHaveLength(1);
    expect(state.reservations[0]).toMatchObject({
      status: 'pending',
      buyerKey: BUYER,
      confirmedPriceFjdMinor: null,
      pickupInstructions: null,
      expiresAt: null,
      requestedAt: NOW.toISOString(),
    });
  });

  it('is a no-op when the buyer already has an active reservation for the same medicine/person (ADR-090)', () => {
    const first = requestOne();
    const second = requestOne(first);

    expect(second.reservations).toHaveLength(1);
  });

  it('allows a second reservation for a different identified person', () => {
    const first = requestOne();
    const second = requestOne(first, { ...VALID_INPUT, patientName: 'A Different Person' });

    expect(second.reservations).toHaveLength(2);
  });

  it('is a no-op with an empty patient name', () => {
    const state = requestOne(undefined, { ...VALID_INPUT, patientName: '   ' });
    expect(state.reservations).toHaveLength(0);
  });

  it('is a no-op once the buyer has three no-shows in the last 30 days (ADR-091)', () => {
    let state = createInitialReservationsState();
    for (let i = 0; i < 3; i += 1) {
      state = requestOne(state, { ...VALID_INPUT, patientName: `Person ${i}` });
      const id = state.reservations[i]!.id;
      state = syntheticReservationsReducer(
        state,
        {
          type: 'approve',
          reservationId: id,
          confirmedPriceFjdMinor: 675,
          pickupInstructions: 'Front counter',
          expiresAt: NOW.toISOString(),
        },
        NOW,
      );
      state = syntheticReservationsReducer(state, { type: 'expire', reservationId: id }, NOW);
    }
    expect(countRecentNoShows(state.reservations, BUYER, NOW)).toBe(3);

    const blocked = requestOne(state, { ...VALID_INPUT, patientName: 'One More Person' });
    expect(blocked.reservations).toHaveLength(3);
  });
});

describe('syntheticReservationsReducer — approve/decline', () => {
  it('approve sets confirmed price, pickup instructions and expiry, moving pending -> approved', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const expiresAt = new Date(NOW.getTime() + 24 * 60 * 60_000).toISOString();

    const result = syntheticReservationsReducer(
      created,
      {
        type: 'approve',
        reservationId: id,
        confirmedPriceFjdMinor: 700,
        pickupInstructions: 'Collect at the front counter with ID.',
        expiresAt,
      },
      NOW,
    );

    expect(result.reservations[0]).toMatchObject({
      status: 'approved',
      confirmedPriceFjdMinor: 700,
      pickupInstructions: 'Collect at the front counter with ID.',
      expiresAt,
    });
  });

  it('approve is a no-op on a reservation that is not pending', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const declined = syntheticReservationsReducer(
      created,
      { type: 'decline', reservationId: id, reason: null },
      NOW,
    );

    const result = syntheticReservationsReducer(
      declined,
      {
        type: 'approve',
        reservationId: id,
        confirmedPriceFjdMinor: 700,
        pickupInstructions: 'x',
        expiresAt: NOW.toISOString(),
      },
      NOW,
    );

    expect(result).toEqual(declined);
  });

  it('decline moves pending -> declined and is a no-op once already declined', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;

    const declined = syntheticReservationsReducer(
      created,
      { type: 'decline', reservationId: id, reason: 'Out of stock' },
      NOW,
    );
    expect(declined.reservations[0]).toMatchObject({
      status: 'declined',
      declineReason: 'Out of stock',
    });

    const again = syntheticReservationsReducer(
      declined,
      { type: 'decline', reservationId: id, reason: 'Different reason' },
      NOW,
    );
    expect(again).toEqual(declined);
  });
});

describe('syntheticReservationsReducer — cancel', () => {
  function approveOne(state: SyntheticReservationsState, id: string) {
    return syntheticReservationsReducer(
      state,
      {
        type: 'approve',
        reservationId: id,
        confirmedPriceFjdMinor: 700,
        pickupInstructions: 'Front counter',
        expiresAt: new Date(NOW.getTime() + 24 * 60 * 60_000).toISOString(),
      },
      NOW,
    );
  }

  it('buyer can cancel a pending reservation without a reason', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;

    const result = syntheticReservationsReducer(
      created,
      { type: 'cancel', reservationId: id, by: 'buyer', reason: null },
      NOW,
    );

    expect(result.reservations[0]).toMatchObject({
      status: 'cancelled',
      cancelledBy: 'buyer',
      cancelReason: null,
    });
  });

  it('buyer can cancel an approved reservation without a reason', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const approved = approveOne(created, id);

    const result = syntheticReservationsReducer(
      approved,
      { type: 'cancel', reservationId: id, by: 'buyer', reason: null },
      NOW,
    );

    expect(result.reservations[0]!.status).toBe('cancelled');
  });

  it('pharmacy cancelling an approved reservation requires a recorded reason (ADR-077)', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const approved = approveOne(created, id);

    const blocked = syntheticReservationsReducer(
      approved,
      { type: 'cancel', reservationId: id, by: 'pharmacy', reason: '   ' },
      NOW,
    );
    expect(blocked).toEqual(approved);

    const result = syntheticReservationsReducer(
      approved,
      { type: 'cancel', reservationId: id, by: 'pharmacy', reason: 'Supply no longer available' },
      NOW,
    );
    expect(result.reservations[0]).toMatchObject({
      status: 'cancelled',
      cancelledBy: 'pharmacy',
      cancelReason: 'Supply no longer available',
    });
  });

  it('is a no-op on an already-terminal reservation', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const declined = syntheticReservationsReducer(
      created,
      { type: 'decline', reservationId: id, reason: null },
      NOW,
    );

    const result = syntheticReservationsReducer(
      declined,
      { type: 'cancel', reservationId: id, by: 'buyer', reason: null },
      NOW,
    );
    expect(result).toEqual(declined);
  });
});

describe('syntheticReservationsReducer — expire', () => {
  it('moves an overdue approved reservation to expired', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const approved = syntheticReservationsReducer(
      created,
      {
        type: 'approve',
        reservationId: id,
        confirmedPriceFjdMinor: 700,
        pickupInstructions: 'Front counter',
        expiresAt: new Date(NOW.getTime() - 60_000).toISOString(),
      },
      NOW,
    );

    const result = syntheticReservationsReducer(
      approved,
      { type: 'expire', reservationId: id },
      NOW,
    );
    expect(result.reservations[0]!.status).toBe('expired');
  });

  it('is a no-op when the reservation is not yet overdue', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const approved = syntheticReservationsReducer(
      created,
      {
        type: 'approve',
        reservationId: id,
        confirmedPriceFjdMinor: 700,
        pickupInstructions: 'Front counter',
        expiresAt: new Date(NOW.getTime() + 60_000).toISOString(),
      },
      NOW,
    );

    const result = syntheticReservationsReducer(
      approved,
      { type: 'expire', reservationId: id },
      NOW,
    );
    expect(result).toEqual(approved);
  });

  it('is a no-op on a pending reservation (no auto-expiry before approval in this simulation)', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;

    const result = syntheticReservationsReducer(
      created,
      { type: 'expire', reservationId: id },
      NOW,
    );
    expect(result).toEqual(created);
  });
});

describe('syntheticReservationsReducer — collection', () => {
  function approveOne(state: SyntheticReservationsState, id: string) {
    return syntheticReservationsReducer(
      state,
      {
        type: 'approve',
        reservationId: id,
        confirmedPriceFjdMinor: 700,
        pickupInstructions: 'Front counter',
        expiresAt: new Date(NOW.getTime() + 24 * 60 * 60_000).toISOString(),
      },
      NOW,
    );
  }

  it('mark_collected (pharmacy) is the authoritative transition to collected', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const approved = approveOne(created, id);

    const result = syntheticReservationsReducer(
      approved,
      { type: 'mark_collected', reservationId: id },
      NOW,
    );
    expect(result.reservations[0]!.status).toBe('collected');
  });

  it('confirm_collected (buyer) is feedback only and never changes the lifecycle status (ADR-087)', () => {
    const created = requestOne();
    const id = created.reservations[0]!.id;
    const approved = approveOne(created, id);

    const result = syntheticReservationsReducer(
      approved,
      { type: 'confirm_collected', reservationId: id },
      NOW,
    );
    expect(result.reservations[0]!.status).toBe('approved');
    expect(result.reservations[0]!.buyerConfirmedCollectedAt).toBe(NOW.toISOString());
  });
});

describe('isReservationOverdue', () => {
  it('is true only for an approved reservation past its expiry', () => {
    const approved: SyntheticReservation = {
      ...VALID_INPUT,
      id: 'r1',
      buyerKey: BUYER,
      status: 'approved',
      requestedAt: NOW.toISOString(),
      lastUpdatedAt: NOW.toISOString(),
      confirmedPriceFjdMinor: 700,
      pickupInstructions: 'x',
      expiresAt: new Date(NOW.getTime() - 1000).toISOString(),
      declineReason: null,
      cancelReason: null,
      cancelledBy: null,
      buyerConfirmedCollectedAt: null,
    };
    expect(isReservationOverdue(approved, NOW)).toBe(true);
    expect(isReservationOverdue({ ...approved, status: 'pending' }, NOW)).toBe(false);
    expect(
      isReservationOverdue(
        { ...approved, expiresAt: new Date(NOW.getTime() + 1000).toISOString() },
        NOW,
      ),
    ).toBe(false);
  });
});

describe('isReservationsSuspended', () => {
  it('is false below the no-show threshold and true at/after it', () => {
    const base = createInitialReservationsState();
    const noShow = (i: number): SyntheticReservation => ({
      ...VALID_INPUT,
      id: `ns-${i}`,
      buyerKey: BUYER,
      status: 'expired',
      requestedAt: NOW.toISOString(),
      lastUpdatedAt: NOW.toISOString(),
      confirmedPriceFjdMinor: 700,
      pickupInstructions: 'x',
      expiresAt: NOW.toISOString(),
      declineReason: null,
      cancelReason: null,
      cancelledBy: null,
      buyerConfirmedCollectedAt: null,
    });

    const two = { reservations: [noShow(1), noShow(2)] };
    expect(isReservationsSuspended(two.reservations, BUYER, NOW)).toBe(false);

    const three = { reservations: [noShow(1), noShow(2), noShow(3)] };
    expect(isReservationsSuspended(three.reservations, BUYER, NOW)).toBe(true);
    expect(base.reservations).toHaveLength(0);
  });

  it('only counts no-shows within the 30-day window', () => {
    const old = new Date(NOW.getTime() - 31 * 24 * 60 * 60_000).toISOString();
    const reservations: SyntheticReservation[] = [1, 2, 3].map((i) => ({
      ...VALID_INPUT,
      id: `ns-${i}`,
      buyerKey: BUYER,
      status: 'expired',
      requestedAt: old,
      lastUpdatedAt: old,
      confirmedPriceFjdMinor: 700,
      pickupInstructions: 'x',
      expiresAt: old,
      declineReason: null,
      cancelReason: null,
      cancelledBy: null,
      buyerConfirmedCollectedAt: null,
    }));

    expect(countRecentNoShows(reservations, BUYER, NOW)).toBe(0);
    expect(isReservationsSuspended(reservations, BUYER, NOW)).toBe(false);
  });
});
