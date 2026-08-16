import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { strings } from '../content/strings';
import { spacing, typography } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';

function StateBlock({ title, body }: { title: string; body?: string }) {
  const colors = useThemeColors();

  return (
    <View accessible accessibilityRole="text" style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text> : null}
    </View>
  );
}

export function BrowseEmptyState() {
  return <StateBlock title={strings.browseEmptyTitle} body={strings.browseEmptyBody} />;
}

export function ZeroResultState() {
  const colors = useThemeColors();

  return (
    <View accessible accessibilityRole="text" style={styles.container}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{strings.zeroResultTitle}</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>{strings.zeroResultBody}</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {strings.zeroResultSubstituteNotice}
      </Text>
    </View>
  );
}

export function LoadingState() {
  const colors = useThemeColors();

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      style={styles.container}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>{strings.loadingLabel}</Text>
    </View>
  );
}

export function OfflineState() {
  return <StateBlock title={strings.offlineTitle} body={strings.offlineBody} />;
}

export function ErrorState() {
  return <StateBlock title={strings.errorTitle} body={strings.errorBody} />;
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.heading.fontSize,
    lineHeight: typography.heading.lineHeight,
    fontWeight: typography.heading.fontWeight,
  },
  body: {
    fontSize: typography.supporting.fontSize,
    lineHeight: typography.supporting.lineHeight,
  },
});
