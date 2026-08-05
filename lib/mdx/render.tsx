import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import type { Root as HastRoot } from 'hast';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { remarkGlossaryLinks } from './remark-glossary-links';
import { remarkNormalizePaste } from './remark-normalize-paste';
import { rehypeSanitizeContent } from './sanitize';

/**
 * Renders author content as **data, not code**.
 *
 * The previous pipeline compiled article bodies as MDX, which means every
 * paragraph an editor writes was executable JSX. Two things that actually
 * happened when I tested it against this repo:
 *
 *   1. `<script>alert(1)</script>` in a body was emitted verbatim into the
 *      prerendered HTML and ran in the browser — stored XSS on our own domain,
 *      one phished editor account away.
 *   2. `<div onClick={...}>` — the kind of thing that arrives inside pasted
 *      Blogger/Medium HTML — crashed `next build` with "Event handlers cannot
 *      be passed to Client Component props", taking the whole deploy down.
 *
 * Markdown-only parsing removes both classes at once. Raw HTML never becomes an
 * element: `remarkRehype` runs *without* `allowDangerousHtml`, so html nodes are
 * dropped at the mdast→hast boundary. `rehype-sanitize` then runs as defence in
 * depth against anything a future plugin might inject.
 *
 * The trade-off, stated plainly: you cannot embed React components in an article
 * any more. Nothing in content/ does. When we want a callout box or a CTA block,
 * it gets added here as a reviewed component with an allow-listed tag — not as
 * arbitrary markup typed into a text field.
 */

export type RenderOptions = {
  /** Glossary slugs that exist, so [[term]] only links where a page is real. */
  knownSlugs: Set<string>;
  /** The entry title, so a pasted duplicate heading can be removed from the body. */
  title?: string;
};

export function renderContent(body: string, { knownSlugs, title }: RenderOptions): ReactNode {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    // Clean paste artefacts before anything else looks at the tree.
    .use(remarkNormalizePaste, { title })
    .use(remarkGlossaryLinks, { knownSlugs, titleFor: (slug: string) => slug })
    // No allowDangerousHtml: raw <script>/<iframe>/<div onclick> in a body never
    // becomes an element. The sanitiser below is defence in depth.
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeSanitizeContent);

  const tree = processor.runSync(processor.parse(body)) as HastRoot;

  return toJsxRuntime(tree, {
    Fragment,
    jsx,
    jsxs,
    components: { a: Anchor, img: Img },
  });
}

/** Internal links stay internal; external links get the usual safety attributes. */
function Anchor({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" {...rest}>
      {children}
    </a>
  );
}

/**
 * Images are lazy by default and always carry an alt attribute. An editor who
 * pastes an image without alt text gets an empty alt (decorative) rather than a
 * screen reader announcing the filename.
 */
function Img({ alt, src = '', ...rest }: ComponentPropsWithoutRef<'img'>) {
  // eslint-disable-next-line @next/next/no-img-element -- markdown images carry
  // no intrinsic dimensions, which next/image requires.
  return <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" {...rest} />;
}
