'use client';

import { usePathname } from 'next/navigation';

/**
 * Footer cell shown beside the MSME registration, on the training page only.
 * The footer lives in the shared site layout, hence the pathname check.
 */
export function SkillIndiaLogo() {
  const pathname = usePathname();
  if (pathname !== '/a-pent') return null;

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
