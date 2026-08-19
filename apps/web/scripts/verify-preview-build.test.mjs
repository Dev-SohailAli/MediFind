// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { inspectPreviewBuild } from './verify-preview-build.mjs';

const VALID_INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta name="robots" content="noindex, nofollow" />
    <meta
      name="description"
      content="Local synthetic development build of the MediFind buyer-search prototype. No real pharmacy, medicine, account or prescription data."
    />
    <link rel="manifest" href="/manifest.webmanifest" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="/assets/index-abc123.js"></script>
  </body>
</html>
`;

const VALID_MANIFEST = {
  name: 'MediFind (synthetic local development build)',
  short_name: 'MediFind Dev',
  description:
    'Local synthetic development build of the MediFind buyer-search prototype. No real pharmacy, medicine, account or prescription data.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  theme_color: '#C67139',
  background_color: '#F5EAD8',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    {
      src: 'icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

const VALID_HEADERS = '/*\n  X-Robots-Tag: noindex, nofollow\n';
const VALID_ROBOTS = 'User-agent: *\nDisallow: /\n';
const VALID_SW = `precacheAndRoute([{url:"/assets/index-abc123.js",revision:null}], {});\nregisterRoute(new e.NavigationRoute());\n`;
const VALID_WORKBOX = '// generated workbox runtime\n';

// Bundled-but-unused Worker adapter source may legitimately appear in a real
// asset bundle; the guard must not reject it merely for being present.
const UNUSED_WORKER_ADAPTER_JS = `
export function isWorkerSearchMode(){return false}
export async function fetchWorkerSearch(){return fetch('/v1/search?query=x')}
`;

let dir;

function writeFile(relativePath, content) {
  const full = join(dir, relativePath);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(full, content);
}

function buildValidFixture() {
  writeFile('index.html', VALID_INDEX_HTML);
  writeFile('manifest.webmanifest', JSON.stringify(VALID_MANIFEST));
  writeFile('_headers', VALID_HEADERS);
  writeFile('robots.txt', VALID_ROBOTS);
  writeFile('sw.js', VALID_SW);
  writeFile('workbox-abc123.js', VALID_WORKBOX);
  writeFile('icons/icon-192.png', Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  writeFile('icons/icon-512.png', Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  writeFile('icons/icon-maskable-512.png', Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  writeFile('assets/index-abc123.js', UNUSED_WORKER_ADAPTER_JS);
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'medifind-preview-guard-'));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('inspectPreviewBuild — accepts the valid default artifact', () => {
  it('returns ok:true with buildMode fixture-default for a complete valid tree', () => {
    buildValidFixture();

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(true);
    expect(result.buildMode).toBe('fixture-default');
    expect(result.checks).toEqual(
      expect.arrayContaining([
        'build-mode',
        'shell-present',
        'manifest-present',
        'service-worker-present',
        'icons-present',
        'noindex-policy',
        'synthetic-identity',
        'capability-boundary',
      ]),
    );
  });

  it('also accepts an empty-string search mode as fixture-default', () => {
    buildValidFixture();

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: '' });

    expect(result.ok).toBe(true);
    expect(result.buildMode).toBe('fixture-default');
  });

  it('tolerates the bundled, unused Worker adapter /v1/search string in a JS asset', () => {
    buildValidFixture();

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(true);
  });
});

describe('inspectPreviewBuild — build mode safety', () => {
  it('rejects an explicit worker-mode build as not-a-Pages-preview-artifact', () => {
    buildValidFixture();

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: 'worker' });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'explicit-worker-mode-not-pages-preview' }),
      ]),
    );
  });

  it('rejects any other unrecognized non-empty search mode', () => {
    buildValidFixture();

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: 'staging' });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'unsupported-search-mode' })]),
    );
  });
});

describe('inspectPreviewBuild — required shell and PWA assets', () => {
  it('fails with missing-shell when index.html is missing', () => {
    buildValidFixture();
    rmSync(join(dir, 'index.html'));

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-shell' })]),
    );
  });

  it('fails with missing-manifest when manifest.webmanifest is missing', () => {
    buildValidFixture();
    rmSync(join(dir, 'manifest.webmanifest'));

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-manifest' })]),
    );
  });

  it('fails with missing-service-worker when sw.js is missing', () => {
    buildValidFixture();
    rmSync(join(dir, 'sw.js'));

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-service-worker' })]),
    );
  });

  it('fails with missing-service-worker when no workbox-*.js runtime file exists', () => {
    buildValidFixture();
    rmSync(join(dir, 'workbox-abc123.js'));

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-service-worker' })]),
    );
  });

  it('fails with missing-icon when a manifest-referenced icon is missing', () => {
    buildValidFixture();
    rmSync(join(dir, 'icons', 'icon-maskable-512.png'));

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-icon' })]),
    );
  });
});

describe('inspectPreviewBuild — no-index policy and synthetic identity', () => {
  it('fails with missing-noindex-policy when _headers loses its X-Robots-Tag rule', () => {
    buildValidFixture();
    writeFile('_headers', '/*\n  Cache-Control: no-store\n');

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-noindex-policy' })]),
    );
  });

  it('fails with missing-noindex-policy when robots.txt no longer disallows crawling', () => {
    buildValidFixture();
    writeFile('robots.txt', 'User-agent: *\nAllow: /\n');

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-noindex-policy' })]),
    );
  });

  it('fails with missing-synthetic-identity when the manifest description drops the synthetic wording', () => {
    buildValidFixture();
    writeFile(
      'manifest.webmanifest',
      JSON.stringify({ ...VALID_MANIFEST, name: 'MediFind', description: 'Find medicines fast.' }),
    );

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'missing-synthetic-identity' })]),
    );
  });
});

describe('inspectPreviewBuild — emitted capability boundary', () => {
  it('fails with forbidden-env-file when a .env file is emitted', () => {
    buildValidFixture();
    writeFile('.env', 'SECRET=1\n');

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'forbidden-env-file' })]),
    );
  });

  it('fails with forbidden-d1-binding when D1 binding configuration text is emitted', () => {
    buildValidFixture();
    writeFile('assets/config-abc123.js', 'const config = { d1_databases: ["synthetic"] };');

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'forbidden-d1-binding' })]),
    );
  });

  it('fails with forbidden-pages-function when a functions/ directory is emitted', () => {
    buildValidFixture();
    writeFile('functions/api/[[path]].js', 'export function onRequest(){}');

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'forbidden-pages-function' })]),
    );
  });

  it('fails with forbidden-api-proxy when _redirects proxies to an external origin', () => {
    buildValidFixture();
    writeFile('_redirects', '/api/* https://medifind-worker.example.workers.dev/:splat 200\n');

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'forbidden-api-proxy' })]),
    );
  });

  it('fails with forbidden-analytics when an analytics SDK marker is emitted', () => {
    buildValidFixture();
    writeFile('assets/telemetry-abc123.js', "gtag('config', 'UA-XXXX');");

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'forbidden-analytics' })]),
    );
  });

  it('fails with forbidden-cookie-write when a cookie write is emitted', () => {
    buildValidFixture();
    writeFile('assets/tracking-abc123.js', 'document.cookie = "id=1";');

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'forbidden-cookie-write' })]),
    );
  });

  it('fails with forbidden-client-storage when a client persistence write is emitted', () => {
    buildValidFixture();
    writeFile('assets/persist-abc123.js', "localStorage.setItem('token', 'x');");

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'forbidden-client-storage' })]),
    );
  });

  it('fails with forbidden-inline-api-script when index.html calls /v1/ directly', () => {
    buildValidFixture();
    writeFile(
      'index.html',
      VALID_INDEX_HTML.replace('<body>', "<body><script>fetch('/v1/search')</script>"),
    );

    const result = inspectPreviewBuild({ distDirectory: dir, searchMode: undefined });

    expect(result.ok).toBe(false);
    expect(result.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'forbidden-inline-api-script' })]),
    );
  });
});

describe('inspectPreviewBuild — source/dist policy drift', () => {
  it('accepts matching source and dist policy files', () => {
    buildValidFixture();
    const sourceDir = mkdtempSync(join(tmpdir(), 'medifind-preview-guard-source-'));
    try {
      mkdirSync(join(sourceDir, 'public'), { recursive: true });
      writeFileSync(join(sourceDir, 'public', '_headers'), VALID_HEADERS);
      writeFileSync(join(sourceDir, 'public', 'robots.txt'), VALID_ROBOTS);

      const result = inspectPreviewBuild({
        distDirectory: dir,
        sourceDirectory: sourceDir,
        searchMode: undefined,
      });

      expect(result.ok).toBe(true);
    } finally {
      rmSync(sourceDir, { recursive: true, force: true });
    }
  });

  it('fails with noindex-policy-drift when dist/_headers no longer matches the source file', () => {
    buildValidFixture();
    const sourceDir = mkdtempSync(join(tmpdir(), 'medifind-preview-guard-source-'));
    try {
      mkdirSync(join(sourceDir, 'public'), { recursive: true });
      writeFileSync(
        join(sourceDir, 'public', '_headers'),
        '/*\n  X-Robots-Tag: noindex, nofollow\n  X-Frame-Options: DENY\n',
      );
      writeFileSync(join(sourceDir, 'public', 'robots.txt'), VALID_ROBOTS);

      const result = inspectPreviewBuild({
        distDirectory: dir,
        sourceDirectory: sourceDir,
        searchMode: undefined,
      });

      expect(result.ok).toBe(false);
      expect(result.failures).toEqual(
        expect.arrayContaining([expect.objectContaining({ code: 'noindex-policy-drift' })]),
      );
    } finally {
      rmSync(sourceDir, { recursive: true, force: true });
    }
  });
});
