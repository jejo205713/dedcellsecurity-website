'use client';

import { useState } from 'react';
import { ArrowRight, Check, Info, Loader2 } from 'lucide-react';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/ContactForm';
import { isValidEmail } from '@/lib/email';
import { programme } from '@/lib/a-pent';

/**
 * A-PENT application form: name, email and phone only.
 *
 * Posts to the existing /api/contact route rather than a new endpoint, so it
 * inherits the rate limiting, validation, formula-injection sanitising and the
 * Leads sheet + email notification. Applications are told apart from audit
 * enquiries by the `company` column ("A-PENT Application") and the message text.
 *
 * Inputs are 16px below `sm`: iOS Safari zooms the page into any focused field
 * smaller than that.
 */

const INPUT_CLASS = `${FIELD_CLASS} text-base sm:text-sm`;

function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s\-().]/g, '');
  return /^\+?\d{10,15}$/.test(digits);
}

type Status = 'idle' | 'sending' | 'sent';

export function EnrolForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();

    if (name.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(phone)) {
      setError('Please enter a valid phone number, including country code if outside India.');
      return;
    }

    setError(null);
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company: 'A-PENT Application',
          message: `A-PENT application for the batch starting ${programme.batchStart.label}. Please contact me about enrolment.`,
          botcheck: data.get('botcheck') ?? '',
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        setStatus('sent');
        form.reset();
      } else {
        setError(result.error ?? `Something went wrong. Please email us at ${programme.contactEmail}.`);
        setStatus('idle');
      }
    } catch {
      setError(`Network error. Please email us directly at ${programme.contactEmail}.`);
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="bg-surface border border-black/20 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center min-h-[24rem]"
      >
        <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-black" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-black mb-3">Application Received.</h3>
        <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
          Thank you for applying to A-PENT. Our team will get back to you with the next steps
          and payment details.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="font-mono text-xs text-gray-500 hover:text-black border-b border-black/30 pb-1 transition-all"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-black/10 rounded-2xl p-6 sm:p-8 md:p-10">
      <h3 className="text-2xl font-bold text-black mb-2">Application Form</h3>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        Share your details and our team will get back to you.
      </p>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        {/* Honeypot: bots fill this, humans never see it. */}
        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="space-y-2">
          <label htmlFor="a-pent-name" className={LABEL_CLASS}>
            Full Name *
          </label>
          <input
            type="text"
            id="a-pent-name"
            name="name"
            required
            autoComplete="name"
            className={INPUT_CLASS}
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="a-pent-email" className={LABEL_CLASS}>
            Email *
          </label>
          <input
            type="email"
            id="a-pent-email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            className={INPUT_CLASS}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="a-pent-phone" className={LABEL_CLASS}>
            Phone *
          </label>
          <input
            type="tel"
            id="a-pent-phone"
            name="phone"
            required
            autoComplete="tel"
            inputMode="tel"
            className={INPUT_CLASS}
            placeholder="+91 98765 43210"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 text-black text-sm font-mono border border-black/20 rounded-lg px-3 py-2 bg-black/[0.03]"
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-black text-white font-sans font-bold text-sm px-6 py-4 rounded-xl btn-press flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? (
            <>
              Sending... <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            </>
          ) : (
            <>
              Apply for A-PENT <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-center font-mono text-[11px] text-gray-600 leading-relaxed">
          We only use these details to contact you about A-PENT.{' '}
          <a href="/privacy" className="underline underline-offset-2 hover:text-black">
            Privacy policy
          </a>
        </p>
      </form>
    </div>
  );
}
