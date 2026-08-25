import { useState } from 'react';

/**
 * EV2-04 — on-site RSVP.
 *
 * Posts to the backend Worker's standard Payload create route; the collection's
 * hooks handle Turnstile, capacity and waitlisting
 * (hivconnect-backend/src/collections/EventRegistrations.ts).
 *
 * CSP: public/_headers already allowlists connect-src to
 * login.hivconnectcentralnj.com and challenges.cloudflare.com, so this island
 * needs no header change. (The stale netlify.toml in this repo has a much
 * narrower connect-src — delete that file, do not sync it.)
 *
 * Turnstile widget loading follows the existing pattern in
 * src/components/forms/PlanningCouncilForm.tsx — reuse that, don't reinvent it.
 */

const BACKEND =
  import.meta.env.PUBLIC_PAYLOAD_URL || 'https://login.hivconnectcentralnj.com';

interface Props {
  eventId: string | number;
  allowGuests?: boolean;
  /** Cents. > 0 routes through Stripe Checkout after the record is created. */
  priceCents?: number;
  turnstileToken?: string;
}

type State = 'idle' | 'submitting' | 'confirmed' | 'waitlisted' | 'error';

export default function EventRsvpForm({
  eventId,
  allowGuests = true,
  priceCents = 0,
  turnstileToken,
}: Props) {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setMessage('');

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${BACKEND}/api/event-registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventId,
          attendeeName: form.get('attendeeName'),
          attendeeEmail: form.get('attendeeEmail'),
          attendeePhone: form.get('attendeePhone') || undefined,
          guests: Number(form.get('guests') || 0),
          accessibilityNeeds: form.get('accessibilityNeeds') || undefined,
          consentToContact: form.get('consentToContact') === 'on',
          turnstileToken,
        }),
      });

      const data: any = await res.json().catch(() => ({}));

      if (!res.ok) {
        setState('error');
        setMessage(data?.errors?.[0]?.message ?? 'Something went wrong. Please try again.');
        return;
      }

      const registration = data.doc ?? data;

      // Paid event: hand off to Stripe Checkout. The seat is not confirmed
      // until the webhook fires.
      if (priceCents > 0 && registration.status === 'pending-payment') {
        const checkout = await fetch(
          `${BACKEND}/api/event-registrations/${registration.id}/checkout`,
          { method: 'POST' },
        );
        const { url } = (await checkout.json()) as { url?: string };
        if (url) {
          window.location.href = url;
          return;
        }
        setState('error');
        setMessage('We could not open the payment page. Please contact us.');
        return;
      }

      setState(registration.status === 'waitlisted' ? 'waitlisted' : 'confirmed');
    } catch {
      setState('error');
      setMessage('We could not reach the server. Please try again.');
    }
  }

  if (state === 'confirmed' || state === 'waitlisted') {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5" role="status">
        <h3 className="font-semibold text-emerald-900">
          {state === 'waitlisted' ? "You're on the waitlist" : "You're registered"}
        </h3>
        <p className="mt-1 text-sm text-emerald-800">
          {state === 'waitlisted'
            ? "This event is full. We'll email you if a spot opens up."
            : 'A confirmation email with calendar details is on its way.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Register for this event</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="attendeeName" className="block text-sm font-medium text-gray-700">
            Your name <span className="text-red-600">*</span>
          </label>
          <input
            id="attendeeName"
            name="attendeeName"
            required
            className="mt-1 w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="attendeeEmail" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="attendeeEmail"
            name="attendeeEmail"
            type="email"
            required
            className="mt-1 w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="attendeePhone" className="block text-sm font-medium text-gray-700">
            Phone <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="attendeePhone"
            name="attendeePhone"
            type="tel"
            className="mt-1 w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {allowGuests && (
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
              Additional guests
            </label>
            <input
              id="guests"
              name="guests"
              type="number"
              min={0}
              max={10}
              defaultValue={0}
              className="mt-1 w-24 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="accessibilityNeeds" className="block text-sm font-medium text-gray-700">
            Accommodations needed <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="accessibilityNeeds"
            name="accessibilityNeeds"
            rows={2}
            placeholder="Interpretation, mobility access, dietary needs…"
            className="mt-1 w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input name="consentToContact" type="checkbox" className="mt-1 rounded border-gray-300" />
          <span>You may contact me about this event.</span>
        </label>

        {/* Mount the Turnstile widget here — same pattern as PlanningCouncilForm.tsx */}

        {state === 'error' && (
          <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="w-full rounded-md bg-primary-600 px-4 py-2.5 font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {state === 'submitting'
            ? 'Submitting…'
            : priceCents > 0
              ? `Continue to payment — $${(priceCents / 100).toFixed(2)}`
              : 'Register'}
        </button>
      </div>
    </form>
  );
}
