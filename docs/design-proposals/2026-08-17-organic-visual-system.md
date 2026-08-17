# Organic visual system proposal

**Status:** Founder-approved 2026-08-17  
**Scope:** Responsive web/PWA visual tokens only  
**Implementation:** Not included; requires a separate coding PR

## Decision

MediFind adopts a warm organic visual system for the responsive web/PWA. It replaces the previous teal/blue and system-font baseline while preserving the existing information architecture, safety language, accessibility requirements, responsive behaviour and synthetic-only delivery boundary.

## Base colour tokens

| Token | Value | Role |
| --- | --- | --- |
| `color-bg` | `#F5EAD8` | Application background |
| `color-surface` | `#EBDDC5` | Cards, sheets and surfaces |
| `color-text` | `#201E1D` | Primary text and icons |
| `color-accent` | `#C67139` | Terracotta primary action/accent |
| `color-accent-2` | `#7A8A5E` | Sage secondary accent |
| `color-divider` | `color-mix(in srgb, #201E1D 16%, transparent)` | Dividers |

## Tonal ramps

Values run from 100 (lightest) to 900 (darkest). They are the complete tonal source for theme variants; implementation must not invent additional hues.

| Ramp | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Neutral | `#F9F4ED` | `#EEE7DB` | `#DCD3C4` | `#C0B6A5` | `#A19786` | `#82796A` | `#645C50` | `#474238` | `#2E2B25` |
| Accent | `#FFF2EB` | `#FFE1D0` | `#FFC6A5` | `#F6A06B` | `#D67F48` | `#B2622D` | `#8C491A` | `#643312` | `#402310` |
| Accent-2 | `#F0FAE1` | `#E1EECC` | `#CCDBB2` | `#AEBF92` | `#8FA073` | `#728157` | `#56633F` | `#3D472B` | `#272E1B` |

Existing semantic roles remain supported as aliases: primary uses the terracotta accent, pressed primary uses a deeper accent-ramp value, secondary uses the sage accent, muted surfaces and secondary text use the neutral ramp, and borders use the divider token. Info, success, warning and danger use only these approved ramps with contrast-checked text/icon pairings; no new status hues are introduced.

## Typography

- Headings: `Caprasimo`, weight 400.
- Body and interface text: `Figtree`, weights 400, 600 and 700.
- Fallbacks are required, and font loading must not break the offline PWA shell.
- Scale: h1 42px, h2 32px, h3 25px, h4 20px, h5 16px, h6 13px uppercase/tracked; body 15px/1.55.

## Layout and components

- Spacing: `4.4, 8.8, 13.2, 17.6, 26.4, 35.2px`. The handoff names `space-1` through `space-8` but supplies six numeric values; no values for unnamed scale entries may be invented during implementation.
- Radius: 8px small, 16px medium, 28px large; buttons, inputs and tags may use pill/999px treatment.
- Cards/dialogs may use approximately 1.15× the large radius where it improves the organic language.
- Elevation uses soft ink-tinted small/medium/large shadows tuned to the warm palette.
- Icons use Lucide with 2.75px stroke width.

## Accessibility and safety constraints

- Preserve WCAG 2.2 AA contrast checks for every text/control pairing.
- Pair every status colour with a text label and icon/shape; never rely on colour alone.
- Preserve 48×48 minimum interactive targets, 200% text scaling, keyboard/focus behaviour, screen-reader semantics and translated-text expansion.
- Preserve all existing pharmacy-ownership, freshness, prescription privacy, no-guarantee and non-clinical wording.
- Do not add gradients, glass effects, neon, sale styling, diagnostic imagery, custom logos or illustration libraries.

## Approval boundary

This proposal records the approved visual direction and tokens only. It does not change application code, install fonts, add runtime services, alter product flows or authorise production deployment. The next step is a separate implementation PR that maps these semantic tokens into the web/PWA after reviewing font licensing, loading and offline fallback behaviour.
