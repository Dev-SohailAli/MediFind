// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { DARK_COLORS, LIGHT_COLORS, minimumTouchTarget, spacing } from '../tokens';

const cssPath = fileURLToPath(new URL('../../styles/global.css', import.meta.url));

describe('design tokens stay in sync with global.css', () => {
  const css = readFileSync(cssPath, 'utf8');

  it('every light colour token value appears as a CSS custom property', () => {
    for (const hex of Object.values(LIGHT_COLORS)) {
      expect(css.toLowerCase()).toContain(hex.toLowerCase());
    }
  });

  it('every dark colour token value appears as a CSS custom property', () => {
    for (const hex of Object.values(DARK_COLORS)) {
      expect(css.toLowerCase()).toContain(hex.toLowerCase());
    }
  });

  it('the dark palette only applies under prefers-color-scheme: dark, never as the only definition', () => {
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)/);
  });

  it('the minimum touch target is expressed as 48px in the CSS custom property', () => {
    expect(css).toContain(`--min-target: ${minimumTouchTarget}px`);
  });

  it('spacing scale values appear as CSS custom properties in px', () => {
    for (const value of Object.values(spacing)) {
      expect(css).toContain(`${value}px`);
    }
  });
});
