import type { Stroke } from './Stroke'

export interface Drawing {
  id: string
  name: string
  strokes: Stroke[]
  createdAt: number
  updatedAt: number
  width: number
  height: number
}

export function createDrawing(
  name: string,
  width: number,
  height: number,
): Drawing {
  const now = Date.now()
  return {
    id: crypto.randomUUID(),
    name,
    strokes: [],
    createdAt: now,
    updatedAt: now,
    width,
    height,
  }
}
