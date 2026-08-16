import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { strings } from '../content/strings';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';

export interface LoadMoreButtonProps {
  onPress: () => void;
}

/** Explicit, local "Load more" action. There is no infinite scroll. */
export function LoadMoreButton({ onPress }: LoadMoreButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={strings.loadMoreLabel}
      style={[styles.button, { borderColor: colors.primary }]}
    >
      <Text style={{ color: colors.primary }}>{strings.loadMoreLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
});
