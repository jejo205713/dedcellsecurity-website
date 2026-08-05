import { absoluteUrl, site } from './site';
import type { BlogDoc, GlossaryDoc } from './content';

/** JSON-LD builders. One place, so every route type emits consistent structured data. */

const organization = {
  '@type': 'Organization',
  name: site.name,
  url: site.url,
};

/**
 * Sitewide Organization schema. This is what declares the company logo to
 * Google - favicon links only control the small result icon.
 *
 * Ported from the inline block in dedcell-security/public/index.html:34-50,
 * which the page port did not carry over because it lived in <head>, not in a
 * page template. Emitted once, from the root layout.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/LOGO-whiteeyes-300X300.png'),
      width: 300,
      height: 300,
    },
    description: site.description,
    email: 'jejo@dedcellsecurity.in',
    sameAs: [
      'https://www.linkedin.com/company/dedcell-security',
      'https://www.instagram.com/dedcell_security/',
    ],
  };
}

export function definedTermSchema(term: GlossaryDoc) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': absoluteUrl(`/glossary/${term.slug}`),
    name: term.title,
    description: term.definition || term.metaDescription,
    url: absoluteUrl(`/glossary/${term.slug}`),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: `${site.name} Glossary`,
      url: absoluteUrl('/glossary'),
    },
  };
}

export function blogPostingSchema(post: BlogDoc) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': absoluteUrl(`/blog/${post.slug}`),
    headline: post.title,
    description: post.summary || post.metaDescription,
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.publishedDate || undefined,
    dateModified: post.updatedDate || post.publishedDate || undefined,
    author: post.author ? { '@type': 'Person', name: post.author } : organization,
    publisher: organization,
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function itemListSchema(
  items: Array<{ name: string; url: string }>,
  name: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}
