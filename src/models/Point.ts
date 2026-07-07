export interface Point {
  x: number
  y: number
}

export function createPoint(x: number, y: number): Point {
  return { x, y }
}

export function clonePoint(point: Point): Point {
  return { x: point.x, y: point.y }
}
