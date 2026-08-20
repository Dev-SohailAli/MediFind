import * as React from 'react';
import { CircleCheck, CircleCheckBig, CircleAlert, Clock, Info } from 'lucide-react';

import { strings } from '../content/strings';
import {
  deriveNotifications,
  derivePrescriptionNotifications,
  type NotificationOptInAction,
  type NotificationOptInStatus,
  type NotificationReadAction,
  type NotificationReadState,
} from '../notifications/syntheticNotifications';
import {
  isPrescriptionOverdue,
  type PrescriptionStatus,
  type SyntheticPrescription,
  type SyntheticPrescriptionsAction,
} from '../prescriptions/syntheticPrescriptions';
import {
  isReservationOverdue,
  type ReservationStatus,
  type SyntheticReservation,
  type SyntheticReservationsAction,
} from '../reservations/syntheticReservations';
import { formatFjd } from '../search/format';
import { NotificationCenter } from './NotificationCenter';
import { PrescriptionUploadPanel } from './PrescriptionUploadPanel';
import { StatusBadge, type BadgeTone } from './StatusBadge';

const PRESCRIPTION_STATUS_LABEL: Record<PrescriptionStatus, string> = {
  under_review: strings.prescriptionStatusUnderReviewLabel,
  approved: strings.prescriptionStatusApprovedLabel,
  rejected: strings.prescriptionStatusRejectedLabel,
  expired: strings.prescriptionStatusExpiredLabel,
  cancelled: strings.prescriptionStatusCancelledLabel,
};

const PRESCRIPTION_STATUS_TONE: Record<PrescriptionStatus, BadgeTone> = {
  under_review: 'info',
  approved: 'success',
  rejected: 'danger',
  expired: 'neutral',
  cancelled: 'neutral',
};

const PRESCRIPTION_REJECT_REASON_LABEL: Record<string, string> = {
  illegible: strings.prescriptionRejectReasonIllegibleLabel,
  incomplete_information: strings.prescriptionRejectReasonIncompleteLabel,
  suspected_duplicate: strings.prescriptionRejectReasonDuplicateLabel,
  invalid_prescription: strings.prescriptionRejectReasonInvalidLabel,
  other: strings.prescriptionRejectReasonOtherLabel,
};

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: strings.reservationStatusPendingLabel,
  approved: strings.reservationStatusApprovedLabel,
  declined: strings.reservationStatusDeclinedLabel,
  expired: strings.reservationStatusExpiredLabel,
  cancelled: strings.reservationStatusCancelledLabel,
  collected: strings.reservationStatusCollectedLabel,
};

const STATUS_TONE: Record<ReservationStatus, BadgeTone> = {
  pending: 'info',
  approved: 'success',
  declined: 'danger',
  expired: 'neutral',
  cancelled: 'neutral',
  collected: 'success',
};

// `collected` reuses the `approved` glyph's tone but a visually distinct
// double-check icon, per §8 of the design proposal's founder decisions.
const STATUS_ICON: Record<ReservationStatus, typeof Info> = {
  pending: Info,
  approved: CircleCheck,
  declined: CircleAlert,
  expired: Clock,
  cancelled: Clock,
  collected: CircleCheckBig,
};

const PRESCRIPTION_STATUS_ICON: Record<PrescriptionStatus, typeof Info> = {
  under_review: Info,
  approved: CircleCheck,
  rejected: CircleAlert,
  expired: Clock,
  cancelled: Clock,
};

interface ReservationRowProps {
  readonly reservation: SyntheticReservation;
  readonly dispatch: React.Dispatch<SyntheticReservationsAction>;
}

