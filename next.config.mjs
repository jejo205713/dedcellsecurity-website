/**
 * Security headers.
 *
 * Honest note on CSP: Next.js App Router inlines the RSC payload as a <script>
 * on every statically prerendered page, so a nonce-based policy is impossible
 * without making every page dynamic. `script-src 'unsafe-inline'` is therefore
 * unavoidable here, which means **CSP is not our XSS control** - sanitising
 * author content at render time is (see lib/mdx/render.ts). What CSP does buy
 * us: no framing, no plugins, no base-tag hijack, no form exfiltration.
 */
const isDev = process.env.NODE_ENV === 'development';

/**
 * `next dev` compiles every module wrapped in `eval()` (webpack's
 * eval-source-map devtool) - the Keystatic page chunk alone contains ~1,138
 * calls. A `script-src` without `'unsafe-eval'` therefore blocks **all**
 * client-side JavaScript in development: no navbar scroll effect, no contact
 * form, and a completely blank /keystatic.
 *
 * That is exactly what happened, and it is a nasty failure mode because the
 * server still returns 200 with a full HTML document - nothing looks wrong
 * until you open the console.
 *
 * `'unsafe-eval'` is therefore allowed in development only. Production builds
 * do not use eval, so the deployed policy stays strict.
 */
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      // Keystatic's editor spawns web workers from blob URLs.
      "worker-src 'self' blob:",
      // GitHub API for the CMS; ws: is the dev-server hot-reload socket.
      isDev
        ? "connect-src 'self' ws: wss: https://api.github.com"
        : "connect-src 'self' https://api.github.com",
      "frame-ancestors 'none'",
      "form-action 'self' https://github.com",
      "base-uri 'self'",
      "object-src 'none'",
      // Skipped in dev: it would rewrite http://localhost asset URLs to https.
      ...(isDev ? [] : ['upgrade-insecure-requests']),
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
  // Next 16 writes AGENTS.md and CLAUDE.md into the project root on dev start.
  // We manage our own docs (PUBLISHING.md, MIGRATION.md, DESIGN_SPEC.md); files
  // that reappear on every `next dev` would land in the repo unreviewed.
  agentRules: false,
  trailingSlash: false,
  // Don't advertise the framework version to scanners.
  poweredByHeader: false,
  /**
   * The Keystatic UI reads content files at *runtime* in local-storage mode.
   * Next's file tracing only sees files imported by code, so without this the
   * deployed function has no content/ directory and the CMS opens empty.
   */
  outputFileTracingIncludes: {
    '/api/keystatic/[[...params]]': ['./content/**/*', './public/images/**/*'],
    '/keystatic/[[...params]]': ['./content/**/*'],
  },
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
