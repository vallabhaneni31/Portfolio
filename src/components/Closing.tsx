import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Mail, FileText, Code2, Users } from 'lucide-react';
import { gsap, useGsapScope, revealSplits, scrollToId, prefersReducedMotion } from '../lib/motion';
import { profile } from '../content/data';
import { LatticeStage } from './LatticeStage';
import { initialSceneState, type PointerState, type SceneState } from './FaceScene';
import { Split } from './Split';
import styles from './Closing.module.css';

export function Closing() {
  const root = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const state = useRef<SceneState>(initialSceneState());
  const pointer = useRef<PointerState>({ x: 0, y: 0 });
  const [reduced] = useState(() => prefersReducedMotion());

  useGsapScope(root, ({ motion }, el) => {
    const st = state.current;
    if (!motion) {
      Object.assign(st, { progress: 1, scan: -1.3, zoom: 1, lock: 1 });
      return;
    }
    revealSplits(el);
    // the opening scene returns: points converge again as the closing scene arrives
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 5%', scrub: 0.6 } })
      .fromTo(st, { progress: 0, zoom: 1.5 }, { progress: 1, zoom: 1, ease: 'power2.out', duration: 1 }, 0);
    const sweep = gsap.timeline({ paused: true });
    sweep
      .fromTo(st, { scan: 1.3, lock: 0 }, { scan: -1.3, duration: 3, ease: 'power1.inOut' })
      .to(st, { lock: 1, duration: 0.8, ease: 'expo.out' }, 2.4)
      .fromTo(st, { pulse: 1.3 }, { pulse: -1.3, duration: 3, ease: 'power1.inOut', repeat: -1, repeatDelay: 4 }, 4);
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 35%', end: 'bottom top', onEnter: () => sweep.play(), onLeave: () => sweep.pause(), onEnterBack: () => sweep.play(), onLeaveBack: () => sweep.pause() } });
    gsap.fromTo('[data-link]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: '[data-links]', start: 'top 95%', once: true } });
    return () => sweep.kill();
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const { github, linkedin, email, resume } = profile.links;

  return (
    <section ref={root} id="contact" className={styles.wrap} aria-labelledby="contact-title">
      <div className={styles.scene} aria-hidden="true">
        <LatticeStage state={state} pointer={pointer} hudRef={hudRef} reduced={reduced} boxLabel="match, illustrative" />
      </div>
      <div className={styles.copy}>
        <p className="label">Chapter 08</p>
        <Split as="h2" id="contact-title" className={`display ${styles.title}`} text="Let's build something that works outside the demo" />
        <p className={styles.sub}>If you have a system that has to run on real hardware, with real users and real constraints, I would like to hear about it.</p>
        <ul className={styles.links} data-links>
          {email && (
            <li data-link>
              <a href={`mailto:${email}`} className={styles.primary} data-magnetic data-cursor="Write">
                <Mail size={18} aria-hidden="true" /> Email me
              </a>
            </li>
          )}
          <li data-link>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className={email ? styles.link : styles.primary} data-magnetic data-cursor="Open">
              <Users size={18} aria-hidden="true" /> Message me on LinkedIn
            </a>
          </li>
          <li data-link>
            <a href={github} target="_blank" rel="noopener noreferrer" className={styles.link} data-magnetic data-cursor="Open">
              <Code2 size={18} aria-hidden="true" /> GitHub
            </a>
          </li>
          {resume && (
            <li data-link>
              <a href={resume} className={styles.link} download data-magnetic data-cursor="Get">
                <FileText size={18} aria-hidden="true" /> Resume
              </a>
            </li>
          )}
          <li data-link>
            <button type="button" className={styles.link} onClick={() => scrollToId('projects')} data-magnetic data-cursor="Jump">
              Revisit the projects
            </button>
          </li>
        </ul>
      </div>
      <footer className={styles.foot}>
        <p className="label">Karthik Vallabhaneni. Built with React, GSAP and Three.js.</p>
        <button type="button" className={styles.top} onClick={() => scrollToId('top')} aria-label="Back to the opening" data-cursor="Top">
          <ArrowUp size={16} aria-hidden="true" /> Opening
        </button>
      </footer>
    </section>
  );
}