function ReservationRow({ reservation, dispatch }: ReservationRowProps) {
  const overdue = isReservationOverdue(reservation);

  return (
    <li className="reservation-row">
      <div className="reservation-row__header">
        <p className="reservation-row__name">{reservation.medicineDisplayName}</p>
        <StatusBadge
          label={STATUS_LABEL[reservation.status]}
          tone={STATUS_TONE[reservation.status]}
          icon={STATUS_ICON[reservation.status]}
        />
      </div>
      <p className="reservation-row__details">
        {reservation.pharmacyDisplayName} · {reservation.patientName}
      </p>

      {reservation.status === 'approved' || reservation.status === 'collected' ? (
        <p className="reservation-row__details">
          {strings.reservationConfirmedPricePrefix}:{' '}
          {formatFjd(reservation.confirmedPriceFjdMinor ?? 0)}
          {reservation.pickupInstructions
            ? ` · ${strings.reservationPickupInstructionsPrefix}: ${reservation.pickupInstructions}`
            : ''}
          {reservation.expiresAt
            ? ` · ${strings.reservationExpiresPrefix}: ${new Date(reservation.expiresAt).toLocaleString()}`
            : ''}
        </p>
      ) : null}

      {reservation.status === 'declined' && reservation.declineReason ? (
        <p className="reservation-row__details">
          {strings.reservationDeclineReasonPrefix}: {reservation.declineReason}
        </p>
      ) : null}

      {reservation.status === 'cancelled' ? (
        <p className="reservation-row__details">
          {reservation.cancelledBy === 'pharmacy'
            ? strings.reservationCancelledByPharmacyPrefix
            : strings.reservationCancelledByBuyerPrefix}
          {reservation.cancelReason ? `: ${reservation.cancelReason}` : ''}
        </p>
      ) : null}

      {reservation.buyerConfirmedCollectedAt ? (
        <p className="reservation-row__details">{strings.requestsConfirmedCollectedNote}</p>
      ) : null}

      <div className="auth-actions">
        {reservation.status === 'pending' ? (
          <button
            type="button"
            className="auth-button auth-button--secondary"
            onClick={() =>
              dispatch({ type: 'cancel', reservationId: reservation.id, by: 'buyer', reason: null })
            }
          >
            {strings.requestsCancelLabel}
          </button>
        ) : null}
        {reservation.status === 'approved' && !overdue ? (
          <>
            <button
              type="button"
              className="auth-button auth-button--secondary"
              onClick={() => dispatch({ type: 'confirm_collected', reservationId: reservation.id })}
            >
              {strings.requestsConfirmCollectedLabel}
            </button>
            <button
              type="button"
              className="auth-button auth-button--secondary"
              onClick={() =>
                dispatch({
                  type: 'cancel',
                  reservationId: reservation.id,
                  by: 'buyer',
                  reason: null,
                })
              }
            >
              {strings.requestsNoLongerNeededLabel}
            </button>
          </>
        ) : null}
      </div>
    </li>
  );
}

interface PrescriptionRowProps {
  readonly prescription: SyntheticPrescription;
  readonly dispatch: React.Dispatch<SyntheticPrescriptionsAction>;
}

