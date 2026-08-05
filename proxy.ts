import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_SECRET, authConfigured } from '@/lib/auth-config';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

/**
 * The authorization gate for the CMS.
 *
 * Named `proxy` because Next.js 16 renamed the middleware convention; the
 * behaviour is identical to the old middleware.ts.
 *
 * Every request to /keystatic and /api/keystatic passes through here before it
 * reaches any handler. This matters more than it might look: Keystatic's own
 * API has **no authentication of its own** in local-storage mode — it hands
 * requests straight to the filesystem. Without this middleware, knowing the URL
 * is the same as having write access.
 *
 * Deliberately fails closed. If the account is not configured, the admin does
 * not exist — it 404s rather than falling open to an unauthenticated CMS.
 *
 * Runs on the Edge runtime, so everything it imports must be Web Crypto only
 * (see lib/auth.ts).
 */

const PROTECTED = ['/keystatic', '/api/keystatic'];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // No environment exemption, deliberately. An earlier version skipped this gate
  // in `next dev` so developers would not need credentials locally — but that
  // means the auth path is never the path anyone actually exercises, and a
  // regression in it would only surface in production. Signing in at
  // /admin/login is now the single way into the CMS, everywhere.

  // No account configured => the admin is not deployed. Do not hint that it exists.
  if (!authConfigured) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'x-robots-tag': 'noindex, nofollow' },
    });
  }

  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
    AUTH_SECRET!,
  );

  if (session) return NextResponse.next();

  // API calls get a status code; a redirect would hand the Keystatic client an
  // HTML login page where it expects JSON, and it would fail unintelligibly.
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const login = new URL('/admin/login', request.url);
  // Round-trip the original path so the editor lands where they were going.
  login.searchParams.set('next', pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/keystatic/:path*', '/api/keystatic/:path*'],
};
