import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const appSourcePath = fileURLToPath(new URL('../App.tsx', import.meta.url));
const indexSourcePath = fileURLToPath(new URL('../index.ts', import.meta.url));
const packageJsonPath = fileURLToPath(new URL('../package.json', import.meta.url));
const appJsonPath = fileURLToPath(new URL('../app.json', import.meta.url));

describe('mobile local-development shell boundary', () => {
  it('renders only the static local synthetic development build label', () => {
    const source = readFileSync(appSourcePath, 'utf8');

    expect(source).toMatch(/local synthetic development build/i);
  });

  it('requests no platform permission and makes no network call', () => {
    const source = [appSourcePath, indexSourcePath].map((path) => readFileSync(path, 'utf8'));
    const forbiddenPatterns = [
      /requestPermission/i,
      /Permissions\./,
      /fetch\(/,
      /XMLHttpRequest/,
      /http:\/\//,
      /https:\/\//,
      /firebase/i,
      /notification/i,
      /pharmacy/i,
      /medicine/i,
      /prescription/i,
      /reservation/i,
    ];

    for (const fileSource of source) {
      for (const pattern of forbiddenPatterns) {
        expect(fileSource).not.toMatch(pattern);
      }
    }
  });

  it('declares no dependency on the api package', () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

    expect(Object.keys(allDeps)).not.toContain('@medifind/api');
  });

  it('does not declare a custom icon, splash or public-release configuration', () => {
    const appJson = JSON.parse(readFileSync(appJsonPath, 'utf8')) as {
      expo: Record<string, unknown>;
    };

    expect(appJson.expo.icon).toBeUndefined();
    expect(appJson.expo.splash).toBeUndefined();
  });
});
