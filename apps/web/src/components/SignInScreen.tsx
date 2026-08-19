import * as React from 'react';

import { useSyntheticAuth } from '../auth/AuthContext';
import { SYNTHETIC_AUTH_DEMO_CODE, type SyntheticBuyerProfile } from '../auth/syntheticAuth';
import { strings } from '../content/strings';

const PHONE_PATTERN = /^\+679\d{7}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface DetailsFieldErrors {
  phone?: string;
  over18?: string;
  legalName?: string;
  email?: string;
}

function DetailsForm() {
  const { dispatch } = useSyntheticAuth();
  const [phone, setPhone] = React.useState('+679');
  const [over18, setOver18] = React.useState(false);
  const [legalName, setLegalName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState<DetailsFieldErrors>({});
  const phoneRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: DetailsFieldErrors = {};
    if (!PHONE_PATTERN.test(phone)) {
      nextErrors.phone = strings.signInPhoneRequiredError;
    }
    if (!over18) {
      nextErrors.over18 = strings.signInOver18RequiredError;
    }
    if (legalName.trim().length === 0) {
      nextErrors.legalName = strings.signInNameRequiredError;
    }
    if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = strings.signInEmailRequiredError;
    }

    setErrors(nextErrors);

    if (nextErrors.phone) {
      phoneRef.current?.focus();
      return;
    }
    if (nextErrors.legalName) {
      nameRef.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.over18) {
      return;
    }

    const profile: SyntheticBuyerProfile = { phone, legalName: legalName.trim(), email };
    dispatch({ type: 'send_code', profile });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h1 className="auth-form__title">{strings.signInTitle}</h1>
      <p className="auth-form__intro">{strings.signInIntro}</p>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor="signin-phone">
          {strings.signInPhoneLabel}
        </label>
        <input
          ref={phoneRef}
          id="signin-phone"
          className="auth-field__input"
          type="tel"
          autoComplete="tel"
          value={phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? 'signin-phone-error' : undefined}
          onChange={(event) => setPhone(event.target.value)}
        />
        {errors.phone ? (
          <p id="signin-phone-error" className="auth-field__error" role="alert">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <div className="auth-checkbox">
        <input
          id="signin-over18"
          type="checkbox"
          checked={over18}
          aria-describedby={errors.over18 ? 'signin-over18-error' : undefined}
          onChange={(event) => setOver18(event.target.checked)}
        />
        <label htmlFor="signin-over18">{strings.signInOver18Label}</label>
        {errors.over18 ? (
          <p id="signin-over18-error" className="auth-field__error" role="alert">
            {errors.over18}
          </p>
        ) : null}
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor="signin-name">
          {strings.signInNameLabel}
        </label>
        <input
          ref={nameRef}
          id="signin-name"
          className="auth-field__input"
          type="text"
          autoComplete="name"
          value={legalName}
          aria-invalid={errors.legalName ? true : undefined}
          aria-describedby={errors.legalName ? 'signin-name-error' : undefined}
          onChange={(event) => setLegalName(event.target.value)}
        />
        {errors.legalName ? (
          <p id="signin-name-error" className="auth-field__error" role="alert">
            {errors.legalName}
          </p>
        ) : null}
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor="signin-email">
          {strings.signInEmailLabel}
        </label>
        <input
          ref={emailRef}
          id="signin-email"
          className="auth-field__input"
          type="email"
          autoComplete="email"
          value={email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'signin-email-error' : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
        {errors.email ? (
          <p id="signin-email-error" className="auth-field__error" role="alert">
            {errors.email}
          </p>
        ) : null}
      </div>

      <button type="submit" className="auth-button auth-button--primary">
        {strings.signInSendCodeLabel}
      </button>
    </form>
  );
}

function CodeForm() {
  const { state, dispatch } = useSyntheticAuth();
  const [code, setCode] = React.useState('');
  const codeRef = React.useRef<HTMLInputElement>(null);
  const phone = state.pendingProfile?.phone ?? '';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch({ type: 'submit_code', code });
  }

  function handleResend() {
    setCode('');
    dispatch({ type: 'resend_code' });
    codeRef.current?.focus();
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h1 className="auth-form__title">{strings.signInCodeTitle}</h1>
      <p className="auth-form__intro">{strings.signInCodeIntro(phone)}</p>
      <p className="auth-form__demo-hint">{strings.signInCodeDemoHint(SYNTHETIC_AUTH_DEMO_CODE)}</p>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor="signin-code">
          {strings.signInCodeLabel}
        </label>
        <input
          ref={codeRef}
          id="signin-code"
          className="auth-field__input"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          aria-invalid={state.lastError ? true : undefined}
          aria-describedby={state.lastError ? 'signin-code-error' : undefined}
          onChange={(event) => setCode(event.target.value)}
        />
        {state.lastError ? (
          <p id="signin-code-error" className="auth-field__error" role="alert">
            {state.lastError === 'invalid_code'
              ? strings.signInInvalidCodeError
              : strings.signInExpiredCodeError}
          </p>
        ) : null}
      </div>

      <p className="auth-form__anti-phishing">{strings.signInAntiPhishingNotice}</p>

      <div className="auth-actions">
        <button type="submit" className="auth-button auth-button--primary">
          {strings.signInVerifyLabel}
        </button>
        <button type="button" className="auth-button auth-button--secondary" onClick={handleResend}>
          {strings.signInResendLabel}
        </button>
      </div>
    </form>
  );
}

function RateLimitedNotice() {
  const { dispatch } = useSyntheticAuth();

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">{strings.signInCodeTitle}</h1>
      <p className="state-block__title" role="alert">
        {strings.signInRateLimitedError}
      </p>
      <div className="auth-actions">
        <button
          type="button"
          className="auth-button auth-button--secondary"
          onClick={() => dispatch({ type: 'resend_code' })}
        >
          {strings.signInResendLabel}
        </button>
      </div>
    </div>
  );
}

/**
 * Renders the synthetic sign-in flow's signed-out sub-states
 * (`signed_out`/`code_sent`/`rate_limited`). `signed_in`/`recovery_hold` are
 * handled by the caller — see AccountScreen and RecoveryHoldState.
 */
export function SignInScreen() {
  const { state } = useSyntheticAuth();

  if (state.status === 'signed_out') {
    return <DetailsForm />;
  }
  if (state.status === 'code_sent') {
    return <CodeForm />;
  }
  if (state.status === 'rate_limited') {
    return <RateLimitedNotice />;
  }
  // 'signed_in' and 'recovery_hold' are the caller's responsibility to
  // route elsewhere (see App.tsx's AccountTabContent); rendering nothing
  // here is safer than silently falling back to the details form.
  return null;
}
