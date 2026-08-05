import type { Metadata } from 'next';
import { LeadCta } from '@/components/LeadCta';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getBlogPosts } from '@/lib/content';
import { itemListSchema } from '@/lib/schema';
import { categoryName } from '@/lib/taxonomy';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Field notes from real engagements - findings, methodology, and what actually breaks in production.',
  alternates: { canonical: '/blog' },
};

export default function BlogHub() {
  const posts = getBlogPosts();

  return (
    <>
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />
      <JsonLd
        data={itemListSchema(
          posts.map((p) => ({ name: p.title, url: `/blog/${p.slug}` })),
          'Dedcell Security Blog',
        )}
      />

      <header className="mt-8">
        <p className="eyebrow">Field Notes</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-black">
          From the <span className="text-gray-500">Engagements.</span>
        </h1>
        <p className="mt-5 text-gray-500 max-w-2xl leading-relaxed">
          What we actually find when we test production systems - the findings, the
          methodology, and the decisions that turn a near-miss into a breach.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 text-gray-500">No posts published yet.</p>
      ) : (
        <ul className="mt-16 space-y-12">
          {posts.map((p) => (
            <li key={p.slug} className="border-b border-black/10 pb-12 last:border-0">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-600">
                {p.category ? categoryName(p.category) : 'Article'}
                {p.publishedDate && ` · ${p.publishedDate}`}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-black underline decoration-black/20 underline-offset-4 hover:decoration-black"
                >
                  {p.title}
                </Link>
              </h2>
              {p.summary && (
                <p className="mt-3 text-gray-500 leading-relaxed">{p.summary}</p>
              )}
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-gray-600">
                {p.author && `${p.author} · `}
                {p.readingMinutes} min read
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>

      <LeadCta
        variant="light"
        eyebrow="Next Step"
        heading="Reading is not testing."
        body="If any of this sounds like your stack, we will scope an assessment and tell you exactly what it costs."
      />
    </>
  );
}
