// Vercel Serverless Function — contact form proxy for dedcellsecurity.in
//
// This sits between the browser and the Google Apps Script web app and adds the
// three things a pure-static site + Apps Script cannot do on their own:
//   1. Per-IP rate limiting (Apps Script's doPost cannot see the caller's IP).
//   2. Server-side validation (client-side checks are trivially bypassed).
//   3. Formula / CSV injection sanitization before anything reaches the Sheet.
// It also keeps the Apps Script URL server-side (env var) so the write+email
// endpoint is no longer sitting in the page source for anyone to hammer.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour sliding window
const MAX_PER_WINDOW = 5; // max submissions per IP per window
const MIN_INTERVAL_MS = 20 * 1000; // min gap between two submissions from one IP
const MAX_TRACKED_IPS = 20000; // memory guard for the in-memory store

// In-memory per-IP store. Fluid Compute reuses warm instances, so this persists
// across requests and stops naive floods. It is best-effort — not shared across
// concurrent instances — which is why the Apps Script keeps a durable global cap
// as a backstop (see contact-form-apps-script.gs). If you ever need strict
// cross-instance limits, swap this Map for Vercel KV / Upstash Redis.
const hits = new Map(); // ip -> number[] of timestamps

function getIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
  return req.headers['x-real-ip'] || 'unknown';
}

function rateLimit(ip) {
  const now = Date.now();
  if (hits.size > MAX_TRACKED_IPS) hits.clear(); // crude flush to bound memory
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - arr[0])) / 1000) };
  }
  if (arr.length && now - arr[arr.length - 1] < MIN_INTERVAL_MS) {
    return { ok: false, retryAfter: Math.ceil((MIN_INTERVAL_MS - (now - arr[arr.length - 1])) / 1000) };
  }
  arr.push(now);
  hits.set(ip, arr);
  return { ok: true };
}

// Neutralize spreadsheet formula / CSV injection: a value a spreadsheet would
// treat as a formula gets a leading apostrophe so it renders as literal text.
function deFormula(s) {
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function clean(v, max) {
  return deFormula(String(v == null ? '' : v).trim().slice(0, max));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const body = await readBody(req);

  // Honeypot: real users never fill "botcheck"; bots do. Pretend success, drop.
  if (body.botcheck) return res.status(200).json({ success: true });

  const name = clean(body.name, 100);
  const email = clean(body.email, 150);
  const company = clean(body.company, 100);
  const phone = clean(body.phone, 40);
  const message = clean(body.message, 5000);

  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return res.status(400).json({ success: false, error: 'Please fill out all required fields correctly.' });
  }

  const ip = getIp(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ success: false, error: 'Too many requests. Please try again in a few minutes.' });
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    console.error('APPS_SCRIPT_URL is not set');
    return res.status(500).json({ success: false, error: 'Server not configured.' });
  }

  try {
    const params = new URLSearchParams({ name, email, company, phone, message });
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    if (!upstream.ok) throw new Error('upstream ' + upstream.status);
    return res.status(200).json({ success: true });
  } catch (err) {
    // Don't leak upstream details to the client.
    console.error('contact forward failed:', err);
    return res.status(502).json({ success: false, error: 'Delivery failed. Please email dedcellsec@gmail.com.' });
  }
};

// Exposed for unit testing; ignored by Vercel (it only uses the default export).
module.exports._internals = { rateLimit, deFormula, clean, getIp, EMAIL_RE, hits };
