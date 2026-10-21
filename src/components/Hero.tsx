import { useEffect, useRef, useState } from 'react';
import { ChevronsDown } from 'lucide-react';
import { gsap, ScrollTrigger, useGsapScope, prefersReducedMotion } from '../lib/motion';
import { profile } from '../content/data';
import { LatticeStage } from './LatticeStage';
import { initialSceneState, type PointerState, type SceneState } from './FaceScene';
import styles from './Hero.module.css';

const stages = [
  { k: 'detect', v: 'YOLOv8n-Face' },
  { k: 'embed', v: 'AdaFace R100' },
  { k: 'optimize', v: 'ONNX, TensorRT' },
  { k: 'match', v: 'enrolled embeddings' },
];

const SCAN_TOP = 1.3;
const SCAN_BOTTOM = -1.3;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const state = useRef<SceneState>(initialSceneState());
  const pointer = useRef<PointerState>({ x: 0, y: 0 });
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(0);
  const [reduced] = useState(() => prefersReducedMotion());
  const [skipped, setSkipped] = useState(false);

  const writePct = () => {
    if (!pctRef.current) return;
    const s = state.current;
    const pct = Math.round(Math.min(1, Math.max(0, (SCAN_TOP - s.scan) / (SCAN_TOP - SCAN_BOTTOM))) * 100);
    pctRef.current.textContent = `${pct}%`;
  };

  useGsapScope(root, ({ motion }, el) => {
    const s = state.current;
    if (!motion) {
      Object.assign(s, { progress: 1, scan: SCAN_BOTTOM, zoom: 1, lock: 1 });
      writePct();
      return;
    }
    const chars = el.querySelectorAll('[data-char]');
    gsap.ticker.add(writePct);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    introRef.current = tl;
    tl.set('[data-bar]', { scaleY: 1 }, 0)
      .to(s, { zoom: 1, duration: 5.2, ease: 'power2.out' }, 0)
      .to(s, { progress: 1, duration: 3.2, ease: 'power2.inOut' }, 0.4)
      .to('[data-bar]', { scaleY: 0, duration: 1.6, ease: 'power4.inOut' }, 2.6)
      .fromTo(s, { scan: SCAN_TOP }, { scan: SCAN_BOTTOM, duration: 3.4, ease: 'power1.inOut' }, 3.4)
      .to(s, { lock: 1, duration: 1.1, ease: 'expo.out' }, 5.4)
      .fromTo(chars, { yPercent: 125, rotate: 7 }, { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.07, ease: 'expo.out' }, 3.9)
      .fromTo('[data-hero-in]', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1, stagger: 0.14 }, 4.8)
      .add(() => {
        // idle: the scan sweeps again now and then
        gsap
          .timeline({ repeat: -1, repeatDelay: 5.5, delay: 4 })
          .fromTo(s, { pulse: SCAN_TOP }, { pulse: SCAN_BOTTOM, duration: 3, ease: 'power1.inOut' });
      }, 7);

    // scroll exit: the camera pushes in while the face dissolves into particles
    const exit = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: '+=140%', pin: true, scrub: 0.8, anticipatePin: 1 },
    });
    exit
      .to(s, { push: 1, dissolve: 1, yaw: 0.7, ease: 'power2.in', duration: 1 }, 0)
      .to('[data-hero-copy]', { yPercent: -22, opacity: 0, ease: 'none', duration: 0.6 }, 0)
      .to('[data-hud]', { opacity: 0, duration: 0.3 }, 0)
      .to('[data-scroll]', { opacity: 0, duration: 0.2 }, 0);

    return () => {
      gsap.ticker.remove(writePct);
      introRef.current = null;
    };
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % stages.length), 1700);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => window.clearTimeout(t);
  }, []);

  const skip = () => {
    introRef.current?.progress(1);
    setSkipped(true);
  };
  const replay = () => {
    if (!introRef.current) return;
    setSkipped(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
    introRef.current.restart();
  };

  const nameChars = profile.name.split('');

  return (
    <section ref={root} className={styles.hero} aria-labelledby="hero-title" id="top">
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.scene} aria-hidden="true">
        <LatticeStage state={state} pointer={pointer} hudRef={hudRef} reduced={reduced} boxLabel="face, illustrative" />
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />
      <div className={styles.barTop} data-bar aria-hidden="true" />
      <div className={styles.barBottom} data-bar aria-hidden="true" />

      <div className={styles.copy} data-hero-copy>
        <p className={`label ${styles.kicker}`} data-hero-in>
          {profile.fullName}
        </p>
        <h1 id="hero-title" className={styles.name} aria-label={profile.name}>
          <span aria-hidden="true">
            {nameChars.map((c, i) => (
              <span key={i} className={styles.mask}>
                <span data-char className={styles.char}>
                  {c}
                </span>
              </span>
            ))}
          </span>
        </h1>
        <p className={styles.statement} data-hero-in>
          {profile.statement}
        </p>
        <p className={`label ${styles.role}`} data-hero-in>
          {profile.role}, {profile.org}
        </p>
      </div>

      <div className={styles.hudPanel} data-hud data-hero-in>
        <dl className={styles.readout}>
          <div>
            <dt>reference mesh</dt>
            <dd>468 landmarks</dd>
          </div>
          <div>
            <dt>scan sweep</dt>
            <dd ref={pctRef}>0%</dd>
          </div>
        </dl>
        <ol className={styles.pipe} aria-label="Illustrative face recognition pipeline. Not live inference.">
          {stages.map((s, i) => (
            <li key={s.k} className={i === active ? styles.on : undefined}>
              <span>{s.k}</span>
              <span>{s.v}</span>
            </li>
          ))}
        </ol>
        <p className={`label ${styles.caption}`}>Illustrative. Pipeline from my FRS work, not live inference. Reference mesh: Google MediaPipe, Apache 2.0.</p>
      </div>

      {!reduced && (
        <div className={styles.controls} data-hud>
          <button type="button" className={styles.btn} onClick={skipped ? replay : skip} data-cursor={skipped ? 'Replay' : 'Skip'} data-magnetic>
            {skipped ? 'Replay intro' : 'Skip intro'}
          </button>
        </div>
      )}

      <a className={styles.scroll} data-scroll data-hero-in href="#intro" aria-label="Scroll to chapter 01">
        <ChevronsDown size={18} aria-hidden="true" />
        <span className="label">Scroll</span>
      </a>
    </section>
  );
}
