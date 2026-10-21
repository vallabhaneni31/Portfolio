import { useRef } from 'react';
import { gsap, useGsapScope, revealSplits } from '../lib/motion';
import { stories } from '../content/data';
import { Split } from './Split';
import styles from './Engineering.module.css';

export function Engineering() {
  const root = useRef<HTMLElement>(null);

  useGsapScope(root, ({ motion }, el) => {
    if (!motion) return;
    revealSplits(el);
    el.querySelectorAll<HTMLElement>('[data-story]').forEach((story) => {
      const steps = story.querySelectorAll('[data-step]');
      gsap.set(steps, { opacity: 0.22 });
      gsap.to(steps, {
        opacity: 1,
        ease: 'none',
        stagger: 1,
        scrollTrigger: { trigger: story, start: 'top 65%', end: 'bottom 70%', scrub: true },
      });
      gsap.fromTo(story.querySelector('[data-fill]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: story, start: 'top 65%', end: 'bottom 70%', scrub: true } });
    });
    gsap.fromTo('[data-ram]', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 1.2, ease: 'power3.out', stagger: 0.2, clearProps: 'transform', scrollTrigger: { trigger: '[data-pool]', start: 'top 85%', once: true } });
  });

  return (
    <section ref={root} id="engineering" className={`chapter ${styles.wrap}`} aria-labelledby="eng-title">
      <span className="ghost" data-ghost aria-hidden="true">05</span>

      <p className="label">Chapter 05</p>
      <Split as="h2" id="eng-title" className={`display ${styles.title}`} text="Five problems, told in order" />
      <p className={styles.lede}>Each one runs from challenge to result. Where there is no measured result yet, I say that instead of inventing one.</p>

      <div className={styles.stories}>
        {stories.map((s) => (
          <article key={s.id} className={styles.story} data-story aria-labelledby={`st-${s.id}`}>
            <h3 id={`st-${s.id}`}>{s.title}</h3>
            <div className={styles.rail} aria-hidden="true">
              <div className={styles.fill} data-fill />
            </div>
            <ol className={styles.steps}>
              {s.steps.map((st) => (
                <li key={st.label} data-step>
                  <p className="label">{st.label}</p>
                  <p>{st.body}</p>
                </li>
              ))}
            </ol>

            {s.id === 'orin' && (
              <figure className={styles.pool} data-pool>
                <figcaption className="label">The test box: 11.3 GiB memory pool (hardware specification, not a benchmark)</figcaption>
                <div className={styles.bar} role="img" aria-label="3.3 GiB physical RAM plus 8.0 GiB swap">
                  <span data-ram style={{ flex: 3.3 }} className={styles.ram}>3.3 GiB RAM</span>
                  <span data-ram style={{ flex: 8 }} className={styles.swap}>8.0 GiB swap</span>
                </div>
              </figure>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
