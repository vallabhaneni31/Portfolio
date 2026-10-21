import { useEffect, useRef } from 'react';
import { gsap, MOTION_QUERY } from '../lib/motion';
import styles from './Cursor.module.css';

/** Desktop-only ring cursor with context labels and magnetic buttons. Native cursor stays visible. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ok = window.matchMedia(`(hover: hover) and (pointer: fine) and ${MOTION_QUERY}`).matches;
    const el = ring.current;
    if (!ok || !el) return;
    el.style.display = 'flex';
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });
    let hoverEl: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (hoverEl && hoverEl.matches('[data-magnetic]')) {
        const r = hoverEl.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(hoverEl, { x: dx * 0.25, y: dy * 0.3, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
      }
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
      hoverEl = t;
      if (!t) {
        el.classList.remove(styles.on);
        return;
      }
      const text = t.getAttribute('data-cursor') ?? '';
      if (label.current) label.current.textContent = text;
      el.classList.add(styles.on);
      el.classList.toggle(styles.hasLabel, text.length > 0);
    };
    const out = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-magnetic]');
      if (t) gsap.to(t, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)', overwrite: 'auto' });
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerout', out);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerout', out);
    };
  }, []);

  return (
    <div ref={ring} className={styles.ring} aria-hidden="true">
      <span ref={label} className={styles.text} />
    </div>
  );
}
