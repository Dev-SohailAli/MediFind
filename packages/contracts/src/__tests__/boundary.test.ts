import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { PACKAGE_BOUNDARY } from '../index.js';

const packageJsonPath = fileURLToPath(new URL('../../package.json', import.meta.url));
const indexSourcePath = fileURLToPath(new URL('../index.ts', import.meta.url));

describe('contracts package boundary', () => {
  it('exposes only an anonymous, non-domain package export', () => {
    expect(PACKAGE_BOUNDARY).toBe('contracts');
  });

  it('declares no runtime dependency', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
    };

    expect(pkg.dependencies ?? {}).toEqual({});
  });

  it('contains no domain schema, role, state enum or server credential', () => {
    const source = readFileSync(indexSourcePath, 'utf8');
    const forbiddenPatterns = [
      /firebase/i,
      /firestore/i,
      /prescription/i,
      /pharmacy/i,
      /medicine/i,
      /reservation/i,
      /role/i,
      /credential/i,
      /secret/i,
      /fetch\(/,
      /http:\/\//,
      /https:\/\//,
    ];

    for (const pattern of forbiddenPatterns) {
      expect(source).not.toMatch(pattern);
    }
  });
});
