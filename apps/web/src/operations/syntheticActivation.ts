export type SyntheticActivationPrerequisites = {
  ownerVerified: boolean;
  ownerContinuity: boolean;
  inventoryManagerReady: boolean;
  prescriptionReviewerReady: boolean;
  mfaReady: boolean;
  agreementCurrent: boolean;
  trainingCurrent: boolean;
  hoursCurrent: boolean;
  listingRefreshAcknowledged: boolean;
  syntheticExercisesPassed: boolean;
  supportEscalationAcknowledged: boolean;
  cohortInviteApproved: boolean;
};

export type SyntheticCapabilityState = 'enabled' | 'disabled';

export type SyntheticActivationResult = {
  status: 'active' | 'not_ready';
  failedRequirements: Array<keyof SyntheticActivationPrerequisites>;
  capabilities: {
    publicListing: SyntheticCapabilityState;
    otcReservation: SyntheticCapabilityState;
    prescriptionRequest: SyntheticCapabilityState;
    prescriptionReview: SyntheticCapabilityState;
  };
};

const publicListingRequirements: Array<keyof SyntheticActivationPrerequisites> = [
  'ownerVerified',
  'ownerContinuity',
  'mfaReady',
  'agreementCurrent',
  'trainingCurrent',
  'hoursCurrent',
  'listingRefreshAcknowledged',
  'supportEscalationAcknowledged',
  'cohortInviteApproved',
];

export function evaluateSyntheticActivation(
  prerequisites: SyntheticActivationPrerequisites,
): SyntheticActivationResult {
  const failedRequirements = (
    Object.keys(prerequisites) as Array<keyof SyntheticActivationPrerequisites>
  ).filter((requirement) => !prerequisites[requirement]);

  const publicListingReady = publicListingRequirements.every(
    (requirement) => prerequisites[requirement],
  );
  const otcReservationReady = publicListingReady && prerequisites.inventoryManagerReady;
  const prescriptionReady =
    otcReservationReady &&
    prerequisites.prescriptionReviewerReady &&
    prerequisites.syntheticExercisesPassed;

  return {
    status: failedRequirements.length === 0 ? 'active' : 'not_ready',
    failedRequirements,
    capabilities: {
      publicListing: publicListingReady ? 'enabled' : 'disabled',
      otcReservation: otcReservationReady ? 'enabled' : 'disabled',
      prescriptionRequest: prescriptionReady ? 'enabled' : 'disabled',
      prescriptionReview: prescriptionReady ? 'enabled' : 'disabled',
    },
  };
}
