import { describe, expect, it } from 'vitest';

import {
  evaluateSyntheticDeletion,
  verifySyntheticRestore,
  type SyntheticBackupSnapshot,
} from '../syntheticBackupRestore';

const snapshot: SyntheticBackupSnapshot = {
  version: 'snapshot-1',
  createdAt: '2026-08-21T00:00:00.000Z',
  checksum: 'sha256-fixture',
  classification: 'protected',
  recordCounts: { reservations: 8, pharmacies: 4 },
};

describe('synthetic restore verification', () => {
  it('verifies a restore with matching checksum and record counts', () => {
    const result = verifySyntheticRestore(snapshot, {
      incidentAt: '2026-08-21T00:10:00.000Z',
      restoredAt: '2026-08-21T00:40:00.000Z',
      restoredChecksum: 'sha256-fixture',
      restoredCounts: { reservations: 8, pharmacies: 4 },
      foreignKeyViolations: 0,
    });

    expect(result).toEqual({ status: 'verified', rpoMinutes: 10, rtoMinutes: 30 });
  });

  it('reports a foreign key violation before checking the checksum', () => {
    const result = verifySyntheticRestore(snapshot, {
      incidentAt: '2026-08-21T00:10:00.000Z',
      restoredAt: '2026-08-21T00:40:00.000Z',
      restoredChecksum: 'wrong-checksum',
      restoredCounts: { reservations: 8, pharmacies: 4 },
      foreignKeyViolations: 2,
    });

    expect(result.status).toBe('foreign_key_violation');
  });

  it('reports a checksum mismatch when the restored bytes differ', () => {
    const result = verifySyntheticRestore(snapshot, {
      incidentAt: '2026-08-21T00:10:00.000Z',
      restoredAt: '2026-08-21T00:40:00.000Z',
      restoredChecksum: 'sha256-different',
      restoredCounts: { reservations: 8, pharmacies: 4 },
      foreignKeyViolations: 0,
    });

    expect(result.status).toBe('checksum_mismatch');
  });

  it('reports a record count mismatch when a table is short', () => {
    const result = verifySyntheticRestore(snapshot, {
      incidentAt: '2026-08-21T00:10:00.000Z',
      restoredAt: '2026-08-21T00:40:00.000Z',
      restoredChecksum: 'sha256-fixture',
      restoredCounts: { reservations: 7, pharmacies: 4 },
      foreignKeyViolations: 0,
    });

    expect(result.status).toBe('record_count_mismatch');
  });
});

describe('synthetic deletion rehearsal', () => {
  it('always deletes profile data and revokes sessions/notifications', () => {
    const result = evaluateSyntheticDeletion({
      subjectKey: 'buyer-1',
      requestedRetainedCategories: [],
    });

    expect(result.profileDataDeleted).toBe(true);
    expect(result.sessionsRevoked).toBe(true);
    expect(result.notificationsRevoked).toBe(true);
    expect(result.preservedRecordCategories).toEqual([]);
  });

  it('preserves only legally approved audit categories', () => {
    const result = evaluateSyntheticDeletion({
      subjectKey: 'buyer-1',
      requestedRetainedCategories: ['reservation_audit', 'opened_request_audit'],
    });

    expect(result.preservedRecordCategories).toEqual(['reservation_audit', 'opened_request_audit']);
  });

  it('drops any retained category outside the approved allowlist', () => {
    const result = evaluateSyntheticDeletion({
      subjectKey: 'buyer-1',
      requestedRetainedCategories: [
        'reservation_audit',
        'raw_prescription_upload',
        'search_history',
      ],
    });

    expect(result.preservedRecordCategories).toEqual(['reservation_audit']);
  });
});
