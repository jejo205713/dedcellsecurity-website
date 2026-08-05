/**
 * Single-account authentication for the CMS.
 *
 * There is exactly one publisher account, defined by environment variables.
 * No registration, no password reset, no user table - the attack surface of
 * each of those is the reason they are absent.
 *
 * **Web Crypto only.** This module is imported by middleware.ts, which runs on
 * the Edge runtime where `node:crypto` is unavailable. PBKDF2 and HMAC both
 * exist in Web Crypto, so the same code works in middleware, route handlers and
 * the hashing script.
 *
 * Threat model worth stating plainly: the username is effectively public (it is
 * one fixed value), so the password is the entire secret. That is why the work
 * factor is high, comparisons are constant-time, and failed attempts are rate
 * limited both per-IP and globally.
 */

const encoder = new TextEncoder();

/** OWASP's floor for PBKDF2-HMAC-SHA256 at time of writing. */
export const PBKDF2_ITERATIONS = 600_000;

const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours - one working day, then re-auth.

export const SESSION_COOKIE = 'dedcell_admin_session';

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/**
 * Constant-time comparison. A `===` on a secret leaks its prefix length through
 * timing, which is exactly the signal an attacker needs against a single known
 * account.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // Compare lengths without an early return, then fold the result in.
  let diff = aBytes.length ^ bBytes.length;
  const max = Math.max(aBytes.length, bBytes.length);
  for (let i = 0; i < max; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

/* ------------------------------------------------------------------ */
/* Password hashing                                                    */
/* ------------------------------------------------------------------ */

/**
 * Stored form: `pbkdf2.<iterations>.<salt-b64url>.<hash-b64url>`
 *
 * Dot-separated, not the conventional `$`-separated PHC string. `.env` parsers
 * run dotenv-expand over values, so `$600000` inside a hash is read as a shell
 * variable and silently expands to nothing - the account then looks
 * unconfigured and /keystatic 404s with no useful error. `.` is outside the
 * base64url alphabet, so it separates unambiguously and survives env files,
 * shells and CI secret stores untouched.
 */
export async function hashPassword(
  password: string,
  salt?: Uint8Array,
  iterations = PBKDF2_ITERATIONS,
): Promise<string> {
  const saltBytes = salt ?? crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes as BufferSource, iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return `pbkdf2.${iterations}.${toBase64Url(saltBytes)}.${toBase64Url(bits)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('.');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;

  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1) return false;

  let salt: Uint8Array;
  try {
    salt = fromBase64Url(parts[2]);
  } catch {
    return false;
  }

  const candidate = await hashPassword(password, salt, iterations);
  return timingSafeEqual(candidate, stored);
}

/* ------------------------------------------------------------------ */
/* Sessions                                                            */
/* ------------------------------------------------------------------ */

type SessionPayload = { sub: string; iat: number; exp: number };

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

/**
 * Signed, stateless session token: `<payload-b64url>.<hmac-b64url>`.
 *
 * Stateless on purpose - there is no session store to keep consistent across
 * serverless instances. The cost is that a token cannot be revoked before it
 * expires; rotating AUTH_SECRET invalidates every session at once, which is the
 * intended lever if credentials are ever suspected.
 */
export async function createSessionToken(username: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { sub: username, iat: now, exp: now + SESSION_TTL_SECONDS };
  const encoded = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(encoded));
  return `${encoded}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;

  let valid: boolean;
  try {
    valid = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(secret),
      fromBase64Url(signature) as BufferSource,
      encoder.encode(encoded),
    );
  } catch {
    return null;
  }
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded))) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
