import type { DryLeafState, GarbageBinLayout } from '@/utils/captchaLeafLayout'
import { LEAF_COUNT } from '@/utils/captchaLeafLayout'
import { DryLeaf } from '@/components/PinchCaptcha/DryLeaf'
import { GarbageBin } from '@/components/PinchCaptcha/GarbageBin'
import { CaptchaSuccessEffect } from '@/components/PinchCaptcha/CaptchaSuccessEffect'
import './CaptchaOverlay.css'

interface LeafCaptchaOverlayProps {
  leaves: DryLeafState[]
  bin: GarbageBinLayout
  activeLeafId: number | null
  dragPos: { x: number; y: number } | null
  isDragging: boolean
  isPinching: boolean
  pinchPos: { x: number; y: number } | null
  binHighlight: boolean
  solved: boolean
  collectedCount: number
}

function centeredPos(x: number, y: number) {
  return { left: x, top: y, transform: 'translate(-50%, -50%)' }
}

const LEAF_ITEM = {
  emoji: '🍂',
  label: 'Dry leaves',
  gradient: 'from-amber-700 to-yellow-900',
}

export function LeafCaptchaOverlay({
  leaves,
  bin,
  activeLeafId,
  dragPos,
  isDragging,
  isPinching,
  pinchPos,
  binHighlight,
  solved,
  collectedCount,
}: LeafCaptchaOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        className="absolute"
        style={centeredPos(bin.x, bin.y)}
      >
        <GarbageBin width={bin.width} height={bin.height} highlight={binHighlight} />
      </div>

      {leaves.map((leaf) => {
        if (leaf.collected) return null
        const isActive =
          activeLeafId === leaf.id && isDragging && dragPos !== null
        const pos = isActive ? dragPos! : { x: leaf.x, y: leaf.y }

        return (
          <div
            key={leaf.id}
            className={[
              'absolute',
              isActive ? 'captcha-object--dragging z-30' : 'captcha-object--idle z-10',
            ].join(' ')}
            style={{
              ...centeredPos(pos.x, pos.y),
              transition: isActive ? 'none' : 'transform 0.15s',
            }}
          >
            <DryLeaf
              id={leaf.id}
              variant={leaf.variant}
              rotation={isActive ? leaf.rotation + 8 : leaf.rotation}
              dragging={isActive}
            />
          </div>
        )
      })}

      <div
        className="absolute right-4 top-20 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs font-medium text-amber-100 backdrop-blur-sm"
      >
        🍂 {collectedCount}/{LEAF_COUNT} leaves
      </div>

      {isPinching && pinchPos && !isDragging && (
        <div
          className="absolute z-30 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-400 bg-black/40 text-sm backdrop-blur-sm"
          style={centeredPos(pinchPos.x, pinchPos.y)}
        >
          🤏
        </div>
      )}

      {solved && (
        <CaptchaSuccessEffect
          item={LEAF_ITEM}
          mode="garbage"
          message="All dry leaves collected — yard cleaned! 🍂"
        />
      )}
    </div>
  )
}
