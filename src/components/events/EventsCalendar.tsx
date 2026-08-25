import { useMemo, useState } from 'react';
import type { Event } from '../../lib/api';
import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  buildMonthGrid,
  dayKeyET,
  dayKeyLocal,
  expandAll,
  formatEventDate,
  formatMonthYear,
  formatTime,
  initialMonth,
  resolveDateRange,
  type DateRangePreset,
  type EventOccurrence,
} from '../../lib/eventsCalendar';

/**
 * V1 REMEDIATION - Change Order #1 (Dec 11, 2025), EV001 frontend deliverables:
 *   "Calendar-style display (simple grid view)"
 *   "Filter by category and date range"
 *   "Mobile responsive design"
 *
 * These were billed at $2,000 (invoice 20260403-HIV, paid June 2, 2026) and
 * never shipped. This component is the fix, not new scope.
 *
 * Static-site safe: the page prerenders at build time (astro output: 'static',
 * Cloudflare Pages), events are passed in as props from the .astro frontmatter,
 * and this island only handles view state. No client fetch, no SSR needed.
 *
 * Mount with client:load in src/pages/events/index.astro - see the wiring note
 * in the scaffold spec.
 */

interface Props {
  events: Event[];
  /** ISO string from the .astro build so SSR/CSR agree on "today". */
  today?: string;
}

type ViewMode = 'calendar' | 'list';

