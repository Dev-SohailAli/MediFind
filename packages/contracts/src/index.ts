export const PACKAGE_BOUNDARY = 'contracts' as const;

/**
 * Task 2 synthetic buyer-search contract. Every value described by these
 * types is a fictional prototype demonstrator (see
 * docs/task-2-synthetic-buyer-search-specification.md). None of these types
 * describe a production/API/persistence schema.
 */

export type SyntheticAvailability = 'in_stock' | 'low_stock' | 'unavailable';

export type SyntheticFreshness = 'current' | 'may_be_outdated';

export type SyntheticMatchKind = 'exact_product' | 'active_ingredient';

export type SyntheticSort = 'relevance' | 'price_low_to_high' | 'distance';

export type SyntheticArea = 'harbour' | 'garden' | 'market';

export interface SyntheticSearchListing {
  id: string;
  medicineDisplayName: string;
  brandName?: string;
  activeIngredientDisplayName: string;
  strength: string;
  dosageForm: string;
  packDescription: string;
  aliases: readonly string[];
  pharmacyDisplayName: string;
  /** Synthetic public branch contact/location fields (ADR-214: verified
   * public branch location only, for native-map directions). Not a buyer
   * location and never derived from device geolocation. Optional so a
   * client without contact data for a fixture can omit the Call/Directions
   * actions rather than show a broken link. */
  pharmacyPhoneDisplay?: string;
  pharmacyAddressDisplay?: string;
  pharmacyLatitude?: number;
  pharmacyLongitude?: number;
  syntheticArea: SyntheticArea;
  syntheticDistanceLabel: string;
  syntheticDistanceRank: number;
  availability: SyntheticAvailability;
  priceFjdMinor: number;
  freshness: SyntheticFreshness;
  lastUpdatedDisplay: string;
  searchEligible: boolean;
}
