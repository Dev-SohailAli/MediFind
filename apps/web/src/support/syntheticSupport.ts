/**
 * Local-only synthetic support-report/moderation/audit simulation
 * (ADR-277 Milestone C, fourth bullet: "support reports, scoped
 * moderation, redacted audit views and safe escalation"). Every report
 * and audit row here is created or derived entirely in memory; nothing
 * is sent to or read from a network request, and no email/message/
 * notification is ever sent to a pharmacy from this module — per the
 * design proposal §5.3 Reports, an admin action here creates an internal
 * record only.
 *
 * The same fixed demo identity used for the buyer and pharmacy-staff
 * simulations also reaches this MediFind-support view (see
 * SupportPanel.tsx) — consistent with how Milestone B already lets one
 * identity hold every role this prototype needs, rather than inventing a
 * separate admin sign-in flow.
 */

import type {
  PrescriptionRejectReason,
  SyntheticPrescription,
} from '../prescriptions/syntheticPrescriptions';
import type {
  ReservationCancelledBy,
  SyntheticReservation,
} from '../reservations/syntheticReservations';

export const SYNTHETIC_ONLY = true as const;

export type SupportReportCategory =
  'listing_quality' | 'suspicious_activity' | 'support_case' | 'cant_find_medicine';

export type SupportReportStatus = 'open' | 'resolved' | 'escalated' | 'deferred';

export interface SyntheticSupportReport {
  readonly id: string;
  readonly category: SupportReportCategory;
  readonly reportedBy: string;
  readonly note: string;
  readonly targetListingId: string | null;
  readonly status: SupportReportStatus;
  readonly submittedAt: string;
  readonly lastUpdatedAt: string;
  readonly resolutionNote: string | null;
}

export interface SyntheticSupportState {
  readonly reports: readonly SyntheticSupportReport[];
}

export function createInitialSupportState(): SyntheticSupportState {
  return { reports: [] };
}

export interface SupportReportInput {
  readonly category: SupportReportCategory;
  readonly reportedBy: string;
  readonly note: string;
  readonly targetListingId: string | null;
}

export type SupportAction =
  | { readonly type: 'submit_report'; readonly input: SupportReportInput }
  | { readonly type: 'resolve'; readonly reportId: string; readonly resolutionNote: string }
  | { readonly type: 'escalate'; readonly reportId: string }
  | { readonly type: 'defer'; readonly reportId: string };

export function validateSupportReport(input: { note: string }): boolean {
  return input.note.trim().length > 0;
}

export function syntheticSupportReducer(
  state: SyntheticSupportState,
  action: SupportAction,
  now: Date = new Date(),
): SyntheticSupportState {
  switch (action.type) {
    case 'submit_report': {
      if (!validateSupportReport(action.input)) {
        return state;
      }
      const report: SyntheticSupportReport = {
        id: crypto.randomUUID(),
        category: action.input.category,
        reportedBy: action.input.reportedBy,
        note: action.input.note,
        targetListingId: action.input.targetListingId,
        status: 'open',
        submittedAt: now.toISOString(),
        lastUpdatedAt: now.toISOString(),
        resolutionNote: null,
      };
      return { reports: [...state.reports, report] };
    }

    case 'resolve': {
      return {
        reports: state.reports.map((report) =>
          report.id === action.reportId && report.status === 'open'
            ? {
                ...report,
                status: 'resolved',
                resolutionNote: action.resolutionNote,
                lastUpdatedAt: now.toISOString(),
              }
            : report,
        ),
      };
    }

    case 'escalate': {
      return {
        reports: state.reports.map((report) =>
          report.id === action.reportId && report.status === 'open'
            ? { ...report, status: 'escalated', lastUpdatedAt: now.toISOString() }
            : report,
        ),
      };
    }

    case 'defer': {
      return {
        reports: state.reports.map((report) =>
          report.id === action.reportId && report.status === 'open'
            ? { ...report, status: 'deferred', lastUpdatedAt: now.toISOString() }
            : report,
        ),
      };
    }

    default:
      return state;
  }
}

