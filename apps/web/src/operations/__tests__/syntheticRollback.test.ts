import { describe, expect, it } from 'vitest';

import {
  evaluateSyntheticRollback,
  type SyntheticPreflightChecks,
  type SyntheticReleaseVersion,
} from '../syntheticRollback';

const knownVersions: SyntheticReleaseVersion[] = [
  { versionId: 'v1', deployedAt: '2026-08-01T00:00:00.000Z', approvedBy: 'founder' },
  { versionId: 'v2', deployedAt: '2026-08-10T00:00:00.000Z', approvedBy: null },
];

const passingPreflight: SyntheticPreflightChecks = {
  health: 'pass',
  search: 'pass',
  account: 'pass',
  pharmacy: 'pass',
  reservation: 'pass',
};

describe('synthetic rollback rehearsal', () => {
  it('completes a rollback to an approved version with passing preflight checks', () => {
    const result = evaluateSyntheticRollback(
      knownVersions,
      { toVersionId: 'v1', requestedBy: 'founder', reason: 'regression' },
      passingPreflight,
    );

    expect(result).toEqual({ status: 'completed', dataPreserved: true, failedRoutes: [] });
  });

  it('blocks a rollback to a version the release history does not contain', () => {
    const result = evaluateSyntheticRollback(
      knownVersions,
      { toVersionId: 'v-unknown', requestedBy: 'founder', reason: 'regression' },
      passingPreflight,
    );

    expect(result.status).toBe('blocked_unknown_version');
    expect(result.dataPreserved).toBe(true);
  });

  it('blocks a rollback to a version that was never approved', () => {
    const result = evaluateSyntheticRollback(
      knownVersions,
      { toVersionId: 'v2', requestedBy: 'founder', reason: 'regression' },
      passingPreflight,
    );

    expect(result.status).toBe('blocked_missing_approval');
    expect(result.dataPreserved).toBe(true);
  });

  it('blocks a rollback with no requester even when the target version was approved', () => {
    const result = evaluateSyntheticRollback(
      knownVersions,
      { toVersionId: 'v1', requestedBy: null, reason: 'regression' },
      passingPreflight,
    );

    expect(result.status).toBe('blocked_missing_approval');
  });

  it('blocks and reports failing routes before completing the rollback', () => {
    const result = evaluateSyntheticRollback(
      knownVersions,
      { toVersionId: 'v1', requestedBy: 'founder', reason: 'regression' },
      { ...passingPreflight, reservation: 'fail', pharmacy: 'fail' },
    );

    expect(result.status).toBe('blocked_failed_preflight');
    expect(result.dataPreserved).toBe(true);
    expect(result.failedRoutes.sort()).toEqual(['pharmacy', 'reservation']);
  });
});
