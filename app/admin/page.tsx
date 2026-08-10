import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostsForAdmin, getGlossaryTermsForAdmin } from '@/lib/content';
import { adminDisabledReason, adminEnabled } from '@/lib/keystatic-storage';
import { PostsTable, type AdminCollection, type AdminPost } from './posts-table';
import { SignOutButton } from './sign-out-button';

/** An admin screen is never a search result. */
export const metadata: Metadata = {
  title: 'Manage content',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Reads the content directory on every request. It is a per-request filesystem
 * glob over a couple of dozen small files, and the alternative - a cached list
 * that disagrees with what the editor just did - is worse than the cost.
 */
export const dynamic = 'force-dynamic';

/** One list plus the count line above it. Identical shape for both collections. */
function Section({
  heading,
  collection,
  posts,
  noun,
}: {
  heading: string;
  collection: AdminCollection;
  posts: AdminPost[];
  noun: [singular: string, plural: string];
}) {
  const live = posts.filter((p) => !p.draft).length;

  return (
    <section className="mt-16 first:mt-12">
      <h2 className="text-xl font-bold tracking-tight text-black">{heading}</h2>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        {live} of {posts.length} {posts.length === 1 ? `${noun[0]} is` : `${noun[1]} are`} live.
      </p>
      <PostsTable posts={posts} collection={collection} />
    </section>
  );
}

export default function AdminHome() {
  // Same fail-closed rule as the CMS itself: if the admin is not configured,
  // it does not exist. Access is gated in proxy.ts; this is the second lock.
  if (!adminEnabled) {
    console.warn(`[admin] dashboard disabled - ${adminDisabledReason()}`);
    notFound();
  }

  const toAdminPost = (doc: {
    slug: string;
    title: string;
    draft: boolean;
    publishedDate: string;
  }): AdminPost => ({
    slug: doc.slug,
    title: doc.title,
    draft: doc.draft,
    publishedDate: doc.publishedDate,
  });

  const posts = getBlogPostsForAdmin().map(toAdminPost);
  const terms = getGlossaryTermsForAdmin().map(toAdminPost);

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Publisher access</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-black">Manage content</h1>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Drafts are excluded from the site, the sitemap and search engines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/keystatic"
              className="font-mono text-[11px] uppercase tracking-widest px-3 py-2 rounded-lg border border-black/15 text-black hover:bg-black/[0.04] transition-colors"
            >
              Open CMS
            </a>
            <SignOutButton className="font-mono text-[11px] uppercase tracking-widest px-3 py-2 rounded-lg border border-black/15 text-gray-600 hover:bg-black/[0.04] hover:text-black transition-colors" />
          </div>
        </div>

        <Section
          heading="Blog"
          collection="blog"
          posts={posts}
          noun={['post', 'posts']}
        />
        <Section
          heading="Glossary"
          collection="glossary"
          posts={terms}
          noun={['term', 'terms']}
        />

        <p className="mt-10 font-mono text-[10px] uppercase tracking-widest text-gray-600">
          Every change here is a git commit and triggers a rebuild.
        </p>
      </div>
    </main>
  );
}
