import type { Heading } from '@/lib/content';

export function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null; // A 2-item TOC is noise.

  return (
    <nav
      aria-label="On this page"
      className="mb-12 border border-black/10 rounded-lg p-6 bg-black/[0.02]"
    >
      <p className="eyebrow">On this page</p>
      <ol className="mt-4 space-y-2 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.depth === 3 ? 'pl-4' : undefined}>
            <a
              href={`#${h.id}`}
              className="text-gray-500 hover:text-black transition-colors"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
