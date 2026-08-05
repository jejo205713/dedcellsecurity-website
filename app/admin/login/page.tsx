import type { Metadata } from 'next';
import { LoginForm } from './login-form';

/** A sign-in page is never a search result. */
export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

const FALLBACK = '/keystatic';

/**
 * Reduce `?next=` to a path on this site, or discard it.
 *
 * Open redirects matter more than usual beside a sign-in form: an attacker who
 * can bounce a victim off our own domain gets to borrow its credibility for a
 * phishing page, and the URL the victim inspects really does start with
 * dedcellsecurity.in.
 *
 * A previous version only rejected a leading `//`, which missed `/\evil.com`.
 * **Browsers normalise backslashes to forward slashes in URLs**, so that string
 * navigates to `//evil.com` - a protocol-relative URL pointing off-site. Any
 * backslash is now rejected outright, along with control characters (CR/LF
 * smuggling) and anything that fails to resolve back to this origin.
 */
function safeNextPath(next: string | undefined): string {
  if (!next) return FALLBACK;
  // Backslashes and control characters have no legitimate place in a path here.
  if (/[\\\u0000-\u001F\u007F]/.test(next)) return FALLBACK;
  if (!next.startsWith('/') || next.startsWith('//')) return FALLBACK;

  try {
    // Resolving against a throwaway origin: anything that escapes it is hostile.
    const base = 'https://internal.invalid';
    const resolved = new URL(next, base);
    if (resolved.origin !== base) return FALLBACK;

    // Re-check the *normalised* path, not just the input. `/..//evil.com`
    // survives the checks above but URL resolution collapses it to
    // `//evil.com` - protocol-relative, and off-site the moment a browser
    // navigates to it. Validating only the input misses this entirely.
    const path = resolved.pathname;
    if (!path.startsWith('/') || path.startsWith('//')) return FALLBACK;

    return path + resolved.search;
  } catch {
    return FALLBACK;
  }
}

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;

  const safeNext = safeNextPath(next);

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
