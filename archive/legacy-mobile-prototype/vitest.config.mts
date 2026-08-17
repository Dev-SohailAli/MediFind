import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'react-native': fileURLToPath(
        new URL('./test-support/react-native-shim.ts', import.meta.url),
      ),
    },
  },
  test: {
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
});
