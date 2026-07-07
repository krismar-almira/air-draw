import { useCallback, useRef, useState } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { VIRTUAL_MOUSE_CLICK_COOLDOWN_MS } from '@/config/constants'
import { detectAirMouseFrame, type AirMouseAction } from '@/utils/airMouseMath'
import { createVirtualCursorTracker } from '@/utils/virtualMouseMath'
import {
  createCalibrationSampler,
  createTapClickDetector,
  measureFingerTapLiftRaw,
  type VirtualMouseCalibration,
} from '@/utils/virtualMouseCalibration'

export type CalibrationStatus = 'idle' | 'sampling' | 'ready'

export interface AirMouseState {
  cursor: { x: number; y: number } | null
  action: AirMouseAction
  isIndexUp: boolean
  isMiddleUp: boolean
  indexLift: number
  middleLift: number
  lastClick: 'left' | 'right' | null
  calibrationStatus: CalibrationStatus
  calibrationProgress: number
  calibration: VirtualMouseCalibration | null
}

export function useAirMouse() {
  const indexUpRef = useRef(false)
  const middleUpRef = useRef(false)
  const lastClickAtRef = useRef(0)
  const cursorTrackerRef = useRef(createVirtualCursorTracker())
  const tapDetectorRef = useRef(createTapClickDetector())
  const calibrationRef = useRef<VirtualMouseCalibration | null>(null)
  const calibrationStatusRef = useRef<CalibrationStatus>('idle')
  const samplerRef = useRef(createCalibrationSampler())
  const previewRestRef = useRef({ indexZ: 0, middleZ: 0, indexY: 0, middleY: 0 })
  const [state, setState] = useState<AirMouseState>({
    cursor: null,
    action: 'none',
    isIndexUp: false,
    isMiddleUp: false,
    indexLift: 0,
    middleLift: 0,
    lastClick: null,
    calibrationStatus: 'idle',
    calibrationProgress: 0,
    calibration: null,
  })

  const startCalibration = useCallback(() => {
    samplerRef.current.reset()
    calibrationRef.current = null
    calibrationStatusRef.current = 'sampling'
    indexUpRef.current = false
    middleUpRef.current = false
    tapDetectorRef.current.reset()
    cursorTrackerRef.current.reset()
    setState((prev) => ({
      ...prev,
      cursor: null,
      action: 'none',
      calibrationStatus: 'sampling',
      calibrationProgress: 0,
      calibration: null,
      isIndexUp: false,
      isMiddleUp: false,
      indexLift: 0,
      middleLift: 0,
      lastClick: null,
    }))
  }, [])

  const processLandmarks = useCallback((landmarks: NormalizedLandmark[] | null) => {
    if (!landmarks) {
      return {
        action: 'none' as AirMouseAction,
        palm: null,
        isIndexUp: false,
        isMiddleUp: false,
        indexLift: 0,
        middleLift: 0,
        cursor: cursorTrackerRef.current.update(null),
        lastClick: null as 'left' | 'right' | null,
      }
    }

    if (calibrationStatusRef.current === 'sampling') {
      samplerRef.current.addSample(landmarks)
      const progress = samplerRef.current.progress()

      const indexTip = landmarks[8]
      const middleTip = landmarks[12]
      if (indexTip && samplerRef.current.progress() > 0) {
        previewRestRef.current.indexZ = indexTip.z ?? 0
        previewRestRef.current.indexY = indexTip.y
      }
      if (middleTip) {
        previewRestRef.current.middleZ = middleTip.z ?? 0
        previewRestRef.current.middleY = middleTip.y
      }

      const { indexZ, middleZ, indexY, middleY } = previewRestRef.current
      const indexLift = measureFingerTapLiftRaw(landmarks, 'index', indexZ, indexY)
      const middleLift = measureFingerTapLiftRaw(landmarks, 'middle', middleZ, middleY)

      if (samplerRef.current.isComplete()) {
        const calibration = samplerRef.current.finish()
        calibrationRef.current = calibration
        calibrationStatusRef.current = 'ready'
        tapDetectorRef.current.reset()
        setState((prev) => ({
          ...prev,
          calibrationStatus: 'ready',
          calibrationProgress: 1,
          calibration,
          indexLift,
          middleLift,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          calibrationProgress: progress,
          indexLift,
          middleLift,
        }))
      }

      return {
        action: 'none' as AirMouseAction,
        palm: null,
        isIndexUp: false,
        isMiddleUp: false,
        indexLift,
        middleLift,
        cursor: null,
        lastClick: null,
      }
    }

    const frame = detectAirMouseFrame(
      landmarks,
      {
        indexUp: indexUpRef.current,
        middleUp: middleUpRef.current,
      },
      calibrationRef.current,
    )

    let lastClick: 'left' | 'right' | null = null
    let action = frame.action

    const tapClick = tapDetectorRef.current.update(
      frame.indexLift,
      frame.middleLift,
      frame.isIndexUp,
      frame.isMiddleUp,
      calibrationRef.current?.tapThreshold ?? 0.008,
    )

    const now = performance.now()
    if (tapClick && now - lastClickAtRef.current >= VIRTUAL_MOUSE_CLICK_COOLDOWN_MS) {
      lastClick = tapClick
      action = tapClick === 'left' ? 'leftClick' : 'rightClick'
      lastClickAtRef.current = now
    }

    indexUpRef.current = frame.isIndexUp
    middleUpRef.current = frame.isMiddleUp

    const cursor = cursorTrackerRef.current.update(frame.palm)

    setState((prev) => ({
      ...prev,
      cursor,
      action,
      isIndexUp: frame.isIndexUp,
      isMiddleUp: frame.isMiddleUp,
      indexLift: frame.indexLift,
      middleLift: frame.middleLift,
      lastClick,
    }))

    return { ...frame, cursor, action, lastClick }
  }, [])

  const reset = useCallback(() => {
    cursorTrackerRef.current.reset()
    setState((prev) => ({
      ...prev,
      cursor: null,
      action: 'none',
      lastClick: null,
    }))
  }, [])

  const resetTracking = useCallback(() => {
    indexUpRef.current = false
    middleUpRef.current = false
    tapDetectorRef.current.reset()
  }, [])

  return { ...state, processLandmarks, reset, resetTracking, startCalibration }
}
