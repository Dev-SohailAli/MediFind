/**
 * English development copy behind stable local keys, per
 * docs/task-2-synthetic-buyer-search-specification.md and
 * docs/experience-and-content.md. Only reviewed English values are supplied
 * in this task; iTaukei/Fiji Hindi values and a language picker are
 * deferred. Medicine/pharmacy identity is fixture data, never a
 * translation key.
 *
 * Ported from apps/mobile/src/content/strings.ts (historical Task 2
 * prototype) and extended only with the web/PWA-specific keys named in
 * docs/task-2-web-pwa-buyer-search-task-brief.md: install guidance, an
 * offline banner and a skip link.
 */
export const strings = {
  localDevBuildLabel: 'MediFind — local synthetic development build',

  skipToContentLabel: 'Skip to search content',

  navSearchLabel: 'Search',
  navRequestsLabel: 'Requests',
  navAccountLabel: 'Account',

  requestsPlaceholderTitle: 'Requests',
  requestsPlaceholderBody: 'Requests is not part of this synthetic prototype.',
  accountPlaceholderTitle: 'Account',
  accountPlaceholderBody: 'Account is not part of this synthetic prototype.',

  searchInputLabel: 'Search for a medicine',
  searchInputPlaceholder: 'Search medicine name or active ingredient',
  searchInputClearLabel: 'Clear search',

  areaSelectorLabel: 'Synthetic area',
  areaSelectorAllLabel: 'All areas',
  areaHarbourLabel: 'Harbour',
  areaGardenLabel: 'Garden',
  areaMarketLabel: 'Market',

  sortSelectorLabel: 'Sort results',
  sortRelevanceLabel: 'Relevance',
  sortPriceLabel: 'Price: low to high',
  sortDistanceLabel: 'Distance',
  sortActivePrefix: 'Sorted by',

  matchExactLabel: 'Exact product match',
  matchActiveIngredientLabel: 'Active-ingredient match',

  availabilityInStockLabel: 'In stock',
  availabilityLowStockLabel: 'Low stock',
  availabilityUnavailableLabel: 'Unavailable',

  freshnessMayBeOutdatedLabel: 'May be outdated',
  lastUpdatedPrefix: 'Last updated',

  loadMoreLabel: 'Load more',
  resultsCountSuffix: 'results',

  browseEmptyTitle: 'Search a medicine name or active ingredient',
  browseEmptyBody: 'Results are local prototype data only.',

  zeroResultTitle: 'No matching medicine listed in this prototype.',
  zeroResultBody: 'Check the spelling or try an approved active-ingredient name.',
  zeroResultSubstituteNotice: 'MediFind does not recommend substitutes.',

  loadingLabel: 'Loading results',

  offlineTitle: 'You appear to be offline',
  offlineBody: 'This prototype cannot reach a network, and does not need to.',
  offlineBannerDismissLabel: 'Dismiss offline notice',

  errorTitle: 'Something went wrong',
  errorBody: 'This is a local prototype error state; no data was lost.',

  detailSheetTitle: 'Medicine detail',
  detailSheetCloseLabel: 'Close detail',
  detailSheetPharmacyPrefix: 'Listed by',
  detailSheetAddressPrefix: 'Address',

  callActionLabel: 'Call',
  callActionAccessiblePrefix: 'Call',
  directionsActionLabel: 'Directions',
  directionsActionAccessiblePrefix: 'Directions to',

  safetyAvailabilityPrice: 'Availability and price are provided by the pharmacy and may change.',
  safetyReservationNoGuarantee: 'A reservation is not a guarantee of supply or dispensing.',
  safetyPrescriptionMayBeRequired:
    'A valid prescription may be required. The pharmacy makes the final dispensing decision.',
  safetyNoMedicalAdvice: 'MediFind does not provide medical advice.',

  installBannerTitle: 'Install this local prototype',
  installBannerBody:
    'Add MediFind to your Home Screen to open this synthetic prototype like an app. No account or data is required.',
  installBannerIosHint: 'On iPhone Safari: tap Share, then "Add to Home Screen".',
  installBannerAndroidHint:
    'On Android Chrome: tap the browser menu, then "Install app" or "Add to Home Screen".',
  installBannerInstallLabel: 'Install',
  installBannerDismissLabel: 'Dismiss install guidance',
} as const;

export type StringKey = keyof typeof strings;
