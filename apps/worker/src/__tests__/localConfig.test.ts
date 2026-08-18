import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const workerRoot = fileURLToPath(new URL('../../', import.meta.url));

describe('local synthetic Worker development configuration', () => {
  it('exposes local development and validation commands', () => {
    const packageJson = JSON.parse(readFileSync(`${workerRoot}/package.json`, 'utf8')) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.dev).toBe('wrangler dev --config wrangler.local.toml --local');
    expect(packageJson.scripts?.check).toBe(
      'wrangler deploy --dry-run --config wrangler.local.toml',
    );
    expect(packageJson.scripts?.['d1:apply']).toBe(
      'wrangler d1 execute medifind-synthetic-search-local --local --config wrangler.local.toml --file migrations/0001_task4_synthetic_search.sql',
    );
  });

  it('binds only the reviewed synthetic D1 database in the local config', () => {
    const config = readFileSync(`${workerRoot}/wrangler.local.toml`, 'utf8');

    expect(config).toContain('name = "medifind-synthetic-worker-local"');
    expect(config).toContain('binding = "DB"');
    expect(config).toContain('database_name = "medifind-synthetic-search-local"');
    expect(config).toContain('migrations_dir = "./migrations"');
    expect(config).not.toMatch(/account_id|api_token|secret|production|real data/i);
  });
});
