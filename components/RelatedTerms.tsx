import Link from 'next/link';
import type { GlossaryDoc } from '@/lib/content';

/**
 * "No dead ends" — every content page ends with a next step
 * (docs/seo/05-INTERNAL-LINKING.md).
 */
export function RelatedTerms({ terms }: { terms: GlossaryDoc[] }) {
  if (terms.length === 0) return null;

  return (
    <aside className="mt-20 border-t border-black/10 pt-10">
      <h2 className="eyebrow">Related terms</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {terms.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/glossary/${t.slug}`}
              className="block h-full border border-black/10 rounded-lg p-5 card-hover"
            >
              <span className="font-sans font-semibold text-black">{t.title}</span>
              {t.definition && (
                <span className="mt-2 block text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {t.definition}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
