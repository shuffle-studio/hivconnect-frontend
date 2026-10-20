import type { Event } from './api';

/**
 * V1 REMEDIATION support - Change Order #1 (Dec 11, 2025) promised, as part of
 * the already-paid EV001 MVP:
 *   - "Calendar-style display (simple grid view)"
 *   - "Filter by category and date range"
 * Neither shipped. /events is a card list. These helpers back the fix.
 *
 * Also handles recurrence expansion for the v2 `recurrence` field group
 * (hivconnect-backend/src/fields/eventRecurrence.ts). Backend stores the RULE;
 * we expand on read so one Planning Council entry renders on twelve dates.
 *
 * Pure functions, no DOM - the page is prerendered at build time (output:
 * 'static') and only the interactive island rehydrates.
 */

export interface EventOccurrence {
  event: Event;
  /** Occurrence start. Equals event.startDate for non-recurring events. */
  start: Date;
  end: Date | null;
  /** True when produced by expanding an RRULE rather than the base row. */
  isRecurrenceInstance: boolean;
}

export const CATEGORY_LABELS: Record<string, string> = {
  'planning-council': 'Planning Council',
  committee: 'Committee Meeting',
  community: 'Community Event',
  training: 'Training/Workshop',
  'health-fair': 'Health Fair',
  'support-group': 'Support Group',
  other: 'Event',
};

/** Tailwind classes per category, so the grid is scannable at a glance. */
export const CATEGORY_STYLES: Record<string, string> = {
  'planning-council': 'bg-primary-100 text-primary-800 border-primary-200',
  committee: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  community: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  training: 'bg-amber-100 text-amber-900 border-amber-200',
  'health-fair': 'bg-rose-100 text-rose-800 border-rose-200',
  'support-group': 'bg-violet-100 text-violet-800 border-violet-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
};

const MS_DAY = 86_400_000;

function parseRRule(rrule: string): Record<string, string> {
  return Object.fromEntries(
    rrule.split(';').map((part) => {
      const [k, v] = part.split('=');
      return [k.toUpperCase(), v];
    }),
  );
}

const WEEKDAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function parseUntil(value: string): Date | null {
  // RFC 5545 basic form: 20261231T235959Z
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z?)?$/.exec(value);
  if (!m) return null;
  return new Date(
    Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 23), +(m[5] ?? 59), +(m[6] ?? 59)),
  );
}

/** Eastern wall-clock fields for an instant. month is 0-based, like Date. */
interface WallClock {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function easternWallClock(d: Date): WallClock {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: EVENT_TZ,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(d);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month') - 1, day: get('day'), hour: get('hour'), minute: get('minute') };
}

/**
 * The instant at which Eastern clocks read this wall time. Recurrence is
 * stepped on the Eastern calendar and converted here, so a 6:00 PM meeting
 * stays 6:00 PM across the DST change instead of sliding to 5:00 PM in winter.
 */
function easternInstant(w: WallClock): Date {
  const asUtc = Date.UTC(w.year, w.month, w.day, w.hour, w.minute);
  let instant = asUtc;
  // Two passes settle the offset either side of a DST boundary.
  for (let i = 0; i < 2; i++) {
    const seen = easternWallClock(new Date(instant));
    const seenAsUtc = Date.UTC(seen.year, seen.month, seen.day, seen.hour, seen.minute);
    instant += asUtc - seenAsUtc;
  }
  return new Date(instant);
}

/** Day-of-month of the nth (1..4, or -1 for last) `weekday` in a month. */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): number | null {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  if (nth > 0) {
    const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const day = 1 + ((weekday - firstDow + 7) % 7) + (nth - 1) * 7;
    return day <= daysInMonth ? day : null;
  }
  const lastDow = new Date(Date.UTC(year, month, daysInMonth)).getUTCDay();
  return daysInMonth - ((lastDow - weekday + 7) % 7);
}

/**
 * Expand one event into its occurrences within [rangeStart, rangeEnd].
 *
 * Dates are stepped on the Eastern calendar (EVENT_TZ), the same calendar the
 * backend reads weekdays from when it writes the RRULE. COUNT counts every
 * occurrence from the first, including ones before the range. Hard-capped at
 * 200 occurrences; an RRULE with no UNTIL and no COUNT is a content-entry
 * mistake, not a reason to hang the browser.
 */
