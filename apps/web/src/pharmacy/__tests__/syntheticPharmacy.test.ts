import { describe, expect, it } from 'vitest';

import { listSyntheticWorkspaces, resolveSyntheticWorkspace } from '../syntheticPharmacy';

describe('synthetic pharmacy workspace access', () => {
  it('lists only branches the demo identity actually holds a role at', () => {
    const workspaces = listSyntheticWorkspaces();
    const branchIds = workspaces.map((workspace) => workspace.branch.branchId);

    expect(branchIds).toEqual(['suva-central', 'harbourview', 'gardenview-apothecary']);
    expect(branchIds).not.toContain('market-square');
  });

  it('includes a live branch where the demo identity is owner and prescription reviewer', () => {
    const workspaces = listSyntheticWorkspaces();
    const suvaCentral = workspaces.find(
      (workspace) => workspace.branch.branchId === 'suva-central',
    );

    expect(suvaCentral?.branch.verificationStatus).toBe('live');
    expect(suvaCentral?.roles).toEqual(['owner', 'prescription_reviewer']);
  });

  it('includes a live branch where the demo identity is inventory manager only', () => {
    const workspaces = listSyntheticWorkspaces();
    const harbourview = workspaces.find((workspace) => workspace.branch.branchId === 'harbourview');

    expect(harbourview?.branch.verificationStatus).toBe('live');
    expect(harbourview?.roles).toEqual(['inventory_manager']);
  });

  it('includes the demo identity’s own not-yet-live branch, still visible as an owner-applicant', () => {
    const workspaces = listSyntheticWorkspaces();
    const gardenview = workspaces.find(
      (workspace) => workspace.branch.branchId === 'gardenview-apothecary',
    );

    expect(gardenview?.branch.verificationStatus).toBe('needs_more_information');
    expect(gardenview?.roles).toEqual(['owner']);
  });

  it('resolves an assigned branch to ok with its verification status and roles', () => {
    const result = resolveSyntheticWorkspace('suva-central');

    expect(result).toEqual({
      status: 'ok',
      workspace: {
        branch: {
          branchId: 'suva-central',
          pharmacyDisplayName: 'Suva Central Pharmacy (synthetic)',
          branchLabel: 'Suva Central',
          verificationStatus: 'live',
        },
        roles: ['owner', 'prescription_reviewer'],
      },
    });
  });

  it('returns not_permitted for a branch that exists but has no staff assignment', () => {
    expect(resolveSyntheticWorkspace('market-square')).toEqual({ status: 'not_permitted' });
  });

  it('returns the exact same not_permitted shape for a branch ID that does not exist at all (anti-enumeration)', () => {
    const unassigned = resolveSyntheticWorkspace('market-square');
    const neverExisted = resolveSyntheticWorkspace('does-not-exist-at-all');

    expect(neverExisted).toEqual({ status: 'not_permitted' });
    expect(neverExisted).toEqual(unassigned);
  });

  it('never reveals a rejected/never-verified branch name to an unassigned lookup', () => {
    const result = resolveSyntheticWorkspace('does-not-exist-at-all');

    expect(JSON.stringify(result)).not.toMatch(/branchId|pharmacyDisplayName|branchLabel/);
  });
});
