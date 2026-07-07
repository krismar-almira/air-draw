interface GarbageBinProps {
  width: number
  height: number
  highlight?: boolean
}

export function GarbageBin({ width, height, highlight }: GarbageBinProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 168 112"
      className="drop-shadow-2xl"
      aria-label="Garbage bin"
    >
      <defs>
        <linearGradient id="bin-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a5568" />
          <stop offset="50%" stopColor="#2d3748" />
          <stop offset="100%" stopColor="#1a202c" />
        </linearGradient>
        <linearGradient id="bin-rim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#718096" />
          <stop offset="100%" stopColor="#4a5568" />
        </linearGradient>
      </defs>

      <ellipse
        cx="84"
        cy="106"
        rx="62"
        ry="8"
        fill="rgba(0,0,0,0.35)"
      />

      <path
        d="M28 36 L34 98 L134 98 L140 36 Z"
        fill="url(#bin-body)"
        stroke="#1a202c"
        strokeWidth="1.5"
      />

      <path
        d="M22 32 L146 32 L142 42 L26 42 Z"
        fill="url(#bin-rim)"
        stroke="#2d3748"
        strokeWidth="1.2"
      />

      <rect x="36" y="44" width="4" height="48" rx="1" fill="#1a202c" opacity="0.35" />
      <rect x="82" y="44" width="4" height="48" rx="1" fill="#1a202c" opacity="0.35" />
      <rect x="128" y="44" width="4" height="48" rx="1" fill="#1a202c" opacity="0.35" />

      <path
        d="M52 18 C52 12, 58 8, 84 8 C110 8, 116 12, 116 18 L118 32 L50 32 Z"
        fill="#374151"
        stroke="#1f2937"
        strokeWidth="1.2"
      />

      <rect x="78" y="4" width="12" height="10" rx="3" fill="#6b7280" stroke="#374151" />

      {highlight && (
        <rect
          x="24"
          y="28"
          width="120"
          height="76"
          rx="8"
          fill="none"
          stroke="#86efac"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.9"
        />
      )}

      <text
        x="84"
        y="72"
        textAnchor="middle"
        fill="rgba(255,255,255,0.25)"
        fontSize="11"
        fontWeight="600"
        letterSpacing="2"
      >
        TRASH
      </text>
    </svg>
  )
}
