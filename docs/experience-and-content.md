# Experience and content guidance

## Responsive web and accessibility

Design for responsive, touch-first browser/PWA use across iPhone Safari, Android browsers and desktop, low/variable connectivity, readable type, sufficient contrast, screen-reader labels, keyboard support, clear error recovery and no colour-only status meaning. Follow the [accessibility policy](accessibility-policy.md), including 200% text scaling and assistive-technology validation. Cache only non-sensitive search content; never cache prescription files in browser storage. Present results as a low-data list by default and provide an optional verified map-link action; list view remains fully usable without map access. Request browser notifications only after an in-app explanation; use foreground approximate location only when the buyer selects nearby search, with manual area search always available; use camera/file selection only when the buyer starts an upload.

State the active search sort and show why a result is an active-ingredient rather than exact-product match. Do not use advertising, paid placement or visual treatment that makes a paid pharmacy appear more relevant in medicine search.

For no-result states, use clear non-diagnostic language: offer broader search terms and an optional “I could not find this medicine” report, and explain that MediFind does not recommend substitutes. Never add medicine favourites or saved-search suggestions without a separate privacy and product decision.

Ask for device location only when the buyer chooses “near me”, explain that it is optional, and provide manual area/address search with equivalent results. Do not request location during account registration or while a user is reviewing a prescription.

## Prescription upload

Support camera capture and selection of a supported PDF/image from the device. Before upload, validate the allowed file type and size, show a preview, ask the buyer to confirm that it is legible, and give a non-clinical explanation that only the buyer-selected pharmacy will receive it. Never place uploaded files in the device photo library, app analytics, push notifications or emails, and never present nearby pharmacies as alternate prescription recipients without a new buyer selection and consent action.

Before the buyer submits a prescription, state the selected pharmacy, that the pharmacy has two business days to review an unviewed request, what happens at expiry, and the applicable file-retention/deletion rule. Send a generic status notification and retain an in-app status record when it expires; never silently delete or forward the request.

## Language

Launch every buyer, pharmacy-staff and admin screen, notification template, error state, consent/safety message and support content in English, iTaukei and Fiji Hindi. Store all user-facing copy as translation keys, not embedded text. Default to the device language when supported and provide a visible language picker at onboarding and in settings. Each language must be professionally reviewed with Suva pilot users and pharmacy stakeholders; legal/privacy wording requires appropriate professional review before release.

Medicine names, brands, strengths, dosage forms, prices and pharmacy legal names remain in their official or pharmacy-entered form. Translate only the surrounding labels and explanations; never machine-translate a medicine identity or clinical instruction without review.

## Safety content

- “Availability and price are provided by the pharmacy and may change.”
- “A reservation is not a guarantee of supply or dispensing.”
- “A valid prescription may be required. The pharmacy makes the final dispensing decision.”
- “MediFind does not provide medical advice. For urgent medical help in Fiji, call 911 or contact a health professional.”

Do not diagnose, recommend treatment, rank medicines by suitability, or imply a substitution. Clearly label stale data, prescription-required items and every user-visible status.

## Privileged-account security education

Before a pharmacy owner, prescription reviewer or MediFind admin activates a privileged role, explain in plain language that MFA protects buyers' prescription information, pharmacy listings and the staff account if a phone or password is stolen. State that MFA uses an authenticator app or passkey, not SMS alone; provide setup steps, recovery guidance and support-hour expectations. The app must not allow the user to bypass this requirement without a documented, time-limited pilot exception approved by MediFind.

Use structured, MediFind-translated templates for safety-critical state, expiry, error, price and pickup information. Pharmacy-authored branch/pickup/listing notes follow the [dynamic pharmacy content policy](dynamic-pharmacy-content-policy.md): they are limited, attributed, language-tagged, un-translated, plain text and never a medical-advice or credential/prescription-request channel.

## Anti-phishing guidance

Publish MediFind's official support channels in the app and support material. State plainly that MediFind and pharmacies will never ask through an unsolicited call, SMS, email, WhatsApp message or social post for an OTP, password, authenticator code or prescription file. Provide an in-app path for buyers and staff to report suspicious messages or account activity; capture only the minimum evidence needed for review and never ask the reporter to forward sensitive prescription content.
