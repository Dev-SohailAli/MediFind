# Task 15: Publish the static public support/legal/status presence

## Gate

Requires approved operator identity, public domain/DNS ownership, official
support contact, support hours, legal notices, security-reporting contact,
translations and restricted publisher ownership. Do not invent contact details
or publish placeholder legal copy.

See the [Task 15 implementation plan](../../superpowers/plans/2026-08-18-task-15-public-support-presence-implementation.md) for the static-only package boundary, content/publisher gate, capability guard and browser/accessibility evidence.

## Goal

Create a separate static Pages asset set for public home, privacy/terms,
support, status and `security.txt` content without account, API, form, cookie,
analytics, storage or application proxy behavior.

## Allowed scope

- Add static assets under the approved public support package or a separately
  documented Pages project.
- Add secure headers, no-index policy where required, accessible navigation,
  language links and versioned legal-content metadata.
- Add a static build/verification command that proves there are no functions,
  forms, cookies, application API calls or client storage.

## Acceptance

- English, iTaukei and Fiji Hindi content has professional review evidence.
- Domain, HTTPS, sender/authentication and publisher access are verified.
- Pages responses are static and contain no sensitive operational detail.
- Keyboard, screen-reader, narrow/mobile and 200% scaling checks pass.
- Status content shows current state and next update without stack versions,
  internal identifiers, incident forensics or customer data.

Commit: `feat: add static public support presence`
