import * as React from 'react';
import type { SyntheticMatchKind, SyntheticSearchListing } from '@medifind/contracts';

import { buildDirectionsHref, buildTelHref } from '../contact/links';
import { strings } from '../content/strings';
import type { DisplayDistance } from '../search/distance';
import { formatFjd } from '../search/format';
import { StatusBadge } from './StatusBadge';
import { availabilityPresentation, matchKindLabel } from './statusPresentation';

export interface ResultDetailSheetProps {
  listing: SyntheticSearchListing;
  matchKind: SyntheticMatchKind;
  displayDistance: DisplayDistance;
  showDistance: boolean;
  onClose: () => void;
}

function hasCoordinates(
  listing: SyntheticSearchListing,
): listing is SyntheticSearchListing & { pharmacyLatitude: number; pharmacyLongitude: number } {
  return listing.pharmacyLatitude !== undefined && listing.pharmacyLongitude !== undefined;
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute('disabled'));
}

/**
 * A local, read-only detail dialog. It has no reservation, upload or
 * request action — only identity, pack, pharmacy attribution,
 * price/freshness, the two always-available Call/Directions contact
 * actions and the required safety copy. Call/Directions are `tel:`/`geo:`
 * links resolved by the browser's own navigation to the verified synthetic
 * branch contact/location, not an application network call. Implements
 * the standard modal-dialog keyboard contract: focus moves in on open, Tab
 * is trapped inside the dialog, Escape closes it, and focus returns to the
 * element that opened it.
 */
export function ResultDetailSheet({
  listing,
  matchKind,
  displayDistance,
  showDistance,
  onClose,
}: ResultDetailSheetProps) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const titleId = React.useId();
  const availability = availabilityPresentation(listing.availability);

  React.useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = dialog ? getFocusable(dialog) : [];
    (focusable[0] ?? dialog)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialog) return;

      const items = getFocusable(dialog);
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
    // Intentionally runs once per mount/unmount only: onClose is stable
    // from the caller's perspective for the lifetime of an open dialog.
  }, []);

  return (
    <div className="detail-sheet__overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="detail-sheet"
        data-testid="result-detail-sheet"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="detail-sheet__header">
          <h2 id={titleId} className="detail-sheet__title">
            {strings.detailSheetTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={strings.detailSheetCloseLabel}
            className="detail-sheet__close"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <p className="detail-sheet__match-kind">{matchKindLabel(matchKind)}</p>
        <p className="detail-sheet__medicine-name">{listing.medicineDisplayName}</p>
        {listing.brandName ? <p className="detail-sheet__supporting">{listing.brandName}</p> : null}
        <p className="detail-sheet__supporting">
          {listing.strength} · {listing.dosageForm} · {listing.packDescription}
        </p>

        <p className="detail-sheet__pharmacy-line">
          {strings.detailSheetPharmacyPrefix} {listing.pharmacyDisplayName}
        </p>
        {showDistance ? <p className="detail-sheet__supporting">{displayDistance.label}</p> : null}
        {listing.pharmacyAddressDisplay ? (
          <p className="detail-sheet__supporting">
            {strings.detailSheetAddressPrefix}: {listing.pharmacyAddressDisplay}
          </p>
        ) : null}

        {listing.pharmacyPhoneDisplay || hasCoordinates(listing) ? (
          <div className="detail-sheet__actions">
            {listing.pharmacyPhoneDisplay ? (
              <a
                href={buildTelHref(listing.pharmacyPhoneDisplay)}
                aria-label={`${strings.callActionAccessiblePrefix} ${listing.pharmacyDisplayName}`}
                className="detail-sheet__action"
              >
                <span aria-hidden="true">☎</span> {strings.callActionLabel}
              </a>
            ) : null}
            {hasCoordinates(listing) ? (
              <a
                href={buildDirectionsHref(
                  listing.pharmacyLatitude,
                  listing.pharmacyLongitude,
                  listing.pharmacyDisplayName,
                )}
                aria-label={`${strings.directionsActionAccessiblePrefix} ${listing.pharmacyDisplayName}`}
                className="detail-sheet__action"
              >
                <span aria-hidden="true">⌖</span> {strings.directionsActionLabel}
              </a>
            ) : null}
          </div>
        ) : null}

        <div className="detail-sheet__status-row">
          <StatusBadge
            label={availability.label}
            tone={availability.tone}
            glyph={availability.glyph}
          />
          {listing.freshness === 'may_be_outdated' ? (
            <StatusBadge label={strings.freshnessMayBeOutdatedLabel} tone="warning" glyph="⏱" />
          ) : null}
        </div>

        <p className="detail-sheet__price">{formatFjd(listing.priceFjdMinor)}</p>
        <p className="detail-sheet__supporting">
          {strings.lastUpdatedPrefix}: {listing.lastUpdatedDisplay}
        </p>

        <div className="safety-block">
          <p className="safety-block__text">{strings.safetyAvailabilityPrice}</p>
          <p className="safety-block__text">{strings.safetyReservationNoGuarantee}</p>
          <p className="safety-block__text">{strings.safetyPrescriptionMayBeRequired}</p>
          <p className="safety-block__text">{strings.safetyNoMedicalAdvice}</p>
        </div>
      </div>
    </div>
  );
}
