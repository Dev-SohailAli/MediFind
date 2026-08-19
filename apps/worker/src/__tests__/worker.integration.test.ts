import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

import worker from '../index.js';
import type { Env } from '../types/env.js';
import { createFakeD1 } from './support/fakeD1.js';

const env: Env = {};

const migrationPath = fileURLToPath(
  new URL('../../migrations/0001_task4_synthetic_search.sql', import.meta.url),
);

function envWithFakeD1(): Env {
  const { binding } = createFakeD1(migrationPath);
  return { DB: binding };
}

async function json(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

describe('Worker fetch handler (integration)', () => {
  it('returns safe public config for the allow-listed health route', async () => {
    const response = await worker.fetch(new Request('https://worker.local/v1/health'), env);
    const body = await json(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: 'ok', service: 'medifind-worker', environment: 'local' });
  });

  it('never leaks an env/binding key in the health response body', async () => {
    const response = await worker.fetch(new Request('https://worker.local/v1/health'), {
      ENVIRONMENT: 'local',
      DB: undefined,
    } as Env);
    const body = await json(response);

    expect(Object.keys(body).sort()).toEqual(['environment', 'service', 'status']);
    expect(JSON.stringify(body)).not.toMatch(/DB|binding|secret|token/i);
  });

  it('rejects an unknown route with a generic NOT_FOUND, not a stack trace or route list', async () => {
    const response = await worker.fetch(new Request('https://worker.local/v1/unknown'), env);
    const body = await json(response);

    expect(response.status).toBe(404);
    expect(body.code).toBe('NOT_FOUND');
  });

  it('rejects a disallowed method on a real path with the exact same shape as an unknown route (anti-enumeration)', async () => {
    const unknownRoute = await worker.fetch(new Request('https://worker.local/v1/unknown'), env);
    const wrongMethod = await worker.fetch(
      new Request('https://worker.local/v1/health', { method: 'POST' }),
      env,
    );

    const unknownBody = await json(unknownRoute);
    const wrongMethodBody = await json(wrongMethod);

    expect(wrongMethod.status).toBe(unknownRoute.status);
    expect(wrongMethodBody.code).toBe(unknownBody.code);
    expect(wrongMethodBody.messageKey).toBe(unknownBody.messageKey);
  });

  it('rejects a request declaring an oversized body without ever reading it', async () => {
    const response = await worker.fetch(
      new Request('https://worker.local/v1/health', {
        headers: { 'content-length': '99999' },
      }),
      env,
    );
    const body = await json(response);

    expect(response.status).toBe(400);
    expect(body.code).toBe('VALIDATION_FAILED');
    expect(body.messageKey).toBe('error.validation.body_too_large');
  });

  it('ignores a spoofed actor/role header and still returns only the public safe config', async () => {
    const response = await worker.fetch(
      new Request('https://worker.local/v1/health', {
        headers: {
          'x-medifind-actor-role': 'admin',
          'x-medifind-actor-id': 'admin-1',
        },
      }),
      env,
    );
    const body = await json(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: 'ok', service: 'medifind-worker', environment: 'local' });
  });

  it('includes a distinct opaque requestId on every error response', async () => {
    const first = await worker.fetch(new Request('https://worker.local/v1/unknown'), env);
    const second = await worker.fetch(new Request('https://worker.local/v1/unknown'), env);

    const firstBody = await json(first);
    const secondBody = await json(second);

    expect(firstBody.requestId).not.toBe(secondBody.requestId);
  });

  it('rate-limits repeated requests from the same source and recovers after the window', async () => {
    const manyRequests = Array.from({ length: 65 }, () =>
      worker.fetch(
        new Request('https://worker.local/v1/health', {
          headers: { 'cf-connecting-ip': '203.0.113.9' },
        }),
        env,
      ),
    );
    const responses = await Promise.all(manyRequests);
    const statuses = responses.map((response) => response.status);

    expect(statuses).toContain(429);

    const limited = responses.find((response) => response.status === 429);
    expect(limited?.headers.get('retry-after')).toBeTruthy();
  });
});

