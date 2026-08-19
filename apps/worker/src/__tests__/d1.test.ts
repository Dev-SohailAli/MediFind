import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { readSyntheticConfig } from '../data/d1.js';
import type { Env } from '../types/env.js';

describe('D1 fail-closed data seam', () => {
  it('fails closed as unavailable when no D1 binding is configured', async () => {
    const env: Env = {};

    await expect(readSyntheticConfig(env)).resolves.toEqual({
      status: 'unavailable',
      reason: 'binding_disabled',
    });
  });

  it('fails closed as unavailable when the binding throws (quota or provider error)', async () => {
    const env: Env = {
      DB: {
        prepare() {
          throw new Error('D1_ERROR: quota exceeded');
        },
      },
    };

    await expect(readSyntheticConfig(env)).resolves.toEqual({
      status: 'unavailable',
      reason: 'quota_or_provider_error',
    });
  });

  it('returns the row when a healthy binding is supplied', async () => {
    const env: Env = {
      DB: {
        prepare() {
          return {
            bind() {
              return {
                async first<T>() {
                  return { id: 'synthetic-1' } as T;
                },
                async all<T>() {
                  return { results: [{ id: 'synthetic-1' }] as T[] };
                },
              };
            },
          };
        },
      },
    };

    await expect(readSyntheticConfig(env)).resolves.toEqual({
      status: 'ok',
      row: { id: 'synthetic-1' },
    });
  });

  it('never surfaces the raw provider error message to the caller', async () => {
    const env: Env = {
      DB: {
        prepare() {
          throw new Error('D1_ERROR: internal database path /var/lib/d1/prod.sqlite');
        },
      },
    };

    const result = await readSyntheticConfig(env);

    expect(JSON.stringify(result)).not.toMatch(/sqlite|\/var\/lib/i);
  });

  it('has a committed Task 4 migration on disk, but still no live binding to apply it against', () => {
    const migrationPath = fileURLToPath(
      new URL('../../migrations/0001_task4_synthetic_search.sql', import.meta.url),
    );

    expect(existsSync(migrationPath)).toBe(true);
  });

  it('declares no D1 database binding in the Worker Wrangler configuration', () => {
    const wranglerPath = fileURLToPath(new URL('../../wrangler.toml', import.meta.url));
    const config = readFileSync(wranglerPath, 'utf8');

    expect(config).not.toMatch(/d1_databases/);
  });
});
