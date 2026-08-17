# Claude Design agent brief

## Purpose

This is the design contract for a Claude Design session connected to the MediFind repository. It translates approved product, safety, accessibility and operational requirements into clear constraints a design agent can apply consistently. It does **not** authorise app code, production configuration, new services or a change to an accepted product decision.

The first proposal is a low-fidelity, whole-MVP review artefact. The founder must explicitly approve it before a coding agent implements any visual flow. The organic visual system recorded below was approved on 2026-08-17; implementation remains a separate, reviewable coding task.

## Product in one sentence

MediFind is a responsive Fiji medicine-discovery web app/PWA that helps signed-in buyers find pharmacy-listed medicines and prices, route a prescription only to the pharmacy they choose, and request a pharmacy-approved collection reservation.

The first release is an invite-only Suva pilot with two to three pharmacies. It is not a seller, prescriber, dispenser, payment processor, delivery service, diagnostic tool or emergency service.

## Design outcome

The web app/PWA should feel calm, credible and easy to act on in a real pharmacy-search moment: clear enough for low/variable connectivity, respectful around prescription privacy, and honest whenever stock, price or dispensing remains under pharmacy control.

Prioritise, in order:

1. the user's current task and safe next action;
2. the actual state and freshness of pharmacy-managed information;
3. legibility, assistive technology and translated layout;
4. trust through plain language and predictable behaviour; and
5. polished restraint over decorative novelty.

## Accepted organic visual system

Use these as the visual baseline. They are semantic roles, not permission to use colour as the only status signal. The previous teal/blue baseline is superseded by ADR-271. A coding agent must not substitute arbitrary colours, typefaces or visual effects later.

### Colour tokens

| Role | Value | Use |
| --- | --- | --- |
| `canvas` | `#F5EAD8` | Main app background |
| `surface` | `#EBDDC5` | Cards, sheets and primary surfaces |
| `textPrimary` | `#201E1D` | Primary text and icons |
| `primary` | `#C67139` | Main actions and selected controls |
| `secondary` | `#7A8A5E` | Secondary actions and calm emphasis |
| `divider` | `color-mix(in srgb, #201E1D 16%, transparent)` | Dividers and control boundaries |

The tonal ramps below are the complete source for light-to-dark variants; do not invent additional hues or separate ad-hoc dark-mode colours.

| Ramp | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `neutral` | `#F9F4ED` | `#EEE7DB` | `#DCD3C4` | `#C0B6A5` | `#A19786` | `#82796A` | `#645C50` | `#474238` | `#2E2B25` |
| `accent` | `#FFF2EB` | `#FFE1D0` | `#FFC6A5` | `#F6A06B` | `#D67F48` | `#B2622D` | `#8C491A` | `#643312` | `#402310` |
| `accent-2` | `#F0FAE1` | `#E1EECC` | `#CCDBB2` | `#AEBF92` | `#8FA073` | `#728157` | `#56633F` | `#3D472B` | `#272E1B` |

Semantic aliases remain available to existing screen specifications: `primary` maps to `color-accent`, `primaryPressed` uses a deeper approved accent-ramp value, `secondary` maps to `color-accent-2`, `surfaceMuted` and `textSecondary` use approved neutral-ramp values, and `border` maps to `divider`. `info`, `success`, `warning` and `danger` must use only the approved ramps with contrast-checked text/icon pairings; they do not introduce new hues or rely on colour alone.

- Use `primary` for one obvious main action per screen where possible; avoid competing filled buttons.
- Pair every status colour with a plain-language label and an icon or shape. Do not rely on red/green distinction, colour contrast alone or a tiny badge.
- Meet WCAG 2.2 AA contrast for normal text and controls. Where a coloured token cannot meet contrast with a proposed text colour, use a tinted surface plus `textPrimary`, not reduced contrast.
- Do not use gradients, glass effects, neon, discount/sale styling, health-diagnosis imagery or alarmist red as the normal visual language. Use the warm background, terracotta accent and sage secondary accent with restraint.

