import { useEffect, useRef } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import type { VideoCoverLayout } from '@/utils/videoLayout'
import { normalizedToContainer } from '@/utils/videoLayout'

interface LandmarkRendererProps {
  landmarks: NormalizedLandmark[] | null
  layout: VideoCoverLayout
  mirrored?: boolean
  pinchActive?: boolean
}

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
]

export function LandmarkRenderer({
  landmarks,
  layout,
  mirrored = true,
  pinchActive = false,
}: LandmarkRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { containerWidth, containerHeight } = layout

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, containerWidth, containerHeight)

    if (!landmarks) return

    const toPixel = (lm: NormalizedLandmark) =>
      normalizedToContainer(lm.x, lm.y, layout, mirrored)

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)'
    ctx.lineWidth = 2

    for (const [a, b] of CONNECTIONS) {
      const start = landmarks[a]
      const end = landmarks[b]
      if (!start || !end) continue

      const p1 = toPixel(start)
      const p2 = toPixel(end)
      const isPinchLine = pinchActive && ((a === 4 && b === 8) || (a === 8 && b === 4))

      ctx.strokeStyle = isPinchLine ? 'rgba(34, 197, 94, 0.9)' : 'rgba(99, 102, 241, 0.6)'
      ctx.lineWidth = isPinchLine ? 3 : 2

      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    landmarks.forEach((lm, index) => {
      const p = toPixel(lm)
      const isPinchTip = pinchActive && (index === 4 || index === 8)
      ctx.fillStyle = isPinchTip ? '#22c55e' : '#818cf8'
      ctx.beginPath()
      ctx.arc(p.x, p.y, isPinchTip ? 6 : 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [landmarks, layout, mirrored, pinchActive, containerWidth, containerHeight])

  return (
    <canvas
      ref={canvasRef}
      width={containerWidth}
      height={containerHeight}
      className="pointer-events-none absolute inset-0"
    />
  )
}
