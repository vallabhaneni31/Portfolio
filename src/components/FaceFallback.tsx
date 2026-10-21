import { useMemo, type ReactElement } from 'react';
import { buildFaceCloud, FACE_VERTS } from '../lib/faceCloud';

/** Static SVG version of the face mesh for devices without WebGL. */
export function FaceFallback() {
  const cloud = useMemo(() => buildFaceCloud(0), []);
  const segs: ReactElement[] = [];
  for (let i = 0; i < cloud.edges.length; i += 2) {
    const a = cloud.edges[i] * 3;
    const b = cloud.edges[i + 1] * 3;
    segs.push(<line key={i} x1={FACE_VERTS[a]} y1={-FACE_VERTS[a + 1]} x2={FACE_VERTS[b]} y2={-FACE_VERTS[b + 1]} stroke="#3d7bff" strokeWidth={0.004} opacity={0.45} />);
  }
  const pts: ReactElement[] = [];
  for (let i = 0; i < FACE_VERTS.length; i += 3) {
    pts.push(<circle key={i} cx={FACE_VERTS[i]} cy={-FACE_VERTS[i + 1]} r={0.008} fill="#c7b5ff" />);
  }
  return (
    <svg viewBox="-1.2 -1.3 2.4 2.6" role="img" aria-label="Abstract wireframe of a face" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {segs}
      {pts}
    </svg>
  );
}
