import type { Metadata } from 'next';
import { LoginForm } from './login-form';

/** A sign-in page is never a search result. */
export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;

  /**
   * Only ever redirect to a path on this site. Passing an attacker-supplied
   * absolute URL straight into a redirect is the classic open-redirect bug, and
   * it is worth more than usual next to a login form — it turns our own domain
   * into a credible launchpad for a phishing page.
   */
  const safeNext = next && /^\/(?!\/)/.test(next) ? next : '/keystatic';

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LOGO-whiteeyes-300X300.png"
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border border-black/10"
          />
          <span className="font-sans font-semibold text-sm text-black tracking-wide">
            DEDCELL <span className="text-gray-500 font-normal">SECURITY</span>
          </span>
        </div>

        <p className="eyebrow">Publisher access</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-black">Sign in</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          This area manages the site&rsquo;s blog and glossary. It is not for clients.
        </p>

        <LoginForm next={safeNext} />

        <p className="mt-10 font-mono text-[10px] uppercase tracking-widest text-gray-600">
          Attempts are rate limited and logged.
        </p>
      </div>
    </main>
  );
}
