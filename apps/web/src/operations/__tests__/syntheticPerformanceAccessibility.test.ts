import { describe, expect, it } from 'vitest';

import {
  evaluateSyntheticPerformanceAccessibility,
  type SyntheticPerformanceAccessibilityRecord,
} from '../syntheticPerformanceAccessibility';

function record(
  overrides: Partial<SyntheticPerformanceAccessibilityRecord> = {},
): SyntheticPerformanceAccessibilityRecord {
  return {
    device: 'synthetic-mid-range-android',
    browser: 'synthetic-chrome',
    network: 'synthetic-3g-fiji-profile',
    buildCommit: '5f2ba11',
    measurementMethod: 'local synthetic harness, invented sample data',
    searchP95Ms: 1500,
    firstResultsMs: 2200,
    listingUpdateMinutes: 3,
    accessibilityChecks: {
      keyboard: 'pass',
      screen_reader: 'pass',
      mobile: 'pass',
      desktop: 'pass',
      scale_200: 'pass',
      reduced_motion: 'pass',
      contrast: 'pass',
      offline: 'pass',
    },
    defects: [],
    ...overrides,
  };
}

describe('synthetic performance/accessibility rehearsal', () => {
  it('reaches a go decision when every target and check passes', () => {
    const result = evaluateSyntheticPerformanceAccessibility(record());

    expect(result).toEqual({
      performanceWithinTarget: true,
      accessibilityPassed: true,
      releaseDecision: 'go',
      incompleteChecks: [],
      failedChecks: [],
    });
  });

  it('reaches no_go when the search p95 target is missed', () => {
    const result = evaluateSyntheticPerformanceAccessibility(record({ searchP95Ms: 2500 }));

    expect(result.performanceWithinTarget).toBe(false);
    expect(result.releaseDecision).toBe('no_go');
  });

  it('reaches no_go and lists the specific failed accessibility checks', () => {
    const result = evaluateSyntheticPerformanceAccessibility(
      record({
        accessibilityChecks: {
          keyboard: 'pass',
          screen_reader: 'fail',
          mobile: 'pass',
          desktop: 'pass',
          scale_200: 'pass',
          reduced_motion: 'pass',
          contrast: 'fail',
          offline: 'pass',
        },
      }),
    );

    expect(result.accessibilityPassed).toBe(false);
    expect(result.failedChecks.sort()).toEqual(['contrast', 'screen_reader']);
    expect(result.releaseDecision).toBe('no_go');
  });

  it('treats an unobserved check as blocking rather than a silent pass', () => {
    const result = evaluateSyntheticPerformanceAccessibility(
      record({
        accessibilityChecks: {
          keyboard: 'pass',
          screen_reader: 'pass',
          mobile: 'pass',
          desktop: 'pass',
          scale_200: 'pass',
          reduced_motion: 'pass',
          contrast: 'pass',
          offline: 'not_run',
        },
      }),
    );

    expect(result.accessibilityPassed).toBe(false);
    expect(result.incompleteChecks).toEqual(['offline']);
    expect(result.releaseDecision).toBe('no_go');
  });

  it('reaches no_go when a defect is recorded even with clean metrics', () => {
    const result = evaluateSyntheticPerformanceAccessibility(
      record({ defects: ['synthetic scale_200 layout overflow on requests screen'] }),
    );

    expect(result.releaseDecision).toBe('no_go');
  });
});
