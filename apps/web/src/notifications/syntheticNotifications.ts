/**
 * Local-only synthetic generic-notification and status-refresh simulation
 * (ADR-277 Milestone C, second bullet: "generic status refresh and
 * notification delivery/failure simulation"). Nothing here is sent to or
 * read from a network request, no real push provider is named or called,
 * and no real browser permission API is ever invoked — the repository's
 * boundary test still enforces that ban regardless of this module.
 *
 * Notifications are deliberately *derived* from reservation state rather
 * than dispatched at every reservation-mutation call site: one generic
 * entry per reservation transition away from `pending`, keyed by
 * `${reservationId}-${status}` so re-deriving after a rerender is stable
 * and idempotent. Per ADR-020/ADR-164/the design proposal's "Notification
 * entry" shared state, every entry carries only a single fixed generic
 * title — never a medicine, pharmacy or patient name — and the in-app
 * Requests timeline (not this feed) remains the authoritative status
 * source regardless of a notification's simulated delivery outcome.
 */

import type {
  ReservationStatus,
  SyntheticReservation,
} from '../reservations/syntheticReservations';

export const SYNTHETIC_ONLY = true as const;

export type NotificationDeliveryOutcome = 'delivered' | 'failed';

export interface SyntheticNotification {
  readonly id: string;
  readonly reservationId: string;
  readonly createdAt: string;
  readonly deliveryOutcome: NotificationDeliveryOutcome;
}

const NOTIFIABLE_STATUSES: readonly ReservationStatus[] = [
  'approved',
  'declined',
  'expired',
  'cancelled',
  'collected',
];

/**
 * Deterministic, seeded by the notification ID — not real randomness or a
 * real delivery pipeline, purely so this prototype can demonstrate both
 * the "delivered" and "failed" states reproducibly.
 */
export function simulateDeliveryOutcome(seed: string): NotificationDeliveryOutcome {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
  }
  return hash % 5 === 0 ? 'failed' : 'delivered';
}

export function deriveNotifications(
  reservations: readonly SyntheticReservation[],
  buyerKey: string,
): readonly SyntheticNotification[] {
  return reservations
    .filter(
      (reservation) =>
        reservation.buyerKey === buyerKey && NOTIFIABLE_STATUSES.includes(reservation.status),
    )
    .map((reservation) => {
      const id = `${reservation.id}-${reservation.status}`;
      return {
        id,
        reservationId: reservation.id,
        createdAt: reservation.lastUpdatedAt,
        deliveryOutcome: simulateDeliveryOutcome(id),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface NotificationReadState {
  readonly readIds: ReadonlySet<string>;
}

export function createInitialNotificationReadState(): NotificationReadState {
  return { readIds: new Set() };
}

export type NotificationReadAction =
  | { readonly type: 'mark_read'; readonly id: string }
  | { readonly type: 'mark_all_read'; readonly ids: readonly string[] };

export function notificationReadReducer(
  state: NotificationReadState,
  action: NotificationReadAction,
): NotificationReadState {
  switch (action.type) {
    case 'mark_read': {
      if (state.readIds.has(action.id)) {
        return state;
      }
      return { readIds: new Set([...state.readIds, action.id]) };
    }
    case 'mark_all_read': {
      return { readIds: new Set([...state.readIds, ...action.ids]) };
    }
    default:
      return state;
  }
}

/**
 * The buyer-facing permission-explainer flow (design proposal §4 "Browser
 * capability request"): shown only when the buyer opts in, with an
 * "Allow"/"Not now" choice. `granted` here never enables a real browser
 * permission — per ADR-164 the in-app Requests timeline is authoritative
 * whether or not this is ever set to `granted`.
 */
export type NotificationOptInStatus = 'not_asked' | 'explaining' | 'granted' | 'dismissed';

export type NotificationOptInAction =
  { readonly type: 'show_explainer' } | { readonly type: 'allow' } | { readonly type: 'dismiss' };

export function createInitialNotificationOptInStatus(): NotificationOptInStatus {
  return 'not_asked';
}

export function notificationOptInReducer(
  status: NotificationOptInStatus,
  action: NotificationOptInAction,
): NotificationOptInStatus {
  switch (action.type) {
    case 'show_explainer':
      return status === 'not_asked' || status === 'dismissed' ? 'explaining' : status;
    case 'allow':
      return status === 'explaining' ? 'granted' : status;
    case 'dismiss':
      return status === 'explaining' ? 'dismissed' : status;
    default:
      return status;
  }
}
