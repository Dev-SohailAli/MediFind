import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  PACKAGE_BOUNDARY,
  parsePublicSearchResponse,
  parsePublicSearchResultItem,
} from '../index.js';

const packageJsonPath = fileURLToPath(new URL('../../package.json', import.meta.url));
const indexSourcePath = fileURLToPath(new URL('../index.ts', import.meta.url));

describe('contracts package boundary', () => {
  it('exposes the anonymous package boundary constant', () => {
    expect(PACKAGE_BOUNDARY).toBe('contracts');
  });

  it('declares no runtime dependency', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
    };

    expect(pkg.dependencies ?? {}).toEqual({});
  });

  it('exposes only type-level exports plus the two allow-listed runtime parsers', () => {
    const source = readFileSync(indexSourcePath, 'utf8');

    // Every runtime export in this package must be the anonymous
    // PACKAGE_BOUNDARY constant or one of the two Task 2 public-contract
    // parser functions. No other function, class or fixture data may be
    // exported from this package.
    const exportLines = source.split('\n').filter((line) => line.trimStart().startsWith('export '));

    for (const line of exportLines) {
      const isAllowed =
        line.includes('export type') ||
        line.includes('export interface') ||
        line.includes('export const PACKAGE_BOUNDARY') ||
        line.includes('export function parsePublicSearchResultItem') ||
        line.includes('export function parsePublicSearchResponse');

      expect(isAllowed).toBe(true);
    }
  });

  it('exposes exactly the two allow-listed public-contract parser functions', () => {
    expect(typeof parsePublicSearchResultItem).toBe('function');
    expect(typeof parsePublicSearchResponse).toBe('function');
  });

  it('contains no HTTP schema, persistence schema, role, credential, prescription or reservation content', () => {
    const source = readFileSync(indexSourcePath, 'utf8');
    const forbiddenPatterns = [
      /prescription/i,
      /reservation/i,
      /\brole\b/i,
      /credential/i,
      /secret/i,
      /endpoint/i,
      /\/v1/,
      /fetch\(/,
      /http:\/\//,
      /https:\/\//,
      /XMLHttpRequest/,
    ];

    for (const pattern of forbiddenPatterns) {
      expect(source).not.toMatch(pattern);
    }
  });

  it('does not contain a real/realistic medicine or pharmacy fixture value (types only)', () => {
    const source = readFileSync(indexSourcePath, 'utf8');

    // This package holds field-name types only, never fixture data. A
    // string literal fixture value would indicate a data leak into the
    // shared contract, which the Task 2 specification prohibits.
    expect(source).not.toMatch(/:\s*["'][A-Za-z]/);
  });
});
