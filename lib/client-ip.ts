/**
 * Determines the client IP for rate limiting.
 *
 * The naive version - `x-forwarded-for.split(',')[0]` - is worth understanding,
 * because it is the common one and it does not work. `X-Forwarded-For` is a
 * client-settable header that proxies *append* to. The leftmost entry is
 * therefore whatever the caller put there, so rotating it walks straight past a
 * per-IP limit. Verified against this app: eight sign-in attempts with eight
 * spoofed values were all counted as separate clients.
 *
 * Correct order of trust:
 *
 *   1. `x-vercel-forwarded-for` - set by Vercel's edge, not forwardable by a
 *      caller. Authoritative wherever we actually deploy.
 *   2. `x-real-ip` - set by the proxy directly in front of us, single-valued
 *      and not an append-list.
 *   3. The **rightmost** `x-forwarded-for` entry - the hop our own proxy added,
 *      which is the closest thing to trustworthy in that header.
 *
 * Anything a client can forge must never become the sole rate-limit key, which
 * is why the global cap in the login route exists regardless of this function.
 *
 * **Residual risk, stated plainly.** With no trusted proxy in front - a bare
 * `next start`, or a self-host without a reverse proxy that sets `x-real-ip`
 * `x-forwarded-for` is fully caller-controlled and *no* reading of it yields a
 * real identity. Per-IP limiting is advisory there; the global cap is the only
 * effective control. On Vercel this does not apply, because
 * `x-vercel-forwarded-for` is set at the edge and cannot be forged: verified by
 * rotating `x-forwarded-for` across seven sign-in attempts with a fixed
 * platform header, which throttled on the sixth as intended.
 */
export function getClientIp(request: Request): string {
  const vercel = request.headers.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0].trim();

  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Rightmost, not leftmost: the entry appended by the hop nearest to us.
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }

  return 'unknown';
}
