import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import type { FingerState, Gesture, GestureType } from '@/models/Gesture'
import { createDefaultFingerState } from '@/models/Gesture'

const FINGER_TIP = [4, 8, 12, 16, 20] as const
const FINGER_PIP = [3, 6, 10, 14, 18] as const

function isFingerExtended(
  landmarks: NormalizedLandmark[],
  tipIndex: number,
  pipIndex: number,
): boolean {
  const tip = landmarks[tipIndex]
  const pip = landmarks[pipIndex]
  const wrist = landmarks[0]
  if (!tip || !pip || !wrist) return false

  const tipDist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y)
  const pipDist = Math.hypot(pip.x - wrist.x, pip.y - wrist.y)
  return tipDist > pipDist * 1.1
}

export function detectFingerStates(
  landmarks: NormalizedLandmark[],
): FingerState {
  const state = createDefaultFingerState()

  state.thumbExtended = isFingerExtended(landmarks, FINGER_TIP[0], FINGER_PIP[0])
  state.indexExtended = isFingerExtended(landmarks, FINGER_TIP[1], FINGER_PIP[1])
  state.middleExtended = isFingerExtended(landmarks, FINGER_TIP[2], FINGER_PIP[2])
  state.ringExtended = isFingerExtended(landmarks, FINGER_TIP[3], FINGER_PIP[3])
  state.pinkyExtended = isFingerExtended(landmarks, FINGER_TIP[4], FINGER_PIP[4])

  const extendedCount = [
    state.indexExtended,
    state.middleExtended,
    state.ringExtended,
    state.pinkyExtended,
  ].filter(Boolean).length

  state.openPalm = extendedCount >= 4
  state.fist = extendedCount === 0

  const indexTip = landmarks[8]
  const thumbTip = landmarks[4]
  if (indexTip && thumbTip) {
    const pinchDist = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y)
    state.pinch = pinchDist < 0.05
  }

  return state
}

export function fingerStateToGesture(fingers: FingerState): Gesture {
  let type: GestureType = 'none'
  let confidence = 0.5

  if (fingers.pinch) {
    type = 'erase'
    confidence = 0.85
  } else if (fingers.indexExtended && !fingers.middleExtended) {
    type = 'draw'
    confidence = 0.9
  } else if (fingers.indexExtended && fingers.middleExtended && !fingers.ringExtended) {
    type = 'move'
    confidence = 0.8
  } else if (fingers.fist) {
    type = 'clear'
    confidence = 0.75
  }

  return { type, confidence }
}

export function getIndexFingerTip(
  landmarks: NormalizedLandmark[],
): { x: number; y: number } | undefined {
  const tip = landmarks[8]
  if (!tip) return undefined
  return { x: tip.x, y: tip.y }
}
