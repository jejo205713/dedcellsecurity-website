import fs from 'node:fs';
import path from 'node:path';

/**
 * The file-level operations behind the post manager: locating an entry's source
 * file, and flipping its `draft` flag.
 *
 * Kept apart from lib/content.ts on purpose. That module only ever reads, and
 * every public route depends on it; this one is reached solely from the
 * authenticated admin API.
 */

/** The two collections /admin can act on. Mirrors keystatic.config.ts. */
export const COLLECTIONS = ['blog', 'glossary'] as const;
export type Collection = (typeof COLLECTIONS)[number];

export function isCollection(value: unknown): value is Collection {
  return typeof value === 'string' && (COLLECTIONS as readonly string[]).includes(value);
}

/**
 * Statically scoped on purpose. `path.join(process.cwd(), someVariable)` defeats
 * Next's file tracing - it cannot tell which directory is meant, so it gives up
 * and bundles the entire project, public folder included, into the deployed
 * function. Pinning the directories here keeps the trace to content/, and has
 * the side benefit that no input can address a file outside them.
 */
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const GLOSSARY_DIR = path.join(process.cwd(), 'content', 'glossary');

/**
 * A branch, not `DIRECTORIES[collection]`.
 *
 * A lookup table keyed by a variable reads better and does not work: the tracer
 * follows constants but cannot resolve an index, so it falls back to tracing
 * everything and says so at build time. Each `path.join` below has to be reached
 * with a literal directory for the trace to stay scoped.
 */
function resolve(collection: Collection, name: string): string {
  return collection === 'blog' ? path.join(BLOG_DIR, name) : path.join(GLOSSARY_DIR, name);
}

/** Same rule the Keystatic slug field enforces. Also what makes traversal impossible. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.length <= 120 && SLUG.test(slug);
}

export type EntryFile = {
  /** Repo-relative, as a git commit needs it. */
  repoPath: string;
  /** On-disk, for reads and for dev-mode writes. */
  absolutePath: string;
};

/**
 * An entry's source file, or null if there is no such entry.
 *
 * Both layouts Keystatic can produce are checked, matching `listEntryFiles` in
 * lib/content.ts - the collection glob could change and this must not silently
 * stop finding files.
 */
export function entryFile(collection: Collection, slug: string): EntryFile | null {
  if (!isValidSlug(slug)) return null;
  for (const name of [`${slug}.mdx`, `${slug}.md`, `${slug}/index.mdx`, `${slug}/index.md`]) {
    const absolutePath = resolve(collection, name);
    if (fs.existsSync(absolutePath)) {
      return { repoPath: `content/${collection}/${name}`, absolutePath };
    }
  }
  return null;
}

/**
 * Rewrites the `draft:` line in the YAML frontmatter, leaving every other byte
 * of the file alone.
 *
 * Deliberately a targeted edit rather than a gray-matter parse-and-reserialise.
 * Round-tripping through YAML reflows quoting, drops comments and can reorder
 * keys, so an "unpublish" click would show up in the git diff as a rewrite of
 * the whole header. A one-line change is reviewable; a whole-file churn is not.
 */
export function setDraftFlag(raw: string, draft: boolean): string {
  const match = /^(---\r?\n)([\s\S]*?)(\r?\n---)/.exec(raw);
  if (!match) throw new Error('No YAML frontmatter found');

  const [whole, open, body, close] = match;
  const newline = body.includes('\r\n') ? '\r\n' : '\n';
  const updated = /^draft:.*$/m.test(body)
    ? body.replace(/^draft:.*$/m, `draft: ${draft}`)
    : `${body}${newline}draft: ${draft}`;

  return open + updated + close + raw.slice(whole.length);
}
