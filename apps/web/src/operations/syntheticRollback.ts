export type SyntheticReleaseVersion = {
  versionId: string;
  deployedAt: string;
  approvedBy: string | null;
};

export type SyntheticPreflightRoute = 'health' | 'search' | 'account' | 'pharmacy' | 'reservation';

export type SyntheticPreflightChecks = Record<SyntheticPreflightRoute, 'pass' | 'fail'>;

export type SyntheticRollbackRequest = {
  toVersionId: string;
  requestedBy: string | null;
  reason: string;
};

export type SyntheticRollbackResult = {
  status:
    | 'completed'
    | 'blocked_missing_approval'
    | 'blocked_unknown_version'
    | 'blocked_failed_preflight';
  dataPreserved: true;
  failedRoutes: SyntheticPreflightRoute[];
};

/**
 * Rollback never deletes data, so dataPreserved is unconditionally true even
 * on a blocked attempt — blocking only withholds the version switch itself.
 */
export function evaluateSyntheticRollback(
  knownVersions: readonly SyntheticReleaseVersion[],
  request: SyntheticRollbackRequest,
  preflight: SyntheticPreflightChecks,
): SyntheticRollbackResult {
  const failedRoutes = (
    Object.entries(preflight) as Array<[SyntheticPreflightRoute, 'pass' | 'fail']>
  )
    .filter(([, result]) => result === 'fail')
    .map(([route]) => route);

  const targetVersion = knownVersions.find((version) => version.versionId === request.toVersionId);
  if (!targetVersion) {
    return { status: 'blocked_unknown_version', dataPreserved: true, failedRoutes };
  }
  if (!targetVersion.approvedBy || !request.requestedBy) {
    return { status: 'blocked_missing_approval', dataPreserved: true, failedRoutes };
  }
  if (failedRoutes.length > 0) {
    return { status: 'blocked_failed_preflight', dataPreserved: true, failedRoutes };
  }

  return { status: 'completed', dataPreserved: true, failedRoutes: [] };
}
