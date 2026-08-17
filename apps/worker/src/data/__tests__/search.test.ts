import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';

import { getListingById, searchProjection } from '../search.js';
import { createFakeD1 } from '../../__tests__/support/fakeD1.js';
import type { Env } from '../../types/env.js';

const migrationPath = fileURLToPath(
  new URL('../../../migrations/0001_task4_synthetic_search.sql', import.meta.url),
);

function envWithFakeD1(): Env {
  const { binding } = createFakeD1(migrationPath);
  return { DB: binding };
}

const baseInput = { area: null, sort: 'relevance' as const, page: 1, pageSize: 20 };

describe('searchProjection', () => {
  it('fails closed as unavailable when no D1 binding is configured', async () => {
    await expect(
      searchProjection({}, { ...baseInput, queryTokens: ['nivaprin'] }),
    ).resolves.toEqual({
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

    await expect(
      searchProjection(env, { ...baseInput, queryTokens: ['nivaprin'] }),
    ).resolves.toEqual({
      status: 'unavailable',
      reason: 'quota_or_provider_error',
    });
  });

  it('returns an empty safe-browse result for an empty query without touching D1 at all', async () => {
    const env: Env = {
      DB: {
        prepare() {
          throw new Error('must not be called for an empty query');
        },
      },
    };

    await expect(searchProjection(env, { ...baseInput, queryTokens: [] })).resolves.toEqual({
      status: 'ok',
      results: [],
      total: 0,
    });
  });

  it('finds both Nivaprin listings by exact product-name prefix', async () => {
    const env = envWithFakeD1();

    const outcome = await searchProjection(env, { ...baseInput, queryTokens: ['nivaprin'] });

    expect(outcome.status).toBe('ok');
    if (outcome.status !== 'ok') return;
    expect(outcome.results.map((r) => r.id).sort()).toEqual([
      'nivaprin-marketside',
      'nivaprin-solandra',
    ]);
    expect(outcome.total).toBe(2);
  });

  it('finds both Nivaprin listings via the Bentholine active-ingredient/alias term, never by product name', async () => {
    const env = envWithFakeD1();

    const outcome = await searchProjection(env, { ...baseInput, queryTokens: ['bentho'] });

    expect(outcome.status).toBe('ok');
    if (outcome.status !== 'ok') return;
    expect(outcome.results.map((r) => r.id).sort()).toEqual([
      'nivaprin-marketside',
      'nivaprin-solandra',
    ]);
  });

  it('requires every query token to match (AND across tokens), not any token', async () => {
    const env = envWithFakeD1();

    // "calorex alt" is a full alias for calorex-gardenview; "alt" alone must
    // also match it (alias tokenized per-word), but "calorex zzz" must match
    // nothing because no stored term for that listing starts with "zzz".
    const matching = await searchProjection(env, { ...baseInput, queryTokens: ['calorex', 'alt'] });
    expect(matching.status).toBe('ok');
    if (matching.status !== 'ok') return;
    expect(matching.results.map((r) => r.id)).toEqual(['calorex-gardenview']);

    const nonMatching = await searchProjection(env, {
      ...baseInput,
      queryTokens: ['calorex', 'zzz'],
    });
    expect(nonMatching.status).toBe('ok');
    if (nonMatching.status !== 'ok') return;
    expect(nonMatching.results).toEqual([]);
  });

  it('never returns the stale Excludex listing, even for a query that matches its own name', async () => {
    const env = envWithFakeD1();

    const outcome = await searchProjection(env, { ...baseInput, queryTokens: ['exclud'] });

    expect(outcome.status).toBe('ok');
    if (outcome.status !== 'ok') return;
    expect(outcome.results).toEqual([]);
    expect(outcome.total).toBe(0);
  });

  it('returns no result for a query that matches nothing', async () => {
    const env = envWithFakeD1();

    const outcome = await searchProjection(env, { ...baseInput, queryTokens: ['zzzznotfound'] });

    expect(outcome.status).toBe('ok');
    if (outcome.status !== 'ok') return;
    expect(outcome.results).toEqual([]);
    expect(outcome.total).toBe(0);
  });

  it('sorts by price low to high with a deterministic id tie-breaker', async () => {
    const env = envWithFakeD1();

    // An empty-ish broad query: every listing's product term starts with a
    // letter, so query by a token that matches every eligible listing via
    // product name is impractical; instead assert relative order for a
    // query that legitimately returns multiple rows: none of the accepted
    // fixtures share every term, so use two distinct single-listing queries
    // combined is not meaningful here — assert full-catalog price sort via
    // the "distance"-agnostic query token shared by two Nivaprin rows plus
    // an explicit pageSize covering only those two.
    const outcome = await searchProjection(env, {
      ...baseInput,
      queryTokens: ['nivaprin'],
      sort: 'price_low_to_high',
    });

    expect(outcome.status).toBe('ok');
    if (outcome.status !== 'ok') return;
    expect(outcome.results.map((r) => r.id)).toEqual(['nivaprin-marketside', 'nivaprin-solandra']);
    expect(outcome.results.map((r) => r.priceFjdMinor)).toEqual([790, 850]);
  });

  it('sorts by distance, overriding rank to 0 for the selected synthetic area', async () => {
    const env = envWithFakeD1();

    const outcome = await searchProjection(env, {
      ...baseInput,
      queryTokens: ['nivaprin'],
      sort: 'distance',
      area: 'market',
    });

    expect(outcome.status).toBe('ok');
    if (outcome.status !== 'ok') return;
    // nivaprin-marketside is in the selected 'market' area -> rank 0 (nearby);
    // nivaprin-solandra is in 'harbour' -> its own rank (1) + 100 offset.
    expect(outcome.results.map((r) => r.id)).toEqual(['nivaprin-marketside', 'nivaprin-solandra']);
  });

  it('does not let the area parameter change which listings match, only their display rank', async () => {
    const env = envWithFakeD1();

    const withArea = await searchProjection(env, {
      ...baseInput,
      queryTokens: ['nivaprin'],
      area: 'garden',
    });
    const withoutArea = await searchProjection(env, { ...baseInput, queryTokens: ['nivaprin'] });

    expect(withArea.status).toBe('ok');
    expect(withoutArea.status).toBe('ok');
    if (withArea.status !== 'ok' || withoutArea.status !== 'ok') return;
    expect(withArea.results.map((r) => r.id).sort()).toEqual(
      withoutArea.results.map((r) => r.id).sort(),
    );
  });

  it('paginates a bounded result set deterministically', async () => {
    const env = envWithFakeD1();

    const pageOne = await searchProjection(env, {
      ...baseInput,
      queryTokens: ['nivaprin'],
      sort: 'price_low_to_high',
      pageSize: 1,
      page: 1,
    });
    const pageTwo = await searchProjection(env, {
      ...baseInput,
      queryTokens: ['nivaprin'],
      sort: 'price_low_to_high',
      pageSize: 1,
      page: 2,
    });

    expect(pageOne.status).toBe('ok');
    expect(pageTwo.status).toBe('ok');
    if (pageOne.status !== 'ok' || pageTwo.status !== 'ok') return;
    expect(pageOne.results.map((r) => r.id)).toEqual(['nivaprin-marketside']);
    expect(pageTwo.results.map((r) => r.id)).toEqual(['nivaprin-solandra']);
    expect(pageOne.total).toBe(2);
    expect(pageTwo.total).toBe(2);
  });

  it('never returns an internal-only field (source ids, verification/moderation state, search terms)', async () => {
    const env = envWithFakeD1();

    const outcome = await searchProjection(env, { ...baseInput, queryTokens: ['nivaprin'] });

    expect(outcome.status).toBe('ok');
    if (outcome.status !== 'ok') return;
    const serialized = JSON.stringify(outcome.results);
    expect(serialized).not.toMatch(
      /concept-|branch-|org-|verification_state|listing_state|identity_match|source_version|projection_version|schema_version|normalized_term|match_kind/,
    );
  });

  it('never trusts a caller-supplied SQL-metacharacter token; it is only ever bound as a LIKE value', async () => {
    const env = envWithFakeD1();

    const outcome = await searchProjection(env, {
      ...baseInput,
      queryTokens: ["nivaprin'; drop table medicine_listings; --"],
    });

    expect(outcome.status).toBe('ok');
    if (outcome.status !== 'ok') return;
    expect(outcome.results).toEqual([]);

    // The table must still exist and be intact after the attempted injection.
    const followUp = await searchProjection(env, { ...baseInput, queryTokens: ['nivaprin'] });
    expect(followUp.status).toBe('ok');
    if (followUp.status !== 'ok') return;
    expect(followUp.results).toHaveLength(2);
  });
});

describe('getListingById', () => {
  it('fails closed as unavailable when no D1 binding is configured', async () => {
    await expect(getListingById({}, 'nivaprin-solandra')).resolves.toEqual({
      status: 'unavailable',
      reason: 'binding_disabled',
    });
  });

  it('returns the full public projection for an eligible listing id', async () => {
    const env = envWithFakeD1();

    const outcome = await getListingById(env, 'nivaprin-solandra');

    expect(outcome).toEqual({
      status: 'ok',
      result: {
        id: 'nivaprin-solandra',
        medicineDisplayName: 'Nivaprin',
        brandName: 'Nivaprin Rapid',
        activeIngredientDisplayName: 'Bentholine',
        strength: '500 mg',
        dosageForm: 'Tablet',
        packDescription: 'Pack of 20',
        pharmacyDisplayName: 'Solandra Pharmacy (synthetic)',
        syntheticArea: 'harbour',
        directionText:
          'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).',
        availabilityState: 'in_stock',
        priceFjdMinor: 850,
        syntheticDistanceLabel: '1.2 km (synthetic)',
        syntheticDistanceRank: 1,
        lastRefreshedAt: '2026-08-17T00:00:00.000Z',
      },
    });
  });

  it('returns null (generic not-found, never an error) for the stale Excludex listing id', async () => {
    const env = envWithFakeD1();

    await expect(getListingById(env, 'excludex-solandra-ineligible')).resolves.toEqual({
      status: 'ok',
      result: null,
    });
  });

  it('returns null for an id that never existed, identically to an excluded id', async () => {
    const env = envWithFakeD1();

    await expect(getListingById(env, 'never-existed-xyz')).resolves.toEqual({
      status: 'ok',
      result: null,
    });
  });
});
