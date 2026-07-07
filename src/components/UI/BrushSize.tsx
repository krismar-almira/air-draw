import { BRUSH_SIZES } from '@/config/constants'

interface BrushSizeProps {
  size: number
  onChange: (size: number) => void
}

export function BrushSize({ size, onChange }: BrushSizeProps) {
  return (
    <div className="flex items-center gap-2">
      {BRUSH_SIZES.map((s) => (
        <button
          key={s}
          type="button"
          title={`${s}px`}
          onClick={() => onChange(s)}
          className={[
            'flex items-center justify-center rounded-full border transition-colors',
            size === s
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/20'
              : 'border-[var(--color-border)] hover:border-[var(--color-muted)]',
          ].join(' ')}
          style={{ width: s + 12, height: s + 12 }}
        >
          <span
            className="rounded-full bg-white"
            style={{ width: s, height: s }}
          />
        </button>
      ))}
    </div>
  )
}
