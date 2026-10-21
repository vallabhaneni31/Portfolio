import { useRef } from 'react';
import { gsap, useGsapScope, revealSplits } from '../lib/motion';
import { journey } from '../content/data';
import { Split } from './Split';
import styles from './Journey.module.css';

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, ({ motion }, el) => {
    if (!motion) return;
    revealSplits(el);
    gsap.fromTo(
      '[data-line]',
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-track]', start: 'top 60%', end: 'bottom 70%', scrub: true } },
    );
    el.querySelectorAll<HTMLElement>('[data-stop]').forEach((s) => {
      gsap.fromTo(
        s.querySelector('[data-body]'),
        { clipPath: 'inset(0 0 100% 0)', y: 20 },
        { clipPath: 'inset(0 0 -10% 0)', y: 0, duration: 0.9, ease: 'power3.out', clearProps: 'clipPath,transform', scrollTrigger: { trigger: s, start: 'top 80%', once: true } },
      );
      gsap.fromTo(
        s.querySelector('[data-dot]'),
        { scale: 0.4, backgroundColor: '#12141a' },
        { scale: 1, backgroundColor: '#3d7bff', duration: 0.4, ease: 'back.out(2)', scrollTrigger: { trigger: s, start: 'top 62%', once: true } },
      );
    });
  });

  return (
    <section ref={root} id="journey" className={`chapter ${styles.wrap}`} aria-labelledby="journey-title">
      <span className="ghost" data-ghost aria-hidden="true">02</span>

      <div className={styles.head}>
        <p className="label">Chapter 02</p>
        <Split as="h2" id="journey-title" className={`display ${styles.title}`} text="From web engineering to whole systems" />
      </div>
      <ol className={styles.track} data-track>
        <div className={styles.rail} aria-hidden="true">
          <div className={styles.line} data-line />
        </div>
        {journey.map((j) => (
          <li key={j.period + j.title} className={styles.stop} data-stop>
            <span className={styles.dot} data-dot aria-hidden="true" />
            <p className={`label ${styles.period}`}>{j.period}</p>
            <div className={styles.body} data-body>
              <h3>{j.title}</h3>
              <p className={styles.org}>{j.org}</p>
              <p className={styles.note}>{j.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
