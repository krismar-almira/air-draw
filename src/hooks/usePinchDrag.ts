import { useCallback, useRef, useState } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { getPinchCenter, isPinching } from '@/utils/pinchMath'

export interface PinchDragState {
  isPinching: boolean
  pinchCenter: { x: number; y: number } | null
  pinchStarted: boolean
  pinchEnded: boolean
}

export function usePinchDrag() {
  const wasPinchingRef = useRef(false)
  const [state, setState] = useState<PinchDragState>({
    isPinching: false,
    pinchCenter: null,
    pinchStarted: false,
    pinchEnded: false,
  })

  const processLandmarks = useCallback((landmarks: NormalizedLandmark[] | null) => {
    const pinching = isPinching(landmarks)
    const wasPinching = wasPinchingRef.current
    wasPinchingRef.current = pinching

    const center = pinching && landmarks ? getPinchCenter(landmarks) : null

    const frame: PinchDragState = {
      isPinching: pinching,
      pinchCenter: center,
      pinchStarted: pinching && !wasPinching,
      pinchEnded: !pinching && wasPinching,
    }

    setState(frame)
    return frame
  }, [])

  const reset = useCallback(() => {
    wasPinchingRef.current = false
    setState({
      isPinching: false,
      pinchCenter: null,
      pinchStarted: false,
      pinchEnded: false,
    })
  }, [])

  return { ...state, processLandmarks, reset }
}
