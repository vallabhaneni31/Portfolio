import { useEffect, useRef, useState } from 'react';
import { useGsapScope, revealSplits, gsap } from '../lib/motion';
import { projects } from '../content/data';
import { Split } from './Split';
import { Walk } from './Walk';
import styles from './Projects.module.css';

const tabs = ['Problem', 'Architecture', 'Decisions', 'Outcome'] as const;
type TabName = (typeof tabs)[number];

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const [id, setId] = useState(projects[0].id);
  const [tab, setTab] = useState<TabName>('Problem');
  const [stage, setStage] = useState(0);
  const project = projects.find((p) => p.id === id)!;

  useGsapScope(root, ({ motion }, el) => {
    if (!motion) return;
    revealSplits(el);
  });

  useEffect(() => {
    const on = (e: Event) => {
      const pid = (e as CustomEvent<string>).detail;
      if (projects.some((p) => p.id === pid)) {
        setId(pid);
        setTab('Architecture');
        setStage(0);
      }
    };
    window.addEventListener('select-project', on);
    return () => window.removeEventListener('select-project', on);
  }, []);

  useEffect(() => {
    const el = root.current?.querySelector('[data-case]');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(el, { clipPath: 'inset(0 0 12% 0)', opacity: 0.2 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 0.6, ease: 'power3.out' });
  }, [id, tab]);

  const pick = (pid: string) => {
    setId(pid);
    setTab('Problem');
    setStage(0);
  };

  return (
    <section ref={root} id="projects" className={`chapter ${styles.wrap}`} aria-labelledby="projects-title">
      <span className="ghost" data-ghost aria-hidden="true">04</span>

      <p className="label">Chapter 04</p>
      <Split as="h2" id="projects-title" className={`display ${styles.title}`} text="Walk through the systems I built" />
      <p className={styles.lede}>Case studies, written to be checked. Where a result was never measured, the page says so. Client and product names are withheld where the work is confidential.</p>

      <Walk onOpen={pick} />

      <div className={styles.layout}>
        <ul className={styles.index} aria-label="Projects">
          {projects.map((p, i) => (
            <li key={p.id}>
              <button type="button" aria-pressed={p.id === id} onClick={() => pick(p.id)} data-cursor="Open">
                <span className={styles.idx}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.ptitle}>{p.title}</span>
                <span className={`label ${styles.pk}`}>{p.kicker}</span>
              </button>
            </li>
          ))}
        </ul>

        <article className={styles.case} data-case aria-labelledby="case-title">
          <header>
            <p className="label">
              {project.status}
              {project.confidential ? ', client details withheld' : ''}
            </p>
            <h3 id="case-title">{project.title}</h3>
          </header>

          <div role="tablist" aria-label="Case study sections" className={styles.tabs}>
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                id={`tab-${t}`}
                aria-selected={tab === t}
                aria-controls="case-panel"
                tabIndex={tab === t ? 0 : -1}
                onClick={() => setTab(t)}
                onKeyDown={(e) => {
                  const i = tabs.indexOf(tab);
                  if (e.key === 'ArrowRight') setTab(tabs[(i + 1) % tabs.length]);
                  if (e.key === 'ArrowLeft') setTab(tabs[(i + tabs.length - 1) % tabs.length]);
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div id="case-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className={styles.panel}>
            {tab === 'Problem' && (
              <dl className={styles.dl}>
                <div><dt className="label">The problem</dt><dd>{project.problem}</dd></div>
                <div><dt className="label">Context and constraints</dt><dd>{project.context}</dd></div>
                <div><dt className="label">My role</dt><dd>{project.role}</dd></div>
                <div>
                  <dt className="label">Technologies</dt>
                  <dd>
                    <ul className={styles.chips}>
                      {project.stack.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            )}

            {tab === 'Architecture' && (
              <div className={styles.arch}>
                <ol className={styles.flow} aria-label="Architecture stages">
                  {project.architecture.map((s, i) => (
                    <li key={s.label}>
                      <button type="button" aria-pressed={stage === i} onClick={() => setStage(i)} data-cursor="Inspect">
                        <span className={styles.fnum}>{i + 1}</span>
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ol>
                <div>
                  <p className={styles.detail} aria-live="polite">
                    {project.architecture[Math.min(stage, project.architecture.length - 1)].detail}
                  </p>
                  <p className={`label ${styles.note}`}>Illustrative diagram of the real architecture. No performance figures are implied.</p>
                </div>
              </div>
            )}

            {tab === 'Decisions' && (
              <ul className={styles.decisions}>
                {project.decisions.map((d) => (
                  <li key={d.title}>
                    <h4>{d.title}</h4>
                    <p>{d.body}</p>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'Outcome' && (
              <div className={styles.outcome}>
                <div>
                  <p className="label">Outcomes</p>
                  <ul>
                    {project.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="label">Lessons learned</p>
                  <ul>
                    {project.lessons.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
