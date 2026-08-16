import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

import { pwaManifest } from './src/pwa-manifest.ts';

/**
 * Local synthetic development build only. No environment variable, base
 * path, proxy or backend target is configured because this app makes no
 * network request and is never deployed by this task.
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
        // app performs no network request and has nothing else to cache;
        // there is no runtime-caching entry because there is no API or
        // remote asset to intercept.
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
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-support/setup-tests.ts'],
    include: ['src/**/*.test.{ts,tsx}', '__tests__/**/*.test.{ts,tsx}'],
    css: false,
  },
});
