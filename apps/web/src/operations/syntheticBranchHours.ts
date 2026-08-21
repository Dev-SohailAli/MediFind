export type SyntheticWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type SyntheticHoursInterval = {
  startMinutes: number;
  endMinutes: number;
};

export type SyntheticWeeklyHours = Record<SyntheticWeekday, SyntheticHoursInterval[]>;

export type SyntheticExceptionalClosure = {
  fijiDate: string;
  reason: string;
};

export type SyntheticBranchOpenStatus = {
  isOpen: boolean;
  reason: 'open' | 'closed_weekly' | 'closed_exceptional' | 'closed_no_hours';
};

// Fiji has not observed daylight saving since 2010; a fixed UTC+12 offset is
// an accurate simplification for this synthetic rehearsal.
const FIJI_UTC_OFFSET_MINUTES = 12 * 60;

function toFijiLocal(
  evaluatedAtUtc: string,
): { weekday: SyntheticWeekday; minutesOfDay: number; fijiDate: string } | null {
  const utcMs = Date.parse(evaluatedAtUtc);
  if (!Number.isFinite(utcMs)) {
    return null;
  }
  const fijiMs = utcMs + FIJI_UTC_OFFSET_MINUTES * 60 * 1000;
  const fiji = new Date(fijiMs);
  const weekday = fiji.getUTCDay() as SyntheticWeekday;
  const minutesOfDay = fiji.getUTCHours() * 60 + fiji.getUTCMinutes();
  const fijiDate = fiji.toISOString().slice(0, 10);
  return { weekday, minutesOfDay, fijiDate };
}

export function getSyntheticBranchOpenStatus(
  weeklyHours: SyntheticWeeklyHours,
  exceptionalClosures: SyntheticExceptionalClosure[],
  evaluatedAtUtc: string,
): SyntheticBranchOpenStatus {
  const local = toFijiLocal(evaluatedAtUtc);
  if (!local) {
    return { isOpen: false, reason: 'closed_no_hours' };
  }

  // An exceptional closure overrides the weekly schedule even when the
  // weekly schedule would otherwise say the branch is open.
  const isExceptionallyClosed = exceptionalClosures.some(
    (closure) => closure.fijiDate === local.fijiDate,
  );
  if (isExceptionallyClosed) {
    return { isOpen: false, reason: 'closed_exceptional' };
  }

  const dayIntervals = weeklyHours[local.weekday] ?? [];
  if (dayIntervals.length === 0) {
    return { isOpen: false, reason: 'closed_no_hours' };
  }

  const isWithinAnInterval = dayIntervals.some(
    (interval) =>
      local.minutesOfDay >= interval.startMinutes && local.minutesOfDay < interval.endMinutes,
  );

  return isWithinAnInterval
    ? { isOpen: true, reason: 'open' }
    : { isOpen: false, reason: 'closed_weekly' };
}

export function isSyntheticPickupTimeWithinOpenHours(
  weeklyHours: SyntheticWeeklyHours,
  exceptionalClosures: SyntheticExceptionalClosure[],
  pickupAtUtc: string,
): boolean {
  return getSyntheticBranchOpenStatus(weeklyHours, exceptionalClosures, pickupAtUtc).isOpen;
}
