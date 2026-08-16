import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';

export interface PrototypePlaceholderProps {
  title: string;
  body: string;
}

/**
 * Requests/Account tabs render only this: a clear non-functional prototype
 * notice. No profile, authentication or historical request/account content
 * is simulated.
 */
export function PrototypePlaceholder({ title, body }: PrototypePlaceholderProps) {
  const colors = useThemeColors();

  return (
    <View accessible accessibilityRole="text" style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]} accessibilityRole="header">
        {title}
      </Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    fontWeight: typography.title.fontWeight,
  },
  body: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    textAlign: 'center',
  },
});
