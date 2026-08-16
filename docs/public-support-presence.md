# Public support presence

## Scope

MediFind's MVP product is a responsive web application/PWA. A minimal, static public support/legal presence is nevertheless required before external activation for information that must be reachable without an app account. It remains separate from the authenticated buyer, pharmacy, prescription, reservation and admin workflows and holds no account/session functionality.

## Required pages

- **Home/what MediFind is:** Fiji/Suva pilot description, clear service boundary and browser/PWA access instructions; store access is only mentioned if separately approved.
- **Privacy notice and terms:** approved, versioned public legal notices and operator contact required by [the legal-identity requirements](public-notice-and-legal-identity.md).
- **Support:** published support hours, official support email, non-emergency/clinical boundary, account-safety and anti-phishing guidance.
- **Status:** current maintenance/outage state and next-update time, with no sensitive operational detail.
- **Security reporting:** a `security.txt` path and responsible-disclosure contact/process.
- **Accessibility/language:** English, iTaukei and Fiji Hindi legal/safety/support content after required professional review, meeting the [accessibility policy](accessibility-policy.md) and tested with keyboard/screen-reader use.

Host the public support/legal site as static assets on Cloudflare Pages under the founder-controlled MediFind domain. Use no Pages Functions, forms, cookies, analytics, account/API proxy or client storage. Static requests are currently free/unlimited and the same generated assets can move to paid Pages or another static host without affecting the authenticated web/PWA. The final domain, support-email provider and DNS/Cloudflare processor controls still require their own approved configuration before launch. The site uses HTTPS, secure headers and a restricted publishing workflow and never collects prescription, health or authentication data. See the [free-first production architecture](free-first-production-architecture.md).

## Official contact policy

- **Buyers:** use the authenticated in-app support route for account/security/technical issues. For medicine availability, price, dispensing, prescriptions or reservation questions, contact the selected/listed pharmacy directly using the app’s verified contact details.
- **Pharmacies:** use an authenticated in-app operational support route for onboarding, access, listings, requests, reservations and incident escalation. The route records only the minimum information needed and must not invite prescription attachments.
- **Email:** use the published official MediFind support email for cases that cannot be reported in-app. It is not a channel for OTPs, passwords, authenticator codes or prescription files.
- **No WhatsApp support:** MediFind offers no official WhatsApp support channel in the MVP. Messages that claim otherwise are treated as possible impersonation and reported through the in-app/email path.
- **Medical urgency:** MediFind does not provide emergency or clinical support. Content directs urgent health concerns to appropriate health/emergency services.

## Security and privacy controls

- Publish the official domain and contact addresses in the app and public site so buyers/pharmacies can recognise legitimate communications.
- Operational notifications identify an in-app destination but never contain medication, prescription, price or reservation detail.
- Never ask for login credentials, OTPs, authenticator codes or prescription files through unsolicited messages, email or social platforms.
- Encrypt support communications in transit; limit access by role; avoid sensitive free text; classify and retain cases under the approved retention policy.
- Ensure status/security pages do not expose stack versions, internal identifiers, incident forensic evidence or customer data.

## Pre-launch acceptance

- Approved public operator identity/contact, notices and translations published.
- Domain/DNS ownership, HTTPS, sender authentication and restricted publisher access verified.
- Static deployment verified to issue no function, form, analytics, cookie, identity or application-API requests.
- In-app buyer and pharmacy support routes function with generic confirmations and safe escalation.
- Support hours, status-page update process, responsible-disclosure intake and anti-phishing copy tested.
- No account, prescription or reservation workflow is reachable from the public site.
