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
import config from '../keystatic.config';

const reader = createReader(process.cwd(), config);

async function main() {
  let failures = 0;

  for (const name of ['glossary', 'blog'] as const) {
    const slugs = await reader.collections[name].list();
    console.log(`\n${name}: ${slugs.length} entr${slugs.length === 1 ? 'y' : 'ies'}`);

    for (const slug of slugs) {
      const entry = await reader.collections[name].read(slug);
      if (!entry) {
        console.error(`  ✗ ${slug} — Keystatic could not parse this file`);
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
        console.error(`  ✗ ${slug} — missing: ${missing.join(', ')}`);
        failures++;
      } else {
        console.log(`  ✓ ${slug}${entry.draft ? ' (draft)' : ''}`);
      }
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} file(s) the CMS cannot round-trip.`);
    process.exit(1);
  }
  console.log('\nAll content round-trips between the CMS and the site.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
