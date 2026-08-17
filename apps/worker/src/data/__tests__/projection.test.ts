import { describe, expect, it } from 'vitest';

import {
  buildProjection,
  DEFAULT_STALE_AFTER_MS,
  type MedicineConceptRow,
  type MedicineListingRow,
  type PharmacyBranchRow,
  type PharmacyOrganisationRow,
} from '../projection.js';

const REFERENCE_NOW = '2026-08-17T00:00:00.000Z';

const concept: MedicineConceptRow = {
  id: 'concept-nivaprin',
  displayName: 'Nivaprin',
  activeIngredientDisplayName: 'Bentholine',
  strength: '500 mg',
  dosageForm: 'Tablet',
  packDescription: 'Pack of 20',
  aliases: ['bentholine relief'],
  approvalState: 'approved',
};

const staleConcept: MedicineConceptRow = {
  id: 'concept-excludex',
  displayName: 'Excludex',
  activeIngredientDisplayName: 'Voidamine',
  strength: '20 mg',
  dosageForm: 'Tablet',
  packDescription: 'Pack of 10',
  aliases: [],
  approvalState: 'approved',
};

const organisation: PharmacyOrganisationRow = {
  id: 'org-solandra',
  displayName: 'Solandra Pharmacy (synthetic)',
  verificationState: 'verified',
  publicVisibilityState: 'visible',
};

const branch: PharmacyBranchRow = {
  id: 'branch-solandra',
  organisationId: 'org-solandra',
  displayName: 'Solandra Pharmacy (synthetic)',
  syntheticArea: 'harbour',
  directionText: 'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).',
  publicVisibilityState: 'visible',
};

const eligibleListing: MedicineListingRow = {
  id: 'nivaprin-solandra',
  conceptId: 'concept-nivaprin',
  branchId: 'branch-solandra',
  brandName: 'Nivaprin Rapid',
  availabilityState: 'in_stock',
  priceFjdMinor: 850,
  syntheticDistanceLabel: '1.2 km (synthetic)',
  syntheticDistanceRank: 1,
  lastRefreshedAt: '2026-08-17T00:00:00.000Z',
  listingState: 'active',
  identityMatchState: 'approved',
  version: 1,
};

const staleListing: MedicineListingRow = {
  id: 'excludex-solandra-ineligible',
  conceptId: 'concept-excludex',
  branchId: 'branch-solandra',
  brandName: null,
  availabilityState: 'in_stock',
  priceFjdMinor: 500,
  syntheticDistanceLabel: '1.0 km (synthetic)',
  syntheticDistanceRank: 1,
  lastRefreshedAt: '2026-08-08T00:00:00.000Z',
  listingState: 'excluded',
  identityMatchState: 'approved',
  version: 1,
};

