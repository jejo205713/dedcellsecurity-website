import Link from 'next/link';
import { absoluteUrl } from '@/lib/site';

export type Crumb = { name: string; href: string };

/**
 * Renders the visible trail and the matching BreadcrumbList JSON-LD from one
 * source, so the two can never disagree (a common cause of rich-result warnings).
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs uppercase tracking-widest text-gray-600"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {trail.map((c, i) => (
            <li key={c.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === trail.length - 1 ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <Link href={c.href} className="hover:text-black">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
