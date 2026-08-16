import type { SyntheticAvailability, SyntheticMatchKind } from '@medifind/contracts';

import { strings } from '../content/strings';
import type { BadgeTone } from './StatusBadge';

export function availabilityPresentation(availability: SyntheticAvailability): {
  label: string;
  tone: BadgeTone;
  glyph: string;
} {
  switch (availability) {
    case 'in_stock':
      return { label: strings.availabilityInStockLabel, tone: 'success', glyph: '✓' };
    case 'low_stock':
      return { label: strings.availabilityLowStockLabel, tone: 'warning', glyph: '▲' };
    case 'unavailable':
      return { label: strings.availabilityUnavailableLabel, tone: 'neutral', glyph: '⊘' };
  }
}

export function matchKindLabel(kind: SyntheticMatchKind): string {
  switch (kind) {
    case 'exact_product':
      return strings.matchExactLabel;
    case 'active_ingredient':
      return strings.matchActiveIngredientLabel;
  }
}
