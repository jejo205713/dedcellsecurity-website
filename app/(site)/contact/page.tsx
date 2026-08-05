import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { Check, Mail } from 'lucide-react';
/**
 * Ported from the `contact` template string in
 * dedcell-security/public/index.html. Markup is unchanged apart from the
 * mechanical JSX conversion; what is new is the metadata below — this route
 * previously served the home page's title and canonical.
 */
export const metadata: Metadata = {
  title: "Request a Security Assessment",
  description:
    "Book a free 30-minute security consultation. NDA signed before scoping, response within 4 business hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Request a Security Assessment",
    description: "Book a free 30-minute security consultation. NDA signed before scoping, response within 4 business hours.",
    url: "/contact",
  },
};
export default function ContactPage() {
  return (
    <>
      <section className="pt-32 pb-24 min-h-screen flex items-center relative">
                          <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                                  {/* Left Info */}
                                  <div className="reveal-item">
                                      <span className="eyebrow block mb-4">Get Started</span>
                                      <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight leading-[1.1] mb-6">
                                          Know Your Risks<br /><span className="text-gray-500">Before Attackers Do.</span>
                                      </h1>
                                      <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-md">
                                          Get a free 30-minute security consultation. We'll assess your current posture and recommend exactly where to start.
                                      </p>

                                      <ul className="space-y-4 mb-12">
                                          <li className="flex items-center gap-3 text-sm text-gray-300">
                                              <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-black" /></div>
                                              No commitment required
                                          </li>
                                          <li className="flex items-center gap-3 text-sm text-gray-300">
                                              <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-black" /></div>
                                              NDA signed before we scope details
                                          </li>
                                          <li className="flex items-center gap-3 text-sm text-gray-300">
                                              <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-black" /></div>
                                              Response within 4 business hours
                                          </li>
                                      </ul>

                                      <div className="border-t border-black/10 pt-8 flex flex-col gap-4 font-mono text-sm">
                                          <a href="mailto:jejo@dedcellsecurity.in" className="text-black hover:text-gray-300 transition-colors flex items-center gap-3">
                                              <Mail className="w-4 h-4 text-gray-500" /> jejo@dedcellsecurity.in
                                          </a>
                                      </div>
                                  </div>

                                  {/* Right Form */}
                                  <ContactForm />
                              
                              </div>
                          </div>
                      </section>
    </>
  );
}