### Typography and layout tokens

| Token | Organic type scale | Use |
| --- | --- | --- |
| `h1` | 42px, Caprasimo 400 | Primary page title |
| `h2` | 32px, Caprasimo 400 | Major section title |
| `h3` | 25px, Caprasimo 400 | Section/card heading |
| `h4` | 20px, Caprasimo 400 | Subsection heading |
| `h5` | 16px, Figtree 700 | Compact heading |
| `h6` | 13px, Figtree 700, uppercase/tracked | Non-critical eyebrow label |
| `body` | 15px/1.55, Figtree 400 | Default readable content |
| `label` | 15px, Figtree 600 | Inputs, metadata and actions |
| `supporting` | 15px/1.55, Figtree 400 | Freshness, help and explanatory copy |

- Use `Caprasimo` for headings and `Figtree` for body/UI text at weights 400, 600 and 700, with robust local fallbacks. Font loading must preserve the offline shell and must not depend on an unreviewed third-party runtime request.
- Use the supplied organic spacing values: `4.4, 8.8, 13.2, 17.6, 26.4, 35.2px`. The handoff names `space-1` through `space-8` but provides six numeric values; do not invent values for unnamed scale entries. Raise a clarification only if implementation needs a value that was not supplied.
- Use `8px` small, `16px` medium and `28px` large radii. Buttons, inputs and tags may use `999px`; cards and dialogs may use approximately `32px` where it improves the organic visual language.
- Use soft, ink-tinted small/medium/large elevation rather than neutral grey shadows. Keep 16px minimum horizontal padding on narrow viewports and preserve generous spacing around critical actions.
- Minimum interactive target is 48 × 48 dp/pt. Critical actions have generous spacing and must remain usable at 200% text scaling.
- Support browser/OS light/dark preference by default with a manual Account override. Never create a separate information hierarchy for dark mode.

Use Lucide icons with a `2.75` stroke width. Do not add a custom logo or illustration library as part of this visual-system change.

### Components and interaction rules

- Use a list-first search experience. An embedded map is prohibited; Directions opens the installed maps app using verified pharmacy coordinates.
- Use one primary button, secondary outlined/text actions and explicitly labelled destructive actions. Never hide cancel/decline behind ambiguous icon-only controls.
- Use cards for a pharmacy listing/result, not for every line of content. Buyers need to scan medicine identity, availability, exact-pack FJD price, pharmacy, distance and last-updated time quickly.
- Show `In stock`, `Low stock`, `Unavailable` and `May be outdated` as labelled status components. Never display exact stock quantity.
- Make stale information visible close to the listing—not buried in a details view. Missing results never mean no pharmacy in Fiji has the medicine.
- Use compact, persistent but non-alarmist safety copy at the point of risk: pharmacy-managed availability/price, prescription-required boundary, no guaranteed dispensing and reservation expiry.
- Use full-screen or sheet confirmation for a high-impact action: prescription submission, reservation request, staff-role change, pharmacy verification decision, owner transfer, account deletion, break-glass and kill switch.
- Generic web notification opens an authenticated, freshly fetched web state. Its preview never exposes medicine, prescription, price, reservation or patient details.

## Content and safety rules

- Use clear English first; safety-critical UI is prepared for professionally reviewed iTaukei and Fiji Hindi translations. Allow for text expansion and wrapping; do not force a translation into a fixed one-line component.
- MediFind says “listed by the pharmacy”, “last updated”, “may be outdated”, “pharmacy review required” and “request a reservation”. It does not say “we have it”, “guaranteed”, “approved medicine”, “recommended alternative” or “your prescription is valid”.
- Search can explain exact match and active-ingredient match. It must not infer a therapeutic substitute or give dosage/clinical advice.
- Prescription upload is shared only with the buyer-selected verified pharmacy. A rejected/expired request lets the buyer select another pharmacy and submit a new request; never imply forwarding occurred.
- Pharmacy-authored notes are operational only, labelled with their language and distinct from MediFind system text. Do not machine-translate, decorate or elevate them into clinical advice.
- Support is founder-operated on Fiji business hours and is not emergency or medical support. Emergency guidance must be clear but calm.