export default function EventsCalendar({ events, today }: Props) {
  const now = useMemo(() => (today ? new Date(today) : new Date()), [today]);

  const [view, setView] = useState<ViewMode>('calendar');
  const [month, setMonth] = useState(() => initialMonth(events, now));
  const [categories, setCategories] = useState<string[]>([]);
  const [range, setRange] = useState<DateRangePreset>('all');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const activeCategories = useMemo(() => {
    const present = new Set(events.map((e) => e.category));
    return Object.keys(CATEGORY_LABELS).filter((c) => present.has(c));
  }, [events]);

  // Expand recurrence across a wide window once, then filter cheaply.
  const occurrences = useMemo(() => {
    const { start, end } = resolveDateRange('all', now);
    return expandAll(events, start, end);
  }, [events, now]);

  const filtered = useMemo(() => {
    const { start, end } = resolveDateRange(range, now);
    return occurrences.filter((o) => {
      if (categories.length && !categories.includes(o.event.category)) return false;
      if (o.start < start || o.start > end) return false;
      return true;
    });
  }, [occurrences, categories, range, now]);

  const grid = useMemo(() => buildMonthGrid(month), [month]);

  const byDay = useMemo(() => {
    const map = new Map<string, EventOccurrence[]>();
    for (const occ of filtered) {
      const key = dayKeyET(occ.start);
      const list = map.get(key);
      if (list) list.push(occ);
      else map.set(key, [occ]);
    }
    return map;
  }, [filtered]);

  const toggleCategory = (cat: string) =>
    setCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  const shiftMonth = (delta: number) => {
    setSelectedDay(null);
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  };

  const dayOccurrences = selectedDay ? (byDay.get(dayKeyLocal(selectedDay)) ?? []) : [];
  const todayKey = dayKeyET(now);
  const viewingThisMonth =
    month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();
  const hasFilters = categories.length > 0 || range !== 'all';

  return (
    <div>
      {/* ---------- Controls ---------- */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            className="inline-flex rounded-md border border-gray-300 p-0.5"
            role="group"
            aria-label="Choose how to view events"
          >
            {(['calendar', 'list'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className={`rounded px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                  view === mode ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {mode === 'calendar' ? 'Calendar' : 'List'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="event-range" className="text-sm font-medium text-gray-700">
              Show
            </label>
            <select
              id="event-range"
              value={range}
              onChange={(e) => setRange(e.target.value as DateRangePreset)}
              className="rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All events</option>
              <option value="this-month">This month</option>
              <option value="next-30">Next 30 days</option>
              <option value="next-90">Next 90 days</option>
              <option value="past">Past events</option>
            </select>
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="sr-only">Filter by category</legend>
          <div className="flex flex-wrap gap-2">
            {activeCategories.map((cat) => {
              const on = categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  aria-pressed={on}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    on ? CATEGORY_STYLES[cat] : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setCategories([]);
                  setRange('all');
                }}
                className="rounded-full px-3 py-1 text-xs font-medium text-primary-700 underline hover:text-primary-900"
              >
                Clear filters
              </button>
            )}
          </div>
        </fieldset>

        <p className="mt-3 text-sm text-gray-500" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
          {hasFilters ? ' match your filters' : ''}
          <span className="text-gray-400"> · all times Eastern</span>
        </p>
      </div>

      {/* ---------- Calendar grid ---------- */}
      {view === 'calendar' && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            >
              ←
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">{formatMonthYear(month)}</h2>
              {!viewingThisMonth && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(null);
                    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                  }}
                  className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                >
                  Today
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span className="hidden sm:inline">{d}</span>
                <span className="sm:hidden">{d[0]}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {grid.map((day) => {
              const dayKey = dayKeyLocal(day);
              const dayEvents = byDay.get(dayKey) ?? [];
              const inMonth = day.getMonth() === month.getMonth();
              const isToday = dayKey === todayKey;
              const isSelected = selectedDay ? dayKey === dayKeyLocal(selectedDay) : false;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDay(dayEvents.length ? day : null)}
                  disabled={!dayEvents.length}
                  aria-label={`${day.toDateString()}, ${dayEvents.length} events`}
                  aria-current={isToday ? 'date' : undefined}
                  className={`min-h-[72px] border-b border-r border-gray-100 p-1.5 text-left align-top transition-colors sm:min-h-[104px] sm:p-2 ${
                    inMonth ? 'bg-white' : 'bg-gray-50/60'
                  } ${dayEvents.length ? 'cursor-pointer hover:bg-primary-50' : 'cursor-default'} ${
                    isSelected ? 'ring-2 ring-inset ring-primary-500' : ''
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      isToday
                        ? 'bg-primary-600 font-bold text-white'
                        : inMonth
                          ? 'text-gray-900'
                          : 'text-gray-400'
                    }`}
                  >
                    {day.getDate()}
                  </span>

                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((occ, i) => (
                      <span
                        key={`${occ.event.id}-${i}`}
                        className={`block truncate rounded border px-1 py-0.5 text-[10px] font-medium leading-tight sm:text-[11px] ${
                          CATEGORY_STYLES[occ.event.category] ?? CATEGORY_STYLES.other
                        }`}
                      >
                        <span className="hidden sm:inline">{formatTime(occ.start)} </span>
                        {occ.event.title}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="block text-[10px] font-medium text-gray-500">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedDay && dayOccurrences.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                {selectedDay.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <ul className="space-y-2">
                {dayOccurrences.map((occ, i) => (
                  <li key={`${occ.event.id}-${i}`}>
                    <a
                      href={`/events/${occ.event.slug}`}
                      className="block rounded-md border border-gray-200 p-3 hover:border-primary-300 hover:bg-primary-50"
                    >
                      <span className="text-sm font-medium text-gray-900">{occ.event.title}</span>
                      <span className="mt-0.5 block text-sm text-gray-600">
                        {formatTime(occ.start)} · {CATEGORY_LABELS[occ.event.category]}
                        {occ.event.rsvpLink && (
                          <span className="ml-2 font-medium text-primary-600">· Registration open</span>
                        )}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ---------- List view ---------- */}
      {view === 'list' && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600">
              No events match your filters.
            </p>
          )}
          {filtered.map((occ, i) => (
            <a
              key={`${occ.event.id}-${i}`}
              href={`/events/${occ.event.slug}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    CATEGORY_STYLES[occ.event.category] ?? CATEGORY_STYLES.other
                  }`}
                >
                  {CATEGORY_LABELS[occ.event.category]}
                </span>
                {occ.isRecurrenceInstance && (
                  <span className="text-xs text-gray-500">Recurring</span>
                )}
                {occ.event.rsvpLink && (
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                    Registration open
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{occ.event.title}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {formatEventDate(occ.start)} · {formatTime(occ.start)}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
