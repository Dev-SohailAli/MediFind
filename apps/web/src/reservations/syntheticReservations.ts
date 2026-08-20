/**
 * Local-only synthetic buyer OTC reservation-request state machine (ADR-277
 * Milestone C, first bullet: "eligible OTC reservation request, approval,
 * expiry, cancellation and conflict handling"). Every reservation here is
 * created, approved and expired entirely in memory; nothing is sent to or
 * read from a network request, and this never touches the real Task 4 D1
 * search schema or any hosted Worker route.
 *
 * Rules follow ADR-006/ADR-043 (buyer may request an in-stock OTC listing
 * directly; the pharmacy decides approval/expiry), ADR-012 (24-hour default
 * expiry, pharmacy-selected), ADR-065/ADR-223 (approval confirms or
 * discloses a changed collection price), ADR-076/ADR-087 (buyer collection
 * confirmation is feedback only — pharmacy staff remain the source of truth
 * for the `collected` status), ADR-077 (a pharmacy may cancel an approved
 * reservation only with a recorded operational reason), ADR-088 (automatic
 * expiry unless already collected/cancelled), ADR-089 (buyer may cancel a
 * pending/approved reservation before collection), ADR-090 (one active
 * reservation per medicine/identified person) and ADR-091 (three confirmed
 * no-shows in 30 days pauses new requests pending review).
 */

export const SYNTHETIC_ONLY = true as const;

export type ReservationRelationship = 'self' | 'child' | 'dependent';

export type ReservationStatus =
  'pending' | 'approved' | 'declined' | 'expired' | 'cancelled' | 'collected';

export type ReservationCancelledBy = 'buyer' | 'pharmacy';

export interface SyntheticReservationRequestInput {
  readonly listingId: string;
  readonly branchId: string | null;
  readonly medicineDisplayName: string;
  readonly pharmacyDisplayName: string;
  readonly requestedPriceFjdMinor: number;
  readonly patientName: string;
  readonly relationship: ReservationRelationship;
}

export interface SyntheticReservation extends SyntheticReservationRequestInput {
  readonly id: string;
  readonly buyerKey: string;
  readonly status: ReservationStatus;
  readonly requestedAt: string;
  readonly lastUpdatedAt: string;
  readonly confirmedPriceFjdMinor: number | null;
  readonly pickupInstructions: string | null;
  readonly expiresAt: string | null;
  readonly declineReason: string | null;
  readonly cancelReason: string | null;
  readonly cancelledBy: ReservationCancelledBy | null;
  readonly buyerConfirmedCollectedAt: string | null;
}

export interface SyntheticReservationsState {
  readonly reservations: readonly SyntheticReservation[];
}

export function createInitialReservationsState(): SyntheticReservationsState {
  return { reservations: [] };
}

export type SyntheticReservationsAction =
  | {
      readonly type: 'request';
      readonly buyerKey: string;
      readonly input: SyntheticReservationRequestInput;
    }
  | {
      readonly type: 'approve';
      readonly reservationId: string;
      readonly confirmedPriceFjdMinor: number;
      readonly pickupInstructions: string;
      readonly expiresAt: string;
    }
  | { readonly type: 'decline'; readonly reservationId: string; readonly reason: string | null }
  | {
      readonly type: 'cancel';
      readonly reservationId: string;
      readonly by: ReservationCancelledBy;
      readonly reason: string | null;
    }
  | { readonly type: 'expire'; readonly reservationId: string }
  | { readonly type: 'mark_collected'; readonly reservationId: string }
  | { readonly type: 'confirm_collected'; readonly reservationId: string };

export const RESERVATION_DEFAULT_EXPIRY_HOURS = 24;
export const RESERVATION_NO_SHOW_WINDOW_DAYS = 30;
export const RESERVATION_NO_SHOW_SUSPENSION_THRESHOLD = 3;

const ACTIVE_STATUSES: readonly ReservationStatus[] = ['pending', 'approved'];

export type ReservationFieldErrorField = 'patientName';

export function validateReservationRequest(input: {
  patientName: string;
}): readonly ReservationFieldErrorField[] {
  return input.patientName.trim() ? [] : ['patientName'];
}

/**
 * ADR-090: one active reservation per medicine (listing) and identified
 * person (patient name + relationship) per account holder, until it
 * completes, expires, is declined or is cancelled.
 */
export function findActiveReservationConflict(
  reservations: readonly SyntheticReservation[],
  buyerKey: string,
  listingId: string,
  patientName: string,
  relationship: ReservationRelationship,
): SyntheticReservation | null {
  const normalizedPatient = patientName.trim().toLowerCase();
  return (
    reservations.find(
      (reservation) =>
        reservation.buyerKey === buyerKey &&
        reservation.listingId === listingId &&
        reservation.relationship === relationship &&
        reservation.patientName.trim().toLowerCase() === normalizedPatient &&
        ACTIVE_STATUSES.includes(reservation.status),
    ) ?? null
  );
}

