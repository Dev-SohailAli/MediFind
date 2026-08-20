import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from './App';
import { SYNTHETIC_AUTH_DEMO_CODE } from './auth/syntheticAuth';
import { strings } from './content/strings';

describe('App', () => {
  it('renders exactly one main#main-content landmark', () => {
    render(<App />);

    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute('id', 'main-content');
  });

  it('renders the skip link with the reviewed label, pointing at the main landmark', () => {
    render(<App />);

    const skipLink = screen.getByRole('link', { name: strings.skipToContentLabel });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('activating the skip link moves focus to main#main-content', async () => {
    const user = userEvent.setup();
    render(<App />);

    const skipLink = screen.getByRole('link', { name: strings.skipToContentLabel });
    await user.click(skipLink);

    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('renders exactly three ordinary navigation buttons with aria-current="page" on Search by default', () => {
    render(<App />);

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav.querySelectorAll('button')).toHaveLength(3);
    expect(screen.getByRole('button', { name: strings.navSearchLabel })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('switching to Requests keeps the same skip target and offers sign-in when signed out', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navRequestsLabel }));

    expect(screen.getByRole('button', { name: strings.navRequestsLabel })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute('id', 'main-content');
    expect(screen.getByText(strings.requestsSignInRequiredTitle)).toBeInTheDocument();

    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('password');
  });

  it('the Requests sign-in prompt navigates to the Account tab', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navRequestsLabel }));
    await user.click(screen.getByRole('button', { name: strings.requestsSignInRequiredAction }));

    expect(screen.getByRole('button', { name: strings.navAccountLabel })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('heading', { name: strings.signInTitle })).toBeInTheDocument();
  });

  it('switching to Account keeps the same skip target and shows only the synthetic sign-in form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));

    expect(screen.getByRole('button', { name: strings.navAccountLabel })).toHaveAttribute(
      'aria-current',
      'page',
    );
    const mains = screen.getAllByRole('main');
    expect(mains).toHaveLength(1);
    expect(mains[0]).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('heading', { name: strings.signInTitle })).toBeInTheDocument();

    const bodyText = document.body.textContent?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('password');
  });

  it('the skip link still works after navigating to Requests/Account', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));
    await user.click(screen.getByRole('link', { name: strings.skipToContentLabel }));

    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('a signed-in buyer can request a reservation from Search and see it in Requests (Milestone C end-to-end)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));
    await user.clear(screen.getByLabelText(strings.signInPhoneLabel));
    await user.type(screen.getByLabelText(strings.signInPhoneLabel), '+6797654321');
    await user.click(screen.getByLabelText(strings.signInOver18Label));
    await user.type(screen.getByLabelText(strings.signInNameLabel), 'Demo Buyer');
    await user.type(screen.getByLabelText(strings.signInEmailLabel), 'demo.buyer@example.test');
    await user.click(screen.getByRole('button', { name: strings.signInSendCodeLabel }));
    await user.type(screen.getByLabelText(strings.signInCodeLabel), SYNTHETIC_AUTH_DEMO_CODE);
    await user.click(screen.getByRole('button', { name: strings.signInVerifyLabel }));
    expect(screen.getByRole('heading', { name: strings.accountSignedInTitle })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: strings.navSearchLabel }));
    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Farovex');
    await user.click(await screen.findByRole('button', { name: /Farovex.*Exact product match/i }));

    const dialog = screen.getByRole('dialog', { name: strings.detailSheetTitle });
    await user.type(
      within(dialog).getByLabelText(strings.reservationPatientNameLabel),
      'Litia Waqa',
    );
    await user.click(within(dialog).getByRole('button', { name: strings.reservationSubmitLabel }));
    expect(within(dialog).getByText(strings.reservationSuccessNotice)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: strings.detailSheetCloseLabel }));

    await user.click(screen.getByRole('button', { name: strings.navRequestsLabel }));
    expect(screen.getByText('Farovex')).toBeInTheDocument();
    expect(screen.getByText(strings.reservationStatusPendingLabel)).toBeInTheDocument();
  });

  it('a pharmacy approval is visible to the buyer as both an updated status and a generic notification (Milestone C end-to-end)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));
    await user.clear(screen.getByLabelText(strings.signInPhoneLabel));
    await user.type(screen.getByLabelText(strings.signInPhoneLabel), '+6797654321');
    await user.click(screen.getByLabelText(strings.signInOver18Label));
    await user.type(screen.getByLabelText(strings.signInNameLabel), 'Demo Buyer');
    await user.type(screen.getByLabelText(strings.signInEmailLabel), 'demo.buyer@example.test');
    await user.click(screen.getByRole('button', { name: strings.signInSendCodeLabel }));
    await user.type(screen.getByLabelText(strings.signInCodeLabel), SYNTHETIC_AUTH_DEMO_CODE);
    await user.click(screen.getByRole('button', { name: strings.signInVerifyLabel }));

    await user.click(screen.getByRole('button', { name: strings.navSearchLabel }));
    await user.type(screen.getByLabelText(strings.searchInputLabel), 'Farovex');
    await user.click(await screen.findByRole('button', { name: /Farovex.*Exact product match/i }));
    const dialog = screen.getByRole('dialog', { name: strings.detailSheetTitle });
    await user.type(
      within(dialog).getByLabelText(strings.reservationPatientNameLabel),
      'Litia Waqa',
    );
    await user.click(within(dialog).getByRole('button', { name: strings.reservationSubmitLabel }));
    await user.click(within(dialog).getByRole('button', { name: strings.detailSheetCloseLabel }));

    // Same fixed demo identity, switching to its pharmacy-staff side.
    await user.click(screen.getByRole('button', { name: strings.navAccountLabel }));
    await user.click(screen.getByRole('button', { name: strings.pharmacyRequestsOpenLabel }));
    await user.click(screen.getByRole('button', { name: strings.pharmacyRequestsApproveLabel }));

    await user.click(screen.getByRole('button', { name: strings.navRequestsLabel }));
    expect(screen.getByText(strings.reservationStatusApprovedLabel)).toBeInTheDocument();
    expect(screen.getByText(strings.notificationsGenericEntryTitle)).toBeInTheDocument();
  });
});
