/**
 * English development copy behind stable local keys, per
 * docs/task-2-synthetic-buyer-search-specification.md and
 * docs/experience-and-content.md. Only reviewed English values are supplied
 * in this task; iTaukei/Fiji Hindi values and a language picker are
 * deferred. Medicine/pharmacy identity is fixture data, never a
 * translation key.
 *
 * Shared with the former local prototype and extended only with the
 * web/PWA-specific keys named in
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

  signInTitle: 'Sign in',
  signInIntro:
    'This is a synthetic prototype sign-in. No real phone number, email or identity is verified — nothing you enter here is sent anywhere.',
  signInPhoneLabel: 'Phone number',
  signInOver18Label: 'I am 18 or older',
  signInNameLabel: 'Legal full name',
  signInEmailLabel: 'Email',
  signInSendCodeLabel: 'Send code',
  signInPhoneRequiredError: 'Enter a phone number in the form +679 followed by 7 digits.',
  signInOver18RequiredError: 'You must confirm you are 18 or older to continue.',
  signInNameRequiredError: 'Enter your legal full name.',
  signInEmailRequiredError: 'Enter a valid email address.',

  signInCodeTitle: 'Enter the code',
  signInCodeIntro: (phone: string) => `A synthetic demo code was sent to ${phone}.`,
  signInCodeDemoHint: (code: string) =>
    `Demo code: ${code} (this prototype never sends a real code).`,
  signInCodeLabel: 'Verification code',
  signInVerifyLabel: 'Verify',
  signInResendLabel: 'Resend code',
  signInAntiPhishingNotice: 'MediFind will never call, text or email you asking for this code.',
  signInInvalidCodeError: 'That code was not recognised. Try again.',
  signInExpiredCodeError: 'That code has expired. Request a new one.',
  signInRateLimitedError: 'Too many attempts — try again later.',

  accountSignedInTitle: 'Account',
  accountProfileNameLabel: 'Name',
  accountProfilePhoneLabel: 'Phone',
  accountProfileEmailLabel: 'Email',
  accountSessionLabel: 'Session',
  accountSessionExpiresPrefix: 'Expires',
  accountSimulateExpiryLabel: 'Simulate session expiry',
  accountSignOutLabel: 'Sign out',
  accountLostPhoneLabel: 'I lost access to my phone',
  accountLostPhoneIntro:
    'This simulates MediFind’s buyer recovery flow: it immediately signs you out everywhere and opens a 24-hour security hold before sign-in is available again.',
  accountLostPhoneConfirmLabel: 'Start recovery',
  accountLostPhoneCancelLabel: 'Cancel',

  accountRecoveryHoldTitle: 'Recovery hold in effect',
  accountRecoveryHoldBody:
    'For your security, sign-in is paused for 24 hours after a lost-phone recovery. Medicine search stays available the whole time.',
  accountRecoveryHoldUntilPrefix: 'Hold lifts',
  accountRecoveryHoldSimulateElapsedLabel: 'Simulate 24 hours passing',

  workspacesTitle: 'Pharmacy access (demo)',
  workspacesIntro:
    'This simulates the pharmacy side of one fixed demo identity: which branches it has a role at, and what each role can reach. No real pharmacy, licence or staff data exists here.',
  workspacesEmpty: 'This demo identity holds no pharmacy role.',
  workspaceRolesLabel: 'Roles',
  workspaceRoleOwnerLabel: 'Owner',
  workspaceRoleInventoryManagerLabel: 'Inventory manager',
  workspaceRolePrescriptionReviewerLabel: 'Prescription reviewer',
  workspaceStatusUnderReviewLabel: 'Submitted — under review',
  workspaceStatusNeedsMoreInformationLabel: 'Needs more information',
  workspaceStatusLiveLabel: 'Live',
  workspaceStatusRejectedLabel: 'Rejected',
  workspaceNotYetLiveNotice:
    'This branch is not verified yet. Dashboard, Inventory and Requests do not exist until MediFind approves the application — only the application status is visible.',
  workspaceDashboardAccessLabel: 'Dashboard access',
  workspaceInventoryAccessLabel: 'Inventory access',
  workspaceRequestsAccessLabel: 'Requests access',
  workspaceRequestsAccessGatedNote: '(behind a fresh MFA/biometric gate)',
  workspaceRequestsAccessDeniedNote:
    'Ownership alone never grants this — a separate reviewer role is required.',
  workspaceLookupLabel: 'Open a branch workspace by ID',
  workspaceLookupPlaceholder: 'e.g. suva-central',
  workspaceLookupOpenLabel: 'Open',
  workspaceLookupNotPermitted: 'Not permitted — you have no role at this branch.',

  inventoryOpenLabel: 'View inventory',
  inventoryCloseLabel: 'Hide inventory',
  inventoryEmpty: 'No listings yet at this branch.',
  inventoryAuditReminder:
    'Price and availability changes are audited and visible to buyers within minutes.',

  listingLifecycleReviewLabel: 'Not yet public — MediFind is reviewing this medicine’s identity',
  listingLifecyclePublishedLabel: 'Published',
  listingLifecycleUnpublishedLabel: 'Unpublished',
  listingStaleLabel: 'May be outdated',

  listingApproveIdentityLabel: 'Simulate MediFind identity approval',
  listingPublishLabel: 'Publish',
  listingUnpublishLabel: 'Unpublish',
  listingUpdatePricingLabel: 'Update price/availability',
  listingUpdatePricingSaveLabel: 'Save',
  listingQuickAvailabilityLabel: 'Availability (quick update)',
  listingQuickPriceLabel: 'Price, FJD (quick update)',

  addListingTitle: 'Add listing',
  addListingBrandLabel: 'Brand name (optional)',
  addListingIngredientLabel: 'Active ingredient',
  addListingDosageFormLabel: 'Dosage form',
  addListingPackLabel: 'Pack size',
  addListingStrengthLabel: 'Strength (optional)',
  addListingCategoryLabel: 'OTC or prescription-required',
  addListingCategoryOtcLabel: 'OTC',
  addListingCategoryPrescriptionLabel: 'Prescription-required',
  addListingAvailabilityLabel: 'Availability',
  addListingPriceLabel: 'Price (FJD)',
  addListingNoteLabel: 'Listing note (optional)',
  addListingSubmitLabel: 'Save listing',
  addListingIdentityError: 'Enter a brand name or an active ingredient.',
  addListingDosageFormError: 'Enter the dosage form.',
  addListingPackError: 'Enter the pack size.',
  addListingPriceError: 'Enter one exact price greater than zero — not a range or estimate.',
  addListingDuplicateWarning:
    'This branch already has a listing with the same identity, form, strength and pack. Saved as a separate listing — check it isn’t a duplicate.',

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

  reservationRequestTitle: 'Request a reservation',
  reservationPatientNameLabel: 'Patient full name',
  reservationRelationshipLabel: 'Who is this for?',
  reservationRelationshipSelfLabel: 'Myself',
  reservationRelationshipChildLabel: 'My child',
  reservationRelationshipDependentLabel: 'A dependent',
  reservationSubmitLabel: 'Request reservation',
  reservationPatientNameError: "Enter the patient's full legal name.",
  reservationSignInPrompt: 'Sign in from the Account tab to request a reservation.',
  reservationUnavailableNotice:
    'This item is unavailable to reserve right now — ask the pharmacy directly.',
  reservationConflictNotice:
    'You already have an active reservation for this item and person — see Requests.',
  reservationSuspendedNotice:
    'New reservations are temporarily paused after 3 unclaimed pickups in the last 30 days. Contact support to have this reviewed.',
  reservationSuccessNotice:
    'Reservation requested. Pharmacies aim to respond within one business day — see Requests for updates.',

  requestsTitle: 'Requests',
  requestsIntro: 'Your reservation requests and their current status.',
  requestsSignInRequiredTitle: 'Sign in to view your requests',
  requestsSignInRequiredBody:
    'Your reservation and prescription requests will appear here once you sign in.',
  requestsSignInRequiredAction: 'Go to Account',
  requestsEmptyTitle: 'No requests yet',
  requestsEmptyBody: 'Reservation requests you make from a listing will appear here.',
  requestsRefreshLabel: 'Check for updates',
  requestsCancelLabel: 'Cancel',
  requestsNoLongerNeededLabel: 'No longer needed',
  requestsConfirmCollectedLabel: 'Confirm collected',
  requestsConfirmedCollectedNote:
    'You confirmed you collected this. The pharmacy record remains the official source.',

  reservationStatusPendingLabel: 'Submitted — awaiting pharmacy',
  reservationStatusApprovedLabel: 'Approved',
  reservationStatusDeclinedLabel: 'Declined',
  reservationStatusExpiredLabel: 'Expired',
  reservationStatusCancelledLabel: 'Cancelled',
  reservationStatusCollectedLabel: 'Collected',

  reservationConfirmedPricePrefix: 'Confirmed price',
  reservationPickupInstructionsPrefix: 'Pickup instructions',
  reservationExpiresPrefix: 'Expires',
  reservationDeclineReasonPrefix: 'Reason',
  reservationCancelReasonPrefix: 'Reason',
  reservationCancelledByPharmacyPrefix: 'Cancelled by the pharmacy',
  reservationCancelledByBuyerPrefix: 'Cancelled by you',

  pharmacyRequestsOpenLabel: 'View requests',
  pharmacyRequestsCloseLabel: 'Hide requests',
  pharmacyRequestsEmpty: 'No reservation requests yet at this branch.',
  pharmacyRequestsApproveLabel: 'Approve',
  pharmacyRequestsDeclineLabel: 'Decline',
  pharmacyRequestsDeclineReasonLabel: 'Reason (optional)',
  pharmacyRequestsPickupInstructionsLabel: 'Pickup instructions',
  pharmacyRequestsExpiryHoursLabel: 'Expiry (hours from now)',
  pharmacyRequestsConfirmedPriceLabel: 'Confirmed price (FJD)',
  pharmacyRequestsMarkCollectedLabel: 'Mark collected',
  pharmacyRequestsCancelLabel: 'Cancel reservation',
  pharmacyRequestsCancelReasonLabel: 'Operational reason (required)',
  pharmacyRequestsCancelReasonError: 'Enter the operational reason for this cancellation.',

  notificationsTitle: 'Notifications',
  notificationsGenericEntryTitle: 'You have a request update.',
  notificationsUnreadSuffix: 'unread',
  notificationsEmpty: 'No notifications yet.',
  notificationsMarkAllReadLabel: 'Mark all as read',
  notificationsOpenEntryLabel: 'Open',
  notificationsDeliveryFailedNote:
    'Push delivery failed for this update — your in-app status above is still up to date.',
  notificationsOptInPromptLabel: 'Enable notifications',
  notificationsOptInExplainerTitle: 'Turn on notifications?',
  notificationsOptInExplainerBody:
    "We'll send a generic alert when one of your requests changes — never a medicine, pharmacy or prescription detail. You'll still need to open the app and sign in to see what changed.",
  notificationsOptInAllowLabel: 'Allow',
  notificationsOptInNotNowLabel: 'Not now',
  notificationsOptInGrantedNote: 'Notifications are on for this device (simulated).',

  prescriptionUploadTitle: 'Upload a prescription',
  prescriptionUploadIntro:
    'A synthetic prescription upload. No real file is stored, scanned or sent anywhere — this prototype only simulates the review workflow.',
  prescriptionUploadPharmacyLabel: 'Select a verified pharmacy',
  prescriptionUploadPatientNameLabel: 'Patient full name',
  prescriptionUploadFileLabel: 'Prescription file',
  prescriptionUploadFileHint: 'PDF, JPG, PNG or HEIC — up to 10 MB.',
  prescriptionUploadLegibilityLabel: 'This is legible and correct',
  prescriptionUploadExpiryDisclosure:
    'If the pharmacy has not opened this within about two days, it expires automatically and the update appears in Requests.',
  prescriptionUploadRetentionNotice:
    'After the pharmacy opens this, it is retained under the privacy policy and can no longer be removed immediately.',
  prescriptionUploadConsentLabel: (pharmacyName: string) => `Share only with ${pharmacyName}`,
  prescriptionUploadSubmitLabel: 'Submit prescription',
  prescriptionUploadPatientNameError: "Enter the patient's full legal name.",
  prescriptionUploadFileTypeError: 'Choose a supported file: PDF, JPG, PNG or HEIC.',
  prescriptionUploadFileSizeError: 'This file is larger than the 10 MB limit.',
  prescriptionUploadLegibilityError: 'Confirm the file is legible and correct.',
  prescriptionUploadConsentError: 'Confirm you understand this is shared only with this pharmacy.',
  prescriptionUploadUnsafeFileError:
    "We couldn't accept this file. Try a different file or take a new photo.",
  prescriptionUploadSuccessNotice: 'Prescription submitted — see Requests for status updates.',

  prescriptionStatusUnderReviewLabel: 'Under review',
  prescriptionStatusApprovedLabel: 'Approved',
  prescriptionStatusRejectedLabel: 'Rejected',
  prescriptionStatusExpiredLabel: 'Expired',
  prescriptionStatusCancelledLabel: 'Cancelled',
  prescriptionApprovedNote:
    'The pharmacy has approved this prescription. Contact them directly to arrange collection.',
  prescriptionRejectedReasonPrefix: 'Reason',
  prescriptionRejectReasonIllegibleLabel: 'Illegible',
  prescriptionRejectReasonIncompleteLabel: 'Incomplete information',
  prescriptionRejectReasonDuplicateLabel: 'Suspected duplicate',
  prescriptionRejectReasonInvalidLabel: 'Invalid prescription',
  prescriptionRejectReasonOtherLabel: 'Other',
  prescriptionCancelLabel: 'Cancel',

  pharmacyPrescriptionsMfaGateTitle: 'Confirm your identity',
  pharmacyPrescriptionsMfaGateBody:
    'This restricted content requires a fresh identity check before it can be viewed (simulated — no real authentication happens here).',
  pharmacyPrescriptionsMfaGateConfirmLabel: 'Confirm identity (simulated)',
  pharmacyPrescriptionsQuarantineBanner:
    'Restricted — flagged for legibility/duplicate check, review before deciding.',
  pharmacyPrescriptionsFileNotice: 'Prescription file preview — synthetic placeholder only.',
  pharmacyPrescriptionsApproveLabel: 'Approve',
  pharmacyPrescriptionsRejectLabel: 'Reject',
  pharmacyPrescriptionsRejectReasonLabel: 'Reason category (required)',
  pharmacyPrescriptionsApprovalNote:
    'Approving allows the buyer to request a reservation. It does not create or hold a reservation for them.',
  pharmacyPrescriptionsDecisionSafetyNote:
    'This is a professional/legal decision — MediFind does not determine validity or dispensing.',
} as const;

export type StringKey = keyof typeof strings;
