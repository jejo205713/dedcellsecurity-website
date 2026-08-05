import type { Metadata } from 'next';
import { Award, Clock4, Lock, RefreshCw, Rocket, ShieldAlert } from 'lucide-react';
/**
 * Ported from the `about` template string in
 * dedcell-security/public/index.html. Markup is unchanged apart from the
 * mechanical JSX conversion; what is new is the metadata below - this route
 * previously served the home page's title and canonical.
 */
export const metadata: Metadata = {
  title: "About Us",
  description:
    "Founder-led offensive security for startups in India. Who we are, how we test, and why every finding is verified by hand before it reaches you.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us",
    description: "Founder-led offensive security for startups in India. Who we are, how we test, and why every finding is verified by hand before it reaches you.",
    url: "/about",
  },
};
export default function AboutPage() {
  return (
    <>
      <div className="pt-32 pb-24 border-b border-black/10 relative">
                          <div className="max-w-7xl mx-auto px-6 relative z-10 reveal-item">
                              <span className="eyebrow block mb-4">Why Dedcell</span>
                              <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight leading-[1.1] mb-8">
                                  We Do Security<br /><span className="text-gray-500">Differently.</span>
                              </h1>
                              <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                                  Traditional security firms are slow, expensive, and rely heavily on automated tools. We built Dedcell specifically for fast-moving startups. Manual testing, transparent communication, and clear reporting within days - not weeks.
                              </p>
                          </div>
                      </div>

                      {/* Differentiators */}
                      <section className="py-24">
                          <div className="max-w-7xl mx-auto px-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 hairline-grid rounded-xl overflow-hidden reveal-item">
                                  <div className="p-8 bg-white card-hover">
                                      <Rocket className="w-6 h-6 text-black mb-6" />
                                      <h3 className="text-lg font-bold text-black mb-3">Startup-First Approach</h3>
                                      <p className="text-sm text-gray-500 leading-relaxed">We built our processes for agile teams. No enterprise bloat, no multi-week onboarding delays. Just the rigorous security you actually need to close deals and protect users.</p>
                                  </div>
                                  <div className="p-8 bg-white card-hover">
                                      <Award className="w-6 h-6 text-black mb-6" />
                                      <h3 className="text-lg font-bold text-black mb-3">Certified Professionals</h3>
                                      <p className="text-sm text-gray-500 leading-relaxed">CEH, OSCP, CISSP certified team. Every engagement is led by a senior pentester with 5+ years of real-world offensive security experience. No junior analysts learning on your dime.</p>
                                  </div>
                                  <div className="p-8 bg-white card-hover">
                                      <Clock4 className="w-6 h-6 text-black mb-6" />
                                      <h3 className="text-lg font-bold text-black mb-3">Fast, Clear Reporting</h3>
                                      <p className="text-sm text-gray-500 leading-relaxed">Most firms take 2+ weeks to format a PDF. We deliver your complete report - executive summary + full technical findings with PoCs - within 5 business days of engagement end.</p>
                                  </div>
                                  <div className="p-8 bg-white card-hover">
                                      <ShieldAlert className="w-6 h-6 text-black mb-6" />
                                      <h3 className="text-lg font-bold text-black mb-3">Zero False Positives</h3>
                                      <p className="text-sm text-gray-500 leading-relaxed">Every finding is manually verified before it appears in your report. We don't hand you a 500-page automated scanner dump - just real, exploitable vulnerabilities.</p>
                                  </div>
                                  <div className="p-8 bg-white card-hover">
                                      <RefreshCw className="w-6 h-6 text-black mb-6" />
                                      <h3 className="text-lg font-bold text-black mb-3">Free Retest Included</h3>
                                      <p className="text-sm text-gray-500 leading-relaxed">After you remediate, we retest every finding at no extra cost (within 30 days). We don't close the loop until your vulnerabilities are actively proven fixed.</p>
                                  </div>
                                  <div className="p-8 bg-white card-hover">
                                      <Lock className="w-6 h-6 text-black mb-6" />
                                      <h3 className="text-lg font-bold text-black mb-3">NDA-Protected Always</h3>
                                      <p className="text-sm text-gray-500 leading-relaxed">We sign a mutual NDA before every scoping call. Your architecture, source code, and vulnerabilities stay strictly confidential and are purged post-engagement.</p>
                                  </div>
                              </div>
                          </div>
                      </section>

                      {/* Founding Partner Program (inverted: black surface, white type) */}
                      <section className="py-24 border-t border-black/10 bg-black">
                          <div className="max-w-4xl mx-auto px-6 text-center reveal-item">
                              <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
                                  Limited Availability
                              </div>
                              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                                  The Founding Partner Program
                              </h2>
                              <p className="text-white/60 mb-10 leading-relaxed text-lg">
                                  We are taking on a small number of early-stage startups as founding partners. In exchange for case-study participation and a testimonial, you get the same comprehensive, senior-led offensive security we run for everyone else - on partnership terms we agree during scoping.
                              </p>
                              <a href="/contact" className="inline-flex bg-white text-black font-sans font-semibold text-sm px-8 py-3.5 rounded-lg btn-press items-center justify-center hover:bg-white/85 transition-colors">
                                  Apply for Partnership
                              </a>
                          </div>
                      </section>
    </>
  );
}