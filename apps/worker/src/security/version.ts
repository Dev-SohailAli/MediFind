export type VersionCheckResult =
  { readonly ok: true } | { readonly ok: false; readonly code: 'CONFLICT' };

// A missing provided version is rejected the same as a stale one: the caller
// must prove it read the current record before mutating it, never assume it.
export function checkVersion(
  currentVersion: string,
  providedVersion: string | undefined,
): VersionCheckResult {
  if (providedVersion === undefined || providedVersion !== currentVersion) {
    return { ok: false, code: 'CONFLICT' };
  }

  return { ok: true };
}
