import * as React from 'react';
import { CircleCheck, Info, TriangleAlert, XCircle } from 'lucide-react';

import {
  listSyntheticWorkspaces,
  resolveSyntheticWorkspace,
  type PharmacyStaffRole,
  type PharmacyVerificationStatus,
  type SyntheticWorkspace,
} from '../pharmacy/syntheticPharmacy';
import { strings } from '../content/strings';
import { StatusBadge, type BadgeTone } from './StatusBadge';

const STATUS_LABEL: Record<PharmacyVerificationStatus, string> = {
  under_review: strings.workspaceStatusUnderReviewLabel,
  needs_more_information: strings.workspaceStatusNeedsMoreInformationLabel,
  live: strings.workspaceStatusLiveLabel,
  rejected: strings.workspaceStatusRejectedLabel,
};

const STATUS_TONE: Record<PharmacyVerificationStatus, BadgeTone> = {
  under_review: 'info',
  needs_more_information: 'warning',
  live: 'success',
  rejected: 'danger',
};

const STATUS_ICON: Record<PharmacyVerificationStatus, typeof Info> = {
  under_review: Info,
  needs_more_information: TriangleAlert,
  live: CircleCheck,
  rejected: XCircle,
};

const ROLE_LABEL: Record<PharmacyStaffRole, string> = {
  owner: strings.workspaceRoleOwnerLabel,
  inventory_manager: strings.workspaceRoleInventoryManagerLabel,
  prescription_reviewer: strings.workspaceRolePrescriptionReviewerLabel,
};

function WorkspaceCard({ workspace }: { workspace: SyntheticWorkspace }) {
  const { branch, roles } = workspace;
  const hasDashboardAccess = roles.length > 0;
  const hasReviewerRole = roles.includes('prescription_reviewer');

  return (
    <li className="workspace-card">
      <div className="workspace-card__header">
        <p className="workspace-card__name">{branch.pharmacyDisplayName}</p>
        <StatusBadge
          label={STATUS_LABEL[branch.verificationStatus]}
          tone={STATUS_TONE[branch.verificationStatus]}
          icon={STATUS_ICON[branch.verificationStatus]}
        />
      </div>

      <p className="workspace-card__roles">
        {strings.workspaceRolesLabel}: {roles.map((role) => ROLE_LABEL[role]).join(', ')}
      </p>

      {branch.verificationStatus !== 'live' ? (
        <p className="workspace-card__notice">{strings.workspaceNotYetLiveNotice}</p>
      ) : (
        <ul className="workspace-card__access-list">
          <li>
            {strings.workspaceDashboardAccessLabel}: {hasDashboardAccess ? '✓' : '—'}
          </li>
          <li>
            {strings.workspaceInventoryAccessLabel}: {hasDashboardAccess ? '✓' : '—'}
          </li>
          <li>
            {strings.workspaceRequestsAccessLabel}:{' '}
            {hasReviewerRole ? `✓ ${strings.workspaceRequestsAccessGatedNote}` : '—'}
            {!hasReviewerRole ? (
              <span className="workspace-card__access-denied-note">
                {' '}
                {strings.workspaceRequestsAccessDeniedNote}
              </span>
            ) : null}
          </li>
        </ul>
      )}
    </li>
  );
}

function WorkspaceLookupForm() {
  const [branchId, setBranchId] = React.useState('');
  const [result, setResult] = React.useState<SyntheticWorkspace | 'not_permitted' | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const outcome = resolveSyntheticWorkspace(branchId.trim());
    setResult(outcome.status === 'ok' ? outcome.workspace : 'not_permitted');
  }

  return (
    <form className="auth-form workspace-lookup" onSubmit={handleSubmit} noValidate>
      <div className="auth-field">
        <label className="auth-field__label" htmlFor="workspace-lookup-id">
          {strings.workspaceLookupLabel}
        </label>
        <input
          id="workspace-lookup-id"
          className="auth-field__input"
          type="text"
          placeholder={strings.workspaceLookupPlaceholder}
          value={branchId}
          onChange={(event) => setBranchId(event.target.value)}
        />
      </div>
      <button type="submit" className="auth-button auth-button--secondary">
        {strings.workspaceLookupOpenLabel}
      </button>

      {result === 'not_permitted' ? (
        <p className="auth-field__error" role="alert">
          {strings.workspaceLookupNotPermitted}
        </p>
      ) : null}
      {result && result !== 'not_permitted' ? (
        <ul className="workspace-list">
          <WorkspaceCard workspace={result} />
        </ul>
      ) : null}
    </form>
  );
}

/**
 * Inline "workspace switcher" (design proposal §3), simplified from a
 * full-screen sheet to an inline Account section for this prototype: lists
 * every pharmacy branch/role the fixed demo identity holds, plus a
 * branch-ID lookup demonstrating the anti-enumeration "not permitted"
 * response for a branch the identity has no role at.
 */
export function PharmacyWorkspaces() {
  const workspaces = listSyntheticWorkspaces();

  return (
    <section className="workspaces" aria-labelledby="workspaces-title">
      <h2 id="workspaces-title" className="workspaces__title">
        {strings.workspacesTitle}
      </h2>
      <p className="workspaces__intro">{strings.workspacesIntro}</p>

      {workspaces.length === 0 ? (
        <p className="state-block__title">{strings.workspacesEmpty}</p>
      ) : (
        <ul className="workspace-list">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.branch.branchId} workspace={workspace} />
          ))}
        </ul>
      )}

      <WorkspaceLookupForm />
    </section>
  );
}
