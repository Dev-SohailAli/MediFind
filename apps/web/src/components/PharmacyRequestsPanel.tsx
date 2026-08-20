import * as React from 'react';

import { strings } from '../content/strings';
import {
  RESERVATION_DEFAULT_EXPIRY_HOURS,
  type SyntheticReservation,
  type SyntheticReservationsAction,
} from '../reservations/syntheticReservations';
import { formatFjd } from '../search/format';

interface ApproveFormProps {
  readonly reservation: SyntheticReservation;
  readonly dispatch: React.Dispatch<SyntheticReservationsAction>;
}

function ApproveForm({ reservation, dispatch }: ApproveFormProps) {
  const [priceText, setPriceText] = React.useState(
    String(reservation.requestedPriceFjdMinor / 100),
  );
  const [pickupInstructions, setPickupInstructions] = React.useState('');
  const [expiryHours, setExpiryHours] = React.useState(String(RESERVATION_DEFAULT_EXPIRY_HOURS));
  const [declineReason, setDeclineReason] = React.useState('');

  function handleApprove(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const priceMajor = Number(priceText);
    const hours = Number(expiryHours);
    if (!Number.isFinite(priceMajor) || priceMajor <= 0 || !Number.isFinite(hours) || hours <= 0) {
      return;
    }
    dispatch({
      type: 'approve',
      reservationId: reservation.id,
      confirmedPriceFjdMinor: Math.round(priceMajor * 100),
      pickupInstructions,
      expiresAt: new Date(Date.now() + hours * 60 * 60_000).toISOString(),
    });
  }

  return (
    <form className="reservation-approve-form" onSubmit={handleApprove}>
      <label className="sr-only" htmlFor={`confirmed-price-${reservation.id}`}>
        {strings.pharmacyRequestsConfirmedPriceLabel}
      </label>
      <input
        id={`confirmed-price-${reservation.id}`}
        type="number"
        min="0.01"
        step="0.01"
        value={priceText}
        onChange={(event) => setPriceText(event.target.value)}
        placeholder={strings.pharmacyRequestsConfirmedPriceLabel}
      />
      <label className="sr-only" htmlFor={`pickup-instructions-${reservation.id}`}>
        {strings.pharmacyRequestsPickupInstructionsLabel}
      </label>
      <input
        id={`pickup-instructions-${reservation.id}`}
        type="text"
        value={pickupInstructions}
        onChange={(event) => setPickupInstructions(event.target.value)}
        placeholder={strings.pharmacyRequestsPickupInstructionsLabel}
      />
      <label className="sr-only" htmlFor={`expiry-hours-${reservation.id}`}>
        {strings.pharmacyRequestsExpiryHoursLabel}
      </label>
      <input
        id={`expiry-hours-${reservation.id}`}
        type="number"
        min="1"
        step="1"
        value={expiryHours}
        onChange={(event) => setExpiryHours(event.target.value)}
        placeholder={strings.pharmacyRequestsExpiryHoursLabel}
      />
      <button type="submit" className="auth-button auth-button--primary">
        {strings.pharmacyRequestsApproveLabel}
      </button>

      <label className="sr-only" htmlFor={`decline-reason-${reservation.id}`}>
        {strings.pharmacyRequestsDeclineReasonLabel}
      </label>
      <input
        id={`decline-reason-${reservation.id}`}
        type="text"
        value={declineReason}
        onChange={(event) => setDeclineReason(event.target.value)}
        placeholder={strings.pharmacyRequestsDeclineReasonLabel}
      />
      <button
        type="button"
        className="auth-button auth-button--secondary"
        onClick={() =>
          dispatch({
            type: 'decline',
            reservationId: reservation.id,
            reason: declineReason.trim() || null,
          })
        }
      >
        {strings.pharmacyRequestsDeclineLabel}
      </button>
    </form>
  );
}

function CancelApprovedForm({ reservation, dispatch }: ApproveFormProps) {
  const [reason, setReason] = React.useState('');
  const [showError, setShowError] = React.useState(false);

  function handleCancel() {
    if (!reason.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    dispatch({ type: 'cancel', reservationId: reservation.id, by: 'pharmacy', reason });
  }

  return (
    <div className="reservation-approve-form">
      <label className="sr-only" htmlFor={`cancel-reason-${reservation.id}`}>
        {strings.pharmacyRequestsCancelReasonLabel}
      </label>
      <input
        id={`cancel-reason-${reservation.id}`}
        type="text"
        value={reason}
        aria-invalid={showError ? true : undefined}
        onChange={(event) => setReason(event.target.value)}
        placeholder={strings.pharmacyRequestsCancelReasonLabel}
      />
      {showError ? (
        <p className="auth-field__error" role="alert">
          {strings.pharmacyRequestsCancelReasonError}
        </p>
      ) : null}
      <div className="auth-actions">
        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={() => dispatch({ type: 'mark_collected', reservationId: reservation.id })}
        >
          {strings.pharmacyRequestsMarkCollectedLabel}
        </button>
        <button type="button" className="auth-button auth-button--secondary" onClick={handleCancel}>
          {strings.pharmacyRequestsCancelLabel}
        </button>
      </div>
    </div>
  );
}

interface PharmacyReservationRowProps {
  readonly reservation: SyntheticReservation;
  readonly dispatch: React.Dispatch<SyntheticReservationsAction>;
}

function PharmacyReservationRow({ reservation, dispatch }: PharmacyReservationRowProps) {
  return (
    <li className="reservation-row">
      <div className="reservation-row__header">
        <p className="reservation-row__name">{reservation.medicineDisplayName}</p>
        <span className="status-badge status-badge--neutral">{reservation.status}</span>
      </div>
      <p className="reservation-row__details">
        {reservation.patientName} ({reservation.relationship}) ·{' '}
        {formatFjd(reservation.requestedPriceFjdMinor)}
      </p>

      {reservation.status === 'pending' ? (
        <ApproveForm reservation={reservation} dispatch={dispatch} />
      ) : null}
      {reservation.status === 'approved' ? (
        <CancelApprovedForm reservation={reservation} dispatch={dispatch} />
      ) : null}
    </li>
  );
}

export interface PharmacyRequestsPanelProps {
  readonly branchId: string;
  readonly reservations: readonly SyntheticReservation[];
  readonly dispatch: React.Dispatch<SyntheticReservationsAction>;
}

/**
 * Branch-scoped OTC reservation queue (design proposal §5.2 Requests
 * (pharmacy), reservation handling only — the prescription half of this
 * queue is a later Milestone C slice). Deliberately a single flat list
 * rather than the design's New/In progress/All filter tabs, and skips the
 * SLA-breach highlight state: both are additive UI polish this slice
 * leaves out to keep the reservation state-machine work itself the focus.
 */
export function PharmacyRequestsPanel({
  branchId,
  reservations,
  dispatch,
}: PharmacyRequestsPanelProps) {
  const branchReservations = reservations
    .filter((reservation) => reservation.branchId === branchId)
    .slice()
    .sort((a, b) => a.requestedAt.localeCompare(b.requestedAt));

  if (branchReservations.length === 0) {
    return <p className="state-block__title">{strings.pharmacyRequestsEmpty}</p>;
  }

  return (
    <ul className="reservation-list">
      {branchReservations.map((reservation) => (
        <PharmacyReservationRow
          key={reservation.id}
          reservation={reservation}
          dispatch={dispatch}
        />
      ))}
    </ul>
  );
}
