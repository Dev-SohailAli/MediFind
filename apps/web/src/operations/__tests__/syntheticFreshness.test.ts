import { describe, expect, it } from 'vitest';

import { getSyntheticListingFreshness } from '../syntheticFreshness';

const NOW = '2026-08-21T00:00:00.000Z';

describe('synthetic listing freshness', () => {
  it('keeps a listing current for less than 24 hours', () => {
    expect(getSyntheticListingFreshness('2026-08-20T12:00:00.000Z', NOW)).toEqual({
      state: 'current',
      publiclyEligible: true,
    });
  });

  it('marks a listing as possibly outdated from 24 hours through seven days', () => {
    expect(getSyntheticListingFreshness('2026-08-19T23:59:59.000Z', NOW)).toEqual({
      state: 'may_be_outdated',
      publiclyEligible: true,
    });
  });

  it('removes a listing from public eligibility at seven days', () => {
    expect(getSyntheticListingFreshness('2026-08-14T00:00:00.000Z', NOW)).toEqual({
      state: 'excluded',
      publiclyEligible: false,
    });
  });

  it('fails closed for an invalid timestamp', () => {
    expect(getSyntheticListingFreshness('not-a-timestamp', NOW)).toEqual({
      state: 'excluded',
      publiclyEligible: false,
    });
  });
});
