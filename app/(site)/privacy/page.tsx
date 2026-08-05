import type { Metadata } from 'next';
/**
 * Ported from the `privacy` template string in
 * dedcell-security/public/index.html. Markup is unchanged apart from the
 * mechanical JSX conversion; what is new is the metadata below - this route
 * previously served the home page's title and canonical.
 */
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Dedcell Security collects, uses and protects personal data submitted through this site and during client engagements.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy",
    description: "How Dedcell Security collects, uses and protects personal data submitted through this site and during client engagements.",
    url: "/privacy",
  },
};
export default function PrivacyPage() {
  return (
    <>
      <div className="pt-32 pb-16 border-b border-black/10">
                          <div className="max-w-4xl mx-auto px-6 reveal-item">
                              <span className="eyebrow block mb-4">Legal</span>
                              <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight leading-[1.1] mb-6">Privacy Policy</h1>
                              <p className="font-mono text-sm text-gray-500">Last updated: 7 July 2026</p>
                          </div>
                      </div>
                      <section className="py-16">
                          <div className="max-w-4xl mx-auto px-6 reveal-item">
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">Dedcell Security ("Dedcell", "we", "us", or "our") operates the website dedcellsecurity.in. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using this website or contacting us, you agree to the practices described here.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Information We Collect</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">When you submit our contact form or request an audit, we collect the information you provide: your name, email address, company name, phone number (optional), and the message you send us. When you book a consultation, our scheduling provider collects the details needed to confirm your appointment. We also automatically receive standard technical data (such as IP address, browser type, and pages viewed) through our hosting provider for security and performance purposes.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">How We Use Your Information</h2>
                              <ul className="list-disc pl-6 space-y-2 text-sm md:text-base text-gray-500 leading-relaxed mb-4">
                                  <li>To respond to your enquiries and schedule consultations.</li>
                                  <li>To scope, deliver, and support security engagements you request.</li>
                                  <li>To operate, secure, and improve our website.</li>
                                  <li>To comply with legal and contractual obligations.</li>
                              </ul>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">We do not sell, rent, or trade your personal information, and we do not use it for advertising.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Confidentiality of Engagements</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">Any information you share as part of a security assessment - including architecture details, source code, credentials, and findings - is treated as strictly confidential. We sign a mutual Non-Disclosure Agreement before scoping and securely purge engagement data after the agreed retention period.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Service Providers</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">We rely on a small number of trusted providers to run our business, such as our website host (Vercel), Google Workspace for email and scheduling, and Google Fonts for typography. These providers process data only as needed to deliver their service and are bound by their own privacy commitments.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Data Retention</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">We keep enquiry and engagement records only as long as necessary for the purposes above or as required by law, after which they are deleted or anonymised.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Your Rights</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">You may request access to, correction of, or deletion of your personal information at any time by emailing us. We will respond within a reasonable period.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Changes to This Policy</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">We may update this Privacy Policy from time to time. Material changes will be reflected by the "Last updated" date above.</p>

                              <h2 className="text-xl md:text-2xl font-bold text-black mt-12 mb-4">Contact</h2>
                              <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-4">Questions about this policy or your data? Email <a href="mailto:dedcellsec@gmail.com" className="text-black border-b border-black/30 hover:border-black transition-colors">dedcellsec@gmail.com</a>.</p>

                              <div className="mt-12"><a href="/contact" className="font-mono text-sm text-black border-b border-black/30 hover:border-black pb-1 transition-all">Back to Contact</a></div>
                          </div>
                      </section>
    </>
  );
}