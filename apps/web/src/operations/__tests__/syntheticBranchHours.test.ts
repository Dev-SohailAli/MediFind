import { describe, expect, it } from 'vitest';

import {
  getSyntheticBranchOpenStatus,
  isSyntheticPickupTimeWithinOpenHours,
  type SyntheticWeeklyHours,
} from '../syntheticBranchHours';

// Friday (weekday 5) has a split morning/afternoon schedule; every other day
// is unset to exercise the closed_no_hours path.
const weeklyHours: SyntheticWeeklyHours = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [
    { startMinutes: 480, endMinutes: 720 }, // 08:00-12:00 Fiji
    { startMinutes: 780, endMinutes: 1020 }, // 13:00-17:00 Fiji
  ],
  6: [],
};

describe('synthetic branch open status', () => {
  it('is open during the morning interval', () => {
    expect(getSyntheticBranchOpenStatus(weeklyHours, [], '2026-08-20T22:00:00.000Z')).toEqual({
      isOpen: true,
      reason: 'open',
    });
  });

  it('is closed during the split lunch gap', () => {
    expect(getSyntheticBranchOpenStatus(weeklyHours, [], '2026-08-21T00:30:00.000Z')).toEqual({
      isOpen: false,
      reason: 'closed_weekly',
    });
  });

  it('is open again during the afternoon interval', () => {
    expect(getSyntheticBranchOpenStatus(weeklyHours, [], '2026-08-21T02:00:00.000Z')).toEqual({
      isOpen: true,
      reason: 'open',
    });
  });

  it('treats an interval end as exclusive at the exact boundary', () => {
    expect(getSyntheticBranchOpenStatus(weeklyHours, [], '2026-08-21T00:00:00.000Z')).toEqual({
      isOpen: false,
      reason: 'closed_weekly',
    });
  });

  it('gives an exceptional closure precedence over an open weekly interval', () => {
    const result = getSyntheticBranchOpenStatus(
      weeklyHours,
      [{ fijiDate: '2026-08-21', reason: 'public_holiday' }],
      '2026-08-20T22:00:00.000Z',
    );

    expect(result).toEqual({ isOpen: false, reason: 'closed_exceptional' });
  });

  it('reports closed_no_hours for a day with no configured intervals', () => {
    expect(getSyntheticBranchOpenStatus(weeklyHours, [], '2026-08-22T22:00:00.000Z')).toEqual({
      isOpen: false,
      reason: 'closed_no_hours',
    });
  });

  it('fails closed for an unparsable timestamp', () => {
    expect(getSyntheticBranchOpenStatus(weeklyHours, [], 'not-a-timestamp')).toEqual({
      isOpen: false,
      reason: 'closed_no_hours',
    });
  });

  it('validates a reservation pickup time against open branch intervals', () => {
    expect(isSyntheticPickupTimeWithinOpenHours(weeklyHours, [], '2026-08-20T22:00:00.000Z')).toBe(
      true,
    );
    expect(isSyntheticPickupTimeWithinOpenHours(weeklyHours, [], '2026-08-21T00:30:00.000Z')).toBe(
      false,
    );
  });
});
