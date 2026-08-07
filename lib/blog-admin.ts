import fs from 'node:fs';
import path from 'node:path';

/**
 * The file-level operations behind the post manager: locating a post's source
 * file, and flipping its `draft` flag.
 *
 * Kept apart from lib/content.ts on purpose. That module only ever reads, and
 * every public route depends on it; this one is reached solely from the
 * authenticated admin API.
 */

/**
 * Statically scoped on purpose. `path.join(process.cwd(), someVariable)` defeats
 * Next's file tracing - it cannot tell which directory is meant, so it gives up
 * and bundles the entire project, public folder included, into the deployed
 * function. Pinning the directory here keeps the trace to content/blog, and has
 * the side benefit that no input can address a file outside it.
 */
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/** Same rule the Keystatic slug field enforces. Also what makes traversal impossible. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.length <= 120 && SLUG.test(slug);
}

export type BlogFile = {
  /** Repo-relative, as a git commit needs it. */
  repoPath: string;
  /** On-disk, for reads and for dev-mode writes. */
  absolutePath: string;
};

/**
 * A post's source file, or null if there is no such post.
 *
 * Both layouts Keystatic can produce are checked, matching `listEntryFiles` in
 * lib/content.ts - the collection glob could change and this must not silently
 * stop finding files.
 */
export function blogFile(slug: string): BlogFile | null {
  if (!isValidSlug(slug)) return null;
  for (const name of [`${slug}.mdx`, `${slug}.md`, `${slug}/index.mdx`, `${slug}/index.md`]) {
    const absolutePath = path.join(BLOG_DIR, name);
    if (fs.existsSync(absolutePath)) return { repoPath: `content/blog/${name}`, absolutePath };
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
