import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  detectFingerStates,
  fingerStateToGesture,
  getIndexFingerTip,
  getPinchDistanceFromLandmarks,
} from '@/utils/gestureMath'
import type { Command, FingerState, Gesture } from '@/models/Gesture'

export class GestureDetector {
  detectFromLandmarks(landmarks: NormalizedLandmark[]): {
    fingers: FingerState
    gesture: Gesture
    command: Command
  } {
    const pinchDistance = getPinchDistanceFromLandmarks(landmarks)
    const fingers = detectFingerStates(landmarks)
    const gesture = fingerStateToGesture(fingers, pinchDistance)
    const position = getIndexFingerTip(landmarks)

    const command: Command = {
      type: gesture.type,
      detectedType: gesture.type,
      timestamp: Date.now(),
      position,
    }

    return { fingers, gesture, command }
  }
}

export const gestureDetector = new GestureDetector()
