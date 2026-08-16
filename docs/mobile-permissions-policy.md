# Mobile permissions policy

## Principle

Request each platform permission only immediately before the buyer/staff chooses the related feature, after a plain-language explanation. Declining a permission must not block unrelated app use, and MediFind must provide the safest practical non-permission alternative.

## Allowed MVP permissions

| Permission | Trigger and purpose | Limits and fallback |
| --- | --- | --- |
| Notifications | After the signed-in user sees why generic request/security updates are useful and chooses to enable them | Never prompt on first launch. Notification permission may be declined; authenticated in-app Requests/Account status remains the source of truth. Notifications contain no medical, prescription, price or reservation detail. |
| Foreground approximate location | Buyer explicitly chooses nearby search | Use approximate foreground location only; never request background location or retain coordinates after the search session. Manual area/address search remains available. Precise location is not required for MVP. |
| Camera | Buyer explicitly chooses to capture a prescription | Use only for the active capture flow. No continuous/background camera use. The buyer may choose a permitted file through the system picker instead. |
| System photo/document picker | Buyer explicitly chooses an existing prescription file | Use the platform picker with scoped selected-item access; do not request broad photo-library/media read access. Validate and process only the selected permitted file. |

## Prohibited permissions

Do not request contacts, microphone, SMS read/send, call logs, calendar, Bluetooth, nearby-device scanning, advertising identifier, background location, broad storage/media access or accessibility-service access in MVP. A future request requires an approved ADR, privacy review, user value explanation, platform-specific scope and fallback.

## Implementation and test requirements

- Permission declarations and store disclosures match this policy exactly and are reviewed on every native configuration change.
- The app handles grant, denial, temporary denial, permanent denial, limited/scoped access, revoked permission and unsupported-device states without unsafe dead ends.
- The app never repeatedly prompts after a denial; provide contextual settings guidance only when the user chooses the feature again.
- Test iOS and Android permission flows in the physical-device beta matrix using synthetic data only.
