import Link from 'next/link';
import type { BlogDoc } from '@/lib/content';

/**
 * The reverse of RelatedTerms: from a definition to the articles that use it.
 * Styled to match RelatedTerms exactly so the two read as one system.
 */
export function RelatedPosts({ posts }: { posts: BlogDoc[] }) {
  if (posts.length === 0) return null;

  return (
    <aside className="mt-16 border-t border-black/10 pt-10">
      <h2 className="eyebrow">Read more on the blog</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="block h-full border border-black/10 rounded-lg p-5 card-hover"
            >
              <span className="font-sans font-semibold text-black">{p.title.trim()}</span>
              {p.summary && (
                <span className="mt-2 block text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {p.summary}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
