export type SyntheticListingFreshness = {
  state: 'current' | 'may_be_outdated' | 'excluded';
  publiclyEligible: boolean;
};

const CURRENT_WINDOW_MS = 24 * 60 * 60 * 1000;
const PUBLIC_ELIGIBILITY_WINDOW_MS = 7 * CURRENT_WINDOW_MS;

export function getSyntheticListingFreshness(
  updatedAt: string,
  evaluatedAt: string,
): SyntheticListingFreshness {
  const updatedTime = Date.parse(updatedAt);
  const evaluatedTime = Date.parse(evaluatedAt);
  const age = evaluatedTime - updatedTime;

  if (!Number.isFinite(updatedTime) || !Number.isFinite(evaluatedTime) || age < 0) {
    return { state: 'excluded', publiclyEligible: false };
  }

  if (age < CURRENT_WINDOW_MS) {
    return { state: 'current', publiclyEligible: true };
  }

  if (age < PUBLIC_ELIGIBILITY_WINDOW_MS) {
    return { state: 'may_be_outdated', publiclyEligible: true };
  }

  return { state: 'excluded', publiclyEligible: false };
}
