/**
 * Verifies that Keystatic can read every file the site renders.
 *
 * The CMS and the site parse the same MDX files through completely separate code
 * (Keystatic's reader vs. lib/content.ts + gray-matter). If they ever disagree
 * about the frontmatter contract, an editor opens a post and silently loses
 * fields on save. This script fails loudly instead.
 *
 * Run: npm run verify:cms
 */
import { readFileSync } from 'node:fs';
import { createReader } from '@keystatic/core/reader';
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../keystatic.config';
import { applyChangesToTree, isTreeEntryArray } from '../lib/keystatic-tree';
import { transformImageFilename } from '../lib/image-filename';

const reader = createReader(process.cwd(), config);

/**
 * Checks the image-upload contract.
 *
 * Keystatic names uploaded images with the browser's own filename unless a
 * `transformFilename` is supplied. A pasted screenshot is always `image.png`, so
 * without one, every image pasted into a single entry lands on the same path and
 * they overwrite each other on save - every image in the post silently becomes
 * the first one. That is a content-destroying default, and nothing else in the
 * build would notice it had come back.
 *
 * Three checks, because no single one covers it:
 *
 *   - `directories` is the only part of the image options `fields.mdx()` exposes
 *     at runtime; the rest stays in a closure. It proves the image block reached
 *     the field, but says nothing about `transformFilename`.
 *   - So the wiring is checked against the config *source*. This is deliberately
 *     crude, and it is here because the alternative was verified to be nothing:
 *     with the `transformFilename` line deleted, `tsc --noEmit` and every other
 *     check in this file still pass. The option is optional, so TypeScript only
 *     catches a misspelled key, never a removed one.
 *   - The naming behaviour itself is verified directly against
 *     lib/image-filename.ts, which is where a regression would actually land.
 *
 * The generated names must also stay inside the path allow-list that
 * app/api/keystatic/[[...params]]/route.ts enforces before it will commit, since
 * that handler holds a repository write token. A name that fails there makes
 * publishing fail outright, so the two definitions must not drift.
 */
function verifyImageNaming(): number {
  let failures = 0;

  // Mirrors `allowed` in app/api/keystatic/[[...params]]/route.ts.
  const allowedPath = /^(content\/(glossary|blog)\/|public\/images\/(glossary|blog)\/)/;

  for (const name of ['glossary', 'blog'] as const) {
    const contentField = config.collections[name].schema.content as { directories?: string[] };
    const expected = `public/images/${name}`;

    if (!contentField.directories?.includes(expected)) {
      console.error(
        `\n  ✗ ${name}: content field does not declare ${expected}.\n` +
          '    The image options are not wired to this field.',
      );
      failures++;
      continue;
    }
    console.log(`  ✓ ${name}: uploads directed at ${expected}`);
  }

  // The wiring itself, read off the source. See the note above on why.
  const source = readFileSync(new URL('../keystatic.config.ts', import.meta.url), 'utf8');
  const wired = source.match(/transformFilename:\s*transformImageFilename/g)?.length ?? 0;
  if (wired < 2) {
    console.error(
      `\n  ✗ keystatic.config.ts wires transformImageFilename ${wired} time(s), expected 2.\n` +
        '    A collection without it names every pasted screenshot image.png, and they\n' +
        '    overwrite each other on save. See lib/image-filename.ts.',
    );
    failures++;
  } else {
    console.log('  ✓ both collections wire transformImageFilename');
  }

  // Every clipboard paste hands over this exact name. 500 of them must produce
  // 500 distinct paths, or images overwrite each other inside one entry.
  const generated = new Set<string>();
  for (let i = 0; i < 500; i++) generated.add(transformImageFilename('image.png'));
  if (generated.size !== 500) {
    console.error(
      `\n  ✗ transformImageFilename produced ${generated.size} distinct names from 500 calls on "image.png".\n` +
        '    Pasted screenshots will overwrite each other on save.',
    );
    failures++;
  } else {
    console.log('  ✓ 500 pastes of image.png produce 500 distinct filenames');
  }

  const awkward = [
    'image.png',
    'Screenshot 2026-01-02 at 10.33.png',
    'url_qrcodecreator.com_09_30_31.png',
    'Ünïcødé Ñame.JPEG',
    '../../etc/passwd.png',
    'with spaces & symbols!.webp',
    '.png',
    'no-extension',
    `${'x'.repeat(300)}.png`,
  ];

  const bad = awkward
    .map((input) => [input, transformImageFilename(input)] as const)
    .filter(
      ([, out]) =>
        !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(out) ||
        out.includes('..') ||
        out.length > 100 ||
        !allowedPath.test(`public/images/blog/${out}`),
    );

  if (bad.length) {
    for (const [input, out] of bad) {
      console.error(`\n  ✗ unsafe filename: ${JSON.stringify(input)} -> ${JSON.stringify(out)}`);
    }
    failures++;
  } else {
    console.log(`  ✓ ${awkward.length} awkward filenames all sanitise to URL-safe names`);
  }

  return failures;
}

