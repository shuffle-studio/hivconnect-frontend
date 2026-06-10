import { useState, useEffect, useRef, type FormEvent } from 'react';

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  county: string;
  inquiryType: string;
  message: string;
  consentGiven: boolean;
}

const initialFormData: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  county: '',
  inquiryType: '',
  message: '',
  consentGiven: false,
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;

  // Load the Turnstile script once
  useEffect(() => {
    if (!siteKey) return;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [siteKey]);

  // Render the widget
  useEffect(() => {
    if (!siteKey || !turnstileContainerRef.current) return;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current) return;
      if (turnstileWidgetId.current) {
        window.turnstile.remove(turnstileWidgetId.current);
      }
      turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setTurnstileToken(token),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
    };
  }, [siteKey]);

  const update = (updates: Partial<ContactFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.inquiryType) newErrors.inquiryType = 'Please choose how we can help';
    if (!formData.message.trim()) newErrors.message = 'Please enter a message';
    if (!formData.consentGiven) newErrors.consentGiven = 'Please confirm the privacy notice';
    // Only require the security check if Turnstile is configured
    if (siteKey && !turnstileToken) newErrors.turnstile = 'Please complete the security check below';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const PAYLOAD_URL = import.meta.env.PUBLIC_PAYLOAD_URL || 'https://login.hivconnectcentralnj.com';
      const response = await fetch(`${PAYLOAD_URL}/api/contact-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'new',
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          county: formData.county,
          inquiryType: formData.inquiryType,
          message: formData.message,
          consentGiven: formData.consentGiven,
          turnstileToken,
        }),
      });

      if (response.ok) {
        window.location.href = '/success';
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Contact API Error:', errorData);
        setErrors({ form: 'Something went wrong sending your message. Please try again or call us.' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({ form: 'Something went wrong sending your message. Please try again or call us.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first-name" className="form-label">First Name *</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            value={formData.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            className="form-input"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="last-name" className="form-label">Last Name *</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            value={formData.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            className="form-input"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="form-label">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => update({ email: e.target.value })}
          className="form-input"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="form-label">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(e) => update({ phone: e.target.value })}
          className="form-input"
        />
      </div>

      <div>
        <label htmlFor="county" className="form-label">County</label>
        <select
          id="county"
          name="county"
          value={formData.county}
          onChange={(e) => update({ county: e.target.value })}
          className="form-input"
        >
          <option value="">Select your county</option>
          <option value="middlesex">Middlesex County</option>
          <option value="somerset">Somerset County</option>
          <option value="hunterdon">Hunterdon County</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="inquiry-type" className="form-label">How can we help you? *</label>
        <select
          id="inquiry-type"
          name="inquiry-type"
          value={formData.inquiryType}
          onChange={(e) => update({ inquiryType: e.target.value })}
          className="form-input"
        >
          <option value="">Select an option</option>
          <option value="services">I need information about services</option>
          <option value="testing">I want to get tested</option>
          <option value="treatment">I need help with treatment</option>
          <option value="support">I need support services</option>
          <option value="planning-council">Planning Council information</option>
          <option value="other">Other</option>
        </select>
        {errors.inquiryType && <p className="text-red-500 text-sm mt-1">{errors.inquiryType}</p>}
      </div>

      <div>
        <label htmlFor="message" className="form-label">Message *</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={(e) => update({ message: e.target.value })}
          className="form-input"
          placeholder="Please tell us how we can help you..."
        ></textarea>
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <div className="bg-stone-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-3">
          <strong>Privacy Notice:</strong> Your information is confidential and protected by federal and state privacy laws. We will only use your contact information to respond to your inquiry.
        </p>
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={formData.consentGiven}
            onChange={(e) => update({ consentGiven: e.target.checked })}
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">I understand that my information will be kept confidential and used only to respond to my inquiry. *</span>
        </label>
        {errors.consentGiven && <p className="text-red-500 text-sm mt-1">{errors.consentGiven}</p>}
      </div>

      {siteKey && (
        <div>
          <div ref={turnstileContainerRef}></div>
          {errors.turnstile && <p className="text-red-500 text-sm mt-1">{errors.turnstile}</p>}
        </div>
      )}

      {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

      <div>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
