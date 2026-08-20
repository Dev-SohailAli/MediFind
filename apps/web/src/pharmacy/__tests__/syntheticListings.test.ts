import { describe, expect, it } from 'vitest';

import {
  createInitialListingsState,
  findDuplicateListing,
  isListingStale,
  syntheticListingsReducer,
  validateListingInput,
  type SyntheticListingInput,
  type SyntheticListingsState,
} from '../syntheticListings';

const NOW = new Date('2026-08-19T00:00:00.000Z');

const VALID_INPUT: SyntheticListingInput = {
  brandName: 'Calorex Relief',
  activeIngredientDisplayName: 'Zephyramine',
  dosageForm: 'Capsule',
  packDescription: 'Pack of 10',
  strength: '200 mg',
  category: 'otc',
  availability: 'in_stock',
  priceFjdMinor: 1120,
  note: null,
};

function createOne(
  state: SyntheticListingsState = createInitialListingsState(),
  input: SyntheticListingInput = VALID_INPUT,
  branchId = 'suva-central',
): SyntheticListingsState {
  return syntheticListingsReducer(state, { type: 'create', branchId, input }, NOW);
}

describe('validateListingInput', () => {
  it('accepts a fully valid input with no errors', () => {
    expect(validateListingInput(VALID_INPUT)).toEqual([]);
  });

  it('requires at least a brand or an active ingredient, not necessarily both', () => {
    expect(validateListingInput({ ...VALID_INPUT, brandName: null })).toEqual([]);
    expect(
      validateListingInput({ ...VALID_INPUT, brandName: null, activeIngredientDisplayName: '' }),
    ).toEqual(['identity']);
  });

  it('requires dosage form and pack description', () => {
    expect(validateListingInput({ ...VALID_INPUT, dosageForm: '  ' })).toEqual(['dosageForm']);
    expect(validateListingInput({ ...VALID_INPUT, packDescription: '' })).toEqual([
      'packDescription',
    ]);
  });

  it('requires a positive exact integer price — never zero, negative or a range', () => {
    expect(validateListingInput({ ...VALID_INPUT, priceFjdMinor: 0 })).toEqual(['price']);
    expect(validateListingInput({ ...VALID_INPUT, priceFjdMinor: -50 })).toEqual(['price']);
    expect(validateListingInput({ ...VALID_INPUT, priceFjdMinor: 12.5 })).toEqual(['price']);
  });

  it('reports every violated field at once, not just the first', () => {
    expect(
      validateListingInput({
        brandName: null,
        activeIngredientDisplayName: '',
        dosageForm: '',
        packDescription: '',
        priceFjdMinor: -1,
      }),
    ).toEqual(['identity', 'dosageForm', 'packDescription', 'price']);
  });
});

describe('findDuplicateListing', () => {
  it('finds an existing listing at the same branch with the identical identity/form/strength/pack', () => {
    const state = createOne();

    const duplicate = findDuplicateListing(state.listings, 'suva-central', VALID_INPUT);

    expect(duplicate?.id).toBe(state.listings[0]!.id);
  });

  it('does not treat a different pack size as a duplicate (ADR-222: separate packs are separate listings)', () => {
    const state = createOne();

    const duplicate = findDuplicateListing(state.listings, 'suva-central', {
      ...VALID_INPUT,
      packDescription: 'Pack of 20',
    });

    expect(duplicate).toBeNull();
  });

  it('does not treat the same identity at a different branch as a duplicate', () => {
    const state = createOne();

    const duplicate = findDuplicateListing(state.listings, 'harbourview', VALID_INPUT);

    expect(duplicate).toBeNull();
  });
});

describe('isListingStale', () => {
  it('is not stale within 24 hours', () => {
    const almost24h = new Date(NOW.getTime() + 23 * 60 * 60_000);
    expect(isListingStale(NOW.toISOString(), almost24h)).toBe(false);
  });

  it('is stale after 24 hours', () => {
    const past24h = new Date(NOW.getTime() + 25 * 60 * 60_000);
    expect(isListingStale(NOW.toISOString(), past24h)).toBe(true);
  });
});

