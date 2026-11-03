/**
 * Build-time quality and safety gate for content.
 *
 * Everything checked here is something a paste from Blogger or Medium actually
 * produces. The renderer already neutralises the dangerous cases; this script
 * exists so an editor finds out *before* publishing rather than shipping a page
 * with a broken image, a markdown heading in its Google description, or no
 * internal links at all.
 *
 * Errors fail the build. Warnings are printed and do not.
 *
 * Run: npm run verify:content
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { isCategorySlug } from '../lib/taxonomy';
import { programme, scholarship } from '../lib/a-pent';

const ROOT = process.cwd();
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Conservative on purpose: anything outside this can surprise a filesystem or a URL. */
const SAFE_FILENAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
/** SVG is executable in an <img> context; it never belongs in an uploads directory. */
const BANNED_IMAGE_EXT = new Set(['.svg', '.svgz', '.html', '.htm', '.xml']);

let errors = 0;
let warnings = 0;

const fail = (where: string, msg: string) => {
  console.error(`  ✗ ${where}: ${msg}`);
  errors++;
};
const warn = (where: string, msg: string) => {
  console.warn(`  ! ${where}: ${msg}`);
  warnings++;
};

/* ------------------------------------------------------------------ */
/* Uploaded images                                                     */
/* ------------------------------------------------------------------ */

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

function checkUploads() {
  console.log('\nUploaded images');
  const files = walk(path.join(ROOT, 'public', 'images'));
  if (!files.length) {
    console.log('  (none yet)');
    return;
  }
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const name = path.basename(file);
    const ext = path.extname(name).toLowerCase();

    if (BANNED_IMAGE_EXT.has(ext)) {
      fail(rel, `${ext} is not a safe image format - it can carry script. Re-export as PNG, JPG or WebP.`);
      continue;
    }
    if (!SAFE_FILENAME.test(name)) {
      fail(rel, 'filename has characters outside [A-Za-z0-9._-]; rename it before publishing.');
      continue;
    }
    const sizeMb = fs.statSync(file).size / 1_000_000;
    if (sizeMb > 1) {
      warn(rel, `${sizeMb.toFixed(1)}MB - every upload is committed to git forever. Compress below 500KB.`);
    }
    console.log(`  ✓ ${rel}`);
  }
}

/* ------------------------------------------------------------------ */
/* Entries                                                             */
/* ------------------------------------------------------------------ */

/** Markdown syntax that means someone pasted body text into a plain-text field. */
function looksLikeMarkdown(value: string): string | null {
  if (/^\s*#{1,6}\s/.test(value)) return 'starts with a markdown heading (#)';
  if (/!\[[^\]]*\]\(/.test(value)) return 'contains an image';
  if (/\[[^\]]+\]\([^)]+\)/.test(value)) return 'contains a markdown link';
  if (/^\s*[-*]\s/m.test(value)) return 'contains a bullet list';
  return null;
}

