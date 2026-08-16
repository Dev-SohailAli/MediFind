/**
 * Semantic design tokens from docs/claude-design-agent-brief.md. These are
 * the only colour/typography/spacing values the Task 2 UI may use; no
 * hard-coded colour or custom asset is permitted.
 */

export type ColorScheme = 'light' | 'dark';

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

const LIGHT_COLORS: ColorTokens = {
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

const DARK_COLORS: ColorTokens = {
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

export function getColorTokens(scheme: ColorScheme): ColorTokens {
  return scheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}

export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '600' as const },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  supporting: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  micro: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
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
