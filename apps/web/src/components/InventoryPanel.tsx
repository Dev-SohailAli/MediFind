import * as React from 'react';

import { strings } from '../content/strings';
import { formatFjd } from '../search/format';
import {
  findDuplicateListing,
  isListingStale,
  validateListingInput,
  type ListingAvailability,
  type ListingCategory,
  type ListingFieldErrorField,
  type SyntheticListing,
  type SyntheticListingInput,
  type SyntheticListingsAction,
} from '../pharmacy/syntheticListings';

const AVAILABILITY_LABEL: Record<ListingAvailability, string> = {
  in_stock: strings.availabilityInStockLabel,
  low_stock: strings.availabilityLowStockLabel,
  unavailable: strings.availabilityUnavailableLabel,
};

const LIFECYCLE_LABEL: Record<SyntheticListing['lifecycleState'], string> = {
  identity_review_required: strings.listingLifecycleReviewLabel,
  published: strings.listingLifecyclePublishedLabel,
  unpublished: strings.listingLifecycleUnpublishedLabel,
};

const FIELD_ERROR_TEXT: Record<ListingFieldErrorField, string> = {
  identity: strings.addListingIdentityError,
  dosageForm: strings.addListingDosageFormError,
  packDescription: strings.addListingPackError,
  price: strings.addListingPriceError,
};

const EMPTY_INPUT: SyntheticListingInput = {
  brandName: null,
  activeIngredientDisplayName: '',
  dosageForm: '',
  packDescription: '',
  strength: null,
  category: 'otc',
  availability: 'in_stock',
  priceFjdMinor: 0,
  note: null,
};

function QuickPricingForm({
  listing,
  dispatch,
}: {
  listing: SyntheticListing;
  dispatch: React.Dispatch<SyntheticListingsAction>;
}) {
  const [availability, setAvailability] = React.useState<ListingAvailability>(listing.availability);
  const [priceInput, setPriceInput] = React.useState(String(listing.priceFjdMinor / 100));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const majorValue = Number(priceInput);
    if (!Number.isFinite(majorValue) || majorValue <= 0) {
      return;
    }
    dispatch({
      type: 'update_pricing',
      listingId: listing.id,
      availability,
      priceFjdMinor: Math.round(majorValue * 100),
    });
  }

  return (
    <form className="listing-quick-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={`availability-${listing.id}`}>
        {strings.listingQuickAvailabilityLabel}
      </label>
      <select
        id={`availability-${listing.id}`}
        value={availability}
        onChange={(event) => setAvailability(event.target.value as ListingAvailability)}
      >
        {(Object.keys(AVAILABILITY_LABEL) as ListingAvailability[]).map((value) => (
          <option key={value} value={value}>
            {AVAILABILITY_LABEL[value]}
          </option>
        ))}
      </select>
      <label className="sr-only" htmlFor={`price-${listing.id}`}>
        {strings.listingQuickPriceLabel}
      </label>
      <input
        id={`price-${listing.id}`}
        type="number"
        min="0.01"
        step="0.01"
        value={priceInput}
        onChange={(event) => setPriceInput(event.target.value)}
      />
      <button type="submit" className="auth-button auth-button--secondary">
        {strings.listingUpdatePricingSaveLabel}
      </button>
    </form>
  );
}

