/**
 * Local-only synthetic pharmacy verification/staff-role/branch-access
 * simulation (ADR-277 Milestone B). Every branch, role and assignment below
 * is an invented fixture for one fixed demo identity — there is no real
 * pharmacy, business, licensing evidence or staff person here, and no value
 * is sent to or read from a network request. See the whole-MVP design
 * proposal §5.2 for the verification-status vocabulary this reuses
 * (narrowed to the four states most relevant to a prototype: `live`
 * branches skip `approved, agreement not yet accepted` since this
 * simulation has no separate agreement-acceptance step, and expiry/
 * re-verification states are deferred to a future slice).
 */

export const SYNTHETIC_ONLY = true as const;

export type PharmacyVerificationStatus =
  'under_review' | 'needs_more_information' | 'live' | 'rejected';

export type PharmacyStaffRole = 'owner' | 'inventory_manager' | 'prescription_reviewer';

export interface SyntheticPharmacyBranch {
  readonly branchId: string;
  readonly pharmacyDisplayName: string;
  readonly branchLabel: string;
  readonly verificationStatus: PharmacyVerificationStatus;
}

export interface SyntheticWorkspace {
  readonly branch: SyntheticPharmacyBranch;
  readonly roles: readonly PharmacyStaffRole[];
}

/**
 * The fixed demo identity's branches. `market-square` deliberately exists
 * in the registry with no staff assignment below, so a lookup against it
 * exercises the "branch exists but you have no role there" forbidden path
 * without needing a second demo account.
 */
const SYNTHETIC_BRANCHES: readonly SyntheticPharmacyBranch[] = [
  {
    branchId: 'suva-central',
    pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
    branchLabel: 'Suva Central',
    verificationStatus: 'live',
  },
  {
    branchId: 'harbourview',
    pharmacyDisplayName: 'Harbourview Pharmacy (synthetic)',
    branchLabel: 'Harbourview',
    verificationStatus: 'live',
  },
  {
    branchId: 'gardenview-apothecary',
    pharmacyDisplayName: 'Gardenview Apothecary (synthetic)',
    branchLabel: 'Gardenview',
    verificationStatus: 'needs_more_information',
  },
  {
    branchId: 'market-square',
    pharmacyDisplayName: 'Market Square Pharmacy (synthetic)',
    branchLabel: 'Market Square',
    verificationStatus: 'live',
  },
];

const SYNTHETIC_STAFF_ASSIGNMENTS: ReadonlyMap<string, readonly PharmacyStaffRole[]> = new Map([
  ['suva-central', ['owner', 'prescription_reviewer']],
  ['harbourview', ['inventory_manager']],
  ['gardenview-apothecary', ['owner']],
]);

/**
 * The demo identity's own workspaces — every branch with at least one role
 * assignment, verified or not (an owner can always see their own pending
 * application's status). Never includes `market-square`, matching how a
 * real workspace switcher would only ever list contexts you actually hold.
 */
export function listSyntheticWorkspaces(): readonly SyntheticWorkspace[] {
  return SYNTHETIC_BRANCHES.filter((branch) =>
    SYNTHETIC_STAFF_ASSIGNMENTS.has(branch.branchId),
  ).map((branch) => ({
    branch,
    roles: SYNTHETIC_STAFF_ASSIGNMENTS.get(branch.branchId)!,
  }));
}

export type WorkspaceLookupResult =
  | { readonly status: 'ok'; readonly workspace: SyntheticWorkspace }
  | { readonly status: 'not_permitted' };

/**
 * Resolves a branch ID to a workspace the demo identity actually holds a
 * role at. A branch that exists but has no assignment, and a branch ID that
 * does not exist at all, return the exact same `not_permitted` shape —
 * mirroring this codebase's existing anti-enumeration pattern (see
 * apps/worker/src/routes/listings.ts) so a lookup can never be used to
 * discover which pharmacy branch IDs are real.
 */
export function resolveSyntheticWorkspace(branchId: string): WorkspaceLookupResult {
  const roles = SYNTHETIC_STAFF_ASSIGNMENTS.get(branchId);
  if (!roles) {
    return { status: 'not_permitted' };
  }

  const branch = SYNTHETIC_BRANCHES.find((candidate) => candidate.branchId === branchId);
  if (!branch) {
    return { status: 'not_permitted' };
  }

  return { status: 'ok', workspace: { branch, roles } };
}

/**
 * Milestone C: correlates a buyer-search fixture's `pharmacyDisplayName`
 * (a separate, unconnected domain — see apps/web/src/fixtures/
 * syntheticListings.ts) with this registry's branch ID, purely so a
 * reservation created from a matching buyer-search listing can reach the
 * right pharmacy's Requests queue. `pharmacyDisplayName` is already
 * ordinary public buyer-facing text, so this is a plain lookup, not an
 * anti-enumeration-sensitive one like `resolveSyntheticWorkspace` above.
 * Returns `null` for the (expected, majority) case where a buyer-search
 * pharmacy has no corresponding branch here at all.
 */
export function resolveBranchIdByDisplayName(pharmacyDisplayName: string): string | null {
  const branch = SYNTHETIC_BRANCHES.find(
    (candidate) => candidate.pharmacyDisplayName === pharmacyDisplayName,
  );
  return branch ? branch.branchId : null;
}
