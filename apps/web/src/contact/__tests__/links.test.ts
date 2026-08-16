import { describe, expect, it } from 'vitest';

import { buildDirectionsHref, buildTelHref } from '../links';

describe('buildTelHref', () => {
  it('strips spaces and the synthetic label down to a dialable tel: URI', () => {
    expect(buildTelHref('+679 330 0142 (synthetic)')).toBe('tel:+6793300142');
  });
});

describe('buildDirectionsHref', () => {
  it('builds a geo: URI carrying the coordinates and an encoded label', () => {
    expect(buildDirectionsHref(-18.1416, 178.42, 'Solandra Pharmacy (synthetic)')).toBe(
      'geo:-18.1416,178.42?q=-18.1416,178.42(Solandra%20Pharmacy%20(synthetic))',
    );
  });

  it('never produces an http(s) URL', () => {
    const href = buildDirectionsHref(-18.1, 178.4, 'Test Pharmacy');
    expect(href).not.toMatch(/https?:\/\//);
    expect(href.startsWith('geo:')).toBe(true);
  });
});
