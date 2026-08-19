import * as React from 'react';

import { useSyntheticAuth } from '../auth/AuthContext';
import { strings } from '../content/strings';

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString();
}

/**
 * Signed-in synthetic Account content. Only rendered when
 * `state.status === 'signed_in'`; the caller (App.tsx) is responsible for
 * routing other statuses to SignInScreen/RecoveryHoldState.
 */
export function AccountScreen() {
  const { state, dispatch } = useSyntheticAuth();
  const [confirmingRecovery, setConfirmingRecovery] = React.useState(false);

  if (state.status !== 'signed_in' || !state.session) {
    return null;
  }

  const { session } = state;

  return (
    <div className="account-screen">
      <h1 className="account-screen__title">{strings.accountSignedInTitle}</h1>

      <dl className="account-summary">
        <div className="account-summary__row">
          <dt>{strings.accountProfileNameLabel}</dt>
          <dd>{session.profile.legalName}</dd>
        </div>
        <div className="account-summary__row">
          <dt>{strings.accountProfilePhoneLabel}</dt>
          <dd>{session.profile.phone}</dd>
        </div>
        <div className="account-summary__row">
          <dt>{strings.accountProfileEmailLabel}</dt>
          <dd>{session.profile.email}</dd>
        </div>
      </dl>

      <div className="account-session">
        <p className="account-session__label">{strings.accountSessionLabel}</p>
        <p className="account-session__expiry">
          {strings.accountSessionExpiresPrefix} {formatTimestamp(session.expiresAt)}
        </p>
        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={() => dispatch({ type: 'expire_session' })}
        >
          {strings.accountSimulateExpiryLabel}
        </button>
      </div>

      <div className="auth-actions">
        <button
          type="button"
          className="auth-button auth-button--primary"
          onClick={() => dispatch({ type: 'sign_out' })}
        >
          {strings.accountSignOutLabel}
        </button>
        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={() => setConfirmingRecovery(true)}
        >
          {strings.accountLostPhoneLabel}
        </button>
      </div>

      {confirmingRecovery ? (
        <div
          className="account-recovery-confirm"
          role="alertdialog"
          aria-labelledby="recovery-confirm-title"
        >
          <p id="recovery-confirm-title" className="account-recovery-confirm__title">
            {strings.accountLostPhoneLabel}
          </p>
          <p className="account-recovery-confirm__body">{strings.accountLostPhoneIntro}</p>
          <div className="auth-actions">
            <button
              type="button"
              className="auth-button auth-button--primary"
              onClick={() => dispatch({ type: 'request_recovery' })}
            >
              {strings.accountLostPhoneConfirmLabel}
            </button>
            <button
              type="button"
              className="auth-button auth-button--secondary"
              onClick={() => setConfirmingRecovery(false)}
            >
              {strings.accountLostPhoneCancelLabel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Full-screen `danger`-outlined security-hold state (design proposal §4
 * "Security hold"), shown for the entire 24-hour synthetic recovery hold.
 * Search remains reachable via the Search tab the whole time; this screen
 * only replaces Account content.
 */
export function RecoveryHoldState() {
  const { state, dispatch } = useSyntheticAuth();

  if (state.status !== 'recovery_hold' || !state.recoveryHoldUntil) {
    return null;
  }

  return (
    <div className="security-hold" role="alert">
      <h1 className="security-hold__title">{strings.accountRecoveryHoldTitle}</h1>
      <p className="security-hold__body">{strings.accountRecoveryHoldBody}</p>
      <p className="security-hold__until">
        {strings.accountRecoveryHoldUntilPrefix} {formatTimestamp(state.recoveryHoldUntil)}
      </p>
      <button
        type="button"
        className="auth-button auth-button--secondary"
        onClick={() => dispatch({ type: 'complete_recovery_hold' })}
      >
        {strings.accountRecoveryHoldSimulateElapsedLabel}
      </button>
    </div>
  );
}
