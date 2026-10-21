import { lazy, Suspense, useCallback, useState, type MutableRefObject, type RefObject } from 'react';
import type { PointerState, SceneState } from './FaceScene';
import { FaceFallback } from './FaceFallback';
import { FACE_TAGS } from '../lib/faceCloud';
import styles from './LatticeStage.module.css';

const FaceScene = lazy(() => import('./FaceScene').then((m) => ({ default: m.FaceScene })));

interface Props {
  state: MutableRefObject<SceneState>;
  pointer: MutableRefObject<PointerState>;
  hudRef: RefObject<HTMLDivElement | null>;
  reduced: boolean;
  boxLabel: string;
}

export function LatticeStage({ state, pointer, hudRef, reduced, boxLabel }: Props) {
  const [failed, setFailed] = useState(false);
  const onFail = useCallback(() => setFailed(true), []);

  return (
    <div className={styles.stage}>
      {failed ? (
        <FaceFallback />
      ) : (
        <Suspense fallback={null}>
          <FaceScene state={state} pointer={pointer} hudRef={hudRef} reduced={reduced} onFail={onFail} />
        </Suspense>
      )}
      {!failed && (
        <div ref={hudRef} className={styles.hud} aria-hidden="true">
          <div data-box className={styles.box}>
            <i className={styles.c1} />
            <i className={styles.c2} />
            <i className={styles.c3} />
            <i className={styles.c4} />
            <span className={styles.tag}>{boxLabel}</span>
          </div>
          {FACE_TAGS.map((t) => (
            <div key={t.id} data-tag={t.id} className={styles.mark}>
              <span className={styles.cross} />
              <span className={styles.markLabel}>{t.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
