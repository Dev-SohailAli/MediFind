import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

import { handleListingRequest } from '../listings.js';
import { createFakeD1 } from '../../__tests__/support/fakeD1.js';
import type { Env } from '../../types/env.js';

const migrationPath = fileURLToPath(
  new URL('../../../migrations/0001_task4_synthetic_search.sql', import.meta.url),
);

function envWithFakeD1(): Env {
  const { binding } = createFakeD1(migrationPath);
  return { DB: binding };
}

describe('handleListingRequest', () => {
  it('returns the public projection for an eligible listing id', async () => {
    const env = envWithFakeD1();

    const response = await handleListingRequest('nivaprin-solandra', env);
    const body = (await response.json()) as { id: string; medicineDisplayName: string };

    expect(response.status).toBe(200);
    expect(body.id).toBe('nivaprin-solandra');
    expect(body.medicineDisplayName).toBe('Nivaprin');
  });

  it('returns the same generic NOT_FOUND shape for a stale/excluded id as for an id that never existed', async () => {
    const env = envWithFakeD1();

    const excluded = await handleListingRequest('excludex-solandra-ineligible', env);
    const neverExisted = await handleListingRequest('totally-made-up-id', env);
    const excludedBody = await excluded.json();
    const neverExistedBody = await neverExisted.json();

    expect(excluded.status).toBe(neverExisted.status);
    expect(excluded.status).toBe(404);
    expect((excludedBody as { code: string }).code).toBe(
      (neverExistedBody as { code: string }).code,
    );
    expect((excludedBody as { code: string }).code).toBe('NOT_FOUND');
  });

  it('maps a D1-unavailable outcome to a generic UNAVAILABLE error, never a raw provider message', async () => {
    const env: Env = {
      DB: {
        prepare() {
          throw new Error('D1_ERROR: internal path /var/lib/d1/prod.sqlite');
        },
      },
    };

    const response = await handleListingRequest('nivaprin-solandra', env);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect((body as { code: string }).code).toBe('UNAVAILABLE');
    expect(JSON.stringify(body)).not.toMatch(/sqlite|\/var\/lib/i);
  });
});
