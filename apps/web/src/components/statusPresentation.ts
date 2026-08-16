import { Ban, CircleCheck, TriangleAlert } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SyntheticAvailability, SyntheticMatchKind } from '@medifind/contracts';

import { strings } from '../content/strings';
import type { BadgeTone } from './StatusBadge';

export function availabilityPresentation(availability: SyntheticAvailability): {
  label: string;
  tone: BadgeTone;
  icon: LucideIcon;
} {
  switch (availability) {
    case 'in_stock':
      return { label: strings.availabilityInStockLabel, tone: 'success', icon: CircleCheck };
    case 'low_stock':
      return { label: strings.availabilityLowStockLabel, tone: 'warning', icon: TriangleAlert };
    case 'unavailable':
      return { label: strings.availabilityUnavailableLabel, tone: 'neutral', icon: Ban };
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
