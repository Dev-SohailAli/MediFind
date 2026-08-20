import { describe, expect, it } from 'vitest';

import {
  PRESCRIPTION_EXPIRY_HOURS,
  createInitialPrescriptionsState,
  evaluatePrescriptionUpload,
  isPrescriptionOverdue,
  simulateScannerOutcome,
  syntheticPrescriptionsReducer,
  validatePrescriptionUpload,
  type SyntheticFileDescriptor,
  type SyntheticPrescription,
  type SyntheticPrescriptionUploadInput,
} from '../syntheticPrescriptions';

const NOW = new Date('2026-08-21T00:00:00.000Z');
const BUYER = '+679 000 0000';

// Deliberately chosen so simulateScannerOutcome(`${name}-${sizeBytes}`) is
// 'clean' — this file name/size seed was verified against the module's
// actual hash before being fixed here, not asserted blind.
const VALID_FILE: SyntheticFileDescriptor = {
  name: 'prescription-clean-0.pdf',
  sizeBytes: 1024,
  mimeType: 'application/pdf',
};

const VALID_INPUT: SyntheticPrescriptionUploadInput = {
  branchId: 'suva-central',
  pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
  patientName: 'Litia Waqa',
  relationship: 'self',
  file: VALID_FILE,
  legibilityConfirmed: true,
  consentConfirmed: true,
};

describe('validatePrescriptionUpload', () => {
  it('accepts a fully valid input with no errors', () => {
    expect(validatePrescriptionUpload(VALID_INPUT)).toEqual([]);
  });

  it('requires a patient name', () => {
    expect(validatePrescriptionUpload({ ...VALID_INPUT, patientName: '  ' })).toEqual([
      'patientName',
    ]);
  });

  it('rejects an unsupported file type', () => {
    expect(
      validatePrescriptionUpload({
        ...VALID_INPUT,
        file: { ...VALID_FILE, mimeType: 'application/zip' },
      }),
    ).toEqual(['unsupportedFileType']);
  });

  it('rejects a file over 10 MB', () => {
    expect(
      validatePrescriptionUpload({
        ...VALID_INPUT,
        file: { ...VALID_FILE, sizeBytes: 11 * 1024 * 1024 },
      }),
    ).toEqual(['oversizedFile']);
  });

  it('requires legibility and consent confirmation', () => {
    expect(
      validatePrescriptionUpload({
        ...VALID_INPUT,
        legibilityConfirmed: false,
        consentConfirmed: false,
      }),
    ).toEqual(['legibilityNotConfirmed', 'consentNotConfirmed']);
  });

  it('reports every violated field at once', () => {
    expect(
      validatePrescriptionUpload({
        patientName: '',
        file: { name: 'x.zip', sizeBytes: 20 * 1024 * 1024, mimeType: 'application/zip' },
        legibilityConfirmed: false,
        consentConfirmed: false,
      }),
    ).toEqual([
      'patientName',
      'unsupportedFileType',
      'oversizedFile',
      'legibilityNotConfirmed',
      'consentNotConfirmed',
    ]);
  });
});

describe('simulateScannerOutcome', () => {
  it('is a pure deterministic function of its seed', () => {
    expect(simulateScannerOutcome('abc')).toBe(simulateScannerOutcome('abc'));
  });

  it('produces every outcome across a range of seeds, including unknown', () => {
    const outcomes = new Set(
      Array.from({ length: 50 }, (_, i) => simulateScannerOutcome(`file-${i}.pdf-1024`)),
    );
    expect(outcomes.has('clean')).toBe(true);
    expect(outcomes.has('quarantined')).toBe(true);
    expect(outcomes.has('blocked')).toBe(true);
    expect(outcomes.has('unknown')).toBe(true);
  });
});

/**
 * evaluatePrescriptionUpload seeds the scanner with `${name}-${sizeBytes}`.
 * Finds a `{ name, sizeBytes }` pair (fixed sizeBytes, varying name) whose
 * combined seed produces the requested outcome, so tests can exercise
 * every branch deterministically without hand-picking magic filenames.
 */
function findFileWithOutcome(outcome: string, prefix: string): { name: string; sizeBytes: number } {
  const sizeBytes = 2048;
  for (let i = 0; i < 200; i += 1) {
    const name = `${prefix}-${i}.pdf`;
    if (simulateScannerOutcome(`${name}-${sizeBytes}`) === outcome) {
      return { name, sizeBytes };
    }
  }
  throw new Error(`No file found for outcome ${outcome}`);
}

