import type { DrawingTool } from '@/hooks/useDrawing'

interface DrawingToolbarProps {
  tool: DrawingTool
  color: string
  brushSize: number
  canUndo: boolean
  canRedo: boolean
  onToolChange: (tool: DrawingTool) => void
  onColorChange: (color: string) => void
  onBrushSizeChange: (size: number) => void
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onSave: () => void
}

export function DrawingToolbar({
  tool,
  color,
  brushSize,
  canUndo,
  canRedo,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
}: DrawingToolbarProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
      <ToolButton
        active={tool === 'brush'}
        onClick={() => onToolChange('brush')}
        title="Brush"
      >
        ✏️
      </ToolButton>
      <ToolButton
        active={tool === 'eraser'}
        onClick={() => onToolChange('eraser')}
        title="Eraser"
      >
        🧹
      </ToolButton>

      <div className="mx-1 h-6 w-px bg-[var(--color-border)]" />

      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border-none bg-transparent"
        title="Color"
      />

      <input
        type="range"
        min={2}
        max={24}
        value={brushSize}
        onChange={(e) => onBrushSizeChange(Number(e.target.value))}
        className="w-20 accent-[var(--color-accent)]"
        title="Brush size"
      />

      <div className="mx-1 h-6 w-px bg-[var(--color-border)]" />

      <ToolButton disabled={!canUndo} onClick={onUndo} title="Undo">
        ↩
      </ToolButton>
      <ToolButton disabled={!canRedo} onClick={onRedo} title="Redo">
        ↪
      </ToolButton>
      <ToolButton onClick={onClear} title="Clear">
        🗑
      </ToolButton>
      <ToolButton onClick={onSave} title="Save PNG">
        💾
      </ToolButton>
    </div>
  )
}

function ToolButton({
  children,
  active,
  disabled,
  onClick,
  title,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={[
        'flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors',
        active
          ? 'bg-[var(--color-accent)] text-white'
          : 'hover:bg-[var(--color-border)]',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