## Required flows and states

The proposal must cover the screens and flows in the [initial design-review brief](initial-claude-design-review-brief.md), including buyer, pharmacy and MediFind admin roles. For each flow, show at least the following relevant states:

- first-use/onboarding, signed-out, loading, empty and safe error;
- offline/reconnect and timestamped public-cache behaviour;
- permission explanation, permission denial and manual fallback;
- stale/updated/unavailable listing states;
- prescription submitted, quarantined, under review, approved, rejected, expired and cancelled states;
- reservation submitted, approved, declined, cancelled, expired and collected states; and
- maintenance/kill-switch/security-hold states.

Prescription content and protected records are not shown in offline/cache, notifications, unauthorised screens, app-switcher previews or generic artefacts.

## Design deliverables and quality bar

Deliver one Markdown proposal using the [proposal workspace](design-proposals/README.md). Include:

1. A visual rationale that explains how the design serves Fiji buyers, pharmacies and low-connectivity use.
2. A token application table using the colour/type/spacing rules above; identify only genuine alternatives that need approval.
3. A buyer/pharmacy/admin role and navigation map, including a safe multi-role workspace switch.
4. Low-fidelity responsive page/wireframe descriptions for all required flows, with narrow/mobile and desktop hierarchy, actions, status placement and safety copy.
5. A component inventory: buttons, inputs, listing card, status component, freshness label, empty/error/offline states, confirmation sheet, notification entry and high-risk action pattern.
6. An accessibility and localisation review: 200% text scaling, browser screen-reader labels/order, keyboard/focus, non-colour status, touch targets, dark mode and English/iTaukei/Fiji Hindi expansion.
7. An explicit non-goals list and a short list of decisions requiring founder approval.

No code, assets, libraries, service accounts, test data resembling real people, external design service or cloud configuration may be added as part of this deliverable. The proposal is reviewed using the [design-review acceptance checklist](design-review-acceptance-checklist.md); it remains non-binding until the founder records an outcome there.

## Copyable kickoff prompt

```text
You are the MediFind Design Agent. Work in design-only mode: do not write application code, install packages, create cloud resources, add external services or change product/security policy.

Read these repository files in order:
1. CLAUDE-DESIGN.md
2. docs/claude-design-agent-brief.md
3. docs/design-system-and-screens.md
4. docs/initial-claude-design-review-brief.md
5. docs/requirements.md, docs/experience-and-content.md and docs/data-and-search.md
6. docs/accessibility-policy.md, docs/web-platform-capabilities-policy.md, docs/dynamic-pharmacy-content-policy.md and docs/notification-and-status-synchronisation.md
7. docs/security-privacy-compliance.md, docs/security-architecture-threat-model.md and docs/decisions.md

Then create one complete low-fidelity responsive web/PWA MVP design proposal in docs/design-proposals/ using the workspace template. Apply the approved initial colour, typography, spacing, content, accessibility and safety rules in the design brief. Cover buyer, pharmacy and MediFind admin roles; all stated user journeys; and loading, offline, empty, stale, browser-capability, error, security, maintenance and success states.

The proposal must show how buyers understand pharmacy-managed availability and exact-pack FJD prices, selected-pharmacy-only prescription routing, pharmacy-reviewed reservations, freshness and no-guarantee boundaries. It must preserve role and prescription privacy boundaries. Use fictional examples only.

Do not choose a different architecture, invent product features, add custom assets, introduce external services or begin UI implementation. At the end, list only material questions needing founder approval and state explicitly that no code or configuration changed.
```

## Source documents

This brief is applied with the [design system and screen specification](design-system-and-screens.md), [initial Claude design-review brief](initial-claude-design-review-brief.md), [Claude design proposal protocol](claude-design-proposal-protocol.md) and accepted ADRs in [the decision log](decisions.md).