/**
 * Checks the *write* contract, which is separate from the read contract above
 * and failed silently for far longer.
 *
 * In local-storage mode Keystatic's client does not read `POST /update` as a
 * status - it reads it as the new file tree, and feeds the body straight into
 * `entries.map(...)`. Our handler commits to GitHub instead of writing to disk,
 * so it has to reconstruct that tree itself (lib/keystatic-tree.ts). Returning
 * anything else throws `e.map is not a function` in the editor *after* the
 * commit has landed, so every save and delete looks broken while succeeding.
 *
 * The test: rebuilding the current tree with no changes must reproduce
 * Keystatic's own `GET /tree` output exactly - same entries, same order, same
 * shas. If a Keystatic upgrade changes how it hashes or orders entries, this
 * fails here rather than in production.
 */
async function verifyTreeContract(): Promise<number> {
  const keystatic = makeRouteHandler({ config });
  const response = await keystatic.GET(
    new Request('https://verify.invalid/api/keystatic/tree', { headers: { 'no-cors': '1' } }),
  );

  if (!response.ok) {
    console.error(`\n  ✗ tree endpoint returned ${response.status}`);
    return 1;
  }

  const base: unknown = await response.json();
  if (!isTreeEntryArray(base)) {
    console.error('\n  ✗ tree endpoint body is not an entry array - the write contract changed');
    return 1;
  }

  const rebuilt = applyChangesToTree(base, []);
  if (JSON.stringify(rebuilt) !== JSON.stringify(base)) {
    console.error(
      '\n  ✗ applyChangesToTree no longer reproduces Keystatic\'s tree.\n' +
        '    Saves and deletes will fail in production with "e.map is not a function".\n' +
        `    ${base.length} entries in, ${rebuilt.length} out.`,
    );
    return 1;
  }

  console.log(`\nwrite contract: tree of ${base.length} entries rebuilds identically ✓`);
  return 0;
}

async function main() {
  let failures = 0;

  for (const name of ['glossary', 'blog'] as const) {
    const slugs = await reader.collections[name].list();
    console.log(`\n${name}: ${slugs.length} entr${slugs.length === 1 ? 'y' : 'ies'}`);

    for (const slug of slugs) {
      const entry = await reader.collections[name].read(slug);
      if (!entry) {
        console.error(`  ✗ ${slug} - Keystatic could not parse this file`);
        failures++;
        continue;
      }

      const missing: string[] = [];
      if (!entry.title) missing.push('title');
      if (!entry.metaDescription) missing.push('metaDescription');
      if (!entry.category) missing.push('category');
      if (name === 'glossary' && !('definition' in entry && entry.definition)) {
        missing.push('definition');
      }
      if (name === 'blog' && !('summary' in entry && entry.summary)) {
        missing.push('summary');
      }

      if (missing.length) {
        console.error(`  ✗ ${slug} - missing: ${missing.join(', ')}`);
        failures++;
      } else {
        console.log(`  ✓ ${slug}${entry.draft ? ' (draft)' : ''}`);
      }
    }
  }

  console.log('\nimage naming:');
  const imageFailures = verifyImageNaming();

  const contractFailures = await verifyTreeContract();

  if (failures > 0 || imageFailures > 0 || contractFailures > 0) {
    if (failures > 0) console.error(`\n${failures} file(s) the CMS cannot round-trip.`);
    process.exit(1);
  }
  console.log('\nAll content round-trips between the CMS and the site.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
