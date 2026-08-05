import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

/**
 * The end-of-page conversion block.
 *
 * Exists because removing the pricing tables removed the only thing telling a
 * reader what to do next — and because the blog and glossary pages had no call
 * to action at all, which made every article a funnel dead end
 * (docs/seo/05-INTERNAL-LINKING.md: "no dead ends").
 *
 * Two routes out, deliberately: a form for people who want a scoping call, and
 * a plain mailto for people who will not fill in a form. Making both visible
 * costs nothing and catches the second group, who are otherwise simply lost.
 */

const EMAIL = 'jejo@dedcellsecurity.in';

type Props = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  /** `dark` for the inverted block used at the end of marketing pages. */
  variant?: 'light' | 'dark';
};

export function LeadCta({
  eyebrow = 'Get Started',
  heading = 'Not sure what you need assessed?',
  body = 'Tell us your stack in one line. We scope it, tell you what it costs, and you decide — no commitment, no sales sequence.',
  variant = 'dark',
}: Props) {
  const dark = variant === 'dark';

  return (
    <section
      className={`py-24 border-t ${dark ? 'bg-black border-white/10' : 'bg-surface border-black/10'}`}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className={`eyebrow ${dark ? 'eyebrow-invert' : ''}`}>{eyebrow}</p>

        <h2
          className={`mt-4 text-3xl md:text-5xl font-extrabold tracking-tight ${
            dark ? 'text-white' : 'text-black'
          }`}
        >
          {heading}
        </h2>

        <p
          className={`mt-6 text-lg leading-relaxed max-w-2xl mx-auto ${
            dark ? 'text-white/60' : 'text-gray-500'
          }`}
        >
          {body}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className={`w-full sm:w-auto font-sans font-semibold text-sm px-8 py-3.5 rounded-lg btn-press inline-flex items-center justify-center gap-2 ${
              dark ? 'bg-white text-black hover:bg-gray-300' : 'bg-black text-white hover:bg-gray-700'
            }`}
          >
            Request a Free Scoping Call
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>

          <a
            href={`mailto:${EMAIL}?subject=Security%20assessment%20enquiry`}
            className={`w-full sm:w-auto font-sans font-medium text-sm px-8 py-3.5 rounded-lg btn-press inline-flex items-center justify-center gap-2 border transition-all ${
              dark
                ? 'border-white/20 text-white hover:border-white/50 hover:bg-white/5'
                : 'border-black/20 text-black hover:border-black/50 hover:bg-black/5'
            }`}
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            {EMAIL}
          </a>
        </div>

        <p
          className={`mt-8 font-mono text-xs uppercase tracking-widest ${
            dark ? 'text-white/40' : 'text-gray-600'
          }`}
        >
          Mutual NDA before scoping · Reply within 4 business hours
        </p>
      </div>
    </section>
  );
}
