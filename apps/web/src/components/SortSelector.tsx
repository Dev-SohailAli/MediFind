import type { SyntheticSort } from '@medifind/contracts';

import { strings } from '../content/strings';
import { SelectorGroup } from './SelectorGroup';

const SORT_OPTIONS: ReadonlyArray<{ value: SyntheticSort; label: string }> = [
  { value: 'relevance', label: strings.sortRelevanceLabel },
  { value: 'price_low_to_high', label: strings.sortPriceLabel },
  { value: 'distance', label: strings.sortDistanceLabel },
];

export interface SortSelectorProps {
  value: SyntheticSort;
  onChange: (sort: SyntheticSort) => void;
}

export function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <SelectorGroup
      groupLabel={strings.sortSelectorLabel}
      options={SORT_OPTIONS}
      value={value}
      onChange={onChange}
      getKey={(sort) => sort}
    />
  );
}
