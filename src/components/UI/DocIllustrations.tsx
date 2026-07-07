/** Simple SVG hand illustrations for documentation */

function HandBase({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 140"
      className="mx-auto h-36 w-auto"
      aria-hidden
    >
      <rect
        x="4"
        y="4"
        width="112"
        height="132"
        rx="12"
        fill="var(--color-bg)"
        stroke="var(--color-border)"
      />
      {children}
    </svg>
  )
}

export function DrawHandIllustration() {
  return (
    <HandBase>
      <ellipse cx="60" cy="95" rx="28" ry="32" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="38" y="55" width="12" height="38" rx="6" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="52" y="28" width="12" height="58" rx="6" fill="#818cf8" stroke="#6366f1" strokeWidth="2" />
      <rect x="66" y="55" width="12" height="38" rx="6" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="80" y="62" width="11" height="32" rx="5" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="30" y="68" width="14" height="28" rx="6" fill="#fcd9bd" stroke="#c4956a" transform="rotate(-25 37 82)" />
      <circle cx="58" cy="24" r="5" fill="#6366f1" />
      <text x="60" y="128" textAnchor="middle" fill="var(--color-muted)" fontSize="10">
        Index up
      </text>
    </HandBase>
  )
}

export function EraseHandIllustration() {
  return (
    <HandBase>
      <ellipse cx="60" cy="95" rx="28" ry="32" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="38" y="55" width="12" height="38" rx="6" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="52" y="45" width="12" height="48" rx="6" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="66" y="55" width="12" height="38" rx="6" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="80" y="62" width="11" height="32" rx="5" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="28" y="62" width="14" height="28" rx="6" fill="#fcd9bd" stroke="#c4956a" transform="rotate(-15 35 76)" />
      <circle cx="42" cy="58" r="6" fill="#f97316" opacity="0.8" />
      <circle cx="54" cy="52" r="6" fill="#f97316" opacity="0.8" />
      <text x="60" y="128" textAnchor="middle" fill="var(--color-muted)" fontSize="10">
        Pinch
      </text>
    </HandBase>
  )
}

export function ClearHandIllustration() {
  return (
    <HandBase>
      <ellipse cx="60" cy="92" rx="30" ry="34" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="40" y="68" width="11" height="28" rx="5" fill="#fcd9bd" stroke="#c4956a" transform="rotate(8 45 82)" />
      <rect x="52" y="66" width="11" height="30" rx="5" fill="#fcd9bd" stroke="#c4956a" />
      <rect x="64" y="68" width="11" height="28" rx="5" fill="#fcd9bd" stroke="#c4956a" transform="rotate(-8 69 82)" />
      <rect x="74" y="72" width="10" height="24" rx="5" fill="#fcd9bd" stroke="#c4956a" transform="rotate(-18 79 84)" />
      <rect x="34" y="72" width="10" height="24" rx="5" fill="#fcd9bd" stroke="#c4956a" transform="rotate(18 39 84)" />
      <text x="60" y="128" textAnchor="middle" fill="var(--color-muted)" fontSize="10">
        Closed fist
      </text>
    </HandBase>
  )
}

export function PipelineIllustration() {
  return (
    <svg viewBox="0 0 520 100" className="w-full" aria-hidden>
      {[
        { x: 10, label: 'Camera', sub: 'Webcam' },
        { x: 110, label: 'MediaPipe', sub: '21 points' },
        { x: 230, label: 'Gesture', sub: 'Finger rules' },
        { x: 350, label: 'Debounce', sub: 'Hold pose' },
        { x: 460, label: 'Canvas', sub: 'Draw' },
      ].map((step, i, arr) => (
        <g key={step.label}>
          <rect
            x={step.x}
            y="20"
            width="80"
            height="50"
            rx="8"
            fill="var(--color-bg)"
            stroke="var(--color-accent)"
          />
          <text x={step.x + 40} y="42" textAnchor="middle" fill="var(--color-text)" fontSize="11" fontWeight="600">
            {step.label}
          </text>
          <text x={step.x + 40} y="58" textAnchor="middle" fill="var(--color-muted)" fontSize="9">
            {step.sub}
          </text>
          {i < arr.length - 1 && (
            <path
              d={`M ${step.x + 82} 45 L ${arr[i + 1]!.x - 8} 45`}
              stroke="var(--color-muted)"
              markerEnd="url(#arrow)"
            />
          )}
        </g>
      ))}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--color-muted)" />
        </marker>
      </defs>
    </svg>
  )
}

