import { describe, expect, it } from 'vitest';

import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import {
  createInitialNotificationOptInStatus,
  createInitialNotificationReadState,
  deriveNotifications,
  notificationOptInReducer,
  notificationReadReducer,
  simulateDeliveryOutcome,
} from '../syntheticNotifications';

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

describe('deriveNotifications', () => {
  it('creates no notification for a still-pending reservation', () => {
    expect(deriveNotifications([reservation({ status: 'pending' })], BUYER)).toHaveLength(0);
  });

  it('creates exactly one notification per notifiable status transition', () => {
    const statuses = ['approved', 'declined', 'expired', 'cancelled', 'collected'] as const;
    for (const status of statuses) {
      const notifications = deriveNotifications([reservation({ status })], BUYER);
      expect(notifications).toHaveLength(1);
    }
  });

  it('never carries the medicine, pharmacy or patient name — only the reservation ID and timing', () => {
    const notifications = deriveNotifications([reservation({ status: 'approved' })], BUYER);
    const values = Object.values(notifications[0]!);
    expect(values.some((v) => typeof v === 'string' && v.includes('Farovex'))).toBe(false);
    expect(values.some((v) => typeof v === 'string' && v.includes('Suva Central'))).toBe(false);
    expect(values.some((v) => typeof v === 'string' && v.includes('Litia'))).toBe(false);
  });

  it('only derives notifications for the given buyer', () => {
    const notifications = deriveNotifications(
      [reservation({ status: 'approved', buyerKey: '+679 111 1111' })],
      BUYER,
    );
    expect(notifications).toHaveLength(0);
  });

  it('is stable/idempotent: the same reservation always derives the same notification id', () => {
    const a = deriveNotifications([reservation({ status: 'approved' })], BUYER);
    const b = deriveNotifications([reservation({ status: 'approved' })], BUYER);
    expect(a[0]!.id).toBe(b[0]!.id);
  });

  it('sorts notifications newest first', () => {
    const notifications = deriveNotifications(
      [
        reservation({ id: 'old', status: 'declined', lastUpdatedAt: '2026-08-01T00:00:00.000Z' }),
        reservation({ id: 'new', status: 'approved', lastUpdatedAt: '2026-08-20T00:00:00.000Z' }),
      ],
      BUYER,
    );
    expect(notifications.map((n) => n.reservationId)).toEqual(['new', 'old']);
  });
});

describe('simulateDeliveryOutcome', () => {
  it('is a pure deterministic function of its seed', () => {
    expect(simulateDeliveryOutcome('abc')).toBe(simulateDeliveryOutcome('abc'));
  });

  it('produces both outcomes across a range of seeds', () => {
    const outcomes = new Set(
      Array.from({ length: 20 }, (_, i) => simulateDeliveryOutcome(`seed-${i}`)),
    );
    expect(outcomes.has('delivered')).toBe(true);
    expect(outcomes.has('failed')).toBe(true);
  });
});

describe('notificationReadReducer', () => {
  it('mark_read adds the id and is idempotent', () => {
    const state1 = notificationReadReducer(createInitialNotificationReadState(), {
      type: 'mark_read',
      id: 'n1',
    });
    expect(state1.readIds.has('n1')).toBe(true);

    const state2 = notificationReadReducer(state1, { type: 'mark_read', id: 'n1' });
    expect(state2).toEqual(state1);
  });

  it('mark_all_read adds every id', () => {
    const state = notificationReadReducer(createInitialNotificationReadState(), {
      type: 'mark_all_read',
      ids: ['n1', 'n2'],
    });
    expect(state.readIds.has('n1')).toBe(true);
    expect(state.readIds.has('n2')).toBe(true);
  });
});

describe('notificationOptInReducer', () => {
  it('walks not_asked -> explaining -> granted', () => {
    let status = createInitialNotificationOptInStatus();
    status = notificationOptInReducer(status, { type: 'show_explainer' });
    expect(status).toBe('explaining');
    status = notificationOptInReducer(status, { type: 'allow' });
    expect(status).toBe('granted');
  });

  it('walks not_asked -> explaining -> dismissed, and can be re-asked', () => {
    let status = createInitialNotificationOptInStatus();
    status = notificationOptInReducer(status, { type: 'show_explainer' });
    status = notificationOptInReducer(status, { type: 'dismiss' });
    expect(status).toBe('dismissed');

    status = notificationOptInReducer(status, { type: 'show_explainer' });
    expect(status).toBe('explaining');
  });

  it('allow is a no-op when not currently explaining', () => {
    const status = notificationOptInReducer('not_asked', { type: 'allow' });
    expect(status).toBe('not_asked');
  });
});