function PrescriptionRow({ prescription, dispatch }: PrescriptionRowProps) {
  return (
    <li className="reservation-row">
      <div className="reservation-row__header">
        <p className="reservation-row__name">{prescription.pharmacyDisplayName}</p>
        <StatusBadge
          label={PRESCRIPTION_STATUS_LABEL[prescription.status]}
          tone={PRESCRIPTION_STATUS_TONE[prescription.status]}
          icon={PRESCRIPTION_STATUS_ICON[prescription.status]}
        />
      </div>
      <p className="reservation-row__details">{prescription.patientName}</p>

      {prescription.status === 'approved' ? (
        <p className="reservation-row__details">{strings.prescriptionApprovedNote}</p>
      ) : null}

      {prescription.status === 'rejected' && prescription.rejectReason ? (
        <p className="reservation-row__details">
          {strings.prescriptionRejectedReasonPrefix}:{' '}
          {PRESCRIPTION_REJECT_REASON_LABEL[prescription.rejectReason]}
        </p>
      ) : null}

      {prescription.status === 'under_review' ? (
        <div className="auth-actions">
          <button
            type="button"
            className="auth-button auth-button--secondary"
            onClick={() => dispatch({ type: 'cancel', prescriptionId: prescription.id })}
          >
            {strings.prescriptionCancelLabel}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export interface RequestsScreenProps {
  readonly buyerKey: string | null;
  readonly reservations: readonly SyntheticReservation[];
  readonly dispatch: React.Dispatch<SyntheticReservationsAction>;
  readonly prescriptions: readonly SyntheticPrescription[];
  readonly prescriptionsDispatch: React.Dispatch<SyntheticPrescriptionsAction>;
  readonly onNavigateToAccount: () => void;
  readonly notificationReadState: NotificationReadState;
  readonly notificationReadDispatch: React.Dispatch<NotificationReadAction>;
  readonly notificationOptInStatus: NotificationOptInStatus;
  readonly notificationOptInDispatch: React.Dispatch<NotificationOptInAction>;
}

/**
 * Buyer-facing single timeline for reservation and prescription status
 * (design proposal §5.1 Requests), plus the generic notification feed
 * derived from that same status and the prescription upload entry point.
 * Replaces the Requests tab's `PrototypePlaceholder` for a signed-in
 * buyer. Reservations and prescriptions are shown as two separate lists
 * rather than one merged/segmented timeline (design's All/Prescriptions/
 * Reservations tabs) — a documented simplification, since the two remain
 * genuinely distinct entities with no shared identity to sort together
 * meaningfully in this prototype.
 */
export function RequestsScreen({
  buyerKey,
  reservations,
  dispatch,
  prescriptions,
  prescriptionsDispatch,
  onNavigateToAccount,
  notificationReadState,
  notificationReadDispatch,
  notificationOptInStatus,
  notificationOptInDispatch,
}: RequestsScreenProps) {
  if (buyerKey === null) {
    return (
      <div className="state-block">
        <p className="state-block__title">{strings.requestsSignInRequiredTitle}</p>
        <p className="state-block__body">{strings.requestsSignInRequiredBody}</p>
        <button
          type="button"
          className="auth-button auth-button--primary"
          onClick={onNavigateToAccount}
        >
          {strings.requestsSignInRequiredAction}
        </button>
      </div>
    );
  }

  const own = reservations
    .filter((reservation) => reservation.buyerKey === buyerKey)
    .slice()
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));

  const ownPrescriptions = prescriptions
    .filter((prescription) => prescription.buyerKey === buyerKey)
    .slice()
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  const overdueReservationIds = own
    .filter((reservation) => isReservationOverdue(reservation))
    .map((reservation) => reservation.id);
  const overduePrescriptionIds = ownPrescriptions
    .filter((prescription) => isPrescriptionOverdue(prescription))
    .map((prescription) => prescription.id);

  const notifications = [
    ...deriveNotifications(reservations, buyerKey),
    ...derivePrescriptionNotifications(prescriptions, buyerKey),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function handleRefresh() {
    for (const id of overdueReservationIds) {
      dispatch({ type: 'expire', reservationId: id });
    }
    for (const id of overduePrescriptionIds) {
      prescriptionsDispatch({ type: 'expire', prescriptionId: id });
    }
    notificationReadDispatch({
      type: 'mark_all_read',
      ids: notifications.map((notification) => notification.id),
    });
  }

  return (
    <section className="screen" aria-labelledby="requests-title">
      <h1 id="requests-title" className="sr-only">
        {strings.requestsTitle}
      </h1>
      <p className="requests__intro">{strings.requestsIntro}</p>

      <NotificationCenter
        notifications={notifications}
        readState={notificationReadState}
        readDispatch={notificationReadDispatch}
        optInStatus={notificationOptInStatus}
        optInDispatch={notificationOptInDispatch}
      />

      <button type="button" className="auth-button auth-button--secondary" onClick={handleRefresh}>
        {strings.requestsRefreshLabel}
      </button>

      {own.length === 0 && ownPrescriptions.length === 0 ? (
        <div className="state-block">
          <p className="state-block__title">{strings.requestsEmptyTitle}</p>
          <p className="state-block__body">{strings.requestsEmptyBody}</p>
        </div>
      ) : (
        <ul className="reservation-list">
          {own.map((reservation) => (
            <ReservationRow key={reservation.id} reservation={reservation} dispatch={dispatch} />
          ))}
          {ownPrescriptions.map((prescription) => (
            <PrescriptionRow
              key={prescription.id}
              prescription={prescription}
              dispatch={prescriptionsDispatch}
            />
          ))}
        </ul>
      )}

      <PrescriptionUploadPanel
        buyerKey={buyerKey}
        onUploadPrescription={(prescription) =>
          prescriptionsDispatch({ type: 'create', prescription })
        }
      />
    </section>
  );
}
