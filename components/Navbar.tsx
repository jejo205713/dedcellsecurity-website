'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Ported from dedcell-security/public/index.html:245-275 (markup) and
 * :1390-1394 (behaviour).
 *
 * **All colour behaviour lives in globals.css**, in the `.nav-glass` rules
 * copied verbatim from the original. This component's only job is to toggle
 * that one class at the 40px threshold, exactly like the original handler:
 *
 *     if (window.scrollY > 40) { nav.classList.add('nav-glass');
 *                                nav.classList.remove('py-4'); }
 *     else                     { nav.classList.remove('nav-glass');
 *                                nav.classList.add('py-4'); }
 *
 * Do not reintroduce Tailwind colour utilities here. An earlier version did,
 * and silently diverged from the original in five places.
 *
 * The class hooks the CSS depends on - `.nav-text`, `#nav-links`,
 * `#nav-cta`, `#mobile-menu-btn` - must stay exactly as written.
 *
 * Blog and Glossary are additions; neither word appeared in the original site.
 */

const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // rAF-throttled; the original fired unthrottled on every scroll frame.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // A route change with the mobile menu still open leaves it covering the page.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <nav
      id="navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'nav-glass' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/LOGO-whiteeyes-300X300.png"
            alt="DEDCELL SECURITY"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border border-black/10 group-hover:border-black/30 transition-colors"
          />
          <span className="nav-text font-sans font-semibold text-sm text-black tracking-wide">
            DEDCELL <span className="text-gray-500 font-normal">SECURITY</span>
          </span>
        </Link>

        <div
          id="nav-links"
          className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? 'page' : undefined}
              className="text-gray-500 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/contact"
          id="nav-cta"
          className="hidden md:inline-flex items-center justify-center bg-black text-white font-sans font-semibold text-sm px-5 py-2 rounded-lg btn-press hover:bg-gray-700"
        >
          Request Assessment
        </Link>

        <button
          type="button"
          id="mobile-menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden text-black p-2"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
            className="w-6 h-6"
          >
            {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-black/10 flex flex-col font-mono text-sm uppercase tracking-widest p-6 gap-6 md:hidden"
        >
          <Link href="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-500 hover:text-black">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
