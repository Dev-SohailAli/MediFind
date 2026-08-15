# Notification and status synchronisation policy

## Source of truth

The MediFind API is the sole authority for current prescription, reservation, verification, listing and staff state. Push notifications are a generic prompt to authenticate and fetch the current authorised record; they never carry state authority, medicine, prescription, price, reservation or private details.

## MVP update model

- Use direct FCM/APNs generic push as the primary signal for buyer and authorised pharmacy-staff updates.
- Use the authenticated in-app inbox/status as the non-push fallback. MVP does not send pharmacy workflow notifications through a transactional-email provider; future email requires separate need, processor, sender-domain and cost approval.
- A notification deep-links only to an authenticated in-app destination. On open, the app verifies current session/role/device conditions and re-fetches the current server record before display.
- Requests/reservations and other status screens refresh on initial open, application resume, explicit pull-to-refresh and a successful action completion. The UI displays the actual last-refresh/state time and handles safe loading/error/offline states.
- Declining notification permission does not block the workflow; the authenticated in-app status view remains the source of truth.
- Do not run continuous foreground/background polling, WebSockets, Firestore listeners, Realtime Database subscriptions or other persistent realtime channels in MVP.
- Do not retry a failed state mutation automatically in the background. The API idempotency/concurrency policy governs a user-initiated retry after the app refreshes current state.

## Registration and delivery controls

- Associate a push-token reference with the authenticated user/device and permitted role context; update/revoke it on sign-out, session/device revocation, recovery and permission change.
- Send only generic operational/security notifications. Delivery/retry metrics use pseudonymous references and contain no sensitive payload.
- Notification failure is observable and never causes an email containing sensitive data. The app continues to surface the current state on the next authorised access.

## Test requirements

- Test notification receipt, permission denial, expired/revoked session, stale deep link, role/branch change, offline open, token revocation and safe re-fetch on physical iOS/Android beta devices.
- Prove notification payloads, delivery logs and analytics contain no prohibited medical, prescription, price, reservation, raw contact or credential data.
- Prove a delayed/duplicated notification cannot display/commit a stale state and never bypasses current server authorization.
