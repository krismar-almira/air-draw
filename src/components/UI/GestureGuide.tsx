import type { GestureType } from '@/models/Gesture'

interface GestureGuideItem {
  type: GestureType
  icon: string
  label: string
  pose: string
  action: string
  enabled: boolean
}

const GESTURE_GUIDE: GestureGuideItem[] = [
  {
    type: 'draw',
    icon: '☝️',
    label: 'Draw',
    pose: 'Index finger up',
    action: 'Draw on canvas',
    enabled: true,
  },
  {
    type: 'erase',
    icon: '🤏',
    label: 'Erase',
    pose: 'Pinch thumb + index',
    action: 'Erase strokes',
    enabled: true,
  },
  {
    type: 'move',
    icon: '✌️',
    label: 'Move',
    pose: 'Index + middle up',
    action: 'Move cursor',
    enabled: false,
  },
  {
    type: 'clear',
    icon: '✊',
    label: 'Clear',
    pose: 'Closed fist',
    action: 'Clear canvas',
    enabled: true,
  },
  {
    type: 'undo',
    icon: '👍',
    label: 'Undo',
    pose: 'Thumbs up',
    action: 'Undo last stroke',
    enabled: false,
  },
  {
    type: 'redo',
    icon: '🤘',
    label: 'Redo',
    pose: 'Rock sign',
    action: 'Redo stroke',
    enabled: false,
  },
]

interface GestureGuideProps {
  activeGesture: GestureType
  pendingGesture?: GestureType | null
}

export function GestureGuide({
  activeGesture,
  pendingGesture,
}: GestureGuideProps) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
        Gesture Guide
      </h2>
      <ul className="space-y-2">
        {GESTURE_GUIDE.map((item) => {
          const isActive = activeGesture === item.type
          const isPending = pendingGesture === item.type && !isActive

          return (
            <li
              key={item.type}
              className={[
                'rounded-lg border px-3 py-2 transition-colors',
                isActive
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15'
                  : isPending
                    ? 'border-[var(--color-accent)]/50 bg-[var(--color-accent)]/5'
                    : 'border-[var(--color-border)] bg-[var(--color-bg)]',
                !item.enabled && !isActive && !isPending ? 'opacity-60' : '',
              ].join(' ')}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none" aria-hidden>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <span className="ml-auto rounded bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Active
                  </span>
                )}
                {isPending && (
                  <span className="ml-auto rounded bg-[var(--color-accent)]/30 px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-accent-hover)]">
                    Hold…
                  </span>
                )}
                {!item.enabled && !isActive && !isPending && (
                  <span className="ml-auto text-[10px] text-[var(--color-muted)]">
                    Soon
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{item.pose}</p>
              <p className="text-xs text-[var(--color-text)]">{item.action}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