describe('evaluatePrescriptionUpload', () => {
  it('rejects with field errors before ever running the scanner, when the input is invalid', () => {
    const outcome = evaluatePrescriptionUpload(BUYER, { ...VALID_INPUT, patientName: '' }, NOW);
    expect(outcome).toEqual({ status: 'rejected_validation', errors: ['patientName'] });
  });

  it('accepts a clean file: creates an under_review, non-quarantined prescription', () => {
    const file = findFileWithOutcome('clean', 'clean-file');
    const outcome = evaluatePrescriptionUpload(
      BUYER,
      { ...VALID_INPUT, file: { ...file, mimeType: 'application/pdf' } },
      NOW,
    );
    expect(outcome.status).toBe('accepted');
    if (outcome.status === 'accepted') {
      expect(outcome.prescription.status).toBe('under_review');
      expect(outcome.prescription.quarantined).toBe(false);
      expect(outcome.prescription.buyerKey).toBe(BUYER);
      expect(outcome.prescription.expiresAt).toBe(
        new Date(NOW.getTime() + PRESCRIPTION_EXPIRY_HOURS * 60 * 60_000).toISOString(),
      );
    }
  });

  it('accepts a quarantined file: still under_review to the buyer, but flagged internally', () => {
    const file = findFileWithOutcome('quarantined', 'quarantined-file');
    const outcome = evaluatePrescriptionUpload(
      BUYER,
      { ...VALID_INPUT, file: { ...file, mimeType: 'application/pdf' } },
      NOW,
    );
    expect(outcome.status).toBe('accepted');
    if (outcome.status === 'accepted') {
      expect(outcome.prescription.status).toBe('under_review');
      expect(outcome.prescription.quarantined).toBe(true);
    }
  });

  it('rejects a blocked file: no prescription record is ever created', () => {
    const file = findFileWithOutcome('blocked', 'blocked-file');
    const outcome = evaluatePrescriptionUpload(
      BUYER,
      { ...VALID_INPUT, file: { ...file, mimeType: 'application/pdf' } },
      NOW,
    );
    expect(outcome).toEqual({ status: 'rejected_unsafe' });
  });

  it('fails closed on an unknown scanner outcome: also no record created, never defaults to clean', () => {
    const file = findFileWithOutcome('unknown', 'unknown-file');
    const outcome = evaluatePrescriptionUpload(
      BUYER,
      { ...VALID_INPUT, file: { ...file, mimeType: 'application/pdf' } },
      NOW,
    );
    expect(outcome).toEqual({ status: 'rejected_unsafe' });
  });
});

describe('syntheticPrescriptionsReducer', () => {
  function createOne(): SyntheticPrescription {
    const outcome = evaluatePrescriptionUpload(BUYER, VALID_INPUT, NOW);
    if (outcome.status !== 'accepted') {
      throw new Error('expected accepted outcome for this fixed test file');
    }
    return outcome.prescription;
  }

  it('create adds the prescription to state', () => {
    const prescription = createOne();
    const state = syntheticPrescriptionsReducer(
      createInitialPrescriptionsState(),
      { type: 'create', prescription },
      NOW,
    );
    expect(state.prescriptions).toEqual([prescription]);
  });

  it('approve moves under_review -> approved, and is a no-op once already approved', () => {
    const prescription = createOne();
    const created = syntheticPrescriptionsReducer(
      createInitialPrescriptionsState(),
      { type: 'create', prescription },
      NOW,
    );

    const approved = syntheticPrescriptionsReducer(
      created,
      { type: 'approve', prescriptionId: prescription.id },
      NOW,
    );
    expect(approved.prescriptions[0]!.status).toBe('approved');

    const again = syntheticPrescriptionsReducer(
      approved,
      { type: 'approve', prescriptionId: prescription.id },
      NOW,
    );
    expect(again).toEqual(approved);
  });

  it('reject moves under_review -> rejected with the recorded reason category', () => {
    const prescription = createOne();
    const created = syntheticPrescriptionsReducer(
      createInitialPrescriptionsState(),
      { type: 'create', prescription },
      NOW,
    );

    const rejected = syntheticPrescriptionsReducer(
      created,
      { type: 'reject', prescriptionId: prescription.id, reason: 'illegible' },
      NOW,
    );
    expect(rejected.prescriptions[0]).toMatchObject({
      status: 'rejected',
      rejectReason: 'illegible',
    });
  });

  it('cancel moves under_review -> cancelled (buyer, pre-decision only)', () => {
    const prescription = createOne();
    const created = syntheticPrescriptionsReducer(
      createInitialPrescriptionsState(),
      { type: 'create', prescription },
      NOW,
    );

    const cancelled = syntheticPrescriptionsReducer(
      created,
      { type: 'cancel', prescriptionId: prescription.id },
      NOW,
    );
    expect(cancelled.prescriptions[0]!.status).toBe('cancelled');

    // Cancel is a no-op once a decision has already been made.
    const approvedFirst = syntheticPrescriptionsReducer(
      created,
      { type: 'approve', prescriptionId: prescription.id },
      NOW,
    );
    const cancelAfterApproved = syntheticPrescriptionsReducer(
      approvedFirst,
      { type: 'cancel', prescriptionId: prescription.id },
      NOW,
    );
    expect(cancelAfterApproved).toEqual(approvedFirst);
  });

  it('expire only fires once the two-day window has actually passed', () => {
    const prescription = createOne();
    const created = syntheticPrescriptionsReducer(
      createInitialPrescriptionsState(),
      { type: 'create', prescription },
      NOW,
    );

    const tooEarly = syntheticPrescriptionsReducer(
      created,
      { type: 'expire', prescriptionId: prescription.id },
      NOW,
    );
    expect(tooEarly).toEqual(created);

    const later = new Date(NOW.getTime() + (PRESCRIPTION_EXPIRY_HOURS + 1) * 60 * 60_000);
    const expired = syntheticPrescriptionsReducer(
      created,
      { type: 'expire', prescriptionId: prescription.id },
      later,
    );
    expect(expired.prescriptions[0]!.status).toBe('expired');
  });
});

describe('isPrescriptionOverdue', () => {
  it('is true only for an under_review prescription past its expiry', () => {
    const prescription = evaluatePrescriptionUpload(BUYER, VALID_INPUT, NOW);
    if (prescription.status !== 'accepted') throw new Error('unexpected');
    const record = prescription.prescription;

    expect(isPrescriptionOverdue(record, NOW)).toBe(false);
    expect(
      isPrescriptionOverdue(
        record,
        new Date(NOW.getTime() + (PRESCRIPTION_EXPIRY_HOURS + 1) * 60 * 60_000),
      ),
    ).toBe(true);
    expect(
      isPrescriptionOverdue(
        { ...record, status: 'approved' },
        new Date(NOW.getTime() + (PRESCRIPTION_EXPIRY_HOURS + 1) * 60 * 60_000),
      ),
    ).toBe(false);
  });
});
