import type { Event } from './api';

/**
 * V1 REMEDIATION support — Change Order #1 (Dec 11, 2025) promised, as part of
 * the already-paid EV001 MVP:
 *   - "Calendar-style display (simple grid view)"
 *   - "Filter by category and date range"
 * Neither shipped. /events is a card list. These helpers back the fix.
 *
 * Also handles recurrence expansion for the v2 `recurrence` field group
 * (hivconnect-backend/src/fields/eventRecurrence.ts). Backend stores the RULE;
 * we expand on read so one Planning Council entry renders on twelve dates.
 *
 * Pure functions, no DOM — the page is prerendered at build time (output:
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

/**
 * Expand one event into its occurrences within [rangeStart, rangeEnd].
 *
 * Hard-capped at 200 occurrences. An RRULE with no UNTIL and no COUNT is a
 * content-entry mistake, not a reason to hang the browser.
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

  const skipped = new Set(
    ((event as any).recurrence?.exceptions ?? [])
      .map((e: any) => e?.date)
      .filter(Boolean)
      .map((d: string) => new Date(d).toDateString()),
  );

  const out: EventOccurrence[] = [];
  const push = (start: Date) => {
    if (skipped.has(start.toDateString())) return;
    if (start < rangeStart || start > hardStop) return;
    out.push({
      event,
      start,
      end: durationMs ? new Date(start.getTime() + durationMs) : null,
      isRecurrenceInstance: start.getTime() !== baseStart.getTime(),
    });
  };

  let emitted = 0;
  const cursor = new Date(baseStart);

  while (cursor <= hardStop && emitted < maxCount && out.length < 200) {
    if (rule.FREQ === 'WEEKLY' && rule.BYDAY) {
      const days = rule.BYDAY.split(',');
      // Walk the week containing `cursor` and emit each selected weekday.
      const weekStart = new Date(cursor);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      for (const code of days) {
        const idx = WEEKDAY_CODES.indexOf(code);
        if (idx < 0) continue;
        const occ = new Date(weekStart);
        occ.setDate(weekStart.getDate() + idx);
        occ.setHours(baseStart.getHours(), baseStart.getMinutes(), 0, 0);
        if (occ >= baseStart) push(occ);
      }
      emitted += 1;
      cursor.setDate(cursor.getDate() + 7 * interval);
      continue;
    }

    push(new Date(cursor));
    emitted += 1;

    if (rule.FREQ === 'DAILY') cursor.setDate(cursor.getDate() + interval);
    else if (rule.FREQ === 'WEEKLY') cursor.setDate(cursor.getDate() + 7 * interval);
    else if (rule.FREQ === 'MONTHLY') cursor.setMonth(cursor.getMonth() + interval);
    else break;
  }

  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
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

export function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
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