export function expandEvent(event: Event, rangeStart: Date, rangeEnd: Date): EventOccurrence[] {
  const baseStart = new Date(event.startDate);
  const baseEnd = event.endDate ? new Date(event.endDate) : null;
  const durationMs = baseEnd ? baseEnd.getTime() - baseStart.getTime() : 0;

  const rrule = (event as any).recurrence?.rrule as string | undefined;
  if (!rrule) {
    if (baseStart < rangeStart || baseStart > rangeEnd) return [];
    return [{ event, start: baseStart, end: baseEnd, isRecurrenceInstance: false }];
  }

  const rule = parseRRule(rrule);
  const interval = Number(rule.INTERVAL) || 1;
  const maxCount = Number(rule.COUNT) || 200;
  const until = rule.UNTIL ? parseUntil(rule.UNTIL) : null;
  const hardStop = until && until < rangeEnd ? until : rangeEnd;

  const skipped = new Set<string>(
    ((event as any).recurrence?.exceptions ?? [])
      .map((e: any) => e?.date)
      .filter(Boolean)
      .map((d: string) => dayKeyET(new Date(d))),
  );

  const base = easternWallClock(baseStart);
  const at = (year: number, month: number, day: number) =>
    easternInstant({ year, month, day, hour: base.hour, minute: base.minute });

  const out: EventOccurrence[] = [];
  let emitted = 0;
  let done = false;
  // Returns false once the series is over, so the caller stops stepping.
  const emit = (start: Date): boolean => {
    if (start < baseStart) return true;
    if (start > hardStop || emitted >= maxCount || out.length >= 200) {
      done = true;
      return false;
    }
    emitted += 1;
    if (start >= rangeStart && !skipped.has(dayKeyET(start))) {
      out.push({
        event,
        start,
        end: durationMs ? new Date(start.getTime() + durationMs) : null,
        isRecurrenceInstance: start.getTime() !== baseStart.getTime(),
      });
    }
    return true;
  };

  const byDay = (rule.BYDAY ?? '').split(',').filter(Boolean);

  for (let step = 0; !done && step < 2000; step++) {
    if (rule.FREQ === 'DAILY') {
      emit(at(base.year, base.month, base.day + step * interval));
    } else if (rule.FREQ === 'WEEKLY') {
      // Sunday of the base week, then each selected weekday in order.
      const baseDow = new Date(Date.UTC(base.year, base.month, base.day)).getUTCDay();
      const weekStart = base.day - baseDow + step * 7 * interval;
      const days = byDay.length ? byDay : [WEEKDAY_CODES[baseDow]];
      const idxs = days.map((c) => WEEKDAY_CODES.indexOf(c)).filter((i) => i >= 0).sort();
      for (const idx of idxs) {
        if (!emit(at(base.year, base.month, weekStart + idx))) break;
      }
    } else if (rule.FREQ === 'MONTHLY') {
      const monthIndex = base.month + step * interval;
      const year = base.year + Math.floor(monthIndex / 12);
      const month = ((monthIndex % 12) + 12) % 12;
      const nthMatch = /^(-?\d)([A-Z]{2})$/.exec(byDay[0] ?? '');
      const day = nthMatch
        ? nthWeekdayOfMonth(year, month, WEEKDAY_CODES.indexOf(nthMatch[2]), Number(nthMatch[1]))
        : base.day <= new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
          ? base.day
          : null; // RFC 5545: the 31st skips months without one.
      if (day !== null) emit(at(year, month, day));
      else if (at(year, month, 1) > hardStop) done = true;
    } else {
      break;
    }
  }

  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}

const ORDINALS: Record<string, string> = { '1': '1st', '2': '2nd', '3': '3rd', '4': '4th', '-1': 'last' };
const WEEKDAY_NAMES: Record<string, string> = {
  SU: 'Sunday', MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday', TH: 'Thursday', FR: 'Friday', SA: 'Saturday',
};

/**
 * Plain-English repeat pattern for a recurring event, e.g. "Repeats on the 4th
 * Tuesday of every month". Null for one-off events. Unlike a computed "next
 * date", this can't go stale between static rebuilds.
 */
