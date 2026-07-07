import type { Point } from '@/models/Point'
import type { Stroke } from '@/models/Stroke'
import { movingAverage } from '@/utils/smoothing'

export class CanvasService {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get 2D canvas context')
    this.ctx = ctx
  }

  resize(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  renderStrokes(strokes: Stroke[]): void {
    this.clear()

    for (const stroke of strokes) {
      this.drawStroke(stroke)
    }
  }

  drawStroke(stroke: Stroke): void {
    if (stroke.points.length < 2) return

    const points = movingAverage(stroke.points, 3)
    const ctx = this.ctx

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = stroke.size

    if (stroke.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = stroke.color
    }

    ctx.beginPath()
    ctx.moveTo(points[0]!.x, points[0]!.y)

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i]!.x, points[i]!.y)
    }

    ctx.stroke()
    ctx.restore()
  }

  drawPreviewPoint(point: Point, color: string, size: number): void {
    this.ctx.save()
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(point.x, point.y, size / 2, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas
  }
}
