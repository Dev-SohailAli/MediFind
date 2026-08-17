# Web notification and status synchronisation

## Decision

The web application is authoritative through authenticated Worker reads. A
browser notification, if added later, is a generic signal to reopen or refresh
state. It must not contain prescription content, health data, medicine-search
text, reservation details or access tokens.

The current synthetic preview has no notification provider, account, polling,
realtime channel or persistent notification subscription.

## Future rules

- Ask for notification permission only after a user enables an approved
  workflow and provide an in-app status fallback.
- Re-fetch and authorize current state when a notification is opened, on app
  resume and after a mutation.
- Treat duplicate, stale, delayed and revoked subscriptions safely.
- Keep provider code behind a Worker adapter; do not add native push SDKs.
