/**
 * Semantic design tokens from docs/claude-design-agent-brief.md and the
 * founder-approved organic visual system (ADR-271,
 * docs/design-proposals/2026-08-17-organic-visual-system.md). These are
 * the only colour/typography/spacing values the web buyer-search UI may
 * use; no hard-coded colour or custom asset is permitted. The values here
 * are the single source of truth and must stay byte-identical to the CSS
 * custom properties in src/styles/global.css (checked by
 * src/theme/__tests__/tokens.test.ts).
 *
 * Status (info/success/warning/danger) and secondary text/icon colours are
 * drawn only from the approved neutral/accent/accent-2 ramps — the base
 * `secondary` (`#7A8A5E`) and raw ramp tones that fall under a 4.5:1 text
 * contrast ratio are used decoratively (borders, large icons) only, never
 * as text colour, per the brief's "tinted surface plus textPrimary, not
 * reduced contrast" rule.
 */

export interface ColorTokens {
  canvas: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
  onPrimary: string;
  primaryPressed: string;
  onPrimaryPressed: string;
  secondary: string;
  onSecondary: string;
  info: string;
  infoText: string;
  success: string;
  successText: string;
  warning: string;
  warningText: string;
  danger: string;
  dangerText: string;
}

export const LIGHT_COLORS: ColorTokens = {
  canvas: '#F5EAD8',
  surface: '#EBDDC5',
  surfaceMuted: '#EEE7DB',
  textPrimary: '#201E1D',
  textSecondary: '#645C50',
  border: 'color-mix(in srgb, #201E1D 16%, transparent)',
  primary: '#C67139',
  onPrimary: '#201E1D',
  primaryPressed: '#8C491A',
  onPrimaryPressed: '#FFFFFF',
  secondary: '#7A8A5E',
  onSecondary: '#56633F',
  info: '#EEE7DB',
  infoText: '#474238',
  success: '#F0FAE1',
  successText: '#3D472B',
  warning: '#FFF2EB',
  warningText: '#8C491A',
  danger: '#FFC6A5',
  dangerText: '#643312',
};

export const DARK_COLORS: ColorTokens = {
  canvas: '#2E2B25',
  surface: '#474238',
  surfaceMuted: '#645C50',
  textPrimary: '#F9F4ED',
  textSecondary: '#C0B6A5',
  border: 'color-mix(in srgb, #F9F4ED 16%, transparent)',
  primary: '#F6A06B',
  onPrimary: '#2E2B25',
  primaryPressed: '#FFC6A5',
  onPrimaryPressed: '#2E2B25',
  secondary: '#AEBF92',
  onSecondary: '#CCDBB2',
  info: '#645C50',
  infoText: '#F9F4ED',
  success: '#272E1B',
  successText: '#F0FAE1',
  warning: '#8C491A',
  warningText: '#FFF2EB',
  danger: '#643312',
  dangerText: '#FFE1D0',
};

/** The complete neutral/accent/accent-2 tonal ramps, 100 (lightest) to 900
 * (darkest). This is the full source for every light/dark colour variant;
 * no additional hue may be introduced. */
export const ramps = {
  neutral: [
    '#F9F4ED',
    '#EEE7DB',
    '#DCD3C4',
    '#C0B6A5',
    '#A19786',
    '#82796A',
    '#645C50',
    '#474238',
    '#2E2B25',
  ],
  accent: [
    '#FFF2EB',
    '#FFE1D0',
    '#FFC6A5',
    '#F6A06B',
    '#D67F48',
    '#B2622D',
    '#8C491A',
    '#643312',
    '#402310',
  ],
  accent2: [
    '#F0FAE1',
    '#E1EECC',
    '#CCDBB2',
    '#AEBF92',
    '#8FA073',
    '#728157',
    '#56633F',
    '#3D472B',
    '#272E1B',
  ],
} as const;

/** Organic spacing scale (space-1..space-6). Only these six values are
 * approved; no unnamed scale entry may be invented. */
export const spacing = {
  space1: 4.4,
  space2: 8.8,
  space3: 13.2,
  space4: 17.6,
  space5: 26.4,
  space6: 35.2,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 28,
  card: 32,
  pill: 999,
};

export const typeScale = {
  h1: 42,
  h2: 32,
  h3: 25,
  h4: 20,
  h5: 16,
  h6: 13,
  body: 15,
};

export const bodyLineHeight = 1.55;

export const minimumTouchTarget = 48;

export const iconStrokeWidth = 2.75;

/** The responsive breakpoint (CSS px) at which the nav reflows from a
 * bottom tab bar to a top nav bar. Not a product decision — an ordinary
 * implementation default separating "iPhone-sized" from "desktop-sized"
 * per the task brief's two required verification viewports. */
export const desktopBreakpointPx = 768;
