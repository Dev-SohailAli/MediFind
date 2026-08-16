import type { ManifestOptions } from 'vite-plugin-pwa';

/**
 * The installable PWA manifest. Extracted from vite.config.ts so it has a
 * deterministic unit test (src/__tests__/pwa-manifest.test.ts) independent
 * of running a full Vite build. Every icon referenced here is a generated
 * placeholder (see scripts/generate-icons.mjs) — never a designed
 * logo/illustration.
 */
export const pwaManifest: Partial<ManifestOptions> = {
  name: 'MediFind (synthetic local development build)',
  short_name: 'MediFind Dev',
  description:
    'Local synthetic development build of the MediFind buyer-search prototype. No real pharmacy, medicine, account or prescription data.',
  lang: 'en',
  theme_color: '#C67139',
  background_color: '#F5EAD8',
  display: 'standalone',
  scope: '/',
  start_url: '/',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    {
      src: 'icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};
