import * as React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { strings } from '../content/strings';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={strings.searchInputPlaceholder}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={strings.searchInputLabel}
        style={[styles.input, { color: colors.textPrimary }]}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChange('')}
          accessibilityRole="button"
          accessibilityLabel={strings.searchInputClearLabel}
          style={styles.clearButton}
        >
          <Text style={{ color: colors.textSecondary }}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.xl,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    minHeight: 48,
  },
  clearButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
