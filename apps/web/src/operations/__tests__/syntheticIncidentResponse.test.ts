import { describe, expect, it } from 'vitest';

import {
  evaluateSyntheticIncidentExercise,
  type SyntheticIncidentExercise,
} from '../syntheticIncidentResponse';

function exercise(overrides: Partial<SyntheticIncidentExercise>): SyntheticIncidentExercise {
  return {
    type: 'prescription_exposure',
    containmentElapsedMinutes: 20,
    missedControls: [],
    correctiveOwner: 'founder',
    correctiveDueDate: '2026-08-28',
    retestPassed: true,
    ...overrides,
  };
}

describe('synthetic incident response evaluation', () => {
  it('clears a critical exercise with fast, complete containment', () => {
    const result = evaluateSyntheticIncidentExercise(exercise({}));

    expect(result).toEqual({
      containmentMet: true,
      isCritical: true,
      prescriptionActivationBlocked: false,
      correctiveActionRequired: false,
    });
  });

  it('blocks prescription activation when a critical exercise fails containment', () => {
    const result = evaluateSyntheticIncidentExercise(
      exercise({ type: 'mfa_compromise', containmentElapsedMinutes: 90 }),
    );

    expect(result.containmentMet).toBe(false);
    expect(result.isCritical).toBe(true);
    expect(result.prescriptionActivationBlocked).toBe(true);
    expect(result.correctiveActionRequired).toBe(true);
  });

  it('never blocks prescription activation for a non-critical exercise type', () => {
    const result = evaluateSyntheticIncidentExercise(
      exercise({ type: 'kill_switch_activation', missedControls: ['audit_log_not_written'] }),
    );

    expect(result.containmentMet).toBe(false);
    expect(result.isCritical).toBe(false);
    expect(result.prescriptionActivationBlocked).toBe(false);
    expect(result.correctiveActionRequired).toBe(true);
  });

  it('requires corrective action when containment is met but retest has not passed', () => {
    const result = evaluateSyntheticIncidentExercise(exercise({ retestPassed: null }));

    expect(result.containmentMet).toBe(true);
    expect(result.correctiveActionRequired).toBe(true);
  });

  it('treats any missed control as failed containment even within the time budget', () => {
    const result = evaluateSyntheticIncidentExercise(
      exercise({ missedControls: ['prescription_not_quarantined'] }),
    );

    expect(result.containmentMet).toBe(false);
    expect(result.prescriptionActivationBlocked).toBe(true);
  });
});
