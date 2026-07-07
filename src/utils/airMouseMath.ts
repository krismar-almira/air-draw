import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { getPalmCenter } from '@/utils/virtualMouseMath'
import {
  detectFingerTapMetrics,
  type VirtualMouseCalibration,
} from '@/utils/virtualMouseCalibration'

export type AirMouseAction = 'move' | 'leftClick' | 'rightClick' | 'none'

export interface AirMouseFrame {
  action: AirMouseAction
  palm: { x: number; y: number } | null
  isIndexUp: boolean
  isMiddleUp: boolean
  indexLift: number
  middleLift: number
}

export interface AirMousePrevState {
  indexUp: boolean
  middleUp: boolean
}

export function detectAirMouseFrame(
  landmarks: NormalizedLandmark[] | null,
  prev: AirMousePrevState,
  calibration: VirtualMouseCalibration | null,
): AirMouseFrame {
  if (!landmarks || !calibration?.isReady) {
    return {
      action: 'none',
      palm: null,
      isIndexUp: false,
      isMiddleUp: false,
      indexLift: 0,
      middleLift: 0,
    }
  }

  const { indexTap, middleTap, indexUp, middleUp } = detectFingerTapMetrics(
    landmarks,
    calibration,
    prev,
  )

  const palm = getPalmCenter(landmarks)
  const action: AirMouseAction = palm ? 'move' : 'none'

  return {
    action,
    palm,
    isIndexUp: indexUp,
    isMiddleUp: middleUp,
    indexLift: indexTap,
    middleLift: middleTap,
  }
}
