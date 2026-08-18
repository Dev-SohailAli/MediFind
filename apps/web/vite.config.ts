import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

import { pwaManifest } from './src/pwa-manifest.ts';

/**
 * Local synthetic development build only. The fixture-backed mode is the
 * default. An explicit VITE_MEDIFIND_SEARCH_MODE=worker opt-in may proxy the
 * read-only local Worker routes during development; production builds keep
 * the fixture-safe default unless that variable is deliberately supplied.
 */
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-any.svg'],
      manifest: pwaManifest,
      workbox: {
        // Precache only the built static app shell (HTML/JS/CSS/icons). The
        // The default fixture-backed app has no runtime data to cache. The
        // opt-in Worker adapter is deliberately not runtime-cached, so a
        // stale or unavailable API response cannot become app state.
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    proxy: {
      '/v1': 'http://127.0.0.1:8787',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-support/setup-tests.ts'],
    include: ['src/**/*.test.{ts,tsx}', '__tests__/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
    css: false,
  },
});
