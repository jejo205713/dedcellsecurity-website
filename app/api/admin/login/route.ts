import { NextResponse } from 'next/server';
import { getClientIp } from '@/lib/client-ip';
import {
  ADMIN_PASSWORD_HASH,
  ADMIN_USERNAME,
  AUTH_SECRET,
  authConfigured,
  authDisabledReason,
} from '@/lib/auth-config';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  timingSafeEqual,
  verifyPassword,
} from '@/lib/auth';

/**
 * Sign-in for the single publisher account.
 *
 * Node runtime, not Edge: the in-memory throttle only means anything on a warm
 * instance, and PBKDF2 at 600k iterations is CPU-heavy enough that Edge limits
 * are a real risk.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* --------------------------------------------------------------- */
/* Brute-force protection                                           */
/* --------------------------------------------------------------- */

/**
 * There is one account and its username is effectively public, so every guess
 * is aimed at the same target. Two limits, both required:
 *
 *   per-IP    stops a single host hammering the endpoint
 *   global    stops a distributed spray, which a per-IP limit cannot see
 *
 * Best-effort, per-instance. It raises the cost of an online attack; the
 * password's work factor is what actually protects the account.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_GLOBAL = 30;
const MAX_TRACKED_IPS = 10_000;

const perIp = new Map<string, number[]>();
let globalAttempts: number[] = [];

function recentOnly(times: number[], now: number) {
  return times.filter((t) => now - t < WINDOW_MS);
}

function throttled(ip: string): { blocked: boolean; retryAfter: number } {
  const now = Date.now();
  if (perIp.size > MAX_TRACKED_IPS) perIp.clear();

  const ipHits = recentOnly(perIp.get(ip) ?? [], now);
  globalAttempts = recentOnly(globalAttempts, now);

  if (ipHits.length >= MAX_PER_IP) {
    return { blocked: true, retryAfter: Math.ceil((WINDOW_MS - (now - ipHits[0])) / 1000) };
  }
  if (globalAttempts.length >= MAX_GLOBAL) {
    return {
      blocked: true,
      retryAfter: Math.ceil((WINDOW_MS - (now - globalAttempts[0])) / 1000),
    };
  }
  return { blocked: false, retryAfter: 0 };
}

function recordFailure(ip: string) {
  const now = Date.now();
  perIp.set(ip, [...recentOnly(perIp.get(ip) ?? [], now), now]);
  globalAttempts = [...recentOnly(globalAttempts, now), now];
}

function clearFailures(ip: string) {
  perIp.delete(ip);
}

/* --------------------------------------------------------------- */

export async function POST(request: Request) {
  if (!authConfigured) {
    console.error(`[auth] login attempted but no account configured - ${authDisabledReason()}`);
    return NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 });
  }

  // Same-origin check. The session cookie is SameSite=Lax, which already blocks
  // cross-site form posts in current browsers; this is the belt to that braces.
  const origin = request.headers.get('origin');
  if (origin) {
    const host = request.headers.get('host');
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }
  }

  const ip = getClientIp(request);
  const limit = throttled(ip);
  if (limit.blocked) {
    return NextResponse.json(
      { error: 'Too many sign-in attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const username = typeof body.username === 'string' ? body.username : '';
  const password = typeof body.password === 'string' ? body.password : '';

  // Always run the KDF, even when the username is wrong. Returning early on a
  // bad username makes the response measurably faster and turns this endpoint
  // into a username oracle.
  const passwordOk = await verifyPassword(password, ADMIN_PASSWORD_HASH!);
  const usernameOk = timingSafeEqual(username, ADMIN_USERNAME!);

  if (!usernameOk || !passwordOk) {
    recordFailure(ip);
    // One message for both failure modes - never say which was wrong.
    return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
  }

  clearFailures(ip);

  const response = NextResponse.json({ success: true });
  // Carries a Set-Cookie; make sure no cache anywhere retains it.
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.cookies.set(SESSION_COOKIE, await createSessionToken(username, AUTH_SECRET!), {
    httpOnly: true, // unreadable by JS, so XSS cannot lift the session
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // survives the post-login redirect; blocks cross-site sends
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
