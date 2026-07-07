import { useEffect, useRef } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import type { VideoCoverLayout } from '@/utils/videoLayout'
import { normalizedToContainer } from '@/utils/videoLayout'

interface LandmarkRendererProps {
  landmarks: NormalizedLandmark[] | null
  layout: VideoCoverLayout
  mirrored?: boolean
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

      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }

    for (const lm of landmarks) {
      const p = toPixel(lm)
      ctx.fillStyle = '#818cf8'
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [landmarks, layout, mirrored, containerWidth, containerHeight])

  return (
    <canvas
      ref={canvasRef}
      width={containerWidth}
      height={containerHeight}
      className="pointer-events-none absolute inset-0"
    />
  )
}
