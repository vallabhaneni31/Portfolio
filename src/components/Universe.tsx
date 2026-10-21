import { useMemo, useRef, useState } from 'react';
import { useGsapScope, revealSplits, gsap, scrollToId } from '../lib/motion';
import { categories, tech, tiers, projects, type Tier, type Tech } from '../content/data';
import { Split } from './Split';
import styles from './Universe.module.css';

const W = 1000;
const H = 640;

interface Placed extends Tech {
  x: number;
  y: number;
  cx: number;
  cy: number;
}

function layout(): { nodes: Placed[]; hubs: { id: string; label: string; x: number; y: number }[] } {
  const hubs = categories.map((c, i) => {
    const a = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
    return { id: c.id, label: c.label, x: W / 2 + Math.cos(a) * 330, y: H / 2 + Math.sin(a) * 215 };
  });
  const nodes: Placed[] = [];
  hubs.forEach((h) => {
    const group = tech.filter((t) => t.cat === h.id);
    group.forEach((t, i) => {
      const a = (i / group.length) * Math.PI * 2 + 0.6;
      const r = 62 + (group.length > 5 ? (i % 2) * 22 : 0);
      nodes.push({ ...t, x: h.x + Math.cos(a) * r, y: h.y + Math.sin(a) * r * 0.82, cx: h.x, cy: h.y });
    });
  });
  return { nodes, hubs };
}

export function emitSelectProject(id: string) {
  window.dispatchEvent(new CustomEvent('select-project', { detail: id }));
  scrollToId('projects');
}

export function Universe() {
  const root = useRef<HTMLElement>(null);
  const { nodes, hubs } = useMemo(layout, []);
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [filter, setFilter] = useState<Tier | 'all'>('all');

  useGsapScope(root, ({ motion }, el) => {
    if (!motion) return;
    revealSplits(el);
    gsap.fromTo(
      '[data-node]',
      { opacity: 0, scale: 0.2, transformOrigin: '50% 50%' },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(2)',
        stagger: { amount: 1.2, from: 'center' },
        clearProps: 'opacity,transform,transformOrigin',
        scrollTrigger: { trigger: '[data-sky]', start: 'top 80%', once: true },
      },
    );
  });

  const selected = nodes.find((n) => n.id === sel) ?? null;
  const connected = useMemo(() => {
    if (!selected) return new Set<string>();
    return new Set(nodes.filter((n) => n.id !== selected.id && n.projects.some((p) => selected.projects.includes(p))).map((n) => n.id));
  }, [selected, nodes]);

  const dimmed = (n: Placed) => {
    if (filter !== 'all' && n.tier !== filter) return true;
    if (selected) return n.id !== selected.id && !connected.has(n.id);
    return false;
  };

  const projTitle = (id: string) => projects.find((p) => p.id === id)?.title ?? id;

  return (
    <section ref={root} id="universe" className={`chapter ${styles.wrap}`} aria-labelledby="universe-title">
      <span className="ghost" data-ghost aria-hidden="true">03</span>

      <p className="label">Chapter 03</p>
      <Split as="h2" id="universe-title" className={`display ${styles.title}`} text="A map of what I work with" />
      <p className={styles.lede}>Pick a technology to see where I used it and what lights up with it. Filled means I built with it, a ring means I evaluated or documented it, dashed means I studied it.</p>

      <div className={styles.filters} role="group" aria-label="Filter by experience level">
        <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All</button>
        {(Object.keys(tiers) as Tier[]).map((t) => (
          <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)} title={tiers[t].hint}>
            {tiers[t].label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.skyWrap}>
        <svg className={styles.sky} viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Technology constellation" data-sky>
          {hubs.map((h) => (
            <g key={h.id} aria-hidden="true">
              <circle cx={h.x} cy={h.y} r={3} fill="#3d7bff" />
              <text x={h.x} y={h.y - 98} textAnchor="middle" className={styles.hubLabel}>{h.label}</text>
            </g>
          ))}
          {nodes.map((n) => (
            <line key={`h-${n.id}`} x1={n.cx} y1={n.cy} x2={n.x} y2={n.y} className={styles.spoke} opacity={dimmed(n) ? 0.05 : 0.35} />
          ))}
          {selected &&
            nodes
              .filter((n) => connected.has(n.id))
              .map((n) => (
                <line key={`c-${n.id}`} x1={selected.x} y1={selected.y} x2={n.x} y2={n.y} className={styles.link} />
              ))}
          {nodes.map((n) => {
            const on = n.id === sel;
            const dim = dimmed(n);
            return (
              <g
                key={n.id}
                data-node
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`${n.label}, ${tiers[n.tier].label}`}
                className={`${styles.node} ${styles[n.tier]} ${on ? styles.sel : ''}`}
                opacity={dim ? 0.18 : 1}
                onClick={() => setSel(on ? null : n.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSel(on ? null : n.id);
                  }
                }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                data-cursor="Inspect"
              >
                <circle cx={n.x} cy={n.y} r={22} fill="transparent" />
                <circle cx={n.x} cy={n.y} r={on ? 9 : 6} className={styles.dot} />
                <text x={n.x} y={n.y + 20} textAnchor="middle" className={styles.nodeLabel} opacity={on || hover === n.id || connected.has(n.id) || !selected ? 1 : 0.5}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
        </div>

        <aside className={styles.panel} aria-live="polite">
          {selected ? (
            <>
              <p className="label">{tiers[selected.tier].label}</p>
              <h3>{selected.label}</h3>
              <p className={styles.ev}>{selected.evidence}</p>
              {selected.projects.length > 0 ? (
                <>
                  <p className={`label ${styles.sub}`}>Where it shows up</p>
                  <ul>
                    {selected.projects.map((p) => (
                      <li key={p}>
                        <button type="button" onClick={() => emitSelectProject(p)} data-cursor="Open">
                          {projTitle(p)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className={styles.ev}>Not tied to a project yet.</p>
              )}
              {connected.size > 0 && (
                <p className={`label ${styles.sub}`}>Often alongside: {nodes.filter((n) => connected.has(n.id)).slice(0, 6).map((n) => n.label).join(', ')}</p>
              )}
            </>
          ) : (
            <>
              <h3>Select a node</h3>
              <p className={styles.ev}>The lines show which technologies met in the same project.</p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
