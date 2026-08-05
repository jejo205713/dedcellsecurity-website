import type { Metadata } from 'next';
import { LeadCta } from '@/components/LeadCta';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { JsonLd } from '@/components/JsonLd';
import { getGlossaryTerms, groupByLetter } from '@/lib/content';
import { itemListSchema } from '@/lib/schema';
import { categoryName } from '@/lib/taxonomy';

export const metadata: Metadata = {
  title: 'Cybersecurity Glossary',
  description:
    'Plain-English definitions of the security terms that come up in penetration testing, SOC operations, compliance and incident response.',
  alternates: { canonical: '/glossary' },
};

export default function GlossaryHub() {
  const terms = getGlossaryTerms();
  const groups = groupByLetter(terms);

  return (
    <>
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
      <Breadcrumbs
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Glossary', href: '/glossary' },
        ]}
      />
      <JsonLd
        data={itemListSchema(
          terms.map((t) => ({ name: t.title, url: `/glossary/${t.slug}` })),
          'Cybersecurity Glossary',
        )}
      />

      <header className="mt-8">
        <p className="eyebrow">Reference</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-black">
          Cybersecurity <span className="text-gray-500">Glossary</span>
        </h1>
        <p className="mt-5 text-gray-500 max-w-2xl leading-relaxed">
          {terms.length} {terms.length === 1 ? 'term' : 'terms'}, written by the people who
          run the assessments — not summarised from other websites.
        </p>
      </header>

      {terms.length === 0 ? (
        <p className="mt-16 text-gray-500">No terms published yet.</p>
      ) : (
        <div className="mt-16 space-y-14">
          {groups.map(([letter, items]) => (
            <section key={letter}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-600 border-b border-black/10 pb-3">
                {letter}
              </h2>
              <ul className="mt-6 space-y-6">
                {items.map((t) => (
                  <li key={t.slug} className="border-l border-black/10 pl-5">
                    <Link
                      href={`/glossary/${t.slug}`}
                      className="font-sans font-semibold text-black underline decoration-black/25 underline-offset-4 hover:decoration-black"
                    >
                      {t.title}
                    </Link>
                    {t.definition && (
                      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                        {t.definition}
                      </p>
                    )}
                    {t.category && (
                      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-gray-600">
                        {categoryName(t.category)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
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
