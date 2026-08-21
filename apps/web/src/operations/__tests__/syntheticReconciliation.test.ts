import { describe, expect, it } from 'vitest';

import {
  applySyntheticReconciliationRun,
  evaluateSyntheticReconciliationStatus,
  type SyntheticReconciliationLedger,
} from '../syntheticReconciliation';

describe('synthetic reconciliation ledger', () => {
  it('appends a new run for a fresh idempotency key', () => {
    const ledger = applySyntheticReconciliationRun([], {
      cursor: 'cursor-1',
      idempotencyKey: 'run-1',
      startedAt: '2026-08-21T00:00:00.000Z',
      completedAt: '2026-08-21T00:01:00.000Z',
      recordsProcessed: 10,
    });

    expect(ledger).toHaveLength(1);
  });

  it('replaces rather than duplicates a retried run with the same idempotency key', () => {
    const first: SyntheticReconciliationLedger = [
      {
        cursor: 'cursor-1',
        idempotencyKey: 'run-1',
        startedAt: '2026-08-21T00:00:00.000Z',
        completedAt: '2026-08-21T00:01:00.000Z',
        recordsProcessed: 10,
      },
    ];

    const retried = applySyntheticReconciliationRun(first, {
      cursor: 'cursor-1',
      idempotencyKey: 'run-1',
      startedAt: '2026-08-21T00:00:00.000Z',
      completedAt: '2026-08-21T00:02:00.000Z',
      recordsProcessed: 10,
    });

    expect(retried).toHaveLength(1);
    expect(retried[0]?.completedAt).toBe('2026-08-21T00:02:00.000Z');
  });
});

describe('synthetic reconciliation status', () => {
  const ledger: SyntheticReconciliationLedger = [
    {
      cursor: 'cursor-1',
      idempotencyKey: 'run-1',
      startedAt: '2026-08-21T00:00:00.000Z',
      completedAt: '2026-08-21T00:01:00.000Z',
      recordsProcessed: 10,
    },
  ];

  it('reports normal within the expected 15-minute cadence', () => {
    const status = evaluateSyntheticReconciliationStatus(ledger, '2026-08-21T00:10:00.000Z');

    expect(status.alertLevel).toBe('normal');
    expect(status.minutesSinceLastRun).toBe(9);
    expect(status.readsEnforceStaleness).toBe(true);
    expect(status.safeSearchAvailable).toBe(true);
  });

  it('alerts once maintenance is delayed past 30 minutes', () => {
    const status = evaluateSyntheticReconciliationStatus(ledger, '2026-08-21T00:32:00.000Z');

    expect(status.alertLevel).toBe('delayed_alert');
    expect(status.minutesSinceLastRun).toBe(31);
    expect(status.readsEnforceStaleness).toBe(true);
    expect(status.safeSearchAvailable).toBe(true);
  });

  it('fails closed to a delayed alert when no run has ever completed', () => {
    const status = evaluateSyntheticReconciliationStatus([], '2026-08-21T00:32:00.000Z');

    expect(status).toEqual({
      minutesSinceLastRun: null,
      alertLevel: 'delayed_alert',
      readsEnforceStaleness: true,
      safeSearchAvailable: true,
    });
  });

  it('fails closed for an unparsable evaluation timestamp', () => {
    const status = evaluateSyntheticReconciliationStatus(ledger, 'not-a-timestamp');

    expect(status.alertLevel).toBe('delayed_alert');
    expect(status.minutesSinceLastRun).toBeNull();
  });
});
