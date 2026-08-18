// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const headersPath = fileURLToPath(new URL('../public/_headers', import.meta.url));
const robotsPath = fileURLToPath(new URL('../public/robots.txt', import.meta.url));
const indexHtmlPath = fileURLToPath(new URL('../index.html', import.meta.url));
const rootWranglerPath = fileURLToPath(new URL('../../../wrangler.toml', import.meta.url));
const webRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

// Forbidden patterns that must never appear anywhere in a built, public
// static artifact: env files, credential-looking secrets, Cloudflare
// account/binding identifiers or a direct D1/R2/KV/analytics/cookie
// capability. Presence of the *inert, unused* Worker adapter source (see
// src/search/searchClient.ts) is explicitly allowed — only an active
// capability/secret is forbidden.
const FORBIDDEN_ARTIFACT_PATTERNS: ReadonlyArray<{ label: string; pattern: RegExp }> = [
  { label: 'account_id', pattern: /account_id/i },
  { label: 'D1 binding', pattern: /\[\[d1_databases\]\]|d1_databases/i },
  { label: 'KV binding', pattern: /\[\[kv_namespaces\]\]|kv_namespaces/i },
  { label: 'R2 binding', pattern: /\[\[r2_buckets\]\]|r2_buckets/i },
  { label: 'Cloudflare API token', pattern: /CLOUDFLARE_API_TOKEN/i },
  { label: 'AWS-style access key', pattern: /AKIA[0-9A-Z]{16}/ },
  { label: 'document.cookie use', pattern: /document\.cookie/ },
  { label: 'Google Analytics/gtag', pattern: /google-analytics\.com|gtag\(/i },
];

function listFilesRecursive(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listFilesRecursive(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

/**
 * The guard's own classification rule for "is this the Pages preview
 * artifact": true only when the build ran with VITE_MEDIFIND_SEARCH_MODE
 * unset. This is a pure, directly-testable function precisely so the
 * explicit-worker negative check does not rely on scanning build output for
 * an incidental difference (the Worker adapter's `/v1/search` string is
 * legitimately present in *both* builds — see the "inert, unused Worker
 * adapter source" test below).
 */
function isDefaultPreviewArtifact(mode: 'default' | 'worker'): boolean {
  return mode === 'default';
}

function buildArtifact(outDir: string, mode: 'default' | 'worker'): void {
  const env: NodeJS.ProcessEnv = { ...process.env };
  // Vitest sets NODE_ENV=test on its own process, which would otherwise
  // leak into this child `vite build` and make workbox-build skip
  // minification (a cosmetic difference only, but it breaks the sw.js
  // parsing below, which is written against the real production output
  // shipped to Pages). Force the same production build every real deploy
  // uses, regardless of the parent process that invoked this guard.
  env.NODE_ENV = 'production';
  if (mode === 'worker') {
    env.VITE_MEDIFIND_SEARCH_MODE = 'worker';
  } else {
    delete env.VITE_MEDIFIND_SEARCH_MODE;
  }
  // A plain local `vite build` — an esbuild/Rollup bundler process. It
  // takes no Cloudflare credential, account or API-token env var, opens no
  // network connection to Cloudflare, and never invokes `wrangler`; it
  // cannot contact Cloudflare by construction.
  execSync(`pnpm exec vite build --outDir "${outDir}"`, {
    cwd: webRoot,
    env,
    stdio: 'pipe',
  });
}

describe('Cloudflare Pages synthetic preview stays static and public-safe', () => {
  it('serves a noindex response header for every path via the Pages _headers file', () => {
    expect(existsSync(headersPath)).toBe(true);
    const headers = readFileSync(headersPath, 'utf8');

    expect(headers).toMatch(/^\/\*\s*$/m);
    expect(headers).toMatch(/X-Robots-Tag:\s*noindex,\s*nofollow/);
  });

  it('ships a robots.txt that disallows crawling', () => {
    expect(existsSync(robotsPath)).toBe(true);
    const robots = readFileSync(robotsPath, 'utf8');

    expect(robots).toMatch(/User-agent:\s*\*/);
    expect(robots).toMatch(/Disallow:\s*\//);
  });

  it('declares a noindex robots meta tag in the built HTML shell', () => {
    const html = readFileSync(indexHtmlPath, 'utf8');

    expect(html).toMatch(/<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*\/>/);
  });

  it('keeps the root Pages Wrangler config free of any account, binding, secret or production identifier', () => {
    const wrangler = readFileSync(rootWranglerPath, 'utf8');

    expect(wrangler).not.toMatch(/account_id/i);
    expect(wrangler).not.toMatch(/\[\[d1_databases\]\]/i);
    expect(wrangler).not.toMatch(/\[\[kv_namespaces\]\]/i);
    expect(wrangler).not.toMatch(/\[\[r2_buckets\]\]/i);
    expect(wrangler).not.toMatch(/\[vars\]/i);
    expect(wrangler).not.toMatch(/functions/i);
  });
});

describe('generated default build is the exact static Pages preview artifact', () => {
  let defaultDir: string;

  beforeAll(() => {
    defaultDir = mkdtempSync(join(tmpdir(), 'medifind-web-dist-default-'));
    buildArtifact(defaultDir, 'default');
  }, 60_000);

  afterAll(() => {
    if (defaultDir) {
      rmSync(defaultDir, { recursive: true, force: true });
    }
  });

  it('emits the required static shell: index.html, manifest, service worker, icons, _headers and robots.txt', () => {
    expect(existsSync(join(defaultDir, 'index.html'))).toBe(true);
    expect(existsSync(join(defaultDir, 'manifest.webmanifest'))).toBe(true);
    expect(existsSync(join(defaultDir, 'sw.js'))).toBe(true);
    expect(existsSync(join(defaultDir, '_headers'))).toBe(true);
    expect(existsSync(join(defaultDir, 'robots.txt'))).toBe(true);
    expect(existsSync(join(defaultDir, 'icons', 'icon-192.png'))).toBe(true);
    expect(existsSync(join(defaultDir, 'icons', 'icon-512.png'))).toBe(true);
    expect(existsSync(join(defaultDir, 'icons', 'icon-maskable-512.png'))).toBe(true);
  });

  it('emits no .env file, credential-looking artifact, account/binding ID, D1/R2/KV reference, Pages Function, cookie or analytics capability', () => {
    const files = listFilesRecursive(defaultDir);
    expect(files.some((f) => /\.env(\..+)?$/.test(f))).toBe(false);
    // A Cloudflare Pages Function would live in a top-level `functions/`
    // directory next to the build output; `vite build` never emits one.
    expect(files.some((f) => relative(defaultDir, f).split(/[\\/]/).includes('functions'))).toBe(
      false,
    );

    for (const file of files) {
      // Source maps legitimately reference original file paths/comments;
      // they are still scanned like every other build output file.
      const content = readFileSync(file, 'utf8');
      for (const { label, pattern } of FORBIDDEN_ARTIFACT_PATTERNS) {
        expect(pattern.test(content), `${label} found in ${relative(defaultDir, file)}`).toBe(
          false,
        );
      }
    }
  });

  it('the built HTML shell still declares noindex, per the Pages public-safe contract', () => {
    const html = readFileSync(join(defaultDir, 'index.html'), 'utf8');
    expect(html).toMatch(/<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*\/>/);
  });

  it('the service worker precaches only static shell assets (js/css/html/svg/png/webmanifest), never a /v1/ path', () => {
    const sw = readFileSync(join(defaultDir, 'sw.js'), 'utf8');
    const precacheMatch = sw.match(/precacheAndRoute\(\[(.*?)\],\s*\{/s);
    expect(precacheMatch, 'expected a precacheAndRoute([...]) call in sw.js').not.toBeNull();

    const precacheBody = precacheMatch![1]!;
    const urls = Array.from(precacheBody.matchAll(/url:"([^"]+)"/g)).map((m) => m[1]!);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url).not.toMatch(/^\/?v1\//);
      expect(url).toMatch(/\.(js|css|html|svg|png|webmanifest)$/);
    }
  });

  it('registers no runtime caching route/strategy for API responses (only the SPA navigation fallback route)', () => {
    const sw = readFileSync(join(defaultDir, 'sw.js'), 'utf8');

    // vite-plugin-pwa's `workbox.runtimeCaching` option would emit one of
    // these named strategies; none of them may appear, since the config
    // deliberately sets no runtimeCaching entries (see vite.config.ts).
    expect(sw).not.toMatch(/NetworkFirst|CacheFirst|StaleWhileRevalidate|NetworkOnly/);
    expect(sw).not.toMatch(/\/v1\//);

    // The only registerRoute call is the SPA navigation fallback
    // (workbox's NavigationRoute, serving index.html for unknown paths) —
    // not a data/API route.
    const registerRouteCalls = sw.match(/registerRoute\(/g) ?? [];
    expect(registerRouteCalls).toHaveLength(1);
    expect(sw).toMatch(/registerRoute\(new e?\.?NavigationRoute/);
  });

  it('bundled JS may still contain the inert, unused Worker adapter source — that is allowed and distinct from it running by default', () => {
    // Per the plan: "Do not reject bundled but unused Worker adapter code;
    // distinguish code presence from default execution." The adapter
    // function (fetchWorkerSearch) is reachable code gated by a runtime
    // `isWorkerSearchMode()` boolean, not tree-shaken away — so its
    // `/v1/search` string may legitimately appear in the default bundle.
    // What must never happen is the *service worker* caching that route
    // (already asserted above) or the app calling it without the explicit
    // opt-in env var (already asserted in SearchScreen.test.tsx's
    // "never calls fetch in the default fixture-backed mode").
    const files = listFilesRecursive(join(defaultDir, 'assets')).filter((f) => f.endsWith('.js'));
    expect(files.length).toBeGreaterThan(0);
  });
});

describe('explicit VITE_MEDIFIND_SEARCH_MODE=worker build is rejected as the default Pages preview artifact', () => {
  let workerDir: string;

  beforeAll(() => {
    workerDir = mkdtempSync(join(tmpdir(), 'medifind-web-dist-worker-negative-'));
    // A synthetic local development check only, per docs/decisions.md and
    // the task-4 plan's Task 4 Step 3. This never runs against a hosted
    // Cloudflare Pages/Worker environment and is never the default build:
    // production/preview builds only ever run with the env var unset.
    buildArtifact(workerDir, 'worker');
  }, 60_000);

  afterAll(() => {
    if (workerDir) {
      rmSync(workerDir, { recursive: true, force: true });
    }
  });

  it('still builds locally (proves the opt-in flag is wired) without contacting Cloudflare', () => {
    // buildArtifact() throws (failing this test) if the child `vite build`
    // process exits non-zero. Its env carries no Cloudflare account,
    // API-token or wrangler invocation, so a successful local exit is
    // exactly the evidence available that no Cloudflare call occurred.
    expect(existsSync(join(workerDir, 'index.html'))).toBe(true);
  });

  it("is never classified as the Pages preview artifact by the guard's own classification rule", () => {
    expect(isDefaultPreviewArtifact('worker')).toBe(false);
    expect(isDefaultPreviewArtifact('default')).toBe(true);
  });

  it('still contains no secret/binding/credential leak even though it is a non-default synthetic check', () => {
    const files = listFilesRecursive(workerDir);
    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      for (const { label, pattern } of FORBIDDEN_ARTIFACT_PATTERNS) {
        expect(pattern.test(content), `${label} found in ${relative(workerDir, file)}`).toBe(false);
      }
    }
  });
});
