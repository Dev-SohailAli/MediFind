import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { PACKAGE_BOUNDARY } from '../index.js';

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

  it('exposes only type-level exports (no runtime logic)', () => {
    const source = readFileSync(indexSourcePath, 'utf8');

    // Every export in this package must be `type`/`interface`, plus the
    // single anonymous PACKAGE_BOUNDARY constant from Task 1. No function,
    // class or fixture data may be exported from this package.
    const exportLines = source.split('\n').filter((line) => line.trimStart().startsWith('export '));

    for (const line of exportLines) {
      const isAllowed =
        line.includes('export type') ||
        line.includes('export interface') ||
        line.includes('export const PACKAGE_BOUNDARY');

      expect(isAllowed).toBe(true);
    }
  });

  it('contains no HTTP schema, persistence schema, role, credential, prescription or reservation content', () => {
    const source = readFileSync(indexSourcePath, 'utf8');
    const forbiddenPatterns = [
      /firebase/i,
      /firestore/i,
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
