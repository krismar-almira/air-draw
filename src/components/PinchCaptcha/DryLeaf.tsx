import { LEAF_SIZE } from '@/utils/captchaLeafLayout'

interface DryLeafProps {
  id: number
  variant: 0 | 1 | 2
  rotation: number
  dragging?: boolean
}

const LEAF_PATHS = [
  'M32 4 C18 6, 6 18, 4 34 C3 48, 10 58, 22 60 C34 61, 48 52, 54 36 C58 22, 48 8, 32 4 Z',
  'M30 6 C14 8, 4 22, 6 38 C8 50, 18 58, 30 59 C42 58, 54 46, 56 30 C57 16, 44 4, 30 6 Z',
  'M28 8 C12 12, 5 26, 8 42 C11 54, 22 61, 34 59 C46 55, 58 40, 55 24 C52 12, 40 5, 28 8 Z',
]

export function DryLeaf({ id, variant, rotation, dragging }: DryLeafProps) {
  const height = Math.round(LEAF_SIZE * 1.1)
  return (
    <svg
      width={LEAF_SIZE}
      height={height}
      viewBox="0 0 64 64"
      className={dragging ? 'scale-110' : ''}
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: dragging
          ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.45))'
          : 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`leaf-fill-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4a574" />
          <stop offset="45%" stopColor="#a67c52" />
          <stop offset="100%" stopColor="#7a5c3a" />
        </linearGradient>
        <linearGradient id={`leaf-edge-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6b4a2e" />
          <stop offset="100%" stopColor="#8f6840" />
        </linearGradient>
      </defs>
      <path
        d={LEAF_PATHS[variant]}
        fill={`url(#leaf-fill-${id})`}
        stroke={`url(#leaf-edge-${id})`}
        strokeWidth="1.2"
      />
      <path
        d="M32 8 L30 56 M32 12 C24 22, 20 34, 18 48 M32 14 C40 24, 44 36, 46 50"
        fill="none"
        stroke="#5c3d24"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <ellipse cx="32" cy="32" rx="3" ry="5" fill="#4a3018" opacity="0.35" />
    </svg>
  )
}
