/**
 * EV2-02 - "Add to calendar" controls for /events/[slug].
 *
 * Both links point at the backend Worker, which is the only thing that can
 * serve text/calendar here - the frontend is astro output:'static' on
 * Cloudflare Pages and has no server routes.
 *
 * Endpoints (hivconnect-backend/src/endpoints/eventsCalendarFeed.ts):
 *   GET /api/events/:id/event.ics   → download / Apple / Outlook
 *   GET /api/events/:id/google      → 302 to Google's template URL
 *
 * The subscribe URL is the one that actually solves Terri's standing-meeting
 * problem: subscribing once keeps the Planning Council calendar in sync
 * forever, instead of re-adding each occurrence.
 */

const BACKEND =
  import.meta.env.PUBLIC_PAYLOAD_URL || 'https://login.hivconnectcentralnj.com';

interface Props {
  eventId: string | number;
  /** Show the "subscribe to all events" option. Off on single-event pages by default. */
  showSubscribe?: boolean;
}

export default function AddToCalendarButtons({ eventId, showSubscribe = false }: Props) {
  const icsUrl = `${BACKEND}/api/events/${eventId}/event.ics`;
  const googleUrl = `${BACKEND}/api/events/${eventId}/google`;
  // webcal:// makes Apple Calendar and Outlook offer a live subscription
  // rather than a one-time import.
  const subscribeUrl = `webcal://${BACKEND.replace(/^https?:\/\//, '')}/api/events/calendar.ics`;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-900">Add to your calendar</h3>

      <div className="flex flex-wrap gap-2">
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Google Calendar
        </a>
        <a
          href={icsUrl}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Apple / Outlook (.ics)
        </a>
      </div>

      {showSubscribe && (
        <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-600">
          <a href={subscribeUrl} className="font-medium text-primary-600 hover:text-primary-800">
            Subscribe to all events
          </a>{' '}
          New and updated events appear in your calendar automatically.
        </p>
      )}
    </div>
  );
}
