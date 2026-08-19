#!/usr/bin/env node
/**
 * Local-only Pages preview artifact guard.
 *
 * Inspects an already-built `dist` tree (produced by the normal, unmodified
 * `pnpm --filter @medifind/web build`) and fails the command with a named
 * reason if the synthetic static Pages artifact is missing its PWA shell,
 * its no-index policy, its synthetic identity, or if it contains an emitted
 * secret/credential/binding/capability that the default web-only build must
 * never ship.
 *
 * This script never invokes Wrangler, never contacts Cloudflare, never reads
 * a Cloudflare credential and never deploys anything. It only reads local
 * files already produced by `vite build` and returns a deterministic
 * pass/fail result.
 *
 * The bundled-but-unused Worker adapter (see src/search/searchClient.ts) is
 * deliberately NOT rejected merely because its `/v1/search` string or fetch
 * call is present in a JS bundle — that source is reachable but inert unless
 * the default build mode itself is overridden. Only an actual emitted
 * capability (a Pages Function, a proxy rewrite, a binding, a credential, an
 * analytics SDK call, a cookie write or client storage write) is rejected.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FORBIDDEN_CONTENT_PATTERNS } from './forbidden-artifact-patterns.mjs';

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const DEFAULT_SOURCE_DIRECTORY = join(SCRIPT_DIRECTORY, '..');
const DEFAULT_DIST_DIRECTORY = join(DEFAULT_SOURCE_DIRECTORY, 'dist');

const REQUIRED_ICONS = ['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];

// Extensions that are safe (and useful) to decode as UTF-8 text and scan for
// forbidden capability markers. Binary asset types (icons, fonts) are never
// content-scanned — only their existence is checked.
const TEXT_EXTENSIONS = new Set([
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.html',
  '.json',
  '.webmanifest',
  '.txt',
  '.map',
  '.svg',
  '.xml',
]);

// Never read more than this many bytes of any single generated file into
// memory for pattern scanning. This keeps the guard bounded and prevents it
// from ever needing to print (or hold) a large chunk of bundle content.
const MAX_SCAN_BYTES = 5_000_000;

/**
 * Filename-only patterns. A match fails the build before any file content is
 * ever read.
 */
const FORBIDDEN_FILENAME_PATTERNS = [
  { code: 'forbidden-env-file', pattern: /(^|[\\/])\.env(\..+)?$/i },
  {
    code: 'forbidden-credential-file',
    pattern: /(^|[\\/])[^\\/]*credentials?[^\\/]*\.(json|txt|pem|key)$/i,
  },
];

// Extensionless static policy files that must still be content-scanned.
const TEXT_FILENAMES = new Set(['_headers', '_redirects']);

function isTextFile(filePath) {
  const lower = filePath.toLowerCase();
  for (const extension of TEXT_EXTENSIONS) {
    if (lower.endsWith(extension)) {
      return true;
    }
  }
  const base = lower.split(/[\\/]/).pop() ?? lower;
  return TEXT_FILENAMES.has(base);
}

