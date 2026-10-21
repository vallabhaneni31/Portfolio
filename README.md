# Karthik Vallabhaneni, portfolio

React + TypeScript + Vite, GSAP ScrollTrigger for scroll storytelling, Three.js for the opening and closing scenes (lazy-loaded, with an SVG fallback when WebGL is unavailable). CSS Modules, no Tailwind.

## Run

```
npm install
npm run dev      # local development
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build
```

## Edit content

Everything lives in `src/content/data.ts`: profile, links, timeline, technologies, projects, engineering stories, mindset passages, certifications.

- `profile.links.email`: add an address to show an "Email me" action. Left empty on purpose.
- `profile.links.resume`: put a PDF in `public/` and set e.g. `'/resume.pdf'` to show a Resume action.
- Client names and the confidential engagement are kept generic. Only add metrics you have measured.

## Deploy

Static site, no environment variables and no backend. Deploy `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Build command `npm run build`, output directory `dist`. Set the real production URL in the Open Graph tags in `index.html` and use an absolute `og:image` URL once the domain is known (social platforms prefer a PNG; convert `public/og.svg`).

## Credits

The face scan uses the MediaPipe canonical face model (468 landmarks), Copyright Google LLC, Apache License 2.0, https://github.com/google-ai-edge/mediapipe. The data lives in `src/lib/faceMesh.ts`. Smooth scrolling uses Lenis.

## Behavior notes

- Reduced motion: smooth scrolling, the intro, scroll animations and the cursor effects are skipped, the intro shows its final state, the sideways chapter becomes a vertical stack.
- Keyboard: Tab through everything; press 1 to 8 to jump chapters, 0 for the opening, Esc closes the chapter menu.
- The hero pipeline and detection box are illustrative, not live inference, and are labeled as such.


## The project walk

`src/components/Walk.tsx` renders chapter 04 as a scroll-driven walk: a figure walks along a road, stops at each project, and the environment and briefing change. Scenes are line-art illustrations in `src/components/WalkScenes.tsx`, keyed by project id. To add a project, add it to `projects` in `src/content/data.ts`; the walk picks it up. An `agentic` scene is already drawn and used when a project with id `agentic` exists. Phones and reduced-motion users get a stacked layout with the same content.
