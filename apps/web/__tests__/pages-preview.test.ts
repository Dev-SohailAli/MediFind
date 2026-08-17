// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const headersPath = fileURLToPath(new URL('../public/_headers', import.meta.url));
const robotsPath = fileURLToPath(new URL('../public/robots.txt', import.meta.url));
const indexHtmlPath = fileURLToPath(new URL('../index.html', import.meta.url));
const rootWranglerPath = fileURLToPath(new URL('../../../wrangler.toml', import.meta.url));

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