function ListingRow({
  listing,
  dispatch,
}: {
  listing: SyntheticListing;
  dispatch: React.Dispatch<SyntheticListingsAction>;
}) {
  const stale = isListingStale(listing.lastUpdatedAt);

  return (
    <li className="listing-row">
      <div className="listing-row__header">
        <p className="listing-row__name">
          {listing.brandName ?? listing.activeIngredientDisplayName}
          {listing.brandName ? ` — ${listing.activeIngredientDisplayName}` : ''}
        </p>
        <span className="status-badge status-badge--neutral">
          {LIFECYCLE_LABEL[listing.lifecycleState]}
        </span>
        {stale ? (
          <span className="status-badge status-badge--warning">{strings.listingStaleLabel}</span>
        ) : null}
      </div>
      <p className="listing-row__details">
        {listing.dosageForm} · {listing.packDescription}
        {listing.strength ? ` · ${listing.strength}` : ''} · {formatFjd(listing.priceFjdMinor)}
      </p>

      <QuickPricingForm listing={listing} dispatch={dispatch} />

      <div className="auth-actions">
        {listing.lifecycleState === 'identity_review_required' ? (
          <button
            type="button"
            className="auth-button auth-button--secondary"
            onClick={() => dispatch({ type: 'approve_identity', listingId: listing.id })}
          >
            {strings.listingApproveIdentityLabel}
          </button>
        ) : null}
        {listing.lifecycleState === 'published' ? (
          <button
            type="button"
            className="auth-button auth-button--secondary"
            onClick={() => dispatch({ type: 'unpublish', listingId: listing.id })}
          >
            {strings.listingUnpublishLabel}
          </button>
        ) : null}
        {listing.lifecycleState === 'unpublished' ? (
          <button
            type="button"
            className="auth-button auth-button--secondary"
            onClick={() => dispatch({ type: 'publish', listingId: listing.id })}
          >
            {strings.listingPublishLabel}
          </button>
        ) : null}
      </div>
    </li>
  );
}

