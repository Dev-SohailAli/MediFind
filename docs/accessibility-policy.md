# Accessibility policy

## Standard and scope

MediFind targets WCAG 2.2 AA for the iOS/Android mobile app and the minimal public-support site. This is a product quality target, not a claim of formal certification. A release exception requires documented user approval, impact, workaround and remediation plan; no exception may weaken prescription privacy, authorization, safety wording or an essential buyer/pharmacy/admin journey.

## Mandatory experience requirements

- Support system text scaling through 200% without clipped controls, hidden status, overlapping critical content or inaccessible primary actions.
- Provide semantic labels, roles, hints and state announcements for interactive controls, errors, loading, request/reservation changes and prescription-safety boundaries.
- Keep screen-reader focus order logical and predictable. On navigation, modal opening, error validation and status change, move focus to the meaningful title/message/action.
- Meet adequate contrast in light/dark themes and never rely on colour alone for stock, stale data, prescription-required status, validation, errors, reservation state or security alerts.
- Provide touch targets and spacing suitable for mobile use; avoid time-limited interaction where not essential. If a time limit is required for security/expiry, explain it and preserve safe recovery/renewal paths.
- Support keyboard/focus interaction where a platform, external keyboard or assistive technology provides it. Avoid gesture-only control paths.
- Use plain, non-diagnostic language in English, iTaukei and Fiji Hindi. Medicine identity remains pharmacy/officially authored and is not translated.
- Respect reduced-motion/OS accessibility settings where available; do not use flashing or motion that can obscure urgent/safety content.

## Verification

- Automate accessible-name/role, contrast and text-scaling checks where the selected toolchain supports them.
- Before each beta release, manually test every changed critical buyer, pharmacy and admin journey with iOS VoiceOver and Android TalkBack on physical supported devices. Record device/OS, language, journey, issue and result.
- Test the public-support pages with keyboard navigation and a representative screen reader before external activation.
- Include empty, loading, offline, stale, error, permission-denied, security-alert and confirmation states in assistive-technology testing.
- Treat a blocker in an essential journey as a release blocker. File, prioritise and verify remediation for every other accessibility defect.
