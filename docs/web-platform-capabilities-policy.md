# Web platform capabilities policy

## Purpose

MediFind uses browser capabilities only when a web task has an approved need.
The browser is an untrusted client and a capability prompt is never a substitute
for a safe manual path.

## Capability rules

| Capability | Default | Required fallback |
| --- | --- | --- |
| Installability | Optional; browser use always works | Continue in the browser |
| Notifications | Off until a user enables them for an approved workflow | Authenticated in-app status and manual refresh |
| Location | Never required for search | Manual area/branch selection and verified directions link |
| Camera | Never required for the current preview | File picker or manual support path if later approved |
| File access | Disabled in the current preview | No upload action until a protected upload task passes its gates |
| Browser storage | No writes in the synthetic preview | Server re-fetch; never store sensitive data or tokens in browser storage |

## Safety and accessibility

Request permission just in time, explain why in plain language, handle denial
without blocking safe discovery, and never request background access. Test
keyboard focus, screen readers, 200% text scaling, reduced motion, contrast,
offline behaviour and browser-specific denial states before each relevant beta.

No native permission, store, device-build or mobile SDK work is part of this
policy.
