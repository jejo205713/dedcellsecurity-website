import { visit } from 'unist-util-visit';
import type { Heading, Paragraph, Parent, Root, RootContent } from 'mdast';
import { toString as mdastToString } from 'mdast-util-to-string';

/**
 * Cleans up the artefacts that come with pasting from Blogger, Medium or Google
 * Docs, so an editor doesn't have to know what any of them are.
 *
 * Everything here was observed in a real paste
 * (content/glossary/the-alert-that-cost-900-000-customers.mdx):
 *
 *   - The article's own `# Title` pasted into the body, giving the page two H1s
 *     — the template already renders one from the Title field.
 *   - Stray `\` hard breaks around images and pull quotes, which render as
 *     ragged blank lines.
 *   - Empty paragraphs left behind by the source editor's spacing divs.
 *
 * Fixing these at render time rather than asking editors to tidy the markdown is
 * the whole point: paste, save, and the page comes out right.
 */

export type NormalizeOptions = {
  /** The entry's Title field, used to spot a duplicated heading in the body. */
  title?: string;
};

/** Loose comparison — punctuation and casing differ constantly between sources. */
function sameText(a: string, b: string): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  return norm(a) === norm(b) && norm(a).length > 0;
}

function isBlank(node: RootContent): boolean {
  if (node.type === 'break') return true;
  if (node.type === 'text') return node.value.trim() === '';
  if (node.type === 'paragraph') {
    return node.children.every((child) => isBlank(child as RootContent));
  }
  return false;
}

export function remarkNormalizePaste(options: NormalizeOptions = {}) {
  const { title } = options;

  return (tree: Root) => {
    /* 1. The page owns exactly one H1, rendered from the Title field.
     *    A leading H1 that repeats the title is dropped; any other H1 is
     *    demoted to H2 so the outline stays legal. */
    let seenContent = false;
    const keep: RootContent[] = [];

    for (const node of tree.children) {
      if (node.type === 'heading') {
        const heading = node as Heading;
        if (heading.depth === 1) {
          const text = mdastToString(heading);
          if (!seenContent && title && sameText(text, title)) {
            continue; // duplicate of the page title — drop it
          }
          heading.depth = 2;
        }
      }
      if (!isBlank(node)) seenContent = true;
      keep.push(node);
    }
    tree.children = keep;

    /* 2. Strip paste-artefact line breaks: leading/trailing breaks inside a
     *    paragraph, and runs of consecutive breaks collapsed to one. */
    visit(tree, 'paragraph', (node: Paragraph) => {
      const children = node.children.filter(
        (child, i, arr) => !(child.type === 'break' && arr[i - 1]?.type === 'break'),
      );
      while (children.length && children[0].type === 'break') children.shift();
      while (children.length && children[children.length - 1].type === 'break') children.pop();
      node.children = children;
    });

    /* 3. Drop paragraphs that ended up empty, here or in the source. */
    visit(tree, (node, index, parent: Parent | undefined) => {
      if (!parent || index === undefined) return;
      if (node.type !== 'paragraph') return;
      if ((node as Paragraph).children.length === 0) {
        parent.children.splice(index, 1);
        return index;
      }
    });
  };
}
