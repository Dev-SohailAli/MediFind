import { describe, expect, it } from 'vitest';

import {
  evaluateSyntheticActivation,
  type SyntheticActivationPrerequisites,
} from '../syntheticActivation';

const readyPrerequisites: SyntheticActivationPrerequisites = {
  ownerVerified: true,
  ownerContinuity: true,
  inventoryManagerReady: true,
  prescriptionReviewerReady: true,
  mfaReady: true,
  agreementCurrent: true,
  trainingCurrent: true,
  hoursCurrent: true,
  listingRefreshAcknowledged: true,
  syntheticExercisesPassed: true,
  supportEscalationAcknowledged: true,
  cohortInviteApproved: true,
};

describe('synthetic activation readiness', () => {
  it('enables all capabilities only when every readiness prerequisite is current', () => {
    const result = evaluateSyntheticActivation(readyPrerequisites);

    expect(result.status).toBe('active');
    expect(result.failedRequirements).toEqual([]);
    expect(result.capabilities).toEqual({
      publicListing: 'enabled',
      otcReservation: 'enabled',
      prescriptionRequest: 'enabled',
      prescriptionReview: 'enabled',
    });
  });

  it('keeps safe search/public listing available while an unready protected branch stays gated', () => {
    const result = evaluateSyntheticActivation({
      ...readyPrerequisites,
      prescriptionReviewerReady: false,
      syntheticExercisesPassed: false,
    });

    expect(result.status).toBe('not_ready');
    expect(result.failedRequirements).toEqual([
      'prescriptionReviewerReady',
      'syntheticExercisesPassed',
    ]);
    expect(result.capabilities.publicListing).toBe('enabled');
    expect(result.capabilities.otcReservation).toBe('enabled');
    expect(result.capabilities.prescriptionRequest).toBe('disabled');
    expect(result.capabilities.prescriptionReview).toBe('disabled');
  });

  it('fails closed when the cohort invite or owner continuity is missing', () => {
    const result = evaluateSyntheticActivation({
      ...readyPrerequisites,
      cohortInviteApproved: false,
      ownerContinuity: false,
    });

    expect(result.status).toBe('not_ready');
    expect(result.capabilities).toEqual({
      publicListing: 'disabled',
      otcReservation: 'disabled',
      prescriptionRequest: 'disabled',
      prescriptionReview: 'disabled',
    });
    expect(result.failedRequirements).toEqual(['ownerContinuity', 'cohortInviteApproved']);
  });
});
