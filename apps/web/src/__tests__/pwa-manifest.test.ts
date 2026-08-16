// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { pwaManifest } from '../pwa-manifest';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

describe('pwaManifest', () => {
  it('names the app as a synthetic local development build, never a production app', () => {
    expect(pwaManifest.name).toMatch(/synthetic/i);
    expect(pwaManifest.name).toMatch(/local development/i);
    expect(pwaManifest.description).toMatch(
      /no real pharmacy, medicine, account or prescription data/i,
    );
  });

  it('is installable in standalone display with a defined start_url and scope', () => {
    expect(pwaManifest.display).toBe('standalone');
    expect(pwaManifest.start_url).toBe('/');
    expect(pwaManifest.scope).toBe('/');
  });

  it('declares at least a 192px and a 512px icon, plus a maskable icon', () => {
    const sizes = (pwaManifest.icons ?? []).map((icon) => icon.sizes);
    expect(sizes).toContain('192x192');
    expect(sizes).toContain('512x512');
    expect((pwaManifest.icons ?? []).some((icon) => icon.purpose === 'maskable')).toBe(true);
  });

  it('every referenced icon file actually exists in public/', () => {
    for (const icon of pwaManifest.icons ?? []) {
      expect(existsSync(`${publicDir}${icon.src}`)).toBe(true);
    }
  });

  it('uses the approved primary/canvas design tokens for theme_color/background_color', () => {
    expect(pwaManifest.theme_color).toBe('#0F766E');
    expect(pwaManifest.background_color).toBe('#F7FAFC');
  });
});
