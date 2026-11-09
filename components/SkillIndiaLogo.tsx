'use client';

import { usePathname } from 'next/navigation';

/**
 * Footer cell shown beside the MSME registration, on the pages listed below.
 * The footer lives in the shared site layout, hence the pathname check.
 */
const PAGES_WITH_LOGO = ['/', '/a-pent'];

export function SkillIndiaLogo() {
  const pathname = usePathname();
  if (!PAGES_WITH_LOGO.includes(pathname)) return null;

  return (
    <div className="p-4 flex items-center border-t md:border-t-0 md:border-l border-black/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/skill-india.png"
        alt="Skill India - Kaushal Bharat, Kushal Bharat"
        width={291}
        height={240}
        loading="lazy"
        className="h-12 w-auto opacity-80"
      />
    </div>
  );
}
