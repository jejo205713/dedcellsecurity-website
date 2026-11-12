import { absoluteUrl, site } from './site';
import type { BlogDoc, GlossaryDoc } from './content';
import { firstImage } from './metadata';

/**
 * JSON-LD builders. One place, so every route type emits consistent structured
 * data, and every node about the company points at the same `@id` - which is
 * how crawlers and AI systems join "the publisher of this post" to "the
 * provider of this course" to "the organization on the homepage".
 */

const ORG_ID = absoluteUrl('/#organization');
const WEBSITE_ID = absoluteUrl('/#website');

const LOGO = {
  '@type': 'ImageObject',
  url: absoluteUrl('/LOGO-whiteeyes-300X300.png'),
  width: 300,
  height: 300,
};

/** A reference to the sitewide Organization node. */
const organizationRef = { '@id': ORG_ID };

/** Compact Organization for places that must stand alone (publisher, provider). */
const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: site.name,
  url: absoluteUrl('/'),
  logo: LOGO,
};

/**
 * Sitewide Organization schema. This is what declares the company logo to
 * Google - favicon links only control the small result icon. Emitted once,
 * from the site layout.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: absoluteUrl('/'),
    logo: LOGO,
    description: site.description,
    email: 'jejo@dedcellsecurity.in',
    sameAs: [
      'https://www.linkedin.com/company/dedcell-security',
      'https://www.instagram.com/dedcell_security/',
      'https://www.youtube.com/@DedcellSecurity',
    ],
  };
}

/** Homepage only. No SearchAction: the site has no search results page. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: absoluteUrl('/'),
    description: site.description,
    inLanguage: 'en-IN',
    publisher: organizationRef,
  };
}

export function webPageSchema(page: {
  path: string;
  name: string;
  description: string;
  /** Pages this one links to as related reading (glossary related terms). */
  related?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': absoluteUrl(page.path),
    url: absoluteUrl(page.path),
    name: page.name,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: organizationRef,
    relatedLink: page.related?.length ? page.related.map((p) => absoluteUrl(p)) : undefined,
  };
}

/** For pages with no visible breadcrumb component of their own. */
export function breadcrumbSchema(trail: Array<{ name: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

const GLOSSARY_SET_ID = absoluteUrl('/glossary#termset');

export function definedTermSchema(term: GlossaryDoc) {
  const url = absoluteUrl(`/glossary/${term.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${url}#term`,
    name: term.title,
    description: term.definition || term.metaDescription,
    url,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': GLOSSARY_SET_ID,
      name: `${site.name} Cybersecurity Glossary`,
      url: absoluteUrl('/glossary'),
    },
  };
}

/** The glossary hub: the set itself, listing every published term. */
export function definedTermSetSchema(terms: GlossaryDoc[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': GLOSSARY_SET_ID,
    name: `${site.name} Cybersecurity Glossary`,
    url: absoluteUrl('/glossary'),
    publisher: organizationRef,
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${absoluteUrl(`/glossary/${t.slug}`)}#term`,
      name: t.title,
      description: t.definition || t.metaDescription,
      url: absoluteUrl(`/glossary/${t.slug}`),
    })),
  };
}

/**
 * A byline like "Dedcell Security Training Team" is a team, not a person -
 * marking it Person would be a false statement in the structured data.
 */
function authorNode(author: string) {
  if (!author) return organizationRef;
  if (/\bteam\b|dedcell/i.test(author)) {
    return { '@type': 'Organization', name: author, parentOrganization: organizationRef };
  }
  return { '@type': 'Person', name: author };
}

export function blogPostingSchema(post: BlogDoc) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = firstImage(post.body);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title.trim(),
    description: post.summary || post.metaDescription,
    url,
    datePublished: post.publishedDate || undefined,
    dateModified: post.updatedDate || post.publishedDate || undefined,
    author: authorNode(post.author),
    publisher: organization,
    image: image ? absoluteUrl(image) : undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-IN',
  };
}

/** The blog hub: a CollectionPage whose main entity is the list of posts. */
export function blogCollectionSchema(posts: BlogDoc[]) {
  const url = absoluteUrl('/blog');
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: `${site.name} Blog`,
    description: 'Cybersecurity articles, research and training updates from Dedcell Security.',
    isPartOf: { '@id': WEBSITE_ID },
    publisher: organizationRef,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/blog/${p.slug}`),
        name: p.title.trim(),
      })),
    },
  };
}

export function courseSchema(course: {
  name: string;
  alternateName: string;
  description: string;
  path: string;
  priceInr: number;
  startDate: string;
  durationWeeks: number;
  hoursPerWeek: number;
  teaches: string[];
  audience: string[];
  financialAid: string;
}) {
  const url = absoluteUrl(course.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${url}#course`,
    name: course.name,
    alternateName: course.alternateName,
    description: course.description,
    url,
    inLanguage: 'en',
    provider: organization,
    teaches: course.teaches,
    audience: course.audience.map((a) => ({ '@type': 'Audience', audienceType: a })),
    financialAidEligible: course.financialAid,
    offers: {
      '@type': 'Offer',
      category: 'Paid',
      price: course.priceInr,
      priceCurrency: 'INR',
      url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      startDate: course.startDate,
      // Google's Course schema: a session length repeated N times.
      courseSchedule: {
        '@type': 'Schedule',
        duration: `PT${course.hoursPerWeek}H`,
        repeatFrequency: 'Weekly',
        repeatCount: course.durationWeeks,
      },
    },
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
