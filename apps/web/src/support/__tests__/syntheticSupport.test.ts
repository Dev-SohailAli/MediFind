import { describe, expect, it } from 'vitest';

import type { SyntheticPrescription } from '../../prescriptions/syntheticPrescriptions';
import type { SyntheticReservation } from '../../reservations/syntheticReservations';
import {
  createInitialSupportState,
  deriveAuditEvents,
  syntheticSupportReducer,
  validateSupportReport,
  type SupportReportInput,
} from '../syntheticSupport';

const NOW = new Date('2026-08-21T00:00:00.000Z');
const BUYER = '+679 000 0000';

const VALID_INPUT: SupportReportInput = {
  category: 'listing_quality',
  reportedBy: BUYER,
  note: 'Price shown does not match what the pharmacy quoted.',
  targetListingId: 'farovex-suva-central',
};

function submitOne(input: SupportReportInput = VALID_INPUT) {
  return syntheticSupportReducer(
    createInitialSupportState(),
    { type: 'submit_report', input },
    NOW,
  );
}

describe('validateSupportReport', () => {
  it('requires a non-empty note', () => {
    expect(validateSupportReport({ note: 'A concern' })).toBe(true);
    expect(validateSupportReport({ note: '   ' })).toBe(false);
  });
});

describe('syntheticSupportReducer — submit_report', () => {
  it('creates an open report', () => {
    const state = submitOne();
    expect(state.reports).toHaveLength(1);
    expect(state.reports[0]).toMatchObject({
      status: 'open',
      category: 'listing_quality',
      reportedBy: BUYER,
      note: VALID_INPUT.note,
      targetListingId: VALID_INPUT.targetListingId,
    });
  });

  it('is a no-op for an empty note', () => {
    const state = submitOne({ ...VALID_INPUT, note: '   ' });
    expect(state.reports).toHaveLength(0);
  });

  it('supports a report with no target listing (e.g. suspicious activity)', () => {
    const state = submitOne({
      category: 'suspicious_activity',
      reportedBy: BUYER,
      note: 'Unfamiliar sign-in device',
      targetListingId: null,
    });
    expect(state.reports[0]!.targetListingId).toBeNull();
  });
});

describe('syntheticSupportReducer — decisions', () => {
  it('resolve moves open -> resolved with a recorded outcome note, and is a no-op once resolved', () => {
    const created = submitOne();
    const id = created.reports[0]!.id;

    const resolved = syntheticSupportReducer(
      created,
      {
        type: 'resolve',
        reportId: id,
        resolutionNote: 'Confirmed with pharmacy, price corrected.',
      },
      NOW,
    );
    expect(resolved.reports[0]).toMatchObject({
      status: 'resolved',
      resolutionNote: 'Confirmed with pharmacy, price corrected.',
    });

    const again = syntheticSupportReducer(
      resolved,
      { type: 'resolve', reportId: id, resolutionNote: 'x' },
      NOW,
    );
    expect(again).toEqual(resolved);
  });

  it('escalate moves open -> escalated', () => {
    const created = submitOne();
    const id = created.reports[0]!.id;

    const escalated = syntheticSupportReducer(created, { type: 'escalate', reportId: id }, NOW);
    expect(escalated.reports[0]!.status).toBe('escalated');
  });

  it('defer moves open -> deferred', () => {
    const created = submitOne();
    const id = created.reports[0]!.id;

    const deferred = syntheticSupportReducer(created, { type: 'defer', reportId: id }, NOW);
    expect(deferred.reports[0]!.status).toBe('deferred');
  });

  it('a terminal report cannot be re-decided', () => {
    const created = submitOne();
    const id = created.reports[0]!.id;
    const escalated = syntheticSupportReducer(created, { type: 'escalate', reportId: id }, NOW);

    const result = syntheticSupportReducer(escalated, { type: 'defer', reportId: id }, NOW);
    expect(result).toEqual(escalated);
  });
});

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
    status: 'approved',
    requestedAt: NOW.toISOString(),
    lastUpdatedAt: NOW.toISOString(),
    confirmedPriceFjdMinor: 700,
    pickupInstructions: 'Front counter',
    expiresAt: NOW.toISOString(),
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
    buyerKey: BUYER,
    branchId: 'suva-central',
    pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
    patientName: 'Litia Waqa',
    relationship: 'self',
    status: 'approved',
    quarantined: false,
    submittedAt: NOW.toISOString(),
    lastUpdatedAt: NOW.toISOString(),
    expiresAt: NOW.toISOString(),
    rejectReason: null,
    ...overrides,
  };
}

describe('deriveAuditEvents', () => {
  it('produces no event for a still-pending/under_review record', () => {
    expect(
      deriveAuditEvents(
        [reservation({ status: 'pending' })],
        [prescription({ status: 'under_review' })],
      ),
    ).toHaveLength(0);
  });

  it('produces a reservation-approved event with a safe, non-identifying summary', () => {
    const events = deriveAuditEvents([reservation({ status: 'approved' })], []);
    expect(events).toHaveLength(1);
    expect(events[0]!.targetType).toBe('reservation');
    expect(events[0]!.safeSummary).not.toContain('Litia');
    expect(events[0]!.safeSummary).not.toContain('Farovex');
  });

  it('never leaks patient name, buyer key or pharmacy display name into any event', () => {
    const events = deriveAuditEvents(
      [reservation({ status: 'cancelled', cancelledBy: 'pharmacy', cancelReason: 'Out of stock' })],
      [prescription({ status: 'rejected', rejectReason: 'illegible' })],
    );
    const serialized = JSON.stringify(events);
    expect(serialized).not.toContain('Litia');
    expect(serialized).not.toContain(BUYER);
    expect(serialized).not.toContain('Suva Central Pharmacy');
  });

  it('produces a prescription-rejected event with the safe reason category summary', () => {
    const events = deriveAuditEvents(
      [],
      [prescription({ status: 'rejected', rejectReason: 'illegible' })],
    );
    expect(events[0]!.safeSummary).toContain('illegible');
  });

  it('sorts events newest first', () => {
    const events = deriveAuditEvents(
      [
        reservation({ id: 'old', status: 'expired', lastUpdatedAt: '2026-08-01T00:00:00.000Z' }),
        reservation({ id: 'new', status: 'approved', lastUpdatedAt: '2026-08-20T00:00:00.000Z' }),
      ],
      [],
    );
    expect(events[0]!.id).toContain('new');
  });
});
