import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { showDrafts } from './env';
import { isCategorySlug } from './taxonomy';

/**
 * The content layer. Single source of truth for every route, the sitemap and RSS
 * (docs/seo/07-IMPLEMENTATION-PLAN.md §3).
 *
 * Deliberately independent of Keystatic: Keystatic is only an authoring UI that
 * writes these files. If we ever drop the CMS, every page still builds. The
 * contract between them is the frontmatter shape below, nothing more.
 */

const CONTENT_ROOT = path.join(process.cwd(), 'content');

/** Drafts render in dev and on Vercel previews, never in production. See lib/env.ts. */
const SHOW_DRAFTS = showDrafts;

export type ContentType = 'glossary' | 'blog';

type BaseDoc = {
  slug: string;
  title: string;
  category: string;
  metaTitle?: string;
  metaDescription: string;
  publishedDate: string;
  updatedDate?: string;
  draft: boolean;
  body: string;
  readingMinutes: number;
  headings: Heading[];
};

export type GlossaryDoc = BaseDoc & {
  type: 'glossary';
  /** One-sentence plain-English answer - the featured-snippet target. */
  definition: string;
  relatedTerms: string[];
};

export type BlogDoc = BaseDoc & {
  type: 'blog';
  summary: string;
  author: string;
  relatedTerms: string[];
};

export type Doc = GlossaryDoc | BlogDoc;

export type Heading = { depth: number; text: string; id: string };

/* ------------------------------------------------------------------ */
/* File discovery                                                      */
/* ------------------------------------------------------------------ */

/**
 * Accepts both layouts Keystatic can produce, so the loader survives a change
 * to the collection `path` glob:
 *   content/blog/my-post.mdx
 *   content/blog/my-post/index.mdx
 */
function listEntryFiles(type: ContentType): Array<{ slug: string; file: string }> {
  const dir = path.join(CONTENT_ROOT, type);
  if (!fs.existsSync(dir)) return [];

  const out: Array<{ slug: string; file: string }> = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
      out.push({
        slug: entry.name.replace(/\.mdx?$/, ''),
        file: path.join(dir, entry.name),
      });
    } else if (entry.isDirectory()) {
      const nested = ['index.mdx', 'index.md']
        .map((n) => path.join(dir, entry.name, n))
        .find((p) => fs.existsSync(p));
      if (nested) out.push({ slug: entry.name, file: nested });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
}

/** ~225 wpm, the usual reading-time constant. */
function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

/**
 * Pull h2/h3 for the table of contents. IDs are generated with github-slugger,
 * the same algorithm rehype-slug uses, so TOC anchors match the rendered ids.
 * Fenced code blocks are stripped first so `# comments` inside them are ignored.
 *
 * H1s are read too, because pasted articles routinely carry their own `# Title`.
 * They are treated as H2 to match what the renderer does with them
 * (lib/mdx/remark-normalize-paste.ts), and a leading H1 that merely repeats the
 * page title is skipped - the renderer drops that one entirely.
 */
function extractHeadings(body: string, title: string): Heading[] {
  const withoutCode = body.replace(/^```[\s\S]*?^```/gm, '');
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  let seenAny = false;

  for (const line of withoutCode.split('\n')) {
    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, '').trim();
    const depth = m[1].length;

    if (depth === 1 && !seenAny && norm(text) === norm(title)) {
      seenAny = true;
      continue;
    }
    seenAny = true;
    headings.push({ depth: Math.max(2, depth), text, id: slugger.slug(text) });
  }
  return headings;
}

function parseDoc(type: ContentType, slug: string, file: string): Doc | null {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);

  const title = str(data.title).trim();
  if (!title) {
    // A file with no title is malformed; skip rather than emit a broken page.
    console.warn(`[content] skipping ${file}: missing "title"`);
    return null;
  }

  const category = str(data.category);
  if (category && !isCategorySlug(category)) {
    console.warn(`[content] ${file}: unknown category "${category}" - not in lib/taxonomy.ts`);
  }

  const base: BaseDoc = {
    slug,
    title,
    category,
    metaTitle: str(data.metaTitle) || undefined,
    metaDescription: str(data.metaDescription),
    publishedDate: str(data.publishedDate),
    updatedDate: str(data.updatedDate) || undefined,
    draft: data.draft === true,
    body: content,
    readingMinutes: readingMinutes(content),
    headings: extractHeadings(content, title),
  };

  if (type === 'glossary') {
    return {
      ...base,
      type: 'glossary',
      definition: str(data.definition),
      relatedTerms: strArray(data.relatedTerms),
    };
  }

  return {
    ...base,
    type: 'blog',
    summary: str(data.summary),
    author: str(data.author),
    relatedTerms: strArray(data.relatedTerms),
  };
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

