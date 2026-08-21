export type SyntheticDataClassification = 'public_projection' | 'protected';

export type SyntheticBackupSnapshot = {
  version: string;
  createdAt: string;
  checksum: string;
  classification: SyntheticDataClassification;
  recordCounts: Record<string, number>;
};

export type SyntheticRestoreAttempt = {
  incidentAt: string;
  restoredAt: string;
  restoredChecksum: string;
  restoredCounts: Record<string, number>;
  foreignKeyViolations: number;
};

export type SyntheticRestoreResult = {
  status: 'verified' | 'checksum_mismatch' | 'record_count_mismatch' | 'foreign_key_violation';
  rpoMinutes: number;
  rtoMinutes: number;
};

function minutesBetween(earlierIso: string, laterIso: string): number {
  return Math.max(0, (Date.parse(laterIso) - Date.parse(earlierIso)) / 60_000);
}

export function verifySyntheticRestore(
  snapshot: SyntheticBackupSnapshot,
  attempt: SyntheticRestoreAttempt,
): SyntheticRestoreResult {
  const rpoMinutes = minutesBetween(snapshot.createdAt, attempt.incidentAt);
  const rtoMinutes = minutesBetween(attempt.incidentAt, attempt.restoredAt);

  if (attempt.foreignKeyViolations > 0) {
    return { status: 'foreign_key_violation', rpoMinutes, rtoMinutes };
  }
  if (attempt.restoredChecksum !== snapshot.checksum) {
    return { status: 'checksum_mismatch', rpoMinutes, rtoMinutes };
  }
  const countsMatch = Object.entries(snapshot.recordCounts).every(
    ([table, count]) => attempt.restoredCounts[table] === count,
  );
  if (!countsMatch) {
    return { status: 'record_count_mismatch', rpoMinutes, rtoMinutes };
  }
  return { status: 'verified', rpoMinutes, rtoMinutes };
}

export type SyntheticRetainedRecordCategory = 'reservation_audit' | 'opened_request_audit';

const ALLOWED_RETAINED_CATEGORIES: ReadonlySet<string> = new Set<SyntheticRetainedRecordCategory>([
  'reservation_audit',
  'opened_request_audit',
]);

export type SyntheticDeletionRequest = {
  subjectKey: string;
  requestedRetainedCategories: readonly string[];
};

export type SyntheticDeletionResult = {
  profileDataDeleted: true;
  sessionsRevoked: true;
  notificationsRevoked: true;
  preservedRecordCategories: SyntheticRetainedRecordCategory[];
};

/**
 * Deletion always revokes sessions/notifications and always removes profile
 * data; the only variable is which legally-approved audit categories survive
 * — and only categories on the approved allowlist can ever survive, so a
 * caller cannot smuggle an extra retained category past the schedule.
 */
export function evaluateSyntheticDeletion(
  request: SyntheticDeletionRequest,
): SyntheticDeletionResult {
  const preservedRecordCategories = request.requestedRetainedCategories.filter(
    (category): category is SyntheticRetainedRecordCategory =>
      ALLOWED_RETAINED_CATEGORIES.has(category),
  );

  return {
    profileDataDeleted: true,
    sessionsRevoked: true,
    notificationsRevoked: true,
    preservedRecordCategories,
  };
}
