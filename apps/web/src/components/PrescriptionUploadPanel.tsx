import * as React from 'react';

import { strings } from '../content/strings';
import { listLivePharmacyBranches } from '../pharmacy/syntheticPharmacy';
import {
  evaluatePrescriptionUpload,
  type PrescriptionRelationship,
  type SyntheticFileDescriptor,
  type SyntheticPrescription,
} from '../prescriptions/syntheticPrescriptions';

const RELATIONSHIP_LABEL: Record<PrescriptionRelationship, string> = {
  self: strings.reservationRelationshipSelfLabel,
  child: strings.reservationRelationshipChildLabel,
  dependent: strings.reservationRelationshipDependentLabel,
};

const FIELD_ERROR_TEXT: Record<string, string> = {
  patientName: strings.prescriptionUploadPatientNameError,
  unsupportedFileType: strings.prescriptionUploadFileTypeError,
  oversizedFile: strings.prescriptionUploadFileSizeError,
  legibilityNotConfirmed: strings.prescriptionUploadLegibilityError,
  consentNotConfirmed: strings.prescriptionUploadConsentError,
};

export interface PrescriptionUploadPanelProps {
  readonly buyerKey: string | null;
  readonly onUploadPrescription: (prescription: SyntheticPrescription) => void;
}

/**
 * The buyer-facing half of Milestone C's prescription simulation: selects
 * a verified pharmacy, captures only a file *descriptor* (name/size/type)
 * — the actual selected File is never read, stored or transmitted, only
 * used synchronously to build this descriptor and then discarded — and
 * runs it through the deterministic local scanner test double before
 * anything is added to state. No listing/medicine is attached, since the
 * buyer-search fixture contract (Task 2/Milestone A) has no
 * prescription-required category to attach one to; this is flagged as a
 * scope simplification in this slice's PR description.
 */