export function LayerStackIllustration() {
  return (
    <svg viewBox="0 0 280 180" className="mx-auto w-full max-w-xs" aria-hidden>
      {[
        { y: 10, h: 40, label: 'Landmark overlay', color: '#818cf8' },
        { y: 55, h: 40, label: 'Drawing canvas', color: '#6366f1' },
        { y: 100, h: 40, label: 'Camera video', color: '#4b5563' },
      ].map((layer) => (
        <g key={layer.label}>
          <rect
            x="40"
            y={layer.y}
            width="200"
            height={layer.h}
            rx="6"
            fill={layer.color}
            opacity="0.35"
            stroke={layer.color}
          />
          <text x="140" y={layer.y + layer.h / 2 + 4} textAnchor="middle" fill="var(--color-text)" fontSize="11">
            {layer.label}
          </text>
        </g>
      ))}
      <text x="140" y="168" textAnchor="middle" fill="var(--color-muted)" fontSize="10">
        Stacked layers (top → bottom)
      </text>
    </svg>
  )
}

export function DrawExampleIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="mx-auto w-full max-w-xs" aria-hidden>
      <rect x="4" y="4" width="192" height="112" rx="8" fill="var(--color-bg)" stroke="var(--color-border)" />
      <path
        d="M 30 80 Q 60 30, 100 60 T 170 50"
        fill="none"
        stroke="#6366f1"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="30" cy="80" r="4" fill="#818cf8" />
      <circle cx="170" cy="50" r="4" fill="#818cf8" />
      <path d="M 155 48 L 170 50 L 165 58" fill="none" stroke="#818cf8" strokeWidth="1.5" />
      <text x="100" y="105" textAnchor="middle" fill="var(--color-muted)" fontSize="10">
        Move index finger to draw curves
      </text>
    </svg>
  )
}

export function DebounceExampleIllustration() {
  return (
    <svg viewBox="0 0 280 80" className="w-full" aria-hidden>
      <line x1="20" y1="40" x2="260" y2="40" stroke="var(--color-border)" strokeWidth="2" />
      <circle cx="40" cy="40" r="6" fill="var(--color-muted)" />
      <text x="40" y="62" textAnchor="middle" fill="var(--color-muted)" fontSize="9">Detect</text>
      <circle cx="140" cy="40" r="6" fill="#eab308" />
      <text x="140" y="62" textAnchor="middle" fill="var(--color-muted)" fontSize="9">Hold…</text>
      <circle cx="240" cy="40" r="6" fill="#6366f1" />
      <text x="240" y="62" textAnchor="middle" fill="var(--color-muted)" fontSize="9">Active ✓</text>
      <text x="90" y="28" textAnchor="middle" fill="var(--color-text)" fontSize="9">150ms</text>
    </svg>
  )
}

export function MediaPipeInitIllustration() {
  return (
    <svg viewBox="0 0 400 120" className="w-full" aria-hidden>
      {[
        { x: 20, label: 'Browser', sub: 'App starts' },
        { x: 120, label: 'WASM', sub: 'Runtime load' },
        { x: 220, label: 'Model', sub: '.task file' },
        { x: 320, label: 'Ready', sub: 'HandLandmarker' },
      ].map((step, i, arr) => (
        <g key={step.label}>
          <rect x={step.x} y="25" width="70" height="48" rx="8" fill="var(--color-bg)" stroke="#22c55e" />
          <text x={step.x + 35} y="46" textAnchor="middle" fill="var(--color-text)" fontSize="10" fontWeight="600">
            {step.label}
          </text>
          <text x={step.x + 35} y="62" textAnchor="middle" fill="var(--color-muted)" fontSize="8">
            {step.sub}
          </text>
          {i < arr.length - 1 && (
            <path
              d={`M ${step.x + 72} 49 L ${arr[i + 1]!.x - 8} 49`}
              stroke="var(--color-muted)"
              markerEnd="url(#mp-arrow)"
            />
          )}
        </g>
      ))}
      <text x="200" y="105" textAnchor="middle" fill="var(--color-muted)" fontSize="9">
        One-time setup — runs 100% in your browser
      </text>
      <defs>
        <marker id="mp-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--color-muted)" />
        </marker>
      </defs>
    </svg>
  )
}

