import * as React from 'react';

import { strings } from '../content/strings';

export type AppTab = 'search' | 'requests' | 'account';

export interface NavBarProps {
  active: AppTab;
  onSelect: (tab: AppTab) => void;
}

const TABS: ReadonlyArray<{ value: AppTab; label: string }> = [
  { value: 'search', label: strings.navSearchLabel },
  { value: 'requests', label: strings.navRequestsLabel },
  { value: 'account', label: strings.navAccountLabel },
];

/**
 * Renders once; CSS alone repositions it from a bottom tab bar (narrow
 * viewports) to a top nav bar (desktop viewports, >=768px) — see
 * src/styles/global.css `.nav`. The DOM/semantics never change between
 * breakpoints.
 */
export function NavBar({ active, onSelect }: NavBarProps) {
  const buttonRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  function focusAndSelect(index: number) {
    const wrapped = (index + TABS.length) % TABS.length;
    const tab = TABS[wrapped];
    if (!tab) return;
    onSelect(tab.value);
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
        focusAndSelect(TABS.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <nav role="tablist" aria-label="Primary" className="nav">
      {TABS.map((tab, index) => {
        const selected = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="nav__tab"
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
