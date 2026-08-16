import { strings } from '../content/strings';

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
          <span aria-hidden="true">✕</span>
        </button>
      ) : null}
    </div>
  );
}
