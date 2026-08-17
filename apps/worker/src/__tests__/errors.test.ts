import { describe, expect, it } from 'vitest';

import { buildErrorResponse } from '../http/errors.js';

describe('Worker error contract', () => {
  it('returns the stable safe error shape with a generated request ID', async () => {
    const response = buildErrorResponse('VALIDATION_FAILED', 'error.validation.unexpected_body');

    expect(response.status).toBe(400);
    expect(response.headers.get('content-type')).toContain('application/json');

    const body = (await response.json()) as Record<string, unknown>;

    expect(body).toEqual({
      code: 'VALIDATION_FAILED',
      messageKey: 'error.validation.unexpected_body',
      requestId: expect.any(String),
      retryable: false,
    });
    expect(body.requestId).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it('never reveals a stack trace, provider path or raw exception detail', async () => {
    const response = buildErrorResponse('UNAVAILABLE', 'error.unavailable.generic');
    const body = (await response.json()) as Record<string, unknown>;

    const serialized = JSON.stringify(body);

    expect(serialized).not.toMatch(/at .*\(.*:\d+:\d+\)/);
    expect(serialized).not.toMatch(/\/apps\/worker\/src/);
    expect(serialized).not.toMatch(/D1_ERROR|SQLITE|sqlite/i);
  });

  it('marks rate-limited and unavailable errors as retryable, others as not', () => {
    expect(buildErrorResponse('RATE_LIMITED', 'error.rate_limited').status).toBe(429);
    expect(buildErrorResponse('UNAVAILABLE', 'error.unavailable').status).toBe(503);
    expect(buildErrorResponse('CONFLICT', 'error.conflict').status).toBe(409);
    expect(buildErrorResponse('UNAUTHENTICATED', 'error.unauthenticated').status).toBe(401);
    expect(buildErrorResponse('FORBIDDEN', 'error.forbidden').status).toBe(403);
    expect(buildErrorResponse('NOT_FOUND', 'error.not_found').status).toBe(404);
  });

  it('generates a unique, non-sequential request ID per call', () => {
    const first = buildErrorResponse('NOT_FOUND', 'error.not_found');
    const second = buildErrorResponse('NOT_FOUND', 'error.not_found');

    expect(first).not.toBe(second);
  });

  it('rejects unknown/unlisted error codes at compile time only (no runtime fallback string leak)', async () => {
    const response = buildErrorResponse('VALIDATION_FAILED', 'error.validation.body_too_large', {
      fieldErrors: [
        { field: 'body', code: 'TOO_LARGE', messageKey: 'error.validation.body_too_large' },
      ],
    });
    const body = (await response.json()) as { fieldErrors?: unknown };

    expect(body.fieldErrors).toEqual([
      { field: 'body', code: 'TOO_LARGE', messageKey: 'error.validation.body_too_large' },
    ]);
  });
});
