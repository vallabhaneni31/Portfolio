import { useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import * as THREE from 'three';
import { buildFaceCloud, FACE_TAGS, FACE_VERTS } from '../lib/faceCloud';

export interface PointerState {
  x: number;
  y: number;
}

/** Mutated by GSAP timelines in the parent. */
export interface SceneState {
  /** 0 scattered field, 1 assembled face */
  progress: number;
  /** model-space height of the scan line, 1.3 (above the head) to -1.3 (below) */
  scan: number;
  /** height of a repeating highlight pulse after the first scan, 5 means idle (off screen) */
  pulse: number;
  /** 0 intact, 1 exploded into particles (scroll exit) */
  dissolve: number;
  /** camera dolly while the intro plays, 1.4 far to 1 near */
  zoom: number;
  /** camera push while scrolling out, 0 to 1 */
  push: number;
  /** detection box lock, 0 to 1 */
  lock: number;
  /** extra yaw in radians */
  yaw: number;
}

export const initialSceneState = (): SceneState => ({ progress: 0, scan: 1.3, pulse: 5, dissolve: 0, zoom: 1.4, push: 0, lock: 0, yaw: 0 });

interface Props {
  state: MutableRefObject<SceneState>;
  pointer: MutableRefObject<PointerState>;
  /** Container for the detection box and landmark tags. Children carry data-box and data-tag. */
  hudRef: RefObject<HTMLDivElement | null>;
  reduced: boolean;
  onFail: () => void;
}

const POINT_VERT = /* glsl */ `
attribute vec3 aStart;
attribute vec3 aNormal;
attribute float aSize;
attribute float aLand;
attribute float aRand;
uniform float uProgress;
uniform float uScan;
uniform float uPulse;
uniform float uDissolve;
uniform float uTime;
uniform float uPixel;
varying float vLand;
varying float vAlpha;
varying float vScanned;
varying float vBand;
varying float vShade;
varying float vRand;
void main() {
  float p = clamp((uProgress - aRand * 0.45) / 0.55, 0.0, 1.0);
  p = p * p * (3.0 - 2.0 * p);
  vec3 pos = mix(aStart, position, p);
  pos += (1.0 - p) * 0.12 * vec3(sin(uTime * 0.7 + aRand * 20.0), cos(uTime * 0.6 + aRand * 13.0), sin(uTime * 0.5 + aRand * 7.0));
  pos += p * 0.006 * vec3(sin(uTime * 1.3 + aRand * 31.0), cos(uTime * 1.1 + aRand * 17.0), 0.0);

  float d = clamp((uDissolve - aRand * 0.55) / 0.45, 0.0, 1.0);
  d = d * d;
  pos += d * (aNormal * (1.4 + aRand * 2.2) + vec3((aRand - 0.5) * 2.0, aRand * 1.2, 2.0 + aRand * 3.0));

  float dy = position.y - uScan;
  vScanned = smoothstep(0.0, 0.06, dy);
  vBand = max(exp(-pow(dy / 0.045, 2.0)), exp(-pow((position.y - uPulse) / 0.045, 2.0)));
  vShade = clamp(dot(normalize(aNormal), normalize(vec3(-0.45, 0.55, 0.75))) * 0.5 + 0.5, 0.0, 1.0);
  vLand = aLand;
  vRand = aRand;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float focus = abs(-mv.z - 6.0);
  float size = aSize * (1.0 + aLand * 0.9 + vBand * 2.2) * (1.0 + focus * 0.06);
  gl_PointSize = size * uPixel * (4.2 / -mv.z);
  vAlpha = mix(0.4, 1.0, p) * (1.0 - d * 0.85) / (1.0 + focus * 0.12);
}
`;

const POINT_FRAG = /* glsl */ `
varying float vLand;
varying float vAlpha;
varying float vScanned;
varying float vBand;
varying float vShade;
varying float vRand;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  vec3 dim = vec3(0.14, 0.3, 0.8);
  vec3 lit = mix(vec3(0.16, 0.42, 1.0), vec3(0.62, 0.86, 1.0), vShade);
  vec3 col = mix(dim, lit, vScanned);
  col = mix(col, vec3(0.8, 0.72, 1.0), vLand * 0.65 * vScanned);
  col += vec3(0.5, 0.75, 1.0) * vBand * 1.4;
  float a = core * vAlpha * (0.5 + 0.5 * vScanned + vBand);
  a *= mix(0.65, 1.0, vRand);
  gl_FragColor = vec4(col, a);
}
`;

const LINE_VERT = /* glsl */ `
uniform float uScan;
uniform float uPulse;
uniform float uDissolve;
varying float vScanned;
varying float vBand;
void main() {
  float dy = position.y - uScan;
  vScanned = smoothstep(0.0, 0.06, dy);
  vBand = max(exp(-pow(dy / 0.06, 2.0)), exp(-pow((position.y - uPulse) / 0.06, 2.0)));
  vec3 pos = position + normal * 0.0;
  pos.z += uDissolve * 2.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const LINE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uBase;
uniform float uDissolve;
varying float vScanned;
varying float vBand;
void main() {
  float a = (uBase * (0.4 + 0.6 * vScanned) + vBand * 0.9) * (1.0 - uDissolve);
  gl_FragColor = vec4(uColor, a);
}
`;

export function FaceScene({ state, pointer, hudRef, reduced, onFail }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch {
      onFail();
      return;
    }

    const small = window.innerWidth < 700;
    const cloud = buildFaceCloud(small ? 5200 : 11000);
    const n = cloud.count;

    const start = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const rnd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const r = 2.4 + Math.random() * 3.6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      start[i * 3] = r * Math.sin(ph) * Math.cos(th);
      start[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.75;
      start[i * 3 + 2] = r * Math.cos(ph) - 1.5;
      size[i] = cloud.land[i] > 0 ? 2.6 : 1.1 + Math.random() * 0.9;
      rnd[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(cloud.positions, 3));
    geo.setAttribute('aNormal', new THREE.BufferAttribute(cloud.normals, 3));
    geo.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aLand', new THREE.BufferAttribute(cloud.land, 1));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));

    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    const shared = {
      uScan: { value: 1.3 },
      uPulse: { value: 5 },
      uDissolve: { value: 0 },
    };
    const pointMat = new THREE.ShaderMaterial({
      vertexShader: POINT_VERT,
      fragmentShader: POINT_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { ...shared, uProgress: { value: 0 }, uTime: { value: 0 }, uPixel: { value: dpr * 2.4 } },
    });
    const points = new THREE.Points(geo, pointMat);

    const makeLines = (idx: Uint16Array, color: number, base: number) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(FACE_VERTS, 3));
      g.setAttribute('normal', new THREE.BufferAttribute(FACE_VERTS, 3));
      g.setIndex(new THREE.BufferAttribute(idx, 1));
      const m = new THREE.ShaderMaterial({
        vertexShader: LINE_VERT,
        fragmentShader: LINE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { ...shared, uColor: { value: new THREE.Color(color) }, uBase: { value: base } },
      });
      return { mesh: new THREE.LineSegments(g, m), g, m };
    };
    const wire = makeLines(cloud.edges, 0x3d7bff, 0.16);
    const contour = makeLines(cloud.contours, 0xb7a2ff, 0.7);

    // scan plane and line
    const planeGeo = new THREE.PlaneGeometry(2.8, 0.7);
    const planeMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'varying vec2 vUv; uniform float uOpacity; void main(){ float trail = smoothstep(0.0, 1.0, vUv.y); float edge = smoothstep(0.5, 0.0, abs(vUv.x - 0.5)); gl_FragColor = vec4(0.3, 0.6, 1.0, pow(trail, 5.0) * 0.3 * edge * uOpacity); }',
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.z = 0.15;
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.4, 0, 0), new THREE.Vector3(1.4, 0, 0)]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xaad4ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const scanLine = new THREE.Line(lineGeo, lineMat);
    scanLine.position.z = 0.15;

    const group = new THREE.Group();
    group.add(wire.mesh, contour.mesh, points, plane, scanLine);
    const scene = new THREE.Scene();
    scene.add(group);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    renderer.setPixelRatio(dpr);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const hud = hudRef.current;
    const boxEl = hud?.querySelector<HTMLElement>('[data-box]') ?? null;
    const tagEls = FACE_TAGS.map((t) => ({ ...t, el: hud?.querySelector<HTMLElement>(`[data-tag="${t.id}"]`) ?? null }));

    let w = 1;
    let h = 1;
    let baseZ = 6.4;
    const resize = () => {
      w = host.clientWidth || 1;
      h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      baseZ = w / h < 0.95 ? 8.6 : 6.4;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const v3 = new THREE.Vector3();
    const smooth = { x: 0, y: 0 };

    const project = (idx: number) => {
      v3.set(FACE_VERTS[idx * 3], FACE_VERTS[idx * 3 + 1], FACE_VERTS[idx * 3 + 2]).applyMatrix4(group.matrixWorld).project(camera);
      return { x: (v3.x * 0.5 + 0.5) * w, y: (-v3.y * 0.5 + 0.5) * h };
    };

    const updateHud = (s: SceneState) => {
      group.updateMatrixWorld();
      if (boxEl) {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < FACE_VERTS.length / 3; i += 3) {
          const p = project(i);
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        }
        const pad = 14 + (1 - s.lock) * 70;
        boxEl.style.transform = `translate(${minX - pad}px, ${minY - pad}px)`;
        boxEl.style.width = `${maxX - minX + pad * 2}px`;
        boxEl.style.height = `${maxY - minY + pad * 2}px`;
        boxEl.style.opacity = String(Math.max(0, s.lock) * (1 - s.dissolve * 1.6 > 0 ? 1 - s.dissolve * 1.6 : 0));
      }
      for (const t of tagEls) {
        if (!t.el) continue;
        const y = FACE_VERTS[t.index * 3 + 1];
        const seen = s.scan < y - 0.02 && s.progress > 0.95;
        const p = project(t.index);
        t.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        t.el.style.opacity = seen ? String(Math.max(0, 1 - s.dissolve * 2.5)) : '0';
      }
    };

    const frame = (tMs: number) => {
      const s = state.current;
      const time = tMs / 1000;
      pointMat.uniforms.uProgress.value = s.progress;
      pointMat.uniforms.uTime.value = reduced ? 0 : time;
      shared.uScan.value = s.scan;
      shared.uPulse.value = s.pulse;
      shared.uDissolve.value = s.dissolve;
      const beamY = s.scan < 1.25 && s.scan > -1.25 ? s.scan : s.pulse < 1.25 && s.pulse > -1.25 ? s.pulse : null;
      lineMat.opacity = s.progress > 0.9 && beamY !== null ? 0.85 * (1 - s.dissolve) : 0;
      planeMat.uniforms.uOpacity.value = s.progress > 0.9 && beamY !== null && s.dissolve < 0.2 ? 1 : 0;
      if (beamY !== null) {
        plane.position.y = beamY + 0.35;
        scanLine.position.y = beamY;
      }

      smooth.x += (pointer.current.x - smooth.x) * 0.05;
      smooth.y += (pointer.current.y - smooth.y) * 0.05;
      const sway = reduced ? 0 : Math.sin(time * 0.4) * 0.12;
      group.rotation.y = smooth.x * 0.5 + sway + s.yaw;
      group.rotation.x = -smooth.y * 0.22;
      const z = baseZ * s.zoom * (1 - 0.5 * s.push);
      camera.position.set(0, 0, z);
      camera.lookAt(0, 0, 0);
      updateHud(s);
      renderer.render(scene, camera);
    };

    let raf = 0;
    let running = false;
    const loop = (t: number) => {
      frame(t);
      raf = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const dispose = () => {
      geo.dispose();
      pointMat.dispose();
      wire.g.dispose();
      wire.m.dispose();
      contour.g.dispose();
      contour.m.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };

    if (reduced) {
      const redraw = () => frame(0);
      redraw();
      window.addEventListener('resize', redraw);
      const id = window.setInterval(redraw, 500);
      return () => {
        window.removeEventListener('resize', redraw);
        window.clearInterval(id);
        ro.disconnect();
        dispose();
      };
    }

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? startLoop() : stopLoop()), { threshold: 0 });
    io.observe(host);
    const onVis = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      stopLoop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      dispose();
    };
  }, [state, pointer, hudRef, reduced, onFail]);

  return <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />;
}