function loadAll(type: ContentType): Doc[] {
  return listEntryFiles(type)
    .map(({ slug, file }) => parseDoc(type, slug, file))
    .filter((d): d is Doc => d !== null)
    .filter((d) => SHOW_DRAFTS || !d.draft);
}

// Cache per module instance. Content is read from disk at build time and never
// changes within a build, so re-globbing on every route render is pure waste.
const cache = new Map<ContentType, Doc[]>();

function all(type: ContentType): Doc[] {
  let docs = cache.get(type);
  if (!docs) {
    docs = loadAll(type);
    cache.set(type, docs);
  }
  return docs;
}

export function getGlossaryTerms(): GlossaryDoc[] {
  return (all('glossary') as GlossaryDoc[]).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

export function getBlogPosts(): BlogDoc[] {
  return (all('blog') as BlogDoc[]).sort((a, b) =>
    (b.publishedDate ?? '').localeCompare(a.publishedDate ?? ''),
  );
}

/**
 * Every blog post on disk, drafts included and uncached.
 *
 * For the admin listing only. Site routes must keep using `getBlogPosts()`,
 * which applies the draft filter - a draft reaching a public route is the exact
 * failure the flag exists to prevent. Uncached because the admin is the one
 * place that must not serve a list it built before the last edit.
 */
export function getBlogPostsForAdmin(): BlogDoc[] {
  return listEntryFiles('blog')
    .map(({ slug, file }) => parseDoc('blog', slug, file))
    .filter((d): d is BlogDoc => d !== null)
    .sort((a, b) => (b.publishedDate ?? '').localeCompare(a.publishedDate ?? ''));
}

export function getGlossaryTerm(slug: string): GlossaryDoc | undefined {
  return getGlossaryTerms().find((d) => d.slug === slug);
}

export function getBlogPost(slug: string): BlogDoc | undefined {
  return getBlogPosts().find((d) => d.slug === slug);
}

/** Every glossary slug that exists - drives the [[term]] link resolver. */
export function glossarySlugs(): Set<string> {
  return new Set(getGlossaryTerms().map((t) => t.slug));
}

/**
 * Related terms for a doc: explicit `relatedTerms` first (author intent wins),
 * then same-category terms as filler, so no page is ever a dead end
 * (docs/seo/05-INTERNAL-LINKING.md).
 */
export function getRelatedTerms(doc: Doc, limit = 6): GlossaryDoc[] {
  const terms = getGlossaryTerms();
  const picked: GlossaryDoc[] = [];
  const seen = new Set<string>([doc.slug]);

  for (const slug of doc.relatedTerms) {
    const t = terms.find((x) => x.slug === slug);
    if (t && !seen.has(t.slug)) {
      picked.push(t);
      seen.add(t.slug);
    }
  }

  if (picked.length < limit && doc.category) {
    for (const t of terms) {
      if (picked.length >= limit) break;
      if (t.category === doc.category && !seen.has(t.slug)) {
        picked.push(t);
        seen.add(t.slug);
      }
    }
  }

  return picked.slice(0, limit);
}

/** Group glossary terms by first letter, for the A - Z hub. */
export function groupByLetter(terms: GlossaryDoc[]): Array<[string, GlossaryDoc[]]> {
  const groups = new Map<string, GlossaryDoc[]>();
  for (const t of terms) {
    const first = t.slug[0]?.toUpperCase() ?? '#';
    const key = /[A-Z]/.test(first) ? first : '#';
    const bucket = groups.get(key);
    if (bucket) bucket.push(t);
    else groups.set(key, [t]);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}
