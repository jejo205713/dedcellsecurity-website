import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Clears the session cookie.
 *
 * Sessions are stateless signed tokens, so this only removes the browser's
 * copy — it cannot invalidate a token already captured elsewhere. To revoke
 * everything at once, rotate AUTH_SECRET.
 */
export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
