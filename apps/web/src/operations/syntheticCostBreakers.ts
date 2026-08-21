export type SyntheticCostBreakerInput = {
  otpPercent: number;
  uploadScanPercent: number;
  reservationPercent: number;
};

type SyntheticFeatureState = 'normal' | 'warning' | 'paused';

export type SyntheticCostBreakerResult = {
  level: 'normal' | 'warning' | 'elevated' | 'ceiling';
  features: {
    otp: SyntheticFeatureState;
    uploadsScans: SyntheticFeatureState;
    reservations: SyntheticFeatureState;
  };
  pausedFeatures: Array<'otp' | 'uploads_scans' | 'reservations'>;
  safeSearch: 'available';
  reenableRequiresFounderAuth: boolean;
};

function normalizePercent(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

function getFeatureState(percent: number): SyntheticFeatureState {
  if (percent >= 100) return 'paused';
  if (percent >= 50) return 'warning';
  return 'normal';
}

export function evaluateSyntheticCostBreakers(
  input: SyntheticCostBreakerInput,
): SyntheticCostBreakerResult {
  const usage = {
    otp: normalizePercent(input.otpPercent),
    uploadsScans: normalizePercent(input.uploadScanPercent),
    reservations: normalizePercent(input.reservationPercent),
  };
  const features = {
    otp: getFeatureState(usage.otp),
    uploadsScans: getFeatureState(usage.uploadsScans),
    reservations: getFeatureState(usage.reservations),
  };
  const pausedFeatures = (
    Object.entries(features) as Array<[keyof typeof features, SyntheticFeatureState]>
  )
    .filter(([, state]) => state === 'paused')
    .map(([feature]) => (feature === 'uploadsScans' ? 'uploads_scans' : feature));
  const highestUsage = Math.max(usage.otp, usage.uploadsScans, usage.reservations);

  return {
    level:
      highestUsage >= 100
        ? 'ceiling'
        : highestUsage >= 80
          ? 'elevated'
          : highestUsage >= 50
            ? 'warning'
            : 'normal',
    features,
    pausedFeatures,
    safeSearch: 'available',
    reenableRequiresFounderAuth: pausedFeatures.length > 0,
  };
}