describe('Worker fetch handler: Task 4 synthetic search/listing routes (integration)', () => {
  it('returns matching public search results end to end through the real fetch pipeline', async () => {
    const response = await worker.fetch(
      new Request('https://worker.local/v1/search?query=nivaprin'),
      envWithFakeD1(),
    );
    const body = await json(response);

    expect(response.status).toBe(200);
    expect((body.results as unknown[]).length).toBe(2);
    expect(body.total).toBe(2);
  });

  it('returns a single listing end to end through the real fetch pipeline', async () => {
    const response = await worker.fetch(
      new Request('https://worker.local/v1/listings/nivaprin-solandra'),
      envWithFakeD1(),
    );
    const body = await json(response);

    expect(response.status).toBe(200);
    expect(body.id).toBe('nivaprin-solandra');
  });

  it('fails closed as UNAVAILABLE when D1 is disabled (no binding), never falling back to an empty-but-200 response', async () => {
    const response = await worker.fetch(
      new Request('https://worker.local/v1/search?query=nivaprin'),
      env,
    );
    const body = await json(response);

    expect(response.status).toBe(503);
    expect(body.code).toBe('UNAVAILABLE');
  });

  it('fails closed as UNAVAILABLE for a listing lookup when D1 is disabled', async () => {
    const response = await worker.fetch(
      new Request('https://worker.local/v1/listings/nivaprin-solandra'),
      env,
    );
    const body = await json(response);

    expect(response.status).toBe(503);
    expect(body.code).toBe('UNAVAILABLE');
  });

  it('rejects a disallowed method on /v1/search with the exact same anti-enumeration shape as an unknown route', async () => {
    const unknownRoute = await worker.fetch(new Request('https://worker.local/v1/unknown'), env);
    const wrongMethod = await worker.fetch(
      new Request('https://worker.local/v1/search', { method: 'POST' }),
      env,
    );

    const unknownBody = await json(unknownRoute);
    const wrongMethodBody = await json(wrongMethod);

    expect(wrongMethod.status).toBe(unknownRoute.status);
    expect(wrongMethodBody.code).toBe(unknownBody.code);
    expect(wrongMethodBody.messageKey).toBe(unknownBody.messageKey);
  });

  it('rejects a disallowed method on /v1/listings/{id} with the exact same anti-enumeration shape as an unknown route', async () => {
    const unknownRoute = await worker.fetch(new Request('https://worker.local/v1/unknown'), env);
    const wrongMethod = await worker.fetch(
      new Request('https://worker.local/v1/listings/nivaprin-solandra', { method: 'DELETE' }),
      envWithFakeD1(),
    );

    const unknownBody = await json(unknownRoute);
    const wrongMethodBody = await json(wrongMethod);

    expect(wrongMethod.status).toBe(unknownRoute.status);
    expect(wrongMethodBody.code).toBe(unknownBody.code);
  });

  it('returns the identical generic NOT_FOUND shape for a stale/excluded listing id and a never-existed id', async () => {
    const fakeEnv = envWithFakeD1();

    const excluded = await worker.fetch(
      new Request('https://worker.local/v1/listings/excludex-solandra-ineligible'),
      fakeEnv,
    );
    const neverExisted = await worker.fetch(
      new Request('https://worker.local/v1/listings/never-existed-xyz'),
      fakeEnv,
    );

    const excludedBody = await json(excluded);
    const neverExistedBody = await json(neverExisted);

    expect(excluded.status).toBe(404);
    expect(neverExisted.status).toBe(404);
    expect(excludedBody.code).toBe(neverExistedBody.code);
    expect(excludedBody.messageKey).toBe(neverExistedBody.messageKey);
  });

  it('ignores a spoofed actor/role header on the search route and still returns only the public projection', async () => {
    const response = await worker.fetch(
      new Request('https://worker.local/v1/search?query=nivaprin', {
        headers: { 'x-medifind-actor-role': 'admin', 'x-medifind-actor-id': 'admin-1' },
      }),
      envWithFakeD1(),
    );
    const body = await json(response);

    expect(response.status).toBe(200);
    expect(JSON.stringify(body)).not.toMatch(/admin/i);
  });

  it('never leaks a database/provider error detail through the search route', async () => {
    const brokenEnv: Env = {
      DB: {
        prepare() {
          throw new Error('D1_ERROR: internal database path /var/lib/d1/prod.sqlite');
        },
      },
    };

    const response = await worker.fetch(
      new Request('https://worker.local/v1/search?query=nivaprin'),
      brokenEnv,
    );
    const body = await json(response);

    expect(response.status).toBe(503);
    expect(JSON.stringify(body)).not.toMatch(/sqlite|\/var\/lib/i);
  });

  it('shares the same rate-limit source key format but gives /v1/search its own independent budget from /v1/health', async () => {
    const fakeEnv = envWithFakeD1();
    const sourceIp = '203.0.113.55';

    // Exhaust the health-route budget only.
    await Promise.all(
      Array.from({ length: 61 }, () =>
        worker.fetch(
          new Request('https://worker.local/v1/health', {
            headers: { 'cf-connecting-ip': sourceIp },
          }),
          fakeEnv,
        ),
      ),
    );

    // The search route, keyed by its own action name, must still be open.
    const searchResponse = await worker.fetch(
      new Request('https://worker.local/v1/search?query=nivaprin', {
        headers: { 'cf-connecting-ip': sourceIp },
      }),
      fakeEnv,
    );

    expect(searchResponse.status).toBe(200);
  });
});
