import { useColorScheme } from 'react-native';

import { type ColorTokens, getColorTokens } from './tokens';

export function useThemeColors(): ColorTokens {
  const scheme = useColorScheme();
  return getColorTokens(scheme === 'dark' ? 'dark' : 'light');
}
