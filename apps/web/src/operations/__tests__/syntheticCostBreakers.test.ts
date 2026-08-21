import { describe, expect, it } from 'vitest';

import { evaluateSyntheticCostBreakers } from '../syntheticCostBreakers';

describe('synthetic cost breakers', () => {
  it('warns at 50% while keeping every feature available', () => {
    const result = evaluateSyntheticCostBreakers({
      otpPercent: 50,
      uploadScanPercent: 20,
      reservationPercent: 10,
    });

    expect(result.level).toBe('warning');
    expect(result.safeSearch).toBe('available');
    expect(result.pausedFeatures).toEqual([]);
  });

  it('warns independently at 80% without pausing unrelated features', () => {
    const result = evaluateSyntheticCostBreakers({
      otpPercent: 80,
      uploadScanPercent: 10,
      reservationPercent: 10,
    });

    expect(result.level).toBe('elevated');
    expect(result.features.otp).toBe('warning');
    expect(result.features.uploadsScans).toBe('normal');
    expect(result.features.reservations).toBe('normal');
    expect(result.pausedFeatures).toEqual([]);
    expect(result.safeSearch).toBe('available');
  });

  it('pauses only the feature at 100% and preserves safe search', () => {
    const result = evaluateSyntheticCostBreakers({
      otpPercent: 20,
      uploadScanPercent: 100,
      reservationPercent: 50,
    });

    expect(result.level).toBe('ceiling');
    expect(result.features).toEqual({
      otp: 'normal',
      uploadsScans: 'paused',
      reservations: 'warning',
    });
    expect(result.pausedFeatures).toEqual(['uploads_scans']);
    expect(result.safeSearch).toBe('available');
    expect(result.reenableRequiresFounderAuth).toBe(true);
  });

  it('clamps invalid usage values and never allows a browser-level override', () => {
    const result = evaluateSyntheticCostBreakers({
      otpPercent: -5,
      uploadScanPercent: Number.NaN,
      reservationPercent: 150,
    });

    expect(result.features).toEqual({
      otp: 'normal',
      uploadsScans: 'normal',
      reservations: 'paused',
    });
    expect(result.safeSearch).toBe('available');
    expect(result.reenableRequiresFounderAuth).toBe(true);
  });
});
