import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';

import type { D1LikeBinding } from '../../types/env.js';

/**
 * Test-only D1 double backed by Node's built-in node:sqlite (not a
 * Cloudflare binding, no network, no account). D1 is SQLite-wire-compatible,
 * so executing the real migration SQL against a real in-memory SQLite engine
 * is a stronger correctness proof than mocking `prepare().bind().first()`
 * calls by hand: every parameterized query string this package ships is
 * actually executed here. This file lives under `__tests__/` on purpose so
 * it is excluded from the production-source boundary scan in
 * `../boundary.test.ts` and is unreachable from the Worker's real `fetch`
 * entrypoint (`../../index.ts` never imports anything under `__tests__/`).
 */
export function createFakeD1(migrationSqlPath: string): {
  db: DatabaseSync;
  binding: D1LikeBinding;
} {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(migrationSqlPath, 'utf8'));

  const binding: D1LikeBinding = {
    prepare(query: string) {
      const statement = db.prepare(query);
      return {
        bind(...values: unknown[]) {
          return {
            async first<T>(): Promise<T | null> {
              const row = statement.get(...(values as never[]));
              return (row ?? null) as T | null;
            },
            async all<T>(): Promise<{ results: T[] }> {
              const rows = statement.all(...(values as never[]));
              return { results: rows as T[] };
            },
          };
        },
      };
    },
  };

  return { db, binding };
}
