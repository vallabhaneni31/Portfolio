import { useRef } from 'react';
import { gsap, useGsapScope, revealSplits } from '../lib/motion';
import { introFacts, introStatement } from '../content/data';
import { Split } from './Split';
import styles from './Introduction.module.css';

export function Introduction() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, ({ motion }, el) => {
    if (!motion) return;
    revealSplits(el);
    const words = el.querySelectorAll('[data-w]');
    gsap.set(words, { opacity: 0.18 });
    gsap.to(words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.1,
      scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
    gsap.fromTo(
      '[data-fact]',
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: '[data-facts]', start: 'top 88%', once: true },
      },
    );
  });

  return (
    <section ref={root} id="intro" className={`chapter ${styles.wrap}`} aria-labelledby="intro-title">
      <span className="ghost" data-ghost aria-hidden="true">01</span>

      <p className="label">Chapter 01</p>
      <Split as="h2" id="intro-title" className={`display ${styles.title}`} text="Who I am and what I build" />
      <p className={styles.statement} data-statement>
        {introStatement.split(' ').map((w, i) => (
          <span key={i} data-w>
            {w}{' '}
          </span>
        ))}
      </p>
      <dl className={styles.facts} data-facts>
        {introFacts.map((f) => (
          <div key={f.k} className={styles.fact} data-fact>
            <dt className="label">{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
