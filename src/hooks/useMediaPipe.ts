import { useCallback, useEffect, useRef, useState } from 'react'
import type { HandLandmarkerResult } from '@mediapipe/tasks-vision'
import { HandTrackingService } from '@/services/HandTrackingService'

export function useMediaPipe(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const serviceRef = useRef<HandTrackingService | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<HandLandmarkerResult | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const service = new HandTrackingService()
    serviceRef.current = service

    service
      .initialize()
      .then(() => setIsLoading(false))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load MediaPipe')
        setIsLoading(false)
      })

    return () => {
      cancelAnimationFrame(rafRef.current)
      service.close()
    }
  }, [])

  const startDetection = useCallback(() => {
    const detect = () => {
      const video = videoRef.current
      const service = serviceRef.current
      if (video && service?.isReady()) {
        const detection = service.detectForVideo(video, performance.now())
        setResult(detection)
      }
      rafRef.current = requestAnimationFrame(detect)
    }

    rafRef.current = requestAnimationFrame(detect)
  }, [videoRef])

  const stopDetection = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
  }, [])

  return { isLoading, error, result, startDetection, stopDetection }
}
