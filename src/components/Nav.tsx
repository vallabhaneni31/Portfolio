import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { chapters } from '../content/data';
import { gsap, ScrollTrigger, scrollToId, getLenis } from '../lib/motion';
import styles from './Nav.module.css';

export function Nav() {
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const triggers = chapters.map((c, i) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      }),
    );
    const top = ScrollTrigger.create({ trigger: '#top', start: 'top top', end: 'bottom 55%', onToggle: (s) => s.isActive && setActive(-1) });
    const prog = gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.2 } });
    return () => {
      triggers.forEach((t) => t.kill());
      top.kill();
      prog.scrollTrigger?.kill();
      prog.kill();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= chapters.length) {
        scrollToId(chapters[n - 1].id);
        setOpen(false);
      }
      if (e.key === '0') scrollToId('top');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    if (!open) return;
    const first = document.querySelector<HTMLElement>('#chapter-menu a');
    first?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const current = active >= 0 ? chapters[active] : null;

  return (
    <>
      <div className={styles.progress} aria-hidden="true">
        <div ref={bar} className={styles.bar} />
      </div>
      <header className={styles.nav}>
        <a href="#top" className={styles.brand} onClick={(e) => { e.preventDefault(); scrollToId('top'); }} aria-label="Karthik, back to the opening" data-cursor="Top">
          Karthik V.
        </a>
        <p className={`label ${styles.now}`} aria-live="polite">
          {current ? `${current.n} / 08 ${current.title}` : 'Opening'}
        </p>
        <button
          ref={menuBtn}
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="chapter-menu"
          onClick={() => setOpen((o) => !o)}
          data-cursor={open ? 'Close' : 'Chapters'}
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          <span>{open ? 'Close' : 'Chapters'}</span>
        </button>
      </header>

      <nav id="chapter-menu" className={`${styles.menu} ${open ? styles.menuOpen : ''}`} aria-label="Chapters" hidden={!open}>
        <ol>
          {chapters.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                aria-current={i === active ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  scrollToId(c.id);
                  menuBtn.current?.focus({ preventScroll: true });
                }}
              >
                <span className={styles.num}>{c.n}</span>
                <span className={styles.ttl}>{c.title}</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="label">Tip: press 1 to 8 to jump between chapters, 0 for the opening.</p>
      </nav>
    </>
  );
}
