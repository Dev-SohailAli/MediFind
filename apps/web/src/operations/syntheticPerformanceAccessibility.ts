export type SyntheticAccessibilityCheck =
  | 'keyboard'
  | 'screen_reader'
  | 'mobile'
  | 'desktop'
  | 'scale_200'
  | 'reduced_motion'
  | 'contrast'
  | 'offline';

export type SyntheticCheckResult = 'pass' | 'fail' | 'not_run';

export const SYNTHETIC_ACCESSIBILITY_CHECKS: readonly SyntheticAccessibilityCheck[] = [
  'keyboard',
  'screen_reader',
  'mobile',
  'desktop',
  'scale_200',
  'reduced_motion',
  'contrast',
  'offline',
];

export type SyntheticPerformanceAccessibilityRecord = {
  device: string;
  browser: string;
  network: string;
  buildCommit: string;
  measurementMethod: string;
  searchP95Ms: number;
  firstResultsMs: number;
  listingUpdateMinutes: number;
  accessibilityChecks: Record<SyntheticAccessibilityCheck, SyntheticCheckResult>;
  defects: string[];
};

const SEARCH_P95_TARGET_MS = 2000;
const FIRST_RESULTS_TARGET_MS = 3000;
const LISTING_UPDATE_TARGET_MINUTES = 5;

export type SyntheticPerformanceAccessibilityEvaluation = {
  performanceWithinTarget: boolean;
  accessibilityPassed: boolean;
  releaseDecision: 'go' | 'no_go';
  incompleteChecks: SyntheticAccessibilityCheck[];
  failedChecks: SyntheticAccessibilityCheck[];
};

/**
 * A `not_run` check is neither a pass nor a fail — it means the rehearsal
 * could not observe real device/browser/network evidence in this
 * environment, which must block release exactly like a failure rather than
 * being silently treated as acceptable.
 */
export function evaluateSyntheticPerformanceAccessibility(
  record: SyntheticPerformanceAccessibilityRecord,
): SyntheticPerformanceAccessibilityEvaluation {
  const performanceWithinTarget =
    record.searchP95Ms <= SEARCH_P95_TARGET_MS &&
    record.firstResultsMs <= FIRST_RESULTS_TARGET_MS &&
    record.listingUpdateMinutes <= LISTING_UPDATE_TARGET_MINUTES;

  const failedChecks = SYNTHETIC_ACCESSIBILITY_CHECKS.filter(
    (check) => record.accessibilityChecks[check] === 'fail',
  );
  const incompleteChecks = SYNTHETIC_ACCESSIBILITY_CHECKS.filter(
    (check) => record.accessibilityChecks[check] === 'not_run',
  );
  const accessibilityPassed = failedChecks.length === 0 && incompleteChecks.length === 0;

  const releaseDecision: 'go' | 'no_go' =
    performanceWithinTarget && accessibilityPassed && record.defects.length === 0 ? 'go' : 'no_go';

  return {
    performanceWithinTarget,
    accessibilityPassed,
    releaseDecision,
    incompleteChecks,
    failedChecks,
  };
}
