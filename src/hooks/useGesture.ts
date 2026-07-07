import { useCallback, useRef, useState } from 'react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { gestureDetector } from '@/components/HandTracking/GestureDetector'
import {
  GESTURE_DEBOUNCE_MS,
  GESTURE_DRAW_DEBOUNCE_MS,
} from '@/config/constants'
import type { Command, Gesture, GestureType } from '@/models/Gesture'

interface CandidateGesture {
  type: GestureType
  since: number
  confidence: number
  position?: { x: number; y: number }
}

function debounceFor(type: GestureType): number {
  return type === 'draw' || type === 'erase'
    ? GESTURE_DRAW_DEBOUNCE_MS
    : GESTURE_DEBOUNCE_MS
}

export function useGesture() {
  const [rawGesture, setRawGesture] = useState<Gesture>({
    type: 'none',
    confidence: 0,
  })
  const [stableGesture, setStableGesture] = useState<Gesture>({
    type: 'none',
    confidence: 0,
  })
  const [pendingGesture, setPendingGesture] = useState<GestureType | null>(null)

  const candidateRef = useRef<CandidateGesture>({
    type: 'none',
    since: 0,
    confidence: 0,
  })
  const stableTypeRef = useRef<GestureType>('none')
  const stablePositionRef = useRef<{ x: number; y: number } | undefined>(
    undefined,
  )

  const resetGestures = useCallback(() => {
    candidateRef.current = { type: 'none', since: 0, confidence: 0 }
    stableTypeRef.current = 'none'
    stablePositionRef.current = undefined
    setRawGesture({ type: 'none', confidence: 0 })
    setStableGesture({ type: 'none', confidence: 0 })
    setPendingGesture(null)
  }, [])

  const processLandmarks = useCallback(
    (landmarks: NormalizedLandmark[] | null): Command | null => {
      if (!landmarks) {
        resetGestures()
        return null
      }

      const now = performance.now()
      const { gesture: detected, command } =
        gestureDetector.detectFromLandmarks(landmarks)

      setRawGesture(detected)

      const candidate = candidateRef.current
      if (detected.type !== candidate.type) {
        candidateRef.current = {
          type: detected.type,
          since: now,
          confidence: detected.confidence,
          position: command.position,
        }
        setPendingGesture(
          detected.type !== stableTypeRef.current ? detected.type : null,
        )
      } else {
        candidate.confidence = detected.confidence
        candidate.position = command.position
      }

      const heldMs = now - candidateRef.current.since
      const requiredMs = debounceFor(candidateRef.current.type)

      if (
        heldMs >= requiredMs &&
        candidateRef.current.type !== stableTypeRef.current
      ) {
        stableTypeRef.current = candidateRef.current.type
        stablePositionRef.current = command.position
        setStableGesture({
          type: stableTypeRef.current,
          confidence: candidateRef.current.confidence,
          position: command.position,
        })
        setPendingGesture(null)
      } else if (candidateRef.current.type === stableTypeRef.current) {
        stablePositionRef.current = command.position
        setStableGesture({
          type: stableTypeRef.current,
          confidence: detected.confidence,
          position: command.position,
        })
        setPendingGesture(null)
      }

      return {
        type: stableTypeRef.current,
        detectedType: detected.type,
        timestamp: command.timestamp,
        position: command.position,
      }
    },
    [resetGestures],
  )

  return {
    rawGesture,
    gesture: stableGesture,
    pendingGesture,
    processLandmarks,
  }
}
