import { FACE_VERTS, FACE_TRIS, FACE_REGIONS } from './faceMesh';

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface FaceCloud {
  /** surface samples followed by the 468 mesh vertices */
  positions: Float32Array;
  normals: Float32Array;
  /** 0 surface sample, 0.55 mesh vertex, 1 contour landmark (eyes, lips, brows, jaw, nose) */
  land: Float32Array;
  count: number;
  /** triangulation edges as vertex index pairs */
  edges: Uint16Array;
  /** contour edges (eyes, lips, brows, face oval, nose bridge) as vertex index pairs */
  contours: Uint16Array;
}

/** Real face reference mesh turned into a dense point cloud. Deterministic. */
export function buildFaceCloud(surfaceSamples: number): FaceCloud {
  const rand = mulberry32(11);
  const nVert = FACE_VERTS.length / 3;
  const nTri = FACE_TRIS.length / 3;

  // vertex normals
  const vn = new Float32Array(nVert * 3);
  const triNormal = new Float32Array(nTri * 3);
  const area = new Float32Array(nTri);
  for (let t = 0; t < nTri; t++) {
    const a = FACE_TRIS[t * 3] * 3;
    const b = FACE_TRIS[t * 3 + 1] * 3;
    const c = FACE_TRIS[t * 3 + 2] * 3;
    const ux = FACE_VERTS[b] - FACE_VERTS[a];
    const uy = FACE_VERTS[b + 1] - FACE_VERTS[a + 1];
    const uz = FACE_VERTS[b + 2] - FACE_VERTS[a + 2];
    const vx = FACE_VERTS[c] - FACE_VERTS[a];
    const vy = FACE_VERTS[c + 1] - FACE_VERTS[a + 1];
    const vz = FACE_VERTS[c + 2] - FACE_VERTS[a + 2];
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    area[t] = len / 2;
    nx /= len;
    ny /= len;
    nz /= len;
    // make sure triangles face outward (toward +z side of the face)
    const s = nz < 0 ? -1 : 1;
    triNormal.set([nx * s, ny * s, nz * s], t * 3);
    for (const v of [a, b, c]) {
      vn[v] += nx * s * area[t];
      vn[v + 1] += ny * s * area[t];
      vn[v + 2] += nz * s * area[t];
    }
  }
  for (let i = 0; i < nVert; i++) {
    const l = Math.hypot(vn[i * 3], vn[i * 3 + 1], vn[i * 3 + 2]) || 1;
    vn[i * 3] /= l;
    vn[i * 3 + 1] /= l;
    vn[i * 3 + 2] /= l;
  }

  // cumulative area for weighted sampling
  const cum = new Float32Array(nTri);
  let total = 0;
  for (let t = 0; t < nTri; t++) {
    total += area[t];
    cum[t] = total;
  }

  const contourVerts = new Set<number>();
  Object.values(FACE_REGIONS).forEach((r) => r.forEach((i) => contourVerts.add(i)));

  const count = surfaceSamples + nVert;
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const land = new Float32Array(count);

  for (let i = 0; i < surfaceSamples; i++) {
    const r = rand() * total;
    let lo = 0;
    let hi = nTri - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < r) lo = mid + 1;
      else hi = mid;
    }
    const t = lo;
    let u = rand();
    let v = rand();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;
    const ia = FACE_TRIS[t * 3];
    const ib = FACE_TRIS[t * 3 + 1];
    const ic = FACE_TRIS[t * 3 + 2];
    for (let k = 0; k < 3; k++) {
      positions[i * 3 + k] = FACE_VERTS[ia * 3 + k] * w + FACE_VERTS[ib * 3 + k] * u + FACE_VERTS[ic * 3 + k] * v;
      normals[i * 3 + k] = vn[ia * 3 + k] * w + vn[ib * 3 + k] * u + vn[ic * 3 + k] * v;
    }
    land[i] = 0;
  }
  for (let i = 0; i < nVert; i++) {
    const o = (surfaceSamples + i) * 3;
    positions.set(FACE_VERTS.subarray(i * 3, i * 3 + 3), o);
    normals.set(vn.subarray(i * 3, i * 3 + 3), o);
    land[surfaceSamples + i] = contourVerts.has(i) ? 1 : 0.55;
  }

  // unique triangulation edges
  const seen = new Set<number>();
  const edges: number[] = [];
  for (let t = 0; t < nTri; t++) {
    const idx = [FACE_TRIS[t * 3], FACE_TRIS[t * 3 + 1], FACE_TRIS[t * 3 + 2]];
    for (let k = 0; k < 3; k++) {
      const a = idx[k];
      const b = idx[(k + 1) % 3];
      const key = a < b ? a * 1000 + b : b * 1000 + a;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push(a, b);
      }
    }
  }
  const contours: number[] = [];
  Object.values(FACE_REGIONS).forEach((r) => contours.push(...r));

  return { positions, normals, land, count, edges: new Uint16Array(edges), contours: new Uint16Array(contours) };
}

/** Vertex indices of the reference mesh used for on-screen annotations. */
export const FACE_TAGS = [
  { id: 'brow', label: 'brow', index: 10 },
  { id: 'reye', label: 'right eye', index: 33 },
  { id: 'leye', label: 'left eye', index: 263 },
  { id: 'nose', label: 'nose tip', index: 1 },
  { id: 'mouth', label: 'mouth', index: 13 },
  { id: 'chin', label: 'chin', index: 152 },
] as const;

export { FACE_VERTS, FACE_TRIS };
