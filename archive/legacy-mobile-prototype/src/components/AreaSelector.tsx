import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SyntheticArea } from '@medifind/contracts';

import { strings } from '../content/strings';
import { spacing } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';

const AREA_OPTIONS: ReadonlyArray<{ value: SyntheticArea | null; label: string }> = [
  { value: null, label: strings.areaSelectorAllLabel },
  { value: 'harbour', label: strings.areaHarbourLabel },
  { value: 'garden', label: strings.areaGardenLabel },
  { value: 'market', label: strings.areaMarketLabel },
];

export interface AreaSelectorProps {
  value: SyntheticArea | null;
  onChange: (area: SyntheticArea | null) => void;
}

/**
 * Manual synthetic-area picker. It never requests or reads a device
 * location and renders no map; it only changes which pre-authored fixture
 * distance context is shown.
 */
export function AreaSelector({ value, onChange }: AreaSelectorProps) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={strings.areaSelectorLabel}
      style={styles.row}
    >
      {AREA_OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.label}
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
