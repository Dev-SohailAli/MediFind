/**
 * Local-only synthetic prescription upload/quarantine/scanner simulation
 * (ADR-277 Milestone C, third bullet: "prescription upload quarantine,
 * deterministic scanner outcomes and fail-closed unknown states using
 * test doubles only"). The actual selected file is never read, stored or
 * transmitted anywhere — only its name/size/type are used, purely to
 * decide a deterministic synthetic outcome, then discarded. Nothing here
 * is sent to or read from a network request.
 *
 * Buyer-visible status is always `submitted`/`under_review`/`approved`/
 * `rejected`/`expired`/`cancelled` — never a `quarantined` label, per the
 * founder decision recorded in the design proposal §8: the buyer sees the
 * generic "Under review" state, and the internal quarantine flag is
 * visible only to an authorised pharmacy reviewer.
 */

export const SYNTHETIC_ONLY = true as const;

export type PrescriptionRelationship = 'self' | 'child' | 'dependent';

export type PrescriptionStatus = 'under_review' | 'approved' | 'rejected' | 'expired' | 'cancelled';

export type PrescriptionRejectReason =
  'illegible' | 'incomplete_information' | 'suspected_duplicate' | 'invalid_prescription' | 'other';

export type ScannerOutcome = 'clean' | 'quarantined' | 'blocked' | 'unknown';

const SUPPORTED_FILE_TYPES: readonly string[] = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export interface SyntheticFileDescriptor {
  readonly name: string;
  readonly sizeBytes: number;
  readonly mimeType: string;
}

export interface SyntheticPrescriptionUploadInput {
  readonly branchId: string;
  readonly pharmacyDisplayName: string;
  readonly patientName: string;
  readonly relationship: PrescriptionRelationship;
  readonly file: SyntheticFileDescriptor;
  readonly legibilityConfirmed: boolean;
  readonly consentConfirmed: boolean;
}

export interface SyntheticPrescription {
  readonly id: string;
  readonly buyerKey: string;
  readonly branchId: string;
  readonly pharmacyDisplayName: string;
  readonly patientName: string;
  readonly relationship: PrescriptionRelationship;
  readonly status: PrescriptionStatus;
  readonly quarantined: boolean;
  readonly submittedAt: string;
  readonly lastUpdatedAt: string;
  readonly expiresAt: string;
  readonly rejectReason: PrescriptionRejectReason | null;
}

export interface SyntheticPrescriptionsState {
  readonly prescriptions: readonly SyntheticPrescription[];
}

export function createInitialPrescriptionsState(): SyntheticPrescriptionsState {
  return { prescriptions: [] };
}

export type PrescriptionUploadFieldError =
  | 'patientName'
  | 'unsupportedFileType'
  | 'oversizedFile'
  | 'legibilityNotConfirmed'
  | 'consentNotConfirmed';

export function validatePrescriptionUpload(
  input: Pick<
    SyntheticPrescriptionUploadInput,
    'patientName' | 'file' | 'legibilityConfirmed' | 'consentConfirmed'
  >,
): readonly PrescriptionUploadFieldError[] {
  const errors: PrescriptionUploadFieldError[] = [];

  if (!input.patientName.trim()) {
    errors.push('patientName');
  }
  if (!SUPPORTED_FILE_TYPES.includes(input.file.mimeType)) {
    errors.push('unsupportedFileType');
  }
  if (input.file.sizeBytes > MAX_FILE_SIZE_BYTES) {
    errors.push('oversizedFile');
  }
  if (!input.legibilityConfirmed) {
    errors.push('legibilityNotConfirmed');
  }
  if (!input.consentConfirmed) {
    errors.push('consentNotConfirmed');
  }

  return errors;
}

/**
 * Deterministic, seeded by the file name+size — not a real scan or real
 * randomness, purely so this prototype can demonstrate every outcome
 * reproducibly. `unknown` deliberately fails closed: it is treated
 * identically to `blocked` everywhere below (the upload is refused, never
 * reaches any reviewer inbox) rather than defaulting to `clean`.
 */
export function simulateScannerOutcome(seed: string): ScannerOutcome {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  const bucket = hash % 10;
  if (bucket === 9) return 'unknown';
  if (bucket === 8) return 'blocked';
  if (bucket >= 5) return 'quarantined';
  return 'clean';
}

export const PRESCRIPTION_EXPIRY_HOURS = 48;

