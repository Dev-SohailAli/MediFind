/**
 * Local-only synthetic branch-listing lifecycle simulation (ADR-277
 * Milestone B, final bullet: "listing creation/edit/review/publish/
 * unpublish and exact-pack price rules"). Every listing here is created,
 * edited and reviewed entirely in memory; nothing is sent to or read from
 * a network request, and this never touches the real Task 4 D1 search
 * schema or the public search projection apps/worker actually serves.
 *
 * Field/price rules follow ADR-023 (brand and/or active ingredient,
 * dosage form and pack size are required; strength only where
 * applicable), ADR-221/ADR-222 (exactly one current exact-pack FJD price
 * per listing — never a range or estimate, and a different pack size is a
 * separate listing, never folded into this one), and the design
 * proposal's Inventory section (§5.2) for the `identity_review_required`
 * pending-publish state and the duplicate/ambiguous-match warning at save
 * time.
 */

export const SYNTHETIC_ONLY = true as const;

export type ListingLifecycleState = 'identity_review_required' | 'published' | 'unpublished';
export type ListingAvailability = 'in_stock' | 'low_stock' | 'unavailable';
export type ListingCategory = 'otc' | 'prescription_required';

export interface SyntheticListingInput {
  readonly brandName: string | null;
  readonly activeIngredientDisplayName: string;
  readonly dosageForm: string;
  readonly packDescription: string;
  readonly strength: string | null;
  readonly category: ListingCategory;
  readonly availability: ListingAvailability;
  readonly priceFjdMinor: number;
  readonly note: string | null;
}

export interface SyntheticListing extends SyntheticListingInput {
  readonly id: string;
  readonly branchId: string;
  readonly lifecycleState: ListingLifecycleState;
  readonly lastUpdatedAt: string;
}

export interface SyntheticListingsState {
  readonly listings: readonly SyntheticListing[];
}

export function createInitialListingsState(): SyntheticListingsState {
  return { listings: [] };
}

export type SyntheticListingsAction =
  | { readonly type: 'create'; readonly branchId: string; readonly input: SyntheticListingInput }
  | {
      readonly type: 'update_pricing';
      readonly listingId: string;
      readonly availability: ListingAvailability;
      readonly priceFjdMinor: number;
    }
  | {
      readonly type: 'edit_details';
      readonly listingId: string;
      readonly input: SyntheticListingInput;
    }
  | { readonly type: 'approve_identity'; readonly listingId: string }
  | { readonly type: 'publish'; readonly listingId: string }
  | { readonly type: 'unpublish'; readonly listingId: string };

export type ListingFieldErrorField = 'identity' | 'dosageForm' | 'packDescription' | 'price';

/**
 * Client-side validation, kept pure and separate from the reducer so the
 * reducer itself never has to reject a well-formed create action — the
 * same split already used for the sign-in details form.
 */
export function validateListingInput(
  input: Pick<
    SyntheticListingInput,
    'brandName' | 'activeIngredientDisplayName' | 'dosageForm' | 'packDescription' | 'priceFjdMinor'
  >,
): readonly ListingFieldErrorField[] {
  const errors: ListingFieldErrorField[] = [];

  if (!input.brandName?.trim() && !input.activeIngredientDisplayName.trim()) {
    errors.push('identity');
  }
  if (!input.dosageForm.trim()) {
    errors.push('dosageForm');
  }
  if (!input.packDescription.trim()) {
    errors.push('packDescription');
  }
  if (!Number.isSafeInteger(input.priceFjdMinor) || input.priceFjdMinor <= 0) {
    errors.push('price');
  }

  return errors;
}

function normalizeIdentityKey(input: {
  activeIngredientDisplayName: string;
  dosageForm: string;
  strength: string | null;
  packDescription: string;
}): string {
  return [
    input.activeIngredientDisplayName,
    input.dosageForm,
    input.strength ?? '',
    input.packDescription,
  ]
    .map((value) => value.trim().toLowerCase())
    .join('|');
}

/**
 * Finds an existing listing at the same branch with the same identity
 * (active ingredient, dosage form, strength, pack) as the given input.
 * Per ADR-222 this is a warning, not a hard block — a different pack size
 * is a legitimately separate listing, so only an exact match warns.
 */
export function findDuplicateListing(
  listings: readonly SyntheticListing[],
  branchId: string,
  input: Pick<
    SyntheticListingInput,
    'activeIngredientDisplayName' | 'dosageForm' | 'strength' | 'packDescription'
  >,
): SyntheticListing | null {
  const key = normalizeIdentityKey(input);
  return (
    listings.find(
      (listing) => listing.branchId === branchId && normalizeIdentityKey(listing) === key,
    ) ?? null
  );
}

const STALE_AFTER_MS = 24 * 60 * 60_000;

export function isListingStale(lastUpdatedAt: string, now: Date = new Date()): boolean {
  return now.getTime() - new Date(lastUpdatedAt).getTime() > STALE_AFTER_MS;
}

export function syntheticListingsReducer(
  state: SyntheticListingsState,
  action: SyntheticListingsAction,
  now: Date = new Date(),
): SyntheticListingsState {
  switch (action.type) {
    case 'create': {
      const listing: SyntheticListing = {
        ...action.input,
        id: crypto.randomUUID(),
        branchId: action.branchId,
        lifecycleState: 'identity_review_required',
        lastUpdatedAt: now.toISOString(),
      };
      return { listings: [...state.listings, listing] };
    }

    case 'update_pricing': {
      return {
        listings: state.listings.map((listing) =>
          listing.id === action.listingId
            ? {
                ...listing,
                availability: action.availability,
                priceFjdMinor: action.priceFjdMinor,
                lastUpdatedAt: now.toISOString(),
              }
            : listing,
        ),
      };
    }

    case 'edit_details': {
      return {
        listings: state.listings.map((listing) =>
          listing.id === action.listingId
            ? { ...listing, ...action.input, lastUpdatedAt: now.toISOString() }
            : listing,
        ),
      };
    }

    case 'approve_identity': {
      return {
        listings: state.listings.map((listing) =>
          listing.id === action.listingId && listing.lifecycleState === 'identity_review_required'
            ? { ...listing, lifecycleState: 'published' }
            : listing,
        ),
      };
    }

    case 'publish': {
      return {
        listings: state.listings.map((listing) =>
          listing.id === action.listingId && listing.lifecycleState === 'unpublished'
            ? { ...listing, lifecycleState: 'published' }
            : listing,
        ),
      };
    }

    case 'unpublish': {
      return {
        listings: state.listings.map((listing) =>
          listing.id === action.listingId && listing.lifecycleState === 'published'
            ? { ...listing, lifecycleState: 'unpublished' }
            : listing,
        ),
      };
    }

    default:
      return state;
  }
}
