import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Inertial smooth scrolling, wired into GSAP's ticker. Skipped for reduced motion. */
export function initSmoothScroll() {
  if (!window.matchMedia(MOTION_QUERY).matches) return () => {};
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis?.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
export const DESKTOP_QUERY = '(min-width: 900px)';

export interface MotionConditions {
  motion: boolean;
  desktop: boolean;
}

/**
 * Runs `setup` inside gsap.matchMedia scoped to a root element. Everything it creates is
 * reverted on cleanup, and content stays fully visible when reduced motion is on.
 */
export function useGsapScope(
  scope: RefObject<HTMLElement | null>,
  setup: (c: MotionConditions, root: HTMLElement) => void | (() => void),
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    mm.add({ motion: MOTION_QUERY, desktop: DESKTOP_QUERY }, (ctx) => {
      const c = ctx.conditions as unknown as MotionConditions;
      return setup(c, root);
    });
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Slide each word of every [data-split] heading up from a mask when it scrolls in. */
export function revealSplits(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const inners = el.querySelectorAll('[data-split-inner]');
    if (!inners.length) return;
    gsap.fromTo(
      inners,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.045,
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    );
  });
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && !window.matchMedia(MOTION_QUERY).matches;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: 'auto', block: 'start' });
  el.setAttribute('tabindex', '-1');
  (el as HTMLElement).focus({ preventScroll: true });
}
