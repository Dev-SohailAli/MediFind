import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../theme/useTheme';
import { spacing, typography } from '../theme/tokens';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  glyph: string;
}

/**
 * A status label that is never conveyed by colour alone: every badge pairs
 * a plain-language label with a glyph, and the whole badge is exposed as a
 * single accessible text node.
 */
export function StatusBadge({ label, tone, glyph }: StatusBadgeProps) {
  const colors = useThemeColors();

  const toneColor: Record<BadgeTone, string> = {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
    neutral: colors.textSecondary,
  };

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[styles.container, { backgroundColor: colors.surfaceMuted }]}
    >
      <Text style={[styles.glyph, { color: toneColor[tone] }]}>{glyph}</Text>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xxl,
  },
  glyph: {
    fontSize: typography.label.fontSize,
  },
  label: {
    fontSize: typography.label.fontSize,
    lineHeight: typography.label.lineHeight,
    fontWeight: typography.label.fontWeight,
  },
});
