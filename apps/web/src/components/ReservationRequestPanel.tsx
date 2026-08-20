import * as React from 'react';
import type { SyntheticSearchListing } from '@medifind/contracts';

import { strings } from '../content/strings';
import {
  findActiveReservationConflict,
  isReservationsSuspended,
  validateReservationRequest,
  type ReservationRelationship,
  type SyntheticReservation,
  type SyntheticReservationRequestInput,
} from '../reservations/syntheticReservations';

export interface ReservationRequestPanelProps {
  readonly listing: SyntheticSearchListing;
  readonly buyerKey: string | null;
  readonly reservations: readonly SyntheticReservation[];
  readonly onRequestReservation: (input: SyntheticReservationRequestInput) => void;
}

const RELATIONSHIP_LABEL: Record<ReservationRelationship, string> = {
  self: strings.reservationRelationshipSelfLabel,
  child: strings.reservationRelationshipChildLabel,
  dependent: strings.reservationRelationshipDependentLabel,
};

/**
 * The buyer-facing half of Milestone C's OTC reservation simulation
 * (ADR-006/ADR-043): a request form mounted directly in the read-only
 * `ResultDetailSheet`, rather than a second stacked confirmation-sheet
 * dialog, since nesting a modal inside an already-open modal adds
 * complexity without changing what is actually confirmed here — see the
 * PR description for this documented simplification.
 */
export function ReservationRequestPanel({
  listing,
  buyerKey,
  reservations,
  onRequestReservation,
}: ReservationRequestPanelProps) {
  const [patientName, setPatientName] = React.useState('');
  const [relationship, setRelationship] = React.useState<ReservationRelationship>('self');
  const [showNameError, setShowNameError] = React.useState(false);
  const [justRequested, setJustRequested] = React.useState(false);

  if (listing.availability === 'unavailable') {
    return <p className="reservation-panel__notice">{strings.reservationUnavailableNotice}</p>;
  }

  if (buyerKey === null) {
    return <p className="reservation-panel__notice">{strings.reservationSignInPrompt}</p>;
  }

  if (isReservationsSuspended(reservations, buyerKey)) {
    return <p className="reservation-panel__notice">{strings.reservationSuspendedNotice}</p>;
  }

  if (justRequested) {
    return (
      <p className="reservation-panel__notice" role="status">
        {strings.reservationSuccessNotice}
      </p>
    );
  }

  const conflict = findActiveReservationConflict(
    reservations,
    buyerKey,
    listing.id,
    patientName,
    relationship,
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input: SyntheticReservationRequestInput = {
      listingId: listing.id,
      branchId: null,
      medicineDisplayName: listing.medicineDisplayName,
      pharmacyDisplayName: listing.pharmacyDisplayName,
      requestedPriceFjdMinor: listing.priceFjdMinor,
      patientName,
      relationship,
    };

    if (validateReservationRequest(input).length > 0) {
      setShowNameError(true);
      return;
    }
    setShowNameError(false);
    if (conflict) {
      return;
    }

    onRequestReservation(input);
    setJustRequested(true);
  }

  return (
    <form className="auth-form reservation-panel" onSubmit={handleSubmit} noValidate>
      <h3 className="auth-form__title">{strings.reservationRequestTitle}</h3>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`reservation-patient-${listing.id}`}>
          {strings.reservationPatientNameLabel}
        </label>
        <input
          id={`reservation-patient-${listing.id}`}
          className="auth-field__input"
          type="text"
          value={patientName}
          aria-invalid={showNameError ? true : undefined}
          onChange={(event) => setPatientName(event.target.value)}
        />
        {showNameError ? (
          <p className="auth-field__error" role="alert">
            {strings.reservationPatientNameError}
          </p>
        ) : null}
      </div>

      <fieldset className="auth-field">
        <legend className="auth-field__label">{strings.reservationRelationshipLabel}</legend>
        {(Object.keys(RELATIONSHIP_LABEL) as ReservationRelationship[]).map((value) => (
          <label key={value} className="reservation-panel__radio-option">
            <input
              type="radio"
              name={`reservation-relationship-${listing.id}`}
              value={value}
              checked={relationship === value}
              onChange={() => setRelationship(value)}
            />
            {RELATIONSHIP_LABEL[value]}
          </label>
        ))}
      </fieldset>

      {conflict ? (
        <p className="auth-field__error" role="alert">
          {strings.reservationConflictNotice}
        </p>
      ) : null}

      <p className="safety-block__text">{strings.safetyReservationNoGuarantee}</p>

      <button type="submit" className="auth-button auth-button--primary">
        {strings.reservationSubmitLabel}
      </button>
    </form>
  );
}
