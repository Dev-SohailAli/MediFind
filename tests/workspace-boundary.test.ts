import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

describe('task-1 workspace boundary', () => {
  it('declares exactly the four approved package boundaries', () => {
    const appDirs = readdirSync(`${repoRoot}/apps`).sort();
    const packageDirs = readdirSync(`${repoRoot}/packages`).sort();

    expect(appDirs).toEqual(['api', 'mobile', 'web']);
    expect(packageDirs).toEqual(['config', 'contracts']);
  });

  it('scopes the pnpm workspace to apps/* and packages/* only', () => {
    const workspaceManifest = readFileSync(`${repoRoot}/pnpm-workspace.yaml`, 'utf8');

    expect(workspaceManifest).toContain('apps/*');
    expect(workspaceManifest).toContain('packages/*');
  });

  it('pins Node.js 24 LTS and pnpm 11.22.0', () => {
    const rootPackageJson = JSON.parse(readFileSync(`${repoRoot}/package.json`, 'utf8')) as {
      engines?: { node?: string };
      packageManager?: string;
    };
    const nodeVersionFile = readFileSync(`${repoRoot}/.node-version`, 'utf8').trim();

    expect(nodeVersionFile).toMatch(/^24\./);
    expect(rootPackageJson.engines?.node).toMatch(/^24\./);
    expect(rootPackageJson.packageManager).toBe('pnpm@11.22.0');
  });

  it('contains no domain fixture, secret file or cloud configuration at the repository root', () => {
    const rootEntries = readdirSync(repoRoot);

    expect(rootEntries).not.toContain('.env');
    expect(rootEntries).not.toContain('firebase.json');
    expect(rootEntries).not.toContain('.firebaserc');
  });
});
