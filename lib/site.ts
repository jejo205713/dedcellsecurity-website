/**
 * Single source of truth for brand + URL config.
 * Everything that emits an absolute URL (metadata, canonical, sitemap, JSON-LD)
 * reads from here so there is exactly one place to change the domain.
 */
export const site = {
  name: 'Dedcell Security',
  shortName: 'Dedcell',
  // Vercel sets VERCEL_URL on preview deployments; production pins to the apex domain.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_ENV === 'production'
      ? 'https://dedcellsecurity.in'
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'),
  description:
    'Offensive security and penetration testing for startups — VAPT, web, API, cloud and mobile assessments.',
  locale: 'en_IN',
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
