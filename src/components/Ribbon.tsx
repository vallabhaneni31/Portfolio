import { useRef } from 'react';
import { gsap, useGsapScope } from '../lib/motion';
import styles from './Ribbon.module.css';

interface Props {
  words: string[];
  reverse?: boolean;
}

/** Oversized type that slides sideways with scroll. Decorative, so hidden from assistive tech. */
export function Ribbon({ words, reverse }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGsapScope(root, ({ motion }, el) => {
    if (!motion) return;
    const track = el.querySelector('[data-track]');
    gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 } },
    );
  });

  const row = words.map((w, i) => (
    <span key={w} className={i % 2 ? styles.solid : styles.outline}>
      {w}
      <i className={styles.sep} />
    </span>
  ));

  return (
    <div ref={root} className={styles.ribbon} aria-hidden="true">
      <div className={styles.track} data-track>
        {row}
        {row}
      </div>
    </div>
  );
}
