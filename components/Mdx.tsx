import { glossarySlugs } from '@/lib/content';
import { renderContent } from '@/lib/mdx/render';

/**
 * Renders an article body. All the interesting decisions - sanitisation, paste
 * normalisation, the [[term]] resolver - live in lib/mdx/render.tsx.
 *
 * `title` is passed so a pasted duplicate of the page heading can be stripped.
 */
export function Mdx({ source, title }: { source: string; title?: string }) {
  return <>{renderContent(source, { knownSlugs: glossarySlugs(), title })}</>;
}
