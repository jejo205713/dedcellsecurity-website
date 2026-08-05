import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { getBlogPosts, getGlossaryTerms } from '@/lib/content';

/**
 * Generated from the content layer, so it can never go stale the way the
 * hand-maintained public/sitemap.xml on the current site does (01-AUDIT.md §2.5).
 * Drafts are already filtered out by lib/content.ts in production.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Priorities mirror the hand-maintained public/sitemap.xml they replace.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, priority: 1 },
    { url: absoluteUrl('/services'), lastModified: now, priority: 0.8 },
    { url: absoluteUrl('/contact'), lastModified: now, priority: 0.8 },
    { url: absoluteUrl('/glossary'), lastModified: now, priority: 0.8 },
    { url: absoluteUrl('/blog'), lastModified: now, priority: 0.8 },
    { url: absoluteUrl('/about'), lastModified: now, priority: 0.6 },
    { url: absoluteUrl('/disclosure'), lastModified: now, priority: 0.4 },
    { url: absoluteUrl('/privacy'), lastModified: now, priority: 0.3 },
    { url: absoluteUrl('/terms'), lastModified: now, priority: 0.3 },
  ];

  const glossary: MetadataRoute.Sitemap = getGlossaryTerms().map((t) => ({
    url: absoluteUrl(`/glossary/${t.slug}`),
    lastModified: t.updatedDate || t.publishedDate || undefined,
    priority: 0.6,
  }));

  const blog: MetadataRoute.Sitemap = getBlogPosts().map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: p.updatedDate || p.publishedDate || undefined,
    priority: 0.6,
  }));

  return [...staticRoutes, ...glossary, ...blog];
}
