import { useEffect } from 'react';
import { gsap, ScrollTrigger, initSmoothScroll, MOTION_QUERY } from './lib/motion';
import { Nav } from './components/Nav';
import { Cursor } from './components/Cursor';
import { Spotlight } from './components/Spotlight';
import { Ribbon } from './components/Ribbon';
import { Hero } from './components/Hero';
import { Introduction } from './components/Introduction';
import { Journey } from './components/Journey';
import { Universe } from './components/Universe';
import { Projects } from './components/Projects';
import { Engineering } from './components/Engineering';
import { Mindset } from './components/Mindset';
import { Beyond } from './components/Beyond';
import { Closing } from './components/Closing';

export function App() {
  useEffect(() => {
    const stopSmooth = initSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    // big outlined chapter numerals drift at their own speed for depth
    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERY, () => {
      gsap.utils.toArray<HTMLElement>('[data-ghost]').forEach((g) => {
        gsap.fromTo(
          g,
          { yPercent: -10 },
          { yPercent: 22, ease: 'none', scrollTrigger: { trigger: g.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    });
    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
      stopSmooth();
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#intro">
        Skip to content
      </a>
      <Cursor />
      <Spotlight />
      <Nav />
      <main>
        <Hero />
        <Introduction />
        <Ribbon words={['Edge vision', 'Voice agents', 'RAG', 'Private LLMs', 'Full lifecycle']} />
        <Journey />
        <Universe />
        <Projects />
        <Ribbon reverse words={['Requirements', 'Architecture', 'Code', 'Testing', 'Deployment']} />
        <Engineering />
        <Mindset />
        <Beyond />
        <Closing />
      </main>
    </>
  );
}
