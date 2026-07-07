import { COLOR_PALETTE } from '@/config/constants'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_PALETTE.map((c) => (
        <button
          key={c}
          type="button"
          title={c}
          onClick={() => onChange(c)}
          className={[
            'h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
            color === c ? 'border-white scale-110' : 'border-transparent',
          ].join(' ')}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  )
}
