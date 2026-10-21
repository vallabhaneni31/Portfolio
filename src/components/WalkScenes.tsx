import type { ReactElement } from 'react';
import styles from './Walk.module.css';

/**
 * Line-art environments for the walk. One per project, keyed by project id.
 * All of them are illustrations, not photographs or product screenshots.
 * Ground line is y=400 in a 1000x420 viewBox; the walker stops at x=500.
 */

const A = 'var(--blue-soft)';
const B = 'var(--violet)';

function Frame({ children }: { children: ReactElement | ReactElement[] }) {
  return (
    <svg className={styles.scene} viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  );
}

const frs = (
  <Frame>
    <g>
      <path d="M760 400V150M760 150H700" />
      <rect x="650" y="138" width="52" height="26" rx="4" />
      <circle cx="652" cy="151" r="7" stroke={A} />
      <path d="M648 151L440 400H600Z" stroke={A} strokeDasharray="4 6" className={styles.fov} />
    </g>
    <g>
      <circle cx="300" cy="318" r="24" />
      <path d="M252 400c0-34 22-50 48-50s48 16 48 50" />
      <rect x="262" y="284" width="76" height="82" rx="3" stroke={A} strokeDasharray="5 5" className={styles.bbox} />
      <path d="M262 296v-12h12M326 284h12v12M338 354v12h-12M274 366h-12v-12" stroke={A} strokeWidth="2.5" />
      <text x="262" y="276" className={styles.tag} fill={A} stroke="none">face</text>
    </g>
    <g opacity=".6">
      <circle cx="140" cy="342" r="16" />
      <path d="M108 400c0-24 14-34 32-34s32 10 32 34" />
      <rect x="116" y="320" width="48" height="56" rx="3" stroke={A} strokeDasharray="4 5" className={styles.bbox} />
    </g>
    <g stroke={B} opacity=".7">
      <path d="M840 400v-70h60v70M850 330v-20h40v20" />
    </g>
  </Frame>
);

const voice = (
  <Frame>
    <g>
      <path d="M735 400L760 190L785 400M742 340H778M748 290H772M753 245H767" />
      <circle cx="760" cy="186" r="5" stroke={A} />
      {[34, 62, 92].map((r, i) => (
        <circle key={r} cx="760" cy="186" r={r} stroke={A} className={styles.wave} style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
    </g>
    <g stroke={B}>
      {Array.from({ length: 22 }).map((_, i) => {
        const h = 14 + Math.abs(Math.sin(i * 1.7) * 62) + (i % 3) * 8;
        return <rect key={i} x={170 + i * 12} y={400 - h} width="5" height={h} rx="2" className={styles.bar} style={{ animationDelay: `${(i % 7) * 0.12}s` }} />;
      })}
    </g>
    <path d="M430 330c0-18 14-30 30-30s30 12 30 30-14 30-30 30" opacity=".5" />
  </Frame>
);

const judicial = (
  <Frame>
    <g>
      <path d="M590 232L720 168L850 232Z" />
      <rect x="600" y="232" width="240" height="12" />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect key={i} x={618 + i * 48} y="244" width="14" height="136" />
      ))}
      <rect x="590" y="380" width="260" height="10" />
      <rect x="578" y="390" width="284" height="10" />
      <circle cx="720" cy="204" r="10" stroke={A} />
    </g>
    <g stroke={B}>
      <rect x="196" y="340" width="130" height="58" rx="3" />
      <rect x="206" y="322" width="130" height="58" rx="3" opacity=".7" />
      <rect x="216" y="304" width="130" height="58" rx="3" opacity=".45" />
      <path d="M232 322h60M232 336h92M232 350h40" stroke={A} />
    </g>
    <g stroke={A} className={styles.sweep}>
      <circle cx="400" cy="318" r="20" />
      <path d="M414 334l22 24" />
    </g>
  </Frame>
);

const recruit = (
  <Frame>
    <g>
      <rect x="620" y="150" width="200" height="250" />
      {Array.from({ length: 5 }).flatMap((_, r) =>
        Array.from({ length: 4 }).map((__, c) => (
          <rect key={`${r}${c}`} x={636 + c * 46} y={166 + r * 44} width="28" height="26" rx="2" stroke={(r * 4 + c) % 5 === 0 ? A : 'currentColor'} opacity={(r * 4 + c) % 5 === 0 ? 1 : 0.5} className={(r * 4 + c) % 5 === 0 ? styles.win : undefined} />
        )),
      )}
    </g>
    <g stroke={B}>
      <rect x="190" y="306" width="170" height="92" rx="6" />
      <path d="M275 398v-0M240 398h70" />
      <path d="M208 326h60M208 342h104M208 358h84M208 374h50" stroke={A} />
      <path d="M330 270c0-14 10-22 24-22h52c14 0 24 8 24 22v22c0 14-10 22-24 22h-30l-18 14v-14c-16-2-28-10-28-22z" opacity=".8" />
      <circle cx="356" cy="282" r="2.5" fill="currentColor" />
      <circle cx="378" cy="282" r="2.5" fill="currentColor" />
      <circle cx="400" cy="282" r="2.5" fill="currentColor" />
    </g>
  </Frame>
);

