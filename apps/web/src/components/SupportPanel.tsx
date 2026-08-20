import * as React from 'react';
import { CircleAlert, CircleCheck, Clock, Info } from 'lucide-react';

import { strings } from '../content/strings';
import type { SyntheticPrescription } from '../prescriptions/syntheticPrescriptions';
import type { SyntheticReservation } from '../reservations/syntheticReservations';
import {
  deriveAuditEvents,
  type SupportAction,
  type SupportReportCategory,
  type SupportReportStatus,
  type SyntheticSupportReport,
} from '../support/syntheticSupport';
import { StatusBadge, type BadgeTone } from './StatusBadge';

const CATEGORY_LABEL: Record<SupportReportCategory, string> = {
  listing_quality: strings.supportReportCategoryListingQualityLabel,
  suspicious_activity: strings.supportReportCategorySuspiciousActivityLabel,
  support_case: strings.supportReportCategorySupportCaseLabel,
  cant_find_medicine: strings.supportReportCategoryCantFindMedicineLabel,
};

const STATUS_LABEL: Record<SupportReportStatus, string> = {
  open: strings.supportReportStatusOpenLabel,
  resolved: strings.supportReportStatusResolvedLabel,
  escalated: strings.supportReportStatusEscalatedLabel,
  deferred: strings.supportReportStatusDeferredLabel,
};

const STATUS_TONE: Record<SupportReportStatus, BadgeTone> = {
  open: 'info',
  resolved: 'success',
  escalated: 'warning',
  deferred: 'neutral',
};

const STATUS_ICON: Record<SupportReportStatus, typeof Info> = {
  open: Info,
  resolved: CircleCheck,
  escalated: CircleAlert,
  deferred: Clock,
};

interface ReportRowProps {
  readonly report: SyntheticSupportReport;
  readonly dispatch: React.Dispatch<SupportAction>;
}

function ReportRow({ report, dispatch }: ReportRowProps) {
  const [resolutionNote, setResolutionNote] = React.useState('');
  const [showError, setShowError] = React.useState(false);

  function handleResolve() {
    if (!resolutionNote.trim()) {
      setShowError(true);
      return;
    }
    setShowError(false);
    dispatch({ type: 'resolve', reportId: report.id, resolutionNote });
  }

  return (
    <li className="reservation-row">
      <div className="reservation-row__header">
        <p className="reservation-row__name">{CATEGORY_LABEL[report.category]}</p>
        <StatusBadge
          label={STATUS_LABEL[report.status]}
          tone={STATUS_TONE[report.status]}
          icon={STATUS_ICON[report.status]}
        />
      </div>
      <p className="reservation-row__details">{report.note}</p>
      {report.resolutionNote ? (
        <p className="reservation-row__details">
          {strings.supportResolutionNotePrefix}: {report.resolutionNote}
        </p>
      ) : null}

      {report.status === 'open' ? (
        <div className="reservation-approve-form">
          <label className="sr-only" htmlFor={`resolution-note-${report.id}`}>
            {strings.supportResolveNoteLabel}
          </label>
          <input
            id={`resolution-note-${report.id}`}
            type="text"
            value={resolutionNote}
            aria-invalid={showError ? true : undefined}
            onChange={(event) => setResolutionNote(event.target.value)}
            placeholder={strings.supportResolveNoteLabel}
          />
          {showError ? (
            <p className="auth-field__error" role="alert">
              {strings.supportResolveNoteError}
            </p>
          ) : null}
          <div className="auth-actions">
            <button
              type="button"
              className="auth-button auth-button--primary"
              onClick={handleResolve}
            >
              {strings.supportResolveLabel}
            </button>
            <button
              type="button"
              className="auth-button auth-button--secondary"
              onClick={() => dispatch({ type: 'escalate', reportId: report.id })}
            >
              {strings.supportEscalateLabel}
            </button>
            <button
              type="button"
              className="auth-button auth-button--secondary"
              onClick={() => dispatch({ type: 'defer', reportId: report.id })}
            >
              {strings.supportDeferLabel}
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export interface SupportPanelProps {
  readonly reports: readonly SyntheticSupportReport[];
  readonly dispatch: React.Dispatch<SupportAction>;
  readonly reservations: readonly SyntheticReservation[];
  readonly prescriptions: readonly SyntheticPrescription[];
}

/**
 * Reached from Account, alongside the pharmacy-workspace section (design
 * proposal §5.3 Reports + Audit view, simplified from separate admin
 * tabs into one inline demo section — the same simplification pattern
 * PharmacyWorkspaces already uses). A single flat report list rather
 * than the design's Listing reports/Suspicious activity/Support tabs,
 * and the audit view merges the admin and pharmacy-owner variants into
 * one redacted feed rather than two scoped ones — both documented
 * simplifications.
 */
export function SupportPanel({
  reports,
  dispatch,
  reservations,
  prescriptions,
}: SupportPanelProps) {
  const auditEvents = deriveAuditEvents(reservations, prescriptions);

  return (
    <section className="workspaces" aria-labelledby="support-panel-title">
      <h2 id="support-panel-title" className="workspaces__title">
        {strings.supportPanelTitle}
      </h2>
      <p className="workspaces__intro">{strings.supportPanelIntro}</p>

      <h3 className="auth-form__title">{strings.supportReportsTitle}</h3>
      {reports.length === 0 ? (
        <p className="state-block__title">{strings.supportReportsEmpty}</p>
      ) : (
        <ul className="reservation-list">
          {reports.map((report) => (
            <ReportRow key={report.id} report={report} dispatch={dispatch} />
          ))}
        </ul>
      )}
      <p className="auth-form__demo-hint">{strings.supportInternalRecordNote}</p>

      <h3 className="auth-form__title">{strings.auditViewTitle}</h3>
      <p className="auth-form__demo-hint">{strings.auditViewHeaderNote}</p>
      {auditEvents.length === 0 ? (
        <p className="state-block__title">{strings.auditViewEmpty}</p>
      ) : (
        <ul className="reservation-list">
          {auditEvents.map((event) => (
            <li key={event.id} className="reservation-row">
              <p className="reservation-row__name">{event.safeSummary}</p>
              <p className="reservation-row__details">
                {event.targetType} · {new Date(event.occurredAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
