import * as React from 'react';
import { CircleCheck, CircleCheckBig, CircleAlert, Clock, Info } from 'lucide-react';

import { strings } from '../content/strings';
import {
  deriveNotifications,
  type NotificationOptInAction,
  type NotificationOptInStatus,
  type NotificationReadAction,
  type NotificationReadState,
} from '../notifications/syntheticNotifications';
import {
  isReservationOverdue,
  type ReservationStatus,
  type SyntheticReservation,
  type SyntheticReservationsAction,
} from '../reservations/syntheticReservations';
import { formatFjd } from '../search/format';
import { NotificationCenter } from './NotificationCenter';
import { StatusBadge, type BadgeTone } from './StatusBadge';

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

export interface RequestsScreenProps {
  readonly buyerKey: string | null;
  readonly reservations: readonly SyntheticReservation[];
  readonly dispatch: React.Dispatch<SyntheticReservationsAction>;
  readonly onNavigateToAccount: () => void;
  readonly notificationReadState: NotificationReadState;
  readonly notificationReadDispatch: React.Dispatch<NotificationReadAction>;
  readonly notificationOptInStatus: NotificationOptInStatus;
  readonly notificationOptInDispatch: React.Dispatch<NotificationOptInAction>;
}

/**
 * Buyer-facing single timeline for reservation status (design proposal
 * §5.1 Requests, narrowed to reservations only — prescription entries join
 * this same screen in a later Milestone C slice), plus the generic
 * notification feed derived from that same status. Replaces the Requests
 * tab's `PrototypePlaceholder` for a signed-in buyer.
 */
export function RequestsScreen({
  buyerKey,
  reservations,
  dispatch,
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

  const overdueIds = own
    .filter((reservation) => isReservationOverdue(reservation))
    .map((reservation) => reservation.id);

  const notifications = deriveNotifications(reservations, buyerKey);

  function handleRefresh() {
    for (const id of overdueIds) {
      dispatch({ type: 'expire', reservationId: id });
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

      {own.length === 0 ? (
        <div className="state-block">
          <p className="state-block__title">{strings.requestsEmptyTitle}</p>
          <p className="state-block__body">{strings.requestsEmptyBody}</p>
        </div>
      ) : (
        <ul className="reservation-list">
          {own.map((reservation) => (
            <ReservationRow key={reservation.id} reservation={reservation} dispatch={dispatch} />
          ))}
        </ul>
      )}
    </section>
  );
}
