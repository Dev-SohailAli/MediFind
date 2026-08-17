import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { PACKAGE_BOUNDARY, ROUTES } from '../index.js';

const packageJsonPath = fileURLToPath(new URL('../../package.json', import.meta.url));
const srcDir = fileURLToPath(new URL('..', import.meta.url));

/**
 * Every non-test source file, excluding `security/audit.ts`: its redaction
 * denylist must legitimately name "prescription"/"phone"/etc. as forbidden
 * *audit field names*, which is the opposite of implementing that domain.
 */
function readAllSourceFiles(): string {
  return readdirSync(srcDir, { recursive: true, withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.ts') &&
        !entry.parentPath.includes('__tests__') &&
        `${entry.parentPath}/${entry.name}` !== `${srcDir}security/audit.ts`,
    )
    .map((entry) => readFileSync(`${entry.parentPath}/${entry.name}`, 'utf8'))
    .join('\n');
}

describe('Cloudflare Worker package boundary (Task 3 foundation)', () => {
  it('exposes the anonymous, non-domain package export', () => {
    expect(PACKAGE_BOUNDARY).toBe('worker');
  });

  it('declares no runtime dependency (no Cloudflare SDK, no HTTP framework)', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
    };

    expect(pkg.dependencies ?? {}).toEqual({});
  });

  it('implements only the exact foundation route approved by docs/v1-api-endpoint-inventory.md', () => {
    expect(ROUTES).toEqual([{ method: 'GET', path: '/v1/health', action: 'health:read' }]);
  });

  it('never implements a pharmacy, reservation, prescription, payment or delivery capability', () => {
    const source = readAllSourceFiles();
    const forbiddenDomainPatterns = [
      /reservation/i,
      /prescription/i,
      /pharmacy/i,
      /payment/i,
      /delivery/i,
      /\/v1\/(search|listings|verify|staff)/i,
    ];

    for (const pattern of forbiddenDomainPatterns) {
      expect(source).not.toMatch(pattern);
    }
  });

  it('never imports a native/mobile, Firebase/GCP or Cloudflare account SDK', () => {
    const source = readAllSourceFiles();
    const forbiddenImportPatterns = [
      /from ['"]expo/i,
      /from ['"]react-native/i,
      /from ['"]firebase/i,
      /from ['"]@google-cloud/i,
      /from ['"]@cloudflare\/workers-types/i,
      /from ['"]cloudflare:/i,
    ];

    for (const pattern of forbiddenImportPatterns) {
      expect(source).not.toMatch(pattern);
    }
  });

  it('never issues an outbound network call from the Worker (no fetch()/XHR/WebSocket calls)', () => {
    const source = readAllSourceFiles();

    expect(source).not.toMatch(/\bfetch\(['"]/);
    expect(source).not.toMatch(/XMLHttpRequest/);
    expect(source).not.toMatch(/new WebSocket\(/);
  });

  it('accesses D1 only through the fail-closed seam, never with an inline mutation/DDL statement', () => {
    const source = readAllSourceFiles();

    expect(source).not.toMatch(/CREATE TABLE/i);
    expect(source).not.toMatch(/INSERT INTO/i);
    expect(source).not.toMatch(/UPDATE .* SET/i);
    expect(source).not.toMatch(/DELETE FROM/i);
  });
});
