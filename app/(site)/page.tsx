import type { Metadata } from 'next';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { AlertTriangle, ArrowRight, BadgeCheck, Banknote, Clock, Cloud, Globe, PowerOff, Rocket, Server, ShieldCheck, Sparkles, Target, Users, Webhook } from 'lucide-react';
/**
 * Ported from the `home` template string in
 * dedcell-security/public/index.html. Markup is unchanged apart from the
 * mechanical JSX conversion; what is new is the metadata below - this route
 * previously served the home page's title and canonical.
 */
export const metadata: Metadata = {
  description:
    "Expert-led offensive security for modern startups. Web, API, cloud and mobile penetration testing without the enterprise bloat.",
  alternates: { canonical: '/' },
};
export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
                      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 overflow-hidden">
                          <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0,0,0,0.04) 0%, transparent 70%)" }}></div>

                          {/* Decorative brackets */}
                          <div className="hidden md:block absolute top-24 left-6 md:left-12 w-12 h-12 border-t border-l border-black/10 z-0"></div>
                          <div className="hidden md:block absolute top-24 right-6 md:right-12 w-12 h-12 border-t border-r border-black/10 z-0"></div>
                          <div className="hidden md:block absolute bottom-12 left-6 md:left-12 w-12 h-12 border-b border-l border-black/10 z-0"></div>
                          <div className="hidden md:block absolute bottom-12 right-6 md:right-12 w-12 h-12 border-b border-r border-black/10 z-0"></div>

                          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center w-full">
                              <h1 className="reveal font-sans font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-black max-w-4xl mb-6 visible">Secure Your Business.</h1>

                              <p className="text-base md:text-lg text-gray-500 max-w-2xl mb-8 leading-relaxed reveal-item">
                                  Enterprise-grade cybersecurity built for startups. We find your vulnerabilities before attackers do - and we fix them.
                              </p>

                              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 reveal-item">
                                  <a href="/contact" className="w-full sm:w-auto bg-black text-white font-sans font-semibold text-sm px-8 py-3.5 rounded-lg btn-press flex items-center justify-center gap-2 hover:bg-gray-800">
                                      Request a Free Audit <ArrowRight className="w-4 h-4" />
                                  </a>
                                  <a href="/services" className="w-full sm:w-auto border border-black/20 bg-transparent text-black font-sans font-medium text-sm px-8 py-3.5 rounded-lg btn-press hover:border-black/50 hover:bg-black/5 transition-all flex items-center justify-center">
                                      View Services
                                  </a>
                              </div>

                              {/* Defense Engine Telemetry Card (inverted: black surface, white type) */}
                              <div className="w-full max-w-5xl border border-white/10 rounded-xl bg-black text-white card-hover-invert p-6 sm:p-8 text-left relative overflow-hidden reveal-item">

                                  {/* Header bar of the visual card */}
                                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/15">
                                      <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 rounded-full bg-red-500 border border-red-400/30"></div>
                                          <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300/30"></div>
                                          <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400/30"></div>
                                          <span className="font-mono text-xs text-white/50 ml-2">Dedcell Defense Engine</span>
                                      </div>
                                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-full bg-white/10 text-white font-mono text-xs">
                                          <ShieldCheck className="w-3.5 h-3.5 text-white" /> Status: Secured
                                      </div>
                                  </div>

                                  {/* Dashboard Telemetry Stats */}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                      <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10">
                                          <div className="font-mono text-xs text-white/50 mb-1">Testing Methodology</div>
                                          <div className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                              Manual + SAST <BadgeCheck className="w-4 h-4 text-white" />
                                          </div>
                                      </div>
                                      <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10">
                                          <div className="font-mono text-xs text-white/50 mb-1">Turnaround Time</div>
                                          <div className="text-lg md:text-xl font-bold text-white">5 Business Days</div>
                                      </div>
                                      <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10">
                                          <div className="font-mono text-xs text-white/50 mb-1">Retest SLA</div>
                                          <div className="text-lg md:text-xl font-bold text-white">Complimentary</div>
                                      </div>
                                  </div>

                                  <div className="p-4 rounded-xl bg-white/[0.06] border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/60">
                                      <span>OWASP Top 10 · API Security · AWS/GCP Security · ISO 27001 Alignment</span>
                                      <span className="text-white flex items-center gap-1 font-semibold">100% Verified Findings <Sparkles className="w-3.5 h-3.5 text-white" /></span>
                                  </div>
                              </div>

                          </div>
                      </section>

                      {/* Pain / Reality Section */}
                      <section className="py-24 border-t border-black/10">
                          <div className="max-w-7xl mx-auto px-6">
                              <div className="mb-16 reveal-item">
                                  <span className="eyebrow block mb-4">The Reality</span>
                                  <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-6">
                                      Startups Are the <span className="text-gray-500">Easiest Target.</span>
                                  </h2>
                                  <p className="font-mono text-sm text-gray-500 max-w-3xl leading-relaxed">
                                      Attackers know scaling engineering teams defer security to ship features. They exploit it daily. The question isn't if you'll be targeted - it's whether you'll be ready.
                                  </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 hairline-grid rounded-xl overflow-hidden reveal-item">
                                  <div className="p-8 relative card-hover bg-white">
                                      <Target className="w-6 h-6 text-gray-600 mb-6" />
                                      <div className="text-4xl font-bold text-black tabular-nums mb-3">43%</div>
                                      <p className="text-sm text-gray-500 leading-relaxed">of all cyberattacks specifically target smaller, fast-growing companies.</p>
                                  </div>
                                  <div className="p-8 relative card-hover bg-white">
                                      <Banknote className="w-6 h-6 text-gray-600 mb-6" />
                                      <div className="text-4xl font-bold text-black tabular-nums mb-3">₹7 Cr+</div>
                                      <p className="text-sm text-gray-500 leading-relaxed">average cost of a data breach for Indian mid-market startups in 2024.</p>
                                  </div>
                                  <div className="p-8 relative card-hover bg-white">
                                      <Clock className="w-6 h-6 text-gray-600 mb-6" />
                                      <div className="text-4xl font-bold text-black tabular-nums mb-3">207 days</div>
                                      <p className="text-sm text-gray-500 leading-relaxed">average time to identify a breach without proactive security monitoring.</p>
                                  </div>
                                  <div className="p-8 relative card-hover bg-white">
                                      <PowerOff className="w-6 h-6 text-gray-600 mb-6" />
                                      <div className="text-4xl font-bold text-black tabular-nums mb-3">60%</div>
                                      <p className="text-sm text-gray-500 leading-relaxed">of un-funded tech companies shut down within 6 months of a major breach.</p>
                                  </div>
                              </div>

                              <div className="mt-12 p-8 border border-black/10 rounded-xl bg-black/[0.01] flex flex-col md:flex-row items-start md:items-center gap-6 reveal-item">
                                  <div className="p-3 bg-black/5 rounded-full shrink-0">
                                      <AlertTriangle className="w-6 h-6 text-black" />
                                  </div>
                                  <div>
                                      <h4 className="text-black font-bold text-lg mb-1">"We're too small to be targeted."</h4>
                                      <p className="font-mono text-sm text-gray-500">That's exactly what attackers count on. Automated scanners don't discriminate by valuation - they exploit any open vulnerability they find.</p>
                                  </div>
                              </div>
                          </div>
                      </section>

                      {/* TrustBar (inverted: black surface, white type) */}
                      <section className="py-14 bg-black border-t border-black/10">
                          <div className="max-w-7xl mx-auto px-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 hairline-grid-invert rounded-xl overflow-hidden reveal-item">
                                  <div className="p-8 bg-black card-hover-invert">
                                      <Rocket className="w-5 h-5 text-white/50 mb-4" />
                                      <h3 className="text-white font-bold mb-2">Built for Startups</h3>
                                      <p className="text-sm text-white/60">Security processes designed for lean engineering teams - zero enterprise bloat.</p>
                                  </div>
                                  <div className="p-8 bg-black card-hover-invert">
                                      <ShieldCheck className="w-5 h-5 text-white/50 mb-4" />
                                      <h3 className="text-white font-bold mb-2">Affordable & Fixed</h3>
                                      <p className="text-sm text-white/60">Enterprise-grade protection at prices that make sense for seed to Series A businesses.</p>
                                  </div>
                                  <div className="p-8 bg-black card-hover-invert">
                                      <Users className="w-5 h-5 text-white/50 mb-4" />
                                      <h3 className="text-white font-bold mb-2">Founder-Led Team</h3>
                                      <p className="text-sm text-white/60">You talk directly to senior security engineers, not account managers.</p>
                                  </div>
                              </div>
                          </div>
                      </section>

                      {/* Services Teaser (Grid) */}
                      <section className="py-24 border-t border-black/10 bg-white/40 relative">
                          <div className="max-w-7xl mx-auto px-6 relative z-10">
                              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 reveal-item gap-6">
                                  <div>
                                      <span className="eyebrow block mb-4">What We Do</span>
                                      <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight">
                                          Offensive Security<br /><span className="text-gray-500">For Modern Tech Stacks</span>
                                      </h2>
                                  </div>
                                  <a href="/services" className="font-mono text-sm text-black hover:text-gray-300 border-b border-black/30 hover:border-black pb-1 transition-all flex items-center gap-2">
                                      View Full Capabilities <ArrowRight className="w-4 h-4" />
                                  </a>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 hairline-grid rounded-xl overflow-hidden reveal-item">
                                  {/* Mini cards linking to services */}
                                  <a href="/services" className="block p-6 bg-white card-hover group">
                                      <div className="flex justify-between items-start mb-10">
                                          <Globe className="w-6 h-6 text-gray-500 group-hover:text-black transition-colors" />
                                          <span className="font-mono text-xs text-gray-700">01</span>
                                      </div>
                                      <h3 className="text-black font-bold mb-2 group-hover:text-black">Web App Pentest</h3>
                                      <p className="text-sm text-gray-600 line-clamp-2">Deep authentication, logic, and OWASP Top 10 assessment.</p>
                                  </a>
                                  <a href="/services" className="block p-6 bg-white card-hover group">
                                      <div className="flex justify-between items-start mb-10">
                                          <Webhook className="w-6 h-6 text-gray-500 group-hover:text-black transition-colors" />
                                          <span className="font-mono text-xs text-gray-700">02</span>
                                      </div>
                                      <h3 className="text-black font-bold mb-2 group-hover:text-black">API Security</h3>
                                      <p className="text-sm text-gray-600 line-clamp-2">REST, GraphQL, auth flaws, and business logic bypasses.</p>
                                  </a>
                                  <a href="/services" className="block p-6 bg-white card-hover group">
                                      <div className="flex justify-between items-start mb-10">
                                          <Server className="w-6 h-6 text-gray-500 group-hover:text-black transition-colors" />
                                          <span className="font-mono text-xs text-gray-700">03</span>
                                      </div>
                                      <h3 className="text-black font-bold mb-2 group-hover:text-black">External Network</h3>
                                      <p className="text-sm text-gray-600 line-clamp-2">Internet-facing infrastructure and service misconfigurations.</p>
                                  </a>
                                  <a href="/services" className="block p-6 bg-white card-hover group">
                                      <div className="flex justify-between items-start mb-10">
                                          <Cloud className="w-6 h-6 text-gray-500 group-hover:text-black transition-colors" />
                                          <span className="font-mono text-xs text-gray-700">05</span>
                                      </div>
                                      <h3 className="text-black font-bold mb-2 group-hover:text-black">Cloud Assessment</h3>
                                      <p className="text-sm text-gray-600 line-clamp-2">AWS, Azure, GCP review - IAM, storage, and architecture.</p>
                                  </a>
                              </div>
                          </div>
                      </section>

                      {/* Methodology / Horizontal Scroll */}
                      {/* No overflow-hidden here: it would become the scrollport for the
                          sticky pin inside HorizontalScroll and stop it sticking. The
                          clipping happens on the sticky element itself instead. */}
                      <section className="border-t border-black/10 bg-black" id="process-section">
                          <div className="pt-24 px-6 max-w-7xl mx-auto">
                              <span className="eyebrow eyebrow-invert block mb-4">Our Process</span>
                              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-8">
                                  How We <span className="text-white/50">Break In</span><br />(To Keep You Safe)
                              </h2>
                          </div>

                          {/* Horizontal Scroll Container */}
                          <HorizontalScroll>
                                  {/* Card 1 */}
                                  <div className="w-[85vw] max-w-[450px] shrink-0 bg-black border border-white/15 rounded-2xl p-10 flex flex-col justify-between h-[450px]">
                                      <div>
                                          <span className="font-mono text-sm text-white/50 mb-6 block">STEP 01</span>
                                          <h3 className="text-3xl font-bold text-white mb-4">Reconnaissance</h3>
                                          <p className="text-white/60 leading-relaxed">Passive and active information gathering. We map your entire attack surface before writing a single line of exploit code.</p>
                                      </div>
                                      <div className="border border-white/10 bg-white/[0.06] rounded-lg p-4 font-mono text-[11px] text-white/60 uppercase tracking-widest mt-8">
                                          OSINT · DNS Enum · Subdomain Discovery · Tech Stack Fingerprinting
                                      </div>
                                  </div>

                                  {/* Card 2 */}
                                  <div className="w-[85vw] max-w-[450px] shrink-0 bg-black border border-white/15 rounded-2xl p-10 flex flex-col justify-between h-[450px]">
                                      <div>
                                          <span className="font-mono text-sm text-white/50 mb-6 block">STEP 02</span>
                                          <h3 className="text-3xl font-bold text-white mb-4">Threat Modeling</h3>
                                          <p className="text-white/60 leading-relaxed">We identify what matters most to your business and model adversarial scenarios based on your specific risk profile and tech stack.</p>
                                      </div>
                                      <div className="border border-white/10 bg-white/[0.06] rounded-lg p-4 font-mono text-[11px] text-white/60 uppercase tracking-widest mt-8">
                                          Asset ID · Risk Scoring · Attack Vectors · Priority Matrix
                                      </div>
                                  </div>

                                  {/* Card 3 */}
                                  <div className="w-[85vw] max-w-[450px] shrink-0 bg-black border border-white/15 rounded-2xl p-10 flex flex-col justify-between h-[450px]">
                                      <div>
                                          <span className="font-mono text-sm text-white/50 mb-6 block">STEP 03</span>
                                          <h3 className="text-3xl font-bold text-white mb-4">Exploitation</h3>
                                          <p className="text-white/60 leading-relaxed">Controlled, safe execution of discovered vulnerabilities to prove real-world impact - absolutely zero false positives.</p>
                                      </div>
                                      <div className="border border-white/10 bg-white/[0.06] rounded-lg p-4 font-mono text-[11px] text-white/60 uppercase tracking-widest mt-8">
                                          Manual Testing · Logic Flaws · Chain Attacks · Privilege Escalation
                                      </div>
                                  </div>

                                  {/* Card 4 */}
                                  <div className="w-[85vw] max-w-[450px] shrink-0 bg-black border border-white/15 rounded-2xl p-10 flex flex-col justify-between h-[450px]">
                                      <div>
                                          <span className="font-mono text-sm text-white/50 mb-6 block">STEP 04</span>
                                          <h3 className="text-3xl font-bold text-white mb-4">Post-Exploitation</h3>
                                          <p className="text-white/60 leading-relaxed">We determine what an attacker could actually do once inside - lateral movement, data access, and persistence.</p>
                                      </div>
                                      <div className="border border-white/10 bg-white/[0.06] rounded-lg p-4 font-mono text-[11px] text-white/60 uppercase tracking-widest mt-8">
                                          Lateral Movement · Data Access · Persistence · Impact Assessment
                                      </div>
                                  </div>

                                  {/* Card 5 */}
                                  <div className="w-[85vw] max-w-[450px] shrink-0 bg-black border border-white/15 rounded-2xl p-10 flex flex-col justify-between h-[450px]">
                                      <div>
                                          <span className="font-mono text-sm text-white/50 mb-6 block">STEP 05</span>
                                          <h3 className="text-3xl font-bold text-white mb-4">Reporting</h3>
                                          <p className="text-white/60 leading-relaxed">Executive summary for leadership + detailed technical breakdown with exact reproduction steps for your engineering team.</p>
                                      </div>
                                      <div className="border border-white/10 bg-white/[0.06] rounded-lg p-4 font-mono text-[11px] text-white/60 uppercase tracking-widest mt-8">
                                          Severity Ratings · PoC Evidence · Remediation Steps
                                      </div>
                                  </div>

                                  {/* Card 6 */}
                                  <div className="w-[85vw] max-w-[450px] shrink-0 bg-black border border-white/15 rounded-2xl p-10 flex flex-col justify-between h-[450px]">
                                      <div>
                                          <span className="font-mono text-sm text-white/50 mb-6 block">STEP 06</span>
                                          <h3 className="text-3xl font-bold text-white mb-4">Remediation Support</h3>
                                          <p className="text-white/60 leading-relaxed">We don't just find problems - we help you fix them. We conduct a free retest after remediation to verify all findings are closed.</p>
                                      </div>
                                      <div className="border border-white/10 bg-white/[0.06] rounded-lg p-4 font-mono text-[11px] text-white/60 uppercase tracking-widest mt-8">
                                          Fix Guidance · Config Hardening · Verification Retest
                                      </div>
                                  </div>
                          </HorizontalScroll>
                      </section>

                      {/* Testimonials */}
                      <section className="py-24 border-t border-black/10 bg-white">
                          <div className="max-w-7xl mx-auto px-6">
                              <div className="mb-16 reveal-item">
                                  <span className="eyebrow block mb-4">Client Feedback</span>
                                  <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight">
                                      Trusted by Businesses<br /><span className="text-gray-500">Across India</span>
                                  </h2>
                              </div>

                              {/* Client logos */}
                              <div className="mb-14 reveal-item border-t border-b border-black/10 py-8">
                                  <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500 block mb-7 text-center md:text-left">Selected Clients</span>
                                  {/* Heights are set per logo, not shared: these lockups run from 1.4:1 to 3.5:1,
                                       so a single height would make the wide ones dominate the row. */}
                                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-14 gap-y-8">
                                      <img src="/logos/tstechy.png" alt="TStechy" width="468" height="246" loading="lazy" className="client-logo h-11 md:h-12 w-auto" />
                                      <img src="/logos/smi-tech-group.png" alt="SMI Tech Group Pvt Ltd" width="178" height="74" loading="lazy" className="client-logo h-8 md:h-9 w-auto" />
                                      <img src="/logos/aegisz.png" alt="Aegisz" width="900" height="619" loading="lazy" className="client-logo h-12 md:h-14 w-auto" />
                                      <img src="/logos/metier-genesis.png" alt="Metier Genesis" width="400" height="115" loading="lazy" className="client-logo h-7 md:h-8 w-auto" />
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 hairline-grid rounded-xl overflow-hidden reveal-item">
                                  {/* Testimonial 1 */}
                                  <div className="p-8 bg-white card-hover flex flex-col">
                                      <div className="font-display text-5xl text-gray-700 leading-none mb-6">&ldquo;</div>
                                      <p className="text-sm text-gray-500 leading-relaxed flex-grow mb-8">
                                          Dedcell Security found <mark className="hl">3 critical vulnerabilities</mark> in our customer portal that we had no idea about. Their report was clear, actionable, and delivered faster than any vendor we've worked with. Highly recommend for any startup that takes security seriously.
                                      </p>
                                      <div className="flex items-center gap-3 mt-auto">
                                          <div className="w-9 h-9 bg-black/5 border border-black/10 flex items-center justify-center font-mono text-xs text-gray-500 shrink-0">TS</div>
                                          <div className="min-w-0 flex-grow">
                                              <div className="text-black font-semibold text-sm">TStechy</div>
                                              <div className="font-mono text-[11px] text-gray-500 truncate">Founder &amp; CTO · Tech Startup</div>
                                          </div>
                                          <span className="font-mono text-[10px] text-gray-500 border border-black/10 px-2 py-1 rounded shrink-0">LinkedIn</span>
                                      </div>
                                  </div>

                                  {/* Testimonial 2 */}
                                  <div className="p-8 bg-white card-hover flex flex-col">
                                      <div className="font-display text-5xl text-gray-700 leading-none mb-6">&ldquo;</div>
                                      <p className="text-sm text-gray-500 leading-relaxed flex-grow mb-8">
                                          Dedcell Security ran a full penetration test on our B2B SaaS platform and <mark className="hl">uncovered 23 vulnerabilities</mark> across the application - several of them critical. The findings were precise, well-documented, and came with clear remediation steps our engineers could act on immediately.
                                      </p>
                                      <div className="flex items-center gap-3 mt-auto">
                                          <div className="w-9 h-9 bg-black/5 border border-black/10 flex items-center justify-center font-mono text-xs text-gray-500 shrink-0">SM</div>
                                          <div className="min-w-0 flex-grow">
                                              <div className="text-black font-semibold text-sm">SMI Tech Group Pvt Ltd</div>
                                              <div className="font-mono text-[11px] text-gray-500 truncate">B2B SaaS Platform · India</div>
                                          </div>
                                          <span className="font-mono text-[10px] text-gray-500 border border-black/10 px-2 py-1 rounded shrink-0">Verified Client</span>
                                      </div>
                                  </div>

                                  {/* Testimonial 3 */}
                                  <div className="p-8 bg-white card-hover flex flex-col">
                                      <div className="font-display text-5xl text-gray-700 leading-none mb-6">&ldquo;</div>
                                      <p className="text-sm text-gray-500 leading-relaxed flex-grow mb-8">
                                          After a near-miss phishing incident, we engaged Dedcell for security training. They customized the entire program for our 40-person team. <mark className="hl">Six months later, zero incidents.</mark> The ROI is obvious.
                                      </p>
                                      <div className="flex items-center gap-3 mt-auto">
                                          <div className="w-9 h-9 bg-black/5 border border-black/10 flex items-center justify-center font-mono text-xs text-gray-500 shrink-0">KM</div>
                                          <div className="min-w-0 flex-grow">
                                              <div className="text-black font-semibold text-sm">Karthik M.</div>
                                              <div className="font-mono text-[11px] text-gray-500 truncate">COO · Logistics SaaS</div>
                                          </div>
                                          <span className="font-mono text-[10px] text-gray-500 border border-black/10 px-2 py-1 rounded shrink-0">Direct Referral</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </section>

                      {/* CTA (inverted: black surface, white type) */}
                      <section className="py-20 border-t border-black/10 bg-black text-center">
                          <div className="max-w-3xl mx-auto px-6 reveal-item">
                              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to secure your product?</h2>
                              <p className="text-white/60 mb-10">Get a free consultation. We'll assess your current posture and recommend exactly where to start.</p>
                              <a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0X10wq2o0TSsHS7EYnilZKhVqtEnwPFG-KcyvyX1n1BA72yDTabZ7egfXZdtnpDD2CVNMJ0dvl?gv=true" target="_blank" rel="noopener noreferrer" className="inline-flex bg-white text-black font-sans font-semibold text-sm px-8 py-3.5 rounded-lg btn-press items-center justify-center gap-2 hover:bg-white/85">
                                  Book Discovery Call <ArrowRight className="w-4 h-4" />
                              </a>
                          </div>
                      </section>
    </>
  );
}