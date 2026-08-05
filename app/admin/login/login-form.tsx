'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const FIELD =
  'w-full bg-inputBg border border-black/10 rounded-xl px-4 py-3 text-black text-sm ' +
  'transition-all focus:border-black/40';
const LABEL = 'font-mono text-[11px] text-gray-500 uppercase tracking-widest';

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);
    setBusy(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: String(data.get('username') ?? ''),
          password: String(data.get('password') ?? ''),
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        // Full navigation, not a client route change: the CMS lives outside the
        // app router's tree and needs a real request carrying the new cookie.
        window.location.assign(next);
        return;
      }
      setError(result.error ?? 'Sign-in failed.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label htmlFor="username" className={LABEL}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          autoFocus
          className={FIELD}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className={LABEL}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={FIELD}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm font-mono text-black border border-black/20 rounded-lg px-3 py-2 bg-black/[0.03]"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full bg-black text-white font-sans font-bold text-sm px-6 py-3.5 rounded-xl btn-press flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-60"
      >
        {busy ? (
          <>
            Signing in… <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}
