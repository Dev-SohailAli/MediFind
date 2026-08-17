import { describe, expect, it } from 'vitest';
import { act, create } from 'react-test-renderer';

import App from '../App';
import { strings } from '../src/content/strings';

function renderApp() {
  let renderer: ReturnType<typeof create>;
  act(() => {
    renderer = create(<App />);
  });
  return renderer!;
}

function treeText(renderer: ReturnType<typeof create>): string {
  return JSON.stringify(renderer.toJSON());
}

describe('App', () => {
  it('defaults to the Search tab selected, with the local synthetic build label visible', () => {
    const renderer = renderApp();

    const searchTab = renderer.root.findByProps({
      accessibilityRole: 'tab',
      accessibilityLabel: strings.navSearchLabel,
    });
    expect(searchTab.props.accessibilityState).toEqual({ selected: true });
    expect(treeText(renderer)).toContain(strings.localDevBuildLabel);
    expect(treeText(renderer)).toContain(strings.browseEmptyTitle);
  });

  it('switching to Requests shows only the inert prototype notice, never account/history content', () => {
    const renderer = renderApp();
    const requestsTab = renderer.root.findByProps({
      accessibilityRole: 'tab',
      accessibilityLabel: strings.navRequestsLabel,
    });

    act(() => {
      requestsTab.props.onPress();
    });

    const tree = treeText(renderer);
    expect(tree).toContain(strings.requestsPlaceholderBody);
    expect(tree).not.toContain(strings.browseEmptyTitle);
    expect(tree.toLowerCase()).not.toContain('sign in');
    expect(tree.toLowerCase()).not.toContain('signed in');
  });

  it('switching to Account shows only the inert prototype notice, never profile/auth content', () => {
    const renderer = renderApp();
    const accountTab = renderer.root.findByProps({
      accessibilityRole: 'tab',
      accessibilityLabel: strings.navAccountLabel,
    });

    act(() => {
      accountTab.props.onPress();
    });

    const tree = treeText(renderer);
    expect(tree).toContain(strings.accountPlaceholderBody);
    expect(tree.toLowerCase()).not.toContain('password');
    expect(tree.toLowerCase()).not.toContain('profile photo');
  });

  it('switching back to Search restores the search experience', () => {
    const renderer = renderApp();
    const accountTab = renderer.root.findByProps({
      accessibilityRole: 'tab',
      accessibilityLabel: strings.navAccountLabel,
    });
    const searchTab = renderer.root.findByProps({
      accessibilityRole: 'tab',
      accessibilityLabel: strings.navSearchLabel,
    });

    act(() => {
      accountTab.props.onPress();
    });
    act(() => {
      searchTab.props.onPress();
    });

    expect(treeText(renderer)).toContain(strings.browseEmptyTitle);
  });

  it('every tab meets the minimum 48pt touch target', () => {
    const renderer = renderApp();
    const tabs = renderer.root.findAllByProps({ accessibilityRole: 'tab' });

    expect(tabs.length).toBe(3);
    for (const tab of tabs) {
      const style = Array.isArray(tab.props.style)
        ? Object.assign({}, ...tab.props.style)
        : tab.props.style;
      expect(style.minHeight).toBeGreaterThanOrEqual(48);
    }
  });
});