export type AuditActionType =
  | 'reservation_approved'
  | 'reservation_declined'
  | 'reservation_cancelled'
  | 'reservation_expired'
  | 'reservation_collected'
  | 'prescription_approved'
  | 'prescription_rejected'
  | 'prescription_expired'
  | 'prescription_cancelled';

export interface SyntheticAuditEvent {
  readonly id: string;
  readonly actionType: AuditActionType;
  readonly targetType: 'reservation' | 'prescription';
  readonly branchId: string | null;
  readonly occurredAt: string;
  readonly safeSummary: string;
}

function reservationAuditEvent(
  reservation: SyntheticReservation,
  actionType: AuditActionType,
  safeSummary: string,
): SyntheticAuditEvent {
  return {
    id: `${reservation.id}-${actionType}`,
    actionType,
    targetType: 'reservation',
    branchId: reservation.branchId,
    occurredAt: reservation.lastUpdatedAt,
    safeSummary,
  };
}

function prescriptionAuditEvent(
  prescription: SyntheticPrescription,
  actionType: AuditActionType,
  safeSummary: string,
): SyntheticAuditEvent {
  return {
    id: `${prescription.id}-${actionType}`,
    actionType,
    targetType: 'prescription',
    branchId: prescription.branchId,
    occurredAt: prescription.lastUpdatedAt,
    safeSummary,
  };
}

const CANCELLED_BY_LABEL: Record<ReservationCancelledBy, string> = {
  buyer: 'buyer',
  pharmacy: 'pharmacy',
};

const REJECT_REASON_SUMMARY: Record<PrescriptionRejectReason, string> = {
  illegible: 'illegible',
  incomplete_information: 'incomplete information',
  suspected_duplicate: 'suspected duplicate',
  invalid_prescription: 'invalid prescription',
  other: 'other',
};

/**
 * Redacted, safe-projection audit trail (design proposal §5.3 Audit
 * view): derived from reservation/prescription state rather than a
 * separate logging call at every mutation site — matching how
 * notifications are derived, and guaranteeing the audit view can never
 * drift out of sync with what actually happened. Never includes a
 * prescription file, patient name, buyer contact value, OTP or access
 * token — only the action type, target type, branch and a short safe
 * summary (ADR-187/ADR-188).
 */
export function deriveAuditEvents(
  reservations: readonly SyntheticReservation[],
  prescriptions: readonly SyntheticPrescription[],
): readonly SyntheticAuditEvent[] {
  const events: SyntheticAuditEvent[] = [];

  for (const reservation of reservations) {
    if (reservation.status === 'approved' || reservation.status === 'collected') {
      events.push(
        reservationAuditEvent(reservation, 'reservation_approved', 'Reservation approved'),
      );
    }
    if (reservation.status === 'declined') {
      events.push(
        reservationAuditEvent(reservation, 'reservation_declined', 'Reservation declined'),
      );
    }
    if (reservation.status === 'cancelled') {
      events.push(
        reservationAuditEvent(
          reservation,
          'reservation_cancelled',
          `Reservation cancelled by ${CANCELLED_BY_LABEL[reservation.cancelledBy ?? 'buyer']}`,
        ),
      );
    }
    if (reservation.status === 'expired') {
      events.push(reservationAuditEvent(reservation, 'reservation_expired', 'Reservation expired'));
    }
    if (reservation.status === 'collected') {
      events.push(
        reservationAuditEvent(reservation, 'reservation_collected', 'Reservation collected'),
      );
    }
  }

  for (const prescription of prescriptions) {
    if (prescription.status === 'approved') {
      events.push(
        prescriptionAuditEvent(prescription, 'prescription_approved', 'Prescription approved'),
      );
    }
    if (prescription.status === 'rejected') {
      events.push(
        prescriptionAuditEvent(
          prescription,
          'prescription_rejected',
          `Prescription rejected: ${REJECT_REASON_SUMMARY[prescription.rejectReason ?? 'other']}`,
        ),
      );
    }
    if (prescription.status === 'expired') {
      events.push(
        prescriptionAuditEvent(prescription, 'prescription_expired', 'Prescription expired'),
      );
    }
    if (prescription.status === 'cancelled') {
      events.push(
        prescriptionAuditEvent(prescription, 'prescription_cancelled', 'Prescription cancelled'),
      );
    }
  }

  return events.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}
