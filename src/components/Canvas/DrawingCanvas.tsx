import { useEffect, useRef } from 'react'
import type { Stroke } from '@/models/Stroke'
import { CanvasService } from '@/services/CanvasService'

interface DrawingCanvasProps {
  strokes: Stroke[]
  width: number
  height: number
}

export function DrawingCanvas({ strokes, width, height }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const serviceRef = useRef<CanvasService | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!serviceRef.current) {
      serviceRef.current = new CanvasService(canvas)
    }

    serviceRef.current.resize(width, height)
    serviceRef.current.renderStrokes(strokes)
  }, [strokes, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pointer-events-none absolute inset-0"
    />
  )
}
