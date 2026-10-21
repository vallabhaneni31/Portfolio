import { useRef } from 'react';
import { useGsapScope, revealSplits, gsap } from '../lib/motion';
import { beyond } from '../content/data';
import { Split } from './Split';
import styles from './Beyond.module.css';

export function Beyond() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, ({ motion }, el) => {
    if (!motion) return;
    revealSplits(el);
    gsap.fromTo(
      '[data-cert]',
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: '[data-certs]', start: 'top 85%', once: true },
      },
    );
  });

  return (
    <section ref={root} id="beyond" className={`chapter ${styles.wrap}`} aria-labelledby="beyond-title">
      <span className="ghost" data-ghost aria-hidden="true">07</span>

      <p className="label">Chapter 07</p>
      <Split as="h2" id="beyond-title" className={`display ${styles.title}`} text="Learning, teaching, and what is on the bench" />

      <div className={styles.cols}>
        <div>
          <h3>Teaching</h3>
          <p>{beyond.teaching} Explaining a system to someone new is the fastest way to find out where it is unclear.</p>
        </div>
        <div>
          <h3>On the bench</h3>
          <p>{beyond.exploring}</p>
        </div>
        <div>
          <h3>Education</h3>
          <p>{beyond.education}</p>
        </div>
      </div>

      <div className={styles.certs} data-certs>
        <p className="label">Certifications and programs</p>
        <div className={styles.certGrid}>
          {beyond.certs.map((g) => (
            <div key={g.group} data-cert>
              <h4>{g.group}</h4>
              <ul>
                {g.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