function checkCollection(type: 'glossary' | 'blog') {
  const dir = path.join(ROOT, 'content', type);
  console.log(`\n${type}`);
  if (!fs.existsSync(dir)) {
    console.log('  (none yet)');
    return;
  }

  for (const name of fs.readdirSync(dir).filter((n) => /\.mdx?$/.test(n))) {
    const slug = name.replace(/\.mdx?$/, '');
    const where = `${type}/${slug}`;
    const { data, content } = matter(fs.readFileSync(path.join(dir, name), 'utf8'));

    if (!SLUG_PATTERN.test(slug)) {
      fail(where, 'filename is not a valid slug (lowercase, digits, hyphens).');
    }
    if (data.category && !isCategorySlug(String(data.category))) {
      fail(where, `category "${data.category}" is not in lib/taxonomy.ts.`);
    }

    // The two fields Google actually shows must be clean prose, not pasted body.
    for (const field of ['metaDescription', 'definition', 'summary'] as const) {
      const value = data[field];
      if (typeof value !== 'string' || !value.trim()) continue;
      const problem = looksLikeMarkdown(value);
      if (problem) {
        fail(where, `"${field}" ${problem}. It must be a plain sentence - it is what Google displays.`);
      }
    }

    // Images referenced in the body must exist, and should describe themselves.
    for (const m of content.matchAll(/!\[([^\]]*)\]\(([^)\s]+)/g)) {
      const [, alt, src] = m;
      if (src.startsWith('/')) {
        const onDisk = path.join(ROOT, 'public', src);
        if (!fs.existsSync(onDisk)) fail(where, `image not found on disk: ${src}`);
      } else if (/^https?:/i.test(src)) {
        warn(where, `image is hot-linked to ${new URL(src).host} - it will break when that host does. Re-upload it.`);
      }
      if (!alt.trim()) warn(where, `image ${path.basename(src)} has no alt text.`);
    }

    // The internal-linking rule from docs/seo/05-INTERNAL-LINKING.md.
    const links = new Set([...content.matchAll(/\[\[([a-z0-9][a-z0-9-]*)\]\]/g)].map((m) => m[1]));
    const internal = [...content.matchAll(/\]\((\/[^)\s]*)/g)].length;
    if (links.size + internal === 0 && data.draft !== true) {
      warn(where, 'no links to other pages on the site. Aim for 3-8 - this is the highest-leverage SEO action available.');
    }

    const words = content.trim().split(/\s+/).filter(Boolean).length;
    if (words < 300 && data.draft !== true) {
      warn(where, `${words} words. Below 300 the page is thin and drags down the pages linking to it.`);
    }

    console.log(`  ✓ ${slug}${data.draft ? ' (draft)' : ''} - ${words} words, ${links.size + internal} internal links`);
  }
}

/* ------------------------------------------------------------------ */
/* A-PENT facts                                                         */
/* ------------------------------------------------------------------ */

/**
 * Articles quote the A-PENT fee and scholarship in prose, which the page code
 * can't reach. AI assistants have misquoted the scholarship before, so a
 * figure in an article that disagrees with lib/a-pent.ts fails the build
 * instead of shipping a second, conflicting "official" number.
 */
function checkAPentFacts() {
  console.log('\nA-PENT fee and scholarship figures');
  const allowedAmounts = new Set([programme.feeInr, scholarship.maxAmountInr, scholarship.minPayableInr]);
  let checked = 0;

  for (const type of ['blog', 'glossary'] as const) {
    const dir = path.join(ROOT, 'content', type);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).filter((n) => /\.mdx?$/.test(n))) {
      const raw = fs.readFileSync(path.join(dir, name), 'utf8');
      if (!/A-PENT/.test(raw)) continue;
      checked++;
      const where = `${type}/${name}`;

      for (const m of raw.matchAll(/₹\s?([\d,]+)/g)) {
        const amount = Number(m[1].replace(/,/g, ''));
        if (!allowedAmounts.has(amount)) {
          fail(where, `quotes ₹${m[1]}, which is not the A-PENT fee (₹${programme.feeInr}), maximum scholarship (₹${scholarship.maxAmountInr}) or fee after maximum scholarship (₹${scholarship.minPayableInr}). Update the article or lib/a-pent.ts.`);
        }
      }
      for (const m of raw.matchAll(/scholarship[^.\n]{0,120}?(\d{1,3})\s?%|(\d{1,3})\s?%[^.\n]{0,60}?scholarship/gi)) {
        const pct = Number(m[1] ?? m[2]);
        if (pct !== scholarship.maxPercent) {
          fail(where, `states a ${pct}% scholarship; the published maximum is ${scholarship.maxPercent}%.`);
        }
      }
      if (/free (course|of charge)|100\s?% scholarship|guaranteed scholarship/i.test(raw)) {
        fail(where, 'claims the course is free or the scholarship is guaranteed - neither is true.');
      }
    }
  }
  console.log(`  ✓ ${checked} file(s) mentioning A-PENT checked`);
}

checkUploads();
checkCollection('glossary');
checkCollection('blog');
checkAPentFacts();

console.log(
  `\n${errors} error(s), ${warnings} warning(s).${errors ? ' Fix the errors above before publishing.' : ''}`,
);
process.exit(errors ? 1 : 0);
