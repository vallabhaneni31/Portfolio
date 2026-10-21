import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap, MOTION_QUERY, DESKTOP_QUERY, scrollToId } from '../lib/motion';
import { projects, type Project } from '../content/data';
import { scenes, fallbackScene, hues } from './WalkScenes';
import styles from './Walk.module.css';

const N = projects.length;

/** Dwell at each stop: the walker walks, stops, then walks on. */
function stopCurve(t: number) {
  const i = Math.min(N - 1, Math.floor(t));
  const f = t - i;
  const k = f < 0.28 ? 0 : f > 0.72 ? 1 : (f - 0.28) / 0.44;
  const e = k * k * (3 - 2 * k);
  return Math.min(N - 1, i + e);
}

function useWalkMode() {
  const get = () => window.matchMedia(MOTION_QUERY).matches && window.matchMedia(DESKTOP_QUERY).matches;
  const [on, setOn] = useState(get);
  useEffect(() => {
    const a = window.matchMedia(MOTION_QUERY);
    const b = window.matchMedia(DESKTOP_QUERY);
    const h = () => setOn(get());
    a.addEventListener('change', h);
    b.addEventListener('change', h);
    return () => {
      a.removeEventListener('change', h);
      b.removeEventListener('change', h);
    };
  }, []);
  return on;
}

