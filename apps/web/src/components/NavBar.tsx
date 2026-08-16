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
 * Primary in-app page switcher. This is plain semantic navigation, not the
 * ARIA tabs pattern: Search/Requests/Account are three independent pages
 * with unrelated content, not panels of related content sharing one
 * context, so `role="tablist"`/`role="tab"` (which requires a matching
 * `tabpanel`/`aria-controls` wiring to be correct) is the wrong pattern
 * here. A `<nav>` landmark with ordinary buttons and `aria-current="page"`
 * on the active one is both simpler and the semantically correct choice
 * for a top-level view switcher; buttons keep native sequential Tab focus
 * rather than a tabs-specific roving-tabindex/arrow-key scheme.
 *
 * Renders once; CSS alone repositions it from a bottom bar (narrow
 * viewports) to a centred bar (desktop viewports, >=768px) — see
 * src/styles/global.css `.nav`. The DOM/semantics never change between
 * breakpoints.
 */
export function NavBar({ active, onSelect }: NavBarProps) {
  return (
    <nav aria-label="Primary" className="nav">
      {TABS.map((tab) => {
        const selected = tab.value === active;
        return (
          <button
            key={tab.value}
            type="button"
            aria-current={selected ? 'page' : undefined}
            onClick={() => onSelect(tab.value)}
            className="nav__tab"
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
