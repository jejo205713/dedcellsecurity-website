import type { Metadata } from 'next';
/**
 * Ported from the `terms` template string in
 * dedcell-security/public/index.html. Markup is unchanged apart from the
 * mechanical JSX conversion; what is new is the metadata below - this route
 * previously served the home page's title and canonical.
 */
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of the Dedcell Security website and our penetration testing engagements.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service",
    description: "The terms governing use of the Dedcell Security website and our penetration testing engagements.",
    url: "/terms",
  },
};
export default function TermsPage() {
  return (
    <>
      <div className="pt-32 pb-16 border-b border-black/10">
                          <div className="max-w-4xl mx-auto px-6 reveal-item">
                              <span className="eyebrow block mb-4">Legal</span>
                              <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight leading-[1.1] mb-6">Terms of Service</h1>
                              <p className="font-mono text-sm text-gray-500">Last updated: 7 July 2026</p>
                          </div>
                      </div>
                      <section className="py-16">
                          <div className="max-w-4xl mx-auto px-6 reveal-item">
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">These Terms of Service ("Terms") govern your use of the website dedcellsecurity.in operated by Dedcell Security ("Dedcell", "we", "us"). By accessing or using this website, you agree to these Terms. If you do not agree, please do not use the site.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Informational Purpose</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">The content on this website is provided for general information about our services. It does not constitute a binding offer, professional advice, or a guarantee of any specific outcome. All engagements are quoted individually after scoping.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Security Services and Authorization</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">All security testing and consulting engagements are governed by a separate written agreement, statement of work, and mutual Non-Disclosure Agreement executed between Dedcell and the client. We perform security testing only against systems for which the client has provided explicit written authorization and confirmed ownership or the right to test. Nothing on this website authorizes any testing of third-party systems.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Acceptable Use of the Website</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">You agree not to misuse this website, including by attempting to gain unauthorized access, disrupting its operation, or using it for any unlawful purpose. Responsible security research is welcomed under our Responsible Disclosure policy.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Intellectual Property</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">All content on this website, including text, graphics, logos, and the Dedcell Security name and mark, is the property of Dedcell or its licensors and is protected by applicable intellectual property laws. You may not reproduce or reuse it without our written permission.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">No Warranties</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">This website is provided on an "as is" and "as available" basis without warranties of any kind, express or implied. We do not warrant that the site will be uninterrupted, error-free, or free of harmful components.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Limitation of Liability</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">To the maximum extent permitted by law, Dedcell shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website. Liability arising from any engagement is governed by the terms of the relevant engagement agreement.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Governing Law</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the competent courts in India.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Contact</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">Questions about these Terms? Email <a href="mailto:dedcellsec@gmail.com" className="text-black border-b border-black/30 hover:border-black transition-colors">dedcellsec@gmail.com</a>.</p>

                              <div className="mt-12"><a href="/contact" className="font-mono text-sm text-black border-b border-black/30 hover:border-black pb-1 transition-all">Back to Contact</a></div>
                          </div>
                      </section>
    </>
  );
}