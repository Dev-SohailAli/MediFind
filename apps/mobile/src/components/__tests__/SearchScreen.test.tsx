import { describe, expect, it } from 'vitest';
import { act, create } from 'react-test-renderer';
import { Text } from 'react-native';

import { strings } from '../../content/strings';
import { SearchScreen } from '../SearchScreen';

function renderScreen() {
  let renderer: ReturnType<typeof create>;
  act(() => {
    renderer = create(<SearchScreen />);
  });
  return renderer!;
}

function findAllText(renderer: ReturnType<typeof create>): string {
  return JSON.stringify(renderer.toJSON());
}

function typeInSearchInput(renderer: ReturnType<typeof create>, value: string) {
  const input = renderer.root.findByProps({ accessibilityLabel: strings.searchInputLabel });
  act(() => {
    input.props.onChangeText(value);
  });
}

describe('SearchScreen', () => {
  it('shows the safe browse/empty-search state for an empty query', () => {
    const renderer = renderScreen();

    expect(findAllText(renderer)).toContain(strings.browseEmptyTitle);
  });

  it('renders matching results with accessible identity, availability, price and match label', () => {
    const renderer = renderScreen();

    typeInSearchInput(renderer, 'Nivaprin');

    const tree = findAllText(renderer);
    expect(tree).toContain('Nivaprin');
    expect(tree).toContain(strings.matchExactLabel);
    expect(tree).toContain(strings.availabilityInStockLabel);
    expect(tree).toContain('FJD');
  });

  it('shows the safe zero-result state and never invents a fuzzy match', () => {
    const renderer = renderScreen();

    typeInSearchInput(renderer, 'zzz-not-a-real-fixture-zzz');

    const tree = findAllText(renderer);
    expect(tree).toContain(strings.zeroResultTitle);
    expect(tree).toContain(strings.zeroResultSubstituteNotice);
  });

  it('never returns the searchEligible:false fixture even for its exact name', () => {
    const renderer = renderScreen();

    typeInSearchInput(renderer, 'Excludex');

    const tree = findAllText(renderer);
    expect(tree).toContain(strings.zeroResultTitle);
  });

  it('opens a local, read-only detail sheet with required safety copy on result press', () => {
    const renderer = renderScreen();
    typeInSearchInput(renderer, 'Nivaprin');

    const resultButton = renderer.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((node) => {
        const label = node.props.accessibilityLabel as string | undefined;
        return typeof label === 'string' && label.includes('Nivaprin');
      });
    expect(resultButton).toBeDefined();

    act(() => {
      resultButton!.props.onPress();
    });

    const tree = findAllText(renderer);
    expect(tree).toContain(strings.detailSheetTitle);
    expect(tree).toContain(strings.safetyAvailabilityPrice);
    expect(tree).toContain(strings.safetyReservationNoGuarantee);
    expect(tree).toContain(strings.safetyPrescriptionMayBeRequired);
    expect(tree).toContain(strings.safetyNoMedicalAdvice);

    // No call/map/reservation/upload/request action exists in the sheet.
    expect(tree.toLowerCase()).not.toContain('call');
    expect(tree.toLowerCase()).not.toContain('directions');
    expect(tree.toLowerCase()).not.toContain('reserve');
  });

  it('closing the detail sheet removes it from the tree', () => {
    const renderer = renderScreen();
    typeInSearchInput(renderer, 'Nivaprin');

    const resultButton = renderer.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((node) => (node.props.accessibilityLabel as string | undefined)?.includes('Nivaprin'));
    act(() => {
      resultButton!.props.onPress();
    });
    expect(findAllText(renderer)).toContain(strings.detailSheetTitle);

    const closeButton = renderer.root.findByProps({
      accessibilityLabel: strings.detailSheetCloseLabel,
    });
    act(() => {
      closeButton.props.onPress();
    });

    expect(findAllText(renderer)).not.toContain(strings.detailSheetTitle);
  });

  it('shows synthetic distance in the detail sheet only after a manual area is selected', () => {
    const renderer = renderScreen();
    typeInSearchInput(renderer, 'Nivaprin');

    const resultButton = renderer.root
      .findAllByProps({ accessibilityRole: 'button' })
      .find((node) => {
        const label = node.props.accessibilityLabel as string | undefined;
        return typeof label === 'string' && label.includes('Nivaprin');
      });
    act(() => {
      resultButton!.props.onPress();
    });

    const sheetTextBefore = JSON.stringify(
      renderer.root
        .findByProps({ testID: 'result-detail-sheet' })
        .findAllByType(Text)
        .map((node) => node.props.children),
    );
    expect(sheetTextBefore).not.toContain('Nearby in the selected synthetic area');
    expect(sheetTextBefore).not.toContain('km (synthetic)');

    const marketOption = renderer.root.findByProps({ accessibilityLabel: strings.areaMarketLabel });
    act(() => {
      marketOption.props.onPress();
    });

    const sheetTextAfter = JSON.stringify(
      renderer.root
        .findByProps({ testID: 'result-detail-sheet' })
        .findAllByType(Text)
        .map((node) => node.props.children),
    );
    expect(sheetTextAfter).toContain('Nearby in the selected synthetic area');
  });

  it('shows the active sort selection accessibly and applies price ascending order', () => {
    const renderer = renderScreen();
    typeInSearchInput(renderer, 'Nivaprin');

    const priceSortOption = renderer.root.findByProps({
      accessibilityLabel: strings.sortPriceLabel,
    });
    expect(priceSortOption.props.accessibilityState).toEqual({ selected: false });

    act(() => {
      priceSortOption.props.onPress();
    });

    expect(priceSortOption.props.accessibilityState).toEqual({ selected: true });
  });

  it('the manual area selector renders as an accessible radio group and never mentions a map/location permission', () => {
    const renderer = renderScreen();

    const areaGroup = renderer.root.findByProps({
      accessibilityRole: 'radiogroup',
      accessibilityLabel: strings.areaSelectorLabel,
    });
    expect(areaGroup).toBeDefined();

    const tree = findAllText(renderer).toLowerCase();
    expect(tree).not.toContain('permission');
    expect(tree).not.toContain('location');
  });

  it('resets the revealed page size when the query changes', () => {
    const renderer = renderScreen();
    typeInSearchInput(renderer, 'Nivaprin');
    typeInSearchInput(renderer, '');

    expect(findAllText(renderer)).toContain(strings.browseEmptyTitle);
  });
});
