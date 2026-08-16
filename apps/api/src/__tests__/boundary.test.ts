import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { PACKAGE_BOUNDARY } from '../index.js';

const packageJsonPath = fileURLToPath(new URL('../../package.json', import.meta.url));
const srcDir = fileURLToPath(new URL('..', import.meta.url));

function readAllSourceFiles(): string {
  return readdirSync(srcDir, { recursive: true, withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && entry.name.endsWith('.ts') && !entry.parentPath.includes('__tests__'),
    )
    .map((entry) => readFileSync(`${entry.parentPath}/${entry.name}`, 'utf8'))
    .join('\n');
}

describe('api package boundary', () => {
  it('exposes only an anonymous, non-domain package export', () => {
    expect(PACKAGE_BOUNDARY).toBe('api');
  });

  it('declares no runtime, cloud SDK or database dependency', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
    };

    expect(pkg.dependencies ?? {}).toEqual({});
  });

  it('starts no listener, exposes no route and initialises no provider', () => {
    const source = readAllSourceFiles();
    const forbiddenPatterns = [
      /\.listen\(/,
      /createServer\(/,
      /fastify\(/i,
      /\/v1/,
      /firebase/i,
      /firestore/i,
      /admin\.initializeApp/,
      /fetch\(/,
      /http:\/\//,
      /https:\/\//,
    ];

    for (const pattern of forbiddenPatterns) {
      expect(source).not.toMatch(pattern);
    }
  });
});
