import { NextResponse } from 'next/server';

/**
 * Contact form proxy. Ported from dedcell-security/api/contact.js with the
 * behaviour unchanged — it was already doing the right things:
 *
 *   1. Per-IP rate limiting (Apps Script's doPost cannot see the caller's IP).
 *   2. Server-side validation, because client-side checks are trivially bypassed.
 *   3. Formula/CSV injection sanitisation before anything reaches the Sheet.
 *   4. Keeping the Apps Script URL server-side, so the write+email endpoint is
 *      not sitting in the page source for anyone to hammer.
 *
 * Node runtime, not Edge: the in-memory rate-limit Map needs a warm instance to
 * mean anything, and Edge gives no such guarantee.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MS = 60 * 60 * 1000; // 1 hour sliding window
const MAX_PER_WINDOW = 5; // submissions per IP per window
const MIN_INTERVAL_MS = 20 * 1000; // min gap between two submissions from one IP
const MAX_TRACKED_IPS = 20_000; // memory guard for the in-memory store

/**
 * In-memory per-IP store. Fluid Compute reuses warm instances, so this persists
 * across requests and stops naive floods. It is best-effort — not shared across
 * concurrent instances — which is why the Apps Script keeps a durable global cap
 * as a backstop (contact-form-apps-script.gs). For strict cross-instance limits,
 * swap this Map for Vercel KV / Upstash Redis.
 */
const hits = new Map<string, number[]>();

function getIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function rateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  if (hits.size > MAX_TRACKED_IPS) hits.clear(); // crude flush to bound memory

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) };
  }
  const last = recent[recent.length - 1];
  if (last !== undefined && now - last < MIN_INTERVAL_MS) {
    return { ok: false, retryAfter: Math.ceil((MIN_INTERVAL_MS - (now - last)) / 1000) };
  }
  recent.push(now);
  hits.set(ip, recent);
  return { ok: true };
}

/**
 * Neutralise spreadsheet formula / CSV injection: a value a spreadsheet would
 * evaluate as a formula gets a leading apostrophe so it renders as literal text.
 */
function deFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function clean(value: unknown, max: number): string {
  return deFormula(String(value ?? '').trim().slice(0, max));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  // Honeypot: real users never fill "botcheck"; bots do. Report success, drop it.
  if (body.botcheck) return NextResponse.json({ success: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 150);
  const company = clean(body.company, 100);
  const phone = clean(body.phone, 40);
  const message = clean(body.message, 5000);

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json(
      { success: false, error: 'Please fill out all required fields correctly.' },
      { status: 400 },
    );
  }

  const limit = rateLimit(getIp(request));
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    console.error('[contact] APPS_SCRIPT_URL is not set');
    return NextResponse.json(
      { success: false, error: 'Server not configured.' },
      { status: 500 },
    );
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name, email, company, phone, message }).toString(),
    });
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    // Don't leak upstream details to the client.
    console.error('[contact] forward failed:', err);
    return NextResponse.json(
      { success: false, error: 'Delivery failed. Please email jejo@dedcellsecurity.in.' },
      { status: 502 },
    );
  }
}
