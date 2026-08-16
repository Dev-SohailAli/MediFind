import { X } from 'lucide-react';

import { strings } from '../content/strings';
import { iconStrokeWidth } from '../theme/tokens';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={strings.searchInputPlaceholder}
        aria-label={strings.searchInputLabel}
        className="search-bar__input"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
      />
      {value.length > 0 ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={strings.searchInputClearLabel}
          className="search-bar__clear"
        >
          <X aria-hidden="true" size={18} strokeWidth={iconStrokeWidth} />
        </button>
      ) : null}
    </div>
  );
}