describe('buildProjection', () => {
  it('projects an eligible listing with the exact public-safe field set', () => {
    const result = buildProjection(
      {
        concepts: [concept],
        organisations: [organisation],
        branches: [branch],
        listings: [eligibleListing],
      },
      { referenceNowIso: REFERENCE_NOW, staleAfterMs: DEFAULT_STALE_AFTER_MS },
    );

    expect(result.projection).toEqual([
      {
        listingId: 'nivaprin-solandra',
        medicineDisplayName: 'Nivaprin',
        brandName: 'Nivaprin Rapid',
        activeIngredientDisplayName: 'Bentholine',
        strength: '500 mg',
        dosageForm: 'Tablet',
        packDescription: 'Pack of 20',
        pharmacyDisplayName: 'Solandra Pharmacy (synthetic)',
        syntheticArea: 'harbour',
        directionText:
          'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).',
        availabilityState: 'in_stock',
        priceFjdMinor: 850,
        syntheticDistanceLabel: '1.2 km (synthetic)',
        syntheticDistanceRank: 1,
        lastRefreshedAt: '2026-08-17T00:00:00.000Z',
        sourceVersion: 1,
      },
    ]);
  });

  it('builds product, ingredient and alias search terms, deduplicated and tokenized per word', () => {
    const result = buildProjection(
      {
        concepts: [concept],
        organisations: [organisation],
        branches: [branch],
        listings: [eligibleListing],
      },
      { referenceNowIso: REFERENCE_NOW, staleAfterMs: DEFAULT_STALE_AFTER_MS },
    );

    const byKind = (kind: 'product' | 'ingredient' | 'alias') =>
      result.terms
        .filter((t) => t.matchKind === kind)
        .map((t) => t.normalizedTerm)
        .sort();

    expect(byKind('product')).toEqual(['nivaprin', 'rapid']);
    expect(byKind('ingredient')).toEqual(['bentholine']);
    expect(byKind('alias')).toEqual(['bentholine', 'relief']);
  });

  it('excludes a listing whose listing_state is excluded, even though every other field would match', () => {
    const result = buildProjection(
      {
        concepts: [concept, staleConcept],
        organisations: [organisation],
        branches: [branch],
        listings: [eligibleListing, staleListing],
      },
      { referenceNowIso: REFERENCE_NOW, staleAfterMs: DEFAULT_STALE_AFTER_MS },
    );

    expect(result.projection.map((row) => row.listingId)).toEqual(['nivaprin-solandra']);
    expect(result.terms.some((term) => term.listingId === 'excludex-solandra-ineligible')).toBe(
      false,
    );
  });

  it('excludes a listing whose last_refreshed_at is older than the stale threshold, even if listing_state is active', () => {
    const staleButActiveListing: MedicineListingRow = {
      ...staleListing,
      listingState: 'active',
    };

    const result = buildProjection(
      {
        concepts: [concept, staleConcept],
        organisations: [organisation],
        branches: [branch],
        listings: [eligibleListing, staleButActiveListing],
      },
      { referenceNowIso: REFERENCE_NOW, staleAfterMs: DEFAULT_STALE_AFTER_MS },
    );

    expect(result.projection.map((row) => row.listingId)).toEqual(['nivaprin-solandra']);
  });

  it('excludes a listing whose branch is hidden, org is unverified, or concept is unapproved', () => {
    const hiddenBranch: PharmacyBranchRow = {
      ...branch,
      id: 'branch-hidden',
      publicVisibilityState: 'hidden',
    };
    const listingAtHiddenBranch: MedicineListingRow = {
      ...eligibleListing,
      id: 'listing-hidden-branch',
      branchId: 'branch-hidden',
    };

    const result = buildProjection(
      {
        concepts: [concept],
        organisations: [organisation],
        branches: [branch, hiddenBranch],
        listings: [eligibleListing, listingAtHiddenBranch],
      },
      { referenceNowIso: REFERENCE_NOW, staleAfterMs: DEFAULT_STALE_AFTER_MS },
    );

    expect(result.projection.map((row) => row.listingId)).toEqual(['nivaprin-solandra']);
  });

  it('is deterministic: rebuilding from the same input produces byte-identical output', () => {
    const input = {
      concepts: [concept, staleConcept],
      organisations: [organisation],
      branches: [branch],
      listings: [eligibleListing, staleListing],
    };
    const options = { referenceNowIso: REFERENCE_NOW, staleAfterMs: DEFAULT_STALE_AFTER_MS };

    const first = buildProjection(input, options);
    const second = buildProjection(input, options);

    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it('sorts projection and term rows by primary key for stable export output', () => {
    const secondConcept: MedicineConceptRow = {
      ...concept,
      id: 'concept-a-early',
      displayName: 'Aardvarkin',
    };
    const secondListing: MedicineListingRow = {
      ...eligibleListing,
      id: 'aardvarkin-solandra',
      conceptId: 'concept-a-early',
    };

    const result = buildProjection(
      {
        concepts: [concept, secondConcept],
        organisations: [organisation],
        branches: [branch],
        listings: [eligibleListing, secondListing],
      },
      { referenceNowIso: REFERENCE_NOW, staleAfterMs: DEFAULT_STALE_AFTER_MS },
    );

    const ids = result.projection.map((row) => row.listingId);
    expect(ids).toEqual([...ids].sort());
  });
});