const bus = (
  <Frame>
    <g>
      <rect x="540" y="306" width="290" height="84" rx="14" />
      <path d="M540 360H830" opacity=".5" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <rect x={560 + i * 54} y="320" width="42" height="30" rx="4" />
          <circle cx={581 + i * 54} cy="338" r="6" stroke={A} opacity={i % 2 ? 0.4 : 0.9} />
        </g>
      ))}
      <circle cx="610" cy="392" r="18" />
      <circle cx="760" cy="392" r="18" />
      <circle cx="684" cy="300" r="7" stroke={A} />
      <path d="M684 300L640 262M684 300L728 262" stroke={A} strokeDasharray="3 5" className={styles.fov} />
    </g>
    <g stroke={B}>
      <path d="M270 400V250" />
      <rect x="236" y="214" width="68" height="44" rx="4" />
      <path d="M250 232h40M250 244h24" stroke={A} />
    </g>
  </Frame>
);

const rag = (
  <Frame>
    <g>
      <rect x="580" y="196" width="250" height="196" />
      <path d="M580 262H830M580 328H830" />
      {[0, 1, 2].map((row) =>
        Array.from({ length: 8 }).map((_, i) => {
          const h = 38 + ((i * 17 + row * 11) % 20);
          const base = [262, 328, 390][row];
          return <rect key={`${row}${i}`} x={592 + i * 28} y={base - h} width="18" height={h} stroke={i === 4 && row === 1 ? A : 'currentColor'} opacity={i === 4 && row === 1 ? 1 : 0.55} />;
        }),
      )}
    </g>
    <g stroke={B}>
      {[
        [180, 330], [240, 290], [300, 340], [350, 300], [270, 380], [200, 380], [390, 360], [330, 250],
      ].map(([x, y], i, arr) => (
        <g key={i}>
          {i > 0 && <path d={`M${arr[i - 1][0]} ${arr[i - 1][1]}L${x} ${y}`} opacity=".4" />}
          <circle cx={x} cy={y} r="6" stroke={i === 3 ? A : B} className={i === 3 ? styles.pulseNode : undefined} />
        </g>
      ))}
    </g>
  </Frame>
);

const jetsonllm = (
  <Frame>
    <g>
      <rect x="590" y="296" width="230" height="96" rx="6" />
      <rect x="640" y="318" width="62" height="46" rx="3" stroke={A} />
      <path d="M652 318v-10M668 318v-10M684 318v-10M652 364v10M668 364v10M684 364v10" stroke={A} />
      <circle cx="768" cy="344" r="22" stroke={B} />
      <path d="M768 322v44M746 344h44" stroke={B} className={styles.spin} />
      <path d="M606 296v-12M626 296v-12M786 296v-12M806 296v-12" opacity=".5" />
    </g>
    <g stroke={B}>
      <rect x="150" y="246" width="240" height="136" rx="6" />
      <path d="M150 268H390" />
      <circle cx="166" cy="257" r="3" />
      <circle cx="180" cy="257" r="3" />
      <path d="M170 292h80M170 312h130M170 332h60M170 352h100" stroke={A} />
      <rect x="280" y="346" width="9" height="14" fill="currentColor" className={styles.blink} />
    </g>
  </Frame>
);

const agentic = (
  <Frame>
    <g>
      {[
        [620, 250, 700, 180],
        [620, 250, 760, 300],
        [620, 250, 690, 365],
        [700, 180, 790, 215],
        [760, 300, 790, 215],
      ].map(([x1, y1, x2, y2], i) => (
        <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={B} opacity=".6" strokeDasharray="3 5" className={styles.fov} />
      ))}
      <circle cx="620" cy="250" r="22" stroke={A} className={styles.pulseNode} />
      {[[700, 180], [760, 300], [690, 365], [790, 215]].map(([x, y], i) => (
        <rect key={i} x={x - 14} y={y - 14} width="28" height="28" rx="6" />
      ))}
    </g>
    <g stroke={B}>
      <path d="M180 330a70 70 0 1 1 70 70" />
      <path d="M240 392l12 8-14 6" />
      <circle cx="250" cy="330" r="6" stroke={A} />
    </g>
  </Frame>
);

export const scenes: Record<string, ReactElement> = {
  frs,
  voice,
  judicial,
  recruit,
  bus,
  rag,
  jetsonllm,
  agentic,
};

export const fallbackScene = agentic;

/** Backdrop hue per project, in degrees. */
export const hues: Record<string, number> = {
  frs: 222,
  voice: 262,
  judicial: 282,
  recruit: 205,
  bus: 190,
  rag: 240,
  jetsonllm: 165,
  agentic: 300,
};
