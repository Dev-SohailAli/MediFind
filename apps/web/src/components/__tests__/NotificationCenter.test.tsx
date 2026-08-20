import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { strings } from '../../content/strings';
import {
  createInitialNotificationReadState,
  notificationReadReducer,
  type SyntheticNotification,
} from '../../notifications/syntheticNotifications';
import { NotificationCenter, type NotificationCenterProps } from '../NotificationCenter';

function baseProps(overrides: Partial<NotificationCenterProps> = {}): NotificationCenterProps {
  return {
    notifications: [],
    readState: createInitialNotificationReadState(),
    readDispatch: () => {},
    optInStatus: 'not_asked',
    optInDispatch: () => {},
    ...overrides,
  };
}

const NOTIFICATION: SyntheticNotification = {
  id: 'r1-approved',
  reservationId: 'r1',
  createdAt: '2026-08-20T00:00:00.000Z',
  deliveryOutcome: 'delivered',
};

describe('NotificationCenter — empty/opt-in', () => {
  it('shows the empty state with no notifications', () => {
    render(<NotificationCenter {...baseProps()} />);
    expect(screen.getByText(strings.notificationsEmpty)).toBeInTheDocument();
  });

  it('offers the opt-in prompt, then the explainer with Allow/Not now', async () => {
    const user = userEvent.setup();
    const optInDispatch = vi.fn();
    render(<NotificationCenter {...baseProps({ optInDispatch })} />);

    await user.click(screen.getByRole('button', { name: strings.notificationsOptInPromptLabel }));
    expect(optInDispatch).toHaveBeenCalledWith({ type: 'show_explainer' });
  });

  it('shows the explainer body and Allow/Not now when explaining', async () => {
    const user = userEvent.setup();
    const optInDispatch = vi.fn();
    render(<NotificationCenter {...baseProps({ optInStatus: 'explaining', optInDispatch })} />);

    expect(screen.getByText(strings.notificationsOptInExplainerBody)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: strings.notificationsOptInAllowLabel }));
    expect(optInDispatch).toHaveBeenCalledWith({ type: 'allow' });

    await user.click(screen.getByRole('button', { name: strings.notificationsOptInNotNowLabel }));
    expect(optInDispatch).toHaveBeenCalledWith({ type: 'dismiss' });
  });

  it('shows the granted note once granted', () => {
    render(<NotificationCenter {...baseProps({ optInStatus: 'granted' })} />);
    expect(screen.getByText(strings.notificationsOptInGrantedNote)).toBeInTheDocument();
  });
});

describe('NotificationCenter — entries', () => {
  it('shows the generic entry title, never anything reservation-specific', () => {
    render(<NotificationCenter {...baseProps({ notifications: [NOTIFICATION] })} />);
    expect(screen.getByText(strings.notificationsGenericEntryTitle)).toBeInTheDocument();
  });

  it('shows the delivery-failed note only for a failed delivery outcome', () => {
    const { rerender } = render(
      <NotificationCenter {...baseProps({ notifications: [NOTIFICATION] })} />,
    );
    expect(screen.queryByText(strings.notificationsDeliveryFailedNote)).not.toBeInTheDocument();

    rerender(
      <NotificationCenter
        {...baseProps({ notifications: [{ ...NOTIFICATION, deliveryOutcome: 'failed' }] })}
      />,
    );
    expect(screen.getByText(strings.notificationsDeliveryFailedNote)).toBeInTheDocument();
  });

  it('an unread entry offers Open, which marks it read', async () => {
    const user = userEvent.setup();
    const readDispatch = vi.fn();
    render(<NotificationCenter {...baseProps({ notifications: [NOTIFICATION], readDispatch })} />);

    await user.click(screen.getByRole('button', { name: strings.notificationsOpenEntryLabel }));
    expect(readDispatch).toHaveBeenCalledWith({ type: 'mark_read', id: NOTIFICATION.id });
  });

  it('a read entry has no Open button, and Mark all as read is hidden once nothing is unread', () => {
    const readState = notificationReadReducer(createInitialNotificationReadState(), {
      type: 'mark_read',
      id: NOTIFICATION.id,
    });
    render(<NotificationCenter {...baseProps({ notifications: [NOTIFICATION], readState })} />);

    expect(
      screen.queryByRole('button', { name: strings.notificationsOpenEntryLabel }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: strings.notificationsMarkAllReadLabel }),
    ).not.toBeInTheDocument();
  });

  it('Mark all as read dispatches every notification id', async () => {
    const user = userEvent.setup();
    const readDispatch = vi.fn();
    const second: SyntheticNotification = {
      ...NOTIFICATION,
      id: 'r2-declined',
      reservationId: 'r2',
    };
    render(
      <NotificationCenter
        {...baseProps({ notifications: [NOTIFICATION, second], readDispatch })}
      />,
    );

    await user.click(screen.getByRole('button', { name: strings.notificationsMarkAllReadLabel }));
    expect(readDispatch).toHaveBeenCalledWith({
      type: 'mark_all_read',
      ids: [NOTIFICATION.id, second.id],
    });
  });
});
