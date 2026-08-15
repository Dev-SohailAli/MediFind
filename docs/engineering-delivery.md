# Engineering delivery

## Technology direction

After documentation approval, build the iOS/Android mobile application in TypeScript with React Native and Expo as the shared codebase. Build a TypeScript backend/API on Firebase/Google Cloud with Firebase Authentication, App Check, private Firestore access through the API, encrypted object storage, direct APNs/FCM notifications and managed monitoring. Production services use Sydney regional placement where supported and remain subject to the documented privacy, security, exportability and cost gates.

## Source control and change control

`main` is the protected, deployable branch. Every material product or implementation change updates the relevant Markdown document and decision log. Future code work uses short-lived branches and reviewable pull requests. Secrets, real prescription data, production exports and credentials must never be committed to Git.

## Required quality gates

Every change must run automated formatting, type/static checks, unit tests, secret scanning, SAST, dependency/vulnerability checks and a mobile build appropriate to its scope before merge. Generate an SBOM for each release. Add integration, accessibility, end-to-end, API authorization/DAST and device-security tests as each capability is implemented. Test all supported language variants for layout, fallback strings, safe consent wording and notification/error-state rendering. Production deployment is a deliberate, manually approved action after all required checks pass; no automatic push to production is permitted.

Critical/high security findings block production release. Before accepting real prescriptions, complete an independent, scoped mobile/API security assessment against applicable OWASP MASVS/MASTG and ASVS controls; fix high-severity findings before activation.

Patch or safely mitigate critical vulnerabilities within 24 hours and high-severity vulnerabilities within seven days; review routine dependency updates monthly. Record ownership, mitigation, verification and closure for each security finding. If a safe patch cannot ship in time, use the documented kill switch or sensitive-feature minimum-version gate.

## Test-data rule

Use synthetic, non-sensitive fixtures in local development and staging. Test prescription flows with representative fake documents that contain no real person, pharmacy or medical information. Never use production data to reproduce a defect outside the approved production incident process.

## Pilot distribution

Distribute the first 2–3 pharmacy pilot through invite-only beta channels: TestFlight for iOS and Google Play closed testing for Android. Test buyer, pharmacy and admin workflows in those channels before considering a public App Store or Play Store listing. Never distribute pilot builds through APK files, WhatsApp downloads, email attachments or unofficial links. Founder-owned developer accounts control tester invitations, release notes, builds and emergency release withdrawal.
