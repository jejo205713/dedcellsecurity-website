import type { Metadata } from 'next';
import { LeadCta } from '@/components/LeadCta';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { Mdx } from '@/components/Mdx';
import { RelatedTerms } from '@/components/RelatedTerms';
import { Toc } from '@/components/Toc';
import { getBlogPost, getBlogPosts, getRelatedTerms } from '@/lib/content';
import { blogPostingSchema } from '@/lib/schema';
import { categoryName } from '@/lib/taxonomy';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    // An explicit metaTitle is the *whole* SEO title - `absolute` stops the
    // root layout appending "| Dedcell Security" and pushing it past 60 chars.
    title: post.metaTitle ? { absolute: post.metaTitle } : post.title,
    description: post.metaDescription || post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      // An explicit metaTitle is the *whole* SEO title - `absolute` stops the
    // root layout appending "| Dedcell Security" and pushing it past 60 chars.
    title: post.metaTitle ? { absolute: post.metaTitle } : post.title,
      description: post.metaDescription || post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedDate || undefined,
      modifiedTime: post.updatedDate || undefined,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = getRelatedTerms(post);

  return (
    <>
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <JsonLd data={blogPostingSchema(post)} />

      <header className="mt-8">
        {post.category && <p className="eyebrow">{categoryName(post.category)}</p>}
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-black">
          {post.title}
        </h1>
        {post.summary && (
          <p className="mt-6 text-lg leading-relaxed text-gray-500">{post.summary}</p>
        )}
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-gray-600">
          {post.author && `${post.author} · `}
          {post.publishedDate}
          {post.updatedDate && ` · Updated ${post.updatedDate}`}
          {` · ${post.readingMinutes} min read`}
        </p>
      </header>

      <div className="mt-10">
        <Toc headings={post.headings} />
        <div className="prose prose-dedcell max-w-none">
          <Mdx source={post.body} title={post.title} />
        </div>
      </div>

      <RelatedTerms terms={related} />
    </article>

      <LeadCta
        variant="light"
        eyebrow="Next Step"
        heading="Want this checked on your own systems?"
        body="We run the assessments this was written from. Tell us your stack and we will scope it - no commitment."
      />
    </>
  );
}
