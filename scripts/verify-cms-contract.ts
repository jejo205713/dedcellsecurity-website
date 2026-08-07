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
import { createReader } from '@keystatic/core/reader';
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../keystatic.config';
import { applyChangesToTree, isTreeEntryArray } from '../lib/keystatic-tree';

const reader = createReader(process.cwd(), config);

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

  const contractFailures = await verifyTreeContract();

  if (failures > 0 || contractFailures > 0) {
    if (failures > 0) console.error(`\n${failures} file(s) the CMS cannot round-trip.`);
    process.exit(1);
  }
  console.log('\nAll content round-trips between the CMS and the site.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