/**
 * ADR-091: three confirmed no-shows in 30 days temporarily disables new
 * requests. Every `expired` reservation in this simulation was necessarily
 * `approved` (an unactioned `pending` request never auto-expires here — see
 * the reducer's `expire` guard), so it always represents a missed pickup.
 */
export function countRecentNoShows(
  reservations: readonly SyntheticReservation[],
  buyerKey: string,
  now: Date = new Date(),
): number {
  const windowStart = now.getTime() - RESERVATION_NO_SHOW_WINDOW_DAYS * 24 * 60 * 60_000;
  return reservations.filter(
    (reservation) =>
      reservation.buyerKey === buyerKey &&
      reservation.status === 'expired' &&
      new Date(reservation.lastUpdatedAt).getTime() >= windowStart,
  ).length;
}

export function isReservationsSuspended(
  reservations: readonly SyntheticReservation[],
  buyerKey: string,
  now: Date = new Date(),
): boolean {
  return (
    countRecentNoShows(reservations, buyerKey, now) >= RESERVATION_NO_SHOW_SUSPENSION_THRESHOLD
  );
}

export function isReservationOverdue(
  reservation: SyntheticReservation,
  now: Date = new Date(),
): boolean {
  return (
    reservation.status === 'approved' &&
    reservation.expiresAt !== null &&
    new Date(reservation.expiresAt).getTime() <= now.getTime()
  );
}

export function syntheticReservationsReducer(
  state: SyntheticReservationsState,
  action: SyntheticReservationsAction,
  now: Date = new Date(),
): SyntheticReservationsState {
  switch (action.type) {
    case 'request': {
      const conflict = findActiveReservationConflict(
        state.reservations,
        action.buyerKey,
        action.input.listingId,
        action.input.patientName,
        action.input.relationship,
      );
      if (conflict || isReservationsSuspended(state.reservations, action.buyerKey, now)) {
        return state;
      }
      if (validateReservationRequest(action.input).length > 0) {
        return state;
      }

      const reservation: SyntheticReservation = {
        ...action.input,
        id: crypto.randomUUID(),
        buyerKey: action.buyerKey,
        status: 'pending',
        requestedAt: now.toISOString(),
        lastUpdatedAt: now.toISOString(),
        confirmedPriceFjdMinor: null,
        pickupInstructions: null,
        expiresAt: null,
        declineReason: null,
        cancelReason: null,
        cancelledBy: null,
        buyerConfirmedCollectedAt: null,
      };
      return { reservations: [...state.reservations, reservation] };
    }

    case 'approve': {
      return {
        reservations: state.reservations.map((reservation) =>
          reservation.id === action.reservationId && reservation.status === 'pending'
            ? {
                ...reservation,
                status: 'approved',
                confirmedPriceFjdMinor: action.confirmedPriceFjdMinor,
                pickupInstructions: action.pickupInstructions,
                expiresAt: action.expiresAt,
                lastUpdatedAt: now.toISOString(),
              }
            : reservation,
        ),
      };
    }

    case 'decline': {
      return {
        reservations: state.reservations.map((reservation) =>
          reservation.id === action.reservationId && reservation.status === 'pending'
            ? {
                ...reservation,
                status: 'declined',
                declineReason: action.reason,
                lastUpdatedAt: now.toISOString(),
              }
            : reservation,
        ),
      };
    }

    case 'cancel': {
      return {
        reservations: state.reservations.map((reservation) => {
          if (reservation.id !== action.reservationId) {
            return reservation;
          }
          if (reservation.status !== 'pending' && reservation.status !== 'approved') {
            return reservation;
          }
          // ADR-077: a pharmacy cancelling an approved reservation must
          // record an operational reason; a buyer cancelling needs none.
          if (action.by === 'pharmacy' && !action.reason?.trim()) {
            return reservation;
          }
          return {
            ...reservation,
            status: 'cancelled',
            cancelReason: action.reason,
            cancelledBy: action.by,
            lastUpdatedAt: now.toISOString(),
          };
        }),
      };
    }

    case 'expire': {
      return {
        reservations: state.reservations.map((reservation) =>
          reservation.id === action.reservationId && isReservationOverdue(reservation, now)
            ? { ...reservation, status: 'expired', lastUpdatedAt: now.toISOString() }
            : reservation,
        ),
      };
    }

    case 'mark_collected': {
      return {
        reservations: state.reservations.map((reservation) =>
          reservation.id === action.reservationId && reservation.status === 'approved'
            ? { ...reservation, status: 'collected', lastUpdatedAt: now.toISOString() }
            : reservation,
        ),
      };
    }

    case 'confirm_collected': {
      // ADR-087: buyer collection confirmation is feedback only and never
      // itself transitions the authoritative lifecycle state.
      return {
        reservations: state.reservations.map((reservation) =>
          reservation.id === action.reservationId && reservation.status === 'approved'
            ? {
                ...reservation,
                buyerConfirmedCollectedAt: now.toISOString(),
                lastUpdatedAt: now.toISOString(),
              }
            : reservation,
        ),
      };
    }

    default:
      return state;
  }
}
