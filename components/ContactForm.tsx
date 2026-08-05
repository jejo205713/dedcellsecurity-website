'use client';

import { useState } from 'react';
import { ArrowRight, Check, Info, Loader2 } from 'lucide-react';

/**
 * Ported from the `contact` template + setupForm() in
 * dedcell-security/public/index.html.
 *
 * Same contract as before: POST JSON to our own /api/contact, which validates,
 * rate-limits and sanitises before forwarding to Google Apps Script. The Apps
 * Script URL stays server-side. The honeypot field is unchanged — bots fill
 * `botcheck`, the server sees it and silently drops the submission.
 *
 * The client-side validation here is a courtesy for the user, not a control.
 * The server re-checks everything (app/api/contact/route.ts).
 */

const FIELD_CLASS =
  'w-full bg-inputBg border border-black/10 rounded-xl px-4 py-3 text-black text-sm ' +
  'transition-all focus:border-black/40 placeholder:text-gray-700';
const LABEL_CLASS = 'font-mono text-[11px] text-gray-500 uppercase tracking-widest';

type Status = 'idle' | 'sending' | 'sent';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    if (
      (payload.name ?? '').trim().length < 2 ||
      !(payload.email ?? '').includes('@') ||
      (payload.message ?? '').trim().length < 10
    ) {
      setError('Please fill out all required fields correctly.');
      return;
    }

    setError(null);
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus('sent');
        form.reset();
      } else {
        setError(
          data.error ?? 'Something went wrong. Please email us at jejo@dedcellsecurity.in.',
        );
        setStatus('idle');
      }
    } catch {
      setError('Network error. Please email us directly at jejo@dedcellsecurity.in.');
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-surface border border-black/20 rounded-2xl p-8 md:p-10 flex flex-col items-center justify-center text-center min-h-[28rem]">
        <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-black" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-black mb-3">Request Received.</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-xs">
          We&rsquo;ll review your details and get back to you within{' '}
          <strong className="text-black">4 business hours</strong> to schedule a scoping
          call.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="font-mono text-xs text-gray-500 hover:text-black border-b border-black/30 pb-1 transition-all"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-black/10 rounded-2xl p-8 md:p-10">
      <h2 className="text-2xl font-bold text-black mb-2">Request a Security Audit</h2>
      <p className="text-sm text-gray-500 mb-8">
        Free 30-min consultation. No commitment required.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className={LABEL_CLASS}>
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="name"
              className={FIELD_CLASS}
              placeholder="Jane Doe"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className={LABEL_CLASS}>
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              autoComplete="email"
              className={FIELD_CLASS}
              placeholder="jane@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="company" className={LABEL_CLASS}>
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              autoComplete="organization"
              className={FIELD_CLASS}
              placeholder="Startup Inc."
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className={LABEL_CLASS}>
              Phone (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              className={FIELD_CLASS}
              placeholder="+91"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className={LABEL_CLASS}>
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Tell us about your tech stack and what you need assessed..."
          />
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-center gap-2 text-black text-sm font-mono border border-black/20 rounded-lg px-3 py-2 bg-black/[0.03]"
          >
            <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-black text-white font-sans font-bold text-sm px-6 py-4 rounded-xl btn-press flex items-center justify-center gap-2 hover:bg-gray-700 mt-4 transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? (
            <>
              Sending... <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            </>
          ) : (
            <>
              Request Security Audit <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-center font-mono text-[10px] text-gray-600 mt-4">
          No spam. Mutual NDA available before scoping call.
        </p>
      </form>
    </div>
  );
}
