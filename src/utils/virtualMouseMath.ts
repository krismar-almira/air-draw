import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { VIRTUAL_MOUSE_MOVE_GAIN } from '@/config/constants'

/** Wrist + finger MCP joints — stable palm center for a flat hand on a surface */
const PALM_LANDMARKS = [0, 5, 9, 13, 17] as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function getPalmCenter(
  landmarks: NormalizedLandmark[],
): { x: number; y: number } | null {
  let x = 0
  let y = 0
  let count = 0

  for (const index of PALM_LANDMARKS) {
    const point = landmarks[index]
    if (!point) continue
    x += point.x
    y += point.y
    count += 1
  }

  if (count === 0) return null
  return { x: x / count, y: y / count }
}

export interface VirtualCursorTracker {
  update: (palm: { x: number; y: number } | null) => { x: number; y: number } | null
  reset: () => void
}

/** Integrates palm deltas into cursor position (mirrored X, inverted Y, amplified). */
export function createVirtualCursorTracker(
  gain = VIRTUAL_MOUSE_MOVE_GAIN,
): VirtualCursorTracker {
  let cursor = { x: 0.5, y: 0.5 }
  let lastPalm: { x: number; y: number } | null = null
  let active = false

  return {
    update(palm) {
      if (!palm) {
        lastPalm = null
        return active ? { ...cursor } : null
      }

      if (!lastPalm) {
        lastPalm = { x: palm.x, y: palm.y }
        active = true
        return { ...cursor }
      }

      const dx = palm.x - lastPalm.x
      const dy = palm.y - lastPalm.y
      lastPalm = { x: palm.x, y: palm.y }

      cursor = {
        x: clamp(cursor.x - dx * gain, 0, 1),
        y: clamp(cursor.y - dy * gain, 0, 1),
      }

      return { ...cursor }
    },
    reset() {
      cursor = { x: 0.5, y: 0.5 }
      lastPalm = null
      active = false
    },
  }
}

/** Map normalized cursor coords (0–1) to surface pixels */
export function mapHandToSurface(
  x: number,
  y: number,
  width: number,
  height: number,
): { x: number; y: number } {
  return {
    x: clamp(x * width, 0, width),
    y: clamp(y * height, 0, height),
  }
}
