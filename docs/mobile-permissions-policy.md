# Web platform capabilities policy

## Principle

Request each browser capability only immediately before the buyer/staff chooses the related feature, after a plain-language explanation. Declining a capability must not block unrelated web-app use, and MediFind must provide the safest practical manual alternative.

## Allowed MVP capabilities

| Capability | Trigger and purpose | Limits and fallback |
| --- | --- | --- |
| Web notifications | After the signed-in user sees why generic request/security updates are useful and chooses to enable them | Never prompt on first launch. Notifications may be declined; authenticated Requests/Account status remains the source of truth. Notifications contain no medical, prescription, price or reservation detail. |
| Foreground approximate location | Buyer explicitly chooses nearby search | Use approximate foreground location only; never request background location or retain coordinates after the search session. Manual area/address search remains available. Precise location is not required for MVP. |
| Camera capture | Buyer explicitly chooses to capture a prescription | Use only for the active capture flow. No continuous/background camera use. The buyer may choose a file instead. |
| Selected file access | Buyer explicitly chooses an existing prescription file | Use the browser's selected-file flow; do not read unrelated files or retain the file after the approved upload flow. |
| PWA installation/offline shell | User chooses Add to Home Screen or browser install | Installation is optional. Offline mode shows only approved public search data and never queues sensitive actions. |

## Prohibited capabilities and future native scope

Do not request contacts, microphone, SMS read/send, call logs, calendar, Bluetooth, nearby-device scanning, advertising identifier, background location, broad file access or accessibility-service access in MVP. The future native shell must separately justify any platform permission through an approved ADR, privacy review, user value explanation, platform-specific scope and fallback.

## Implementation and test requirements

- Browser capability explanations and privacy disclosures match this policy exactly and are reviewed on every web capability change.
- The app handles grant, denial, revoked capability, unsupported-browser and standalone/PWA states without unsafe dead ends.
- The app never repeatedly prompts after a denial; provide contextual browser/settings guidance only when the user chooses the feature again.
- Test iPhone Safari, Android Chrome and desktop keyboard/browser capability flows using synthetic data only.
