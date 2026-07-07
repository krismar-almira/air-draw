interface VirtualCursorProps {
  x: number
  y: number
  isIndexUp: boolean
  clickFlash: 'left' | 'right' | null
  visible: boolean
}

export function VirtualCursor({
  x,
  y,
  isIndexUp,
  clickFlash,
  visible,
}: VirtualCursorProps) {
  if (!visible) return null

  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{ left: x, top: y }}
      aria-hidden
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        className={[
          'drop-shadow-md transition-transform duration-75',
          isIndexUp ? 'scale-100' : 'scale-95 opacity-90',
          clickFlash === 'right' ? 'text-orange-400' : 'text-white',
        ].join(' ')}
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }}
      >
        <path
          d="M4 2 L4 22 L9 17 L13 26 L16 25 L12 16 L20 16 Z"
          fill="currentColor"
          stroke="#1a1a22"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {clickFlash === 'left' && (
        <span className="absolute left-5 top-5 rounded bg-green-500/90 px-1 py-0.5 text-[9px] font-medium text-white">
          L
        </span>
      )}
      {clickFlash === 'right' && (
        <span className="absolute left-5 top-5 rounded bg-orange-500/90 px-1 py-0.5 text-[9px] font-medium text-white">
          R
        </span>
      )}
    </div>
  )
}
