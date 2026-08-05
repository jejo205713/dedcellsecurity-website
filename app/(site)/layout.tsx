import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { Navbar } from '@/components/Navbar';
import { organizationSchema } from '@/lib/schema';

/**
 * Chrome for every public page. The navbar is fixed, so main carries the 4rem
 * top offset that the live site got from its hero's own padding.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="noise" aria-hidden="true" />
      {/* Declares the company + logo to Google on every public page. */}
      <JsonLd data={organizationSchema()} />
      <Navbar />
      {/*
        No top padding here, deliberately. The navbar is fixed and *transparent*
        until 40px of scroll, so pages must render underneath it - that overlap
        is the whole effect. Every page supplies its own top clearance (the hero
        uses pt-20, inner pages pt-32). Adding pt-16 here pushed content below
        the bar and made the transparent state look like a plain white strip.
      */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
