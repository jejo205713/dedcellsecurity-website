import Link from 'next/link';

/**
 * Ported from dedcell-security/public/index.html:280-341.
 *
 * Changes from the live version, both deliberate:
 *  - A "Resources" column was added for Blog and Glossary. The live footer had
 *    no route to either, which would have left both hubs reachable only from
 *    the navbar — a dead end for crawlers arriving on a deep page.
 *  - The copyright year is computed rather than hard-coded.
 */

const SERVICES = [
  'Web App Pentest',
  'API Security',
  'Cloud Assessment',
  'Mobile Security',
  'Code Review',
];

const CERTIFICATIONS = ['CEH', 'OSCP', 'CISSP', 'ISO 27001'];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/LOGO-whiteeyes-300X300.png"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-black/10"
              />
              <span className="font-sans font-semibold text-sm text-black tracking-wide">
                DEDCELL <span className="text-gray-500 font-normal">SECURITY</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
              Expert-led offensive security for modern startups across India. We find your
              vulnerabilities before attackers do.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/dedcell-security"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dedcell Security on LinkedIn"
                className="w-8 h-8 border border-black/10 flex items-center justify-center text-gray-600 hover:text-black hover:border-black/30 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="1" y="1" width="12" height="12" rx="2" />
                  <path d="M4 6v4M4 4.5v.01M7 10V8a1 1 0 0 1 2 0v2M7 6v4" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/dedcell_security/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dedcell Security on Instagram"
                className="w-8 h-8 border border-black/10 flex items-center justify-center text-gray-600 hover:text-black hover:border-black/30 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <rect x="1" y="1" width="12" height="12" rx="3.5" />
                  <circle cx="7" cy="7" r="2.75" />
                  <path d="M10.4 3.6v.01" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-xs text-black uppercase tracking-widest mb-6">Services</h2>
            <ul className="space-y-4 font-mono text-xs text-gray-500">
              {SERVICES.map((label) => (
                <li key={label}>
                  <Link href="/services" className="hover:text-black transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xs text-black uppercase tracking-widest mb-6">Resources</h2>
            <ul className="space-y-4 font-mono text-xs text-gray-500">
              <li>
                <Link href="/blog" className="hover:text-black transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-black transition-colors">
                  Security Glossary
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-black transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-black transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border border-black/10 rounded-lg p-4 flex flex-wrap items-center gap-4 mb-10 bg-black/[0.02]">
          <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Certified:</span>
          {CERTIFICATIONS.map((cert) => (
            <span
              key={cert}
              className="font-mono text-xs text-white border border-black/20 rounded px-2 py-1 bg-black"
            >
              {cert}
            </span>
          ))}
        </div>

        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-gray-600">
            © {new Date().getFullYear()} Dedcell Security. All rights reserved.
          </p>
          <div className="flex gap-6 font-mono text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-black transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-black transition-colors">
              Terms
            </Link>
            <Link href="/disclosure" className="hover:text-black transition-colors">
              Responsible Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