function listFilesRecursive(directory) {
  const out = [];
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      out.push(...listFilesRecursive(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function readBoundedText(filePath) {
  const stats = statSync(filePath);
  if (stats.size > MAX_SCAN_BYTES) {
    return null;
  }
  return readFileSync(filePath, 'utf8');
}

function resolveSearchMode(searchMode) {
  if (searchMode === undefined || searchMode === null || searchMode === '') {
    return { buildMode: 'fixture-default', failure: null };
  }
  if (searchMode === 'worker') {
    return {
      buildMode: null,
      failure: {
        code: 'explicit-worker-mode-not-pages-preview',
        message:
          'VITE_MEDIFIND_SEARCH_MODE=worker is an explicit local development/synthetic ' +
          'integration build, not the default Pages preview artifact.',
      },
    };
  }
  return {
    buildMode: null,
    failure: {
      code: 'unsupported-search-mode',
      message: `VITE_MEDIFIND_SEARCH_MODE=${searchMode} is not a recognized Pages preview build mode.`,
    },
  };
}

function checkShellAssets(distDirectory, failures) {
  const indexHtmlPath = join(distDirectory, 'index.html');
  const headersPath = join(distDirectory, '_headers');
  const robotsPath = join(distDirectory, 'robots.txt');

  if (!existsSync(indexHtmlPath)) {
    failures.push({ code: 'missing-shell', message: 'dist/index.html is missing.' });
    return;
  }
  if (!existsSync(headersPath)) {
    failures.push({ code: 'missing-shell', message: 'dist/_headers is missing.' });
  }
  if (!existsSync(robotsPath)) {
    failures.push({ code: 'missing-shell', message: 'dist/robots.txt is missing.' });
  }

  const html = readFileSync(indexHtmlPath, 'utf8');

  if (!/<script[^>]+type="module"[^>]*src="\/assets\/[^"]+\.js"/.test(html)) {
    failures.push({
      code: 'missing-shell',
      message: 'dist/index.html does not reference a built module shell script under /assets/.',
    });
  }
  if (!/href="\/manifest\.webmanifest"/.test(html)) {
    failures.push({
      code: 'missing-shell',
      message: 'dist/index.html does not link /manifest.webmanifest.',
    });
  }
  if (!/<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*\/>/.test(html)) {
    failures.push({
      code: 'missing-shell',
      message: 'dist/index.html is missing the noindex, nofollow robots meta tag.',
    });
  }
  if (/fetch\(\s*['"`]\/v1\//.test(html)) {
    failures.push({
      code: 'forbidden-inline-api-script',
      message: 'dist/index.html contains a direct inline /v1/ fetch call.',
    });
  }
  if (/<script[^>]+src="https?:\/\//.test(html)) {
    failures.push({
      code: 'forbidden-inline-api-script',
      message: 'dist/index.html loads an inline script from an external origin.',
    });
  }
}

function checkManifest(distDirectory, failures) {
  const manifestPath = join(distDirectory, 'manifest.webmanifest');
  if (!existsSync(manifestPath)) {
    failures.push({ code: 'missing-manifest', message: 'dist/manifest.webmanifest is missing.' });
    return null;
  }

  const raw = readFileSync(manifestPath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch {
    failures.push({
      code: 'missing-manifest',
      message: 'dist/manifest.webmanifest is not valid JSON.',
    });
    return null;
  }
}

function checkServiceWorker(distDirectory, failures) {
  const swPath = join(distDirectory, 'sw.js');
  if (!existsSync(swPath)) {
    failures.push({ code: 'missing-service-worker', message: 'dist/sw.js is missing.' });
  }

  const hasWorkbox = existsSync(distDirectory)
    ? readdirSync(distDirectory).some((entry) => /^workbox-.*\.js$/.test(entry))
    : false;
  if (!hasWorkbox) {
    failures.push({
      code: 'missing-service-worker',
      message: 'No generated workbox-*.js runtime file was found in dist/.',
    });
  }
}

function checkIcons(distDirectory, failures) {
  for (const icon of REQUIRED_ICONS) {
    if (!existsSync(join(distDirectory, icon))) {
      failures.push({ code: 'missing-icon', message: `dist/${icon} is missing.` });
    }
  }
}

function checkNoindexPolicy(distDirectory, failures) {
  const headersPath = join(distDirectory, '_headers');
  const robotsPath = join(distDirectory, 'robots.txt');

  if (existsSync(headersPath)) {
    const headers = readFileSync(headersPath, 'utf8');
    if (!/X-Robots-Tag:\s*noindex,\s*nofollow/.test(headers)) {
      failures.push({
        code: 'missing-noindex-policy',
        message: 'dist/_headers no longer sets X-Robots-Tag: noindex, nofollow.',
      });
    }
  }

  if (existsSync(robotsPath)) {
    const robots = readFileSync(robotsPath, 'utf8');
    if (!/User-agent:\s*\*/.test(robots) || !/Disallow:\s*\//.test(robots)) {
      failures.push({
        code: 'missing-noindex-policy',
        message: 'dist/robots.txt no longer disallows crawling for all agents.',
      });
    }
  }
}

function checkPolicyDrift(distDirectory, sourceDirectory, failures) {
  if (!sourceDirectory) {
    return;
  }

  const pairs = [
    ['_headers', join(sourceDirectory, 'public', '_headers')],
    ['robots.txt', join(sourceDirectory, 'public', 'robots.txt')],
  ];

  for (const [name, sourcePath] of pairs) {
    const distPath = join(distDirectory, name);
    if (!existsSync(sourcePath) || !existsSync(distPath)) {
      continue;
    }
    const sourceContent = readFileSync(sourcePath, 'utf8');
    const distContent = readFileSync(distPath, 'utf8');
    if (sourceContent !== distContent) {
      failures.push({
        code: 'noindex-policy-drift',
        message: `dist/${name} no longer matches the source public/${name} policy file exactly.`,
      });
    }
  }
}

function checkSyntheticIdentity(manifest, distDirectory, failures) {
  const identityPattern = /synthetic/i;
  const localPattern = /local/i;
  const noRealDataPattern = /no real .*data/i;

  if (manifest) {
    const description = typeof manifest.description === 'string' ? manifest.description : '';
    const name = typeof manifest.name === 'string' ? manifest.name : '';
    if (
      !identityPattern.test(name) ||
      !localPattern.test(name) ||
      !identityPattern.test(description) ||
      !noRealDataPattern.test(description)
    ) {
      failures.push({
        code: 'missing-synthetic-identity',
        message: 'dist/manifest.webmanifest no longer identifies itself as synthetic/local-only.',
      });
    }
  }

  const indexHtmlPath = join(distDirectory, 'index.html');
  if (existsSync(indexHtmlPath)) {
    const html = readFileSync(indexHtmlPath, 'utf8');
    if (!identityPattern.test(html) || !noRealDataPattern.test(html)) {
      failures.push({
        code: 'missing-synthetic-identity',
        message: 'dist/index.html no longer identifies itself as synthetic/no-real-data.',
      });
    }
  }
}

function checkCapabilityBoundary(distDirectory, failures) {
  if (!existsSync(distDirectory)) {
    return;
  }

  const files = listFilesRecursive(distDirectory);

  if (files.some((file) => relative(distDirectory, file).split(/[\\/]/).includes('functions'))) {
    failures.push({
      code: 'forbidden-pages-function',
      message: 'A functions/ directory was emitted alongside the static build output.',
    });
  }

  for (const file of files) {
    const relativePath = relative(distDirectory, file);

    for (const { code, pattern } of FORBIDDEN_FILENAME_PATTERNS) {
      if (pattern.test(relativePath)) {
        failures.push({ code, message: `${relativePath} is a forbidden emitted file.` });
      }
    }

    if (!isTextFile(file)) {
      continue;
    }

    const content = readBoundedText(file);
    if (content === null) {
      continue;
    }

    for (const { code, pattern } of FORBIDDEN_CONTENT_PATTERNS) {
      if (pattern.test(content)) {
        failures.push({ code, message: `${relativePath} contains a forbidden ${code} marker.` });
      }
    }

    if (relativePath === '_redirects' && /https?:\/\//.test(content)) {
      failures.push({
        code: 'forbidden-api-proxy',
        message: '_redirects rewrites a request to an external origin.',
      });
    }
  }
}

/**
 * Pure inspection of an already-built Pages preview artifact tree. Never
 * writes, deploys, or contacts a network of any kind.
 *
 * @param {{ distDirectory?: string, sourceDirectory?: string, searchMode?: string }} options
 * @returns {{ ok: true, buildMode: string, checks: string[] } | { ok: false, failures: { code: string, message: string }[] }}
 */
export function inspectPreviewBuild({ distDirectory, sourceDirectory, searchMode } = {}) {
  const resolvedDist = distDirectory ?? DEFAULT_DIST_DIRECTORY;
  const resolvedSource = sourceDirectory ?? undefined;

  const failures = [];
  const checks = [];

  const { buildMode, failure: modeFailure } = resolveSearchMode(searchMode);
  if (modeFailure) {
    failures.push(modeFailure);
  } else {
    checks.push('build-mode');
  }

  if (!existsSync(resolvedDist)) {
    failures.push({
      code: 'missing-shell',
      message: 'The dist directory does not exist. Run the default web build first.',
    });
    return { ok: false, failures };
  }

  const beforeShell = failures.length;
  checkShellAssets(resolvedDist, failures);
  if (failures.length === beforeShell) {
    checks.push('shell-present');
  }

  const manifest = checkManifest(resolvedDist, failures);
  if (manifest) {
    checks.push('manifest-present');
  }

  const beforeSw = failures.length;
  checkServiceWorker(resolvedDist, failures);
  if (failures.length === beforeSw) {
    checks.push('service-worker-present');
  }

  const beforeIcons = failures.length;
  checkIcons(resolvedDist, failures);
  if (failures.length === beforeIcons) {
    checks.push('icons-present');
  }

  const beforePolicy = failures.length;
  checkNoindexPolicy(resolvedDist, failures);
  checkPolicyDrift(resolvedDist, resolvedSource, failures);
  if (failures.length === beforePolicy) {
    checks.push('noindex-policy');
  }

  const beforeIdentity = failures.length;
  checkSyntheticIdentity(manifest, resolvedDist, failures);
  if (failures.length === beforeIdentity) {
    checks.push('synthetic-identity');
  }

  const beforeCapability = failures.length;
  checkCapabilityBoundary(resolvedDist, failures);
  if (failures.length === beforeCapability) {
    checks.push('capability-boundary');
  }

  if (failures.length > 0) {
    return { ok: false, failures };
  }

  return { ok: true, buildMode, checks };
}

function main() {
  // Fixed, non-configurable paths only: this command never accepts a
  // command-line output directory, shell fragment or credential. It always
  // inspects the package's own default `dist` output using the current
  // process environment's VITE_MEDIFIND_SEARCH_MODE.
  const result = inspectPreviewBuild({
    distDirectory: DEFAULT_DIST_DIRECTORY,
    sourceDirectory: DEFAULT_SOURCE_DIRECTORY,
    searchMode: process.env.VITE_MEDIFIND_SEARCH_MODE,
  });

  if (result.ok) {
    console.log(
      JSON.stringify({
        ok: true,
        buildMode: result.buildMode,
        distDirectory: 'apps/web/dist',
        checks: result.checks,
      }),
    );
    process.exitCode = 0;
    return;
  }

  console.error(
    JSON.stringify({
      ok: false,
      distDirectory: 'apps/web/dist',
      failures: result.failures,
    }),
  );
  process.exitCode = 1;
}

const isDirectExecution = process.argv[1] === fileURLToPath(import.meta.url);
if (isDirectExecution) {
  main();
}
