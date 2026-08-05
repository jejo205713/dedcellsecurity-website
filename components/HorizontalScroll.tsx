'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * The pinned horizontal scroll on the home page's "Our Process" section.
 *
 * Replaces the GSAP + ScrollTrigger implementation at index.html:1493-1512
 * pin the container, translate the track by `scrollWidth - innerWidth` across
 * that scroll distance - without the ~112KB of GSAP + ScrollTrigger + Lenis +
 * SplitType it needed. `position: sticky` does the pinning; a rAF-throttled
 * scroll listener does the translation.
 *
 * Three things broke the first version, all worth keeping in mind before
 * editing:
 *
 *  1. **An ancestor with `overflow: hidden` silently disables the pin.** A
 *     sticky element resolves against its nearest scrollport; an unbounded
 *     overflow container becomes that scrollport, so there is nothing to stick
 *     within and the element simply scrolls away. The parent section must not
 *     clip - the sticky element clips itself instead.
 *  2. **`offsetTop` is relative to the offsetParent, not the document.** Any
 *     positioned ancestor throws the maths off. Use getBoundingClientRect().
 *  3. **Measuring before layout settles gives a stale distance.** Web fonts and
 *     images change `scrollWidth` after mount, so re-measure via ResizeObserver
 *     rather than once on mount.
 *
 * Runs at every viewport width, unlike the original, which skipped the effect
 * below 768px and left the cards clipped. `prefers-reduced-motion` still opts
 * out to a plain swipeable row - hijacking scroll is exactly what that setting
 * is about.
 */
export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  const [distance, setDistance] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // How far the track overhangs the viewport - the exact scroll travel needed.
    setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Layout effect so the first paint already has the right height, avoiding a
  // visible jump from zero-height to full-height on load.
  useLayoutEffect(() => {
    if (reducedMotion) return;
    measure();

    const track = trackRef.current;
    if (!track) return;

    // Fires when fonts land, images decode, or the card content reflows
    // each of which changes scrollWidth after the initial measurement.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, reducedMotion, children]);

  useEffect(() => {
    if (reducedMotion || distance <= 0) {
      if (trackRef.current) trackRef.current.style.transform = '';
      return;
    }

    const update = () => {
      frameRef.current = 0;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      // Document-relative top. offsetTop would be measured against the nearest
      // positioned ancestor and silently drift.
      const top = section.getBoundingClientRect().top + window.scrollY;
      const progress = (window.scrollY - top) / distance;
      const clamped = Math.min(1, Math.max(0, progress));
      track.style.transform = `translate3d(${-clamped * distance}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!frameRef.current) frameRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [distance, reducedMotion]);

  if (reducedMotion) {
    // Swipeable, keyboard-scrollable, and it never takes over vertical scroll.
    return (
      <div className="mt-10 overflow-x-auto pb-6 px-[5vw]">
        <div className="flex gap-8 w-max">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="mt-10"
      // Extra height is what the pin consumes; without travel it collapses to
      // one viewport and simply renders as a static row.
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 px-[5vw] w-max will-change-transform"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
