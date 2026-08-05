import { config, collection, fields } from '@keystatic/core';
import { CATEGORY_OPTIONS } from './lib/taxonomy';
import { storage } from './lib/keystatic-storage';

/**
 * Keystatic is the authoring UI only. It reads and writes the same MDX files in
 * content/ that lib/content.ts parses - there is no database and no API between
 * the editor and the site.
 *
 * Every field here exists to stop a non-technical editor from producing content
 * that breaks the SEO plan:
 *   - category is a dropdown, never free text (02-IA-AND-ROUTING.md §4)
 *   - title/description lengths are capped at what Google actually renders
 *   - relatedTerms is a picker over real glossary entries, so it cannot dangle
 *   - draft gates publication, so a half-written page never reaches production
 */

/** Fields every content type shares. Keeps the two collections consistent. */
const seoFields = {
  metaTitle: fields.text({
    label: 'SEO title',
    description:
      'What shows in Google results, complete - the site name is NOT appended to it. Aim for 50-60 characters. Leave blank to use the title above plus "| Dedcell Security".',
    validation: { isRequired: false, length: { max: 60 } },
  }),
  metaDescription: fields.text({
    label: 'SEO description',
    description:
      'The grey summary line under the Google result. 120-155 characters. Write it for a human deciding whether to click.',
    multiline: true,
    validation: { isRequired: true, length: { min: 50, max: 155 } },
  }),
  publishedDate: fields.date({
    label: 'Published date',
    defaultValue: { kind: 'today' },
    validation: { isRequired: true },
  }),
  updatedDate: fields.date({
    label: 'Last updated',
    description:
      'Set this whenever you meaningfully revise the page. It feeds dateModified in structured data.',
  }),
  draft: fields.checkbox({
    label: 'Draft',
    description:
      'Draft pages are visible on preview deployments but are excluded from the live site, the sitemap and search engines.',
    defaultValue: true,
  }),
};

export default config({
  storage,

  ui: {
    brand: { name: 'Dedcell Security' },
    navigation: {
      Content: ['glossary', 'blog'],
    },
  },

  collections: {
    glossary: collection({
      label: 'Glossary',
      slugField: 'title',
      path: 'content/glossary/*',
      format: { contentField: 'content', data: 'yaml' },
      entryLayout: 'content',
      columns: ['title', 'category', 'draft'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            description:
              'Write it as the question people search: "What is SIEM?" - not just "SIEM".',
            validation: { isRequired: true, length: { max: 70 } },
          },
          slug: {
            label: 'URL slug',
            description:
              'The address: /glossary/siem. Lowercase, hyphens only. Once this page is live in Google, NEVER change it.',
            validation: {
              pattern: {
                regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Lowercase letters, numbers and hyphens only.',
              },
            },
          },
        }),

        definition: fields.text({
          label: 'One-sentence definition',
          description:
            'Plain English, no jargon, answers the question completely on its own. This is the sentence Google lifts for the featured snippet, so it must stand alone.',
          multiline: true,
          validation: { isRequired: true, length: { min: 40, max: 300 } },
        }),

        category: fields.select({
          label: 'Category',
          description: 'Pick the single best fit. This drives breadcrumbs and related links.',
          options: CATEGORY_OPTIONS,
          defaultValue: 'web-application-security',
        }),

        relatedTerms: fields.multiRelationship({
          label: 'Related terms',
          description:
            'Other glossary entries a reader would want next. 3-6 is the sweet spot. Only published terms appear here.',
          collection: 'glossary',
          validation: { length: { max: 8 } },
        }),

        ...seoFields,

        content: fields.mdx({
          label: 'Body',
          description:
            'Type [[siem]] to link another glossary term inline - only the first mention on the page becomes a link, which is what we want.',
          extension: 'mdx',
          options: {
            image: {
              directory: 'public/images/glossary',
              publicPath: '/images/glossary/',
            },
          },
        }),
      },
    }),

    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'content/blog/*',
      format: { contentField: 'content', data: 'yaml' },
      entryLayout: 'content',
      columns: ['title', 'category', 'publishedDate', 'draft'],
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true, length: { max: 90 } },
          },
          slug: {
            label: 'URL slug',
            description:
              'The address: /blog/your-slug. Lowercase, hyphens only. Never change it after publishing.',
            validation: {
              pattern: {
                regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Lowercase letters, numbers and hyphens only.',
              },
            },
          },
        }),

        summary: fields.text({
          label: 'Summary',
          description: 'One or two sentences shown on the blog index and in RSS.',
          multiline: true,
          validation: { isRequired: true, length: { min: 40, max: 300 } },
        }),

        category: fields.select({
          label: 'Category',
          options: CATEGORY_OPTIONS,
          defaultValue: 'web-application-security',
        }),

        author: fields.text({
          label: 'Author',
          description: 'Full name as it should appear on the byline.',
          validation: { isRequired: true },
        }),

        relatedTerms: fields.multiRelationship({
          label: 'Related glossary terms',
          description: 'Shown as a "related terms" block at the end of the post.',
          collection: 'glossary',
          validation: { length: { max: 8 } },
        }),

        ...seoFields,

        content: fields.mdx({
          label: 'Body',
          description:
            'Type [[siem]] to link a glossary term inline. Aim for 3-8 in-body links to other pages on the site.',
          extension: 'mdx',
          options: {
            image: {
              directory: 'public/images/blog',
              publicPath: '/images/blog/',
            },
          },
        }),
      },
    }),
  },
});
