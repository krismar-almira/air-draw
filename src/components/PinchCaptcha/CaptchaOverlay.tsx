import type { CaptchaItem } from '@/models/CaptchaItem'
import { OBJECT_SIZE } from '@/utils/captchaLayout'
import { CaptchaSuccessEffect } from '@/components/PinchCaptcha/CaptchaSuccessEffect'
import './CaptchaOverlay.css'

interface CaptchaOverlayProps {
  piecePos: { x: number; y: number }
  targetPos: { x: number; y: number }
  pinchPos: { x: number; y: number } | null
  isPinching: boolean
  isDragging: boolean
  solved: boolean
  item: CaptchaItem
}

function centeredPos(x: number, y: number) {
  return { left: x, top: y }
}

export function CaptchaOverlay({
  piecePos,
  targetPos,
  pinchPos,
  isPinching,
  isDragging,
  solved,
  item,
}: CaptchaOverlayProps) {
  const displayPiece = isDragging && pinchPos ? pinchPos : piecePos
  const size = OBJECT_SIZE

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        className={[
          'captcha-target--open absolute flex flex-col items-center justify-center rounded-2xl border-2 border-dashed backdrop-blur-sm',
          solved
            ? 'border-green-400 bg-green-400/25'
            : 'border-white/70 bg-white/10',
        ].join(' ')}
        style={{
          width: size + 8,
          height: size + 8,
          ...centeredPos(targetPos.x, targetPos.y),
          transform: 'translate(-50%, -50%)',
        }}
      >
        <span className="text-3xl opacity-40">{item.emoji}</span>
      </div>

      <div
        className={[
          'absolute flex items-center justify-center rounded-2xl border-2 border-white/90 shadow-xl',
          `bg-gradient-to-br ${item.gradient}`,
          isDragging ? 'captcha-object--dragging' : 'captcha-object--idle',
          solved ? 'captcha-object--solved border-green-300' : '',
        ].join(' ')}
        style={{
          width: size,
          height: size,
          ...centeredPos(displayPiece.x, displayPiece.y),
          transform: 'translate(-50%, -50%)',
          transition: isDragging ? 'none' : 'box-shadow 0.2s',
          boxShadow: isDragging
            ? '0 0 24px rgba(99, 102, 241, 0.6), 0 8px 32px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(0,0,0,0.25)',
        }}
      >
        <span
          className={[
            'select-none text-5xl drop-shadow-md',
            isDragging ? 'scale-110' : '',
          ].join(' ')}
          role="img"
          aria-label={item.label}
        >
          {item.emoji}
        </span>
        {isDragging && (
          <span className="absolute -right-1 -top-1 text-sm drop-shadow">💨</span>
        )}
      </div>

      {isPinching && pinchPos && !isDragging && (
        <div
          className="absolute flex items-center justify-center rounded-full border-2 border-green-400 bg-black/40 text-sm backdrop-blur-sm"
          style={{
            width: 32,
            height: 32,
            ...centeredPos(pinchPos.x, pinchPos.y),
            transform: 'translate(-50%, -50%)',
          }}
        >
          🤏
        </div>
      )}

      {solved && <CaptchaSuccessEffect item={item} mode="delivery" />}
    </div>
  )
}
