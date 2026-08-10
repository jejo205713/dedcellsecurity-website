import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Mdx } from '@/components/Mdx';
import { RelatedTerms } from '@/components/RelatedTerms';
import { Toc } from '@/components/Toc';
import { getBlogPostsForAdmin, getGlossaryTermsForAdmin, getRelatedTerms } from '@/lib/content';
import { adminDisabledReason, adminEnabled } from '@/lib/keystatic-storage';
import { isCollection } from '@/lib/content-admin';
import { categoryName } from '@/lib/taxonomy';

/**
 * Previews an entry the way the site will render it, whether or not it is a
 * draft.
 *
 * This route exists because there is nowhere else a draft can be seen. Drafts
 * are stripped from every public route on a production build (lib/env.ts), which
 * is exactly right - an unpublished post must never be reachable or indexed -
 * but it leaves an editor with no way to check their work before publishing.
 *
 * It renders the *saved file*, not the editor's unsaved state. Nothing outside
 * Keystatic can see uncommitted form state, so the preview follows a save. The
 * banner says so, because an editor who assumes otherwise will publish
 * something they never actually looked at.
 *
 * The same Mdx pipeline as the real page, deliberately: a preview that renders
 * through different code is a preview of something else.
 */

export const metadata: Metadata = {
  title: 'Preview',
  robots: { index: false, follow: false, nocache: true },
};

/** The content directory is read per request; a cached preview is a stale one. */
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ collection: string; slug: string }> };

export default async function PreviewPage({ params }: Props) {
  // Same fail-closed rule as the rest of the admin. Access is gated in proxy.ts,
  // which already matches /admin/:path*; this is the second lock.
  if (!adminEnabled) {
    console.warn(`[admin] preview disabled - ${adminDisabledReason()}`);
    notFound();
  }

  const { collection, slug } = await params;
  if (!isCollection(collection)) notFound();

  const entries = collection === 'blog' ? getBlogPostsForAdmin() : getGlossaryTermsForAdmin();
  const doc = entries.find((d) => d.slug === slug);
  if (!doc) notFound();

  const related = getRelatedTerms(doc);
  const livePath = `/${collection}/${doc.slug}`;

  return (
    <>
      <div className="sticky top-0 z-50 border-b border-black/10 bg-black text-white px-6 py-3">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-widest">
            Preview · {doc.draft ? 'Draft' : 'Live'} · showing the last saved version
          </p>
          <div className="flex items-center gap-3">
            <a
              href={`/keystatic/collection/${collection}/item/${encodeURIComponent(doc.slug)}`}
              className="font-mono text-[11px] uppercase tracking-widest underline underline-offset-4"
            >
              Back to editor
            </a>
            {!doc.draft && (
              <a
                href={livePath}
                className="font-mono text-[11px] uppercase tracking-widest underline underline-offset-4"
              >
                View live
              </a>
            )}
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 pt-12 pb-24">
        <header>
          {doc.category && <p className="eyebrow">{categoryName(doc.category)}</p>}
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-black">
            {doc.title}
          </h1>
          {'summary' in doc && doc.summary && (
            <p className="mt-6 text-lg leading-relaxed text-gray-500">{doc.summary}</p>
          )}
          {'definition' in doc && doc.definition && (
            <p className="mt-6 text-lg leading-relaxed text-gray-500">{doc.definition}</p>
          )}
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-gray-600">
            {'author' in doc && doc.author ? `${doc.author} · ` : ''}
            {doc.publishedDate}
            {doc.updatedDate && ` · Updated ${doc.updatedDate}`}
            {` · ${doc.readingMinutes} min read`}
          </p>
        </header>

        <div className="mt-10">
          <Toc headings={doc.headings} />
          <div className="prose prose-dedcell max-w-none">
            <Mdx source={doc.body} title={doc.title} />
          </div>
        </div>

        <RelatedTerms terms={related} />
      </article>
    </>
  );
}
