export type SyntheticReconciliationRun = {
  cursor: string;
  idempotencyKey: string;
  startedAt: string;
  completedAt: string;
  recordsProcessed: number;
};

export type SyntheticReconciliationLedger = ReadonlyArray<SyntheticReconciliationRun>;

const ALERT_THRESHOLD_MINUTES = 30;

/**
 * A retried run carries the same idempotencyKey as the run it retries, so it
 * replaces the prior entry instead of double-counting processed records.
 */
export function applySyntheticReconciliationRun(
  ledger: SyntheticReconciliationLedger,
  run: SyntheticReconciliationRun,
): SyntheticReconciliationLedger {
  const existingIndex = ledger.findIndex((entry) => entry.idempotencyKey === run.idempotencyKey);
  if (existingIndex === -1) {
    return [...ledger, run];
  }
  const next = [...ledger];
  next[existingIndex] = run;
  return next;
}

export type SyntheticReconciliationStatus = {
  minutesSinceLastRun: number | null;
  alertLevel: 'normal' | 'delayed_alert';
  readsEnforceStaleness: true;
  safeSearchAvailable: true;
};

export function evaluateSyntheticReconciliationStatus(
  ledger: SyntheticReconciliationLedger,
  evaluatedAt: string,
): SyntheticReconciliationStatus {
  const evaluatedMs = Date.parse(evaluatedAt);
  const lastCompletedMs = ledger
    .map((run) => Date.parse(run.completedAt))
    .filter((ms) => Number.isFinite(ms))
    .sort((a, b) => b - a)[0];

  if (!Number.isFinite(evaluatedMs) || lastCompletedMs === undefined) {
    return {
      minutesSinceLastRun: null,
      alertLevel: 'delayed_alert',
      readsEnforceStaleness: true,
      safeSearchAvailable: true,
    };
  }

  const minutesSinceLastRun = Math.max(0, (evaluatedMs - lastCompletedMs) / 60_000);

  return {
    minutesSinceLastRun,
    alertLevel: minutesSinceLastRun > ALERT_THRESHOLD_MINUTES ? 'delayed_alert' : 'normal',
    readsEnforceStaleness: true,
    safeSearchAvailable: true,
  };
}
