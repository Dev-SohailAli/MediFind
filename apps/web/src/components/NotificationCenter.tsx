import * as React from 'react';

import { strings } from '../content/strings';
import type {
  NotificationOptInAction,
  NotificationOptInStatus,
  NotificationReadAction,
  NotificationReadState,
  SyntheticNotification,
} from '../notifications/syntheticNotifications';

export interface NotificationCenterProps {
  readonly notifications: readonly SyntheticNotification[];
  readonly readState: NotificationReadState;
  readonly readDispatch: React.Dispatch<NotificationReadAction>;
  readonly optInStatus: NotificationOptInStatus;
  readonly optInDispatch: React.Dispatch<NotificationOptInAction>;
}

function OptInSection({
  optInStatus,
  optInDispatch,
}: Pick<NotificationCenterProps, 'optInStatus' | 'optInDispatch'>) {
  if (optInStatus === 'granted') {
    return (
      <p className="notification-center__opt-in-note">{strings.notificationsOptInGrantedNote}</p>
    );
  }

  if (optInStatus === 'explaining') {
    return (
      <div
        className="notification-center__explainer"
        role="dialog"
        aria-labelledby="notif-opt-in-title"
      >
        <p id="notif-opt-in-title" className="notification-center__explainer-title">
          {strings.notificationsOptInExplainerTitle}
        </p>
        <p className="notification-center__explainer-body">
          {strings.notificationsOptInExplainerBody}
        </p>
        <div className="auth-actions">
          <button
            type="button"
            className="auth-button auth-button--primary"
            onClick={() => optInDispatch({ type: 'allow' })}
          >
            {strings.notificationsOptInAllowLabel}
          </button>
          <button
            type="button"
            className="auth-button auth-button--secondary"
            onClick={() => optInDispatch({ type: 'dismiss' })}
          >
            {strings.notificationsOptInNotNowLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="auth-button auth-button--secondary"
      onClick={() => optInDispatch({ type: 'show_explainer' })}
    >
      {strings.notificationsOptInPromptLabel}
    </button>
  );
}

/**
 * Generic in-app notification feed (design proposal §4 "Notification
 * entry"): every row shows only a fixed generic title, a relative
 * timestamp and an unread indicator — never the medicine, pharmacy or
 * patient identity behind it (ADR-020). "Open" simulates re-authenticating
 * and re-fetching before showing detail by simply marking the entry read;
 * the buyer already sees the real detail in the Requests list above this,
 * which remains authoritative regardless of a notification's simulated
 * delivery outcome (ADR-164).
 */
export function NotificationCenter({
  notifications,
  readState,
  readDispatch,
  optInStatus,
  optInDispatch,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !readState.readIds.has(n.id)).length;

  return (
    <section className="notification-center" aria-labelledby="notification-center-title">
      <div className="notification-center__header">
        <h2 id="notification-center-title" className="notification-center__title">
          {strings.notificationsTitle}
          {unreadCount > 0 ? ` (${unreadCount} ${strings.notificationsUnreadSuffix})` : ''}
        </h2>
        {notifications.length > 0 && unreadCount > 0 ? (
          <button
            type="button"
            className="auth-button auth-button--secondary"
            onClick={() =>
              readDispatch({ type: 'mark_all_read', ids: notifications.map((n) => n.id) })
            }
          >
            {strings.notificationsMarkAllReadLabel}
          </button>
        ) : null}
      </div>

      <OptInSection optInStatus={optInStatus} optInDispatch={optInDispatch} />

      {notifications.length === 0 ? (
        <p className="notification-center__empty">{strings.notificationsEmpty}</p>
      ) : (
        <ul className="notification-center__list">
          {notifications.map((notification) => {
            const unread = !readState.readIds.has(notification.id);
            return (
              <li
                key={notification.id}
                className={
                  unread
                    ? 'notification-center__entry notification-center__entry--unread'
                    : 'notification-center__entry'
                }
              >
                <p className="notification-center__entry-title">
                  {strings.notificationsGenericEntryTitle}
                </p>
                <p className="notification-center__entry-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                {notification.deliveryOutcome === 'failed' ? (
                  <p className="notification-center__entry-delivery-failed">
                    {strings.notificationsDeliveryFailedNote}
                  </p>
                ) : null}
                {unread ? (
                  <button
                    type="button"
                    className="auth-button auth-button--secondary"
                    onClick={() => readDispatch({ type: 'mark_read', id: notification.id })}
                  >
                    {strings.notificationsOpenEntryLabel}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
