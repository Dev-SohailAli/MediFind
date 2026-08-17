import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SyntheticSort } from '@medifind/contracts';

import { strings } from '../content/strings';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';

const SORT_OPTIONS: ReadonlyArray<{ value: SyntheticSort; label: string }> = [
  { value: 'relevance', label: strings.sortRelevanceLabel },
  { value: 'price_low_to_high', label: strings.sortPriceLabel },
  { value: 'distance', label: strings.sortDistanceLabel },
];

export interface SortSelectorProps {
  value: SyntheticSort;
  onChange: (sort: SyntheticSort) => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={strings.sortSelectorLabel}
      style={styles.row}
    >
      {SORT_OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={[
              styles.option,
              {
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.surfaceMuted : colors.surface,
              },
            ]}
          >
            <Text style={{ color: selected ? colors.primary : colors.textPrimary }}>
              {selected ? '✓ ' : ''}
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    borderWidth: 1,
    borderRadius: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
});
