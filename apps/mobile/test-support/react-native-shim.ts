// Vitest cannot parse react-native's real source (it ships Flow syntax that
// Vite/rolldown reject). This test-only shim stands in for the small set of
// react-native host components our code renders, so Vitest can exercise
// component structure/accessibility props with react-test-renderer without
// touching react-native's real internals. It is wired in only via
// vitest.config.mts's resolve.alias; the real Expo/Metro build (pnpm build)
// never sees this file and always uses the real react-native package.
// TypeScript still checks call sites against the real react-native types,
// since aliasing is a Vitest/Vite runtime concern only.

export const View = 'RN_View';
export const Text = 'RN_Text';
export const Pressable = 'RN_Pressable';
export const ScrollView = 'RN_ScrollView';
export const TextInput = 'RN_TextInput';
export const ActivityIndicator = 'RN_ActivityIndicator';

export const StyleSheet = {
  create<T extends Record<string, unknown>>(styles: T): T {
    return styles;
  },
};

export const Platform = {
  OS: 'ios' as const,
  select<T>(spec: { ios?: T; android?: T; default?: T }): T | undefined {
    return spec.ios ?? spec.default;
  },
};

export function useColorScheme(): 'light' | 'dark' | null {
  return 'light';
}