describe('syntheticListingsReducer', () => {
  it('creates a new listing pending identity review, never immediately published', () => {
    const state = createOne();

    expect(state.listings).toHaveLength(1);
    expect(state.listings[0]).toMatchObject({
      branchId: 'suva-central',
      lifecycleState: 'identity_review_required',
      lastUpdatedAt: NOW.toISOString(),
      ...VALID_INPUT,
    });
    expect(state.listings[0]!.id).toEqual(expect.any(String));
  });

  it('approve_identity moves a listing from identity_review_required to published', () => {
    const created = createOne();
    const id = created.listings[0]!.id;

    const result = syntheticListingsReducer(
      created,
      { type: 'approve_identity', listingId: id },
      NOW,
    );

    expect(result.listings[0]!.lifecycleState).toBe('published');
  });

  it('approve_identity is a no-op on a listing that is not pending review', () => {
    const created = createOne();
    const id = created.listings[0]!.id;
    const published = syntheticListingsReducer(
      created,
      { type: 'approve_identity', listingId: id },
      NOW,
    );

    const result = syntheticListingsReducer(
      published,
      { type: 'approve_identity', listingId: id },
      NOW,
    );

    expect(result).toEqual(published);
  });

  it('publish only succeeds from unpublished, and unpublish only from published', () => {
    const created = createOne();
    const id = created.listings[0]!.id;
    const published = syntheticListingsReducer(
      created,
      { type: 'approve_identity', listingId: id },
      NOW,
    );

    // Cannot publish an already-published listing via the explicit publish
    // action (it only reverses unpublish).
    const noopPublish = syntheticListingsReducer(
      published,
      { type: 'publish', listingId: id },
      NOW,
    );
    expect(noopPublish).toEqual(published);

    const unpublished = syntheticListingsReducer(
      published,
      { type: 'unpublish', listingId: id },
      NOW,
    );
    expect(unpublished.listings[0]!.lifecycleState).toBe('unpublished');

    const republished = syntheticListingsReducer(
      unpublished,
      { type: 'publish', listingId: id },
      NOW,
    );
    expect(republished.listings[0]!.lifecycleState).toBe('published');
  });

  it('unpublish is a no-op on a listing still pending identity review', () => {
    const created = createOne();
    const id = created.listings[0]!.id;

    const result = syntheticListingsReducer(created, { type: 'unpublish', listingId: id }, NOW);

    expect(result).toEqual(created);
  });

  it('update_pricing changes availability/price and refreshes lastUpdatedAt regardless of lifecycle state', () => {
    const created = createOne();
    const id = created.listings[0]!.id;
    const later = new Date(NOW.getTime() + 60_000);

    const result = syntheticListingsReducer(
      created,
      { type: 'update_pricing', listingId: id, availability: 'low_stock', priceFjdMinor: 999 },
      later,
    );

    expect(result.listings[0]).toMatchObject({
      availability: 'low_stock',
      priceFjdMinor: 999,
      lastUpdatedAt: later.toISOString(),
      lifecycleState: 'identity_review_required',
    });
  });

  it('edit_details replaces the identity/category/note fields and refreshes lastUpdatedAt without changing lifecycle state', () => {
    const created = createOne();
    const id = created.listings[0]!.id;
    const published = syntheticListingsReducer(
      created,
      { type: 'approve_identity', listingId: id },
      NOW,
    );
    const later = new Date(NOW.getTime() + 60_000);

    const edited: SyntheticListingInput = {
      ...VALID_INPUT,
      priceFjdMinor: 1500,
      note: 'Fridge item',
    };
    const result = syntheticListingsReducer(
      published,
      { type: 'edit_details', listingId: id, input: edited },
      later,
    );

    expect(result.listings[0]).toMatchObject({
      ...edited,
      lifecycleState: 'published',
      lastUpdatedAt: later.toISOString(),
    });
  });

  it('every mutation is scoped to the target listing ID and leaves other listings untouched', () => {
    const first = createOne(createInitialListingsState(), VALID_INPUT, 'suva-central');
    const both = createOne(
      first,
      { ...VALID_INPUT, packDescription: 'Pack of 20' },
      'suva-central',
    );
    const secondId = both.listings[1]!.id;

    const result = syntheticListingsReducer(
      both,
      { type: 'approve_identity', listingId: secondId },
      NOW,
    );

    expect(result.listings[0]!.lifecycleState).toBe('identity_review_required');
    expect(result.listings[1]!.lifecycleState).toBe('published');
  });
});
