import { buildProjection, DEFAULT_STALE_AFTER_MS } from '../data/projection.js';
import type {
  MedicineConceptRow,
  MedicineListingRow,
  PharmacyBranchRow,
  PharmacyOrganisationRow,
} from '../data/projection.js';

/**
 * SYNTHETIC_ONLY: every value below is a deterministic transformation of the
 * existing fictional demonstrators in
 * apps/web/src/fixtures/syntheticListings.ts (see
 * docs/task-4-synthetic-d1-data-contract-proposal.md "Synthetic fixture
 * plan"). None of these names describe a real product, business or clinical
 * fact. Fixture IDs are stable and derived only from the existing fixture
 * IDs. All timestamps are fixed; no fixture reads the wall clock.
 */
export const SYNTHETIC_ONLY = true as const;

// Fixed reference instant the fixture set is authored against. Only this
// constant (not Date.now()) decides which listings are "stale" — the
// Excludex listing's last_refreshed_at is deliberately 9 days before this
// value, one week outside the 7-day eligibility window used by
// buildProjection.
export const REFERENCE_NOW_ISO = '2026-08-17T00:00:00.000Z';

const TODAY = '2026-08-17T00:00:00.000Z';
const YESTERDAY = '2026-08-16T00:00:00.000Z';
const TWO_DAYS_AGO = '2026-08-15T00:00:00.000Z';
const NINE_DAYS_AGO = '2026-08-08T00:00:00.000Z';

export const medicineConcepts: readonly MedicineConceptRow[] = [
  {
    id: 'concept-nivaprin',
    displayName: 'Nivaprin',
    activeIngredientDisplayName: 'Bentholine',
    strength: '500 mg',
    dosageForm: 'Tablet',
    packDescription: 'Pack of 20',
    aliases: ['bentholine relief'],
    approvalState: 'approved',
  },
  {
    id: 'concept-calorex-relief',
    displayName: 'Calorex Relief',
    activeIngredientDisplayName: 'Zephyramine',
    strength: '200 mg',
    dosageForm: 'Capsule',
    packDescription: 'Pack of 10',
    aliases: ['zephyramine forte', 'calorex alt'],
    approvalState: 'approved',
  },
  {
    id: 'concept-quandryl',
    displayName: 'Quandryl',
    activeIngredientDisplayName: 'Marisolvin',
    strength: '10 mg',
    dosageForm: 'Tablet',
    packDescription: 'Pack of 30',
    aliases: [],
    approvalState: 'approved',
  },
  {
    id: 'concept-trelavex',
    displayName: 'Trelavex',
    activeIngredientDisplayName: 'Halvonide',
    strength: '50 mg',
    dosageForm: 'Ointment',
    packDescription: '30 g tube',
    aliases: ['halvonide cream'],
    approvalState: 'approved',
  },
  {
    id: 'concept-purenex',
    displayName: 'Purenex',
    activeIngredientDisplayName: 'Sanolithine',
    strength: '5 mg',
    dosageForm: 'Tablet',
    packDescription: 'Pack of 14',
    aliases: ['sanolithine mild'],
    approvalState: 'approved',
  },
  {
    id: 'concept-zephyrium',
    displayName: 'Zephyrium',
    activeIngredientDisplayName: 'Corvaline',
    strength: '100 mg',
    dosageForm: 'Capsule',
    packDescription: 'Pack of 20',
    aliases: ['corvaline plus'],
    approvalState: 'approved',
  },
  {
    // The stale exclusion is represented on the listing (listingState +
    // last_refreshed_at), not by inventing a concept-level rejection: this
    // concept's own approvalState stays 'approved' per the accepted
    // contract.
    id: 'concept-excludex',
    displayName: 'Excludex',
    activeIngredientDisplayName: 'Voidamine',
    strength: '20 mg',
    dosageForm: 'Tablet',
    packDescription: 'Pack of 10',
    aliases: [],
    approvalState: 'approved',
  },
];

export const pharmacyOrganisations: readonly PharmacyOrganisationRow[] = [
  {
    id: 'org-solandra',
    displayName: 'Solandra Pharmacy (synthetic)',
    verificationState: 'verified',
    publicVisibilityState: 'visible',
  },
  {
    id: 'org-marketside',
    displayName: 'Marketside Pharmacy (synthetic)',
    verificationState: 'verified',
    publicVisibilityState: 'visible',
  },
  {
    id: 'org-gardenview',
    displayName: 'Gardenview Apothecary (synthetic)',
    verificationState: 'verified',
    publicVisibilityState: 'visible',
  },
  {
    id: 'org-harbourline',
    displayName: 'Harbourline Pharmacy (synthetic)',
    verificationState: 'verified',
    publicVisibilityState: 'visible',
  },
];

