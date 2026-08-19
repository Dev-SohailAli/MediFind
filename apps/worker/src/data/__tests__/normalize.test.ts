import { describe, expect, it } from 'vitest';

import { normalizeText, tokenizeWords } from '../normalize.js';

describe('normalizeText', () => {
  it('trims, lowercases and collapses internal whitespace', () => {
    expect(normalizeText('  Nivaprin   Rapid  ')).toBe('nivaprin rapid');
  });

  it('strips only harmless punctuation', () => {
    expect(normalizeText('Calorex Relief, (Alt.)')).toBe('calorex relief alt');
  });

  it('leaves an already-normalized value unchanged', () => {
    expect(normalizeText('bentholine relief')).toBe('bentholine relief');
  });
});

describe('tokenizeWords', () => {
  it('splits on single spaces and drops empty tokens', () => {
    expect(tokenizeWords('bentholine relief')).toEqual(['bentholine', 'relief']);
  });

  it('returns an empty array for an empty string', () => {
    expect(tokenizeWords('')).toEqual([]);
  });
});
