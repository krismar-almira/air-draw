import type { GestureType } from '@/models/Gesture'

interface ToolbarProps {
  gesture: GestureType
  pendingGesture?: GestureType | null
  fps?: number
  isLoading?: boolean
  showLandmarks?: boolean
  onToggleLandmarks?: () => void
  onOpenDocs?: () => void
}

const GESTURE_LABELS: Record<GestureType, string> = {
  draw: '✏️ Draw',
  move: '✋ Move',
  erase: '🤏 Erase',
  clear: '✊ Clear',
  undo: '↩ Undo',
  redo: '↪ Redo',
  none: '—',
}

export function Toolbar({
  gesture,
  pendingGesture,
  fps,
  isLoading,
  showLandmarks,
  onToggleLandmarks,
  onOpenDocs,
}: ToolbarProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight">Air Draw</h1>
        {isLoading && (
          <span className="text-xs text-[var(--color-muted)]">
            Loading hand tracking…
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm">
        {pendingGesture && pendingGesture !== 'none' && (
          <span className="text-xs text-[var(--color-muted)]">
            Hold {GESTURE_LABELS[pendingGesture].replace(/^[^\s]+\s/, '')}…
          </span>
        )}
        <span className="rounded-md bg-[var(--color-bg)] px-2.5 py-1 text-[var(--color-muted)]">
          Gesture:{' '}
          <strong className="text-[var(--color-text)]">
            {GESTURE_LABELS[gesture]}
          </strong>
        </span>

        {fps !== undefined && (
          <span className="text-xs text-[var(--color-muted)]">{fps} FPS</span>
        )}

        {onToggleLandmarks && (
          <button
            type="button"
            onClick={onToggleLandmarks}
            className={[
              'rounded-md px-2.5 py-1 text-xs transition-colors',
              showLandmarks
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-[var(--color-bg)] text-[var(--color-muted)] hover:text-[var(--color-text)]',
            ].join(' ')}
          >
            Landmarks
          </button>
        )}

        {onOpenDocs && (
          <button
            type="button"
            onClick={onOpenDocs}
            className="rounded-md bg-[var(--color-bg)] px-2.5 py-1 text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            Docs
          </button>
        )}
      </div>
    </header>
  )
}