export function describeRecurrence(event: Event): string | null {
  const rrule = (event as any).recurrence?.rrule as string | undefined;
  if (!rrule) return null;
  const rule = parseRRule(rrule);
  const n = Number(rule.INTERVAL) || 1;
  const days = (rule.BYDAY ?? '').split(',').filter(Boolean);

  if (rule.FREQ === 'DAILY') return n > 1 ? `Repeats every ${n} days` : 'Repeats daily';
  if (rule.FREQ === 'WEEKLY') {
    const names = days.map((d) => WEEKDAY_NAMES[d]).filter(Boolean).join(', ');
    const every = n > 1 ? `every ${n} weeks` : 'weekly';
    return names ? `Repeats ${every} on ${names}` : `Repeats ${every}`;
  }
  if (rule.FREQ === 'MONTHLY') {
    const every = n > 1 ? `every ${n} months` : 'every month';
    const m = /^(-?\d)([A-Z]{2})$/.exec(days[0] ?? '');
    if (m && ORDINALS[m[1]] && WEEKDAY_NAMES[m[2]]) {
      return `Repeats on the ${ORDINALS[m[1]]} ${WEEKDAY_NAMES[m[2]]} of ${every}`;
    }
    const day = easternWallClock(new Date(event.startDate)).day;
    const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    return `Repeats on the ${day}${suffix} of ${every}`;
  }
  return null;
}

/** The next `limit` occurrences on or after `now`. */
export function upcomingOccurrences(event: Event, now: Date, limit = 3): EventOccurrence[] {
  const horizon = new Date(now.getTime() + 2 * 365 * MS_DAY);
  return expandEvent(event, now, horizon).slice(0, limit);
}

export function expandAll(events: Event[], rangeStart: Date, rangeEnd: Date): EventOccurrence[] {
  return events
    .flatMap((e) => expandEvent(e, rangeStart, rangeEnd))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

/** 6-week grid (42 cells) covering `month`, Sunday-first. Stable height = no layout jump. */
export function buildMonthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());

  return Array.from({ length: 42 }, (_, i) => new Date(gridStart.getTime() + i * MS_DAY));
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

/**
 * Change Order #1 promised "Timezone handling (EST default)". Without pinning,
 * `toLocaleTimeString` uses the VIEWER's zone - someone reading from California
 * saw the 6:00 PM Medicare session as 3:00 PM. Every displayed time and date
 * below is Eastern, regardless of where the reader is.
 */
export const EVENT_TZ = 'America/New_York';

/**
 * "YYYY-MM-DD" for an instant, as it falls in Eastern time. Used to bucket
 * occurrences into calendar squares. en-CA gives ISO-ordered output.
 */
export function dayKeyET(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: EVENT_TZ });
}

/**
 * "YYYY-MM-DD" for a calendar square. Squares are built with `new Date(y, m, d)`
 * - local midnight - so they are read with the viewer's own zone and compared
 * against `dayKeyET` as plain strings. Matching on strings rather than
 * timestamps is what keeps an 8pm ET event from sliding into the next square
 * for a reader in Europe.
 */
export function dayKeyLocal(d: Date): string {
  return d.toLocaleDateString('en-CA');
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', {
    timeZone: EVENT_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** Long-form date, pinned to Eastern. */
export function formatEventDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    timeZone: EVENT_TZ,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Which month should the calendar open on?
 *
 * Opening on "today" is wrong for a sparse calendar. With two published events
 * six weeks apart, the day after the August event the page would open on an
 * empty-looking August and hide October two clicks away - which reads as a
 * broken calendar, not an empty month.
 */
export function initialMonth(events: Event[], now: Date): Date {
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const upcoming = events
    .map((e) => new Date(e.startDate))
    .filter((d) => d.getTime() >= now.getTime())
    .sort((a, b) => a.getTime() - b.getTime());

  // Something still to come this month - stay put.
  if (upcoming.some((d) => d <= monthEnd)) return thisMonth;

  // Otherwise jump to the next event. Nothing upcoming at all: stay on today,
  // so the page doesn't strand the reader in an old month.
  const next = upcoming[0];
  return next ? new Date(next.getFullYear(), next.getMonth(), 1) : thisMonth;
}

export function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export type DateRangePreset = 'all' | 'this-month' | 'next-30' | 'next-90' | 'past';

export function resolveDateRange(preset: DateRangePreset, now = new Date()): { start: Date; end: Date } {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case 'this-month':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      };
    case 'next-30':
      return { start: startOfToday, end: new Date(startOfToday.getTime() + 30 * MS_DAY) };
    case 'next-90':
      return { start: startOfToday, end: new Date(startOfToday.getTime() + 90 * MS_DAY) };
    case 'past':
      return { start: new Date(now.getFullYear() - 2, 0, 1), end: startOfToday };
    case 'all':
    default:
      return { start: new Date(now.getFullYear() - 2, 0, 1), end: new Date(now.getFullYear() + 2, 11, 31) };
  }
}
