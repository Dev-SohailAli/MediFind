import { normalizeText, tokenizeWords } from './normalize.js';

export type SyntheticArea = 'harbour' | 'market' | 'garden';
export type ApprovalState = 'approved' | 'excluded';
export type VerificationState = 'verified' | 'unverified' | 'suspended';
export type VisibilityState = 'visible' | 'hidden';
export type AvailabilityState = 'in_stock' | 'low_stock' | 'unavailable';
export type ListingState = 'active' | 'excluded';
export type IdentityMatchState = 'approved' | 'candidate' | 'rejected';
export type MatchKind = 'product' | 'ingredient' | 'alias';

export interface MedicineConceptRow {
  readonly id: string;
  readonly displayName: string;
  readonly activeIngredientDisplayName: string;
  readonly strength: string;
  readonly dosageForm: string;
  readonly packDescription: string;
  readonly aliases: readonly string[];
  readonly approvalState: ApprovalState;
}

export interface PharmacyOrganisationRow {
  readonly id: string;
  readonly displayName: string;
  readonly verificationState: VerificationState;
  readonly publicVisibilityState: VisibilityState;
}

export interface PharmacyBranchRow {
  readonly id: string;
  readonly organisationId: string;
  readonly displayName: string;
  readonly syntheticArea: SyntheticArea;
  readonly directionText: string;
  readonly publicVisibilityState: VisibilityState;
}

export interface MedicineListingRow {
  readonly id: string;
  readonly conceptId: string;
  readonly branchId: string;
  readonly brandName: string | null;
  readonly availabilityState: AvailabilityState;
  readonly priceFjdMinor: number;
  readonly syntheticDistanceLabel: string;
  readonly syntheticDistanceRank: number;
  readonly lastRefreshedAt: string;
  readonly listingState: ListingState;
  readonly identityMatchState: IdentityMatchState;
  readonly version: number;
}

export interface PublicSearchProjectionRow {
  readonly listingId: string;
  readonly medicineDisplayName: string;
  readonly brandName: string | null;
  readonly activeIngredientDisplayName: string;
  readonly strength: string;
  readonly dosageForm: string;
  readonly packDescription: string;
  readonly pharmacyDisplayName: string;
  readonly syntheticArea: SyntheticArea;
  readonly directionText: string;
  readonly availabilityState: AvailabilityState;
  readonly priceFjdMinor: number;
  readonly syntheticDistanceLabel: string;
  readonly syntheticDistanceRank: number;
  readonly lastRefreshedAt: string;
  readonly sourceVersion: number;
}

export interface PublicSearchTermRow {
  readonly listingId: string;
  readonly normalizedTerm: string;
  readonly matchKind: MatchKind;
}

export interface BuildProjectionInput {
  readonly concepts: readonly MedicineConceptRow[];
  readonly organisations: readonly PharmacyOrganisationRow[];
  readonly branches: readonly PharmacyBranchRow[];
  readonly listings: readonly MedicineListingRow[];
}

export interface BuildProjectionOptions {
  readonly referenceNowIso: string;
  readonly staleAfterMs: number;
}

export interface BuildProjectionResult {
  readonly projection: readonly PublicSearchProjectionRow[];
  readonly terms: readonly PublicSearchTermRow[];
}

export const DEFAULT_STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

function isEligible(
  listing: MedicineListingRow,
  concept: MedicineConceptRow | undefined,
  branch: PharmacyBranchRow | undefined,
  organisation: PharmacyOrganisationRow | undefined,
  options: BuildProjectionOptions,
): boolean {
  if (!concept || !branch || !organisation) {
    return false;
  }
  if (listing.listingState !== 'active' || listing.identityMatchState !== 'approved') {
    return false;
  }
  if (concept.approvalState !== 'approved') {
    return false;
  }
  if (
    branch.publicVisibilityState !== 'visible' ||
    organisation.publicVisibilityState !== 'visible'
  ) {
    return false;
  }
  if (organisation.verificationState !== 'verified') {
    return false;
  }

  const referenceNow = Date.parse(options.referenceNowIso);
  const refreshedAt = Date.parse(listing.lastRefreshedAt);
  if (referenceNow - refreshedAt > options.staleAfterMs) {
    return false;
  }

  return true;
}

function collectTerms(
  listingId: string,
  concept: MedicineConceptRow,
  brandName: string | null,
  into: Map<string, PublicSearchTermRow>,
): void {
  const addTerm = (candidate: string, matchKind: MatchKind) => {
    for (const token of tokenizeWords(normalizeText(candidate))) {
      into.set(`${listingId}|${token}|${matchKind}`, {
        listingId,
        normalizedTerm: token,
        matchKind,
      });
    }
  };

  addTerm(concept.displayName, 'product');
  if (brandName) {
    addTerm(brandName, 'product');
  }
  addTerm(concept.activeIngredientDisplayName, 'ingredient');
  for (const alias of concept.aliases) {
    addTerm(alias, 'alias');
  }
}

/**
 * Deterministic, pure source-to-projection/term construction (no I/O, no
 * wall-clock read). This is the "reviewed migration step" the Task 4 data
 * contract describes as the only legitimate way to build/replace the public
 * projection; there is no runtime write path and no browser-triggered
 * rebuild. Eligibility combines listing, identity, concept-approval,
 * branch/organisation visibility, organisation verification and freshness
 * gates, matching docs/task-4-synthetic-d1-data-contract-proposal.md.
 */
export function buildProjection(
  input: BuildProjectionInput,
  options: BuildProjectionOptions,
): BuildProjectionResult {
  const conceptsById = new Map(input.concepts.map((concept) => [concept.id, concept]));
  const branchesById = new Map(input.branches.map((branch) => [branch.id, branch]));
  const organisationsById = new Map(input.organisations.map((org) => [org.id, org]));

  const projection: PublicSearchProjectionRow[] = [];
  const termsByKey = new Map<string, PublicSearchTermRow>();

  for (const listing of input.listings) {
    const concept = conceptsById.get(listing.conceptId);
    const branch = branchesById.get(listing.branchId);
    const organisation = branch ? organisationsById.get(branch.organisationId) : undefined;

    if (!isEligible(listing, concept, branch, organisation, options)) {
      continue;
    }
    // isEligible already guarantees these are defined; narrow for TypeScript.
    if (!concept || !branch || !organisation) {
      continue;
    }

    projection.push({
      listingId: listing.id,
      medicineDisplayName: concept.displayName,
      brandName: listing.brandName,
      activeIngredientDisplayName: concept.activeIngredientDisplayName,
      strength: concept.strength,
      dosageForm: concept.dosageForm,
      packDescription: concept.packDescription,
      pharmacyDisplayName: branch.displayName,
      syntheticArea: branch.syntheticArea,
      directionText: branch.directionText,
      availabilityState: listing.availabilityState,
      priceFjdMinor: listing.priceFjdMinor,
      syntheticDistanceLabel: listing.syntheticDistanceLabel,
      syntheticDistanceRank: listing.syntheticDistanceRank,
      lastRefreshedAt: listing.lastRefreshedAt,
      sourceVersion: listing.version,
    });

    collectTerms(listing.id, concept, listing.brandName, termsByKey);
  }

  projection.sort((a, b) => a.listingId.localeCompare(b.listingId));

  const terms = [...termsByKey.values()].sort((a, b) => {
    if (a.listingId !== b.listingId) return a.listingId.localeCompare(b.listingId);
    if (a.normalizedTerm !== b.normalizedTerm)
      return a.normalizedTerm.localeCompare(b.normalizedTerm);
    return a.matchKind.localeCompare(b.matchKind);
  });

  return { projection, terms };
}
