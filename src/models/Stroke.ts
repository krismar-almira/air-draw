import type { Point } from './Point'

export interface Stroke {
  id: string
  points: Point[]
  color: string
  size: number
  tool: 'brush' | 'eraser'
}

export function createStroke(
  color: string,
  size: number,
  tool: Stroke['tool'] = 'brush',
): Stroke {
  return {
    id: crypto.randomUUID(),
    points: [],
    color,
    size,
    tool,
  }
}
