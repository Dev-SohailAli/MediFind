import { describe, expect, it } from 'vitest';

import { normalizeText, tokenize } from '../normalize';

describe('normalizeText', () => {
  it('trims, lowercases and collapses whitespace', () => {
    expect(normalizeText('  Nivaprin   Tablets  ')).toBe('nivaprin tablets');
  });

  it('strips harmless punctuation without merging tokens', () => {
    expect(normalizeText('Nivaprin, Tablets!!')).toBe('nivaprin tablets');
    expect(normalizeText('Nivaprin (500mg)')).toBe('nivaprin 500mg');
  });

  it('produces the same normalized value for case/whitespace/punctuation variants', () => {
    const variants = ['Nivaprin', 'nivaprin', '  NIVAPRIN  ', 'Nivaprin.', 'Nivaprin!'];
    const normalized = variants.map(normalizeText);

    expect(new Set(normalized).size).toBe(1);
    expect(normalized[0]).toBe('nivaprin');
  });

  it('returns an empty string for whitespace-only input', () => {
    expect(normalizeText('   ')).toBe('');
  });
});

describe('tokenize', () => {
  it('splits on single spaces and drops empty tokens', () => {
    expect(tokenize('nivaprin tablets')).toEqual(['nivaprin', 'tablets']);
    expect(tokenize('')).toEqual([]);
  });
});
