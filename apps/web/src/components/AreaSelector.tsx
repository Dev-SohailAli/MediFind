import type { SyntheticArea } from '@medifind/contracts';

import { strings } from '../content/strings';
import { SelectorGroup } from './SelectorGroup';

const AREA_OPTIONS: ReadonlyArray<{ value: SyntheticArea | null; label: string }> = [
  { value: null, label: strings.areaSelectorAllLabel },
  { value: 'harbour', label: strings.areaHarbourLabel },
  { value: 'garden', label: strings.areaGardenLabel },
  { value: 'market', label: strings.areaMarketLabel },
];

export interface AreaSelectorProps {
  value: SyntheticArea | null;
  onChange: (area: SyntheticArea | null) => void;
}

/**
 * Manual synthetic-area picker. It never requests or reads a device
 * location and renders no map; it only changes which pre-authored fixture
 * distance context is shown.
 */
export function AreaSelector({ value, onChange }: AreaSelectorProps) {
  return (
    <SelectorGroup
      groupLabel={strings.areaSelectorLabel}
      options={AREA_OPTIONS}
      value={value}
      onChange={onChange}
      getKey={(area) => area ?? 'all'}
    />
  );
}
