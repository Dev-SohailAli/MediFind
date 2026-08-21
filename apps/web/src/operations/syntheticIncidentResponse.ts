export type SyntheticIncidentType =
  | 'prescription_exposure'
  | 'mfa_compromise'
  | 'malicious_file'
  | 'cross_branch_auth_failure'
  | 'kill_switch_activation'
  | 'backup_restore_failure';

export type SyntheticIncidentExercise = {
  type: SyntheticIncidentType;
  containmentElapsedMinutes: number;
  missedControls: string[];
  correctiveOwner: string | null;
  correctiveDueDate: string | null;
  retestPassed: boolean | null;
};

const CRITICAL_INCIDENT_TYPES: ReadonlySet<SyntheticIncidentType> = new Set([
  'prescription_exposure',
  'mfa_compromise',
]);

const CONTAINMENT_THRESHOLD_MINUTES = 60;

export type SyntheticIncidentEvaluation = {
  containmentMet: boolean;
  isCritical: boolean;
  prescriptionActivationBlocked: boolean;
  correctiveActionRequired: boolean;
};

/**
 * Only prescription_exposure and mfa_compromise are critical enough to block
 * prescription activation on failed containment; the other exercise types
 * still require corrective follow-up but never gate that capability.
 */
export function evaluateSyntheticIncidentExercise(
  exercise: SyntheticIncidentExercise,
): SyntheticIncidentEvaluation {
  const containmentMet =
    exercise.containmentElapsedMinutes <= CONTAINMENT_THRESHOLD_MINUTES &&
    exercise.missedControls.length === 0;
  const isCritical = CRITICAL_INCIDENT_TYPES.has(exercise.type);

  return {
    containmentMet,
    isCritical,
    prescriptionActivationBlocked: isCritical && !containmentMet,
    correctiveActionRequired: !containmentMet || exercise.retestPassed !== true,
  };
}
