/**
 * Semantic design tokens from docs/claude-design-agent-brief.md. These are
 * the only colour/typography/spacing values the web buyer-search UI may
 * use; no hard-coded colour or custom asset is permitted. The values here
 * are the single source of truth and must stay byte-identical to the CSS
 * custom properties in src/styles/global.css (checked by
 * src/theme/__tests__/tokens.test.ts).
 */

export interface ColorTokens {
  canvas: string;
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryPressed: string;
  info: string;
  success: string;
  warning: string;
  danger: string;
}

export const LIGHT_COLORS: ColorTokens = {
  canvas: '#F7FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF6F8',
  textPrimary: '#102A33',
  textSecondary: '#52616B',
  border: '#D9E2EC',
  primary: '#0F766E',
  primaryPressed: '#115E59',
  info: '#1D4ED8',
  success: '#15803D',
  warning: '#B45309',
  danger: '#B91C1C',
};

export const DARK_COLORS: ColorTokens = {
  canvas: '#0B1416',
  surface: '#132326',
  surfaceMuted: '#1C3034',
  textPrimary: '#F0F7F7',
  textSecondary: '#B8C7C9',
  border: '#294247',
  primary: '#2DD4BF',
  primaryPressed: '#14B8A6',
  info: '#60A5FA',
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
};

export const radius = {
  card: 12,
};

export const minimumTouchTarget = 48;

/** The responsive breakpoint (CSS px) at which the nav reflows from a
 * bottom tab bar to a top nav bar. Not a product decision — an ordinary
 * implementation default separating "iPhone-sized" from "desktop-sized"
 * per the task brief's two required verification viewports. */
export const desktopBreakpointPx = 768;
