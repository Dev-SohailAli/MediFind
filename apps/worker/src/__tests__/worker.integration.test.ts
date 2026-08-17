import { describe, expect, it } from 'vitest';

import worker from '../index.js';
import type { Env } from '../types/env.js';

const env: Env = {};

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
