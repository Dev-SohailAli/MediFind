import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

import { handleSearchRequest, parseSearchRequest } from '../search.js';
import { createFakeD1 } from '../../__tests__/support/fakeD1.js';
import type { Env } from '../../types/env.js';

const migrationPath = fileURLToPath(
  new URL('../../../migrations/0001_task4_synthetic_search.sql', import.meta.url),
);

function envWithFakeD1(): Env {
  const { binding } = createFakeD1(migrationPath);
  return { DB: binding };
}

function url(query: string): URL {
  return new URL(`https://worker.local/v1/search${query}`);
}

describe('parseSearchRequest', () => {
  it('defaults query to empty, sort to relevance, page to 1, pageSize to 20', () => {
    const parsed = parseSearchRequest(url(''));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value).toEqual({
      queryTokens: [],
      area: null,
      sort: 'relevance',
      page: 1,
      pageSize: 20,
    });
  });

  it('normalizes and tokenizes the query parameter', () => {
    const parsed = parseSearchRequest(url('?query=Nivaprin+Rapid'));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.queryTokens).toEqual(['nivaprin', 'rapid']);
  });

  it('rejects a query longer than 80 characters after trim', () => {
    const parsed = parseSearchRequest(url(`?query=${'a'.repeat(81)}`));
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.response.status).toBe(400);
  });

  it('accepts a query exactly 80 characters after trim', () => {
    const parsed = parseSearchRequest(url(`?query=${encodeURIComponent(`  ${'a'.repeat(80)}  `)}`));
    expect(parsed.ok).toBe(true);
  });

  it('accepts every allow-listed area value and rejects anything else', () => {
    for (const area of ['harbour', 'market', 'garden']) {
      const parsed = parseSearchRequest(url(`?area=${area}`));
      expect(parsed.ok).toBe(true);
      if (parsed.ok) expect(parsed.value.area).toBe(area);
    }

    const rejected = parseSearchRequest(url('?area=space-station'));
    expect(rejected.ok).toBe(false);
    if (rejected.ok) return;
    expect(rejected.response.status).toBe(400);
  });

  it('rejects a SQL-metacharacter area value rather than passing it through', async () => {
    const rejected = parseSearchRequest(url("?area=harbour'; DROP TABLE medicine_listings; --"));
    expect(rejected.ok).toBe(false);
    if (rejected.ok) return;
    expect((await rejected.response.json()).code).toBe('VALIDATION_FAILED');
  });

  it('accepts every allow-listed sort value and rejects anything else', () => {
    for (const sort of ['relevance', 'price_low_to_high', 'distance']) {
      const parsed = parseSearchRequest(url(`?sort=${sort}`));
      expect(parsed.ok).toBe(true);
      if (parsed.ok) expect(parsed.value.sort).toBe(sort);
    }

    const rejected = parseSearchRequest(url('?sort=DROP TABLE x'));
    expect(rejected.ok).toBe(false);
  });

  it('rejects a non-integer, zero, or negative page', () => {
    for (const page of ['0', '-1', 'abc', '1.5']) {
      const parsed = parseSearchRequest(url(`?page=${encodeURIComponent(page)}`));
      expect(parsed.ok).toBe(false);
    }
  });

  it('rejects a pageSize outside 1-20', () => {
    for (const pageSize of ['0', '21', '-1', 'abc']) {
      const parsed = parseSearchRequest(url(`?pageSize=${pageSize}`));
      expect(parsed.ok).toBe(false);
    }
    expect(parseSearchRequest(url('?pageSize=20')).ok).toBe(true);
    expect(parseSearchRequest(url('?pageSize=1')).ok).toBe(true);
  });
});

describe('handleSearchRequest', () => {
  it('returns a public-safe paginated envelope for a matching query', async () => {
    const env = envWithFakeD1();

    const response = await handleSearchRequest(new Request(url('?query=nivaprin').toString()), env);
    const body = (await response.json()) as {
      results: unknown[];
      page: number;
      pageSize: number;
      total: number;
      hasMore: boolean;
    };

    expect(response.status).toBe(200);
    expect(body.total).toBe(2);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
    expect(body.hasMore).toBe(false);
    expect(body.results).toHaveLength(2);
  });

  it('maps a D1-unavailable outcome to a generic UNAVAILABLE error, never a raw provider message', async () => {
    const env: Env = {
      DB: {
        prepare() {
          throw new Error('D1_ERROR: internal path /var/lib/d1/prod.sqlite');
        },
      },
    };

    const response = await handleSearchRequest(new Request(url('?query=nivaprin').toString()), env);
    const body = (await response.json()) as { code: string };

    expect(response.status).toBe(503);
    expect(body.code).toBe('UNAVAILABLE');
    expect(JSON.stringify(body)).not.toMatch(/sqlite|\/var\/lib/i);
  });

  it('returns VALIDATION_FAILED for an invalid pageSize without ever calling D1', async () => {
    const env: Env = {
      DB: {
        prepare() {
          throw new Error('must not be called');
        },
      },
    };

    const response = await handleSearchRequest(new Request(url('?pageSize=999').toString()), env);
    expect(response.status).toBe(400);
  });
});
