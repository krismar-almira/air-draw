import type { Point } from '@/models/Point'
import { lerpPoint } from './geometry'

export function smoothPoints(
  points: Point[],
  factor = 0.4,
): Point[] {
  if (points.length < 2) return points

  const smoothed: Point[] = [points[0]!]

  for (let i = 1; i < points.length; i++) {
    const prev = smoothed[smoothed.length - 1]!
    const current = points[i]!
    smoothed.push(lerpPoint(prev, current, factor))
  }

  return smoothed
}

export function movingAverage(points: Point[], windowSize = 3): Point[] {
  if (points.length <= windowSize) return points

  return points.map((_, index) => {
    const start = Math.max(0, index - Math.floor(windowSize / 2))
    const end = Math.min(points.length, start + windowSize)
    const slice = points.slice(start, end)

    const x = slice.reduce((sum, p) => sum + p.x, 0) / slice.length
    const y = slice.reduce((sum, p) => sum + p.y, 0) / slice.length

    return { x, y }
  })
}