export function MediaPipeLoopIllustration() {
  return (
    <svg viewBox="0 0 400 130" className="w-full" aria-hidden>
      <rect x="10" y="10" width="380" height="110" rx="10" fill="var(--color-bg)" stroke="var(--color-border)" />
      {[
        { x: 30, y: 45, label: 'Video frame' },
        { x: 130, y: 45, label: 'detectForVideo()' },
        { x: 250, y: 45, label: 'Neural net' },
        { x: 340, y: 45, label: '21 points' },
      ].map((step, i, arr) => (
        <g key={step.label}>
          <rect x={step.x} y={step.y} width="75" height="36" rx="6" fill="var(--color-surface)" stroke="var(--color-accent)" />
          <text x={step.x + 37} y={step.y + 22} textAnchor="middle" fill="var(--color-text)" fontSize="8" fontWeight="500">
            {step.label}
          </text>
          {i < arr.length - 1 && (
            <path d={`M ${step.x + 77} 63 L ${arr[i + 1]!.x - 3} 63`} stroke="var(--color-muted)" markerEnd="url(#loop-arrow)" />
          )}
        </g>
      ))}
      <path
        d="M 377 63 Q 395 63, 395 95 Q 395 115, 200 115 Q 5 115, 5 95 Q 5 80, 30 80"
        fill="none"
        stroke="#6366f1"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#loop-arrow)"
      />
      <text x="200" y="100" textAnchor="middle" fill="#6366f1" fontSize="9">~60 FPS loop</text>
      <defs>
        <marker id="loop-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--color-muted)" />
        </marker>
      </defs>
    </svg>
  )
}

export function HandLandmarksIllustration() {
  const points: [number, number, string][] = [
    [60, 110, '0 wrist'],
    [38, 88, ''],
    [28, 68, ''],
    [22, 48, ''],
    [18, 28, '4 thumb'],
    [48, 72, ''],
    [46, 52, ''],
    [48, 32, ''],
    [50, 12, '8 index'],
    [68, 74, ''],
    [72, 54, ''],
    [74, 36, '12'],
    [88, 78, ''],
    [92, 60, ''],
    [94, 44, '16'],
    [102, 82, ''],
    [106, 66, ''],
    [108, 52, '20'],
  ]
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [5, 9], [9, 13], [13, 5],
  ]

  return (
    <svg viewBox="0 0 200 150" className="mx-auto w-full max-w-xs" aria-hidden>
      <rect x="4" y="4" width="192" height="142" rx="8" fill="var(--color-bg)" stroke="var(--color-border)" />
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={points[a]![0]}
          y1={points[a]![1]}
          x2={points[b]![0]}
          y2={points[b]![1]}
          stroke="rgba(99,102,241,0.5)"
          strokeWidth="1.5"
        />
      ))}
      {points.map(([x, y, label], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 8 ? 5 : 3.5} fill={i === 8 ? '#6366f1' : '#818cf8'} />
          {label && (
            <text x={x + (i === 8 ? 8 : 6)} y={y + 3} fill="var(--color-muted)" fontSize="7">
              {label}
            </text>
          )}
        </g>
      ))}
      <text x="100" y="140" textAnchor="middle" fill="var(--color-muted)" fontSize="9">
        21 landmarks — #8 index tip draws
      </text>
    </svg>
  )
}

export function MediaPipeDownstreamIllustration() {
  return (
    <svg viewBox="0 0 360 90" className="w-full" aria-hidden>
      {[
        { x: 5, label: 'landmarks', w: 62 },
        { x: 75, label: 'gestures', w: 58 },
        { x: 141, label: 'debounce', w: 58 },
        { x: 207, label: 'screen xy', w: 58 },
        { x: 273, label: 'canvas', w: 58 },
      ].map((step, i, arr) => (
        <g key={step.label}>
          <rect x={step.x} y="25" width={step.w} height="36" rx="6" fill="var(--color-bg)" stroke="var(--color-accent)" />
          <text x={step.x + step.w / 2} y="47" textAnchor="middle" fill="var(--color-text)" fontSize="9">
            {step.label}
          </text>
          {i < arr.length - 1 && (
            <path
              d={`M ${step.x + step.w + 2} 43 L ${arr[i + 1]!.x - 4} 43`}
              stroke="var(--color-muted)"
              markerEnd="url(#ds-arrow)"
            />
          )}
        </g>
      ))}
      <text x="180" y="78" textAnchor="middle" fill="var(--color-muted)" fontSize="9">
        App logic after MediaPipe
      </text>
      <defs>
        <marker id="ds-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--color-muted)" />
        </marker>
      </defs>
    </svg>
  )
}