function AddListingForm({
  branchId,
  listings,
  dispatch,
}: {
  branchId: string;
  listings: readonly SyntheticListing[];
  dispatch: React.Dispatch<SyntheticListingsAction>;
}) {
  const [input, setInput] = React.useState<SyntheticListingInput>(EMPTY_INPUT);
  const [priceText, setPriceText] = React.useState('');
  const [errors, setErrors] = React.useState<readonly ListingFieldErrorField[]>([]);
  const [duplicateNotice, setDuplicateNotice] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const priceMajor = Number(priceText);
    const priceFjdMinor = Number.isFinite(priceMajor) ? Math.round(priceMajor * 100) : NaN;
    const candidate: SyntheticListingInput = { ...input, priceFjdMinor };

    const fieldErrors = validateListingInput(candidate);
    setErrors(fieldErrors);
    if (fieldErrors.length > 0) {
      setDuplicateNotice(false);
      return;
    }

    const duplicate = findDuplicateListing(listings, branchId, candidate);
    setDuplicateNotice(duplicate !== null);

    dispatch({ type: 'create', branchId, input: candidate });
    setInput(EMPTY_INPUT);
    setPriceText('');
  }

  return (
    <form className="auth-form listing-add-form" onSubmit={handleSubmit} noValidate>
      <h3 className="auth-form__title">{strings.addListingTitle}</h3>

      {errors.includes('identity') ? (
        <p className="auth-field__error" role="alert">
          {FIELD_ERROR_TEXT.identity}
        </p>
      ) : null}

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`brand-${branchId}`}>
          {strings.addListingBrandLabel}
        </label>
        <input
          id={`brand-${branchId}`}
          className="auth-field__input"
          type="text"
          value={input.brandName ?? ''}
          onChange={(event) => setInput({ ...input, brandName: event.target.value || null })}
        />
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`ingredient-${branchId}`}>
          {strings.addListingIngredientLabel}
        </label>
        <input
          id={`ingredient-${branchId}`}
          className="auth-field__input"
          type="text"
          value={input.activeIngredientDisplayName}
          onChange={(event) =>
            setInput({ ...input, activeIngredientDisplayName: event.target.value })
          }
        />
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`dosage-form-${branchId}`}>
          {strings.addListingDosageFormLabel}
        </label>
        <input
          id={`dosage-form-${branchId}`}
          className="auth-field__input"
          type="text"
          value={input.dosageForm}
          aria-invalid={errors.includes('dosageForm') ? true : undefined}
          onChange={(event) => setInput({ ...input, dosageForm: event.target.value })}
        />
        {errors.includes('dosageForm') ? (
          <p className="auth-field__error" role="alert">
            {FIELD_ERROR_TEXT.dosageForm}
          </p>
        ) : null}
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`pack-${branchId}`}>
          {strings.addListingPackLabel}
        </label>
        <input
          id={`pack-${branchId}`}
          className="auth-field__input"
          type="text"
          value={input.packDescription}
          aria-invalid={errors.includes('packDescription') ? true : undefined}
          onChange={(event) => setInput({ ...input, packDescription: event.target.value })}
        />
        {errors.includes('packDescription') ? (
          <p className="auth-field__error" role="alert">
            {FIELD_ERROR_TEXT.packDescription}
          </p>
        ) : null}
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`strength-${branchId}`}>
          {strings.addListingStrengthLabel}
        </label>
        <input
          id={`strength-${branchId}`}
          className="auth-field__input"
          type="text"
          value={input.strength ?? ''}
          onChange={(event) => setInput({ ...input, strength: event.target.value || null })}
        />
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`category-${branchId}`}>
          {strings.addListingCategoryLabel}
        </label>
        <select
          id={`category-${branchId}`}
          value={input.category}
          onChange={(event) =>
            setInput({ ...input, category: event.target.value as ListingCategory })
          }
        >
          <option value="otc">{strings.addListingCategoryOtcLabel}</option>
          <option value="prescription_required">
            {strings.addListingCategoryPrescriptionLabel}
          </option>
        </select>
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`availability-new-${branchId}`}>
          {strings.addListingAvailabilityLabel}
        </label>
        <select
          id={`availability-new-${branchId}`}
          value={input.availability}
          onChange={(event) =>
            setInput({ ...input, availability: event.target.value as ListingAvailability })
          }
        >
          {(Object.keys(AVAILABILITY_LABEL) as ListingAvailability[]).map((value) => (
            <option key={value} value={value}>
              {AVAILABILITY_LABEL[value]}
            </option>
          ))}
        </select>
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`price-new-${branchId}`}>
          {strings.addListingPriceLabel}
        </label>
        <input
          id={`price-new-${branchId}`}
          className="auth-field__input"
          type="number"
          min="0.01"
          step="0.01"
          value={priceText}
          aria-invalid={errors.includes('price') ? true : undefined}
          onChange={(event) => setPriceText(event.target.value)}
        />
        {errors.includes('price') ? (
          <p className="auth-field__error" role="alert">
            {FIELD_ERROR_TEXT.price}
          </p>
        ) : null}
      </div>

      <div className="auth-field">
        <label className="auth-field__label" htmlFor={`note-${branchId}`}>
          {strings.addListingNoteLabel}
        </label>
        <input
          id={`note-${branchId}`}
          className="auth-field__input"
          type="text"
          value={input.note ?? ''}
          onChange={(event) => setInput({ ...input, note: event.target.value || null })}
        />
      </div>

      <p className="auth-form__demo-hint">{strings.inventoryAuditReminder}</p>

      {duplicateNotice ? (
        <p className="auth-field__error" role="alert">
          {strings.addListingDuplicateWarning}
        </p>
      ) : null}

      <button type="submit" className="auth-button auth-button--primary">
        {strings.addListingSubmitLabel}
      </button>
    </form>
  );
}

export interface InventoryPanelProps {
  readonly branchId: string;
  readonly listings: readonly SyntheticListing[];
  readonly dispatch: React.Dispatch<SyntheticListingsAction>;
}

/**
 * Branch-scoped listing lifecycle management (design proposal §5.2
 * Inventory): list, quick price/availability update, the
 * identity_review_required → published review step (simulated locally —
 * a real reviewer role lives on MediFind's side, not this pharmacy
 * workspace), publish/unpublish, and the add-listing form with exact-pack
 * price validation and a non-blocking duplicate-identity warning.
 */
export function InventoryPanel({ branchId, listings, dispatch }: InventoryPanelProps) {
  const branchListings = listings.filter((listing) => listing.branchId === branchId);

  return (
    <div className="inventory-panel">
      {branchListings.length === 0 ? (
        <p className="state-block__title">{strings.inventoryEmpty}</p>
      ) : (
        <ul className="listing-list">
          {branchListings.map((listing) => (
            <ListingRow key={listing.id} listing={listing} dispatch={dispatch} />
          ))}
        </ul>
      )}

      <AddListingForm branchId={branchId} listings={listings} dispatch={dispatch} />
    </div>
  );
}
