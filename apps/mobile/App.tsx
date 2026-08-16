import { StyleSheet, Text, View } from 'react-native';

export const LOCAL_DEV_BUILD_LABEL = 'MediFind — local synthetic development build';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{LOCAL_DEV_BUILD_LABEL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
  },
});
