import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { strings } from '../content/strings';
import { spacing, typography } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';

export type AppTab = 'search' | 'requests' | 'account';

export interface BottomNavProps {
  active: AppTab;
  onSelect: (tab: AppTab) => void;
}

const TABS: ReadonlyArray<{ value: AppTab; label: string }> = [
  { value: 'search', label: strings.navSearchLabel },
  { value: 'requests', label: strings.navRequestsLabel },
  { value: 'account', label: strings.navAccountLabel },
];

export function BottomNav({ active, onSelect }: BottomNavProps) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.row, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
    >
      {TABS.map((tab) => {
        const selected = tab.value === active;
        return (
          <Pressable
            key={tab.value}
            onPress={() => onSelect(tab.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={tab.label}
            style={styles.tab}
          >
            <Text
              style={[styles.label, { color: selected ? colors.primary : colors.textSecondary }]}
            >
              {tab.label}
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
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  label: {
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
  },
});
