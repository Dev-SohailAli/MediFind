import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { type AppTab, BottomNav } from './src/components/BottomNav';
import { PrototypePlaceholder } from './src/components/PrototypePlaceholder';
import { SearchScreen } from './src/components/SearchScreen';
import { strings } from './src/content/strings';
import { spacing, typography } from './src/theme/tokens';
import { useThemeColors } from './src/theme/useTheme';

export default function App() {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = React.useState<AppTab>('search');

  return (
    <View style={[styles.root, { backgroundColor: colors.canvas }]}>
      <View style={styles.body}>
        {activeTab === 'search' ? <SearchScreen /> : null}
        {activeTab === 'requests' ? (
          <PrototypePlaceholder
            title={strings.requestsPlaceholderTitle}
            body={strings.requestsPlaceholderBody}
          />
        ) : null}
        {activeTab === 'account' ? (
          <PrototypePlaceholder
            title={strings.accountPlaceholderTitle}
            body={strings.accountPlaceholderBody}
          />
        ) : null}
      </View>

      <Text style={[styles.buildLabel, { color: colors.textSecondary }]}>
        {strings.localDevBuildLabel}
      </Text>

      <BottomNav active={activeTab} onSelect={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  buildLabel: {
    fontSize: typography.micro.fontSize,
    textAlign: 'center',
    paddingVertical: spacing.xs,
  },
});
