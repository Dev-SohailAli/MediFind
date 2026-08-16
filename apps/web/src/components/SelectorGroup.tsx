import * as React from 'react';

export interface SelectorOption<T> {
  value: T;
  label: string;
}

export interface SelectorGroupProps<T> {
  groupLabel: string;
  options: ReadonlyArray<SelectorOption<T>>;
  value: T;
  onChange: (value: T) => void;
  getKey: (value: T) => string;
}

/**
 * Shared accessible radiogroup used by AreaSelector and SortSelector. Uses
 * the ARIA authoring-practices roving-tabindex pattern: only the selected
 * option is in the Tab order, and Arrow/Home/End keys move both focus and
 * selection between options.
 */
export function SelectorGroup<T>({
  groupLabel,
  options,
  value,
  onChange,
  getKey,
}: SelectorGroupProps<T>) {
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  function focusAndSelect(index: number) {
    const wrapped = (index + options.length) % options.length;
    const option = options[wrapped];
    if (!option) return;
    onChange(option.value);
    buttonRefs.current[wrapped]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        focusAndSelect(index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        focusAndSelect(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusAndSelect(0);
        break;
      case 'End':
        event.preventDefault();
        focusAndSelect(options.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div role="radiogroup" aria-label={groupLabel} className="selector">
      {options.map((option, index) => {
        const selected = getKey(option.value) === getKey(value);
        return (
          <button
            key={getKey(option.value)}
            type="button"
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="selector__option"
          >
            {selected ? <span aria-hidden="true">✓ </span> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
