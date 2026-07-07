import type { CaptchaMode } from '@/models/CaptchaItem'

interface CaptchaModePickerProps {
  mode: CaptchaMode
  onChange: (mode: CaptchaMode) => void
  disabled?: boolean
}

export function CaptchaModePicker({ mode, onChange, disabled }: CaptchaModePickerProps) {
  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="flex rounded-full border border-white/20 bg-black/50 p-1 backdrop-blur-md">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('delivery')}
          className={[
            'rounded-full px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40',
            mode === 'delivery'
              ? 'bg-[var(--color-accent)] text-white'
              : 'text-white/70 hover:text-white',
          ].join(' ')}
        >
          🎯 Delivery
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('garbage')}
          className={[
            'rounded-full px-4 py-2 text-xs font-medium transition-colors disabled:opacity-40',
            mode === 'garbage'
              ? 'bg-lime-600 text-white'
              : 'text-white/70 hover:text-white',
          ].join(' ')}
        >
          🗑️ Garbage
        </button>
      </div>
    </div>
  )
}
