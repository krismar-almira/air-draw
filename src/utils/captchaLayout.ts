import type { VideoCoverLayout } from '@/utils/videoLayout'
import { normalizedToContainer } from '@/utils/videoLayout'

export const OBJECT_SIZE = 80
export const SNAP_DISTANCE = 48
export const GRAB_DISTANCE = 110

export function createScreenLayout(
  width: number,
  height: number,
): { piece: { x: number; y: number }; target: { x: number; y: number } } {
  return {
    // Left area — hand stays fully in frame when grabbing
    piece: {
      x: width * 0.22,
      y: height * (0.38 + Math.random() * 0.24),
    },
    // Center-right, not the far edge — avoids hand clipping when delivering
    target: {
      x: width * (0.52 + Math.random() * 0.14),
      y: height * (0.32 + Math.random() * 0.36),
    },
  }
}

export function isAtTarget(
  pos: { x: number; y: number },
  target: { x: number; y: number },
): boolean {
  return Math.hypot(pos.x - target.x, pos.y - target.y) <= SNAP_DISTANCE
}

/** Map normalized pinch coords to on-screen pixels (matches mirrored camera). */
export function mapPinchToScreen(
  x: number,
  y: number,
  layout: VideoCoverLayout,
): { x: number; y: number } {
  return normalizedToContainer(x, y, layout, true)
}

export function isNearPoint(
  a: { x: number; y: number },
  b: { x: number; y: number },
  radius: number,
): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) <= radius
}