export type PrescriptionUploadOutcome =
  | { readonly status: 'accepted'; readonly prescription: SyntheticPrescription }
  | {
      readonly status: 'rejected_validation';
      readonly errors: readonly PrescriptionUploadFieldError[];
    }
  | { readonly status: 'rejected_unsafe' };

/**
 * The single entry point for a buyer upload: validates the field-level
 * requirements first (never runs the scanner on an incomplete submission),
 * then runs the deterministic scanner. `blocked`/`unknown` never create a
 * record at all — matching the requirement that a technically unsafe file
 * "never enters" any inbox, buyer or pharmacy. `clean`/`quarantined` both
 * create a record the buyer sees as `under_review`; only `quarantined`
 * carries the internal reviewer-only restricted flag.
 */
export function evaluatePrescriptionUpload(
  buyerKey: string,
  input: SyntheticPrescriptionUploadInput,
  now: Date = new Date(),
): PrescriptionUploadOutcome {
  const errors = validatePrescriptionUpload(input);
  if (errors.length > 0) {
    return { status: 'rejected_validation', errors };
  }

  const seed = `${input.file.name}-${input.file.sizeBytes}`;
  const outcome = simulateScannerOutcome(seed);
  if (outcome === 'blocked' || outcome === 'unknown') {
    return { status: 'rejected_unsafe' };
  }

  const prescription: SyntheticPrescription = {
    id: crypto.randomUUID(),
    buyerKey,
    branchId: input.branchId,
    pharmacyDisplayName: input.pharmacyDisplayName,
    patientName: input.patientName,
    relationship: input.relationship,
    status: 'under_review',
    quarantined: outcome === 'quarantined',
    submittedAt: now.toISOString(),
    lastUpdatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + PRESCRIPTION_EXPIRY_HOURS * 60 * 60_000).toISOString(),
    rejectReason: null,
  };
  return { status: 'accepted', prescription };
}

export function isPrescriptionOverdue(
  prescription: SyntheticPrescription,
  now: Date = new Date(),
): boolean {
  return (
    prescription.status === 'under_review' &&
    new Date(prescription.expiresAt).getTime() <= now.getTime()
  );
}

export type SyntheticPrescriptionsAction =
  | { readonly type: 'create'; readonly prescription: SyntheticPrescription }
  | {
      readonly type: 'approve';
      readonly prescriptionId: string;
    }
  | {
      readonly type: 'reject';
      readonly prescriptionId: string;
      readonly reason: PrescriptionRejectReason;
    }
  | { readonly type: 'expire'; readonly prescriptionId: string }
  | { readonly type: 'cancel'; readonly prescriptionId: string };

/**
 * `create` accepts an already-built `SyntheticPrescription` (from
 * `evaluatePrescriptionUpload`) rather than raw input, since the scanner
 * decision and any rejection must happen before anything reaches state —
 * mirroring the fixed-timestamp pattern the reducer test suite already
 * relies on for `syntheticReservations`.
 */
export function syntheticPrescriptionsReducer(
  state: SyntheticPrescriptionsState,
  action: SyntheticPrescriptionsAction,
  now: Date = new Date(),
): SyntheticPrescriptionsState {
  switch (action.type) {
    case 'create': {
      return { prescriptions: [...state.prescriptions, action.prescription] };
    }

    case 'approve': {
      return {
        prescriptions: state.prescriptions.map((prescription) =>
          prescription.id === action.prescriptionId && prescription.status === 'under_review'
            ? { ...prescription, status: 'approved', lastUpdatedAt: now.toISOString() }
            : prescription,
        ),
      };
    }

    case 'reject': {
      return {
        prescriptions: state.prescriptions.map((prescription) =>
          prescription.id === action.prescriptionId && prescription.status === 'under_review'
            ? {
                ...prescription,
                status: 'rejected',
                rejectReason: action.reason,
                lastUpdatedAt: now.toISOString(),
              }
            : prescription,
        ),
      };
    }

    case 'expire': {
      return {
        prescriptions: state.prescriptions.map((prescription) =>
          prescription.id === action.prescriptionId && isPrescriptionOverdue(prescription, now)
            ? { ...prescription, status: 'expired', lastUpdatedAt: now.toISOString() }
            : prescription,
        ),
      };
    }

    case 'cancel': {
      return {
        prescriptions: state.prescriptions.map((prescription) =>
          prescription.id === action.prescriptionId && prescription.status === 'under_review'
            ? { ...prescription, status: 'cancelled', lastUpdatedAt: now.toISOString() }
            : prescription,
        ),
      };
    }

    default:
      return state;
  }
}
