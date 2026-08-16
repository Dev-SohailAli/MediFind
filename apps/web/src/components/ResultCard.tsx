import { Clock } from 'lucide-react';
import type { SyntheticMatchKind, SyntheticSearchListing } from '@medifind/contracts';

import { strings } from '../content/strings';
import type { DisplayDistance } from '../search/distance';
import { formatFjd } from '../search/format';
import { StatusBadge } from './StatusBadge';
import { availabilityPresentation, matchKindLabel } from './statusPresentation';

export interface ResultCardProps {
  listing: SyntheticSearchListing;
  matchKind: SyntheticMatchKind;
  displayDistance: DisplayDistance;
  showDistance: boolean;
  onPress: () => void;
}

export function ResultCard({
  listing,
  matchKind,
  displayDistance,
  showDistance,
  onPress,
}: ResultCardProps) {
  const availability = availabilityPresentation(listing.availability);
  const priceText = formatFjd(listing.priceFjdMinor);

  const accessibleName = [
    listing.medicineDisplayName,
    matchKindLabel(matchKind),
    listing.pharmacyDisplayName,
    availability.label,
    priceText,
    listing.freshness === 'may_be_outdated' ? strings.freshnessMayBeOutdatedLabel : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <button type="button" onClick={onPress} aria-label={accessibleName} className="result-card">
      <span className="result-card__match-kind" aria-hidden="true">
        {matchKindLabel(matchKind)}
      </span>

      <span className="result-card__title">{listing.medicineDisplayName}</span>
      {listing.brandName ? (
        <span className="result-card__supporting">{listing.brandName}</span>
      ) : null}

      <span className="result-card__supporting">
        {listing.strength} · {listing.dosageForm} · {listing.packDescription}
      </span>

      <span className="result-card__supporting">{listing.pharmacyDisplayName}</span>

      <span className="result-card__status-row">
        <StatusBadge label={availability.label} tone={availability.tone} icon={availability.icon} />
        {listing.freshness === 'may_be_outdated' ? (
          <StatusBadge label={strings.freshnessMayBeOutdatedLabel} tone="warning" icon={Clock} />
        ) : null}
      </span>

      <span className="result-card__footer">
        <span className="result-card__price">{priceText}</span>
        <span className="result-card__supporting">
          {strings.lastUpdatedPrefix}: {listing.lastUpdatedDisplay}
        </span>
      </span>

      {showDistance ? (
        <span className="result-card__supporting">{displayDistance.label}</span>
      ) : null}
    </button>
  );
}
