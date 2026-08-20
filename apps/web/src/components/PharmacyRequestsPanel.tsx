import * as React from 'react';

import { strings } from '../content/strings';
import {
  type PrescriptionRejectReason,
  type SyntheticPrescription,
  type SyntheticPrescriptionsAction,
} from '../prescriptions/syntheticPrescriptions';
import {
  RESERVATION_DEFAULT_EXPIRY_HOURS,
  type SyntheticReservation,
  type SyntheticReservationsAction,
} from '../reservations/syntheticReservations';
import { formatFjd } from '../search/format';

const REJECT_REASON_LABEL: Record<PrescriptionRejectReason, string> = {
  illegible: strings.prescriptionRejectReasonIllegibleLabel,
  incomplete_information: strings.prescriptionRejectReasonIncompleteLabel,
  suspected_duplicate: strings.prescriptionRejectReasonDuplicateLabel,
  invalid_prescription: strings.prescriptionRejectReasonInvalidLabel,
  other: strings.prescriptionRejectReasonOtherLabel,
};

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

interface PrescriptionDecisionFormProps {
  readonly prescription: SyntheticPrescription;
  readonly dispatch: React.Dispatch<SyntheticPrescriptionsAction>;
}

function PrescriptionDecisionForm({ prescription, dispatch }: PrescriptionDecisionFormProps) {
  const [reason, setReason] = React.useState<PrescriptionRejectReason>('illegible');

  return (
    <div className="reservation-approve-form">
      <p className="reservation-row__details">{strings.pharmacyPrescriptionsDecisionSafetyNote}</p>
      <button
        type="button"
        className="auth-button auth-button--primary"
        onClick={() => dispatch({ type: 'approve', prescriptionId: prescription.id })}
      >
        {strings.pharmacyPrescriptionsApproveLabel}
      </button>

      <label className="sr-only" htmlFor={`reject-reason-${prescription.id}`}>
        {strings.pharmacyPrescriptionsRejectReasonLabel}
      </label>
      <select
        id={`reject-reason-${prescription.id}`}
        value={reason}
        onChange={(event) => setReason(event.target.value as PrescriptionRejectReason)}
      >
        {(Object.keys(REJECT_REASON_LABEL) as PrescriptionRejectReason[]).map((value) => (
          <option key={value} value={value}>
            {REJECT_REASON_LABEL[value]}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="auth-button auth-button--secondary"
        onClick={() => dispatch({ type: 'reject', prescriptionId: prescription.id, reason })}
      >
        {strings.pharmacyPrescriptionsRejectLabel}
      </button>
    </div>
  );
}

interface PharmacyPrescriptionRowProps {
  readonly prescription: SyntheticPrescription;
  readonly dispatch: React.Dispatch<SyntheticPrescriptionsAction>;
}

/**
 * Every prescription row starts behind a fresh per-row confirmation gate
 * (design proposal §5.2 Prescription review: "fresh biometric/MFA
 * interstitial — always, even mid-session"). This is a synthetic stand-in
 * only — no real authentication happens, and it always resets when the
 * row remounts, never persisting an "already confirmed" state across a
 * page reload or panel close/reopen.
 */
function PharmacyPrescriptionRow({ prescription, dispatch }: PharmacyPrescriptionRowProps) {
  const [unlocked, setUnlocked] = React.useState(false);

  return (
    <li className="reservation-row">
      <div className="reservation-row__header">
        <p className="reservation-row__name">{prescription.patientName}</p>
        <span className="status-badge status-badge--neutral">{prescription.status}</span>
      </div>
      <p className="reservation-row__details">
        {prescription.pharmacyDisplayName} · {prescription.relationship}
      </p>

      {prescription.status !== 'under_review' ? null : !unlocked ? (
        <div className="reservation-approve-form">
          <p className="reservation-row__details">{strings.pharmacyPrescriptionsMfaGateBody}</p>
          <button
            type="button"
            className="auth-button auth-button--secondary"
            onClick={() => setUnlocked(true)}
          >
            {strings.pharmacyPrescriptionsMfaGateConfirmLabel}
          </button>
        </div>
      ) : (
        <>
          {prescription.quarantined ? (
            <p className="reservation-row__details">
              {strings.pharmacyPrescriptionsQuarantineBanner}
            </p>
          ) : null}
          <p className="reservation-row__details">{strings.pharmacyPrescriptionsFileNotice}</p>
          <PrescriptionDecisionForm prescription={prescription} dispatch={dispatch} />
        </>
      )}
    </li>
  );
}

export interface PharmacyRequestsPanelProps {
  readonly branchId: string;
  readonly reservations: readonly SyntheticReservation[];
  readonly dispatch: React.Dispatch<SyntheticReservationsAction>;
  readonly prescriptions: readonly SyntheticPrescription[];
  readonly prescriptionsDispatch: React.Dispatch<SyntheticPrescriptionsAction>;
}

/**
 * Branch-scoped OTC + prescription queue (design proposal §5.2 Requests
 * (pharmacy)). Deliberately a single flat list rather than the design's
 * New/In progress/All filter tabs, and skips the SLA-breach highlight
 * state: both are additive UI polish this slice leaves out to keep the
 * reservation/prescription state machines themselves the focus.
 */
export function PharmacyRequestsPanel({
  branchId,
  reservations,
  dispatch,
  prescriptions,
  prescriptionsDispatch,
}: PharmacyRequestsPanelProps) {
  const branchReservations = reservations
    .filter((reservation) => reservation.branchId === branchId)
    .slice()
    .sort((a, b) => a.requestedAt.localeCompare(b.requestedAt));
  const branchPrescriptions = prescriptions
    .filter((prescription) => prescription.branchId === branchId)
    .slice()
    .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));

  if (branchReservations.length === 0 && branchPrescriptions.length === 0) {
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
      {branchPrescriptions.map((prescription) => (
        <PharmacyPrescriptionRow
          key={prescription.id}
          prescription={prescription}
          dispatch={prescriptionsDispatch}
        />
      ))}
    </ul>
  );
}