export const pharmacyBranches: readonly PharmacyBranchRow[] = [
  {
    id: 'branch-solandra',
    organisationId: 'org-solandra',
    displayName: 'Solandra Pharmacy (synthetic)',
    syntheticArea: 'harbour',
    directionText:
      'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).',
    publicVisibilityState: 'visible',
  },
  {
    id: 'branch-marketside',
    organisationId: 'org-marketside',
    displayName: 'Marketside Pharmacy (synthetic)',
    syntheticArea: 'market',
    directionText:
      'Synthetic directions: near the market synthetic checkpoint (fixture data only).',
    publicVisibilityState: 'visible',
  },
  {
    id: 'branch-gardenview',
    organisationId: 'org-gardenview',
    displayName: 'Gardenview Apothecary (synthetic)',
    syntheticArea: 'garden',
    directionText:
      'Synthetic directions: near the garden synthetic checkpoint (fixture data only).',
    publicVisibilityState: 'visible',
  },
  {
    id: 'branch-harbourline',
    organisationId: 'org-harbourline',
    displayName: 'Harbourline Pharmacy (synthetic)',
    syntheticArea: 'harbour',
    directionText:
      'Synthetic directions: near the harbour synthetic checkpoint (fixture data only).',
    publicVisibilityState: 'visible',
  },
];

export const medicineListings: readonly MedicineListingRow[] = [
  {
    id: 'nivaprin-solandra',
    conceptId: 'concept-nivaprin',
    branchId: 'branch-solandra',
    brandName: 'Nivaprin Rapid',
    availabilityState: 'in_stock',
    priceFjdMinor: 850,
    syntheticDistanceLabel: '1.2 km (synthetic)',
    syntheticDistanceRank: 1,
    lastRefreshedAt: TODAY,
    listingState: 'active',
    identityMatchState: 'approved',
    version: 1,
  },
  {
    id: 'nivaprin-marketside',
    conceptId: 'concept-nivaprin',
    branchId: 'branch-marketside',
    brandName: 'Nivaprin Rapid',
    availabilityState: 'low_stock',
    priceFjdMinor: 790,
    syntheticDistanceLabel: '3.4 km (synthetic)',
    syntheticDistanceRank: 4,
    lastRefreshedAt: YESTERDAY,
    listingState: 'active',
    identityMatchState: 'approved',
    version: 1,
  },
  {
    id: 'calorex-gardenview',
    conceptId: 'concept-calorex-relief',
    branchId: 'branch-gardenview',
    brandName: null,
    availabilityState: 'in_stock',
    priceFjdMinor: 1120,
    syntheticDistanceLabel: '0.8 km (synthetic)',
    syntheticDistanceRank: 1,
    lastRefreshedAt: TODAY,
    listingState: 'active',
    identityMatchState: 'approved',
    version: 1,
  },
  {
    id: 'quandryl-harbourline',
    conceptId: 'concept-quandryl',
    branchId: 'branch-harbourline',
    brandName: null,
    availabilityState: 'unavailable',
    priceFjdMinor: 640,
    syntheticDistanceLabel: '2.1 km (synthetic)',
    syntheticDistanceRank: 2,
    lastRefreshedAt: TWO_DAYS_AGO,
    listingState: 'active',
    identityMatchState: 'approved',
    version: 1,
  },
  {
    id: 'trelavex-marketside',
    conceptId: 'concept-trelavex',
    branchId: 'branch-marketside',
    brandName: null,
    availabilityState: 'in_stock',
    priceFjdMinor: 990,
    syntheticDistanceLabel: '3.0 km (synthetic)',
    syntheticDistanceRank: 3,
    lastRefreshedAt: TWO_DAYS_AGO,
    listingState: 'active',
    identityMatchState: 'approved',
    version: 1,
  },
  {
    id: 'purenex-gardenview',
    conceptId: 'concept-purenex',
    branchId: 'branch-gardenview',
    brandName: null,
    availabilityState: 'low_stock',
    priceFjdMinor: 430,
    syntheticDistanceLabel: '1.5 km (synthetic)',
    syntheticDistanceRank: 2,
    lastRefreshedAt: TODAY,
    listingState: 'active',
    identityMatchState: 'approved',
    version: 1,
  },
  {
    id: 'zephyrium-harbourline',
    conceptId: 'concept-zephyrium',
    branchId: 'branch-harbourline',
    brandName: null,
    availabilityState: 'in_stock',
    priceFjdMinor: 710,
    syntheticDistanceLabel: '1.8 km (synthetic)',
    syntheticDistanceRank: 2,
    lastRefreshedAt: TODAY,
    listingState: 'active',
    identityMatchState: 'approved',
    version: 1,
  },
  {
    // Deliberately stale/excluded: 9 days before REFERENCE_NOW_ISO is past
    // the 7-day search eligibility window, and listing_state is 'excluded'
    // directly. Both gates independently keep it out of the projection; see
    // data/projection.test.ts.
    id: 'excludex-solandra-ineligible',
    conceptId: 'concept-excludex',
    branchId: 'branch-solandra',
    brandName: null,
    availabilityState: 'in_stock',
    priceFjdMinor: 500,
    syntheticDistanceLabel: '1.0 km (synthetic)',
    syntheticDistanceRank: 1,
    lastRefreshedAt: NINE_DAYS_AGO,
    listingState: 'excluded',
    identityMatchState: 'approved',
    version: 1,
  },
];

export const { projection: publicSearchProjection, terms: publicSearchTerms } = buildProjection(
  {
    concepts: medicineConcepts,
    organisations: pharmacyOrganisations,
    branches: pharmacyBranches,
    listings: medicineListings,
  },
  { referenceNowIso: REFERENCE_NOW_ISO, staleAfterMs: DEFAULT_STALE_AFTER_MS },
);
