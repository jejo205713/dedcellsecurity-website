'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The pinned horizontal scroll on the home page's "Our Process" section.
 *
 * Replaces the GSAP + ScrollTrigger implementation at index.html:1493-1512:
 * pin `.pin-container`, then translate `.pin-wrap` on X by
 * `scrollWidth - innerWidth` over that scroll distance.
 *
 * Rebuilt without GSAP because GSAP + ScrollTrigger + Lenis + SplitType were
 * ~112KB of render-blocking JS for this one effect. Same behaviour, no library:
 * `position: sticky` does the pinning, a rAF-throttled scroll listener does the
 * translation.
 *
 * Behaviour preserved from the original:
 *  - Desktop/tablet only (>768px). Below that, the original skipped the pin
 *    entirely; here the track becomes a normal swipeable overflow-x region,
 *    which is better than the original's stacked-and-clipped fallback.
 *  - Recomputed on resize (`invalidateOnRefresh: true` in the GSAP config).
 *
 * Added: `prefers-reduced-motion` disables the pin. Hijacking someone's scroll
 * is exactly what that setting is meant to opt out of.
 */
export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [enabled, setEnabled] = useState(false);

  // Measure how far the track overflows the viewport, and decide whether to pin.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const wide = window.innerWidth > 768 && !reduced.matches;
      setEnabled(wide);
      setDistance(wide ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };

    measure();
    window.addEventListener('resize', measure);
    reduced.addEventListener('change', measure);
    return () => {
      window.removeEventListener('resize', measure);
      reduced.removeEventListener('change', measure);
    };
  }, [children]);

  // Drive the X translation from the section's progress through the viewport.
  useEffect(() => {
    if (!enabled || distance <= 0) {
      if (trackRef.current) trackRef.current.style.transform = '';
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // The section is `distance` taller than the viewport; progress runs 0→1
      // across exactly that extra height, which is what pins it.
      const start = section.offsetTop;
      const progress = (window.scrollY - start) / distance;
      const clamped = Math.min(1, Math.max(0, progress));
      track.style.transform = `translate3d(${-clamped * distance}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, distance]);

  if (!enabled) {
    // Mobile and reduced-motion: a plain horizontal scroll region. Swipeable,
    // keyboard-scrollable, and it never takes over vertical scrolling.
    return (
      <div className="mt-10 overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-8 w-max">{children}</div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} style={{ height: `calc(100vh + ${distance}px)` }} className="mt-10">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 px-[5vw] will-change-transform"
          style={{ width: 'max-content' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
