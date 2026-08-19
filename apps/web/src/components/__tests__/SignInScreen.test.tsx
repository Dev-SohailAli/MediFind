import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SyntheticAuthProvider } from '../../auth/AuthContext';
import { SYNTHETIC_AUTH_MAX_ATTEMPTS } from '../../auth/syntheticAuth';
import { strings } from '../../content/strings';
import { SignInScreen } from '../SignInScreen';

function renderSignIn() {
  return render(
    <SyntheticAuthProvider>
      <SignInScreen />
    </SyntheticAuthProvider>,
  );
}

async function fillValidDetails(user: ReturnType<typeof userEvent.setup>) {
  await user.clear(screen.getByLabelText(strings.signInPhoneLabel));
  await user.type(screen.getByLabelText(strings.signInPhoneLabel), '+6797654321');
  await user.click(screen.getByLabelText(strings.signInOver18Label));
  await user.type(screen.getByLabelText(strings.signInNameLabel), 'Demo Buyer');
  await user.type(screen.getByLabelText(strings.signInEmailLabel), 'demo.buyer@example.test');
  await user.click(screen.getByRole('button', { name: strings.signInSendCodeLabel }));
}

describe('SignInScreen', () => {
  it('shows the details form first, with the synthetic-only intro copy', () => {
    renderSignIn();

    expect(screen.getByRole('heading', { name: strings.signInTitle })).toBeInTheDocument();
    expect(screen.getByText(strings.signInIntro)).toBeInTheDocument();
    expect(screen.getByLabelText(strings.signInPhoneLabel)).toHaveValue('+679');
  });

  it('rejects an invalid phone number, moves focus to the field, and never advances to the code step', async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.clear(screen.getByLabelText(strings.signInPhoneLabel));
    await user.type(screen.getByLabelText(strings.signInPhoneLabel), '123');
    await user.click(screen.getByLabelText(strings.signInOver18Label));
    await user.type(screen.getByLabelText(strings.signInNameLabel), 'Demo Buyer');
    await user.type(screen.getByLabelText(strings.signInEmailLabel), 'demo.buyer@example.test');
    await user.click(screen.getByRole('button', { name: strings.signInSendCodeLabel }));

    expect(screen.getByRole('alert')).toHaveTextContent(strings.signInPhoneRequiredError);
    expect(screen.getByLabelText(strings.signInPhoneLabel)).toHaveFocus();
    expect(screen.queryByLabelText(strings.signInCodeLabel)).not.toBeInTheDocument();
  });

  it('requires the 18+ attestation before continuing', async () => {
    const user = userEvent.setup();
    renderSignIn();

    await user.clear(screen.getByLabelText(strings.signInPhoneLabel));
    await user.type(screen.getByLabelText(strings.signInPhoneLabel), '+6797654321');
    await user.type(screen.getByLabelText(strings.signInNameLabel), 'Demo Buyer');
    await user.type(screen.getByLabelText(strings.signInEmailLabel), 'demo.buyer@example.test');
    await user.click(screen.getByRole('button', { name: strings.signInSendCodeLabel }));

    expect(screen.getByText(strings.signInOver18RequiredError)).toBeInTheDocument();
    expect(screen.queryByLabelText(strings.signInCodeLabel)).not.toBeInTheDocument();
  });

  it('advances to the code step on valid details, showing the demo code and anti-phishing notice', async () => {
    const user = userEvent.setup();
    renderSignIn();

    await fillValidDetails(user);

    expect(screen.getByRole('heading', { name: strings.signInCodeTitle })).toBeInTheDocument();
    expect(screen.getByText(strings.signInCodeDemoHint('123456'))).toBeInTheDocument();
    expect(screen.getByText(strings.signInAntiPhishingNotice)).toBeInTheDocument();
  });

  it('shows a generic error for a wrong code without revealing the correct one', async () => {
    const user = userEvent.setup();
    renderSignIn();
    await fillValidDetails(user);

    await user.type(screen.getByLabelText(strings.signInCodeLabel), '000000');
    await user.click(screen.getByRole('button', { name: strings.signInVerifyLabel }));

    expect(screen.getByRole('alert')).toHaveTextContent(strings.signInInvalidCodeError);
  });

  it('rate-limits after too many wrong attempts and offers only resend', async () => {
    const user = userEvent.setup();
    renderSignIn();
    await fillValidDetails(user);

    for (let attempt = 0; attempt < SYNTHETIC_AUTH_MAX_ATTEMPTS; attempt += 1) {
      const input = screen.getByLabelText(strings.signInCodeLabel);
      await user.clear(input);
      await user.type(input, '000000');
      await user.click(screen.getByRole('button', { name: strings.signInVerifyLabel }));
    }

    expect(screen.getByRole('alert')).toHaveTextContent(strings.signInRateLimitedError);
    expect(screen.getByRole('button', { name: strings.signInResendLabel })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.signInVerifyLabel }),
    ).not.toBeInTheDocument();
  });

  it('resend issues a fresh code and clears the prior error', async () => {
    const user = userEvent.setup();
    renderSignIn();
    await fillValidDetails(user);

    await user.type(screen.getByLabelText(strings.signInCodeLabel), '000000');
    await user.click(screen.getByRole('button', { name: strings.signInVerifyLabel }));
    expect(screen.getByRole('alert')).toHaveTextContent(strings.signInInvalidCodeError);

    await user.click(screen.getByRole('button', { name: strings.signInResendLabel }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText(strings.signInCodeLabel)).toHaveValue('');
  });

  // Successful sign-in (status becomes 'signed_in') is covered as an
  // App-level integration test in apps/web/__tests__/AuthFlow.test.tsx,
  // since App.tsx — not SignInScreen — owns routing a signed-in status to
  // AccountScreen; SignInScreen has no defined standalone behavior once
  // signed in.
});
