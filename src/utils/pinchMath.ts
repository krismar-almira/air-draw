import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { PINCH_THRESHOLD } from '@/config/constants'
import { getPinchDistanceFromLandmarks } from '@/utils/gestureMath'

export function getPinchCenter(
  landmarks: NormalizedLandmark[],
): { x: number; y: number } | null {
  const thumb = landmarks[4]
  const index = landmarks[8]
  if (!thumb || !index) return null
  return {
    x: (thumb.x + index.x) / 2,
    y: (thumb.y + index.y) / 2,
  }
}

export function isPinching(landmarks: NormalizedLandmark[] | null): boolean {
  if (!landmarks) return false
  return getPinchDistanceFromLandmarks(landmarks) < PINCH_THRESHOLD
}
