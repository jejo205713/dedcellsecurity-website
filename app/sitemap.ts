import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { getBlogPosts, getGlossaryTerms } from '@/lib/content';
import { programme } from '@/lib/caapt';

/**
 * Generated from the content layer, so it can never go stale the way the
 * hand-maintained public/sitemap.xml on the current site does (01-AUDIT.md §2.5).
 * Drafts are already filtered out by lib/content.ts in production.
 */
/** Latest of a set of ISO dates, or undefined. */
function latest(dates: Array<string | undefined>): string | undefined {
  return dates.filter((d): d is string => Boolean(d)).sort().at(-1);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const glossaryTerms = getGlossaryTerms();
  const posts = getBlogPosts();

  const glossary: MetadataRoute.Sitemap = glossaryTerms.map((t) => ({
    url: absoluteUrl(`/glossary/${t.slug}`),
    lastModified: t.updatedDate || t.publishedDate || undefined,
    priority: 0.6,
  }));

  const blog: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: p.updatedDate || p.publishedDate || undefined,
    priority: 0.6,
  }));

  /*
   * lastmod is only stated where it is actually known. Stamping every static
   * page with the build time (the previous behaviour) tells crawlers that all
   * of them changed on every deploy, which teaches them to ignore lastmod.
   * The hubs change when their newest entry does.
   */
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), priority: 1 },
    { url: absoluteUrl('/services'), priority: 0.8 },
    { url: absoluteUrl('/caapt'), lastModified: programme.pageUpdated, priority: 0.9 },
    { url: absoluteUrl('/contact'), priority: 0.8 },
    {
      url: absoluteUrl('/glossary'),
      lastModified: latest(glossaryTerms.map((t) => t.updatedDate || t.publishedDate)),
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified: latest(posts.map((p) => p.updatedDate || p.publishedDate)),
      priority: 0.8,
    },
    { url: absoluteUrl('/about'), priority: 0.6 },
    { url: absoluteUrl('/disclosure'), priority: 0.4 },
    { url: absoluteUrl('/privacy'), priority: 0.3 },
    { url: absoluteUrl('/terms'), priority: 0.3 },
  ];

  return [...staticRoutes, ...blog, ...glossary];
}