export function PrescriptionUploadPanel({
  buyerKey,
  onUploadPrescription,
}: PrescriptionUploadPanelProps) {
  const branches = listLivePharmacyBranches();
  const [branchId, setBranchId] = React.useState(branches[0]?.branchId ?? '');
  const [patientName, setPatientName] = React.useState('');
  const [relationship, setRelationship] = React.useState<PrescriptionRelationship>('self');
  const [file, setFile] = React.useState<SyntheticFileDescriptor | null>(null);
  const [legibilityConfirmed, setLegibilityConfirmed] = React.useState(false);
  const [consentConfirmed, setConsentConfirmed] = React.useState(false);
  const [errors, setErrors] = React.useState<readonly string[]>([]);
  const [unsafeFileError, setUnsafeFileError] = React.useState(false);
  const [justUploaded, setJustUploaded] = React.useState(false);

  if (buyerKey === null) {
    return <p className="reservation-panel__notice">{strings.reservationSignInPrompt}</p>;
  }
  // Re-bound to a new const so the non-null narrowing above is captured
  // explicitly — TypeScript does not carry parameter narrowing into a
  // nested function declaration defined further down this component.
  const signedInBuyerKey: string = buyerKey;

  const selectedBranch = branches.find((branch) => branch.branchId === branchId) ?? null;

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    setFile(
      selected ? { name: selected.name, sizeBytes: selected.size, mimeType: selected.type } : null,
    );
    // The actual File object is discarded here — it is never referenced
    // again after this synchronous handler returns.
    event.target.value = '';
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUnsafeFileError(false);

    if (!selectedBranch || !file) {
      setErrors(file ? [] : ['unsupportedFileType']);
      return;
    }

    const outcome = evaluatePrescriptionUpload(signedInBuyerKey, {
      branchId: selectedBranch.branchId,
      pharmacyDisplayName: selectedBranch.pharmacyDisplayName,
      patientName,
      relationship,
      file,
      legibilityConfirmed,
      consentConfirmed,
    });

    if (outcome.status === 'rejected_validation') {
      setErrors(outcome.errors);
      return;
    }
    setErrors([]);

    if (outcome.status === 'rejected_unsafe') {
      setUnsafeFileError(true);
      setFile(null);
      return;
    }

    onUploadPrescription(outcome.prescription);
    setJustUploaded(true);
  }

  if (justUploaded) {
    return (
      <p className="reservation-panel__notice" role="status">
        {strings.prescriptionUploadSuccessNotice}
      </p>
    );
  }

  return (
    <form className="auth-form reservation-panel" onSubmit={handleSubmit} noValidate>
      <h3 className="auth-form__title">{strings.prescriptionUploadTitle}</h3>
      <p className="auth-form__intro">{strings.prescriptionUploadIntro}</p>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor="prescription-branch">
          {strings.prescriptionUploadPharmacyLabel}
        </label>
        <select
          id="prescription-branch"
          value={branchId}
          onChange={(event) => setBranchId(event.target.value)}
        >
          {branches.map((branch) => (
            <option key={branch.branchId} value={branch.branchId}>
              {branch.pharmacyDisplayName}
            </option>
          ))}
        </select>
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor="prescription-patient">
          {strings.prescriptionUploadPatientNameLabel}
        </label>
        <input
          id="prescription-patient"
          className="auth-field__input"
          type="text"
          value={patientName}
          aria-invalid={errors.includes('patientName') ? true : undefined}
          onChange={(event) => setPatientName(event.target.value)}
        />
        {errors.includes('patientName') ? (
          <p className="auth-field__error" role="alert">
            {FIELD_ERROR_TEXT.patientName}
          </p>
        ) : null}
      </div>

      <fieldset className="auth-field">
        <legend className="auth-field__label">{strings.reservationRelationshipLabel}</legend>
        {(Object.keys(RELATIONSHIP_LABEL) as PrescriptionRelationship[]).map((value) => (
          <label key={value} className="reservation-panel__radio-option">
            <input
              type="radio"
              name="prescription-relationship"
              value={value}
              checked={relationship === value}
              onChange={() => setRelationship(value)}
            />
            {RELATIONSHIP_LABEL[value]}
          </label>
        ))}
      </fieldset>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor="prescription-file">
          {strings.prescriptionUploadFileLabel}
        </label>
        <input
          id="prescription-file"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.heic"
          onChange={handleFileChange}
        />
        <p className="auth-form__demo-hint">{strings.prescriptionUploadFileHint}</p>
        {file ? <p className="auth-form__demo-hint">{file.name}</p> : null}
        {errors.includes('unsupportedFileType') ? (
          <p className="auth-field__error" role="alert">
            {FIELD_ERROR_TEXT.unsupportedFileType}
          </p>
        ) : null}
        {errors.includes('oversizedFile') ? (
          <p className="auth-field__error" role="alert">
            {FIELD_ERROR_TEXT.oversizedFile}
          </p>
        ) : null}
        {unsafeFileError ? (
          <p className="auth-field__error" role="alert">
            {strings.prescriptionUploadUnsafeFileError}
          </p>
        ) : null}
      </div>

      <div className="auth-checkbox">
        <input
          id="prescription-legibility"
          type="checkbox"
          checked={legibilityConfirmed}
          onChange={(event) => setLegibilityConfirmed(event.target.checked)}
        />
        <label htmlFor="prescription-legibility">{strings.prescriptionUploadLegibilityLabel}</label>
        {errors.includes('legibilityNotConfirmed') ? (
          <p className="auth-field__error" role="alert">
            {FIELD_ERROR_TEXT.legibilityNotConfirmed}
          </p>
        ) : null}
      </div>

      <p className="auth-form__demo-hint">{strings.prescriptionUploadExpiryDisclosure}</p>
      <p className="auth-form__demo-hint">{strings.prescriptionUploadRetentionNotice}</p>

      <div className="auth-checkbox">
        <input
          id="prescription-consent"
          type="checkbox"
          checked={consentConfirmed}
          onChange={(event) => setConsentConfirmed(event.target.checked)}
        />
        <label htmlFor="prescription-consent">
          {selectedBranch
            ? strings.prescriptionUploadConsentLabel(selectedBranch.pharmacyDisplayName)
            : strings.prescriptionUploadConsentLabel('')}
        </label>
        {errors.includes('consentNotConfirmed') ? (
          <p className="auth-field__error" role="alert">
            {FIELD_ERROR_TEXT.consentNotConfirmed}
          </p>
        ) : null}
      </div>

      <button type="submit" className="auth-button auth-button--primary">
        {strings.prescriptionUploadSubmitLabel}
      </button>
    </form>
  );
}
