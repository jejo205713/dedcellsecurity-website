import type { Metadata } from 'next';
/**
 * Ported from the `disclosure` template string in
 * dedcell-security/public/index.html. Markup is unchanged apart from the
 * mechanical JSX conversion; what is new is the metadata below — this route
 * previously served the home page's title and canonical.
 */
export const metadata: Metadata = {
  title: "Responsible Disclosure Policy",
  description:
    "How to report a security vulnerability in Dedcell Security systems, what we commit to in return, and our safe-harbour terms.",
  alternates: { canonical: "/disclosure" },
  openGraph: {
    title: "Responsible Disclosure Policy",
    description: "How to report a security vulnerability in Dedcell Security systems, what we commit to in return, and our safe-harbour terms.",
    url: "/disclosure",
  },
};
export default function DisclosurePage() {
  return (
    <>
      <div className="pt-32 pb-16 border-b border-black/10">
                          <div className="max-w-4xl mx-auto px-6 reveal-item">
                              <span className="eyebrow block mb-4">Security</span>
                              <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight leading-[1.1] mb-6">Responsible Disclosure</h1>
                              <p className="font-mono text-sm text-gray-500">Last updated: 7 July 2026</p>
                          </div>
                      </div>
                      <section className="py-16">
                          <div className="max-w-4xl mx-auto px-6 reveal-item">
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">Security is our craft, so we hold our own systems to the same standard. If you believe you have found a security vulnerability in dedcellsecurity.in or any asset we own, we want to hear from you and we will work with you to resolve it.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Scope</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">This policy applies to the website dedcellsecurity.in and infrastructure clearly owned and operated by Dedcell Security. Client systems are strictly out of scope and must never be tested.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Guidelines</h2>
                              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-gray-500 leading-relaxed mb-4">
                                  <li>Act in good faith and avoid privacy violations, data destruction, or service disruption.</li>
                                  <li>Only interact with accounts you own or have explicit permission to access.</li>
                                  <li>Give us a reasonable opportunity to remediate before any public disclosure.</li>
                                  <li>Do not use automated tooling in a way that degrades our services.</li>
                              </ul>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Out of Scope</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">Denial-of-service attacks, social engineering, physical attacks, spam, and reports from automated scanners without a demonstrable, exploitable impact are out of scope.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Safe Harbor</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">If you make a good-faith effort to comply with this policy during your research, we will consider your actions authorized, will not pursue legal action against you, and will work with you to understand and resolve the issue quickly.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">How to Report</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">Email <a href="mailto:dedcellsec@gmail.com" className="text-black border-b border-black/30 hover:border-black transition-colors">dedcellsec@gmail.com</a> with a clear description of the issue, the affected URL or component, and steps to reproduce (a proof of concept helps). We aim to acknowledge reports within a few business days and will keep you updated on remediation.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Recognition</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">We do not currently run a paid bug-bounty program, but we are glad to publicly credit researchers who report valid issues, with your permission.</p>

                              <div className="mt-12"><a href="/contact" className="font-mono text-sm text-black border-b border-black/30 hover:border-black pb-1 transition-all">Back to Contact</a></div>
                          </div>
                      </section>
    </>
  );
}