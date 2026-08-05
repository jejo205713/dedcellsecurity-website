import { visit, SKIP } from 'unist-util-visit';
import type { Root, Text, PhrasingContent, Parent } from 'mdast';

/**
 * Resolves `[[term-slug]]` into a link to /glossary/term-slug.
 *
 * The internal-linking engine from docs/seo/05-INTERNAL-LINKING.md:
 *   - ONLY the first occurrence of a term in a document is linked. Repeats render
 *     as plain text. ("one link per term per article" — over-linking the same
 *     target from one page reads as manipulation and adds no crawl value.)
 *   - Unknown terms degrade to plain text rather than producing a 404 link.
 *     An intern can write [[siem]] before the SIEM page exists and nothing breaks;
 *     the link starts working the day that term is published.
 *   - Text already inside a link is skipped, so we never nest anchors.
 */

const TERM_PATTERN = /\[\[([a-z0-9][a-z0-9-]*)\]\]/g;

export type GlossaryLinkOptions = {
  /** Slugs that actually exist. Anything else degrades to plain text. */
  knownSlugs: Set<string>;
  /** Overrides the anchor text; defaults to the slug's own title. */
  titleFor?: (slug: string) => string | undefined;
};

export function remarkGlossaryLinks(options: GlossaryLinkOptions) {
  const { knownSlugs, titleFor } = options;

  return (tree: Root) => {
    // Per-document, so "first occurrence" means first in this file.
    const linked = new Set<string>();

    visit(tree, 'text', (node: Text, index, parent: Parent | undefined) => {
      if (!parent || index === undefined) return;
      if (!node.value.includes('[[')) return;

      // Never create an anchor inside an anchor — but still strip the syntax so
      // readers don't see raw [[brackets]] in the prose.
      if (parent.type === 'link' || parent.type === 'linkReference') {
        node.value = node.value.replace(TERM_PATTERN, '$1');
        return SKIP;
      }

      const replacements: PhrasingContent[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      TERM_PATTERN.lastIndex = 0;
      while ((match = TERM_PATTERN.exec(node.value)) !== null) {
        const [raw, slug] = match;

        if (match.index > lastIndex) {
          replacements.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          });
        }

        const label = titleFor?.(slug) ?? slug;

        if (knownSlugs.has(slug) && !linked.has(slug)) {
          linked.add(slug);
          replacements.push({
            type: 'link',
            url: `/glossary/${slug}`,
            children: [{ type: 'text', value: label }],
          });
        } else {
          // Already linked once, or the term doesn't exist yet — strip the
          // brackets and leave readable prose behind.
          replacements.push({ type: 'text', value: label });
        }

        lastIndex = match.index + raw.length;
      }

      if (replacements.length === 0) return;

      if (lastIndex < node.value.length) {
        replacements.push({ type: 'text', value: node.value.slice(lastIndex) });
      }

      parent.children.splice(index, 1, ...replacements);
      // Skip past the nodes we just inserted so we don't re-scan them.
      return [SKIP, index + replacements.length];
    });
  };
}
