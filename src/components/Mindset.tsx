import { useRef } from 'react';
import { gsap, useGsapScope, revealSplits } from '../lib/motion';
import { mindset } from '../content/data';
import { Split } from './Split';
import styles from './Mindset.module.css';

export function Mindset() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, ({ motion, desktop }, el) => {
    if (!motion) return;
    revealSplits(el);
    if (!desktop) return;
    const track = el.querySelector<HTMLElement>('[data-track]')!;
    const dist = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-pin]',
        start: 'top top',
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
  });

  return (
    <section ref={root} id="mindset" className={styles.wrap} aria-labelledby="mindset-title">
      <div className={styles.pin} data-pin>
        <div className={styles.track} data-track>
          <div className={styles.intro}>
            <p className="label">Chapter 06</p>
            <Split as="h2" id="mindset-title" className={`display ${styles.title}`} text="How I think about building" />
            <p className={`label ${styles.hint}`}>Five rules, each with the work behind it.</p>
          </div>
          {mindset.map((m, i) => (
            <article key={m.title} className={styles.card}>
              <p className={`label ${styles.n}`}>Rule {i + 1} of {mindset.length}</p>
              <h3>{m.title}</h3>
              <p className={styles.body}>{m.body}</p>
              <p className={styles.proof}>{m.proof}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
