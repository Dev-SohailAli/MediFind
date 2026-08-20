import * as React from 'react';

import { strings } from '../content/strings';
import { validateSupportReport, type SupportReportCategory } from '../support/syntheticSupport';

export interface ReportFormProps {
  readonly triggerLabel: string;
  readonly category: SupportReportCategory;
  readonly targetListingId: string | null;
  readonly buyerKey: string;
  readonly onSubmitReport: (input: {
    category: SupportReportCategory;
    reportedBy: string;
    note: string;
    targetListingId: string | null;
  }) => void;
}

/**
 * The shared trigger-then-inline-form pattern behind every buyer report
 * entry point (design proposal: "privately report an inaccurate,
 * expired, misleading or unavailable listing", "Report suspicious
 * activity" in Account/security, "I couldn't find this medicine" on a
 * zero-result search) — never displayed publicly or sent anywhere except
 * into this prototype's local support/moderation state.
 */
export function ReportForm({
  triggerLabel,
  category,
  targetListingId,
  buyerKey,
  onSubmitReport,
}: ReportFormProps) {
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <p className="reservation-panel__notice" role="status">
        {strings.supportReportSuccessNotice}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        className="auth-button auth-button--secondary"
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateSupportReport({ note })) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmitReport({ category, reportedBy: buyerKey, note, targetListingId });
    setSubmitted(true);
  }

  return (
    <form className="auth-form reservation-panel" onSubmit={handleSubmit} noValidate>
      <div className="auth-field">
        <label
          className="auth-field__label"
          htmlFor={`report-note-${category}-${targetListingId ?? 'none'}`}
        >
          {strings.supportReportNoteLabel}
        </label>
        <input
          id={`report-note-${category}-${targetListingId ?? 'none'}`}
          className="auth-field__input"
          type="text"
          value={note}
          aria-invalid={showError ? true : undefined}
          onChange={(event) => setNote(event.target.value)}
        />
        {showError ? (
          <p className="auth-field__error" role="alert">
            {strings.supportReportNoteError}
          </p>
        ) : null}
      </div>
      <div className="auth-actions">
        <button type="submit" className="auth-button auth-button--primary">
          {strings.supportReportSubmitLabel}
        </button>
        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={() => setOpen(false)}
        >
          {strings.supportReportCancelLabel}
        </button>
      </div>
    </form>
  );
}
