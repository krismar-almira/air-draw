import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import {
  VIRTUAL_MOUSE_CALIBRATION_FRAMES,
  VIRTUAL_MOUSE_TAP_THRESHOLD,
} from '@/config/constants'

const FINGERS = {
  index: { tip: 8, mcp: 5 },
  middle: { tip: 12, mcp: 9 },
} as const

export type VirtualMouseFinger = keyof typeof FINGERS

/** Calibrated rest pose for each fingertip (flat on table). */
export interface VirtualMouseCalibration {
  indexRestZ: number
  middleRestZ: number
  indexRestY: number
  middleRestY: number
  tapThreshold: number
  isReady: boolean
}

export interface FingerTapMetrics {
  indexTap: number
  middleTap: number
  indexUp: boolean
  middleUp: boolean
}

function readTip(landmarks: NormalizedLandmark[], finger: VirtualMouseFinger) {
  return landmarks[FINGERS[finger].tip]
}

/**
 * Tap lift = how far the fingertip moved off the calibrated rest pose.
 * Uses Z (toward camera) and Y — not tip-to-MCP XY, which stays large when flat.
 */
export function measureFingerTapLift(
  landmarks: NormalizedLandmark[],
  finger: VirtualMouseFinger,
  calibration: VirtualMouseCalibration,
): number {
  const tip = readTip(landmarks, finger)
  if (!tip) return 0

  const restZ = finger === 'index' ? calibration.indexRestZ : calibration.middleRestZ
  const restY = finger === 'index' ? calibration.indexRestY : calibration.middleRestY

  // MediaPipe: smaller z = closer to camera (finger lifting off table).
  const zLift = Math.max(0, restZ - (tip.z ?? 0))
  const yLift = Math.abs((tip.y ?? 0) - restY)

  return zLift * 3 + yLift * 1.5
}

export function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function buildCalibration(
  indexZ: number[],
  middleZ: number[],
  indexY: number[],
  middleY: number[],
): VirtualMouseCalibration {
  const indexRestZ = average(indexZ)
  const middleRestZ = average(middleZ)
  const indexRestY = average(indexY)
  const middleRestY = average(middleY)

  return {
    indexRestZ,
    middleRestZ,
    indexRestY,
    middleRestY,
    tapThreshold: VIRTUAL_MOUSE_TAP_THRESHOLD,
    isReady: true,
  }
}

export function detectFingerTapMetrics(
  landmarks: NormalizedLandmark[],
  calibration: VirtualMouseCalibration,
  prev: { indexUp: boolean; middleUp: boolean },
): FingerTapMetrics {
  const indexTap = measureFingerTapLift(landmarks, 'index', calibration)
  const middleTap = measureFingerTapLift(landmarks, 'middle', calibration)
  const threshold = calibration.tapThreshold

  const indexUp = prev.indexUp
    ? indexTap > threshold * 0.45
    : indexTap > threshold
  const middleUp = prev.middleUp
    ? middleTap > threshold * 0.45
    : middleTap > threshold

  return { indexTap, middleTap, indexUp, middleUp }
}

export function createCalibrationSampler(requiredFrames = VIRTUAL_MOUSE_CALIBRATION_FRAMES) {
  const indexZ: number[] = []
  const middleZ: number[] = []
  const indexY: number[] = []
  const middleY: number[] = []

  return {
    addSample(landmarks: NormalizedLandmark[]) {
      const indexTip = readTip(landmarks, 'index')
      const middleTip = readTip(landmarks, 'middle')
      if (indexTip) {
        indexZ.push(indexTip.z ?? 0)
        indexY.push(indexTip.y)
      }
      if (middleTip) {
        middleZ.push(middleTip.z ?? 0)
        middleY.push(middleTip.y)
      }
      return indexZ.length
    },
    isComplete() {
      return indexZ.length >= requiredFrames
    },
    finish(): VirtualMouseCalibration {
      return buildCalibration(indexZ, middleZ, indexY, middleY)
    },
    reset() {
      indexZ.length = 0
      middleZ.length = 0
      indexY.length = 0
      middleY.length = 0
    },
    progress() {
      return Math.min(indexZ.length / requiredFrames, 1)
    },
  }
}

export interface TapClickDetector {
  update: (
    indexTap: number,
    middleTap: number,
    indexUp: boolean,
    middleUp: boolean,
    threshold: number,
  ) => 'left' | 'right' | null
  reset: () => void
}

/** Fire click on falling edge after a clear tap peak; pick dominant finger. */
export function createTapClickDetector(): TapClickDetector {
  let indexPeak = 0
  let middlePeak = 0
  let indexWasUp = false
  let middleWasUp = false

  return {
    update(indexTap, middleTap, indexUp, middleUp, threshold) {
      let click: 'left' | 'right' | null = null
      const minPeak = threshold * 0.75

      if (indexUp) {
        indexWasUp = true
        indexPeak = Math.max(indexPeak, indexTap)
      } else if (indexWasUp) {
        if (indexPeak >= minPeak && indexPeak >= middlePeak) click = 'left'
        indexWasUp = false
        indexPeak = 0
      }

      if (middleUp) {
        middleWasUp = true
        middlePeak = Math.max(middlePeak, middleTap)
      } else if (middleWasUp) {
        if (!click && middlePeak >= minPeak && middlePeak > indexPeak) click = 'right'
        middleWasUp = false
        middlePeak = 0
      }

      return click
    },
    reset() {
      indexPeak = 0
      middlePeak = 0
      indexWasUp = false
      middleWasUp = false
    },
  }
}

/** Preview lift during calibration (before threshold exists). */
export function measureFingerTapLiftRaw(
  landmarks: NormalizedLandmark[],
  finger: VirtualMouseFinger,
  restZ: number,
  restY: number,
): number {
  const tip = readTip(landmarks, finger)
  if (!tip) return 0
  const zLift = Math.max(0, restZ - (tip.z ?? 0))
  const yLift = Math.abs((tip.y ?? 0) - restY)
  return zLift * 3 + yLift * 1.5
}
