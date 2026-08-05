import type { MetadataRoute } from 'next';
import { isIndexable } from '@/lib/env';
import { absoluteUrl, site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Anything not positively identified as the live production deployment is
  // disallowed, so a preview or staging URL can never compete with the real one.
  // See lib/env.ts - this deliberately fails closed.
  if (!isIndexable) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The CMS and its API are tools, not content.
      disallow: ['/keystatic', '/api/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: site.url,
  };
}
