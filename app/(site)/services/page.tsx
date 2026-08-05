import type { Metadata } from 'next';
import { LeadCta } from '@/components/LeadCta';
import { Check, Cloud, Code2, Globe, Minus, Network, Server, Smartphone, Webhook, Wrench } from 'lucide-react';
/**
 * Ported from the `services` template string in
 * dedcell-security/public/index.html. Markup is unchanged apart from the
 * mechanical JSX conversion; what is new is the metadata below - this route
 * previously served the home page's title and canonical.
 */
export const metadata: Metadata = {
  title: "Penetration Testing Services",
  description:
    "Web app, API, network, cloud and mobile penetration testing for startups. Fixed-scope engagements, manual verification, complimentary retest.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Penetration Testing Services",
    description: "Web app, API, network, cloud and mobile penetration testing for startups. Fixed-scope engagements, manual verification, complimentary retest.",
    url: "/services",
  },
};
export default function ServicesPage() {
  return (
    <>
      <div className="pt-32 pb-24 border-b border-black/10">
                          <div className="max-w-7xl mx-auto px-6 reveal-item">
                              <span className="eyebrow block mb-4">What We Do</span>
                              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8">
                                  <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight leading-[1.1]">
                                      Security Services<br /><span className="text-gray-500">Built for Startups</span>
                                  </h1>
                                  <p className="font-mono text-sm text-gray-500 max-w-sm lg:text-right">
                                      No jargon. No bloat. Precise, actionable security work delivered by certified professionals.
                                  </p>
                              </div>
                          </div>
                      </div>

                      {/* 8 Services Grid */}
                      <section className="py-20">
                          <div className="max-w-7xl mx-auto px-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 hairline-grid rounded-xl overflow-hidden reveal-item">
                                  {/* Service 01 */}
                                  <div className="p-8 bg-white card-hover flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-8">
                                          <Globe className="w-8 h-8 text-black" />
                                          <span className="font-mono text-sm text-gray-700">01</span>
                                      </div>
                                      <h3 className="text-xl font-bold text-black mb-3">Web Application Penetration Testing</h3>
                                      <p className="text-sm text-gray-500 mb-8 flex-grow">Black-box assessment of your web apps - authentication, authorization, business logic, and the full OWASP Top 10.</p>
                                      <div className="flex flex-wrap gap-2 mt-auto">
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">OWASP Top 10</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">SQLi</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Logic Flaws</span>
                                      </div>
                                  </div>

                                  {/* Service 02 */}
                                  <div className="p-8 bg-white card-hover flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-8">
                                          <Webhook className="w-8 h-8 text-black" />
                                          <span className="font-mono text-sm text-gray-700">02</span>
                                      </div>
                                      <h3 className="text-xl font-bold text-black mb-3">API Security Assessment</h3>
                                      <p className="text-sm text-gray-500 mb-8 flex-grow">REST, GraphQL, and SOAP testing - auth, rate limiting, business logic, and API abuse.</p>
                                      <div className="flex flex-wrap gap-2 mt-auto">
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">REST</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">GraphQL</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">JWT / OAuth</span>
                                      </div>
                                  </div>

                                  {/* Service 03 */}
                                  <div className="p-8 bg-white card-hover flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-8">
                                          <Server className="w-8 h-8 text-black" />
                                          <span className="font-mono text-sm text-gray-700">03</span>
                                      </div>
                                      <h3 className="text-xl font-bold text-black mb-3">External Network Pentest</h3>
                                      <p className="text-sm text-gray-500 mb-8 flex-grow">Internet-facing infrastructure - firewalls, VPNs, public servers, and critical service misconfigurations.</p>
                                      <div className="flex flex-wrap gap-2 mt-auto">
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Firewall</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">VPN</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Enum</span>
                                      </div>
                                  </div>

                                  {/* Service 04 */}
                                  <div className="p-8 bg-white card-hover flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-8">
                                          <Network className="w-8 h-8 text-black" />
                                          <span className="font-mono text-sm text-gray-700">04</span>
                                      </div>
                                      <h3 className="text-xl font-bold text-black mb-3">Internal Network Assessment</h3>
                                      <p className="text-sm text-gray-500 mb-8 flex-grow">Internal infrastructure - Windows domains, Linux servers, privilege escalation, and lateral movement simulations.</p>
                                      <div className="flex flex-wrap gap-2 mt-auto">
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Windows AD</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">PrivEsc</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Lateral Movement</span>
                                      </div>
                                  </div>

                                  {/* Service 05 */}
                                  <div className="p-8 bg-white card-hover flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-8">
                                          <Cloud className="w-8 h-8 text-black" />
                                          <span className="font-mono text-sm text-gray-700">05</span>
                                      </div>
                                      <h3 className="text-xl font-bold text-black mb-3">Cloud Security Assessment</h3>
                                      <p className="text-sm text-gray-500 mb-8 flex-grow">AWS, Azure, and GCP architecture review - IAM policies, storage security, security groups, and misconfigurations.</p>
                                      <div className="flex flex-wrap gap-2 mt-auto">
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">AWS / Azure / GCP</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">IAM</span>
                                      </div>
                                  </div>

                                  {/* Service 06 */}
                                  <div className="p-8 bg-white card-hover flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-8">
                                          <Smartphone className="w-8 h-8 text-black" />
                                          <span className="font-mono text-sm text-gray-700">06</span>
                                      </div>
                                      <h3 className="text-xl font-bold text-black mb-3">Mobile Application Security</h3>
                                      <p className="text-sm text-gray-500 mb-8 flex-grow">Android and iOS - secure storage, certificate pinning bypass, auth flaws, backend API linking, and reverse engineering.</p>
                                      <div className="flex flex-wrap gap-2 mt-auto">
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Android / iOS</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Cert Pinning</span>
                                      </div>
                                  </div>

                                  {/* Service 07 */}
                                  <div className="p-8 bg-white card-hover flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-8">
                                          <Code2 className="w-8 h-8 text-black" />
                                          <span className="font-mono text-sm text-gray-700">07</span>
                                      </div>
                                      <h3 className="text-xl font-bold text-black mb-3">Secure Code Review</h3>
                                      <p className="text-sm text-gray-500 mb-8 flex-grow">Manual + static review across Java, Python, Node, Go, PHP, and C# - secrets, auth handling, and architecture.</p>
                                      <div className="flex flex-wrap gap-2 mt-auto">
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Manual Review</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">SAST</span>
                                      </div>
                                  </div>

                                  {/* Service 08 */}
                                  <div className="p-8 bg-white card-hover flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-8">
                                          <Wrench className="w-8 h-8 text-black" />
                                          <span className="font-mono text-sm text-gray-700">08</span>
                                      </div>
                                      <h3 className="text-xl font-bold text-black mb-3">Remediation Support</h3>
                                      <p className="text-sm text-gray-500 mb-8 flex-grow">We don't stop at findings - we help fix vulnerable code, secure APIs, harden cloud, and verify remediation before deploy.</p>
                                      <div className="flex flex-wrap gap-2 mt-auto">
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Fix Guidance</span>
                                          <span className="font-mono text-[10px] border border-black/10 px-2 py-1 text-gray-500 rounded">Verification</span>
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-8 border-t border-black/10 pt-6 reveal-item">
                                  <p className="font-mono text-[11px] text-gray-500 uppercase tracking-widest leading-loose">
                                      Also available: Compliance Readiness (ISO 27001, SOC 2, PCI DSS) · DevSecOps (CI/CD security, SAST/DAST) · Secure SDLC (threat modeling) · Security Training.
                                  </p>
                              </div>
                          </div>
                      </section>

                      {/* Pricing tables removed - scoping-led enquiry instead. */}
                      <LeadCta
                          eyebrow="Scoping"
                          heading="Every engagement is scoped, not priced off a list."
                          body="Cost depends on how many apps and APIs are in scope, how complex your auth is, and what you need delivered. Tell us your stack and we will come back with a fixed quote."
                      />
    </>
  );
}