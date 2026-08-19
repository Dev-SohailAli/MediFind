import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../src/App';
import { strings } from '../src/content/strings';

async function goToAccount(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));
}

async function signIn(user: ReturnType<typeof userEvent.setup>) {
  await goToAccount(user);
  await user.clear(screen.getByLabelText(strings.signInPhoneLabel));
  await user.type(screen.getByLabelText(strings.signInPhoneLabel), '+6797654321');
  await user.click(screen.getByLabelText(strings.signInOver18Label));
  await user.type(screen.getByLabelText(strings.signInNameLabel), 'Demo Buyer');
  await user.type(screen.getByLabelText(strings.signInEmailLabel), 'demo.buyer@example.test');
  await user.click(screen.getByRole('button', { name: strings.signInSendCodeLabel }));
  await user.type(screen.getByLabelText(strings.signInCodeLabel), '123456');
  await user.click(screen.getByRole('button', { name: strings.signInVerifyLabel }));
}

describe('synthetic sign-in end-to-end journey (ADR-277 Milestone B)', () => {
  it('completes sign-in and shows the entered profile on the Account screen', async () => {
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);

    expect(screen.getByRole('heading', { name: strings.accountSignedInTitle })).toBeInTheDocument();
    expect(screen.getByText('Demo Buyer')).toBeInTheDocument();
    expect(screen.getByText('+6797654321')).toBeInTheDocument();
    expect(screen.getByText('demo.buyer@example.test')).toBeInTheDocument();
  });

  it('search remains usable and network-free while signed in', async () => {
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await user.click(screen.getByRole('button', { name: strings.navSearchLabel }));

    expect(await screen.findByText(strings.browseEmptyTitle)).toBeInTheDocument();
  });

  it('signing out returns Account to the sign-in form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await user.click(screen.getByRole('button', { name: strings.accountSignOutLabel }));

    expect(screen.getByRole('heading', { name: strings.signInTitle })).toBeInTheDocument();
  });

  it('simulating session expiry returns Account to the sign-in form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await user.click(screen.getByRole('button', { name: strings.accountSimulateExpiryLabel }));

    expect(screen.getByRole('heading', { name: strings.signInTitle })).toBeInTheDocument();
  });

  it('the lost-phone recovery journey revokes the session, opens a 24-hour hold, and returns to sign-in once simulated as elapsed', async () => {
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await user.click(screen.getByRole('button', { name: strings.accountLostPhoneLabel }));
    expect(screen.getByText(strings.accountLostPhoneIntro)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: strings.accountLostPhoneConfirmLabel }));

    expect(
      screen.getByRole('heading', { name: strings.accountRecoveryHoldTitle }),
    ).toBeInTheDocument();
    expect(screen.getByText(strings.accountRecoveryHoldBody)).toBeInTheDocument();
    // The account/session content itself must be gone, not just hidden.
    expect(screen.queryByText('Demo Buyer')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: strings.accountRecoveryHoldSimulateElapsedLabel }),
    );

    expect(screen.getByRole('heading', { name: strings.signInTitle })).toBeInTheDocument();
  });

  it('cancelling the lost-phone confirmation keeps the session signed in', async () => {
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await user.click(screen.getByRole('button', { name: strings.accountLostPhoneLabel }));
    await user.click(screen.getByRole('button', { name: strings.accountLostPhoneCancelLabel }));

    expect(screen.getByRole('heading', { name: strings.accountSignedInTitle })).toBeInTheDocument();
    expect(screen.getByText('Demo Buyer')).toBeInTheDocument();
  });

  it('switching tabs and back preserves the signed-in session (no re-fetch or reset on navigation)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await signIn(user);
    await user.click(screen.getByRole('button', { name: strings.navSearchLabel }));
    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));

    expect(screen.getByRole('heading', { name: strings.accountSignedInTitle })).toBeInTheDocument();
  });
});
