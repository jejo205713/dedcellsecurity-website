/**
 * Security headers.
 *
 * Honest note on CSP: Next.js App Router inlines the RSC payload as a <script>
 * on every statically prerendered page, so a nonce-based policy is impossible
 * without making every page dynamic. `script-src 'unsafe-inline'` is therefore
 * unavoidable here, which means **CSP is not our XSS control** — sanitising
 * author content at render time is (see lib/mdx/render.ts). What CSP does buy
 * us: no framing, no plugins, no base-tag hijack, no form exfiltration.
 */
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.github.com",
      "frame-ancestors 'none'",
      "form-action 'self' https://github.com",
      "base-uri 'self'",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // Don't advertise the framework version to scanners.
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Editor uploads land in public/images/**. SVG is executable in an <img>
    // context, so it stays off even though Next disables it by default.
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