function Walker() {
  return (
    <svg className={styles.walker} viewBox="0 0 100 200" aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--bone)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <g data-body>
          <g data-arm="back" opacity=".55">
            <path d="M50 58V80" />
            <g data-fore>
              <path d="M50 80V102" />
            </g>
          </g>
          <g data-leg="back" opacity=".55">
            <path d="M50 108V148" />
            <g data-shin>
              <path d="M50 148V188" />
            </g>
          </g>
          <path d="M50 54V108" strokeWidth="9" />
          <circle cx="50" cy="32" r="13" fill="var(--ink)" />
          <rect x="40" y="58" width="20" height="30" rx="5" stroke="var(--blue)" strokeWidth="3" opacity=".9" />
          <g data-leg="front">
            <path d="M50 108V148" />
            <g data-shin>
              <path d="M50 148V188" />
            </g>
          </g>
          <g data-arm="front">
            <path d="M50 58V80" />
            <g data-fore>
              <path d="M50 80V102" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

function Card({ p, i, onOpen }: { p: Project; i: number; onOpen: (id: string) => void }) {
  return (
    <div className={styles.card}>
      <p className="label">
        Stop {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · {p.kicker}
      </p>
      <h3>{p.title}</h3>
      <p className={styles.brief}>{p.problem}</p>
      <ol className={styles.route} aria-label="Architecture route">
        {p.architecture.slice(0, 5).map((s) => (
          <li key={s.label}>{s.label}</li>
        ))}
      </ol>
      <ul className={styles.chips} aria-label="Technologies">
        {p.stack.slice(0, 5).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <button type="button" className={styles.open} onClick={() => onOpen(p.id)} data-cursor="Open" data-magnetic>
        Read the case study <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export function Walk({ onOpen }: { onOpen: (id: string) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const walk = useWalkMode();

  const open = (id: string) => {
    onOpen(id);
    scrollToId('case-title');
  };

  useEffect(() => {
    const el = root.current;
    if (!el || !walk) return;

    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const world = q<HTMLElement>('[data-world]');
    const far = q<HTMLElement>('[data-far]');
    const road = q<HTMLElement>('[data-road]');
    const backs = Array.from(el.querySelectorAll<HTMLElement>('[data-back]'));
    const walker = q<SVGElement>('[data-walker]');
    const stage = q<HTMLElement>('[data-card]');
    const set = (sel: string, rot: number, ox: number, oy: number) => {
      const n = walker.querySelector<SVGGElement>(sel);
      n?.setAttribute('transform', `rotate(${rot.toFixed(2)} ${ox} ${oy})`);
    };

    const st = { p: 0 };
    let x = 0; // world offset in px
    let last = 0;
    let phase = 0;
    let amp = 0;
    let shown = 0;
    let vw = window.innerWidth;

    const place = () => {
      const t = stopCurve(st.p * (N - 1));
      x = t * vw;
      world.style.transform = `translate3d(${-x}px,0,0)`;
      far.style.transform = `translate3d(${-x * 0.35}px,0,0)`;
      road.style.backgroundPosition = `${-x}px 0`;
      backs.forEach((b, i) => {
        b.style.opacity = String(Math.max(0, 1 - Math.abs(t - i) * 1.4));
      });
      const away = Math.abs(t - Math.round(t));
      stage.style.opacity = String(Math.max(0, 1 - away * 3.4));
      stage.style.transform = `translate3d(${(t - Math.round(t)) * -80}px,0,0)`;
      const idx = Math.round(t);
      if (idx !== shown) {
        shown = idx;
        setActive(idx);
      }
    };

    const tick = () => {
      const dx = x - last;
      last = x;
      const speed = Math.min(1, Math.abs(dx) / 14);
      amp += (speed - amp) * 0.14;
      phase += Math.abs(dx) * 0.045;
      const s = Math.sin(phase);
      const c = Math.cos(phase);
      const sw = 30 * amp;
      set('[data-leg="front"]', s * sw + 5 * (1 - amp), 50, 108);
      set('[data-leg="back"]', -s * sw - 5 * (1 - amp), 50, 108);
      set('[data-leg="front"] [data-shin]', Math.max(0, -c) * 38 * amp, 50, 148);
      set('[data-leg="back"] [data-shin]', Math.max(0, c) * 38 * amp, 50, 148);
      set('[data-arm="front"]', -s * 26 * amp + 4 * (1 - amp), 50, 58);
      set('[data-arm="back"]', s * 26 * amp - 4 * (1 - amp), 50, 58);
      set('[data-arm="front"] [data-fore]', -12 - amp * 14, 50, 80);
      set('[data-arm="back"] [data-fore]', -12 - amp * 14, 50, 80);
      const bob = Math.abs(Math.cos(phase)) * 4 * amp;
      walker.querySelector('[data-body]')?.setAttribute('transform', `translate(0 ${(-bob).toFixed(2)}) rotate(${(amp * 3).toFixed(2)} 50 108)`);
    };

    const ctx = gsap.context(() => {
      gsap.to(st, {
        p: 1,
        ease: 'none',
        onUpdate: place,
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
      });
    }, el);
    gsap.ticker.add(tick);
    place();
    const onResize = () => {
      vw = window.innerWidth;
      place();
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(tick);
      ctx.revert();
      world.style.transform = '';
      far.style.transform = '';
    };
  }, [walk]);

  return (
    <div
      ref={root}
      className={`${styles.walk} ${walk ? styles.pinned : styles.stacked}`}
      style={walk ? { height: `${(N * 1.1 + 1) * 100}vh` } : undefined}
      role="group"
      aria-label="Project walk-through. Scroll to move from project to project."
    >
      <div className={styles.sticky}>
      {walk && (
        <>
          {projects.map((p, i) => (
            <div key={p.id} data-back className={styles.back} style={{ ['--h' as string]: hues[p.id] ?? 260, opacity: i === 0 ? 1 : 0 }} aria-hidden="true" />
          ))}
          <div className={styles.far} data-far aria-hidden="true" />
        </>
      )}

      <div className={styles.world} data-world>
        {projects.map((p, i) => (
          <section key={p.id} className={styles.seg} aria-label={p.title} style={{ ['--h' as string]: hues[p.id] ?? 260 }}>
            <div className={styles.sceneWrap}>{scenes[p.id] ?? fallbackScene}</div>
            {!walk && <Card p={p} i={i} onOpen={open} />}
          </section>
        ))}
      </div>

      {walk && (
        <>
          <div className={styles.road} data-road aria-hidden="true" />
          <div className={styles.walkerWrap} data-walker aria-hidden="true">
            <Walker />
          </div>
          <div className={styles.stage} data-card aria-live="polite">
            <Card p={projects[active]} i={active} onOpen={open} />
          </div>
          <div className={styles.hud} aria-hidden="true">
            <span className="label">Scroll to walk</span>
            <span className={styles.dots}>
              {projects.map((p, i) => (
                <i key={p.id} className={i === active ? styles.dotOn : undefined} />
              ))}
            </span>
            <span className="label">Illustrative scenes</span>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
