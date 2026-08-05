import type { Metadata } from 'next';
import { LeadCta } from '@/components/LeadCta';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { Mdx } from '@/components/Mdx';
import { RelatedTerms } from '@/components/RelatedTerms';
import { Toc } from '@/components/Toc';
import { getGlossaryTerm, getGlossaryTerms, getRelatedTerms } from '@/lib/content';
import { definedTermSchema } from '@/lib/schema';
import { categoryName } from '@/lib/taxonomy';

type Props = { params: Promise<{ term: string }> };

export function generateStaticParams() {
  return getGlossaryTerms().map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return {};

  return {
    // An explicit metaTitle is the *whole* SEO title — `absolute` stops the
    // root layout appending "| Dedcell Security" and pushing it past 60 chars.
    title: term.metaTitle ? { absolute: term.metaTitle } : term.title,
    description: term.metaDescription || term.definition,
    alternates: { canonical: `/glossary/${term.slug}` },
    robots: term.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      // An explicit metaTitle is the *whole* SEO title — `absolute` stops the
    // root layout appending "| Dedcell Security" and pushing it past 60 chars.
    title: term.metaTitle ? { absolute: term.metaTitle } : term.title,
      description: term.metaDescription || term.definition,
      url: `/glossary/${term.slug}`,
    },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term: slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  const related = getRelatedTerms(term);

  return (
    <>
    <article className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Glossary', href: '/glossary' },
          { name: term.title, href: `/glossary/${term.slug}` },
        ]}
      />
      <JsonLd data={definedTermSchema(term)} />

      <header className="mt-8">
        {term.category && <p className="eyebrow">{categoryName(term.category)}</p>}
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-black">
          {term.title}
        </h1>

        {/* The snippet target: standalone, above everything else, visually set
            apart so an editor can see they are writing the answer Google lifts. */}
        {term.definition && (
          <p className="mt-6 text-lg leading-relaxed text-black border-l-2 border-black pl-5">
            {term.definition}
          </p>
        )}

        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-gray-600">
          {term.readingMinutes} min read
          {term.updatedDate && ` · Updated ${term.updatedDate}`}
        </p>
      </header>

      <div className="mt-10">
        <Toc headings={term.headings} />
        <div className="prose prose-dedcell max-w-none">
          <Mdx source={term.body} title={term.title} />
        </div>
      </div>

      <RelatedTerms terms={related} />
    </article>

      <LeadCta
        variant="light"
        eyebrow="Next Step"
        heading="Want this checked on your own systems?"
        body="We run the assessments this was written from. Tell us your stack and we will scope it — no commitment."
      />
    </>
  );
}
